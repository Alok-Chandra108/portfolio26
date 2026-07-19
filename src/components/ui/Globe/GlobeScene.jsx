import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Earth } from "./Earth";
import { Clouds } from "./Clouds";
import { Atmosphere } from "./Atmosphere";
import { GlobeArcs } from "./GlobeArcs";
import "./Globe.css";

export default function GlobeScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className="globe-canvas-container">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3], fov: 45 }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={2}
            maxDistance={5}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />

          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, 5, -10]} intensity={0.7} color="#ffffff" />

          {/* Globe Layers */}
          <group rotation={[0, 0, 0.4]}>
            <Earth />
            <Clouds />
            <Atmosphere />
            <GlobeArcs />
          </group>

          {/* Cinematic star field - reduced count for performance */}
          <Stars
            radius={150}
            depth={50}
            count={isMobile ? 400 : 1000}
            factor={8}
            saturation={0.5}
            fade={true}
            speed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
