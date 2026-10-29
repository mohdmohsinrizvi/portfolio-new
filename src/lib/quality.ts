export type QualityMode = "lite" | "balanced" | "cinematic";

export const QUALITY_MODES: QualityMode[] = ["lite", "balanced", "cinematic"];

const STORAGE_KEY = "mohsin:quality";

export const qualityPresets: Record<
  QualityMode,
  {
    label: string;
    dprCap: number;
    particleCount: number;
    coreSegments: number;
    noiseOctaves: number;
    rings: boolean;
    field: boolean;
    dprScale: number;
  }
> = {
  lite: {
    label: "Lite",
    dprCap: 1,
    particleCount: 0,
    coreSegments: 48,
    noiseOctaves: 1,
    rings: false,
    field: false,
    dprScale: 1,
  },
  balanced: {
    label: "Balanced",
    dprCap: 1.5,
    particleCount: 520,
    coreSegments: 96,
    noiseOctaves: 2,
    rings: true,
    field: true,
    dprScale: 1,
  },
  cinematic: {
    label: "Cinematic",
    dprCap: 1.75,
    particleCount: 1100,
    coreSegments: 160,
    noiseOctaves: 3,
    rings: true,
    field: true,
    dprScale: 1,
  },
};

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    const ctx = gl as WebGLRenderingContext;
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function readStoredQuality(): QualityMode | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "lite" || v === "balanced" || v === "cinematic" ? v : null;
  } catch {
    return null;
  }
}

export function storeQuality(mode: QualityMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* storage unavailable — preference simply is not persisted */
  }
}

/**
 * Automatic selection. Deliberately coarse: it combines static capability
 * signals with a short runtime frame-rate sample so it never depends on
 * user-agent sniffing alone.
 */
export function autoQuality(): QualityMode {
  if (typeof window === "undefined") return "balanced";
  if (!hasWebGL()) return "lite";
  if (prefersReducedMotion()) return "lite";

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;
  const dpr = window.devicePixelRatio || 1;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  let score = 0;
  if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;
  if (dpr <= 2) score += 1;
  if (!coarse) score += 1;
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
    score -= 3;

  if (score >= 5) return "cinematic";
  if (score >= 3) return "balanced";
  return "lite";
}

/** Downgrade one step — used by the runtime frame-rate watchdog. */
export function degrade(mode: QualityMode): QualityMode {
  if (mode === "cinematic") return "balanced";
  return "lite";
}
