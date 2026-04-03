import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Utility to convert lat/lng to 3D spherical coordinates
function getPosFromLatLng(lat, lng, radius = 1.01) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

const MANGALORE_COORDS = { lat: 12.9141, lng: 74.8560 };

export function GlobeArcs() {
  const [hovered, setHovered] = useState(false);
  const mangalorePos = useMemo(() => getPosFromLatLng(MANGALORE_COORDS.lat, MANGALORE_COORDS.lng), []);
  const groupRef = useRef();
  const pulseRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Sync rotation with Earth (0.05)
      groupRef.current.rotation.y = time * 0.05;
    }
    
    // Pulse animation for the pinpoint
    if (pulseRef.current) {
      const s = (hovered ? 1.4 : 1) + Math.sin(time * 3) * 0.3;
      pulseRef.current.scale.set(s, s, s);
      pulseRef.current.material.opacity = (hovered ? 0.4 : 0.2) - (Math.sin(time * 3) * 0.1);
    }
    
    if (innerRef.current) {
       innerRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Mangalore Marker */}
      <group 
        position={mangalorePos}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Core Dot - Pearl White */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Animated Pulse Ring - Emerald Green (Dimmed) */}
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.04, 32, 32]} />
          <meshBasicMaterial 
            color={hovered ? "#00ff88" : "#00aa55"} 
            transparent={true} 
            opacity={0.2} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Subtle Glow Light (Dimmed) */}
        <pointLight intensity={hovered ? 0.3 : 0.1} distance={0.5} color="#00ff88" />

        {/* Interactive Hover Label */}
        {hovered && (
          <Html 
            distanceFactor={3} 
            position={[0, 0.05, 0]}
            center
            className="globe-label-wrapper"
          >
            <div className="globe-label">
              <span className="globe-label-icon">
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span className="globe-label-text">I'm Here</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
