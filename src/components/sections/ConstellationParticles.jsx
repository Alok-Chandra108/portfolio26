import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ConstellationParticles({ count = 800, isSoundEnabled = false }) {
  const pointsRef = useRef();
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Generate initial particle positions, colors, and velocities
  const [positions, colors, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initialPos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const colorChoices = [
      new THREE.Color('#b8ff00'), // Acid Green
      new THREE.Color('#ff9a76'), // Peach Coral
      new THREE.Color('#c4b5fd'), // Soft Lavender
      new THREE.Color('#ffffff'), // Pure White Glow
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 6;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initialPos[i * 3] = x;
      initialPos[i * 3 + 1] = y;
      initialPos[i * 3 + 2] = z;

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }

    return [pos, cols, initialPos];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const pointer = state.pointer; // Normalized pointer [-1, 1]

    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    const audioBoost = isSoundEnabled ? Math.sin(time * 6) * 0.3 + 1.2 : 1;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const initX = initialPositions[i3];
      const initY = initialPositions[i3 + 1];
      const initZ = initialPositions[i3 + 2];

      // Subtle ambient drift
      let currentX = initX + Math.sin(time * 0.5 + i) * 0.4 * audioBoost;
      let currentY = initY + Math.cos(time * 0.6 + i * 0.5) * 0.4 * audioBoost;
      let currentZ = initZ + Math.sin(time * 0.4 + i * 0.2) * 0.3;

      // Mouse attraction / vortex distortion
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3.5) {
        const force = (1 - dist / 3.5) * 0.8;
        currentX -= (dx / dist) * force;
        currentY -= (dy / dist) * force;
        currentZ += force * 0.5;
      }

      positionAttr.array[i3] = currentX;
      positionAttr.array[i3 + 1] = currentY;
      positionAttr.array[i3 + 2] = currentZ;
    }

    positionAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
