"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------
   Batcher's odd-even merge network, generated in-page.
   Combinatorics: pairs are then greedily packed into levels, which is
   the standard way to recover a schedule from the flat comparator list.
------------------------------------------------------------------ */

type Pair = [number, number];

function* oddEvenMerge(lo: number, n: number, r: number): Generator<Pair> {
  const m = r * 2;
  if (m < n) {
    yield* oddEvenMerge(lo, n, m);
    yield* oddEvenMerge(lo + r, n, m);
    for (let i = lo + r; i < lo + n - r; i += m) yield [i, i + r];
  } else {
    yield [lo, lo + r];
  }
}

function* oddEvenMergeSort(lo: number, n: number): Generator<Pair> {
  if (n > 1) {
    const m = n >> 1;
    yield* oddEvenMergeSort(lo, m);
    yield* oddEvenMergeSort(lo + m, m);
    yield* oddEvenMerge(lo, n, 1);
  }
}

function buildLevels(n: number): Pair[][] {
  const comps: Pair[] = [...oddEvenMergeSort(0, n)];
  const lastUse = new Array<number>(n).fill(-1);
  const levels: Pair[][] = [];
  for (const [a, b] of comps) {
    const level = Math.max(lastUse[a]!, lastUse[b]!) + 1;
    if (!levels[level]) levels[level] = [];
    levels[level]!.push([a, b]);
    lastUse[a] = level;
    lastUse[b] = level;
  }
  return levels;
}

function* permutations(n: number): Generator<number[]> {
  const arr = Array.from({ length: n }, (_, i) => i);
  function* perm(l: number): Generator<number[]> {
    if (l === arr.length) {
      yield arr.slice();
      return;
    }
    for (let i = l; i < arr.length; i++) {
      [arr[l], arr[i]] = [arr[i]!, arr[l]!];
      yield* perm(l + 1);
      [arr[l], arr[i]] = [arr[i]!, arr[l]!];
    }
  }
  yield* perm(0);
}

function applyNetwork(input: number[], levels: Pair[][]): number[] {
  const a = input.slice();
  for (const level of levels) {
    for (const [i, j] of level) {
      if (a[i]! > a[j]!) [a[i], a[j]] = [a[j]!, a[i]!];
    }
  }
  return a;
}

const SIZES = [4, 8, 16] as const;
type Size = (typeof SIZES)[number];

export function SortingNetwork() {
  const [size, setSize] = useState<Size>(8);
  const levels = useMemo(() => buildLevels(size), [size]);

  const [values, setValues] = useState<number[]>(() =>
    Array.from({ length: 8 }, (_, i) => i),
  );
  const [step, setStep] = useState(0); // 0..levels.length; 0 = not started
  const [playing, setPlaying] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [verdict, setVerdict] = useState<
    { ok: boolean; checked: number; note: string } | null
  >(null);

  const flat = useMemo(() => levels.flat(), [levels]);
  const total = flat.length;

  const shuffle = useCallback(
    (n: number, shuffleIt: boolean) => {
      const base = Array.from({ length: n }, (_, i) => i + 1);
      if (shuffleIt) {
        for (let i = base.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [base[i], base[j]] = [base[j]!, base[i]!];
        }
      }
      setValues(base);
      setStep(0);
      setSeeded(shuffleIt);
    },
    [],
  );

  useEffect(() => {
    shuffle(size, false);
    setPlaying(false);
    setVerdict(null);
  }, [size, shuffle]);

  /* replay from the start up to `target` steps */
  const stateAt = useCallback(
    (target: number) => {
      const a = Array.from({ length: size }, (_, i) => i + 1);
      const input = seeded ? values.slice() : a;
      const arr = input.slice();
      let t = 0;
      for (const level of levels) {
        if (t >= target) break;
        for (const [i, j] of level) {
          if (arr[i]! > arr[j]!) [arr[i], arr[j]] = [arr[j]!, arr[i]!];
        }
        t++;
      }
      return arr;
    },
    [levels, seeded, size, values],
  );

  useEffect(() => {
    if (!playing) return;
    if (step >= levels.length) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), 420);
    return () => window.clearTimeout(id);
  }, [playing, step, levels.length]);

  const current = stateAt(step);
  const sorted = step >= levels.length;

  const verify = () => {
    const maxChecked = size <= 8 ? Infinity : 20000;
    let checked = 0;
    let failed: number[] | null = null;
    if (size <= 8) {
      for (const p of permutations(size)) {
        checked++;
        const out = applyNetwork(p, levels);
        const expect = p.slice().sort((x, y) => x - y);
        if (out.some((v, i) => v !== expect[i])) {
          failed = p;
          break;
        }
      }
    } else {
      for (let k = 0; k < maxChecked; k++) {
        const p = Array.from({ length: size }, (_, i) => i);
        for (let i = p.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [p[i], p[j]] = [p[j]!, p[i]!];
        }
        checked++;
        const out = applyNetwork(p, levels);
        const expect = p.slice().sort((x, y) => x - y);
        if (out.some((v, i) => v !== expect[i])) {
          failed = p;
          break;
        }
      }
    }
    setVerdict({
      ok: !failed,
      checked,
      note: failed
        ? `Failed on [${failed.join(", ")}] — this network is broken.`
        : size <= 8
          ? `All ${checked} permutations sorted. The network is correct for n=${size}.`
          : `${checked.toLocaleString()} random permutations sorted. Correct by sampling (exhaustive is only feasible up to n=8).`,
    });
  };

  const W = 760;
  const H = 190 + levels.length * 26;
  const padX = 46;
  const padY = 42;
  const levelGap = 30;

  return (
    <div className="rounded-2xl border border-bone/12 bg-carbon/30 p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="u-meta text-champagne/80">Experiment 01</p>
          <h3 className="u-display mt-1 text-[clamp(1.4rem,2.4vw,1.9rem)] text-bone">
            Sorting Network
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={`u-meta rounded-full border px-3 py-1.5 transition-colors ${
                size === s
                  ? "border-signal/70 bg-signal/15 text-bone"
                  : "border-bone/18 text-bone/45 hover:border-bone/40 hover:text-bone/80"
              }`}
            >
              n={s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-bone/10 bg-void/70 p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-label={`Sorting network with ${size} wires and ${levels.length} levels`}
        >
          {/* wires */}
          {Array.from({ length: size }, (_, i) => (
            <g key={i}>
              <line
                x1={padX}
                y1={padY + i * levelGap}
                x2={W - padX}
                y2={padY + i * levelGap}
                stroke="#ece8df"
                strokeOpacity={0.14}
                strokeWidth={1}
              />
              <text
                x={18}
                y={padY + i * levelGap + 4}
                fill="#ece8df"
                fillOpacity={0.55}
                fontSize={11}
                fontFamily="var(--font-plex-mono), monospace"
                textAnchor="middle"
              >
                {current[i]}
              </text>
            </g>
          ))}

          {/* comparators */}
          {levels.map((level, li) => {
            const x = padX + li * ((W - padX * 2) / Math.max(levels.length - 1, 1));
            const done = step > li;
            const active = step === li + 1;
            return (
              <g key={li}>
                {level.map(([a, b]) => {
                  const y1 = padY + a * levelGap;
                  const y2 = padY + b * levelGap;
                  const on = active;
                  const was = done;
                  return (
                    <g key={`${a}-${b}`}>
                      <line
                        x1={x}
                        y1={y1}
                        x2={x}
                        y2={y2}
                        stroke={on ? "#9287ea" : was ? "#4f9aa2" : "#ece8df"}
                        strokeOpacity={on ? 1 : was ? 0.55 : 0.2}
                        strokeWidth={on ? 2.5 : 1.6}
                        strokeLinecap="round"
                        className="transition-all duration-(--dur-base)"
                      />
                      {on ? (
                        <>
                          <circle cx={x} cy={y1} r={3.5} fill="#9287ea" />
                          <circle cx={x} cy={y2} r={3.5} fill="#9287ea" />
                        </>
                      ) : null}
                    </g>
                  );
                })}
                <text
                  x={x}
                  y={padY + (size - 1) * levelGap + 20}
                  fill="#ece8df"
                  fillOpacity={active ? 0.9 : 0.3}
                  fontSize={10}
                  fontFamily="var(--font-plex-mono), monospace"
                  textAnchor="middle"
                >
                  {li + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            if (sorted) {
              shuffle(size, true);
              setStep(1);
            }
            setPlaying((p) => !p);
          }}
          className="u-meta rounded-full bg-bone px-4 py-2 text-void transition-transform hover:-translate-y-0.5"
        >
          {playing ? "Pause" : sorted ? "Replay" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(s + 1, levels.length));
          }}
          className="u-meta rounded-full border border-bone/22 px-4 py-2 text-bone/70 transition-colors hover:border-bone hover:text-bone"
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            shuffle(size, true);
          }}
          className="u-meta rounded-full border border-bone/22 px-4 py-2 text-bone/70 transition-colors hover:border-bone hover:text-bone"
        >
          Shuffle input
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            shuffle(size, false);
          }}
          className="u-meta rounded-full border border-bone/22 px-4 py-2 text-bone/70 transition-colors hover:border-bone hover:text-bone"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={verify}
          className="u-meta rounded-full border border-signal/50 bg-signal/10 px-4 py-2 text-bone/85 transition-colors hover:border-signal hover:bg-signal/20"
        >
          Verify network
        </button>

        <span className="u-meta ml-auto text-bone/40">
          {total} comparators · {levels.length} levels · step {step}/{levels.length}
        </span>
      </div>

      {verdict ? (
        <p
          role="status"
          className={`mt-4 rounded-xl border p-4 text-[0.9rem] leading-relaxed ${
            verdict.ok
              ? "border-teal-bright/40 bg-teal/15 text-bone/85"
              : "border-ember/50 bg-ember/10 text-bone/90"
          }`}
        >
          <strong className="u-meta mr-2">
            {verdict.ok ? "Verified" : "Broken"}
          </strong>
          {verdict.note}
        </p>
      ) : null}

      <details className="mt-5 text-[0.9rem] leading-relaxed text-silver/85">
        <summary className="u-meta cursor-pointer text-bone/50 hover:text-bone">
          How it works
        </summary>
        <p className="mt-3 max-w-[70ch]">
          A sorting network is a fixed sequence of compare–exchange operations. Unlike a
          sorting algorithm it does not branch on data: the comparators are wired in
          advance, so the same comparisons always run whatever the input. This network is
          generated from Batcher&apos;s odd–even merge construction, then greedily packed
          into levels so that independent comparators share a step.
        </p>
        <p className="mt-3 max-w-[70ch]">
          Verification exhaustively checks every permutation for n ≤ 8 (40,320 cases for
          n=8) and samples random permutations above that — the same
          exhaustive-above-sampled discipline used by the Algorithm Discovery Lab project.
        </p>
      </details>
    </div>
  );
}
