"use client";

import { useState } from "react";
import { experiments, labDomains, type LabDomain } from "@/data/lab";
import { SortingNetwork } from "@/components/lab/SortingNetwork";
import { GraphSearch } from "@/components/lab/GraphSearch";
import { EntityResolution } from "@/components/lab/EntityResolution";
import Link from "next/link";

function ExperimentBody({ id }: { id: string }) {
  if (id === "sorting-network") return <SortingNetwork />;
  if (id === "graph-search") return <GraphSearch />;
  if (id === "entity-resolution") return <EntityResolution />;

  const exp = experiments.find((e) => e.id === id);
  if (!exp) return null;
  return (
    <div className="rounded-2xl border border-bone/12 bg-carbon/30 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="u-meta text-champagne/80">Experiment {exp.index}</p>
          <h3 className="u-display mt-1 text-[clamp(1.4rem,2.4vw,1.9rem)] text-bone">
            {exp.title}
          </h3>
        </div>
        <span className="u-meta rounded-full border border-bone/20 px-3 py-1.5 text-bone/55">
          {exp.statusLabel}
        </span>
      </div>

      <div className="hairline my-6" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4">
            {exp.body.map((p, i) => (
              <p key={i} className="max-w-[68ch] text-[0.98rem] leading-relaxed text-silver">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {exp.repo ? (
              <a
                href={exp.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="u-meta rounded-full bg-bone px-4 py-2 text-void transition-transform hover:-translate-y-0.5"
              >
                Repository ↗
              </a>
            ) : null}
            {exp.repo ? (
              <span className="u-meta rounded-full border border-bone/20 px-4 py-2 text-bone/50">
                Runs outside this page
              </span>
            ) : (
              <span className="u-meta rounded-full border border-bone/20 px-4 py-2 text-bone/50">
                Firmware / documentation
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="u-meta mb-3 text-bone/40">Technique</p>
          <ul className="flex flex-wrap gap-1.5">
            {exp.tech.map((t) => (
              <li
                key={t}
                className="u-meta rounded-full border border-bone/15 px-2.5 py-1 text-bone/55"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="hairline my-6" />

          <p className="u-meta mb-2 text-bone/40">Domain</p>
          <p className="text-[0.95rem] text-bone/80">{exp.domain}</p>
        </div>
      </div>
    </div>
  );
}

export function LabExperiments() {
  const [domain, setDomain] = useState<LabDomain>("All");
  const list = domain === "All" ? experiments : experiments.filter((e) => e.domain === domain);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="u-meta mr-2 text-bone/35">Filter</span>
        {labDomains.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDomain(d)}
            aria-pressed={domain === d}
            className={`u-meta rounded-full border px-3.5 py-1.5 transition-colors duration-(--dur-base) ${
              domain === d
                ? "border-signal/70 bg-signal/15 text-bone"
                : "border-bone/18 text-bone/45 hover:border-bone/40 hover:text-bone/80"
            }`}
          >
            {d}
          </button>
        ))}
        <span className="u-meta ml-auto text-bone/30">
          {list.length} of {experiments.length}
        </span>
      </div>

      <div className="grid gap-6">
        {list.map((e) => (
          <section
            key={e.id}
            id={e.id}
            aria-label={e.title}
            className="scroll-mt-28"
            data-cursor={e.status === "interactive" ? "PLAY" : "OPEN"}
          >
            <ExperimentBody id={e.id} />
          </section>
        ))}
      </div>

      <div className="hairline my-14" />

      <div className="flex flex-wrap items-center justify-between gap-6">
        <p className="u-lead max-w-[46ch] text-silver">
          Everything on this page runs in your browser. Nothing is sent anywhere.
        </p>
        <Link
          href="/work"
          className="group inline-flex items-center gap-3 border-b border-bone/25 pb-1.5 transition-colors hover:border-bone"
          data-cursor="VIEW"
        >
          <span className="u-meta text-bone/75 group-hover:text-bone">
            See the full project archive
          </span>
          <span
            aria-hidden
            className="text-sm transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
