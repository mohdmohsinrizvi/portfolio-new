"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";
import { statusLabels } from "@/data/projects";
import { makeCover } from "@/lib/coverArt";
import { GalleryPlane, type GalleryState } from "./GalleryPlane";
import { pad } from "@/lib/cn";
import { useExperience } from "@/components/providers/ExperienceProvider";

type Props = {
  projects: Project[];
  id?: string;
};

/**
 * The drag + distortion project gallery.
 *
 * One WebGL plane carries the imagery; HTML carries every word, link and
 * control, so the archive stays readable and crawlable with WebGL off.
 * The canvas is mounted only while the section is anywhere near the
 * viewport, and torn down completely when it is not.
 */
export function DistortionGallery({ projects, id = "work" }: Props) {
  const { webgl, quality } = useExperience();
  const list = useMemo(() => projects.slice(0, 6), [projects]);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [live, setLive] = useState(false);

  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);

  /* stable identity handed to the R3F plane; fields are filled in on mount */
  const stateRef = useRef<GalleryState>({
    textures: [],
    index: 0,
    pos: 0,
    target: 0,
    velocity: 0,
    dragging: false,
    viewport: [1, 1],
    card: [0, 0, 1, 1],
    fade: 0,
    bend: 0.11,
  });

  const project = list[active] ?? list[0];

  /* ---------------- textures ---------------- */
  useEffect(() => {
    const textures = list.map((p, i) => {
      const canvas = makeCover(p.cover, i + 1, p.category);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      return tex;
    });
    texturesRef.current = textures;
    stateRef.current.textures = textures;
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [list]);

  /* ---------------- shared state ---------------- */
  useLayoutEffect(() => {
    const st = stateRef.current;
    st.textures = texturesRef.current;
    st.pos = 0;
    st.target = 0;
    st.index = 0;
    st.velocity = 0;
    st.dragging = false;
    st.fade = 0;
    return () => {
      st.textures = [];
    };
  }, []);

  /* ---------------- layout: viewport + card rect ---------------- */
  useEffect(() => {
    const measure = () => {
      const host = hostRef.current;
      const st = stateRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      st.viewport = [w, h];

      const mobile = w < 760;
      const halfW = mobile ? w * 0.42 : Math.min(w * 0.31, 520);
      const halfH = mobile ? h * 0.24 : Math.min(h * 0.34, 420);
      const cx = w * 0.5;
      const cy = h * (mobile ? 0.46 : 0.5);
      // shader origin is bottom-left
      st.card = [cx, h - cy, halfW, halfH];
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (hostRef.current) ro.observe(hostRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ---------------- lazy mount ---------------- */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { rootMargin: "60% 0px 60% 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => setLive(true), 120);
    return () => window.clearTimeout(t);
  }, [visible]);

  /* ---------------- fade the plane in once mounted ---------------- */
  useEffect(() => {
    const st = stateRef.current;
    if (live) {
      gsap.to(st, { fade: 1, duration: 0.9, ease: "power2.out" });
    } else {
      st.fade = 0;
    }
  }, [live]);

  /* ---------------- navigation ---------------- */
  const goTo = useCallback(
    (next: number, dir: 1 | -1 = 1) => {
      const st = stateRef.current;
      const n = list.length;
      // move to the nearest congruent position so the wipe always travels
      // the short way round, then land on the requested index
      let target = next;
      const current = st.target;
      while (target - current > n / 2) target -= n;
      while (current - target > n / 2) target += n;
      st.target = target;
      const idx = ((next % n) + n) % n;
      setActive(idx);
      void dir;
    },
    [list.length],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const st = stateRef.current;
      const n = list.length;
      const nextIdx = (Math.round(st.target) + dir + n) % n;
      goTo(nextIdx, dir);
    },
    [goTo, list.length],
  );

  /* ---------------- pointer drag ---------------- */
  useEffect(() => {
    const stage = stageRef.current;
    const st = stateRef.current;
    if (!stage || !st) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startPos = 0;
    let lastX = 0;
    let lastT = 0;
    let locked: "none" | "x" | "y" = "none";
    let samples: { x: number; t: number }[] = [];

    const pxPerItem = () => Math.max(160, (st.card[2] * 2) * 0.9);

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastT = performance.now();
      startPos = st.pos;
      locked = "none";
      samples = [];
      st.dragging = true;
      st.velocity = 0;
      stage.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId || !st.dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (locked === "none") {
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
          if (locked === "x") stage.classList.add("is-dragging");
        } else return;
      }
      if (locked === "y") return; // let the page scroll

      e.preventDefault();
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      samples.push({ x: e.clientX, t: now });
      if (samples.length > 6) samples.shift();

      const delta = (e.clientX - lastX) / pxPerItem();
      st.pos = startPos - (e.clientX - startX) / pxPerItem();
      st.target = st.pos;
      st.velocity = -((e.clientX - lastX) / pxPerItem()) * (16 / dt);
      lastX = e.clientX;
      lastT = now;
      void delta;
    };

    const onUp = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      stage.classList.remove("is-dragging");
      if (locked !== "x") {
        st.dragging = false;
        st.velocity = 0;
        return;
      }

      // throw velocity from the last few samples
      let v = 0;
      if (samples.length >= 2) {
        const a = samples[0]!;
        const b = samples[samples.length - 1]!;
        const dt = Math.max(16, b.t - a.t);
        v = ((b.x - a.x) / pxPerItem()) * (600 / dt);
      }
      const projected = Math.round(st.pos - v * 0.55);
      st.dragging = false;
      st.velocity = -v * 0.4;
      goTo(projected, v > 0 ? -1 : 1);
      void e;
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    return () => {
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, [goTo]);

  /* ---------------- wheel (horizontal / shift only — never traps vertical) ---------------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontal && !e.shiftKey) return;
      e.preventDefault();
      const delta = horizontal ? e.deltaX : e.deltaY;
      const st = stateRef.current;
      st.target += delta > 0 ? 0.34 : -0.34;
      setActive((((Math.round(st.target) % list.length) + list.length) % list.length));
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [list.length]);

  /* ---------------- keyboard ---------------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  /* ---------------- title motion ---------------- */
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-t-piece]"),
        { yPercent: 108, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.62, stagger: 0.028, ease: "power4.out" },
      );
    }, el);
    return () => ctx.revert();
  }, [active]);

  const showCanvas = webgl && quality !== "lite";
  const n = list.length;

  return (
    <div
      ref={hostRef}
      id={id}
      className="relative isolate w-full"
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Selected work"
      onKeyDown={onKeyDown}
      data-cursor="DRAG"
    >
      {/* WebGL stage */}
      {showCanvas && visible ? (
        <div
          ref={stageRef}
          className="absolute inset-0 z-0 touch-pan-y select-none"
          style={{ cursor: "grab" }}
          aria-hidden
        >
          <Canvas
            orthographic
            camera={{ position: [0, 0, 1], near: 0, far: 2, zoom: 1 }}
            gl={{ alpha: true, antialias: false, premultipliedAlpha: true }}
            dpr={[1, quality === "cinematic" ? 1.75 : 1.35]}
            style={{ pointerEvents: "none" }}
          >
            <GalleryPlane state={stateRef.current} />
          </Canvas>
        </div>
      ) : null}

      {/* HTML layer — the accessible, crawlable representation */}
      <div className="relative z-10 flex min-h-[clamp(460px,78vh,860px)] flex-col justify-between">
        <div className="shell flex items-start justify-between gap-6 pt-[clamp(2rem,6vh,4rem)]">
          <p className="u-meta text-signal/80">02 — Selected work</p>
          <p className="u-meta flex items-center gap-3 text-bone/45">
            <span className="u-wordmark text-[clamp(1.6rem,3vw,2.6rem)] text-bone">
              {pad(active + 1)}
            </span>
            <span className="h-px w-8 bg-bone/25" />
            <span>{pad(n)}</span>
          </p>
        </div>

        {/* title block */}
        <div className="pointer-events-none absolute inset-x-0 top-[38%] z-10 sm:top-[34%]">
          <div className="shell">
            <div ref={titleRef} className="max-w-[16ch]" key={project?.slug}>
              <h3 className="u-wordmark text-[clamp(2.6rem,9vw,7.5rem)] text-bone mix-blend-difference">
                {(project?.title ?? "").split(" ").map((word, i) => (
                  <span key={i} className="sp-word" aria-hidden>
                    <span className="sp-ch" data-t-piece>
                      {word}
                    </span>
                    {i < (project?.title.split(" ").length ?? 1) - 1 ? (
                      <span className="sp-gap">&nbsp;</span>
                    ) : null}
                  </span>
                ))}
              </h3>
              <p
                className="u-display mt-3 text-[clamp(1.1rem,2.4vw,2rem)] italic text-champagne"
                aria-live="polite"
              >
                {project?.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* bottom rail */}
        <div className="shell pb-[clamp(1.5rem,4vh,3rem)]">
          <div className="hairline mb-5" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[46ch]">
              <p className="u-meta mb-2 text-bone/45">
                {project?.category}
                {project?.year ? ` · ${project.year}` : ""}
                {` · ${project?.statusLabel ?? statusLabels[project?.status ?? "completed"]}`}
              </p>
              <p className="hidden text-[0.95rem] leading-relaxed text-silver sm:block">
                {project?.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/work/${project?.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-2.5 transition-colors duration-(--dur-base) hover:border-bone hover:bg-bone hover:text-void"
                data-cursor="VIEW"
              >
                <span className="u-meta text-bone/80 transition-colors group-hover:text-void">
                  Case study
                </span>
                <span aria-hidden className="text-xs">
                  ↗
                </span>
              </Link>
              {project?.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="u-meta u-hairline-link text-bone/60 hover:text-bone"
                >
                  Live ↗
                </a>
              ) : null}
              {project?.repositoryUrl ? (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="u-meta u-hairline-link text-bone/60 hover:text-bone"
                >
                  Repo ↗
                </a>
              ) : null}

              <div className="ml-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous project"
                  className="grid h-11 w-11 place-items-center rounded-full border border-bone/22 transition-colors hover:border-bone hover:bg-bone hover:text-void"
                >
                  <span aria-hidden>←</span>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next project"
                  className="grid h-11 w-11 place-items-center rounded-full border border-bone/22 transition-colors hover:border-bone hover:bg-bone hover:text-void"
                >
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </div>

          <p className="u-meta mt-4 text-bone/30">
            Drag, swipe, use ← →, or shift + scroll
          </p>
        </div>
      </div>

      {/* Non-WebGL / no-JS representation of the same archive */}
      <noscript>
        <div className="shell pb-10">
          <ul className="grid gap-4 sm:grid-cols-2">
            {list.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="block border border-bone/15 p-4">
                  <span className="u-wordmark text-xl">{p.title}</span>
                  <span className="u-meta mt-1 block">{p.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      {/* Accessible list of every project, always present in the DOM */}
      <ul className="sr-only">
        {list.map((p) => (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`}>
              {p.title} — {p.summary}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
