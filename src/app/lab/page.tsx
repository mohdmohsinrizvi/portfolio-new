import type { Metadata } from "next";
import { SplitText, Reveal } from "@/components/motion/Reveal";
import { LabExperiments } from "@/components/lab/LabExperiments";
import { experiments } from "@/data/lab";

export const metadata: Metadata = {
  title: "Laboratory — MOHSIN",
  description:
    "Interactive experiments: a verified sorting network, side-by-side BFS and Dijkstra, and a live entity-resolution pipeline — all running in your browser.",
};

export default function LabPage() {
  return (
    <section
      data-chapter="Laboratory"
      data-atmo="#0a1014|#0e151c|rgba(38,75,81,0.18)"
      className="section relative z-(--z-content) pt-[clamp(120px,18vh,210px)]"
    >
      <div className="shell">
        <p className="u-meta mb-5 text-teal-soft/90">The laboratory</p>
        <h1 className="u-wordmark max-w-[13ch] text-[clamp(3.2rem,11vw,9rem)] text-bone">
          <SplitText text="Things you can run." stagger={0.03} />
        </h1>

        <Reveal delay={0.12} className="mt-7 grid gap-8 lg:grid-cols-12">
          <p className="u-lead max-w-[54ch] text-silver lg:col-span-7">
            {experiments.filter((e) => e.status === "interactive").length} live
            experiments and {experiments.length - experiments.filter((e) => e.status === "interactive").length}{" "}
            supporting records. Each one is a small, honest reduction of a larger problem
            — generated, animated and verifiable, with no server involved.
          </p>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-2xl border border-bone/12 bg-carbon/40 p-5">
              <p className="u-meta mb-3 text-bone/40">What runs here</p>
              <ul className="grid gap-2.5 text-[0.9rem] leading-relaxed text-silver">
                <li>Batcher&apos;s odd–even merge network with exhaustive verification</li>
                <li>Breadth-first search and Dijkstra over one seeded graph</li>
                <li>Normalisation plus three similarity signals, scored live</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="hairline mt-14" />

        <div className="mt-10">
          <LabExperiments />
        </div>
      </div>
    </section>
  );
}
