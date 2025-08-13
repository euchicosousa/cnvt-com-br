import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "~/components/Logo";

export default function PercentageCalculator() {
  const [valorInicial, setValorInicial] = useState("");
  const [valorFinal, setValorFinal] = useState("");
  const [porcentagem, setPorcentagem] = useState("");
  const [resultado, setResultado] = useState("");
  const [tipoCalculo, setTipoCalculo] = useState("");

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const parseNumber = (str: string) => {
    return parseFloat(str.replace(",", ".")) || 0;
  };

  const calcular = () => {
    const inicial = parseNumber(valorInicial);
    const final = parseNumber(valorFinal);
    const perc = parseNumber(porcentagem);

    // Caso 1: Tem inicial e final, calcular porcentagem
    if (valorInicial && valorFinal && !porcentagem) {
      if (inicial === 0) {
        setResultado("Valor inicial não pode ser zero");
        setTipoCalculo("");
        return;
      }

      const percentualCalculado = ((final - inicial) / inicial) * 100;
      const aumentoOuReducao = percentualCalculado >= 0 ? "aumento" : "redução";
      const valorAbsoluto = Math.abs(final - inicial);

      setResultado(
        `${aumentoOuReducao.toUpperCase()} de ${Math.abs(
          percentualCalculado
        ).toFixed(2)}%`
      );
      setTipoCalculo(`Variação absoluta: R$ ${formatNumber(valorAbsoluto)}`);
    }
    // Caso 2: Tem inicial e porcentagem, calcular final
    else if (valorInicial && porcentagem && !valorFinal) {
      const valorFinalCalculado = inicial * (1 + perc / 100);
      const diferenca = valorFinalCalculado - inicial;
      const tipoVariacao = perc >= 0 ? "após aumento" : "após redução";

      setResultado(`Valor final: R$ ${formatNumber(valorFinalCalculado)}`);
      setTipoCalculo(
        `Diferença: R$ ${formatNumber(
          Math.abs(diferenca)
        )} (${tipoVariacao} de ${Math.abs(perc)}%)`
      );
    }
    // Caso 3: Tem final e porcentagem, calcular inicial
    else if (valorFinal && porcentagem && !valorInicial) {
      if (perc === -100) {
        setResultado("Porcentagem não pode ser -100%");
        setTipoCalculo("");
        return;
      }

      const valorInicialCalculado = final / (1 + perc / 100);
      const diferenca = final - valorInicialCalculado;
      const tipoVariacao = perc >= 0 ? "aumento" : "redução";

      setResultado(`Valor inicial: R$ ${formatNumber(valorInicialCalculado)}`);
      setTipoCalculo(
        `Diferença: R$ ${formatNumber(
          Math.abs(diferenca)
        )} (${tipoVariacao} de ${Math.abs(perc)}%)`
      );
    } else {
      setResultado("Preencha exatamente 2 campos para calcular o terceiro");
      setTipoCalculo("");
    }
  };

  const limpar = () => {
    setValorInicial("");
    setValorFinal("");
    setPorcentagem("");
    setResultado("");
    setTipoCalculo("");
  };

  useEffect(() => {
    if (
      (valorInicial && valorFinal && !porcentagem) ||
      (valorInicial && porcentagem && !valorFinal) ||
      (valorFinal && porcentagem && !valorInicial)
    ) {
      calcular();
    } else if (!valorInicial && !valorFinal && !porcentagem) {
      setResultado("");
      setTipoCalculo("");
    } else {
      setResultado("Preencha exatamente 2 campos");
      setTipoCalculo("");
    }
  }, [valorInicial, valorFinal, porcentagem]);

  return (
    <div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex gap-4 items-center justify-between p-12 md:border-r border-b">
          <Link to={"/"}>
            <Logo className="size-8 md:size-12" />
          </Link>
          <div className="text-2xl font-medium uppercase tracking-widest">
            Calculadora de %
          </div>
        </div>
      </div>

      <div className="tabs h-full shrink-0 grow">
        <div className="flex-col">
          <div className="p-8">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
              <div className="w-full">
                <label className="block text-xl font-medium mb-4">
                  Valor Inicial (R$)
                </label>
                <input
                  type="text"
                  value={valorInicial}
                  onChange={(e) => setValorInicial(e.target.value)}
                  placeholder="Ex: 1000"
                  className="text-2xl bg-zinc-900 p-8 w-full outline-none focus:ring-2"
                />
              </div>

              <div className="flex justify-center p-8">
                <ArrowRight className="size-16" />
              </div>

              <div className="w-full">
                <label className="block text-xl font-medium mb-4">
                  Valor Final (R$)
                </label>
                <input
                  type="text"
                  value={valorFinal}
                  onChange={(e) => setValorFinal(e.target.value)}
                  placeholder="Ex: 1200"
                  className="text-2xl bg-zinc-900 p-8 w-full outline-none focus:ring-2"
                />
              </div>

              <div className="flex justify-center p-8">
                <TrendingUp className="size-16" />
              </div>

              <div className="w-full">
                <label className="block text-xl font-medium mb-4">
                  Porcentagem (%)
                </label>
                <input
                  type="text"
                  value={porcentagem}
                  onChange={(e) => setPorcentagem(e.target.value)}
                  placeholder="Ex: 20 ou -15"
                  className="text-2xl bg-zinc-900 p-8 w-full outline-none focus:ring-2"
                />
              </div>

              {(resultado || tipoCalculo) && (
                <div className="p-8 w-full font-medium items-center">
                  <div className="text-2xl font-medium mb-2">
                    {resultado || "Preencha 2 campos para calcular"}
                  </div>
                  {tipoCalculo && <div className="text-sm">{tipoCalculo}</div>}
                </div>
              )}
              <button
                onClick={limpar}
                className="p-8 text-xl font-medium border  hover:bg-zinc-100 transition-colors hover:text-zinc-950"
              >
                Limpar Tudo
              </button>
            </div>
            <div className="flex ">
              {/* <div className="p-8 text-xl font-medium border">
                <div className="text-xl mb-4">
                  <strong>Exemplos de uso:</strong>
                </div>
                <div className="space-y-2 text-xl">
                  <div>
                    • Inicial: 1000 + Final: 1200 = <span>+20%</span>
                  </div>
                  <div>
                    • Inicial: 1000 + Porcentagem: 20 = <span>Final: 1200</span>
                  </div>
                  <div>
                    • Final: 1200 + Porcentagem: 20 = <span>Inicial: 1000</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="font-medium tracking-wider p-12 text-xs border-t">
          ONDE PARCERIA VIRA RESULTADO
        </div>
      </div>
    </div>
  );
}
