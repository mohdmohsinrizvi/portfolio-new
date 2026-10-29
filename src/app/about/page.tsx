import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/profile";
import { SplitText, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About — MOHSIN",
  description:
    "Syed Mohd Mohsin Rizvi — independent developer in Lucknow, India, working across software engineering, applied AI/ML and interactive experiences.",
};

const timeline = [
  {
    when: "2024 —",
    what: "Began B.Tech in Computer Science & Engineering at Integral University, Lucknow.",
  },
  {
    when: "2025 —",
    what: "Started taking freelance web and web-app work alongside the coursework.",
  },
  {
    when: "2026 —",
    what: "Competition season: Chakravyuh 1.0, the Amazon ML Challenge and the Smart India Hackathon internal round.",
  },
  {
    when: "2026 —",
    what: "Opened the Algorithm Discovery Lab as a public research repository under MIT.",
  },
  { when: "Now", what: "Building the next thing — and writing about the process." },
];

export default function AboutPage() {
  return (
    <section
      data-chapter="About"
      data-atmo="#0d0f14|#12151c|rgba(184,166,140,0.12)"
      className="section relative z-(--z-content) pt-[clamp(120px,18vh,210px)]"
    >
      <div className="shell">
        <p className="u-meta mb-5 text-champagne/90">About</p>
        <h1 className="u-wordmark max-w-[14ch] text-[clamp(3rem,10vw,8.5rem)] text-bone">
          <SplitText text="Who is behind this" stagger={0.03} />
        </h1>

        <div className="mt-14 grid gap-x-[var(--gutter)] gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="u-lead text-silver">
                {profile.legalName} — {profile.roles[0]}, {profile.roles[1]} and{" "}
                {profile.roles[2].toLowerCase()}, based in {profile.location}.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-6 grid gap-5">
              <p className="max-w-[64ch] text-[1rem] leading-relaxed text-silver">
                I work where software engineering, artificial intelligence and interactive
                digital experiences overlap. Most of what appears in this archive began the
                same way: a question that would not stay theoretical, and a decision to build
                the answer rather than only read about it.
              </p>
              <p className="max-w-[64ch] text-[1rem] leading-relaxed text-silver">
                Alongside the undergraduate programme that work has taken the shape of
                freelance websites and web applications for small businesses and student
                platforms, competition entries, firmware for ESP32 hardware, an open-source
                research platform for automated algorithm discovery, and the occasional
                experiment that exists mainly to explain something clearly.
              </p>
              <p className="max-w-[64ch] text-[1rem] leading-relaxed text-silver">
                This site is itself part of that work — a single WebGL layer, one scroll
                controller, a procedural cover system that means no stock imagery appears
                anywhere, and a graphics quality mode that keeps all of it honest on
                constrained hardware.
              </p>
            </Reveal>

            <Reveal delay={0.14} className="mt-10">
              <div className="hairline mb-8" />
              <p className="u-meta mb-6 text-bone/40">Short timeline</p>
              <ol className="border-t border-bone/12">
                {timeline.map((t) => (
                  <li
                    key={t.what}
                    className="grid gap-2 border-b border-bone/12 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6"
                  >
                    <span className="u-meta pt-1 text-signal/75">{t.when}</span>
                    <span className="text-[0.97rem] leading-relaxed text-silver">
                      {t.what}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-bone/12 bg-carbon/40 p-6">
                <p className="u-meta mb-4 text-bone/40">Coordinates</p>
                <dl className="grid gap-4">
                  <div>
                    <dt className="u-meta text-bone/35">Name</dt>
                    <dd className="mt-1 text-[0.95rem] text-bone/90">{profile.legalName}</dd>
                  </div>
                  <div>
                    <dt className="u-meta text-bone/35">Based in</dt>
                    <dd className="mt-1 text-[0.95rem] text-bone/90">{profile.location}</dd>
                  </div>
                  <div>
                    <dt className="u-meta text-bone/35">Timezone</dt>
                    <dd className="mt-1 text-[0.95rem] text-bone/90">{profile.timezoneLabel}</dd>
                  </div>
                  <div>
                    <dt className="u-meta text-bone/35">Education</dt>
                    <dd className="mt-1 text-[0.95rem] text-bone/90">
                      {profile.education.degree}
                      <span className="mt-0.5 block text-bone/55">
                        {profile.education.university}
                      </span>
                      <span className="u-meta mt-1 block text-bone/35">
                        {profile.education.period}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="hairline my-6" />

                <p className="u-meta mb-3 text-bone/40">Elsewhere</p>
                <ul className="grid gap-2.5">
                  <li>
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="u-meta u-hairline-link text-bone/70 hover:text-bone"
                    >
                      LinkedIn ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="u-meta u-hairline-link text-bone/70 hover:text-bone"
                    >
                      GitHub ↗
                    </a>
                  </li>
                </ul>

                <div className="hairline my-6" />

                <p className="text-[0.84rem] leading-relaxed text-bone/35">
                  No email address or phone number is published here. The contact page routes
                  through LinkedIn and GitHub so nothing sits unattended in plain text.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16} className="mt-6">
              <div className="rounded-2xl border border-bone/12 p-6">
                <p className="u-meta mb-4 text-bone/40">Approach</p>
                <ul className="grid gap-3 text-[0.93rem] leading-relaxed text-silver">
                  <li>Prefer the verifiable claim over the flattering one.</li>
                  <li>Build the smallest thing that proves the idea.</li>
                  <li>Optimise for hardware other people actually own.</li>
                  <li>Publish what can be reused, in a form others can run.</li>
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>

        <div className="mt-20 flex flex-wrap gap-6">
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
            href="/contact"
            className="group inline-flex items-center gap-3 border-b border-bone/25 pb-1.5 transition-colors hover:border-bone"
          >
            <span className="u-meta text-bone/75 group-hover:text-bone">Get in touch</span>
            <span aria-hidden className="text-sm transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
