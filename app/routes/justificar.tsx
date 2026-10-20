import { useEffect, useMemo, useState } from "react";
import { CopyIcon } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "~/components/Logo";
import type { Route } from "./+types/justificar";

// Fonte usada para medir e para a prévia. Aproxima a fonte do sistema
// usada por Instagram, WhatsApp, LinkedIn etc. no iOS/Android.
const MEASURE_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

type Filler = "unicode" | "space" | "braille";
type Measure = "visual" | "chars";

// Caracteres "transparentes" usados para preencher os vãos entre palavras
const fillers: Record<Filler, { name: string; description: string; chars: string[] }> = {
  unicode: {
    name: "Espaços Unicode",
    description:
      "Combina espaços de larguras diferentes (eme, ene, fino, ultrafino). Mais preciso e não é removido pela maioria das redes.",
    chars: [" ", " ", " ", " ", " "],
  },
  space: {
    name: "Espaço comum",
    description:
      "Só espaços normais. Algumas plataformas juntam espaços repetidos em um só.",
    chars: [" "],
  },
  braille: {
    name: "Braille vazio",
    description:
      "Caractere invisível (U+2800) que quase nenhuma plataforma remove. Menos preciso.",
    chars: [" ", "⠀"],
  },
};

let canvasContext: CanvasRenderingContext2D | null = null;

function measureVisual(text: string) {
  if (!canvasContext) {
    canvasContext = document.createElement("canvas").getContext("2d");
    if (canvasContext) canvasContext.font = `100px ${MEASURE_FONT}`;
  }
  return canvasContext?.measureText(text).width ?? text.length;
}

function measureChars(text: string) {
  return Array.from(text).length;
}

// Preenche uma largura com a combinação de caracteres que mais se aproxima dela
function fillGap(
  width: number,
  units: { char: string; width: number }[]
): { text: string; width: number } {
  let text = "";
  let remaining = width;

  units.forEach((unit, i) => {
    const isLast = i === units.length - 1;
    const count = isLast
      ? Math.round(remaining / unit.width)
      : Math.floor(remaining / unit.width);
    if (count > 0) {
      text += unit.char.repeat(count);
      remaining -= count * unit.width;
    }
  });

  // Sempre deixa pelo menos um caractere entre as palavras
  if (!text) {
    const smallest = units[units.length - 1];
    return { text: smallest.char, width: smallest.width };
  }

  return { text, width: width - remaining };
}

function justify(
  input: string,
  filler: Filler,
  measureBy: Measure
) {
  const measure = measureBy === "visual" ? measureVisual : measureChars;
  const units = fillers[filler].chars
    .map((char) => ({ char, width: measure(char) }))
    .sort((a, b) => b.width - a.width);

  const lines = input
    .split("\n")
    .map((line) => line.trim().split(/\s+/).filter(Boolean));
  const targetWidth = Math.max(
    0,
    ...lines.map((words) => measure(words.join(" ")))
  );

  return lines
    .map((words) => {
      if (words.length < 2) {
        return words.join(" ");
      }

      const wordsWidth = words.reduce((sum, word) => sum + measure(word), 0);
      const gapWidth = (targetWidth - wordsWidth) / (words.length - 1);

      // Mira na posição ideal acumulada para o erro de arredondamento
      // não se acumular no último vão
      let result = words[0];
      let ideal = 0;
      let actual = 0;
      words.slice(1).forEach((word) => {
        ideal += gapWidth;
        const gap = fillGap(ideal - actual, units);
        actual += gap.width;
        result += gap.text + word;
      });
      return result;
    })
    .join("\n");
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Justificar texto | CNVT® - Agência de Marketing 360º" }];
}

export default function Justificar() {
  const [text, setText] = useState("");
  const [filler, setFiller] = useState<Filler>("unicode");
  const [measureBy, setMeasureBy] = useState<Measure>("visual");
  const [isClient, setIsClient] = useState(false);

  // A medição visual usa canvas, que só existe no navegador
  useEffect(() => setIsClient(true), []);

  const result = useMemo(
    () => (isClient && text.trim() ? justify(text, filler, measureBy) : ""),
    [isClient, text, filler, measureBy]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("Copiado!");
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const optionClass = (active: boolean) =>
    `p-4 md:p-6 text-lg font-medium border ${
      active ? "bg-zinc-100 text-zinc-950" : ""
    }`;

  return (
    <div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex gap-4 items-center justify-between p-8 md:p-12 md:border-r border-b">
          <Link to={"/"}>
            <Logo className="size-8 md:size-12" />
          </Link>
          <div className="text-2xl font-medium uppercase tracking-widest">
            Justificar texto
          </div>
        </div>
      </div>

      <div className="tabs h-full shrink-0 grow">
        <div className="p-8 flex flex-col gap-8">
          <div>
            <label className="block text-xl font-medium mb-4">
              Preencher com
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(fillers) as Filler[]).map((key) => (
                <button
                  key={key}
                  className={optionClass(filler === key)}
                  onClick={() => setFiller(key)}
                >
                  {fillers[key].name}
                </button>
              ))}
            </div>
            <div className="text-sm mt-2 opacity-70">
              {fillers[filler].description}
            </div>
          </div>

          <div>
            <label className="block text-xl font-medium mb-4">
              Alinhar por
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={optionClass(measureBy === "visual")}
                onClick={() => setMeasureBy("visual")}
              >
                Largura visual
              </button>
              <button
                className={optionClass(measureBy === "chars")}
                onClick={() => setMeasureBy("chars")}
              >
                Nº de caracteres
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <textarea
              value={text}
              rows={8}
              className="text-2xl bg-zinc-900 p-8 w-full outline-none focus:ring-2 resize-y"
              onChange={(e) => setText(e.target.value)}
              placeholder={"Seu texto aqui,\numa linha\npor vez"}
            />

            <div
              className="p-8 w-full text-2xl border flex justify-between gap-4 cursor-pointer"
              onClick={() => result && handleCopy()}
            >
              <div
                className="whitespace-pre overflow-x-auto"
                style={{
                  fontFamily:
                    measureBy === "visual" ? MEASURE_FONT : "monospace",
                }}
              >
                {result || (
                  <span className="opacity-50">O resultado aparece aqui</span>
                )}
              </div>
              <div>
                <CopyIcon className="size-8" />
              </div>
            </div>
          </div>

          <div className="text-sm opacity-70">
            O alinhamento é uma simulação: cada app usa uma fonte diferente, então
            o resultado pode variar um pouco. "Largura visual" mede na fonte do
            sistema (iOS/Android); "Nº de caracteres" iguala a quantidade de
            letras, ideal para fontes monoespaçadas.
          </div>
        </div>

        <div className="font-medium tracking-wider p-12 text-xs border-t">
          ONDE PARCERIA VIRA RESULTADO
        </div>
      </div>
    </div>
  );
}
