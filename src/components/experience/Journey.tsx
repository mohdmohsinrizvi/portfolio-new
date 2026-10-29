"use client";

import Link from "next/link";
import { milestones, credentials, kindLabels, type Milestone } from "@/data/journey";
import { Reveal, SplitText } from "@/components/motion/Reveal";

const kindAccent: Record<Milestone["kind"], string> = {
  education: "text-champagne",
  work: "text-signal-soft",
  community: "text-teal-soft",
  recognition: "text-ember",
  credential: "text-silver",
};

/** Chapter 04 — THE JOURNEY. */
export function Journey() {
  const featured = milestones.filter((m) => m.featured);
  const rest = milestones.filter((m) => !m.featured);

  return (
    <section
      id="journey"
      data-chapter="Journey"
      data-atmo="#0d0c12|#14121c|rgba(184,166,140,0.12)"
      aria-labelledby="journey-heading"
      className="section relative z-(--z-content)"
    >
      <div className="shell">
        <div className="mb-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="u-meta mb-5 text-champagne/90">04 — The journey</p>
            <h2
              id="journey-heading"
              className="u-display max-w-[15ch] text-[clamp(2.6rem,6.5vw,5.4rem)] text-bone"
            >
              <SplitText text="A record, not a résumé." stagger={0.03} />
            </h2>
          </div>
          <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
            <p className="u-lead text-silver">
              Coursework, community roles, competition results and independent research —
              each one with its context intact.
            </p>
          </Reveal>
        </div>

        {/* editorial timeline */}
        <ol className="relative border-t border-bone/12">
          {[...featured, ...rest].map((m, i) => (
            <li key={m.id}>
              <Reveal delay={Math.min(i * 0.05, 0.3)}>
                <article className="group grid gap-x-[var(--gutter)] gap-y-3 border-b border-bone/12 py-8 transition-colors duration-(--dur-base) hover:border-bone/25 sm:py-10 lg:grid-cols-12">
                  <div className="lg:col-span-3">
                    <p className="u-meta text-bone/40">{m.period}</p>
                    <p className={`u-meta mt-1 ${kindAccent[m.kind]}`}>
                      {kindLabels[m.kind]}
                    </p>
                  </div>

                  <div className="lg:col-span-6">
                    <h3 className="u-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-tight text-bone">
                      {m.title}
                    </h3>
                    <p className="u-meta mt-1.5 text-silver/80">{m.org}</p>
                    <p className="mt-4 max-w-[56ch] text-[0.97rem] leading-relaxed text-silver">
                      {m.body}
                    </p>
                  </div>

                  <div className="lg:col-span-2 lg:col-start-11 lg:text-right">
                    {m.evidence ? (
                      m.evidence.href?.startsWith("/") ? (
                        <Link
                          href={m.evidence.href}
                          className="u-meta u-hairline-link inline-block text-bone/60 hover:text-bone"
                          data-cursor="VIEW"
                        >
                          {m.evidence.label} ↗
                        </Link>
                      ) : (
                        <a
                          href={m.evidence.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="u-meta u-hairline-link inline-block text-bone/60 hover:text-bone"
                        >
                          {m.evidence.label} ↗
                        </a>
                      )
                    ) : null}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* credentials */}
        <Reveal delay={0.1} className="mt-16">
          <p className="u-meta mb-6 text-bone/40">Credentials & simulations</p>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-3">
            {credentials.map((c) => (
              <li
                key={c.name}
                className="group flex flex-col justify-between gap-3 bg-void/80 p-6 transition-colors duration-(--dur-base) hover:bg-carbon/70"
              >
                <div>
                  <p className="u-meta text-bone/35">{c.type}</p>
                  <p className="mt-2 text-[1rem] leading-snug text-bone/90">{c.name}</p>
                  <p className="u-meta mt-1.5 text-silver/70">{c.issuer}</p>
                </div>
                {c.note ? (
                  <p className="text-[0.82rem] leading-relaxed text-bone/30">{c.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.14} className="mt-12">
          <Link
            href="/journey"
            className="group inline-flex items-center gap-3 border-b border-bone/25 pb-1.5 transition-colors hover:border-bone"
            data-cursor="VIEW"
          >
            <span className="u-meta text-bone/75 group-hover:text-bone">
              Read the full journey
            </span>
            <span
              aria-hidden
              className="text-sm transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
