import * as THREE from "three";

export function Atmosphere() {
  return (
    <mesh scale={[1.05, 1.05, 1.05]}>
      {/* 32 segments = 1/4 the triangles of 64 */}
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        transparent={true}
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(0.4, 0.7, 1.0, intensity * 0.35);
          }
        `}
      />
    </mesh>
  );
}
