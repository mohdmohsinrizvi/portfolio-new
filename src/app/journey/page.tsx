import type { Metadata } from "next";
import Link from "next/link";
import { milestones, credentials, kindLabels } from "@/data/journey";
import { SplitText, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Journey — MOHSIN",
  description:
    "Coursework, community roles, competition results, credentials and independent research — the full timeline behind the work.",
};

const kindAccent = {
  education: "text-champagne",
  work: "text-signal-soft",
  community: "text-teal-soft",
  recognition: "text-ember",
  credential: "text-silver",
} as const;

export default function JourneyPage() {
  return (
    <section
      data-chapter="Journey"
      data-atmo="#0d0c12|#14121c|rgba(184,166,140,0.14)"
      className="section relative z-(--z-content) pt-[clamp(120px,18vh,210px)]"
    >
      <div className="shell">
        <p className="u-meta mb-5 text-champagne/90">Journey</p>
        <h1 className="u-wordmark max-w-[12ch] text-[clamp(3.2rem,11vw,9rem)] text-bone">
          <SplitText text="In order." stagger={0.03} />
        </h1>

        <Reveal delay={0.12} className="mt-6 max-w-[54ch]">
          <p className="u-lead text-silver">
            Eight milestones and {credentials.length} credentials, each with its context
            kept intact — including the ones that are often described less carefully than
            they should be.
          </p>
        </Reveal>

        <ol className="mt-16 border-t border-bone/12">
          {milestones.map((m, i) => (
            <li key={m.id}>
              <Reveal delay={Math.min(i * 0.05, 0.3)}>
                <article className="grid gap-x-[var(--gutter)] gap-y-3 border-b border-bone/12 py-9 transition-colors duration-(--dur-base) hover:border-bone/25 lg:grid-cols-12">
                  <div className="lg:col-span-3">
                    <p className="u-meta text-bone/40">{m.period}</p>
                    <p className={`u-meta mt-1 ${kindAccent[m.kind]}`}>
                      {kindLabels[m.kind]}
                    </p>
                  </div>

                  <div className="lg:col-span-6">
                    <h2 className="u-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-tight text-bone">
                      {m.title}
                    </h2>
                    <p className="u-meta mt-1.5 text-silver/80">{m.org}</p>
                    <p className="mt-4 max-w-[60ch] text-[0.97rem] leading-relaxed text-silver">
                      {m.body}
                    </p>
                  </div>

                  <div className="lg:col-span-2 lg:col-start-11 lg:text-right">
                    {m.evidence ? (
                      m.evidence.href?.startsWith("/") ? (
                        <Link
                          href={m.evidence.href}
                          className="u-meta u-hairline-link inline-block text-bone/60 hover:text-bone"
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

        <Reveal delay={0.1} className="mt-20">
          <p className="u-meta mb-6 text-bone/40">Credentials & simulations</p>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-3">
            {credentials.map((c) => (
              <li key={c.name} className="flex flex-col justify-between gap-3 bg-void/80 p-6">
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

        <div className="mt-16 flex flex-wrap gap-6">
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 border-b border-bone/25 pb-1.5 transition-colors hover:border-bone"
          >
            <span className="u-meta text-bone/75 group-hover:text-bone">See the work</span>
            <span aria-hidden className="text-sm transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 border-b border-bone/25 pb-1.5 transition-colors hover:border-bone"
          >
            <span className="u-meta text-bone/75 group-hover:text-bone">About the person</span>
            <span aria-hidden className="text-sm transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
