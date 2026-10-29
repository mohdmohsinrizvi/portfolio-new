"use client";

import { useMemo, useState } from "react";

const SUFFIXES = new Set([
  "pvt",
  "pvtltd",
  "limited",
  "ltd",
  "llc",
  "inc",
  "co",
  "corp",
  "corporation",
  "company",
  "private",
  "the",
  "and",
  "&",
]);

/** Normalise first — most matching quality lives right here. */
function normalise(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !SUFFIXES.has(t));
}

function tokenOverlap(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  const union = sa.size + sb.size - inter;
  return union ? inter / union : 0;
}

function ngrams(tokens: string[], n: number): Map<string, number> {
  const counts = new Map<string, number>();
  const joined = tokens.join(" ") + " ";
  for (let i = 0; i + n <= joined.length; i++) {
    const g = joined.slice(i, i + n).trim();
    if (g.length < n) continue;
    counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  return counts;
}

/** Sørensen–Dice over character n-grams. */
function charSimilarity(a: string[], b: string[], n: number): number {
  const ga = ngrams(a, n);
  const gb = ngrams(b, n);
  if (!ga.size || !gb.size) return 0;
  let inter = 0;
  for (const [g, c] of ga) inter += Math.min(c, gb.get(g) ?? 0);
  let totalA = 0;
  for (const c of ga.values()) totalA += c;
  let totalB = 0;
  for (const c of gb.values()) totalB += c;
  return (2 * inter) / (totalA + totalB);
}

const THRESHOLD = 0.5;
const DEFAULT_A = "Shree Balaji Traders Pvt Ltd";
const DEFAULT_B = "balaji traders private limited";

export function EntityResolution() {
  const [a, setA] = useState(DEFAULT_A);
  const [b, setB] = useState(DEFAULT_B);

  const result = useMemo(() => {
    const na = normalise(a);
    const nb = normalise(b);
    const overlap = tokenOverlap(na, nb);
    const digrams = charSimilarity(na, nb, 2);
    const trigrams = charSimilarity(na, nb, 3);
    const score = 0.4 * overlap + 0.3 * digrams + 0.3 * trigrams;
    return { na, nb, overlap, digrams, trigrams, score, match: score >= THRESHOLD };
  }, [a, b]);

  const pct = (v: number) => `${Math.round(v * 100)}%`;

  const rows = [
    { k: "Token overlap (Jaccard)", v: result.overlap, w: "40%", n: "Shared vocabulary after normalisation." },
    { k: "Character 2-gram Dice", v: result.digrams, w: "30%", n: "Catches near-typos and abbreviation drift." },
    { k: "Character 3-gram Dice", v: result.trigrams, w: "30%", n: "More conservative, punishes short-token noise." },
  ];

  return (
    <div className="rounded-2xl border border-bone/12 bg-carbon/30 p-5 sm:p-7">
      <div className="mb-5">
        <p className="u-meta text-champagne/80">Experiment 03</p>
        <h3 className="u-display mt-1 text-[clamp(1.4rem,2.4vw,1.9rem)] text-bone">
          Entity Resolution
        </h3>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="u-meta text-bone/45">Record A</span>
          <input
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-2 w-full rounded-xl border border-bone/18 bg-void/70 px-4 py-3 text-[0.98rem] text-bone outline-none transition-colors focus:border-signal/70"
            spellCheck={false}
          />
        </label>
        <label className="block">
          <span className="u-meta text-bone/45">Record B</span>
          <input
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-2 w-full rounded-xl border border-bone/18 bg-void/70 px-4 py-3 text-[0.98rem] text-bone outline-none transition-colors focus:border-signal/70"
            spellCheck={false}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        {/* normalised forms */}
        <div className="lg:col-span-2">
          <p className="u-meta mb-3 text-bone/40">Normalised tokens</p>
          <div className="grid gap-4">
            <div>
              <p className="u-meta mb-2 text-signal/70">A</p>
              <div className="flex flex-wrap gap-1.5">
                {result.na.length ? (
                  result.na.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="u-meta rounded-full border border-signal/35 bg-signal/10 px-2.5 py-1 text-bone/80"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="u-meta text-bone/30">empty</span>
                )}
              </div>
            </div>
            <div>
              <p className="u-meta mb-2 text-teal-soft/80">B</p>
              <div className="flex flex-wrap gap-1.5">
                {result.nb.length ? (
                  result.nb.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="u-meta rounded-full border border-teal-bright/35 bg-teal/30 px-2.5 py-1 text-bone/80"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="u-meta text-bone/30">empty</span>
                )}
              </div>
            </div>
          </div>

          <p className="u-meta mt-5 leading-relaxed text-bone/35">
            Suffix words (pvt, ltd, llc, inc, co…) and punctuation are dropped before
            anything is compared — normalisation does most of the work.
          </p>
        </div>

        {/* signals */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-bone/10 bg-void/60 p-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="u-meta text-bone/40">Combined score</p>
              <p
                className={`u-wordmark text-4xl ${result.match ? "text-teal-bright" : "text-champagne"}`}
                aria-live="polite"
              >
                {result.score.toFixed(3)}
              </p>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-bone/10">
              <div
                className="h-full rounded-full transition-[width,background-color] duration-(--dur-base)"
                style={{
                  width: `${Math.max(2, result.score * 100)}%`,
                  background: result.match ? "#4f9aa2" : "#b8a68c",
                }}
              />
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="u-meta text-bone/30">0.000</span>
              <span className="u-meta text-bone/30">
                threshold {THRESHOLD.toFixed(2)}
              </span>
              <span className="u-meta text-bone/30">1.000</span>
            </div>

            <p
              role="status"
              className={`u-meta mt-4 rounded-lg border px-3 py-2 ${
                result.match
                  ? "border-teal-bright/45 bg-teal/20 text-bone/90"
                  : "border-bone/20 bg-bone/5 text-bone/60"
              }`}
            >
              {result.match ? "Likely match" : "Likely non-match"}
            </p>

            <div className="hairline my-5" />

            <ul className="grid gap-4">
              {rows.map((r) => (
                <li key={r.k}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.92rem] text-bone/85">{r.k}</span>
                    <span className="u-meta text-bone/45">
                      × {r.w} = {(r.v * (parseInt(r.w, 10) / 100)).toFixed(3)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bone/8">
                    <div
                      className="h-full rounded-full bg-signal/80 transition-[width] duration-(--dur-base)"
                      style={{ width: `${r.v * 100}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[0.78rem] leading-snug text-bone/30">{r.n}</span>
                    <span className="u-meta text-bone/45">{pct(r.v)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <details className="mt-5 text-[0.9rem] leading-relaxed text-silver/85">
            <summary className="u-meta cursor-pointer text-bone/50 hover:text-bone">
              How it works
            </summary>
            <p className="mt-3">
              A deliberately small window into the pipeline built for the Amazon ML
              Challenge: normalise first, compare several signals rather than one, then
              apply a threshold. Editing either record updates everything live.
            </p>
            <p className="mt-3 text-bone/45">
              An educational reduction of the idea — not the competition system itself.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
