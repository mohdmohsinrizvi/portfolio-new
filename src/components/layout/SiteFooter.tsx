"use client";

import Link from "next/link";
import { QualityToggle } from "@/components/ui/QualityToggle";

const columns = [
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "Lab", href: "/lab" },
      { label: "Journey", href: "/journey" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Selected work",
    links: [
      { label: "CampusResQ", href: "/work/campusresq" },
      { label: "Algorithm Discovery Lab", href: "/work/algorithm-discovery-lab" },
      { label: "Amazon ML Challenge", href: "/work/amazon-ml-challenge" },
      { label: "BBD Study Hub", href: "/work/bbdu-study-hub" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-(--z-content) border-t border-bone/12 bg-carbon/70 backdrop-blur-sm">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="u-meta mb-4">Colophon</p>
            <p className="max-w-42ch text-[0.95rem] leading-relaxed text-silver">
              An interactive archive of things built, tested and still being figured
              out. Rendered with Next.js, Three.js and GSAP — one shared WebGL context,
              adaptive quality, and an HTML-first content layer underneath.
            </p>
            <div className="mt-7">
              <QualityToggle />
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="u-meta mb-4">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="u-hairline-link text-[0.95rem] text-bone/75 transition-colors hover:text-bone"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-bone/12 pt-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              className="u-meta u-hairline-link text-bone/65 hover:text-bone"
              href="https://www.linkedin.com/in/mohd-mohsin-rizvi"
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn ↗
            </a>
            <a
              className="u-meta u-hairline-link text-bone/65 hover:text-bone"
              href="https://github.com/mohdmohsinrizvi"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub ↗
            </a>
            <span className="u-meta text-bone/35">Lucknow, India</span>
          </div>
          <p className="u-meta text-bone/35">
            © {new Date().getFullYear()} Syed Mohd Mohsin Rizvi
          </p>
        </div>
      </div>

      <div className="overflow-hidden px-[var(--margin)] pb-6" aria-hidden>
        <span className="u-wordmark block select-none text-[clamp(3rem,17vw,15rem)] leading-[0.78] text-bone/[0.06]">
          Mohsin
        </span>
      </div>
    </footer>
  );
}
