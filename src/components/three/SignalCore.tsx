"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SIGNAL_FRAGMENT, SIGNAL_VERTEX } from "./shaders";
import { pointerState, scrollState, sceneState } from "@/lib/state";
import { qualityPresets, type QualityMode } from "@/lib/quality";

type Props = { quality: QualityMode; reducedMotion: boolean };

const COL_A = new THREE.Color("#101226");
const COL_B = new THREE.Color("#264b51");
const COL_C = new THREE.Color("#ece8df");

export function SignalCore({ quality, reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const presets = qualityPresets[quality];

  const geometry = useMemo(() => {
    const detail = presets.coreSegments >= 160 ? 7 : presets.coreSegments >= 96 ? 5 : 4;
    return new THREE.IcosahedronGeometry(1, detail);
  }, [presets.coreSegments]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SIGNAL_VERTEX,
      fragmentShader: SIGNAL_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.19 },
        uFrequency: { value: 1.35 },
        uOctaves: { value: presets.noiseOctaves },
        uColA: { value: COL_A },
        uColB: { value: COL_B },
        uColC: { value: COL_C },
        uIntensity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
  }, [presets.noiseOctaves]);

  useMemo(() => {
    material.uniforms.uOctaves!.value = presets.noiseOctaves;
  }, [material, presets.noiseOctaves]);

  const spring = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    material.uniforms.uTime.value = reducedMotion ? 0 : t;

    /* pointer-follow: critically damped, never a sudden jump */
    const targetX = pointerState.x;
    const targetY = pointerState.y;
    const s = spring.current;
    const stiffness = 5.2;
    const damping = 6.4;
    s.vx += (targetX * 0.55 - s.x) * stiffness * dt;
    s.vy += (targetY * 0.55 - s.y) * stiffness * dt;
    s.vx *= Math.exp(-damping * dt);
    s.vy *= Math.exp(-damping * dt);
    s.x += s.vx * dt * 8;
    s.y += s.vy * dt * 8;

    // smooth the raw pointer so the scene never jitters
    pointerState.sx += (pointerState.x - pointerState.sx) * Math.min(1, dt * 3.2);
    pointerState.sy += (pointerState.y - pointerState.sy) * Math.min(1, dt * 3.2);

    if (group.current) {
      const g = group.current;
      const floatY = reducedMotion ? 0 : Math.sin(t * 0.42) * 0.07;
      const floatX = reducedMotion ? 0 : Math.cos(t * 0.31) * 0.05;

      g.position.x = sceneState.offsetX + floatX;
      g.position.y = sceneState.offsetY + floatY;
      g.position.z = 0;

      const targetScale = sceneState.scale * (1 + Math.abs(scrollState.velocity) * 0.05);
      g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * Math.min(1, dt * 4));

      g.rotation.y += (s.x - g.rotation.y) * Math.min(1, dt * 3);
      g.rotation.x += (-s.y - g.rotation.x) * Math.min(1, dt * 3);
      g.rotation.z = reducedMotion ? 0 : t * 0.045;
    }

    material.uniforms.uIntensity.value = sceneState.coreVisible;
    material.uniforms.uAmp.value = 0.19 * sceneState.morph;
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} material={material} />
      {/* a faint inner shell gives the silhouette depth without a second material pass */}
      <mesh scale={0.965}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#05060b"
          transparent
          opacity={0.55 * sceneState.coreVisible}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
