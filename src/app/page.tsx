import { featuredProjects } from "@/data/projects";
import { Arrival } from "@/components/experience/Arrival";
import { Identity } from "@/components/experience/Identity";
import { Laboratory } from "@/components/experience/Laboratory";
import { Journey } from "@/components/experience/Journey";
import { Connection } from "@/components/experience/Connection";
import { SectionReveal } from "@/components/experience/SectionReveal";
import { DistortionGallery } from "@/components/projects/DistortionGallery";

export default function HomePage() {
  return (
    <>
      <Arrival />

      <SectionReveal effect="rise" travel={0.5}>
        <Identity />
      </SectionReveal>

      {/* Chapter 02 — Selected work */}
      <SectionReveal effect="curtain" travel={0.6} panel="var(--color-carbon)">
        <section
          id="selected-work"
          data-chapter="Selected Work"
          data-atmo="#0a0d13|#10131b|rgba(146,135,234,0.16)"
          aria-labelledby="selected-work-heading"
          className="section relative z-(--z-content)"
        >
          <div className="shell mb-6">
            <h2 id="selected-work-heading" className="sr-only">
              Selected work
            </h2>
          </div>
          <DistortionGallery projects={featuredProjects} />
        </section>
      </SectionReveal>

      <SectionReveal effect="portal" travel={0.55}>
        <Laboratory />
      </SectionReveal>

      <SectionReveal effect="split" travel={0.5}>
        <Journey />
      </SectionReveal>

      <SectionReveal effect="curtain" travel={0.6} panel="#0d0e13">
        <Connection />
      </SectionReveal>
    </>
  );
}
