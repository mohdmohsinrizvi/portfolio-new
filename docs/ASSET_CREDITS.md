# Asset Credits

Everything on this site is either generated at runtime or loaded from a
source with terms that permit this use. There is no stock photography and
no downloaded imagery.

## Fonts

Loaded with `next/font/google`, which self-hosts the font files at build
time and injects a preload link with a `crossOrigin` attribute.

| Family | Foundry | License | Used for |
| --- | --- | --- | --- |
| Instrument Serif | Rodrigo Fuenzalida, Jordan Egstad | SIL Open Font License 1.1 | Display, wordmark, editorial accents |
| Manrope | Mikhail Sharanda | SIL Open Font License 1.1 | Body, UI |
| IBM Plex Mono | IBM | SIL Open Font License 1.1 | Metadata, labels, technical text |

The SIL Open Font License permits embedding, redistribution and use in
commercial and non-commercial work, including web embedding.

## Code

### Simplex noise (GLSL)

`SIMPLEX_3D` in `src/components/three/shaders.ts` is the
Ashima / Stefan Gustavson 3D simplex noise implementation.

- Authors: Ian McEwan, Ashima Arts, Stefan Gustavson
- Source: https://github.com/ashima/webgl-noise
- Terms: permissive (MIT-style); redistribution and modification allowed
  with the notice preserved

All other shader code in this project — the signal vertex and fragment
programs, the particle programs and the gallery distortion program — is
original to this repository.

### Libraries

| Library | License | Note |
| --- | --- | --- |
| three.js | MIT | Rendering |
| @react-three/fiber | MIT | React reconciler for three |
| @react-three/drei | MIT | Helpers |
| GSAP | Standard (free for non-commercial and small commercial use) | Timelines, ScrollTrigger |
| Lenis | MIT | Smooth scrolling |
| lucide-react | ISC | Icons |

GSAP's standard licence covers this use. It is loaded client-side only.

## Imagery

None. Every project cover is generated procedurally from a seed, a motif
and a palette declared in `src/data/projects.ts`. The generation code in
`src/lib/coverArt.ts` is original.

The site icon, Apple icon, maskable icon and Open Graph images are all
generated from the same procedural mark and are original works.

## Content

All project text, timelines and credentials originate from the site owner.
Where a figure or claim is owner-reported rather than independently
verifiable it is flagged in `CONTENT_SOURCES.md`.

## Third-party marks

Company and institution names (Amazon, NVIDIA, Google, AWS, Deloitte,
JPMorganChase, Oracle, IIT Bombay, Integral University, E-Cell) appear
descriptively, to identify the issuer of a credential or the organiser of
an event. No logo, wordmark or trademark is reproduced.
