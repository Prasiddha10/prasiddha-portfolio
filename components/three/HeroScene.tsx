"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

// ---------- shared mouse target ----------
type MousePos = { x: number; y: number };

// ───────────────────────────────────────────────────────────────────
//                       HUMAN FIGURE (left)
// ───────────────────────────────────────────────────────────────────
function Boy({
  mouseRef,
  bobRef,
}: {
  mouseRef: MutableRefObject<MousePos>;
  bobRef: MutableRefObject<number>;
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);

  const mats = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({
        color: "#d8b08a",
        roughness: 0.72,
        metalness: 0.02,
      }),
      hoodie: new THREE.MeshStandardMaterial({
        color: "#7e2748",
        roughness: 0.82,
        metalness: 0.03,
      }),
      hoodieDark: new THREE.MeshStandardMaterial({
        color: "#4e1b31",
        roughness: 0.84,
        metalness: 0.03,
      }),
      jeans: new THREE.MeshStandardMaterial({
        color: "#17222f",
        roughness: 0.88,
        metalness: 0.02,
      }),
      shoe: new THREE.MeshStandardMaterial({
        color: "#090b10",
        roughness: 0.7,
        metalness: 0.08,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: "#141414",
        roughness: 0.65,
        metalness: 0.08,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: "#0d0d12",
        roughness: 0.3,
        metalness: 0.12,
      }),
      mouth: new THREE.MeshStandardMaterial({
        color: "#3f2224",
        roughness: 0.7,
      }),
    }),
    []
  );

  useFrame((state, dt) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;

    // handshake bob — synced through bobRef so robot matches
    const bob = Math.sin(t * 2.0) * 0.045;
    bobRef.current = bob;
    root.current.position.y = -0.85 + bob;

    // gentle body sway
    root.current.rotation.z = Math.sin(t * 0.7) * 0.01;

    // breathing
    if (torso.current) {
      const breath = 1 + Math.sin(t * 1.4) * 0.012;
      torso.current.scale.set(breath, 1 + Math.sin(t * 1.4) * 0.006, breath);
    }

    // mouse-driven head turn (subtle, looks toward the robot mostly)
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        0.35 + mx * 0.18, // base lean toward robot + mouse
        3.5,
        dt
      );
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        -my * 0.16,
        3.5,
        dt
      );
    }

    // blink — eyes scale Y down briefly every ~3.5s
    const blinkPhase = (t % 3.5) / 3.5;
    const blink = blinkPhase > 0.95 ? Math.max(0.05, 1 - (blinkPhase - 0.95) * 20) : 1;
    if (leftEye.current) leftEye.current.scale.y = blink;
    if (rightEye.current) rightEye.current.scale.y = blink;
  });

  return (
    <group ref={root} position={[-0.92, -0.95, 0]} rotation={[0, 0.22, 0]} scale={0.96}>
      {/* ─── HEAD ─── */}
      <group ref={head} position={[0, 1.52, 0]}>
        {/* face */}
        <mesh material={mats.skin} castShadow>
          <sphereGeometry args={[0.34, 40, 40]} />
        </mesh>

        {/* hair — top cap */}
        <mesh position={[0, 0.18, -0.02]} material={mats.hair} castShadow>
          <sphereGeometry
            args={[0.365, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.52]}
          />
        </mesh>
        {/* hair — front fringe */}
        <mesh position={[0.08, 0.18, 0.28]} rotation={[0.6, -0.2, 0.22]} material={mats.hair}>
          <boxGeometry args={[0.15, 0.05, 0.12]} />
        </mesh>
        <mesh position={[-0.1, 0.2, 0.27]} rotation={[0.55, 0.15, -0.18]} material={mats.hair}>
          <boxGeometry args={[0.18, 0.045, 0.11]} />
        </mesh>

        {/* eyes */}
        <mesh ref={leftEye} position={[-0.12, 0.0, 0.31]} material={mats.eye}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>
        <mesh ref={rightEye} position={[0.12, 0.0, 0.31]} material={mats.eye}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>
        {/* eye shine highlights */}
        <mesh position={[-0.108, 0.01, 0.34]}>
          <sphereGeometry args={[0.01, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0.132, 0.01, 0.34]}>
          <sphereGeometry args={[0.01, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} />
        </mesh>

        {/* smile */}
        <mesh position={[0, -0.12, 0.31]} rotation={[0, 0, 0]} material={mats.mouth}>
          <torusGeometry args={[0.028, 0.01, 8, 14, Math.PI * 0.9]} />
        </mesh>

        {/* hoodie hood (back of head) */}
        <mesh position={[0, -0.03, -0.16]} material={mats.hoodie} castShadow>
          <sphereGeometry args={[0.37, 24, 24, 0, Math.PI * 2, Math.PI * 0.38, Math.PI * 0.5]} />
        </mesh>
      </group>

      {/* ─── TORSO (hoodie) ─── */}
      <group ref={torso}>
        <mesh position={[0, 0.9, 0]} material={mats.hoodie} castShadow>
          <capsuleGeometry args={[0.3, 0.42, 8, 16]} />
        </mesh>
        {/* hoodie pocket */}
        <mesh position={[0, 0.72, 0.25]} material={mats.hoodieDark}>
          <boxGeometry args={[0.32, 0.15, 0.04]} />
        </mesh>
        {/* drawstrings */}
        <mesh position={[-0.05, 1.08, 0.28]} material={mats.hoodieDark}>
          <cylinderGeometry args={[0.01, 0.01, 0.14, 8]} />
        </mesh>
        <mesh position={[0.05, 1.08, 0.28]} material={mats.hoodieDark}>
          <cylinderGeometry args={[0.01, 0.01, 0.14, 8]} />
        </mesh>
      </group>

      {/* ─── ARMS ─── */}
      {/* left arm — resting at side */}
      <mesh position={[-0.38, 0.87, 0]} rotation={[0, 0, 0.08]} material={mats.hoodie} castShadow>
        <capsuleGeometry args={[0.085, 0.34, 6, 12]} />
      </mesh>
      <mesh position={[-0.44, 0.56, 0]} rotation={[0, 0, 0.08]} material={mats.hoodie} castShadow>
        <capsuleGeometry args={[0.08, 0.28, 6, 12]} />
      </mesh>
      {/* left hand */}
      <mesh position={[-0.48, 0.34, 0.02]} material={mats.skin} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>

      {/* RIGHT ARM — extended forward in handshake */}
      {/* shoulder/upper arm aimed forward-right */}
      <mesh
        position={[0.32, 0.94, 0.05]}
        rotation={[Math.PI / 2.4, 0, -0.25]}
        material={mats.hoodie}
        castShadow
      >
        <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
      </mesh>
      {/* forearm */}
      <mesh
        position={[0.53, 0.9, 0.33]}
        rotation={[Math.PI / 2.2, 0, -0.18]}
        material={mats.hoodie}
        castShadow
      >
        <capsuleGeometry args={[0.075, 0.27, 6, 12]} />
      </mesh>
      {/* RIGHT HAND — at the handshake meeting point */}
      <mesh position={[0.67, 0.88, 0.58]} material={mats.skin} castShadow>
        <sphereGeometry args={[0.085, 20, 20]} />
      </mesh>

      {/* ─── HIPS / PANTS ─── */}
      <mesh position={[0, 0.43, 0]} material={mats.hoodieDark}>
        <boxGeometry args={[0.38, 0.1, 0.28]} />
      </mesh>

      {/* upper legs */}
      <mesh position={[-0.14, 0.1, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.11, 0.38, 6, 12]} />
      </mesh>
      <mesh position={[0.14, 0.1, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.11, 0.38, 6, 12]} />
      </mesh>

      {/* lower legs */}
      <mesh position={[-0.14, -0.3, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.1, 0.32, 6, 12]} />
      </mesh>
      <mesh position={[0.14, -0.3, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.1, 0.32, 6, 12]} />
      </mesh>

      {/* shoes */}
      <mesh position={[-0.14, -0.58, 0.07]} material={mats.shoe} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.26]} />
      </mesh>
      <mesh position={[0.14, -0.58, 0.07]} material={mats.shoe} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.26]} />
      </mesh>
      {/* shoe sole stripes */}
      <mesh position={[-0.14, -0.65, 0.07]} material={mats.hoodie}>
        <boxGeometry args={[0.19, 0.018, 0.27]} />
      </mesh>
      <mesh position={[0.14, -0.65, 0.07]} material={mats.hoodie}>
        <boxGeometry args={[0.19, 0.018, 0.27]} />
      </mesh>
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────
//                       AI ROBOT (right)
// ───────────────────────────────────────────────────────────────────
function Robot({
  mouseRef,
  bobRef,
}: {
  mouseRef: MutableRefObject<MousePos>;
  bobRef: MutableRefObject<number>;
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const visor = useRef<THREE.MeshStandardMaterial>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const antennaTip = useRef<THREE.MeshStandardMaterial>(null);
  const hoverDisc = useRef<THREE.Group>(null);

  const mats = useMemo(
    () => ({
      shell: new THREE.MeshStandardMaterial({
        color: "#d8dde6",
        roughness: 0.34,
        metalness: 0.55,
      }),
      shellDark: new THREE.MeshStandardMaterial({
        color: "#2a3240",
        roughness: 0.4,
        metalness: 0.65,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: "#6aaeff",
        emissive: "#6aaeff",
        emissiveIntensity: 1.15,
        toneMapped: false,
      }),
      warm: new THREE.MeshStandardMaterial({
        color: "#ff8a5b",
        emissive: "#ff8a5b",
        emissiveIntensity: 1.2,
        toneMapped: false,
      }),
    }),
    []
  );

  useFrame((state, dt) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;

    // mirror the boy's handshake bob (slight phase offset so it feels like a real shake)
    const bob = bobRef.current;
    root.current.position.y = -0.6 + bob * 0.95;

    // slow hover sway
    root.current.rotation.z = Math.sin(t * 0.55 + 1.3) * 0.012;

    // mouse-driven head turn toward boy + cursor
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        -0.32 + mx * 0.18,
        3.0,
        dt
      );
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        -my * 0.18,
        3.0,
        dt
      );
    }

    // visor pulse
    if (visor.current) {
      visor.current.emissiveIntensity = 0.85 + Math.sin(t * 2.8) * 0.22;
    }
    // chest core pulse (offset phase)
    if (core.current) {
      core.current.emissiveIntensity = 1.1 + Math.sin(t * 2.0 + 1.0) * 0.32;
    }
    // antenna tip blink
    if (antennaTip.current) {
      antennaTip.current.emissiveIntensity = 0.95 + (Math.sin(t * 5) * 0.5 + 0.5) * 0.65;
    }

    // hover disc rotation
    if (hoverDisc.current) {
      hoverDisc.current.rotation.y = t * 1.4;
    }
  });

  return (
    <group ref={root} position={[0.85, -0.6, 0]} rotation={[0, -0.32, 0]} scale={1.0}>
      {/* ─── HEAD ─── */}
      <group ref={head} position={[0, 1.32, 0]}>
        {/* helmet */}
        <mesh material={mats.shell} castShadow>
          <sphereGeometry args={[0.32, 40, 40]} />
        </mesh>
        {/* helmet seam */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.shellDark}>
          <torusGeometry args={[0.315, 0.01, 8, 32]} />
        </mesh>
        {/* visor */}
        <mesh position={[0, 0.02, 0.21]}>
          <boxGeometry args={[0.44, 0.14, 0.055]} />
          <meshStandardMaterial
            ref={visor}
            color="#000"
            emissive="#5aa9ff"
            emissiveIntensity={0.9}
            metalness={1}
            roughness={0.05}
          />
        </mesh>
        {/* visor inner glow lines */}
        <mesh position={[-0.12, 0.02, 0.245]}>
          <boxGeometry args={[0.06, 0.025, 0.005]} />
          <meshStandardMaterial color="#fff" emissive="#bfe0ff" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
        <mesh position={[0.12, 0.02, 0.245]}>
          <boxGeometry args={[0.06, 0.025, 0.005]} />
          <meshStandardMaterial color="#fff" emissive="#bfe0ff" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>

        {/* ear discs */}
        <mesh position={[-0.32, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.shellDark}>
          <cylinderGeometry args={[0.07, 0.07, 0.045, 16]} />
        </mesh>
        <mesh position={[0.32, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.shellDark}>
          <cylinderGeometry args={[0.07, 0.07, 0.045, 16]} />
        </mesh>
        <mesh position={[-0.34, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
          <cylinderGeometry args={[0.024, 0.024, 0.04, 14]} />
        </mesh>
        <mesh position={[0.34, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
          <cylinderGeometry args={[0.024, 0.024, 0.04, 14]} />
        </mesh>

        {/* antenna */}
        <mesh position={[0, 0.35, 0]} material={mats.shellDark}>
          <cylinderGeometry args={[0.012, 0.013, 0.13, 12]} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <sphereGeometry args={[0.036, 16, 16]} />
          <meshStandardMaterial
            ref={antennaTip}
            color="#ff6a3d"
            emissive="#ff6a3d"
            emissiveIntensity={1.1}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ─── NECK ─── */}
      <mesh position={[0, 1.0, 0]} material={mats.shellDark}>
        <cylinderGeometry args={[0.076, 0.092, 0.11, 16]} />
      </mesh>

      {/* ─── TORSO ─── */}
      <mesh position={[0, 0.65, 0]} material={mats.shell} castShadow>
        <capsuleGeometry args={[0.27, 0.34, 8, 16]} />
      </mesh>
      {/* chest plate */}
      <mesh position={[0, 0.75, 0.15]} material={mats.shellDark} castShadow>
        <boxGeometry args={[0.42, 0.32, 0.14]} />
      </mesh>
      {/* CHEST CORE — glowing orb */}
      <mesh position={[0, 0.75, 0.24]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial
          ref={core}
          color="#ff6a3d"
          emissive="#ff6a3d"
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>
      {/* core ring */}
      <mesh position={[0, 0.75, 0.245]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.095, 0.01, 10, 24]} />
        <meshStandardMaterial color="#6aaeff" emissive="#6aaeff" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {/* chest accent strips */}
      <mesh position={[0, 0.92, 0.235]} material={mats.accent}>
        <boxGeometry args={[0.18, 0.018, 0.005]} />
      </mesh>

      {/* ─── SHOULDERS ─── */}
      <mesh position={[-0.34, 0.84, 0]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
      </mesh>
      <mesh position={[0.34, 0.84, 0]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
      </mesh>

      {/* RIGHT ARM (robot's right = screen-left) — extended for handshake */}
      {/* upper arm pointing toward the boy */}
      <mesh
        position={[-0.32, 0.77, 0.05]}
        rotation={[Math.PI / 2.4, 0, 0.28]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
      </mesh>
      {/* elbow joint */}
      <mesh position={[-0.47, 0.73, 0.28]} material={mats.shellDark}>
        <sphereGeometry args={[0.075, 16, 16]} />
      </mesh>
      {/* forearm */}
      <mesh
        position={[-0.57, 0.73, 0.47]}
        rotation={[Math.PI / 2.2, 0, 0.18]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.075, 0.27, 6, 12]} />
      </mesh>
      {/* elbow neon ring */}
      <mesh position={[-0.47, 0.73, 0.28]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
        <torusGeometry args={[0.08, 0.01, 8, 24]} />
      </mesh>
      {/* ROBOT HAND — meeting the boy's hand */}
      <mesh position={[-0.7, 0.71, 0.7]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.09, 20, 20]} />
      </mesh>
      {/* wrist accent */}
      <mesh position={[-0.64, 0.73, 0.62]} rotation={[0, 0, Math.PI / 2]} material={mats.warm}>
        <torusGeometry args={[0.075, 0.009, 8, 20]} />
      </mesh>

      {/* LEFT ARM (free side) — resting */}
      <mesh
        position={[0.38, 0.71, 0]}
        rotation={[0, 0, -0.08]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
      </mesh>
      <mesh position={[0.44, 0.49, 0]} material={mats.shellDark}>
        <sphereGeometry args={[0.065, 16, 16]} />
      </mesh>
      <mesh
        position={[0.46, 0.33, 0]}
        rotation={[0, 0, -0.04]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.075, 0.25, 6, 12]} />
      </mesh>
      <mesh position={[0.48, 0.15, 0]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.085, 18, 18]} />
      </mesh>

      {/* ─── HIPS / SKIRT ─── */}
      <mesh position={[0, 0.33, 0]} material={mats.shellDark}>
        <cylinderGeometry args={[0.26, 0.32, 0.16, 24]} />
      </mesh>
      <mesh position={[0, 0.33, 0.16]} material={mats.accent}>
        <boxGeometry args={[0.2, 0.018, 0.006]} />
      </mesh>

      {/* ─── HOVER BASE (no legs) ─── */}
      <group ref={hoverDisc} position={[0, 0.0, 0]}>
        {/* base disc */}
        <mesh material={mats.shell} castShadow>
          <cylinderGeometry args={[0.4, 0.48, 0.09, 32]} />
        </mesh>
        {/* under-glow ring */}
        <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.43, 0.012, 12, 48]} />
          <meshStandardMaterial color="#6aaeff" emissive="#6aaeff" emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
        {/* thruster orbs (3 around the disc) */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.36, -0.05, Math.sin(a) * 0.36]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshStandardMaterial
              color="#ff6a3d"
              emissive="#ff6a3d"
              emissiveIntensity={1.0}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* under-disc plume (soft glow) */}
      <pointLight position={[0, -0.2, 0]} color="#6aaeff" intensity={0.9} distance={1.5} />
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────
//                  HANDSHAKE ENERGY (sparkles at hands)
// ───────────────────────────────────────────────────────────────────
function HandshakeFX({ bobRef }: { bobRef: MutableRefObject<number> }) {
  const ring = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!ring.current) return;
    const t = state.clock.elapsedTime;
    ring.current.rotation.z = t * 0.8;
    const s = 1 + Math.sin(t * 3) * 0.08;
    ring.current.scale.setScalar(s);
    ring.current.position.y = 0.05 + bobRef.current;
    // glow pulse
    if (glow.current) {
      const gp = 0.86 + Math.abs(Math.sin(t * 3.8)) * 0.9;
      glow.current.scale.set(gp, gp * 0.6, gp);
      const mat = glow.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.1 + Math.abs(Math.sin(t * 3.2)) * 0.24;
      glow.current.position.y = 0.05 + bobRef.current;
    }
    // dynamic handshake light
    if (lightRef.current) {
      lightRef.current.intensity = 0.9 + Math.abs(Math.sin(t * 5.2)) * 0.9;
      lightRef.current.position.y = 0.05 + bobRef.current;
    }
  });
  return (
    <group position={[0, 0.05, 0.68]}>
      {/* additive soft glow under the ring to simulate bloom */}
      <mesh ref={glow}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color="#dff1ff" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh ref={ring}>
        <torusGeometry args={[0.15, 0.007, 10, 32]} />
        <meshStandardMaterial
          color="#9cc9ff"
          emissive="#9cc9ff"
          emissiveIntensity={1.1}
          toneMapped={false}
          transparent
          opacity={0.8}
        />
      </mesh>

      <Sparkles count={20} scale={[0.7, 0.55, 0.45]} size={1.8} speed={0.35} color="#e4eef7" opacity={0.4} />
      <Sparkles count={10} scale={[0.55, 0.45, 0.4]} size={2.4} speed={0.16} color="#9cc9ff" opacity={0.22} />

      {/* small dynamic point light to brighten nearby materials */}
      <pointLight ref={lightRef} position={[0, 0.05, 0.68]} color="#9cc9ff" intensity={0.9} distance={1.5} />
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────
//                 CAMERA RIG (mouse parallax)
// ───────────────────────────────────────────────────────────────────
function CameraRig({ mouseRef }: { mouseRef: MutableRefObject<MousePos> }) {
  const { camera } = useThree();
  useFrame((_state, dt) => {
    const tx = mouseRef.current.x * 0.45;
    const ty = mouseRef.current.y * 0.22 + 0.25;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2.2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2.2, dt);
    camera.lookAt(0, 0.2, 0.3);
  });
  return null;
}

// ───────────────────────────────────────────────────────────────────
//                              SCENE
// ───────────────────────────────────────────────────────────────────
export default function HeroScene() {
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 });
  const bobRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.25, 4.6], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
    >
      <color attach="background" args={["#030406"]} />
      <fog attach="fog" args={["#030406", 6, 15]} />

      <ambientLight intensity={0.16} />
      {/* warm key from upper-right */}
      <spotLight
        position={[3.2, 5, 4]}
        angle={0.55}
        penumbra={1}
        intensity={2.2}
        color="#ffb27c"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* cool rim from back-left */}
      <spotLight position={[-4, 3.5, -3]} angle={0.75} penumbra={1} intensity={2.4} color="#6aaeff" />
      {/* soft front fill */}
      <pointLight position={[0, 0.5, 3]} color="#dbe7f5" intensity={0.8} distance={10} />
      {/* warm under glow */}
      <pointLight position={[0, -2.2, 2]} color="#ff8a5b" intensity={0.9} distance={6} />

      <Suspense fallback={null}>
        <CameraRig mouseRef={mouseRef} />

        <Boy mouseRef={mouseRef} bobRef={bobRef} />
        <Robot mouseRef={mouseRef} bobRef={bobRef} />
        <HandshakeFX bobRef={bobRef} />

        <ContactShadows
          position={[0, -1.62, 0]}
          opacity={0.42}
          scale={6}
          blur={2.2}
          far={3.2}
          color="#000000"
        />

        <Sparkles count={30} scale={[8, 6, 4]} size={1.5} speed={0.14} color="#8fb7d6" opacity={0.22} />
        <Stars radius={50} depth={40} count={900} factor={1.4} fade saturation={0} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
