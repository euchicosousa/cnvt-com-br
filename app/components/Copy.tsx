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

  useGSAP(() => {}, {
    scope: containerRef,
    dependencies: [animateOnScroll, delay],
  });

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
