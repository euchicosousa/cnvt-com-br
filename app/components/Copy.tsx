import { cloneElement, type ReactNode } from "react";

export default function Copy({ children }: { children: ReactNode }) {
  return cloneElement(children as React.ReactElement);
}
