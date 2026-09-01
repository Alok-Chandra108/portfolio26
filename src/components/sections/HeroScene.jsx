import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import * as THREE from "three";

// Waypoints — rotation is computed from velocity, NOT authored per waypoint
// X: −1.8 → +1.3 (avoids overlapping heading text on far right)
// Y: −1.0 → +1.8 (within viewport height), Z: always 0
const WAYPOINTS = [
  { id: "REST",         pos: [-0.5,  0.30, 0], ts: 1.0, dur: 3.5 },
  { id: "UPPER_RIGHT",  pos: [ 1.1,  1.35, 0], ts: 1.2, dur: 3.0 },
  { id: "LOWER_RIGHT",  pos: [ 0.9, -0.75, 0], ts: 1.5, dur: 2.8 },
  { id: "CENTER_LOW",   pos: [-0.2, -0.85, 0], ts: 1.3, dur: 2.5 },
  { id: "LEFT_MID",     pos: [-1.6,  0.20, 0], ts: 1.0, dur: 3.0 },
  { id: "UPPER_LEFT",   pos: [-1.4,  1.55, 0], ts: 0.9, dur: 2.8 },
  { id: "CENTER_HIGH",  pos: [-0.3,  1.45, 0], ts: 0.8, dur: 3.0 },
  { id: "RIGHT_MID",    pos: [ 1.2,  0.30, 0], ts: 1.4, dur: 2.5 },
  { id: "DIVE_LOW",     pos: [ 0.1, -1.00, 0], ts: 1.8, dur: 2.0 },
  { id: "RISE_HIGH",    pos: [-0.5,  1.80, 0], ts: 0.7, dur: 2.5 },
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

  const wpIdx     = useRef(0);
  const wpTimer   = useRef(0);
  const firstLoop = useRef(true);
  const ready     = useRef(false);

  // BUG 1 & 2 FIX: Pre-allocate all THREE objects (zero allocations in useFrame)
  const prevPos   = useRef(new THREE.Vector3(-0.5, 0.3, 0));
  const tPos      = useRef(new THREE.Vector3(-0.5, 0.3, 0));
  const velocity  = useRef(new THREE.Vector3());
  const nextWpPos = useRef(new THREE.Vector3(-0.5, 0.3, 0));

  // Target and current smoothed rotation values
  const tYaw   = useRef(0);   // target Y rotation (from velocity)
  const tPitch = useRef(0);   // target X rotation (from velocity)
  const tRoll  = useRef(0);   // target Z rotation (banking)
  const cYaw   = useRef(0);   // current smoothed Y rotation
  const cPitch = useRef(0);   // current smoothed X rotation
  const cRoll  = useRef(0);   // current smoothed Z rotation

  // Tuning constants — direction-based rotation (stable throughout transit)
  const DIR_YAW    = 0.55;   // max yaw angle from direction to target
  const DIR_PITCH  = 0.30;   // max pitch angle from direction to target
  const DIR_ROLL   = 0.40;   // max roll (banking) from direction to target

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

  useFrame((state, delta) => {
    if (!ready.current || !rootRef.current || !pivotRef.current) return;

    // ── 0. Clamp delta to prevent spiral on tab-switch ──────────────
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;

    // ── 1. Advance waypoint timer ────────────────────────────────────
    const wp = WAYPOINTS[wpIdx.current];
    wpTimer.current += dt;
    if (wpTimer.current >= wp.dur) {
      wpTimer.current = 0;
      wpIdx.current = (wpIdx.current + 1) % WAYPOINTS.length;
      if (firstLoop.current && wpIdx.current === 0) {
        firstLoop.current = false;
      }
    }

    // ── 2. Position update ────────────────────────────────────────────
    const posLerp = Math.min(dt * 1.8, 1.0);
    nextWpPos.current.set(...WAYPOINTS[wpIdx.current].pos);
    prevPos.current.copy(tPos.current);
    tPos.current.lerp(nextWpPos.current, posLerp);

    // ── 3. Velocity (for speed metric and lighting only) ─────────────
    velocity.current.subVectors(tPos.current, prevPos.current);
    const speed = velocity.current.length();

    // ── 4. Direction to target waypoint (stable rotation signal) ─────
    //    Unlike velocity (which decays exponentially from lerp), the
    //    direction vector stays consistent throughout the entire transit.
    //    This prevents the "rotate briefly then drift lifelessly" issue.
    const dx = nextWpPos.current.x - tPos.current.x;
    const dy = nextWpPos.current.y - tPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // ── 5. Derive rotation from direction (fades as phoenix arrives) ──
    if (dist > 0.02) {
      const ndx = dx / dist;  // normalized direction X
      const ndy = dy / dist;  // normalized direction Y
      // Full orientation when far (>0.4), smooth fade when close (<0.04)
      const orientW = THREE.MathUtils.smoothstep(dist, 0.04, 0.4);

      // YAW: heading right (ndx>0) → nose turns right → negative Y rotation
      tYaw.current   = -ndx * DIR_YAW   * orientW;
      // PITCH: heading up (ndy>0) → nose tilts up → negative X rotation
      tPitch.current = -ndy * DIR_PITCH  * orientW;
      // ROLL: heading right → bank right → negative Z rotation
      tRoll.current  = -ndx * DIR_ROLL   * orientW;
    } else {
      // At waypoint — smoothly relax to neutral (frame-rate independent)
      const relax = Math.min(dt * 3.0, 1.0);
      tYaw.current   *= (1.0 - relax);
      tPitch.current *= (1.0 - relax);
      tRoll.current  *= (1.0 - relax);
    }

    // ── 6. Subtle idle breathing (always present, adds life) ─────────
    const idleYaw   = Math.sin(elapsed * 0.4) * 0.025;
    const idlePitch = Math.sin(elapsed * 0.6 + 1.0) * 0.015;

    // ── 7. Mouse look — strong when hovering, fades when travelling ──
    const mouseWeight = 1.0 - THREE.MathUtils.smoothstep(dist, 0.04, 0.35);
    const mY =  (mouse.current.x * Math.PI) / 14 * mouseWeight * 0.8;
    const mX = -(mouse.current.y * Math.PI) / 16 * mouseWeight * 0.8;

    // ── 8. Smooth current rotations toward targets ───────────────────
    const rotLerp = Math.min(dt * 2.5, 1.0);
    cYaw.current   += (tYaw.current   - cYaw.current)   * rotLerp;
    cPitch.current += (tPitch.current - cPitch.current) * rotLerp;
    cRoll.current  += (tRoll.current  - cRoll.current)  * rotLerp;

    // ── 9. Apply rotation to pivot ───────────────────────────────────
    pivotRef.current.rotation.x = cPitch.current + mX + idlePitch;
    pivotRef.current.rotation.y = cYaw.current   + mY + idleYaw;
    pivotRef.current.rotation.z = cRoll.current;

    // ── 10. Apply position + manual float ────────────────────────────
    const floatY = Math.sin(elapsed * 1.5) * 0.07;
    rootRef.current.position.set(
      tPos.current.x,
      tPos.current.y + floatY,
      tPos.current.z
    );

    // ── 11. GLB clip timeScale ───────────────────────────────────────
    if (names.length > 0 && actions[names[0]]) {
      const clip = actions[names[0]];
      clip.timeScale += (WAYPOINTS[wpIdx.current].ts - clip.timeScale) * Math.min(dt * 3.0, 1.0);
    }

    // ── 12. Light pulsing based on movement energy ───────────────────
    const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.5);
    const energyBoost = Math.min(speed * 80.0, 6.0);
    if (pinkLightRef?.current) {
      pinkLightRef.current.intensity = 4 + pulse * 5 + energyBoost;
    }
    if (blueLightRef?.current) {
      blueLightRef.current.intensity = 3 + (1 - pulse) * 5;
    }
  });

  return (
    <>
      <FireEmbers trackRef={rootRef} />
      <group ref={rootRef}>
        {/* No <Float> — manual float applied in useFrame to rootRef.position */}
        <group ref={pivotRef}>
          <group ref={modelRef}>
            <group ref={animRef} dispose={null}>
              <primitive object={scene} />
            </group>
          </group>
        </group>
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
    window.addEventListener("mousemove", onMove, { passive: true });
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
