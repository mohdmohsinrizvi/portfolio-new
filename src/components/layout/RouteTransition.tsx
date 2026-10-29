"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * A short typographic wipe between routes.
 *
 * Deliberately non-blocking: it never intercepts pointer events while idle,
 * never delays the first paint of a hard load, and is skipped entirely under
 * reduced-motion. Routing itself is untouched — history, back/forward and
 * direct URL entry all behave normally.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "in" | "out">("idle");
  const first = useRef(true);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setState("in");
    timers.current.forEach(clearTimeout);
    timers.current = [
      window.setTimeout(() => setState("out"), 430),
      window.setTimeout(() => setState("idle"), 960),
    ];
    return () => timers.current.forEach(clearTimeout);
  }, [pathname]);

  useEffect(() => {
    if (state !== "out") return;
    const el = document.querySelector<HTMLElement>("[data-route-wipe]");
    if (!el) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [state]);

  if (state === "idle") return null;

  return (
    <div
      data-route-wipe
      aria-hidden
      className="pointer-events-none fixed inset-0 z-(--z-transition) flex items-center justify-center bg-void"
      style={{
        transform: state === "in" ? "translateY(0%)" : "translateY(-100%)",
        transition: `transform ${state === "in" ? 430 : 520}ms var(--ease-in-out-quart)`,
      }}
    >
      <span className="u-wordmark text-[clamp(2rem,7vw,5rem)] text-bone/10">
        {pathname.split("/")[1] || "home"}
      </span>
    </div>
  );
}
