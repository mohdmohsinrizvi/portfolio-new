"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { SignalCore } from "./SignalCore";
import { ParticleField } from "./ParticleField";
import { OrbitRings } from "./OrbitRings";
import type { QualityMode } from "@/lib/quality";
import { qualityPresets } from "@/lib/quality";

type Props = {
  quality: QualityMode;
  reducedMotion: boolean;
};

export function SignalScene({ quality, reducedMotion }: Props) {
  const preset = qualityPresets[quality];

  return (
    <Canvas
      frameloop={quality === "lite" && reducedMotion ? "demand" : "always"}
      dpr={[1, preset.dprCap]}
      gl={{
        antialias: quality === "cinematic",
        alpha: true,
        powerPreference: quality === "lite" ? "low-power" : "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 42, position: [0, 0, 5.4], near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.NoToneMapping;
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <SignalCore quality={quality} reducedMotion={reducedMotion} />
        {preset.field ? <ParticleField quality={quality} reducedMotion={reducedMotion} /> : null}
        {preset.rings ? <OrbitRings reducedMotion={reducedMotion} /> : null}
      </Suspense>
    </Canvas>
  );
}
