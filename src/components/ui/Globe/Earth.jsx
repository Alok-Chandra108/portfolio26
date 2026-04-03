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
      <meshPhongMaterial
        map={dayMap}
        normalMap={normalMap}
        specularMap={specularMap}
        specular={new THREE.Color("grey")}
        shininess={5}
        emissiveMap={nightMap}
        emissive={new THREE.Color(0xffff88)}
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}
