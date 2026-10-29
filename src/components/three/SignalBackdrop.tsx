"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useExperience } from "@/components/providers/ExperienceProvider";

const SignalScene = dynamic(
  () => import("./SignalScene").then((m) => m.SignalScene),
  { ssr: false },
);

/**
 * The single persistent WebGL layer for the whole site.
 *
 * One context, mounted at most once per route. `atmosphere` (pure CSS) is
 * always painted, so there is a complete visual background even when WebGL
 * is unavailable, disabled or still loading.
 */
export function SignalBackdrop({ enabled = true }: { enabled?: boolean }) {
  const { quality, reducedMotion, webgl, ready } = useExperience();
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  const useScene = enabled && ready && webgl && quality !== "lite" && !failed;

  useEffect(() => {
    if (!useScene) return;
    setMounted(true);
  }, [useScene]);

  /* Handle context loss gracefully: drop to the CSS atmosphere instead of
     leaving a black rectangle behind the page. */
  useEffect(() => {
    if (!mounted) return;
    const host = hostRef.current;
    if (!host) return;
    const onLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
      setMounted(false);
    };
    host.addEventListener("webglcontextlost", onLost, true);
    return () => host.removeEventListener("webglcontextlost", onLost, true);
  }, [mounted]);

  return (
    <>
      <div className="atmosphere" aria-hidden />
      <div
        ref={hostRef}
        className={`canvas-layer${mounted && !failed ? " is-ready" : ""}`}
        aria-hidden
      >
        {mounted && useScene ? (
          <SignalScene quality={quality} reducedMotion={reducedMotion} />
        ) : null}
      </div>
      {/* Lite / no-WebGL substitute: a calm static signal bloom, no runtime cost */}
      {!useScene ? <StaticSignal /> : null}
      <div className="grain" aria-hidden />
    </>
  );
}

function StaticSignal() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-canvas)",
        pointerEvents: "none",
        background:
          "radial-gradient(38% 44% at 72% 34%, rgba(146,135,234,0.16), transparent 68%)," +
          "radial-gradient(30% 34% at 26% 74%, rgba(38,75,81,0.24), transparent 70%)",
        opacity: 0.9,
      }}
    />
  );
}
