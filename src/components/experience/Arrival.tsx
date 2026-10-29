"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText, Reveal } from "@/components/motion/Reveal";
import { profile } from "@/data/profile";
import { prefersReducedMotion } from "@/lib/quality";

/**
 * Chapter 00 — ARRIVAL.
 *
 * Establishes the identity in one viewport. The Signal Core is already
 * behind this layer; here we only choreograph type, metadata and the
 * entrance. Everything is skippable and nothing blocks navigation.
 */
export function Arrival() {
  const root = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-piece]"), {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
      });
      setEntered(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => setEntered(true),
      });

      tl.fromTo(
        "[data-arrive-trace]",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
        0.1,
      )
        .fromTo(
          "[data-arrive-title] [data-piece]",
          { yPercent: 112, opacity: 0, rotateX: 46, transformPerspective: 900 },
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.05, stagger: 0.05 },
          0.34,
        )
        .fromTo(
          "[data-arrive-sub]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.95,
        )
        .fromTo(
          "[data-arrive-meta] > *",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
          1.15,
        )
        .fromTo(
          "[data-arrive-cta] > *",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          1.3,
        );

      gsap.to("[data-arrive-title]", {
        yPercent: -18,
        opacity: 0.15,
        rotateX: -14,
        transformPerspective: 900,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-arrive-core-hint]", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "40% top", scrub: 0.6 },
      });
    }, el);

    return () => {
      ctx.revert();
      setEntered(false);
    };
  }, []);

  return (
    <section
      ref={root}
      id="arrival"
      data-chapter="Arrival"
      data-atmo="#08090d|#0b0d14|rgba(146,135,234,0.10)"
      aria-label="Arrival"
      className="relative z-(--z-content) flex min-h-[100svh] flex-col justify-between pt-[clamp(84px,12vh,150px)] pb-[clamp(28px,5vh,56px)]"
    >
      <div className="shell">
        <div
          data-arrive-trace
          className="h-px w-full max-w-56 origin-left bg-gradient-to-r from-signal/80 to-transparent"
          style={{ transform: "scaleX(0)" }}
          aria-hidden
        />
        <div data-arrive-meta className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="u-meta text-signal/85">Portfolio / 2026</span>
          <span className="u-meta">Independent developer</span>
          <span className="u-meta">Lucknow, India</span>
          <span className="u-meta hidden sm:inline">{profile.timezoneLabel}</span>
        </div>
      </div>

      <div className="shell relative">
        <div data-arrive-title>
          <h1 className="u-wordmark text-[clamp(4.2rem,17.5vw,15rem)] text-bone">
            <SplitText text="Mohsin." byChar stagger={0.05} defer />
          </h1>
        </div>

        <div
          data-arrive-sub
          className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="u-display text-[clamp(1.35rem,3.2vw,2.9rem)] leading-[1.05] text-bone/90">
            Developer. <span className="u-serif-em">Explorer.</span> Builder.
          </p>
          <p className="u-lead max-w-[38ch] text-silver">
            I build digital experiences and explore the systems behind them.
          </p>
        </div>
      </div>

      <div className="shell">
        <div className="hairline mb-6" />
        <div data-arrive-cta className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3 text-void transition-transform duration-(--dur-base) ease-(--ease-out-expo) hover:-translate-y-0.5"
            data-cursor="VIEW"
          >
            <span className="u-meta text-void">Explore the archive</span>
            <span aria-hidden className="text-sm">
              →
            </span>
          </Link>

          <a
            href="#selected-work"
            className="u-meta u-hairline-link text-bone/70 hover:text-bone"
          >
            Selected work
          </a>
          <a href="#identity" className="u-meta u-hairline-link text-bone/45 hover:text-bone">
            Who is behind this
          </a>

          <span
            data-arrive-core-hint
            className="u-meta ml-auto hidden items-center gap-2 text-bone/35 lg:flex"
            aria-hidden
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            The Signal follows your scroll
          </span>
        </div>
      </div>

      {!entered ? (
        <button
          type="button"
          onClick={() => setEntered(true)}
          className="sr-only-focusable absolute bottom-6 right-[var(--margin)] u-meta text-bone/50"
        >
          Skip intro animation
        </button>
      ) : null}

      <Reveal className="sr-only">
        <p>
          Syed Mohd Mohsin Rizvi — creative developer, full-stack engineer and AI/ML
          explorer based in Lucknow, India.
        </p>
      </Reveal>
    </section>
  );
}
