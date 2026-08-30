import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Individual Orb ─────────────────────────────── */
function Orb({ color, position, size = 1.4, speed = 1.5, distort = 0.3, opacity = 0.35, floatSpeed = 1.5 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.04 * speed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06 * speed) * 0.15;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={0.4}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </Sphere>
    </Float>
  );
}

/* ── Mouse-following primary orb ────────────────── */
function PrimaryOrb() {
  const meshRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Lazy mouse follow
    const targetX = mouse.current.x * viewport.width * 0.12;
    const targetY = mouse.current.y * viewport.height * 0.12;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.015;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.015;

    meshRef.current.rotation.z = state.clock.elapsedTime * 0.03;
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0.5, 0]}>
        <MeshDistortMaterial
          color="#ffecd2"
          attach="material"
          distort={0.25}
          speed={1.2}
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </Sphere>
    </Float>
  );
}

/* ── Glow point (bright center) ────────────────── */
function GlowPoint() {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.15 + 1;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ref} position={[0.5, 1.2, 1]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
    </mesh>
  );
}

/* ── Scene composition ─────────────────────────── */
export default function HeroScene() {
  return (
    <div
      className="hero__scene"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#fff5ee" />

        {/* ── Warm coral / peach — right side ── */}
        <Orb
          color="#ff9a76"
          position={[2.2, 0.8, -0.5]}
          size={1.8}
          speed={1.2}
          distort={0.35}
          opacity={0.28}
          floatSpeed={1.2}
        />

        {/* ── Soft lavender — top left ── */}
        <Orb
          color="#c4b5fd"
          position={[-2, 1.5, -1]}
          size={2}
          speed={1.8}
          distort={0.3}
          opacity={0.25}
          floatSpeed={1.5}
        />

        {/* ── Iridescent pink — center-right ── */}
        <Orb
          color="#f9a8d4"
          position={[0.8, -0.5, 0.5]}
          size={1.5}
          speed={2}
          distort={0.4}
          opacity={0.22}
          floatSpeed={2}
        />

        {/* ── Amber / gold — bottom ── */}
        <Orb
          color="#fbbf24"
          position={[-0.8, -1.5, -0.8]}
          size={1.3}
          speed={1.5}
          distort={0.3}
          opacity={0.2}
          floatSpeed={1.8}
        />

        {/* ── Soft sky blue — top right ── */}
        <Orb
          color="#93c5fd"
          position={[1.5, 2, -1.5]}
          size={1.6}
          speed={1.3}
          distort={0.25}
          opacity={0.2}
          floatSpeed={1}
        />

        {/* ── Mint / teal accent — bottom left ── */}
        <Orb
          color="#6ee7b7"
          position={[-2.5, -0.8, 0]}
          size={1.1}
          speed={2.2}
          distort={0.35}
          opacity={0.18}
          floatSpeed={2.5}
        />

        {/* ── Mouse-following warm center ── */}
        <PrimaryOrb />

        {/* ── Bright glow point ── */}
        <GlowPoint />
      </Canvas>
    </div>
  );
}
