import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export function Clouds() {
  const cloudsRef = useRef();
  // Using existing 2048px texture
  const cloudMap = useLoader(THREE.TextureLoader, "/textures/planets/earth_clouds_2048.png");

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.08;
    }
  });

  return (
    <mesh ref={cloudsRef} scale={[1.03, 1.03, 1.03]}>
      {/* 32 segments = 1/4 the triangles of 64 */}
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial
        map={cloudMap}
        transparent={true}
        opacity={0.35}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
