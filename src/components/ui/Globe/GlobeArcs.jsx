import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";

// Utility to convert lat/lng to 3D spherical coordinates
function getPosFromLatLng(lat, lng, radius = 1.01) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Generate a curved path between two points on a sphere
function getCurve(p1, p2) {
  const distance = p1.distanceTo(p2);
  const midPoint = p1.clone().lerp(p2, 0.5);
  // Elevate the midpoint based on distance
  midPoint.normalize().multiplyScalar(1.01 + distance * 0.25);
  return new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
}

const ARC_DATA = [
  { startLat: 40.7128, startLng: -74.0060, endLat: 28.6139, endLng: 77.2090, color: "#1de9b6" }, // NYC to Delhi
  { startLat: 51.5074, startLng: -0.1278, endLat: 28.6139, endLng: 77.2090, color: "#b8ff00" },  // London to Delhi
  { startLat: 35.6762, startLng: 139.6503, endLat: 28.6139, endLng: 77.2090, color: "#1de9b6" }, // Tokyo to Delhi
  { startLat: 1.3521, startLng: 103.8198, endLat: 28.6139, endLng: 77.2090, color: "#b8ff00" },  // Singapore to Delhi
  { startLat: -33.8688, startLng: 151.2093, endLat: 28.6139, endLng: 77.2090, color: "#1de9b6" }, // Sydney to Delhi
  { startLat: 37.7749, startLng: -122.4194, endLat: 28.6139, endLng: 77.2090, color: "#b8ff00" } // SF to Delhi
];

export function GlobeArcs() {
  const arcs = useMemo(() => {
    return ARC_DATA.map((arc) => {
      const start = getPosFromLatLng(arc.startLat, arc.startLng);
      const end = getPosFromLatLng(arc.endLat, arc.endLng);
      const curve = getCurve(start, end);
      return { ...arc, points: curve.getPoints(50) };
    });
  }, []);

  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Subtle rotation matching the Earth, if Earth rotation is handled cleanly.
      // Note: Earth rotates at 0.05, we will rotate this group at 0.05 as well.
      groupRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc, i) => (
        <Line
          key={i}
          points={arc.points}
          color={arc.color}
          opacity={0.6}
          transparent
          lineWidth={2}
          dashed={true}
          dashSize={0.1}
          gapSize={0.05}
        // We can animate dashes with useFrame on individual materials if needed
        />
      ))}

      {/* City Markers */}
      {arcs.map((arc, i) => (
        <mesh key={`start-${i}`} position={arc.points[0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color={arc.color} />
        </mesh>
      ))}
      {/* Delhi Marker */}
      <mesh position={arcs[0].points[arcs[0].points.length - 1]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
