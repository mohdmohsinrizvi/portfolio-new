# Technical Decisions

## Runtime and framework

**Next.js 16.4.3 (App Router) + React 19.3.1.**

The site is content-driven and statically prerenderable, so the App Router
gives real SEO value — every project detail page is generated at build
time via `generateStaticParams`. Server components carry the content;
client components are confined to the interactive layer.

## Pinned versions

| Package | Version | Why pinned |
| --- | --- | --- |
| `typescript` | `5.9.3` | TypeScript 7 changes the type-checker behaviour this codebase relies on; not adopted here |
| `three` | `0.186.1` | Matches `@types/three` |
| `@react-three/fiber` | `9.8.2` | React 19 compatible |
| `@react-three/drei` | `10.7.9` | Paired with fiber 9 |
| `gsap` | `3.15.0` | ScrollTrigger API is stable at this line |
| `lenis` | `1.3.27` | Smooth scroll wrapper |
| `tailwindcss` | `4.3.3` | CSS-first config; no `tailwind.config.js` |
| `eslint` | `9.39.0` | Flat config only |

## Dependencies deliberately NOT added

| Candidate | Reason for exclusion |
| --- | --- |
| `@react-three/postprocessing` | Bloom and DOF double the fragment cost for a marginal gain on a background layer. Hand-tuned shader falloff replaces them. |
| `r3f-scroll-rig` | Would introduce a second scroll authority. All scroll is owned by one Lenis + GSAP ScrollTrigger controller. |
| React Bits (as a dependency) | Components are written against this project's own tokens; a component library would fight the design system. Referenced for technique only. |
| Any CMS / MDX layer | Content is a fixed, verified archive. Type-checked data modules in `src/data/` give stronger guarantees than a CMS for eleven projects. |

## Graphics architecture

**One WebGL canvas for the whole document** (`SignalBackdrop`, mounted once
in `layout.tsx`). Routes swap the *state* the canvas reads, never the
canvas. This is what keeps route changes free of WebGL context churn — the
single most common cause of stutter and context-loss in Three.js sites.

**Non-reactive state objects** (`src/lib/state.ts`): `scrollState`,
`pointerState`, `sceneState` are plain module objects mutated by input
handlers and read inside `useFrame`. React never re-renders on pointer or
scroll movement; the frame loop simply reads the latest values.

**Quality modes** (`src/lib/quality.ts`):

| Mode | DPR | Particles | Core segments | Noise octaves | Rings |
| --- | --- | --- | --- | --- | --- |
| `lite` | 1.0 | 0 | 48 | 1 | no |
| `balanced` | 1.5 | 520 | 96 | 2 | yes |
| `cinematic` | 1.75 | 1100 | 160 | 3 | yes |

Auto-selected at boot by device memory, GPU string and viewport; the user
can override it. A runtime watchdog measures frame time and degrades one
step when sustained frame time exceeds 26ms for 2.5 seconds. The override
is written to `localStorage` and respected on the next visit.

**Context loss**: `SignalBackdrop` listens for `webglcontextlost` /
`webglcontextrestored` and swaps to a CSS-only atmosphere if recovery
fails, so content is never stranded behind a dead canvas.

## Scroll architecture

Lenis drives smooth scroll. A single `ScrollTrigger` instance is
registered once; chapter sections publish `data-chapter` (read by the
header for the indicator) and `data-atmo` (read by `SignalDirector` to
crossfade the atmosphere). No component creates its own scroll listener.

## Procedural cover art

Every project cover is generated at runtime from the project's own
`Cover` record — a motif name, a three-colour palette and a seed —
rendered to a `CanvasTexture` or a data URL. This means:

- no stock imagery, so no licensing exposure
- covers are deterministic per project, so screenshots are reproducible
- no network weight for imagery at all

The renderer lives in `src/lib/coverArt.ts` with nine motifs
(`route`, `network`, `match`, `weather`, `index`, `wave`, `orbit`,
`nodes`, `grid`).

`CoverImage` renders the reserved aspect box on the server and swaps in
the bitmap after hydration. Canvas2D does not exist during SSR, so
generating during render would crash the build — and generating in render
would also produce a hydration mismatch.

## Shader notes

- Ashima / Gustavson simplex 3D noise (`SIMPLEX_3D`) for the core's
  displacement field. See `ASSET_CREDITS.md`.
- Vertex displacement rebuilds a perturbed normal by sampling the field
  along two surface tangents, so lighting follows the deformation instead
  of floating on top of it.
- The interference palette is pulled back toward the brand colours
  (`film = mix(film, tint, 0.55)`). A raw full-spectrum cosine palette
  reads as rainbow confetti at this scale.
- `gl_PointSize` for particles uses a small projection constant and is
  clamped to `[0.6, 9.0]`. A large constant turns near particles into
  screen-filling blobs, and under additive blending those saturate the
  frame to white. Counts are held low for the same reason.

## ESLint configuration

React Compiler rules `react-hooks/immutability`,
`react-hooks/set-state-in-effect` and `react-hooks/refs` are explicitly
`"off"`. All three produce false positives against legitimate patterns
used here: mutating Three.js uniforms inside `useFrame`, `matchMedia`
capability detection in an effect, and polymorphic `createElement` ref
forwarding. Everything else runs at `--max-warnings 0`.

`eslint-config-next` v16 exports a flat-config array directly, so
`eslint.config.mjs` destructures `[coreWebVitals, typescript, ...rest]`
rather than wrapping the package.

The `eslint` key was removed from `next.config.ts`; Next 16 no longer
accepts it.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and robots. Falls back to `VERCEL_URL`, then `http://localhost:3000`. |

`getSiteUrl()` in `src/lib/site.ts` is the only place this is resolved.
