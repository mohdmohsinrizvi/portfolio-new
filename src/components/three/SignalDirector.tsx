"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState } from "@/lib/state";
import { useExperience } from "@/components/providers/ExperienceProvider";

/**
 * Drives The Signal through the homepage chapters.
 *
 * Owns no DOM — it only writes into `sceneState`, which the WebGL scene
 * reads inside useFrame. One ScrollTrigger per chapter, scrubbed, all
 * cleaned up on unmount.
 */
export function SignalDirector() {
  const { reducedMotion, webgl, quality } = useExperience();

  useEffect(() => {
    if (!webgl || quality === "lite") {
      sceneState.scale = 1;
      sceneState.morph = 1;
      sceneState.coreVisible = 0;
      return;
    }

    const ctx = gsap.context(() => {
      const targets = [
        // ch 0 — arrival: centred, large, calm
        { x: 0.62, y: -0.02, scale: 1.28, morph: 1, visible: 1 },
        // ch 1 — identity: pushed right, slightly smaller
        { x: 1.35, y: 0.5, scale: 0.9, morph: 1.35, visible: 0.9 },
        // ch 2 — selected work: recedes behind the gallery
        { x: -1.5, y: -0.3, scale: 0.72, morph: 1.6, visible: 0.55 },
        // ch 3 — laboratory: contracts into a dense knot
        { x: 1.1, y: 0.7, scale: 0.55, morph: 2.2, visible: 0.7 },
        // ch 4 — journey: drifts low, almost a horizon
        { x: -1.2, y: -0.95, scale: 0.8, morph: 1.25, visible: 0.62 },
        // ch 5 — connection: returns, centred and settled
        { x: 0, y: 0.1, scale: 1.05, morph: 0.85, visible: 0.95 },
      ];

      const sections = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      sections.forEach((section, i) => {
        const t = targets[Math.min(i, targets.length - 1)];
        if (!t) return;
        gsap.to(sceneState, {
          offsetX: t.x,
          offsetY: t.y,
          scale: t.scale,
          morph: t.morph,
          coreVisible: t.visible,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: reducedMotion ? false : 0.7,
            onEnter: () => {
              sceneState.morph = t.morph;
            },
            onEnterBack: () => {
              sceneState.morph = t.morph;
            },
          },
        });
      });

      // atmosphere colour drift per chapter
      gsap.utils.toArray<HTMLElement>("[data-atmo]").forEach((section) => {
        const [a, b, glow] = (section.dataset.atmo || "").split("|");
        if (!a) return;
        gsap.to(document.documentElement, {
          "--atmo-a": a,
          "--atmo-b": b || a,
          "--atmo-glow": glow || "rgba(146,135,234,0.09)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 25%",
            scrub: reducedMotion ? false : 0.9,
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      sceneState.offsetX = 0;
      sceneState.offsetY = 0;
      sceneState.scale = 1;
      sceneState.morph = 1;
      sceneState.coreVisible = 1;
    };
  }, [reducedMotion, webgl, quality]);

  return null;
}
