"use client";

import { useEffect, useState } from "react";
import { coverToDataUrl, COVER_H, COVER_W } from "@/lib/coverArt";
import type { Cover } from "@/data/projects";

type Props = {
  cover: Cover;
  index: number;
  label: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Procedural cover art is drawn with Canvas2D, which only exists in a
 * browser — so it is generated on the client. The server renders the
 * reserved aspect box and hydration swaps in the bitmap, keeping the
 * first paint free of layout shift and free of hydration mismatches.
 */
export function CoverImage({
  cover,
  index,
  label,
  alt,
  className = "",
  priority = false,
}: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // yield one frame so the reservation paints before the draw work
    const id = window.requestAnimationFrame(() => {
      if (!cancelled) setSrc(coverToDataUrl(cover, index, label));
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, [cover, index, label]);

  if (!src) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-carbon ${className}`}
        style={{ aspectRatio: `${COVER_W} / ${COVER_H}` }}
        aria-hidden
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-graphite via-carbon to-void" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={COVER_W}
      height={COVER_H}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
