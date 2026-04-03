import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { Earth } from "./Earth";
import { Clouds } from "./Clouds";
import { Atmosphere } from "./Atmosphere";
import { GlobeArcs } from "./GlobeArcs";
import "./Globe.css";

export default function GlobeScene() {
  return (
    <div className="globe-canvas-container">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={45} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={5}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />

          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
          <spotLight
            position={[-10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />

          {/* Globe Layers */}
          <group rotation={[0, 0, 0.4]}>
            <Earth />
            <Clouds />
            <Atmosphere />
            <GlobeArcs />
          </group>

          {/* Background */}
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade={true} />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="globe-overlay">
        <div className="globe-stats">
          <div className="stat-item">
            <span className="stat-label">ACTIVE CONNECTIONS</span>
            <span className="stat-value">2,841</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">NODES ONLINE</span>
            <span className="stat-value">148</span>
          </div>
        </div>
      </div>
    </div>
  );
}
