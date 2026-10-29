import type { Cover } from "@/data/projects";

/**
 * Procedural cover art.
 *
 * Every project poster is generated deterministically from its seed, motif
 * and palette — no downloaded imagery, no licensing questions, and a visual
 * identity that is actually specific to each project. The same canvas is
 * reused as a WebGL texture by the gallery and as an <img> source elsewhere.
 */

export const COVER_W = 1200;
export const COVER_H = 1500;

const cache = new Map<string, HTMLCanvasElement>();

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ctx = CanvasRenderingContext2D;

function bg(ctx: Ctx, c: Cover) {
  const g = ctx.createLinearGradient(0, 0, COVER_W * 0.4, COVER_H);
  g.addColorStop(0, c.palette[0]);
  g.addColorStop(0.55, shift(c.palette[0], 8));
  g.addColorStop(1, shift(c.palette[0], -6));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, COVER_W, COVER_H);

  const glow = ctx.createRadialGradient(
    COVER_W * 0.68,
    COVER_H * 0.3,
    0,
    COVER_W * 0.68,
    COVER_H * 0.3,
    COVER_W * 0.85,
  );
  glow.addColorStop(0, withAlpha(c.palette[1], 0.22));
  glow.addColorStop(1, withAlpha(c.palette[1], 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, COVER_W, COVER_H);
}

function grain(ctx: Ctx, seed: number, amount = 0.045) {
  const rand = rng(seed ^ 0x9e37);
  const img = ctx.getImageData(0, 0, COVER_W, COVER_H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * 255 * amount;
    d[i] = (d[i] ?? 0) + n;
    d[i + 1] = (d[i + 1] ?? 0) + n;
    d[i + 2] = (d[i + 2] ?? 0) + n;
  }
  ctx.putImageData(img, 0, 0);
}

function scanlines(ctx: Ctx, alpha = 0.05) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  for (let y = 0; y < COVER_H; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(COVER_W, y + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function frame(ctx: Ctx, c: Cover) {
  ctx.save();
  ctx.strokeStyle = withAlpha(c.palette[2], 0.28);
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, COVER_W - 80, COVER_H - 80);
  ctx.restore();
}

function motifRoute(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  ctx.save();
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (let k = 0; k < 3; k++) {
    ctx.strokeStyle = withAlpha(k === 0 ? c.palette[1] : c.palette[2], k === 0 ? 0.85 : 0.32);
    ctx.beginPath();
    let x = 160 + rand() * 200;
    let y = COVER_H - 260;
    ctx.moveTo(x, y);
    const steps = 7 + Math.floor(rand() * 4);
    for (let i = 0; i < steps; i++) {
      const horizontal = rand() > 0.45;
      const len = 90 + rand() * 190;
      if (horizontal) x += (rand() > 0.5 ? 1 : -1) * len;
      else y -= len;
      ctx.lineTo(x, y);
      // node
      ctx.save();
      ctx.fillStyle = withAlpha(c.palette[1], 0.9);
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.stroke();
  }

  // floor separators
  ctx.strokeStyle = withAlpha(c.palette[2], 0.18);
  ctx.lineWidth = 1;
  for (let i = 1; i < 7; i++) {
    const y = 200 + i * 150;
    ctx.beginPath();
    ctx.moveTo(90, y);
    ctx.lineTo(COVER_W - 90, y);
    ctx.stroke();
  }
  ctx.restore();
}

function motifNetwork(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < 34; i++) {
    pts.push([140 + rand() * (COVER_W - 280), 200 + rand() * (COVER_H - 500)]);
  }
  ctx.save();
  ctx.lineWidth = 1.4;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i]!;
      const b = pts[j]!;
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d < 230) {
        ctx.strokeStyle = withAlpha(c.palette[1], 0.4 * (1 - d / 230));
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
    }
  }
  for (const p of pts) {
    ctx.fillStyle = withAlpha(c.palette[2], 0.85);
    ctx.beginPath();
    ctx.arc(p[0], p[1], 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // highlight path
  ctx.strokeStyle = withAlpha(c.palette[1], 0.95);
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const p = pts[Math.floor(rand() * pts.length)]!;
    if (i === 0) ctx.moveTo(p[0], p[1]);
    else ctx.lineTo(p[0], p[1]);
  }
  ctx.stroke();
  ctx.restore();
}

function motifMatch(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  ctx.save();
  const rows = 11;
  for (let i = 0; i < rows; i++) {
    const y = 230 + i * 96;
    const w1 = 120 + rand() * 220;
    const w2 = 120 + rand() * 220;
    const matched = rand() > 0.32;
    ctx.fillStyle = withAlpha(c.palette[1], matched ? 0.5 : 0.16);
    ctx.fillRect(150, y, w1, 14);
    ctx.fillStyle = withAlpha(c.palette[2], matched ? 0.5 : 0.16);
    ctx.fillRect(COVER_W - 150 - w2, y, w2, 14);
    if (matched) {
      ctx.strokeStyle = withAlpha(c.palette[1], 0.55);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(150 + w1, y + 7);
      ctx.lineTo(COVER_W - 150 - w2, y + 7);
      ctx.stroke();
    } else {
      ctx.strokeStyle = withAlpha("#ffffff", 0.14);
      ctx.setLineDash([6, 8]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(150 + w1, y + 7);
      ctx.lineTo(COVER_W - 150 - w2, y + 7);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
}

function motifWeather(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  ctx.save();
  const cols = 18;
  const rows = 22;
  const cw = (COVER_W - 260) / cols;
  const ch = (COVER_H - 460) / rows;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const v = Math.sin(x * 0.5 + seed) * Math.cos(y * 0.35) * 0.5 + 0.5;
      const a = 0.06 + v * 0.42 * (0.5 + rand() * 0.5);
      ctx.fillStyle = withAlpha(v > 0.72 ? c.palette[2] : c.palette[1], a);
      ctx.fillRect(130 + x * cw + 1, 200 + y * ch + 1, cw - 2, ch - 2);
    }
  }
  ctx.strokeStyle = withAlpha(c.palette[2], 0.5);
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= cols; x++) {
    const y = rows * (0.25 + 0.45 * Math.sin(x * 0.42 + seed));
    const px = 130 + x * cw + cw / 2;
    const py = 200 + y * ch;
    if (x === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

function motifIndex(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  ctx.save();
  for (let i = 0; i < 14; i++) {
    const y = 220 + i * 78;
    const w = 200 + rand() * (COVER_W - 400);
    ctx.fillStyle = withAlpha(c.palette[1], 0.1 + rand() * 0.4);
    ctx.fillRect(140, y, w, 10);
    ctx.fillStyle = withAlpha(c.palette[2], 0.25);
    ctx.fillRect(COVER_W - 140 - 26, y, 26, 10);
  }
  ctx.strokeStyle = withAlpha(c.palette[1], 0.45);
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    const x = 140 + ((COVER_W - 280) / 6) * i;
    ctx.beginPath();
    ctx.moveTo(x, 180);
    ctx.lineTo(x, COVER_H - 240);
    ctx.stroke();
  }
  ctx.restore();
}

function motifWave(ctx: Ctx, c: Cover, seed: number) {
  ctx.save();
  for (let k = 0; k < 3; k++) {
    ctx.strokeStyle = withAlpha(k === 1 ? c.palette[1] : c.palette[2], k === 1 ? 0.9 : 0.28);
    ctx.lineWidth = k === 1 ? 4 : 2;
    ctx.beginPath();
    for (let x = 0; x <= COVER_W; x += 3) {
      const t = x / COVER_W;
      const spike =
        Math.exp(-Math.pow((t - 0.5) * 9, 2)) *
        Math.sin(t * 190 + k * 2 + seed) *
        (k === 1 ? 200 : 90);
      const base = Math.sin(t * 9 + k + seed) * 26;
      const y = COVER_H * 0.45 + k * 26 + base + spike;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = withAlpha(c.palette[2], 0.16);
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const y = 320 + i * 120;
    ctx.beginPath();
    ctx.moveTo(90, y);
    ctx.lineTo(COVER_W - 90, y);
    ctx.stroke();
  }
  ctx.restore();
}

function motifOrbit(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  const cx = COVER_W * 0.5;
  const cy = COVER_H * 0.46;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 7; i++) {
    const r = 120 + i * 82;
    ctx.strokeStyle = withAlpha(i % 2 ? c.palette[1] : c.palette[2], 0.34 - i * 0.03);
    ctx.lineWidth = i === 2 ? 3.5 : 1.2;
    ctx.save();
    ctx.rotate(rand() * Math.PI);
    ctx.scale(1, 0.34 + rand() * 0.4);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    if (i % 2 === 0) {
      const a = rand() * Math.PI * 2;
      ctx.fillStyle = withAlpha(c.palette[1], 0.95);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r * 0.5, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = withAlpha(c.palette[1], 0.9);
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function motifNodes(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  ctx.save();
  const cols = 5;
  const rows = 7;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const px = 180 + x * ((COVER_W - 360) / (cols - 1));
      const py = 240 + y * ((COVER_H - 560) / (rows - 1));
      const on = rand() > 0.35;
      ctx.strokeStyle = withAlpha(on ? c.palette[1] : "#ffffff", on ? 0.5 : 0.08);
      ctx.lineWidth = on ? 2.4 : 1;
      ctx.beginPath();
      ctx.rect(px - 22, py - 22, 44, 44);
      ctx.stroke();
      if (on) {
        ctx.fillStyle = withAlpha(c.palette[2], 0.75);
        ctx.fillRect(px - 6, py - 6, 12, 12);
      }
    }
  }
  ctx.strokeStyle = withAlpha(c.palette[1], 0.55);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(180, 240);
  ctx.lineTo(180 + 2 * ((COVER_W - 360) / (cols - 1)), 240 + 2 * ((COVER_H - 560) / (rows - 1)));
  ctx.lineTo(180 + 4 * ((COVER_W - 360) / (cols - 1)), 240 + 5 * ((COVER_H - 560) / (rows - 1)));
  ctx.stroke();
  ctx.restore();
}

function motifGrid(ctx: Ctx, c: Cover, seed: number) {
  const rand = rng(seed);
  ctx.save();
  const n = 16;
  const cell = (COVER_W - 240) / n;
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const d = Math.hypot(x - n / 2, y - n / 2) / (n / 2);
      const a = Math.max(0, 0.55 - d * 0.5) * (0.4 + rand() * 0.6);
      if (a < 0.04) continue;
      ctx.fillStyle = withAlpha(d < 0.4 ? c.palette[2] : c.palette[1], a);
      const s = cell * (0.3 + (1 - d) * 0.6);
      ctx.fillRect(120 + x * cell + (cell - s) / 2, 240 + y * cell + (cell - s) / 2, s, s);
    }
  }
  ctx.restore();
}

const motifs: Record<Cover["motif"], (ctx: Ctx, c: Cover, seed: number) => void> = {
  route: motifRoute,
  network: motifNetwork,
  match: motifMatch,
  weather: motifWeather,
  index: motifIndex,
  wave: motifWave,
  orbit: motifOrbit,
  nodes: motifNodes,
  grid: motifGrid,
};

/** Deterministic poster. Cached per cover identity. */
export function makeCover(cover: Cover, index = 0, label = ""): HTMLCanvasElement {
  const key = `${cover.motif}|${cover.seed}|${cover.palette.join(",")}|${index}|${label}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const canvas = document.createElement("canvas");
  canvas.width = COVER_W;
  canvas.height = COVER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  bg(ctx, cover);
  motifs[cover.motif](ctx, cover, cover.seed);

  // index + label block
  ctx.save();
  ctx.font = "500 44px 'IBM Plex Mono', ui-monospace, monospace";
  ctx.fillStyle = withAlpha(cover.palette[2], 0.75);
  ctx.fillText(String(index).padStart(2, "0"), 88, COVER_H - 128);
  if (label) {
    ctx.font = "500 26px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.fillStyle = withAlpha(cover.palette[2], 0.42);
    ctx.fillText(label.toUpperCase(), 152, COVER_H - 128);
  }
  ctx.restore();

  scanlines(ctx, 0.04);
  grain(ctx, cover.seed);
  frame(ctx, cover);

  cache.set(key, canvas);
  return canvas;
}

export function coverToDataUrl(cover: Cover, index = 0, label = ""): string {
  return makeCover(cover, index, label).toDataURL("image/jpeg", 0.86);
}

/* ---------- colour helpers ---------- */

function withAlpha(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function shift(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (v: number) => Math.max(0, Math.min(255, v + amount));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
