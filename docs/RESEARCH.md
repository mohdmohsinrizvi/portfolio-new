# Research

Reference work consulted before any code was written, and what was taken
from each. Everything implemented here is original; nothing was copied.

## Yeah Right — yeahright.co

Reached and inspected at build time (HTTP 200).

Observed characteristics:

- Astro static site, dark field, very large editorial display type.
- Display face is a condensed grotesk (Druk-family character), paired with
  a technical mono for metadata and labels.
- Signature technique: split-text reveals driven by a per-character CSS
  custom property (`--char-delay`) so each glyph can be delayed without a
  JavaScript animation library owning layout.
- Colour theming is driven by a `data-palette` attribute on a container,
  with tokens resolved through CSS custom properties.
- A user-controlled sound toggle. Sound is opt-in and never autoplays.

Adopted here: the split-text character architecture, `data-*` driven
thematic switching (`data-chapter` / `data-atmo`), and the rule that sound
or motion is never forced on the visitor.

## Junk Branding — junkbranding.com

Reached and inspected at build time (HTTP 200).

Observed characteristics:

- Vite build, near-black ink (`#04070c`) against warm paper (`#efeae4`).
- Instrument Serif for display, a technical mono for supporting text.
- Depth parallax implemented by tagging elements with `data-depth` and
  resolving the multiplier from that attribute rather than inline styles.

Adopted here: the ink/paper pairing inverted for a dark-first portfolio
(Void `#08090d` against Bone `#ece8df`), Instrument Serif as the display
face, and attribute-driven depth so parallax stays declarative.

## Junk Lab — lab.junkbranding.com

Reached and inspected at build time (HTTP 200).

Observed characteristics:

- Editorial case-study presentation of a custom WebGL transition.
- One fullscreen plane is the only 3D object in the scene; all imagery is
  passed in as two textures and mixed in the fragment shader.
- Distortion is driven by a `uVelocity` uniform, which is itself derived
  from drag velocity.
- Concrete parameter guidance was published: bend around `0.10`, wave
  around `0.012`, device pixel ratio capped at `1.75`.
- Keyboard navigation is a first-class control, not a fallback.
- Reduced-motion is honoured by skipping the effect entirely.

Adopted here: the single-fullscreen-plane distortion technique for the
Selected Work gallery, implemented from scratch in
`src/components/projects/GalleryPlane.tsx`, with the same discipline —
bend `0.11`, DPR capped at `1.75`, keyboard and reduced-motion parity.

## Sources that could not be reached

- `SHEIKH-NASIR/safety-exit` — the repository owner account no longer
  resolves (404). The only surviving public pointer is the deployed site,
  `https://safety-exit.onrender.com/`, which was reached and read directly.
  See `CONTENT_SOURCES.md`.

## What was deliberately not taken

- No component code, no shader source, no imagery, no fonts beyond the
  Google Fonts families declared in `layout.tsx`.
- No third-party scroll or animation framework that would own the scroll
  and conflict with the single Lenis + GSAP ScrollTrigger controller.
- React Bits was considered as a dependency and rejected; the components
  here are written for this project's own design tokens.
