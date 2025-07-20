import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import React from "react";

export default function Copy({ children }: { children: React.ReactNode }) {
  return React.cloneElement(children as React.ReactElement);
}
