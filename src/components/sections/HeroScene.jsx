import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAudio } from '../../context/AudioContext.jsx';
import ConstellationParticles from './ConstellationParticles.jsx';

/* ── Individual Orb ─────────────────────────────── */
function Orb({ color, position, size = 1.4, speed = 1.5, distort = 0.3, opacity = 0.35, floatSpeed = 1.5, isSoundEnabled }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const soundFactor = isSoundEnabled ? 1 + Math.sin(time * 4) * 0.25 : 1;

    meshRef.current.rotation.z = time * 0.04 * speed;
    meshRef.current.rotation.x = Math.sin(time * 0.06 * speed) * 0.15;
    meshRef.current.scale.setScalar(soundFactor);
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={0.4}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={isSoundEnabled ? distort * 1.5 : distort}
          speed={isSoundEnabled ? speed * 1.8 : speed}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={isSoundEnabled ? opacity * 1.25 : opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </Sphere>
    </Float>
  );
}

/* ── Mouse-following primary orb ────────────────── */
function PrimaryOrb({ isSoundEnabled }) {
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
    const time = state.clock.elapsedTime;

    // Lazy mouse follow
    const targetX = mouse.current.x * viewport.width * 0.14;
    const targetY = mouse.current.y * viewport.height * 0.14;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;

    meshRef.current.rotation.z = time * 0.03;
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[2.2, 64, 64]} position={[0, 0.5, 0]}>
        <MeshDistortMaterial
          color={isSoundEnabled ? "#b8ff00" : "#ffecd2"}
          attach="material"
          distort={isSoundEnabled ? 0.45 : 0.25}
          speed={isSoundEnabled ? 2.5 : 1.2}
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={isSoundEnabled ? 0.45 : 0.55}
          depthWrite={false}
        />
      </Sphere>
    </Float>
  );
}

/* ── Glow point (bright center) ────────────────── */
function GlowPoint({ isSoundEnabled }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const pulseSpeed = isSoundEnabled ? 2.5 : 0.8;
    const pulse = Math.sin(time * pulseSpeed) * (isSoundEnabled ? 0.35 : 0.15) + 1;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ref} position={[0.5, 1.2, 1]}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshBasicMaterial color={isSoundEnabled ? "#b8ff00" : "#ffffff"} transparent opacity={0.6} />
    </mesh>
  );
}

/* ── Main Scene composition ─────────────────────────── */
export default function HeroScene() {
  const { isSoundEnabled } = useAudio() || {};
  const [particleCount, setParticleCount] = useState(800);

  useEffect(() => {
    // Responsive particle count tuning
    const updateCount = () => {
      if (window.innerWidth < 768) {
        setParticleCount(350);
      } else {
        setParticleCount(900);
      }
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

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
        <ambientLight intensity={2.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff5ee" />

        {/* ── Interactive 3D Constellation Particle Field ── */}
        <ConstellationParticles count={particleCount} isSoundEnabled={isSoundEnabled} />

        {/* ── Warm coral / peach — right side ── */}
        <Orb
          color={isSoundEnabled ? "#b8ff00" : "#ff9a76"}
          position={[2.2, 0.8, -0.5]}
          size={1.8}
          speed={1.2}
          distort={0.35}
          opacity={0.55}
          floatSpeed={1.2}
          isSoundEnabled={isSoundEnabled}
        />

        {/* ── Soft lavender — top left ── */}
        <Orb
          color="#c4b5fd"
          position={[-2, 1.5, -1]}
          size={2}
          speed={1.8}
          distort={0.3}
          opacity={0.5}
          floatSpeed={1.5}
          isSoundEnabled={isSoundEnabled}
        />

        {/* ── Iridescent pink / Acid green accent ── */}
        <Orb
          color={isSoundEnabled ? "#a3e635" : "#f9a8d4"}
          position={[0.8, -0.5, 0.5]}
          size={1.5}
          speed={2}
          distort={0.4}
          opacity={0.45}
          floatSpeed={2}
          isSoundEnabled={isSoundEnabled}
        />

        {/* ── Amber / gold — bottom ── */}
        <Orb
          color="#fbbf24"
          position={[-0.8, -1.5, -0.8]}
          size={1.3}
          speed={1.5}
          distort={0.3}
          opacity={0.4}
          floatSpeed={1.8}
          isSoundEnabled={isSoundEnabled}
        />

        {/* ── Soft sky blue — top right ── */}
        <Orb
          color="#93c5fd"
          position={[1.5, 2, -1.5]}
          size={1.6}
          speed={1.3}
          distort={0.25}
          opacity={0.4}
          floatSpeed={1}
          isSoundEnabled={isSoundEnabled}
        />

        {/* ── Mint / Acid Green accent — bottom left ── */}
        <Orb
          color="#6ee7b7"
          position={[-2.5, -0.8, 0]}
          size={1.1}
          speed={2.2}
          distort={0.35}
          opacity={0.38}
          floatSpeed={2.5}
          isSoundEnabled={isSoundEnabled}
        />

        {/* ── Mouse-following warm center ── */}
        <PrimaryOrb isSoundEnabled={isSoundEnabled} />

        {/* ── Bright glow point ── */}
        <GlowPoint isSoundEnabled={isSoundEnabled} />
      </Canvas>
    </div>
  );
}
