import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found — MOHSIN",
  description: "This entry is not in the archive.",
};

export default function NotFound() {
  return (
    <section
      data-chapter="Not found"
      data-atmo="#08090d|#0b0d14|rgba(146,135,234,0.10)"
      className="section relative z-(--z-content) flex min-h-[100svh] flex-col justify-center pt-24"
    >
      <div className="shell">
        <p className="u-meta mb-6 text-ember/85">404</p>
        <h1 className="u-wordmark max-w-[14ch] text-[clamp(2.8rem,9vw,7.5rem)] text-bone">
          Not in the archive.
        </h1>
        <p className="u-lead mt-6 max-w-[46ch] text-silver">
          Either the entry never existed, or it has been superseded by something better.
        </p>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3 text-void transition-transform hover:-translate-y-0.5"
          >
            <span className="u-meta text-void">Back to the start</span>
            <span aria-hidden>→</span>
          </Link>
          <Link href="/work" className="u-meta u-hairline-link text-bone/70 hover:text-bone">
            All work
          </Link>
          <Link href="/lab" className="u-meta u-hairline-link text-bone/70 hover:text-bone">
            Laboratory
          </Link>
          <Link href="/contact" className="u-meta u-hairline-link text-bone/70 hover:text-bone">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
