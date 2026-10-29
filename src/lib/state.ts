/**
 * Shared, non-reactive scroll state.
 *
 * ScrollTrigger writes to this object; the WebGL scene reads it inside
 * useFrame. Keeping it outside React avoids re-rendering the whole page
 * tree on every scroll tick.
 */
export const scrollState = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** normalised velocity, -1 → 1 */
  velocity: 0,
  /** absolute scroll position in px */
  y: 0,
  /** active homepage chapter index */
  chapter: 0,
};

export const pointerState = {
  x: 0,
  y: 0,
  /** smoothed values consumed by the scene */
  sx: 0,
  sy: 0,
  down: false,
};

export const sceneState = {
  /** 0 → 1, fades the core between chapters */
  coreVisible: 1,
  /** displacement amplitude multiplier */
  morph: 1,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  ready: false,
};

export function resetScrollState(): void {
  scrollState.progress = 0;
  scrollState.velocity = 0;
  scrollState.y = 0;
  scrollState.chapter = 0;
}
