import type { Metadata } from "next";
import Link from "next/link";
import { projects, categories, statusLabels } from "@/data/projects";
import { CoverImage } from "@/components/ui/CoverImage";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { pad } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Work — MOHSIN",
  description:
    "The full project archive: web applications, applied machine learning, firmware, research and interactive experiments by Syed Mohd Mohsin Rizvi.",
};

export default function WorkIndexPage() {
  return (
    <>
      <section
        data-chapter="Work"
        data-atmo="#0a0c12|#10131b|rgba(146,135,234,0.14)"
        className="section relative z-(--z-content) pt-[clamp(120px,18vh,210px)]"
      >
        <div className="shell">
          <p className="u-meta mb-5 text-signal/80">Archive</p>
          <h1 className="u-wordmark max-w-[12ch] text-[clamp(3.2rem,11vw,9rem)] text-bone">
            <SplitText text="Every project." stagger={0.03} />
          </h1>
          <Reveal delay={0.12} className="mt-6 max-w-[52ch]">
            <p className="u-lead text-silver">
              {projects.length} entries — deployed products, competition work, firmware,
              prototypes and open research. Each one carries its own context.
            </p>
          </Reveal>

          <div className="hairline mt-14" />

          <ul className="grid gap-px bg-bone/12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.slug} className="bg-void/85">
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex h-full flex-col p-6 transition-colors duration-(--dur-base) hover:bg-carbon/70 sm:p-7"
                  data-cursor="VIEW"
                >
                  <div className="mb-5 overflow-hidden rounded-xl border border-bone/10">
                    <CoverImage
                      cover={p.cover}
                      index={i + 1}
                      label={p.category}
                      alt=""
                      priority={i < 3}
                      className="aspect-[4/3] w-full object-cover opacity-80 transition-[opacity,transform] duration-(--dur-slow) ease-(--ease-out-expo) group-hover:scale-[1.03] group-hover:opacity-100"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <p className="u-meta text-bone/35">{pad(i + 1)}</p>
                    <p className="u-meta text-bone/40">{p.year ?? "—"}</p>
                  </div>

                  <h2 className="u-display mt-3 text-[clamp(1.35rem,2.2vw,1.85rem)] leading-tight text-bone">
                    {p.title}
                  </h2>
                  <p className="u-meta mt-1 text-champagne/80">{p.category}</p>

                  <p className="mt-4 flex-1 text-[0.93rem] leading-relaxed text-silver/90">
                    {p.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="u-meta rounded-full border border-bone/18 px-2.5 py-1 text-bone/50">
                      {p.statusLabel ?? statusLabels[p.status]}
                    </span>
                    {p.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="u-meta rounded-full border border-bone/10 px-2.5 py-1 text-bone/30"
                      >
                        {t}
                      </span>
                    ))}
                    <span
                      aria-hidden
                      className="ml-auto text-sm text-bone/40 transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="u-meta mt-10 text-bone/30">
            Categories present: {categories.join(" · ")}
          </p>
        </div>
      </section>
    </>
  );
}
