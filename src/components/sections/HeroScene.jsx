import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function PhoenixModel({ url, mouse }) {
  const group = useRef();
  const pivotRef = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);
  
  const [modelTransform, setModelTransform] = useState({ scale: 1, offset: new THREE.Vector3() });

  useEffect(() => {
    // Play the first animation
    if (names.length > 0) {
      const action = actions[names[0]];
      action.reset().fadeIn(0.5).play();
    }

    if (scene) {
      // Calculate original size and center
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      // Target size in world units (adjust to make it look right on screen)
      const targetSize = 3.5; 
      const scale = targetSize / maxDim;
      
      // Calculate offset to center the model BEFORE scaling is applied
      const offset = center.clone().negate();

      setModelTransform({ scale, offset });
    }
  }, [actions, names, scene]);

  // Mouse rotate effect — applied to the pivot group
  useFrame((state, delta) => {
    if (!pivotRef.current) return;
    const targetRotationY = (mouse.current.x * Math.PI) / 8;
    const targetRotationX = -(mouse.current.y * Math.PI) / 10;
    pivotRef.current.rotation.y += (targetRotationY - pivotRef.current.rotation.y) * delta * 2.5;
    pivotRef.current.rotation.x += (targetRotationX - pivotRef.current.rotation.x) * delta * 2.5;
  });

  return (
    // Shifted slightly to the left, moved UP to sit in the main whitespace above the banner
    <group position={[-0.8, 0.4, 0]}>
      <Float speed={1.5} rotationIntensity={0} floatIntensity={0.4}>
        <group ref={pivotRef}>
          {/* Apply the computed scale here, safely outside the animated scene */}
          <group scale={modelTransform.scale}>
            {/* The group ref for animations */}
            <group ref={group} dispose={null}>
              {/* Apply the centering offset here */}
              <primitive object={scene} position={modelTransform.offset} />
            </group>
          </group>
        </group>
      </Float>
    </group>
  );
}

useGLTF.preload('/phoenix.glb');

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-2, 3, 2]} intensity={6} color="#ec4899" />
        <pointLight position={[3, -2, 1]} intensity={6} color="#3b82f6" />
        <Environment preset="city" />

        <PhoenixModel url="/phoenix.glb" mouse={mouse} />
      </Canvas>
    </div>
  );
}
