import React, { useRef, type JSX } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

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
    async () => {
      if (!containerRef.current) return;

      const SplitText = (await import("gsap/SplitText")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;

      gsap.registerPlugin(ScrollTrigger, SplitText);

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

        if (!el) return;

        // @ts-ignore: SplitText.create is not typed in gsap types
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
        }) as SplitTextInstance;

        splitRef.current.push(split);

        const computedStyle = window.getComputedStyle(el);
        const textIdent = computedStyle.textIndent;

        if (textIdent && textIdent !== "0px") {
          if (split.lines.length > 0) {
            split.lines[0].style.textIndent = textIdent;
          }
          el.style.textIndent = "0px";
        }

        lines.current.push(...split.lines);
      });

      gsap.set(lines.current, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, {
          ...animationProps,
        });
      }

      return () => {
        splitRef.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
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
