import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import React, { useRef, type JSX } from "react";

type SplitTextInstance = {
  lines: HTMLElement[];
  revert: () => void;
};

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
}: {
  children: JSX.Element;
  animateOnScroll?: boolean;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLElement[]>([]);
  const splitRef = useRef<SplitTextInstance[]>([]);
  const lines = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRef.current = [];
      elementRef.current = [];
      lines.current = [];

      let elements: HTMLElement[] = [];

      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children) as HTMLElement[];
      } else {
        elements = [containerRef.current as HTMLElement];
      }

      elements.forEach((el) => {
        elementRef.current.push(el);

        // const split = SplitText.create(el, {
        //   type: "lines",
        //   mask: "lines",
        //   linesClass: "line++",
        // }) as SplitTextInstance;

        // splitRef.current.push(split);

        // const computedStyle = window.getComputedStyle(el);
        // const textIdent = computedStyle.textIndent;

        // if (textIdent && textIdent !== "0px") {
        //   if (split.lines.length > 0) {
        //     split.lines[0].style.textIndent = textIdent;
        //   }
        //   el.style.textIndent = "0px";
        // }

        // lines.current.push(...split.lines);
      });
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
