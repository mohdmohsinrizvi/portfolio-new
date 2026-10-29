"use client";

import { useEffect, useMemo, useState } from "react";

/* Deterministic graph generation — same seed always yields the same graph. */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type GNode = { id: number; x: number; y: number };
type GEdge = { a: number; b: number; w: number };
type Graph = { nodes: GNode[]; edges: GEdge[]; adj: Map<number, { to: number; w: number }[]> };

const N = 26;

function buildGraph(seed: number): Graph {
  const rand = mulberry32(seed);
  const nodes: GNode[] = Array.from({ length: N }, (_, i) => {
    const ring = i < 18 ? 0 : 1;
    const count = ring === 0 ? 18 : 8;
    const idx = ring === 0 ? i : i - 18;
    const angle = (idx / count) * Math.PI * 2 - Math.PI / 2;
    const radius = ring === 0 ? 0.34 : 0.15;
    return {
      id: i,
      x: 50 + Math.cos(angle) * radius * 100 + (rand() - 0.5) * 5,
      y: 50 + Math.sin(angle) * radius * 100 + (rand() - 0.5) * 5,
    };
  });

  const adj = new Map<number, { to: number; w: number }[]>();
  nodes.forEach((n) => adj.set(n.id, []));

  const add = (a: number, b: number) => {
    const w = Math.round((0.6 + rand() * 4.4) * 10) / 10;
    adj.get(a)!.push({ to: b, w });
    adj.get(b)!.push({ to: a, w });
  };

  // ring + spokes, plus a few long-range links
  for (let i = 0; i < N; i++) add(i, (i + 1) % N);
  for (let i = 0; i < N; i += 3) add(i, (i + 9) % N);
  for (let k = 0; k < 8; k++) {
    add(Math.floor(rand() * N), Math.floor(rand() * N));
  }

  const edges: GEdge[] = [];
  const seen = new Set<string>();
  for (const [from, list] of adj) {
    for (const { to, w } of list) {
      const key = from < to ? `${from}-${to}` : `${to}-${from}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a: from, b: to, w });
    }
  }

  return { nodes, edges, adj };
}

type Step = { visited: number[]; frontier: number[]; dist: Map<number, number> };

function bfsSteps(g: Graph, source: number, target: number): Step[] {
  const visited: number[] = [];
  const seenSet = new Set<number>([source]);
  let frontier = [source];
  const steps: Step[] = [{ visited: [...visited], frontier: [...frontier], dist: new Map() }];
  while (frontier.length) {
    const next: number[] = [];
    for (const u of frontier) {
      if (u === target) break;
      for (const { to } of g.adj.get(u) ?? []) {
        if (!seenSet.has(to)) {
          seenSet.add(to);
          next.push(to);
        }
      }
    }
    visited.push(...frontier);
    frontier = next;
    steps.push({ visited: [...visited], frontier: [...frontier], dist: new Map() });
    if (seenSet.has(target)) break;
  }
  return steps;
}

function dijkstraSteps(g: Graph, source: number, target: number): Step[] {
  const dist = new Map<number, number>([[source, 0]]);
  const visited: number[] = [];
  const done = new Set<number>();
  const steps: Step[] = [];

  while (true) {
    let u = -1;
    let best = Infinity;
    for (const [id, d] of dist) {
      if (!done.has(id) && d < best) {
        best = d;
        u = id;
      }
    }
    if (u === -1) break;
    done.add(u);
    visited.push(u);
    for (const { to, w } of g.adj.get(u) ?? []) {
      const nd = best + w;
      if (nd < (dist.get(to) ?? Infinity)) dist.set(to, nd);
    }
    const frontier = [...dist.keys()].filter((id) => !done.has(id));
    steps.push({ visited: [...visited], frontier, dist: new Map(dist) });
    if (u === target) break;
  }
  return steps;
}

export function GraphSearch() {
  const [seed, setSeed] = useState(7);
  const graph = useMemo(() => buildGraph(seed), [seed]);
  const source = 0;
  const target = 13;

  const [algo, setAlgo] = useState<"bfs" | "dijkstra">("bfs");
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = useMemo(
    () => (algo === "bfs" ? bfsSteps(graph, source, target) : dijkstraSteps(graph, source, target)),
    [algo, graph],
  );

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [algo, seed]);

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStepIdx((s) => s + 1), 260);
    return () => window.clearTimeout(id);
  }, [playing, stepIdx, steps.length]);

  const current = steps[Math.min(stepIdx, steps.length - 1)]!;
  const reached = current.visited.includes(target);
  const touched = current.visited.length;

  const colour = (id: number) => {
    if (id === source) return "#4f9aa2";
    if (id === target) return "#d97757";
    if (current.frontier.includes(id)) return "#9287ea";
    if (current.visited.includes(id)) return "#b8a68c";
    return "#ece8df";
  };
  const opacity = (id: number) =>
    id === source || id === target || current.frontier.includes(id) || current.visited.includes(id)
      ? 1
      : 0.28;

  return (
    <div className="rounded-2xl border border-bone/12 bg-carbon/30 p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="u-meta text-champagne/80">Experiment 02</p>
          <h3 className="u-display mt-1 text-[clamp(1.4rem,2.4vw,1.9rem)] text-bone">
            Graph Search
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["bfs", "dijkstra"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlgo(a)}
              aria-pressed={algo === a}
              className={`u-meta rounded-full border px-3 py-1.5 transition-colors ${
                algo === a
                  ? "border-signal/70 bg-signal/15 text-bone"
                  : "border-bone/18 text-bone/45 hover:border-bone/40 hover:text-bone/80"
              }`}
            >
              {a === "bfs" ? "Breadth-first" : "Dijkstra"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-bone/10 bg-void/70">
            <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
              {graph.edges.map((e) => {
                const a = graph.nodes[e.a]!;
                const b = graph.nodes[e.b]!;
                const live =
                  (current.visited.includes(e.a) && current.visited.includes(e.b)) ||
                  (current.visited.includes(e.a) && current.frontier.includes(e.b)) ||
                  (current.frontier.includes(e.a) && current.visited.includes(e.b));
                return (
                  <line
                    key={`${e.a}-${e.b}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={live ? "#9287ea" : "#ece8df"}
                    strokeOpacity={live ? 0.55 : 0.1}
                    strokeWidth={live ? 0.5 : 0.28}
                    className="transition-all duration-(--dur-base)"
                  />
                );
              })}
              {graph.nodes.map((n) => (
                <g key={n.id} style={{ opacity: opacity(n.id) }}>
                  <circle cx={n.x} cy={n.y} r={1.7} fill={colour(n.id)} />
                  <text
                    x={n.x}
                    y={n.y - 3}
                    fill="#ece8df"
                    fillOpacity={0.5}
                    fontSize={2.2}
                    fontFamily="var(--font-plex-mono), monospace"
                    textAnchor="middle"
                  >
                    {n.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (stepIdx >= steps.length - 1) setStepIdx(0);
                setPlaying((p) => !p);
              }}
              className="u-meta rounded-full bg-bone px-4 py-2 text-void transition-transform hover:-translate-y-0.5"
            >
              {playing ? "Pause" : stepIdx >= steps.length - 1 ? "Replay" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setStepIdx((s) => Math.min(s + 1, steps.length - 1));
              }}
              className="u-meta rounded-full border border-bone/22 px-4 py-2 text-bone/70 transition-colors hover:border-bone hover:text-bone"
            >
              Step
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setStepIdx(0);
              }}
              className="u-meta rounded-full border border-bone/22 px-4 py-2 text-bone/70 transition-colors hover:border-bone hover:text-bone"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="u-meta rounded-full border border-bone/22 px-4 py-2 text-bone/70 transition-colors hover:border-bone hover:text-bone"
            >
              Re-seed graph
            </button>
            <span className="u-meta ml-auto text-bone/40">seed {seed}</span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-bone/10 bg-void/60 p-5">
            <p className="u-meta text-bone/40">Step</p>
            <p className="u-wordmark mt-1 text-3xl text-bone">
              {String(Math.min(stepIdx + 1, steps.length)).padStart(2, "0")}
              <span className="text-bone/30"> / {String(steps.length).padStart(2, "0")}</span>
            </p>

            <div className="hairline my-5" />

            <dl className="grid gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="u-meta text-bone/40">Algorithm</dt>
                <dd className="text-[0.95rem] text-bone/85">
                  {algo === "bfs" ? "Breadth-first search" : "Dijkstra"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="u-meta text-bone/40">Nodes touched</dt>
                <dd className="u-wordmark text-xl text-bone">
                  {touched}
                  <span className="text-bone/30"> / {N}</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="u-meta text-bone/40">Reached target</dt>
                <dd className={reached ? "text-teal-bright" : "text-bone/40"}>
                  {reached ? "Yes" : "Not yet"}
                </dd>
              </div>
              {algo === "dijkstra" ? (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="u-meta text-bone/40">Best cost to target</dt>
                  <dd className="text-[0.95rem] text-bone/85">
                    {current.dist.get(target) !== undefined
                      ? current.dist.get(target)!.toFixed(1)
                      : "∞"}
                  </dd>
                </div>
              ) : (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="u-meta text-bone/40">Hop distance</dt>
                  <dd className="text-[0.95rem] text-bone/85">
                    {reached
                      ? steps.slice(0, stepIdx + 1).find((s) => s.visited.includes(target))
                          ?.visited.length ?? "—"
                      : "—"}
                  </dd>
                </div>
              )}
            </dl>

            <div className="hairline my-5" />

            <p className="u-meta mb-2 text-bone/40">Legend</p>
            <ul className="grid gap-1.5 text-[0.85rem] text-silver">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: "#4f9aa2" }} />{" "}
                Source ({source})
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: "#d97757" }} />{" "}
                Target ({target})
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: "#9287ea" }} />{" "}
                Frontier
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: "#b8a68c" }} />{" "}
                Visited
              </li>
            </ul>
          </div>

          <details className="mt-5 text-[0.9rem] leading-relaxed text-silver/85">
            <summary className="u-meta cursor-pointer text-bone/50 hover:text-bone">
              How it works
            </summary>
            <p className="mt-3">
              Breadth-first search expands in rings by hop count. Dijkstra expands in order
              of accumulated cost. On the same weighted graph the two frontiers look
              completely different — which is the whole point of putting them side by side.
              The graph is generated deterministically from a seed, so results are
              reproducible rather than decorative.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
