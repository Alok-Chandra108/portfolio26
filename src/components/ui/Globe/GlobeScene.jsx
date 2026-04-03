import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        gl={{ antialias: !isMobile, alpha: true }}
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

          {/* High-impact lighting for stability */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#ffffff" />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#0088ff" />

          {/* Globe Layers */}
          <group rotation={[0, 0, 0.4]}>
            <Earth />
            <Clouds />
            <Atmosphere />
            <GlobeArcs />
          </group>

          {/* Cinematic star field - larger, brighter stars with a closer radius */}
          <Stars 
            radius={150} 
            depth={50} 
            count={isMobile ? 1500 : 3500} 
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
