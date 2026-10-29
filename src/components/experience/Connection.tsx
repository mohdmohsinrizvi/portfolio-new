"use client";

import Link from "next/link";
import { profile } from "@/data/profile";
import { Reveal, SplitText } from "@/components/motion/Reveal";

/** Chapter 05 — CONNECTION. The final statement. */
export function Connection() {
  return (
    <section
      id="connection"
      data-chapter="Connection"
      data-atmo="#0b0c11|#0f1016|rgba(146,135,234,0.14)"
      aria-labelledby="connection-heading"
      className="section relative z-(--z-content) flex min-h-[86svh] flex-col justify-center"
    >
      <div className="shell">
        <p className="u-meta mb-8 text-signal/80">05 — Connection</p>

        <h2
          id="connection-heading"
          className="u-wordmark max-w-[13ch] text-[clamp(3rem,11vw,9.5rem)] text-bone"
        >
          <SplitText text="Let's build something." stagger={0.028} />
        </h2>

        <Reveal delay={0.12} className="mt-8">
          <p className="u-lead max-w-[46ch] text-silver">
            Freelance work, collaborations, research conversations, or simply a good
            question — all of it is welcome.
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-12">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-3.5 text-void transition-transform duration-(--dur-base) ease-(--ease-out-expo) hover:-translate-y-0.5"
              data-cursor="VIEW"
            >
              <span className="u-meta text-void">Start a conversation</span>
              <span aria-hidden className="text-sm">
                →
              </span>
            </Link>

            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="u-meta u-hairline-link text-bone/60 hover:text-bone"
            >
              LinkedIn ↗
            </a>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer noopener"
              className="u-meta u-hairline-link text-bone/60 hover:text-bone"
            >
              GitHub ↗
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.24} className="mt-16">
          <div className="hairline mb-6" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="u-display text-[clamp(1.1rem,2vw,1.6rem)] italic text-bone/55">
              Still exploring. Still building.
            </p>
            <p className="u-meta text-bone/30">{profile.timezoneLabel}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
