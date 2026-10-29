"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COVER_H, COVER_W } from "@/lib/coverArt";

/**
 * A single fullscreen quad. Layout, cover-fitting, distortion and the
 * transition wipe all happen in the fragment shader; the CPU only supplies
 * two textures, a progress value and a velocity scalar.
 *
 * The technique follows the publicly documented drag + distortion slider
 * pattern (one plane, velocity mapped into shader distortion), written
 * from scratch for this project.
 */

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform vec2  uViewport;
uniform vec4  uCard;      // cx, cy, halfW, halfH (css px, origin bottom-left)
uniform vec2  uCoverA;
uniform vec2  uCoverB;
uniform float uProgress;
uniform float uVelocity;
uniform float uTime;
uniform float uBend;
uniform float uFade;
uniform vec3  uInk;

varying vec2 vUv;

void main(){
  vec2 px = vUv * uViewport;
  vec2 local = (px - uCard.xy) / uCard.zw;

  float r = length(local);
  float inside = 1.0 - smoothstep(0.93, 1.03, r);

  float t = clamp(uProgress, 0.0, 1.0);
  float amp = t * (1.0 - t) * 4.0;
  float vel = clamp(uVelocity, -1.4, 1.4);

  vec2 a = local;
  vec2 b = local;

  a.x += a.x * uBend * amp;
  a.y += sin(a.x * 4.2 + uTime * 1.6) * 0.03 * amp;
  a.x += vel * 0.15 * amp;

  b.x += b.x * uBend * amp;
  b.y += sin(b.x * 4.2 + uTime * 1.6 + 1.7) * 0.03 * amp;
  b.x += vel * 0.15 * amp;

  float split = vel * 0.012 * (0.3 + amp);

  vec2 uvA = (a * 0.5 + 0.5);
  uvA = (uvA - 0.5) * uCoverA + 0.5;
  vec2 uvB = (b * 0.5 + 0.5);
  uvB = (uvB - 0.5) * uCoverB + 0.5;

  vec3 colA = vec3(
    texture2D(uTexA, uvA + vec2(split, 0.0)).r,
    texture2D(uTexA, uvA).g,
    texture2D(uTexA, uvA - vec2(split, 0.0)).b
  );
  vec3 colB = vec3(
    texture2D(uTexB, uvB + vec2(split, 0.0)).r,
    texture2D(uTexB, uvB).g,
    texture2D(uTexB, uvB - vec2(split, 0.0)).b
  );

  float bent = (local.y) * 0.17 + sin(local.y * 3.4 + uTime * 0.8) * 0.028;
  float axis = (local.x * 0.5 + 0.5);
  float sweep = smoothstep(0.0, 1.0, t * 1.55 - axis * 0.55 + bent);
  vec3 col = mix(colA, colB, sweep);

  float seam = 1.0 - smoothstep(0.0, 0.085, abs(t * 1.55 - axis * 0.55 + bent - 0.5));
  col += uInk * seam * 0.18 * amp;

  col += uInk * abs(vel) * amp * 0.10;

  float vig = 1.0 - smoothstep(0.3, 1.12, r);
  col *= 0.5 + 0.5 * vig;

  float g = fract(sin(dot(vUv * uViewport, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.03;

  gl_FragColor = vec4(col, inside * uFade);
}
`;

/** Shared, non-reactive gallery state. Mutated by input handlers, read in useFrame. */
export type GalleryState = {
  textures: THREE.Texture[];
  /** committed index */
  index: number;
  /** float position; wrapping is handled by modulo on texture lookup */
  pos: number;
  target: number;
  velocity: number;
  dragging: boolean;
  /** css pixels */
  viewport: [number, number];
  /** cx, cy, halfW, halfH — origin bottom-left */
  card: [number, number, number, number];
  fade: number;
  bend: number;
};

function wrap(i: number, n: number): number {
  return ((i % n) + n) % n;
}

function coverScale(cardW: number, cardH: number): [number, number] {
  const ra = COVER_W / COVER_H;
  const rc = cardW / cardH;
  return ra > rc ? [rc / ra, 1] : [1, ra / rc];
}

export function GalleryPlane({ state }: { state: GalleryState }) {
  const uniforms = useMemo(() => {
    const fallback = new THREE.Texture();
    return {
      uTexA: { value: fallback },
      uTexB: { value: fallback },
      uViewport: { value: new THREE.Vector2(1, 1) },
      uCard: { value: new THREE.Vector4(0, 0, 1, 1) },
      uCoverA: { value: new THREE.Vector2(1, 1) },
      uCoverB: { value: new THREE.Vector2(1, 1) },
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uBend: { value: 0.11 },
      uFade: { value: 0 },
      uInk: { value: new THREE.Color("#b3abf2") },
    };
  }, []);

  const smooth = useRef({ pos: 0, vel: 0 });

  useFrame((s, delta) => {
    const dt = Math.min(delta, 0.05);
    const n = Math.max(state.textures.length, 1);

    /* inertia + snap: critically damped approach to the target */
    if (!state.dragging) {
      const stiffness = 9;
      const damping = 9.5;
      const acc = (state.target - smooth.current.pos) * stiffness;
      const d = acc * dt;
      smooth.current.vel = (smooth.current.vel + d) * Math.exp(-damping * dt);
      smooth.current.pos += smooth.current.vel * dt * 4;
      state.pos = smooth.current.pos;
      state.velocity = smooth.current.vel * 0.55;
    } else {
      smooth.current.pos = state.pos;
      smooth.current.vel = state.velocity * 1.2;
    }

    const base = Math.floor(smooth.current.pos);
    const frac = smooth.current.pos - base;
    const a = wrap(base, n);
    const b = wrap(base + 1, n);

    uniforms.uTexA.value = state.textures[a] ?? uniforms.uTexA.value;
    uniforms.uTexB.value = state.textures[b] ?? uniforms.uTexB.value;

    const [cw, ch] = [state.card[2] * 2, state.card[3] * 2];
    const [sa, sb] = coverScale(cw, ch);
    uniforms.uCoverA.value.set(sa, sb);
    uniforms.uCoverB.value.set(sa, sb);

    uniforms.uViewport.value.set(state.viewport[0], state.viewport[1]);
    uniforms.uCard.value.set(state.card[0], state.card[1], state.card[2], state.card[3]);
    uniforms.uProgress.value = frac;
    uniforms.uVelocity.value = state.velocity;
    uniforms.uBend.value = state.bend;
    uniforms.uFade.value = state.fade;
    uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
