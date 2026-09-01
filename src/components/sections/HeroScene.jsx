import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// Waypoints spread across the full hero section
// X: -1.8 (far left) to 1.3 (right), Y: -0.9 (low) to 1.6 (high)
const WAYPOINTS = [
  { id: "START",       pos: [-0.5,  0.3, 0], rot: [ 0,    0,     0   ], ts: 1.0, dur: 3.5 },
  { id: "UPPER_RIGHT", pos: [ 1.2,  1.4, 0], rot: [ 0,   -0.4,   0.15], ts: 1.2, dur: 3.0 },
  { id: "LOWER_RIGHT", pos: [ 1.0, -0.8, 0], rot: [ 0.5, -0.2,   0   ], ts: 1.5, dur: 2.8 },
  { id: "CENTER_LOW",  pos: [-0.3, -0.9, 0], rot: [ 0.4,  0,     0   ], ts: 1.3, dur: 2.5 },
  { id: "LEFT_MID",    pos: [-1.7,  0.2, 0], rot: [ 0,    0.5,  -0.1 ], ts: 1.0, dur: 3.0 },
  { id: "UPPER_LEFT",  pos: [-1.5,  1.6, 0], rot: [-0.2,  0.3,   0   ], ts: 0.8, dur: 2.8 },
  { id: "CENTER_HIGH", pos: [-0.3,  1.5, 0], rot: [-0.3,  0,     0   ], ts: 0.9, dur: 3.0 },
  { id: "RIGHT_MID",   pos: [ 1.3,  0.3, 0], rot: [ 0,   -0.5,   0.1 ], ts: 1.4, dur: 2.5 },
  { id: "REST",        pos: [-0.5,  0.3, 0], rot: [ 0,    0,     0   ], ts: 1.0, dur: 4.0 },
];

// ── Fire Embers ─────────────────────────────────────────────
function FireEmbers({ trackRef }) {
  const COUNT  = 100;
  const posArr = useMemo(() => {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) a[i * 3 + 1] = -999;
    return a;
  }, []);
  const colArr = useMemo(() => new Float32Array(COUNT * 4), []);
  const velArr = useMemo(() => {
    const v = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      v[i * 3]     = (Math.random() - 0.5) * 0.05;
      v[i * 3 + 1] = -(Math.random() * 0.06 + 0.02);
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    return v;
  }, []);
  const ages = useMemo(() => {
    const a = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) a[i] = Math.random();
    return a;
  }, []);
  const ptRef = useRef();

  useFrame(() => {
    if (!ptRef.current) return;
    const pa = ptRef.current.geometry.attributes.position;
    const ca = ptRef.current.geometry.attributes.color;
    const tx = trackRef?.current?.position.x ?? 0;
    const ty = trackRef?.current?.position.y ?? 0;
    const tz = trackRef?.current?.position.z ?? 0;
    for (let i = 0; i < COUNT; i++) {
      ages[i] += 0.016;
      if (ages[i] >= 1.0) {
        ages[i] = 0;
        pa.array[i * 3]     = tx + (Math.random() - 0.5) * 0.4;
        pa.array[i * 3 + 1] = ty - 0.2 + (Math.random() - 0.5) * 0.3;
        pa.array[i * 3 + 2] = tz + (Math.random() - 0.5) * 0.4;
      }
      pa.array[i * 3]     += velArr[i * 3];
      pa.array[i * 3 + 1] += velArr[i * 3 + 1];
      pa.array[i * 3 + 2] += velArr[i * 3 + 2];
      const life = ages[i];
      ca.array[i * 4]     = 1.0;
      ca.array[i * 4 + 1] = Math.max(0, 1.0 - life * 1.8);
      ca.array[i * 4 + 2] = 0.0;
      ca.array[i * 4 + 3] = Math.max(0, 1.0 - life);
    }
    pa.needsUpdate = true;
    ca.needsUpdate = true;
  });

  return (
    <points ref={ptRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={posArr} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={COUNT} array={colArr} itemSize={4} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ── Phoenix Model ────────────────────────────────────────────
function PhoenixModel({ url, mouse, pinkLightRef, blueLightRef }) {
  const rootRef  = useRef();
  const pivotRef = useRef();
  const modelRef = useRef();
  const animRef  = useRef();

  const { scene, animations } = useGLTF(url);
  const { actions, names }    = useAnimations(animations, animRef);

  const wpIdx   = useRef(0);
  const wpTimer = useRef(0);
  const ready   = useRef(false);
  const tPos    = useRef(new THREE.Vector3(-0.5, 0.3, 0));
  const tRotX   = useRef(0);
  const tRotY   = useRef(0);
  const tRotZ   = useRef(0);

  // Compute base scale once
  useEffect(() => {
    if (!scene) return;
    const box    = new THREE.Box3().setFromObject(scene);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (modelRef.current) modelRef.current.scale.setScalar(2.2 / maxDim);
    scene.position.copy(center.negate());
    ready.current = true;
  }, [scene]);

  // Start GLB animation
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].reset().fadeIn(0.3).play();
    }
    return () => {
      if (names.length > 0 && actions[names[0]]) actions[names[0]].stop();
    };
  }, [actions, names]);

  useFrame((_, delta) => {
    if (!ready.current || !rootRef.current || !pivotRef.current) return;
    const dt = Math.min(delta, 0.05);

    // Advance waypoint timer
    const wp = WAYPOINTS[wpIdx.current];
    wpTimer.current += dt;
    if (wpTimer.current >= wp.dur) {
      wpTimer.current = 0;
      wpIdx.current = (wpIdx.current + 1) % WAYPOINTS.length;
      if (wpIdx.current === 0) wpIdx.current = 1; // skip re-entry after first pass
    }

    const next = WAYPOINTS[wpIdx.current];
    const sp   = Math.min(dt * 0.9, 1);

    // Smooth position toward waypoint
    tPos.current.lerp(new THREE.Vector3(...next.pos), sp);
    rootRef.current.position.copy(tPos.current);

    // Clip animation speed
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].timeScale += (next.ts - actions[names[0]].timeScale) * sp * 4;
    }

    // Body tilt based on direction of travel
    const vx    = next.pos[0] - tPos.current.x;
    const vy    = next.pos[1] - tPos.current.y;
    const bodyY = THREE.MathUtils.clamp(vx * 0.5, -0.6, 0.6);
    const bodyX = THREE.MathUtils.clamp(-vy * 0.3, -0.4, 0.4);

    const sp3 = Math.min(dt * 3, 1);
    tRotX.current += ((next.rot[0] + bodyX) - tRotX.current) * sp3;
    tRotY.current += ((next.rot[1] + bodyY) - tRotY.current) * sp3;
    tRotZ.current += (next.rot[2] - tRotZ.current) * sp3;

    // Mouse look — additive on top of body rotation
    const mY = (mouse.current.x * Math.PI) / 14;
    const mX = -(mouse.current.y * Math.PI) / 16;
    pivotRef.current.rotation.x = tRotX.current + mX;
    pivotRef.current.rotation.y = tRotY.current + mY;
    pivotRef.current.rotation.z = tRotZ.current;

    // Accent light pulse
    const pulse = 0.5 + 0.5 * Math.sin(wpTimer.current * 2.0);
    if (pinkLightRef?.current) pinkLightRef.current.intensity = 4 + pulse * 6;
    if (blueLightRef?.current) blueLightRef.current.intensity  = 4 + (1 - pulse) * 6;
  });

  return (
    <>
      <FireEmbers trackRef={rootRef} />
      <group ref={rootRef}>
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
          <group ref={pivotRef}>
            <group ref={modelRef}>
              <group ref={animRef} dispose={null}>
                <primitive object={scene} />
              </group>
            </group>
          </group>
        </Float>
      </group>
    </>
  );
}

useGLTF.preload("/phoenix.glb");

// ── Hero Scene Canvas ────────────────────────────────────────
export default function HeroScene() {
  const mouse        = useRef({ x: 0, y: 0 });
  const pinkLightRef = useRef();
  const blueLightRef = useRef();

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} />
        <pointLight ref={pinkLightRef} position={[-2, 3, 2]} intensity={4} color="#ec4899" />
        <pointLight ref={blueLightRef} position={[ 3,-2, 1]} intensity={4} color="#3b82f6" />
        <Environment preset="city" />
        <PhoenixModel
          url="/phoenix.glb"
          mouse={mouse}
          pinkLightRef={pinkLightRef}
          blueLightRef={blueLightRef}
        />
      </Canvas>
    </div>
  );
}
