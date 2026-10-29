"use client";

import { useExperience } from "@/components/providers/ExperienceProvider";
import { QUALITY_MODES, qualityPresets, type QualityMode } from "@/lib/quality";
import { cn } from "@/lib/cn";

export function QualityToggle({ compact = false }: { compact?: boolean }) {
  const { quality, setQuality, qualitySource } = useExperience();

  return (
    <div className={cn("flex flex-col gap-2", compact && "items-end")}>
      {!compact ? <span className="u-meta text-bone/40">Graphics quality</span> : null}
      <div
        role="group"
        aria-label="Graphics quality mode"
        className="inline-flex rounded-full border border-bone/18 p-[3px]"
      >
        {QUALITY_MODES.map((m: QualityMode) => {
          const active = quality === m;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={active}
              onClick={() => setQuality(m)}
              className={cn(
                "u-meta rounded-full px-3 py-[5px] transition-all duration-(--dur-base) ease-(--ease-out-expo)",
                active
                  ? "bg-bone text-void"
                  : "text-bone/55 hover:text-bone",
              )}
            >
              {qualityPresets[m].label}
            </button>
          );
        })}
      </div>
      {!compact ? (
        <span className="u-meta text-bone/30">
          {qualitySource === "auto" ? "Auto-selected for this device" : "Manual override"}
        </span>
      ) : null}
    </div>
  );
}
