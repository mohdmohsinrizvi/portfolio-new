"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  autoQuality,
  degrade,
  prefersReducedMotion,
  qualityPresets,
  readStoredQuality,
  storeQuality,
  type QualityMode,
} from "@/lib/quality";
import { pointerState, scrollState } from "@/lib/state";

gsap.registerPlugin(ScrollTrigger);

type Ctx = {
  quality: QualityMode;
  setQuality: (m: QualityMode) => void;
  qualitySource: "auto" | "manual";
  reducedMotion: boolean;
  webgl: boolean;
  ready: boolean;
};

const QualityContext = createContext<Ctx | null>(null);

export function useExperience(): Ctx {
  const ctx = useContext(QualityContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQualityState] = useState<QualityMode>("balanced");
  const [qualitySource, setQualitySource] = useState<"auto" | "manual">("auto");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [ready, setReady] = useState(false);
  const degradeRef = useRef<QualityMode | null>(null);

  /* ---- capability detection (client only) ---- */
  useEffect(() => {
    const manual = readStoredQuality();
    const rm = prefersReducedMotion();
    setReducedMotion(rm);

    import("@/lib/quality").then(({ hasWebGL }) => {
      const ok = hasWebGL();
      setWebgl(ok);
      if (manual) {
        setQualityState(manual);
        setQualitySource("manual");
      } else if (!ok || rm) {
        setQualityState("lite");
        setQualitySource("auto");
      } else {
        setQualityState(autoQuality());
        setQualitySource("auto");
      }
      setReady(true);
    });
  }, []);

  const setQuality = useCallback((m: QualityMode) => {
    storeQuality(m);
    degradeRef.current = null;
    setQualityState(m);
    setQualitySource("manual");
  }, []);

  /* ---- runtime frame-rate watchdog ---- */
  useEffect(() => {
    if (!ready || quality === "lite" || reducedMotion) return;
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    let samples = 0;
    let sum = 0;
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      frames += 1;
      const dt = now - last;
      if (dt >= 1000) {
        const fps = (frames * 1000) / dt;
        frames = 0;
        last = now;
        samples += 1;
        sum += fps;
        // evaluate after a 4s window, then keep watching every 8s
        if (samples === 4) {
          const avg = sum / samples;
          if (avg < 34) {
            const next = degrade(quality);
            if (next !== quality) {
              degradeRef.current = next;
              setQualityState(next);
              setQualitySource("auto");
              cancelled = true;
              return;
            }
          }
          samples = 0;
          sum = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [ready, quality, reducedMotion]);

  /* ---- one authoritative scroll controller ---- */
  useEffect(() => {
    if (!ready) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);

    const touch = window.matchMedia("(pointer: coarse)").matches;
    let lenis: Lenis | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !touch,
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        mq.removeEventListener("change", onMq);
        gsap.ticker.remove(raf);
        lenis?.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    ScrollTrigger.refresh();
    return () => {
      mq.removeEventListener("change", onMq);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready]);

  /* ---- shared scroll / pointer state writers ---- */
  useEffect(() => {
    if (!ready) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        scrollState.y = self.scroll();
        scrollState.velocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 1800);
      },
    });

    const onPointer = (e: PointerEvent) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onDown = () => (pointerState.down = true);
    const onUp = () => (pointerState.down = false);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      st.kill();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [ready]);

  const value = useMemo<Ctx>(
    () => ({ quality, setQuality, qualitySource, reducedMotion, webgl, ready }),
    [quality, setQuality, qualitySource, reducedMotion, webgl, ready],
  );

  return <QualityContext.Provider value={value}>{children}</QualityContext.Provider>;
}

export { qualityPresets };
