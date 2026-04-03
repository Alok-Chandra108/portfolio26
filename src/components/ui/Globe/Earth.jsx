import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

export function Earth() {
  const earthRef = useRef();

  const [dayMap, nightMap, specularMap, normalMap] = useLoader(TextureLoader, [
    "/textures/planets/earth_atmos_2048.jpg",
    "/textures/planets/earth_lights_2048.png",
    "/textures/planets/earth_specular_2048.jpg",
    "/textures/planets/earth_normal_2048.jpg",
  ]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <mesh ref={earthRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={dayMap}
        normalMap={normalMap}
        roughness={1.0}
        metalness={0.0}
        emissiveMap={nightMap}
        emissive={new THREE.Color(0xffccaa)}
        emissiveIntensity={3}
      />
    </mesh>
  );
}
