"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/quality";

type Mode = "default" | "hover" | "label";

/**
 * Desktop-only cursor. Purely decorative: it is `pointer-events: none`,
 * hidden on coarse pointers, and never replaces the real cursor for
 * accessibility settings.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as
        | HTMLElement
        | null;
      if (target) {
        const l = target.dataset.cursor;
        if (l && l !== "hover") {
          setMode("label");
          setLabel(l);
        } else {
          setMode("hover");
          setLabel("");
        }
      } else {
        setMode("default");
        setLabel("");
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-(--z-cursor) mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-bone/70 transition-all duration-(--dur-base) ease-(--ease-out-expo)"
          style={{
            width: mode === "label" ? 84 : mode === "hover" ? 52 : 26,
            height: mode === "label" ? 84 : mode === "hover" ? 52 : 26,
            background: mode === "label" ? "var(--color-bone)" : "transparent",
            borderColor: mode === "label" ? "var(--color-bone)" : undefined,
          }}
        >
          {mode === "label" ? (
            <span className="u-meta text-void">{label}</span>
          ) : null}
        </div>
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-(--z-cursor) h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone mix-blend-difference"
        style={{ willChange: "transform", opacity: mode === "label" ? 0 : 1 }}
      />
    </>
  );
}
