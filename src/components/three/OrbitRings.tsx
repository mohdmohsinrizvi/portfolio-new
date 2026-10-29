"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/state";

/** Three tilted luminous rings — the "orbital structure" reading of The Signal. */
export function OrbitRings({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    const base = new THREE.TorusGeometry(1.55, 0.0035, 3, 220);
    const configs = [
      { rot: [Math.PI * 0.5, 0, 0.34] as const, color: "#b3abf2", opacity: 0.5, speed: 0.12 },
      { rot: [Math.PI * 0.28, 0.9, -0.2] as const, color: "#4f9aa2", opacity: 0.4, speed: -0.08 },
      { rot: [1.15, -0.5, 0.75] as const, color: "#b8a68c", opacity: 0.3, speed: 0.055 },
    ];
    return configs.map((c) => ({
      geometry: base,
      material: new THREE.MeshBasicMaterial({
        color: new THREE.Color(c.color),
        transparent: true,
        opacity: c.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      rot: c.rot as [number, number, number],
      speed: c.speed,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const d = reducedMotion ? 0 : Math.min(delta, 0.05);
    group.current.children.forEach((child, i) => {
      const r = rings[i];
      if (!r) return;
      child.rotation.z += d * r.speed;
    });
    const s = sceneState.scale * 1.02;
    group.current.scale.setScalar(group.current.scale.x + (s - group.current.scale.x) * 0.06);
    group.current.visible = sceneState.coreVisible > 0.05;
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} geometry={r.geometry} material={r.material} rotation={r.rot} />
      ))}
    </group>
  );
}
