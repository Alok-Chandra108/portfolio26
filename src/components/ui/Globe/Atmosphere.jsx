import * as THREE from 'three'

export function Atmosphere() {
  return (
    <mesh scale={[1.05, 1.05, 1.05]}>
      <sphereGeometry args={[1, 64, 64]} />
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
            // Muted, premium light-blue tone
            gl_FragColor = vec4(0.4, 0.7, 1.0, intensity * 0.4);
          }
        `}
      />
    </mesh>
  );
}
