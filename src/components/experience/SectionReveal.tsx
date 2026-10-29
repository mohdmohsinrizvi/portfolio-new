"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/quality";

gsap.registerPlugin(ScrollTrigger);

export type SectionEffect = "curtain" | "portal" | "rise" | "split" | "none";

type Props = {
  children: React.ReactNode;
  effect?: SectionEffect;
  /** scroll distance over which the effect completes, in viewport heights */
  travel?: number;
  /**
   * Solid panel colour. Required by `curtain` so the rounded top edge and
   * cast glow have something to sit on. Leaving it unset keeps the chapter
   * transparent and lets the shared atmosphere gradient show through.
   */
  panel?: string;
  className?: string;
  id?: string;
  "data-chapter"?: string;
  "data-atmo"?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

/**
 * Scroll-driven chapter entrance.
 *
 * Technique follows persistent-layer section transitions: only
 * compositor-friendly properties animate (clip-path, transform, opacity),
 * the section is never cloned or re-mounted, and document order is
 * untouched — so the header chapter indicator, screen-reader order and the
 * no-JS fallback all keep working.
 *
 * Layout safety rule: `clip-path` and `opacity` run on the outer box
 * (neither affects layout, so a scrubbing transition can never open a gap
 * between chapters), and `transform` runs only on the inner layer.
 *
 * The reserved `travel` distance means the effect completes and the section
 * then sits completely static — the reading window — so animation never
 * competes with copy.
 */
export function SectionReveal({
  children,
  effect = "none",
  travel = 0.55,
  panel,
  className,
  id,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = ref.current;
    const inner = innerRef.current;
    if (!outer || effect === "none") return;
    if (prefersReducedMotion()) return;
    // touch devices stay on plain scroll — scrubbed transforms while
    // dragging a finger read as lag rather than immersion
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = gsap.context(() => {
      const start = () => `top bottom-=${window.innerHeight * travel * 0.3}`;
      const end = () => `top top+=${window.innerHeight * travel}`;

      const clipFrom = {
        curtain: "inset(100% 0% 0% 0% round 44px 44px 0px 0px)",
        portal: "circle(10% at 50% 42%)",
        rise: "inset(0% 0% 100% 0%)",
        split: "inset(0% 46% 0% 46%)",
      }[effect];

      const clipTo = {
        curtain: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
        portal: "circle(150% at 50% 42%)",
        rise: "inset(0% 0% 0% 0%)",
        split: "inset(0% 0% 0% 0%)",
      }[effect];

      gsap.fromTo(
        outer,
        { clipPath: clipFrom, opacity: effect === "portal" ? 0.4 : 1 },
        {
          clipPath: clipTo,
          opacity: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: outer, start, end, scrub: 0.7, invalidateOnRefresh: true },
        },
      );

      if (inner) {
        gsap.fromTo(
          inner,
          { y: effect === "curtain" ? 56 : 34, scale: 1.05 },
          {
            y: 0,
            scale: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: outer, start, end, scrub: 0.7, invalidateOnRefresh: true },
          },
        );
      }
    }, outer);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [effect, travel]);

  const isCurtain = effect === "curtain";

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      {...rest}
      style={{
        position: "relative",
        backgroundColor: panel,
        borderTopLeftRadius: isCurtain ? 44 : undefined,
        borderTopRightRadius: isCurtain ? 44 : undefined,
        ...(isCurtain ? { isolation: "isolate" } : null),
      }}
    >
      {isCurtain && (
        <>
          {/* lit top edge of the panel — reads as it sliding over the void */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(236,232,223,0.34), rgba(146,135,234,0.38), transparent)",
            }}
          />
          {/* depth falloff just inside the edge (outside would be clipped) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0))",
            }}
          />
        </>
      )}
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
