import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, projectBySlug } from "@/data/projects";
import { CoverImage } from "@/components/ui/CoverImage";
import { Reveal, SplitText } from "@/components/motion/Reveal";
import { getSiteUrl } from "@/lib/site";
import { pad } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  const url = `${getSiteUrl()}/work/${project.slug}`;
  return {
    title: `${project.title} — MOHSIN`,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} — MOHSIN`,
      description: project.summary,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — MOHSIN`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const related = project.related.map((s) => projectBySlug(s)).filter(Boolean);

  return (
    <article
      data-chapter={project.title}
      data-atmo="#0a0c12|#10131b|rgba(146,135,234,0.12)"
      className="relative z-(--z-content)"
    >
      {/* header */}
      <header className="section pt-[clamp(120px,18vh,210px)]">
        <div className="shell">
          <Link
            href="/work"
            className="u-meta u-hairline-link mb-8 inline-block text-bone/50 hover:text-bone"
          >
            ← All work
          </Link>

          <div className="grid gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="u-meta mb-4 text-signal/80">
                {pad(index + 1)} — {project.category}
                {project.year ? ` · ${project.year}` : ""}
              </p>
              <h1 className="u-wordmark text-[clamp(2.8rem,8vw,6.5rem)] text-bone">
                <SplitText text={project.title} stagger={0.03} />
              </h1>
              <p className="u-display mt-4 text-[clamp(1.2rem,2.6vw,2rem)] italic text-champagne">
                {project.subtitle}
              </p>
              <p className="u-lead mt-8 max-w-[52ch] text-silver">{project.summary}</p>

              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-bone/12 pt-6 sm:grid-cols-4">
                <div>
                  <dt className="u-meta text-bone/35">Status</dt>
                  <dd className="mt-1 text-[0.95rem] text-bone/85">{project.statusLabel}</dd>
                </div>
                <div>
                  <dt className="u-meta text-bone/35">Role</dt>
                  <dd className="mt-1 text-[0.95rem] text-bone/85">{project.role}</dd>
                </div>
                <div>
                  <dt className="u-meta text-bone/35">Stack</dt>
                  <dd className="mt-1 text-[0.95rem] text-bone/85">
                    {project.technologies.slice(0, 3).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="u-meta text-bone/35">Links</dt>
                  <dd className="mt-1 flex flex-wrap gap-3">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="u-meta u-hairline-link text-bone/70 hover:text-bone"
                      >
                        Live ↗
                      </a>
                    ) : null}
                    {project.repositoryUrl ? (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="u-meta u-hairline-link text-bone/70 hover:text-bone"
                      >
                        Repo ↗
                      </a>
                    ) : (
                      <span className="u-meta text-bone/25">No public source</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-bone/12">
                <CoverImage
                  cover={project.cover}
                  index={index + 1}
                  label={project.category}
                  alt={`Procedural cover artwork for ${project.title}`}
                  priority
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <p className="u-meta mt-3 text-bone/30">
                Cover generated procedurally — no stock imagery used.
              </p>
            </Reveal>
          </div>
        </div>
      </header>

      {/* body */}
      <div className="section pt-0">
        <div className="shell">
          <div className="grid gap-x-[var(--gutter)] gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <section aria-labelledby="problem">
                <h2 id="problem" className="u-display text-[clamp(1.6rem,3vw,2.4rem)] text-bone">
                  The problem
                </h2>
                <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-silver">
                  {project.problem}
                </p>
              </section>

              <section aria-labelledby="approach" className="mt-14">
                <h2
                  id="approach"
                  className="u-display text-[clamp(1.6rem,3vw,2.4rem)] text-bone"
                >
                  The approach
                </h2>
                <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-silver">
                  {project.approach}
                </p>

                <ul className="mt-8 grid gap-px bg-bone/10 sm:grid-cols-2">
                  {project.contributions.map((c) => (
                    <li key={c} className="bg-void/85 p-5 text-[0.95rem] leading-relaxed text-silver">
                      {c}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="features" className="mt-14">
                <h2 id="features" className="u-display text-[clamp(1.6rem,3vw,2.4rem)] text-bone">
                  What it does
                </h2>
                <dl className="mt-6 border-t border-bone/12">
                  {project.features.map((f) => (
                    <div
                      key={f.title}
                      className="grid gap-2 border-b border-bone/12 py-5 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-8"
                    >
                      <dt className="u-meta pt-1 text-bone/70">{f.title}</dt>
                      <dd className="text-[0.95rem] leading-relaxed text-silver">{f.body}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-28">
                <p className="u-meta mb-4 text-bone/40">Architecture</p>
                <div className="grid gap-6">
                  {project.architecture.map((a) => (
                    <div key={a.label}>
                      <p className="u-meta text-champagne/80">{a.label}</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {a.items.map((item) => (
                          <li
                            key={item}
                            className="u-meta rounded-full border border-bone/15 px-2.5 py-1 text-bone/55"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="hairline my-8" />

                <p className="u-meta mb-3 text-bone/40">Known limitations</p>
                <ul className="grid gap-2">
                  {project.limitations.map((l) => (
                    <li key={l} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-silver/85">
                      <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember" />
                      {l}
                    </li>
                  ))}
                </ul>

                {project.results ? (
                  <>
                    <div className="hairline my-8" />
                    <p className="u-meta mb-3 text-bone/40">Result</p>
                    <p className="text-[0.95rem] leading-relaxed text-silver">{project.results}</p>
                  </>
                ) : null}

                <div className="hairline my-8" />

                <p className="u-meta mb-3 text-bone/40">Sources & verification</p>
                <ul className="grid gap-3">
                  {project.sources.map((s) => (
                    <li key={s.label} className="text-[0.86rem] leading-relaxed text-bone/55">
                      {s.href ? (
                        <a
                          href={s.href}
                          target={s.href.startsWith("/") ? undefined : "_blank"}
                          rel="noreferrer noopener"
                          className="u-hairline-link text-bone/75 hover:text-bone"
                        >
                          {s.label} ↗
                        </a>
                      ) : (
                        <span className="text-bone/75">{s.label}</span>
                      )}
                      <span className="mt-0.5 block text-bone/35">{s.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* related */}
          {related.length ? (
            <section aria-labelledby="related" className="mt-24">
              <h2 id="related" className="u-meta mb-6 text-bone/40">
                Related work
              </h2>
              <ul className="grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p, i) => (
                  <li key={p!.slug} className="bg-void/85">
                    <Link
                      href={`/work/${p!.slug}`}
                      className="group block p-6 transition-colors hover:bg-carbon/70"
                      data-cursor="VIEW"
                    >
                      <p className="u-meta text-bone/30">{pad(i + 1)}</p>
                      <h3 className="u-display mt-2 text-[1.3rem] text-bone">{p!.title}</h3>
                      <p className="mt-2 line-clamp-3 text-[0.9rem] leading-relaxed text-silver/85">
                        {p!.summary}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* next */}
          {next ? (
            <div className="mt-24 border-t border-bone/12 pt-10">
              <Link
                href={`/work/${next.slug}`}
                className="group block"
                data-cursor="VIEW"
              >
                <p className="u-meta text-bone/35">Next in the archive</p>
                <p className="u-wordmark mt-2 text-[clamp(2rem,6vw,4.5rem)] text-bone transition-transform duration-(--dur-slow) ease-(--ease-out-expo) group-hover:translate-x-3">
                  {next.title} →
                </p>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
