import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";
import type { Route } from "./+types/root";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Layout({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    gsap.to(".overlay", {
      opacity: 0,

      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(".overlay", { display: "none" });
      },
    });
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="relative bg-zinc-950 text-zinc-100 flex flex-col justify-between min-h-screen border-[36px] border-zinc-100">
        {children}
        <div className="fixed overlay top-[36px] bottom-[36px] left-[36px] right-[36px] bg-zinc-950"></div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
