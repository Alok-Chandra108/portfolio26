import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import * as THREE from "three";

// Waypoints — Z depth variation added for proper banking visibility
const WAYPOINTS = [
  { id: "REST",         pos: [-0.5,  0.30,  0.0], ts: 1.0, dur: 3.5 },
  { id: "UPPER_RIGHT",  pos: [ 1.1,  1.35, -0.3], ts: 1.2, dur: 3.0 },
  { id: "LOWER_RIGHT",  pos: [ 0.9, -0.75,  0.2], ts: 1.6, dur: 2.8 },
  { id: "CENTER_LOW",   pos: [-0.2, -0.90, -0.2], ts: 1.4, dur: 2.5 },
  { id: "LEFT_MID",     pos: [-1.6,  0.20,  0.3], ts: 1.0, dur: 3.0 },
  { id: "UPPER_LEFT",   pos: [-1.4,  1.55, -0.1], ts: 0.9, dur: 2.8 },
  { id: "CENTER_HIGH",  pos: [-0.3,  1.50,  0.4], ts: 0.8, dur: 3.0 },
  { id: "RIGHT_MID",    pos: [ 1.2,  0.30, -0.4], ts: 1.4, dur: 2.5 },
  { id: "DIVE_LOW",     pos: [ 0.1, -1.05,  0.3], ts: 1.9, dur: 2.0 },
  { id: "RISE_HIGH",    pos: [-0.5,  1.80, -0.2], ts: 0.7, dur: 2.5 },
];

// All tunable values at the top — never hardcode inside logic
const POS_LERP_RATE = 2.5; // position smoothing (× dt per frame)
const ROT_SLERP     = 4.0; // quaternion slerp speed (higher = snappier rotation)
const ARRIVE_DIST   = 0.09; // world units — relax when this close to target
const BANK_MAX      = 0.65; // radians — max roll/banking angle
const MOUSE_YAW     = 0.18; // radians — max mouse yaw contribution
const MOUSE_PITCH   = 0.14; // radians — max mouse pitch contribution
const FLOAT_AMP     = 0.07; // world units — idle bob amplitude
const FLOAT_HZ      = 1.5; // Hz — idle bob frequency
const MODEL_SIZE    = 2.8; // target world-unit bounding box size

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

  // ── Position tracking ─────────────────────────────────────────
  const tPos = useRef(new THREE.Vector3(-0.5, 0.3, 0)); // smoothed current position
  const nextWp = useRef(new THREE.Vector3(-0.5, 0.3, 0)); // active waypoint target

  // ── Direction vector ──────────────────────────────────────────
  const toTarget = useRef(new THREE.Vector3()); // nextWp - tPos (recomputed each frame)
  const _dir = useRef(new THREE.Vector3()); // normalized copy of toTarget (for lookAt)

  // ── Quaternion rotation system ────────────────────────────────
  const _lookMat = useRef(new THREE.Matrix4()); // temp matrix for lookAt computation
  const _targetQ = useRef(new THREE.Quaternion()); // desired body orientation
  const _bankQ = useRef(new THREE.Quaternion()); // banking (roll) rotation
  const _mouseQ = useRef(new THREE.Quaternion()); // additive mouse look rotation
  const _pitchQ = useRef(new THREE.Quaternion()); // pitch for mouse look
  const _worldUp = useRef(new THREE.Vector3(0, 1, 0)); // immutable world up
  const _origin = useRef(new THREE.Vector3(0, 0, 0)); // immutable origin for lookAt
  const _bankAxis = useRef(new THREE.Vector3(0, 0, 1)); // Z axis for banking rotation
  const _mouseAxisX = useRef(new THREE.Vector3(1, 0, 0)); // X axis for mouse pitch
  const _mouseAxisY = useRef(new THREE.Vector3(0, 1, 0)); // Y axis for mouse yaw

  // ── Waypoint state ────────────────────────────────────────────
  const wpIdx = useRef(0);
  const wpTimer = useRef(0);
  const ready = useRef(false);

  // Compute base scale once
  useEffect(() => {
    if (!scene) return;
    const box    = new THREE.Box3().setFromObject(scene);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (modelRef.current) {
      modelRef.current.scale.setScalar(MODEL_SIZE / maxDim);
      
      // MODEL_ROTATION_OFFSET:
      // If the phoenix flies tail-first on all transitions -> apply Fix A:
      // modelRef.current.rotation.y = Math.PI; 
      // If the phoenix flies sideways -> apply Fix B:
      // modelRef.current.rotation.y = Math.PI / 2; (or -Math.PI/2)
    }
    
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
    const dt = Math.min(delta, 0.05); // cap at 50ms to prevent spiral after tab switch

    // ─── STEP 1: Advance waypoint timer ─────────────────────────────────────
    wpTimer.current += dt;
    if (wpTimer.current >= WAYPOINTS[wpIdx.current].dur) {
      wpTimer.current = 0;
      wpIdx.current = (wpIdx.current + 1) % WAYPOINTS.length;
    }

    // ─── STEP 2: Lerp position toward active waypoint ───────────────────────
    const { pos, ts } = WAYPOINTS[wpIdx.current];
    nextWp.current.set(pos[0], pos[1], pos[2]);
    const posLerp = Math.min(dt * POS_LERP_RATE, 1.0);
    tPos.current.lerp(nextWp.current, posLerp);

    // ─── STEP 3: Compute direction to target ────────────────────────────────
    // toTarget = vector from current position → next waypoint
    // This is the direction the bird should face while en-route.
    // Normalized: gives a unit vector with magnitude exactly 1.0 regardless of distance.
    // This is WHY direction-based works: the rotation signal never decays.
    toTarget.current.subVectors(nextWp.current, tPos.current);
    const dist = toTarget.current.length();

    // ─── STEP 4: Compute target quaternion from travel direction ─────────────
    if (dist > ARRIVE_DIST) {
      // Bird is en-route — derive full body orientation from direction of travel
      
      // 4a. Normalize direction into _dir (safe copy — does not mutate toTarget)
      _dir.current.copy(toTarget.current).divideScalar(dist);
      
      // 4b. Build a rotation matrix: "look FROM origin, TOWARD _dir, UP = worldUp"
      // Three.js Matrix4.lookAt makes the matrix's -Z axis point toward 'target'.
      // Since three.js -Z is the default "forward", this correctly orients
      // any object whose model faces -Z to look toward the travel direction.
      _lookMat.current.lookAt(_origin.current, _dir.current, _worldUp.current);
      
      // 4c. Extract the quaternion from that rotation matrix.
      // This quaternion represents "face the travel direction".
      _targetQ.current.setFromRotationMatrix(_lookMat.current);
      
      // 4d. Apply banking (roll) — rotate around the LOCAL Z axis (forward axis).
      // When flying RIGHT (positive _dir.x), the right wing dips → positive Z rotation.
      // When flying LEFT (negative _dir.x), the left wing dips → negative Z rotation.
      // _dir.x is already normalized (-1 to +1), so bankAngle is bounded.
      const bankAngle = _dir.current.x * BANK_MAX;
      _bankQ.current.setFromAxisAngle(_bankAxis.current, bankAngle);
      
      // Multiply: apply banking ON TOP of the look-direction quaternion.
      // Quaternion multiplication order: A.multiply(B) = "apply B in A's local space"
      // We want banking in the bird's LOCAL forward space, so this is correct.
      _targetQ.current.multiply(_bankQ.current);
    } else {
      // Bird is near the waypoint — smoothly relax toward neutral (identity quaternion)
      // Identity = no rotation = bird sits level, which also allows mouse look to dominate
      _targetQ.current.set(0, 0, 0, 1); // identity quaternion
    }

    // ─── STEP 5: Mouse look — additive quaternion on top of body orientation ─
    // Mouse look is applied as a SEPARATE quaternion multiplied AFTER the body quaternion.
    // This way it adds a head-look on top of whatever the body is doing.
    // Mouse influence fades during travel (dist > ARRIVE_DIST suppresses it).
    const mouseWeight = THREE.MathUtils.clamp(1.0 - dist / 0.5, 0.0, 1.0);
    if (mouseWeight > 0.01) {
      const mYaw = -mouse.current.x * MOUSE_YAW * mouseWeight;
      const mPitch = mouse.current.y * MOUSE_PITCH * mouseWeight;
      
      _mouseQ.current.setFromAxisAngle(_mouseAxisY.current, mYaw);
      _pitchQ.current.setFromAxisAngle(_mouseAxisX.current, mPitch);
      _mouseQ.current.multiply(_pitchQ.current);
      
      _targetQ.current.multiply(_mouseQ.current);
    }

    // ─── STEP 6: Slerp current quaternion toward target ─────────────────────
    // This is the key smoothing step. Slerp travels the shortest arc on the unit
    // quaternion sphere — meaning it picks the most natural rotation path.
    // alpha = how fast to turn: 0 = never moves, 1 = instant snap
    const slerpAlpha = Math.min(dt * ROT_SLERP, 1.0);
    pivotRef.current.quaternion.slerp(_targetQ.current, slerpAlpha);

    // ─── STEP 7: Apply position + float bob to rootRef ──────────────────────
    // Float bob is manual sin wave — NO <Float> component anywhere.
    const floatY = Math.sin(state.clock.elapsedTime * FLOAT_HZ) * FLOAT_AMP;
    rootRef.current.position.set(
      tPos.current.x,
      tPos.current.y + floatY,
      tPos.current.z
    );

    // ─── STEP 8: GLB clip timeScale based on waypoint ───────────────────────
    if (names.length > 0 && actions[names[0]]) {
      const clip = actions[names[0]];
      clip.timeScale += (ts - clip.timeScale) * Math.min(dt * 3.0, 1.0);
    }

    // ─── STEP 9: Accent light pulsing ───────────────────────────────────────
    const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.5);
    const travelGlow = THREE.MathUtils.clamp((dist / 2.0) * 8.0, 0, 7);
    if (pinkLightRef?.current) pinkLightRef.current.intensity = 4 + pulse * 5 + travelGlow;
    if (blueLightRef?.current) blueLightRef.current.intensity = 3 + (1 - pulse) * 5;
  });

  return (
    <>
      <FireEmbers trackRef={rootRef} />
      <group ref={rootRef}>
        {/* position: updated in useFrame */}
        <group ref={pivotRef}>
          {/* rotation: quaternion slerp in useFrame */}
          <group ref={modelRef}>
            {/* scale: set once in useEffect */}
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
