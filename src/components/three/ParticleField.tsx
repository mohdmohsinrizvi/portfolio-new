"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { POINT_FRAGMENT, POINT_VERTEX } from "./shaders";
import { sceneState } from "@/lib/state";
import type { QualityMode } from "@/lib/quality";
import { qualityPresets } from "@/lib/quality";

type Props = { quality: QualityMode; reducedMotion: boolean };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticleField({ quality, reducedMotion }: Props) {
  const count = qualityPresets[quality].particleCount;
  const points = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rand = mulberry32(9137);
    const pos = new Float32Array(Math.max(count, 1) * 3);
    const seed = new Float32Array(Math.max(count, 1));
    const scale = new Float32Array(Math.max(count, 1));

    for (let i = 0; i < count; i++) {
      // Shell-biased distribution, pushed back from the camera plane.
      // Anything too close projects to a huge point sprite and, under
      // additive blending, blows the frame out — so the near side of the
      // shell is deliberately hollowed out.
      const r = 3.2 + Math.pow(rand(), 0.7) * 7.5;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.72;
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.8 - 2.6;
      seed[i] = rand();
      scale[i] = 0.35 + rand() * 0.9;
    }

    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));

    const m = new THREE.ShaderMaterial({
      vertexShader: POINT_VERTEX,
      fragmentShader: POINT_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: quality === "cinematic" ? 2.6 : 2.1 },
        uSpread: { value: 1 },
        uColor: { value: new THREE.Color("#b3abf2") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: g, material: m };
  }, [count, quality]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    material.uniforms.uSpread.value = 1 + sceneState.scale * 0.12;
    if (points.current) {
      points.current.rotation.y += delta * 0.012;
      points.current.rotation.x = Math.sin(t * 0.05) * 0.05;
    }
  });

  if (count === 0) return null;

  return (
    <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
  );
}
