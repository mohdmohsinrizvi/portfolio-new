import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { SplitText, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact — MOHSIN",
  description:
    "Start a conversation — freelance work, collaborations and research discussions, routed through LinkedIn and GitHub.",
};

const routes = [
  {
    label: "LinkedIn",
    handle: "in/mohd-mohsin-rizvi",
    href: profile.social.linkedin,
    note: "Best for work enquiries, collaboration and introductions. Messages here are read first.",
    primary: true,
  },
  {
    label: "GitHub",
    handle: "mohdmohsinrizvi",
    href: profile.social.github,
    note: "Best for code, issues and repository-level discussion — open an issue on anything public.",
    primary: false,
  },
];

const goodFits = [
  "Freelance websites and web applications",
  "Interactive or WebGL-driven interfaces",
  "Data and applied-ML problems with a clear objective",
  "Research tooling and open-source collaboration",
  "Something small that has to work properly",
];

const notAGoodFit = [
  "Anything requiring guaranteed clinical or safety certification",
  "Unpaid 'exposure' work with no defined scope",
  "Projects that need a résumé PDF — I do not publish one",
];

export default function ContactPage() {
  return (
    <section
      data-chapter="Connection"
      data-atmo="#0b0c11|#0f1016|rgba(146,135,234,0.16)"
      className="section relative z-(--z-content) pt-[clamp(120px,18vh,210px)] pb-[clamp(60px,12vh,140px)]"
    >
      <div className="shell">
        <p className="u-meta mb-5 text-signal/80">Connection</p>
        <h1 className="u-wordmark max-w-[13ch] text-[clamp(3rem,10.5vw,8.5rem)] text-bone">
          <SplitText text="Let's talk." stagger={0.03} />
        </h1>

        <Reveal delay={0.12} className="mt-8 max-w-[54ch]">
          <p className="u-lead text-silver">
            There is no contact form on this site — it would sit unattended. Both routes
            below are real, checked and answer to {profile.location.split(",")[0]}.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ul className="grid gap-5">
              {routes.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`group flex flex-col gap-3 rounded-2xl border p-6 transition-all duration-(--dur-base) ease-(--ease-out-expo) sm:p-8 ${
                      r.primary
                        ? "border-bone/25 bg-bone/[0.04] hover:-translate-y-1 hover:border-bone hover:bg-bone/[0.08]"
                        : "border-bone/15 hover:-translate-y-1 hover:border-bone/40 hover:bg-bone/[0.03]"
                    }`}
                    data-cursor="OPEN"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`u-meta ${r.primary ? "text-signal/85" : "text-bone/45"}`}
                        >
                          {r.primary ? "Primary route" : "For code"}
                        </p>
                        <p className="u-display mt-1 text-[clamp(1.6rem,3.4vw,2.6rem)] text-bone">
                          {r.label}
                        </p>
                        <p className="u-meta mt-1 text-silver/70">{r.handle}</p>
                      </div>
                      <span
                        aria-hidden
                        className="text-bone/50 transition-transform duration-(--dur-base) group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-bone"
                      >
                        ↗
                      </span>
                    </div>
                    <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-silver">
                      {r.note}
                    </p>
                  </a>
                </li>
              ))}
            </ul>

            <Reveal delay={0.16} className="mt-10">
              <div className="hairline mb-7" />
              <p className="u-meta mb-4 text-bone/40">What fits</p>
              <ul className="grid gap-2.5">
                {goodFits.map((g) => (
                  <li key={g} className="flex gap-3 text-[0.95rem] leading-relaxed text-silver">
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-bright"
                    />
                    {g}
                  </li>
                ))}
              </ul>

              <p className="u-meta mt-8 mb-4 text-bone/40">What does not</p>
              <ul className="grid gap-2.5">
                {notAGoodFit.map((g) => (
                  <li key={g} className="flex gap-3 text-[0.95rem] leading-relaxed text-bone/50">
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember/80"
                    />
                    {g}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-bone/12 bg-carbon/40 p-6 lg:sticky lg:top-28">
                <p className="u-meta mb-4 text-bone/40">Before you write</p>
                <ul className="grid gap-4 text-[0.92rem] leading-relaxed text-silver">
                  <li>
                    <strong className="text-bone/85">Include context.</strong> What it is,
                    what it needs to do, and when it needs to exist.
                  </li>
                  <li>
                    <strong className="text-bone/85">Include a link.</strong> A repo, a
                    design, a competitor — anything concrete beats a description.
                  </li>
                  <li>
                    <strong className="text-bone/85">Expect honesty.</strong> If it is not a
                    fit, or not the right time, you will hear that plainly.
                  </li>
                </ul>

                <div className="hairline my-6" />

                <dl className="grid gap-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="u-meta text-bone/40">Location</dt>
                    <dd className="text-[0.9rem] text-bone/85">{profile.location}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="u-meta text-bone/40">Timezone</dt>
                    <dd className="text-[0.9rem] text-bone/85">{profile.timezoneLabel}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="u-meta text-bone/40">Résumé</dt>
                    <dd className="text-[0.9rem] text-bone/50">
                      {profile.resumeUrl ? (
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="u-hairline-link text-bone/80"
                        >
                          View ↗
                        </a>
                      ) : (
                        "Not published"
                      )}
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 text-[0.82rem] leading-relaxed text-bone/30">
                  This site intentionally publishes no email address, so there is no inbox
                  here to spam. Everything routes through the two accounts above.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
