import { useGSAP } from "@gsap/react";
import { ArrowRightIcon } from "lucide-react";
import { useRef } from "react";
import { Link, type MetaArgs } from "react-router";
import { Logo } from "~/components/Logo";

import { gsap } from "gsap";
import Copy from "~/components/Copy";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "CNVT® - Agência de Marketing 360º" }];
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.to(".logo", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <div className="md:grid flex flex-col justify-between h-full grow md:grid-cols-2">
        <div className="flex flex-col justify-between p-12 md:border-r">
          <div ref={containerRef}>
            <Logo
              className="logo size-24 md:size-48"
              style={{ transform: "translateY(100%)", opacity: 0 }}
            />
          </div>
          <div className="md:hidden mt-8 text-sm tracking-wide">
            <Copy delay={0.4} animateOnScroll={false}>
              <span>
                Não fazemos post que só enfeita feed, criamos estratégia que
                vende para com empreendedores que querem{" "}
                <span className="font-medium">Marcas Paradigma ®</span>, não
                mais uma opção na prateleira.
              </span>
            </Copy>
          </div>
          <div className="text-xl md:block hidden tracking-wide">
            <Copy delay={0.4} animateOnScroll={false}>
              <span>
                Pensamos no seu negócio como se fosse nosso. Não fazemos post
                que só enfeita feed, criamos estratégia que vende. Quando você
                conquista, comemoramos. Quando aperta, encontramos a saída
                juntos. Trabalhamos com empreendedores que querem{" "}
                <span className="font-medium">Marcas Paradigma ®</span>, não
                mais uma opção na prateleira.
              </span>
            </Copy>
          </div>
        </div>
        <div className="flex flex-col links divide-y">
          {[
            {
              title: "SOCIAL MEDIA",
              href: "https://form.respondi.app/tAaiKV53",
            },
            {
              title: "CONSULTORIA DE MARKETING",
              href: "https://form.respondi.app/tAaiKV53",
            },
            {
              title: "IDENTIDADE VISUAL",
              href: "https://form.respondi.app/tAaiKV53",
            },
            {
              title: "CNVT.LINK",
              href: "https://form.respondi.app/tAaiKV53",
            },
            {
              title: "FERRAMENTAS",
              href: "/ferramentas",
            },
          ].map((link, i) => (
            <Link to={link.href} key={i}>
              <span className="flex gap-12">
                <ArrowRightIcon className="size-12 shrink-0" />
                <Copy animateOnScroll={false} delay={0.1 * i + 0.4}>
                  <span>{link.title}</span>
                </Copy>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="font-medium tracking-wider flex p-12 text-xs border-t justify-between">
        <Copy animateOnScroll={false} delay={0.8}>
          <div>ONDE PARCERIA VIRA RESULTADO</div>
        </Copy>
        <Copy animateOnScroll={false} delay={1}>
          <div>CNVT © {new Date().getFullYear()}</div>
        </Copy>
      </div>
    </>
  );
}
