"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { skillAxes } from "@/data/lab";
import { projectBySlug } from "@/data/projects";
import { Reveal, SplitText } from "@/components/motion/Reveal";


type Node = {
  label: string;
  body: string;
  projects: string[];
  x: number;
  y: number;
  r: number;
  links: number[];
};

/* deterministic constellation: same layout every load */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildConstellation(): Node[] {
  const rand = mulberry32(20260419);
  const n = skillAxes.length;
  const nodes: Node[] = skillAxes.map((axis, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const radius = 30 + rand() * 8;
    return {
      label: axis.label,
      body: axis.body,
      projects: axis.projects,
      x: 50 + Math.cos(angle) * radius * (1.05 + rand() * 0.15),
      y: 50 + Math.sin(angle) * radius * (0.78 + rand() * 0.2),
      r: 0,
      links: [],
    };
  });

  // connect each axis to every other axis that shares at least one project
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      if (i >= j) return;
      if (a.projects.some((p) => b.projects.includes(p))) {
        a.links.push(j);
        b.links.push(i);
      }
    });
  });

  const degrees = nodes.map((node) => node.links.length);
  const max = Math.max(...degrees, 1);
  nodes.forEach((node, i) => {
    node.r = 3.2 + (degrees[i]! / max) * 3.6;
  });
  return nodes;
}

/** Chapter 03 — THE LABORATORY. */
export function Laboratory() {
  const nodes = useMemo(() => buildConstellation(), []);
  const [active, setActive] = useState(0);
  const current = nodes[active]!;
  const linkedProjects = current.projects
    .map((slug) => projectBySlug(slug))
    .filter(Boolean);

  return (
    <section
      id="laboratory"
      data-chapter="Laboratory"
      data-atmo="#0a1014|#0e151c|rgba(38,75,81,0.16)"
      aria-labelledby="lab-heading"
      className="section relative z-(--z-content)"
    >
      <div className="shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="u-meta mb-5 text-teal-soft/90">03 — The laboratory</p>
            <h2
              id="lab-heading"
              className="u-display max-w-[14ch] text-[clamp(2.6rem,6.5vw,5.4rem)] text-bone"
            >
              <SplitText text="Where the work connects." stagger={0.03} />
            </h2>
          </div>
          <Reveal delay={0.08}>
            <p className="u-lead max-w-[34ch] text-silver">
              Seven axes, one archive. Select a node to see what it is made of — and
              which projects sit underneath it.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* constellation */}
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-bone/12 bg-carbon/40">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full"
                aria-hidden
              >
                <defs>
                  <radialGradient id="lab-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#264b51" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#264b51" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100" height="100" fill="url(#lab-glow)" />

                {/* connectors */}
                {nodes.flatMap((node, i) =>
                  node.links.map((j) => {
                    const other = nodes[j]!;
                    const on =
                      i === active || j === active;
                    const mx = (node.x + other.x) / 2 + Math.sin(i * 1.3 + j) * 1.2;
                    const my = (node.y + other.y) / 2 + Math.cos(i + j * 1.1) * 1.2;
                    return (
                      <path
                        key={`${i}-${j}`}
                        d={`M ${node.x} ${node.y} Q ${mx} ${my} ${other.x} ${other.y}`}
                        fill="none"
                        stroke={on ? "#9287ea" : "#ece8df"}
                        strokeOpacity={on ? 0.7 : 0.1}
                        strokeWidth={on ? 0.45 : 0.22}
                        className="transition-[stroke,stroke-opacity,stroke-width] duration-(--dur-base)"
                      />
                    );
                  }),
                )}

                {/* nodes */}
                {nodes.map((node, i) => {
                  const on = i === active;
                  return (
                    <g
                      key={node.label}
                      className="lab-node"
                      data-lab-node
                      style={{ "--i": i } as React.CSSProperties}
                      transform={`translate(${node.x} ${node.y})`}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                    >
                      <circle
                        r={node.r + (on ? 2.4 : 0.9)}
                        fill={on ? "#9287ea" : "#ece8df"}
                        fillOpacity={on ? 0.16 : 0.05}
                        className="transition-all duration-(--dur-base)"
                      />
                      <circle
                        r={node.r * 0.34}
                        fill={on ? "#9287ea" : "#ece8df"}
                        fillOpacity={on ? 1 : 0.55}
                        className="transition-all duration-(--dur-base)"
                      />
                      <text
                        y={node.r + 4.2}
                        textAnchor="middle"
                        fill={on ? "#ece8df" : "#a4a7ae"}
                        fillOpacity={on ? 1 : 0.6}
                        style={{
                          fontSize: "2.6px",
                          fontFamily: "var(--font-plex-mono), monospace",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Reveal>

          {/* detail panel */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-bone/12 bg-carbon/30 p-6 sm:p-8">
                <p className="u-meta mb-3 text-teal-soft/80">
                  {padIndex(active + 1)} / {padIndex(nodes.length)}
                </p>
                <h3 className="u-display text-[clamp(1.6rem,3.2vw,2.4rem)] text-bone">
                  {current.label}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-silver">
                  {current.body}
                </p>

                <div className="hairline my-6" />

                <p className="u-meta mb-3 text-bone/40">Projects on this axis</p>
                <ul className="grid gap-2">
                  {linkedProjects.map((p) => (
                    <li key={p!.slug}>
                      <Link
                        href={`/work/${p!.slug}`}
                        className="group flex items-baseline justify-between gap-4 border-b border-bone/10 py-2.5 transition-colors hover:border-bone/35"
                        data-cursor="VIEW"
                      >
                        <span className="text-[0.95rem] text-bone/85 group-hover:text-bone">
                          {p!.title}
                        </span>
                        <span className="u-meta shrink-0 text-bone/35">{p!.year}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {nodes.map((n, i) => (
                    <button
                      key={n.label}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={i === active}
                      className={`u-meta rounded-full border px-3 py-1.5 transition-colors duration-(--dur-base) ${
                        i === active
                          ? "border-signal/70 bg-signal/15 text-bone"
                          : "border-bone/18 text-bone/45 hover:border-bone/40 hover:text-bone/80"
                      }`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14} className="mt-6">
              <Link
                href="/lab"
                className="group inline-flex items-center gap-3 border-b border-bone/25 pb-1.5 transition-colors hover:border-bone"
                data-cursor="VIEW"
              >
                <span className="u-meta text-bone/75 group-hover:text-bone">
                  Enter the laboratory
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
        </div>
      </div>
    </section>
  );
}

function padIndex(n: number) {
  return n < 10 ? `0${n}` : String(n);
}
