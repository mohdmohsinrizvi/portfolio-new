"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAV = [
  { index: "01", label: "Home", href: "/", note: "The arrival" },
  { index: "02", label: "Work", href: "/work", note: "The archive" },
  { index: "03", label: "Lab", href: "/lab", note: "Experiments" },
  { index: "04", label: "Journey", href: "/journey", note: "Progress & credentials" },
  { index: "05", label: "About", href: "/about", note: "Identity & approach" },
  { index: "06", label: "Contact", href: "/contact", note: "Start something" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState<{ i: number; name: string }>({
    i: 0,
    name: "Arrival",
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  /* ---- scroll progress hairline (no re-render) ---- */
  useEffect(() => {
    if (!progressRef.current) return;
    const el = progressRef.current;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        el.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  /* ---- chapter indicator, home only ---- */
  useEffect(() => {
    if (!isHome) return;
    const sections = gsap.utils.toArray<HTMLElement>("[data-chapter]");
    const triggers = sections.map((section, i) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) {
            setChapter({ i, name: section.dataset.chapter || "" });
          }
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [isHome]);

  /* ---- menu: focus management, escape, scroll lock ---- */
  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>("a, button");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const firstEl = focusables[0]!;
      const lastEl = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  /* close whenever the route actually changes */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* ---- panel motion ---- */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const items = panel.querySelectorAll("[data-menu-item]");
    if (open) {
      gsap.set(panel, { autoAlpha: 1 });
      gsap.fromTo(
        panel,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power4.inOut" },
      );
      gsap.fromTo(
        items,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05, delay: 0.16, ease: "power4.out" },
      );
    } else {
      gsap.set(panel, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" });
      gsap.set(items, { yPercent: 115, opacity: 0 });
    }
  }, [open]);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-(--z-header)"
        aria-hidden
      >
        <div
          ref={progressRef}
          className="h-px w-full origin-left bg-signal/70"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-(--z-header) mix-blend-difference">
        <div className="shell flex items-center justify-between py-[max(14px,1.4vw)]">
          <Link
            href="/"
            className="group flex items-baseline gap-2"
            aria-label="MOHSIN — home"
          >
            <span className="u-wordmark text-[clamp(15px,1.25vw,19px)] text-bone">
              Mohsin
            </span>
            <span className="u-meta hidden text-bone/55 transition-opacity duration-300 group-hover:opacity-100 sm:inline opacity-60">
              Experimental&nbsp;Archive
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-7">
            {isHome ? (
              <p className="u-meta hidden items-center gap-2 text-bone/70 md:flex" aria-live="polite">
                <span className="text-bone/40">{String(chapter.i).padStart(2, "0")}</span>
                <span className="h-px w-6 bg-bone/30" />
                <span>{chapter.name}</span>
              </p>
            ) : null}

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls="site-index"
              className="group flex items-center gap-3"
            >
              <span className="u-meta text-bone/70 transition-colors group-hover:text-bone">
                {open ? "Close" : "Index"}
              </span>
              <span className="relative grid h-6 w-6 place-items-center" aria-hidden>
                <span
                  className="absolute h-px w-5 bg-bone transition-transform duration-300 ease-(--ease-out-expo)"
                  style={{ transform: open ? "rotate(45deg)" : "translateY(-3px)" }}
                />
                <span
                  className="absolute h-px w-5 bg-bone transition-transform duration-300 ease-(--ease-out-expo)"
                  style={{ transform: open ? "rotate(-45deg)" : "translateY(3px)" }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-index"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site index"
        className="fixed inset-0 z-(--z-menu)"
        hidden={!open}
      >
        <div
          ref={panelRef}
          className="absolute inset-0 overflow-y-auto bg-void/95 backdrop-blur-[18px]"
        >
          <div className="shell flex min-h-full flex-col justify-between pb-10 pt-[max(76px,10vh)]">
            <nav aria-label="Primary">
              <ul className="border-t border-bone/12">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href} className="border-b border-bone/12" data-menu-item>
                      <Link
                        href={item.href}
                        className="group flex items-baseline justify-between gap-6 py-[clamp(10px,1.8vh,22px)]"
                        tabIndex={open ? 0 : -1}
                      >
                        <span className="flex items-baseline gap-4 sm:gap-8">
                          <span className="u-meta w-7 shrink-0 text-signal/70 transition-colors group-hover:text-signal">
                            {item.index}
                          </span>
                          <span
                            className="u-wordmark block text-[clamp(2.4rem,9vw,6.6rem)] text-bone/85 transition-all duration-500 ease-(--ease-out-expo) group-hover:translate-x-2 group-hover:text-bone"
                            style={{
                              color: active ? "var(--color-champagne)" : undefined,
                            }}
                          >
                            {item.label}
                          </span>
                        </span>
                        <span className="u-meta hidden shrink-0 self-center text-bone/40 transition-colors group-hover:text-bone/75 sm:block">
                          {item.note}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-6" data-menu-item>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a
                  className="u-meta u-hairline-link text-bone/65 hover:text-bone"
                  href="https://www.linkedin.com/in/mohd-mohsin-rizvi"
                  target="_blank"
                  rel="noreferrer noopener"
                  tabIndex={open ? 0 : -1}
                >
                  LinkedIn
                </a>
                <a
                  className="u-meta u-hairline-link text-bone/65 hover:text-bone"
                  href="https://github.com/mohdmohsinrizvi"
                  target="_blank"
                  rel="noreferrer noopener"
                  tabIndex={open ? 0 : -1}
                >
                  GitHub
                </a>
                <span className="u-meta text-bone/35">Lucknow, India</span>
              </div>
              <p className="u-meta text-bone/35">Portfolio / 2026</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
