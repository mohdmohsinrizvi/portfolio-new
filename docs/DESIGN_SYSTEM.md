# Design System

The portfolio runs on one set of tokens. Every component reads from them;
nothing hard-codes a colour or a duration.

## Colour

| Token | Value | Role |
| --- | --- | --- |
| `--color-void` | `#08090d` | Page background, deepest layer |
| `--color-carbon` | `#14171d` | Raised panels, cards |
| `--color-graphite` | `#22252d` | Borders, hairlines at rest |
| `--color-slate` | `#2e323c` | Hover surfaces |
| `--color-bone` | `#ece8df` | Primary text, primary button fill |
| `--color-silver` | `#a4a7ae` | Body copy, secondary text |
| `--color-champagne` | `#b8a68c` | Editorial accent, italic emphasis |
| `--color-signal` | `#9287ea` | Interaction accent, active state |
| `--color-signal-soft` | `#b3abf2` | Dimmed signal, gallery seam |
| `--color-teal` | `#264b51` | Chapter 03 atmosphere |
| `--color-teal-bright` | `#4f9aa2` | Verified / positive states |
| `--color-teal-soft` | `#7fb3b8` | Chapter 03 labels |
| `--color-ember` | `#d97757` | Warning, limitation markers |

Atmosphere per chapter is applied through `data-atmo` on each `<section>`,
read by `SignalDirector` and resolved to a three-stop gradient:
background, secondary stop, accent tint.

## Typography

Loaded with `next/font/google` and exposed as CSS variables, so the
fallback stack is correct before hydration:

| Role | Family | Variable |
| --- | --- | --- |
| Display / wordmark | Instrument Serif | `--font-instrument-serif` |
| Body / UI | Manrope | `--font-manrope` |
| Metadata / labels | IBM Plex Mono | `--font-plex-mono` |

Utility classes in `globals.css`:

- `.u-wordmark` — display face, tight tracking, used for hero and page titles
- `.u-display` — display face at body-adjacent sizes
- `.u-serif-em` — italic display accent inside running text
- `.u-lead` — lead paragraph, `clamp(1.05rem, 1.4vw, 1.25rem)`
- `.u-meta` — mono, uppercase, `0.12em` tracking, `0.72rem`

All type sizes use `clamp()` with a viewport term so the scale is continuous
between 360px and 1920px rather than jumping at breakpoints.

## Layout

- `.shell` — content container, `--margin` gutter, max readable measure
- `.section` — vertical rhythm unit, `clamp(6rem, 14vh, 11rem)` padding
- `.hairline` — 1px rule, `bone/12`
- Grid gutter is `--gutter`, set per breakpoint in `globals.css`

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, hovers |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Page transitions |
| `--ease-settle` | `cubic-bezier(0.33, 1, 0.68, 1)` | Layout settling |
| `--ease-spring` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Overshoot, sparingly |
| `--dur-instant` | `140ms` | Colour-only hovers |
| `--dur-fast` | `200ms` | Small state changes |
| `--dur-base` | `320ms` | Default transition |
| `--dur-slow` | `620ms` | Reveals |
| `--dur-page` | `760ms` | Route transitions |

Durations and easings are duplicated outside `@theme` into `:root` so raw
CSS always resolves regardless of what the bundler emits from the theme
layer.

## Layers

`--z-canvas: 0` → `--z-content: 10` → `--z-header: 100` → `--z-menu: 200`
→ `--z-cursor: 300` → `--z-transition: 400`.

One WebGL canvas lives at `--z-canvas` for the entire document. Content
sits above it at `--z-content` with transparent backgrounds, so the Signal
Core is always visible behind the archive rather than being re-created per
route.

## Components

| Component | File | Notes |
| --- | --- | --- |
| `Reveal` | `motion/Reveal.tsx` | Scroll-triggered fade/rise, `once: true` |
| `SplitText` | `motion/Reveal.tsx` | Word or character masked reveal; `defer` hands control to an outer timeline |
| `SiteHeader` | `layout/SiteHeader.tsx` | Progress hairline, live chapter indicator, focus-trapped menu |
| `SiteFooter` | `layout/SiteFooter.tsx` | Colophon, quality toggle |
| `Cursor` | `ui/Cursor.tsx` | Dot + label ring, `data-cursor` driven, desktop only |
| `QualityToggle` | `ui/QualityToggle.tsx` | Lite / Balanced / Cinematic |
| `CoverImage` | `ui/CoverImage.tsx` | Client-side procedural cover with reserved aspect box |
| `DistortionGallery` | `projects/DistortionGallery.tsx` | Drag + inertia + shader distortion carousel |
| `SignalBackdrop` | `three/SignalBackdrop.tsx` | The single persistent WebGL layer |

## Accessibility

- Skip link to `#main` on every route.
- Menu is a real dialog: focus moves in on open, Escape closes, focus
  returns to the trigger.
- The gallery is a `role="group"` with `aria-roledescription="carousel"`,
  full keyboard support (← →), and live prev/next buttons. Every project is
  also present in an `sr-only` list so the archive is reachable without
  the visual layer.
- No-JS: `.js` class is only added by an inline script, and
  `html:not(.js)` forces all reveal targets to full opacity. The gallery
  ships a `<noscript>` card list.
- Reduced motion: entrance timelines are skipped, particles stop, the core
  freezes, and SplitText resolves to its end state immediately.
- Contrast: Bone on Void is ~17:1; Silver on Void is ~8:1; Champagne on
  Void is ~7:1. All exceed WCAG AA for their sizes.
