"use client";

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/quality";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  /** start position of the trigger, e.g. "top 88%" */
  start?: string;
  id?: string;
};

/**
 * Scroll-triggered reveal. Falls back to fully visible content when JS,
 * GSAP or motion preferences rule animation out.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 26,
  duration = 0.9,
  className,
  once = true,
  start = "top 88%",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, once },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, duration, once, start]);

  return createElement(as, { ref, className, id, "data-reveal": "" }, children);
}

type SplitProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** delay between words */
  stagger?: number;
  delay?: number;
  /** reveal character by character instead of word by word */
  byChar?: boolean;
  /**
   * Suppress the built-in reveal. Use when an outer timeline owns the
   * animation of the same `[data-piece]` elements — without this the two
   * tweens fight and the type lands in a torn state.
   */
  defer?: boolean;
  id?: string;
};

/**
 * Masked type reveal. Real text stays selectable and screen-readable — the
 * animation is applied to visual spans only.
 */
export function SplitText({
  text,
  as = "span",
  className,
  stagger = 0.055,
  delay = 0,
  byChar = false,
  defer = false,
  id,
}: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pieces = el.querySelectorAll<HTMLElement>("[data-piece]");
    if (prefersReducedMotion()) {
      gsap.set(pieces, { yPercent: 0, opacity: 1 });
      return;
    }
    if (defer) {
      // owner timeline will run these; park them in the hidden start state
      gsap.set(pieces, { yPercent: 112, opacity: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const pieces = el.querySelectorAll<HTMLElement>("[data-piece]");
      gsap.fromTo(
        pieces,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          delay,
          ease: "power4.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [stagger, delay, byChar, defer]);

  const words = text.split(" ");

  return createElement(
    as,
    { ref, className, id, "aria-label": text },
    words.map((word, wi) => {
      const pieces = byChar
        ? word.split("").map((ch, ci) => (
            <span key={ci} className="sp-ch" data-piece>
              {ch}
            </span>
          ))
        : [
            <span key="w" className="sp-ch" data-piece>
              {word}
            </span>,
          ];
      return (
        <span className="sp-word" key={wi} aria-hidden>
          {pieces}
          {wi < words.length - 1 ? <span className="sp-gap">&nbsp;</span> : null}
        </span>
      );
    }),
  );
}

/** Small utility: run an effect only in the browser, after hydration. */
export function useIsomorphicEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList,
) {
  const isomorphic = useLayoutEffect as typeof useEffect;
  isomorphic(effect, deps);
}
