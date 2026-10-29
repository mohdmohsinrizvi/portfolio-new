"use client";

import Link from "next/link";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { profile } from "@/data/profile";

const facts = [
  { k: "Name", v: profile.legalName },
  { k: "Focus", v: "Software · AI/ML · Interactive systems" },
  { k: "Studying", v: profile.education.degree },
  { k: "Institution", v: profile.education.university },
  { k: "Period", v: profile.education.period },
  { k: "Based in", v: profile.location },
];

/** Chapter 01 — THE IDENTITY. */
export function Identity() {
  return (
    <section
      id="identity"
      data-chapter="Identity"
      data-atmo="#0d1016|#12161f|rgba(184,166,140,0.10)"
      aria-labelledby="identity-heading"
      className="section relative z-(--z-content)"
    >
      <div className="shell">
        <div className="grid gap-x-[var(--gutter)] gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="u-meta mb-6 text-champagne/90">01 — The identity</p>
            <h2
              id="identity-heading"
              className="u-display text-[clamp(2.6rem,7.2vw,6rem)] text-bone"
            >
              <SplitText text="Curiosity is the starting point." stagger={0.035} />
            </h2>

            <Reveal delay={0.1} className="mt-8 max-w-[52ch]">
              <p className="u-lead text-silver">
                I like understanding how things work — and building things that work
                better.
              </p>
              <p className="mt-5 text-[1rem] leading-relaxed text-silver/90">
                A computer science undergraduate working across software engineering,
                artificial intelligence and interactive digital experiences. Most of what
                is in this archive started as a question that refused to stay theoretical.
              </p>
            </Reveal>

            <Reveal delay={0.16} className="mt-9">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 border-b border-bone/25 pb-1.5 transition-colors hover:border-bone"
                data-cursor="VIEW"
              >
                <span className="u-meta text-bone/75 group-hover:text-bone">
                  More about the person
                </span>
                <span aria-hidden className="text-sm transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.08}>
              <p className="u-meta mb-5">Coordinates</p>
              <dl className="border-t border-bone/12">
                {facts.map((f, i) => (
                  <div
                    key={f.k}
                    className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-bone/12 py-3.5"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <dt className="u-meta pt-1 text-bone/40">{f.k}</dt>
                    <dd className="text-[0.95rem] leading-snug text-bone/85">{f.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="u-meta mt-6 leading-relaxed text-bone/35">
                B.Tech CSE, class of 2028 — building in public alongside the coursework,
                not instead of it.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
