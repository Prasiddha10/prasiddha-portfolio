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
//                       CUTE CHIBI BOY (left)
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
        color: "#f6c8a5",
        roughness: 0.55,
        metalness: 0.05,
      }),
      hoodie: new THREE.MeshStandardMaterial({
        color: "#ff6a9d",
        roughness: 0.68,
        metalness: 0.04,
      }),
      hoodieDark: new THREE.MeshStandardMaterial({
        color: "#e0497d",
        roughness: 0.7,
        metalness: 0.05,
      }),
      jeans: new THREE.MeshStandardMaterial({
        color: "#23344a",
        roughness: 0.78,
        metalness: 0.03,
      }),
      shoe: new THREE.MeshStandardMaterial({
        color: "#0e0f14",
        roughness: 0.45,
        metalness: 0.18,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: "#1a120c",
        roughness: 0.4,
        metalness: 0.12,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: "#0a0a0e",
        roughness: 0.2,
        metalness: 0.4,
      }),
      mouth: new THREE.MeshStandardMaterial({
        color: "#7a3a3a",
        roughness: 0.6,
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
    root.current.rotation.z = Math.sin(t * 0.7) * 0.015;

    // breathing
    if (torso.current) {
      const breath = 1 + Math.sin(t * 1.4) * 0.018;
      torso.current.scale.set(breath, 1 + Math.sin(t * 1.4) * 0.008, breath);
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
    <group ref={root} position={[-0.78, -0.85, 0]} rotation={[0, 0.3, 0]} scale={1.0}>
      {/* ─── HEAD (big, chibi-style) ─── */}
      <group ref={head} position={[0, 1.55, 0]}>
        {/* face */}
        <mesh material={mats.skin} castShadow>
          <sphereGeometry args={[0.38, 40, 40]} />
        </mesh>

        {/* hair — top cap */}
        <mesh position={[0, 0.16, -0.02]} material={mats.hair} castShadow>
          <sphereGeometry
            args={[0.395, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]}
          />
        </mesh>
        {/* hair — front fringe */}
        <mesh position={[0.08, 0.18, 0.28]} rotation={[0.6, -0.2, 0.3]} material={mats.hair}>
          <boxGeometry args={[0.18, 0.06, 0.14]} />
        </mesh>
        <mesh position={[-0.1, 0.2, 0.27]} rotation={[0.55, 0.15, -0.25]} material={mats.hair}>
          <boxGeometry args={[0.22, 0.05, 0.13]} />
        </mesh>

        {/* eyes */}
        <mesh ref={leftEye} position={[-0.13, 0.0, 0.34]} material={mats.eye}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
        <mesh ref={rightEye} position={[0.13, 0.0, 0.34]} material={mats.eye}>
          <sphereGeometry args={[0.045, 16, 16]} />
        </mesh>
        {/* eye shine highlights */}
        <mesh position={[-0.118, 0.015, 0.378]}>
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.142, 0.015, 0.378]}>
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>

        {/* cheeks blush */}
        <mesh position={[-0.22, -0.08, 0.28]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#ff9bb5" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.22, -0.08, 0.28]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#ff9bb5" transparent opacity={0.55} />
        </mesh>

        {/* smile */}
        <mesh position={[0, -0.13, 0.34]} rotation={[0, 0, 0]} material={mats.mouth}>
          <torusGeometry args={[0.04, 0.012, 8, 14, Math.PI]} />
        </mesh>

        {/* hoodie hood (back of head) */}
        <mesh position={[0, -0.05, -0.18]} material={mats.hoodie} castShadow>
          <sphereGeometry args={[0.42, 24, 24, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.55]} />
        </mesh>
      </group>

      {/* ─── TORSO (hoodie) ─── */}
      <group ref={torso}>
        <mesh position={[0, 0.92, 0]} material={mats.hoodie} castShadow>
          <capsuleGeometry args={[0.34, 0.45, 8, 16]} />
        </mesh>
        {/* hoodie pocket */}
        <mesh position={[0, 0.72, 0.27]} material={mats.hoodieDark}>
          <boxGeometry args={[0.36, 0.18, 0.04]} />
        </mesh>
        {/* drawstrings */}
        <mesh position={[-0.06, 1.12, 0.3]} material={mats.hoodieDark}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        </mesh>
        <mesh position={[0.06, 1.12, 0.3]} material={mats.hoodieDark}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        </mesh>
      </group>

      {/* ─── ARMS ─── */}
      {/* left arm — resting at side */}
      <mesh position={[-0.4, 0.88, 0]} rotation={[0, 0, 0.12]} material={mats.hoodie} castShadow>
        <capsuleGeometry args={[0.1, 0.36, 6, 12]} />
      </mesh>
      <mesh position={[-0.46, 0.55, 0]} rotation={[0, 0, 0.1]} material={mats.hoodie} castShadow>
        <capsuleGeometry args={[0.092, 0.3, 6, 12]} />
      </mesh>
      {/* left hand */}
      <mesh position={[-0.5, 0.36, 0.02]} material={mats.skin} castShadow>
        <sphereGeometry args={[0.085, 16, 16]} />
      </mesh>

      {/* RIGHT ARM — extended forward in handshake */}
      {/* shoulder/upper arm aimed forward-right */}
      <mesh
        position={[0.34, 0.95, 0.05]}
        rotation={[Math.PI / 2.4, 0, -0.25]}
        material={mats.hoodie}
        castShadow
      >
        <capsuleGeometry args={[0.1, 0.34, 6, 12]} />
      </mesh>
      {/* forearm */}
      <mesh
        position={[0.56, 0.92, 0.36]}
        rotation={[Math.PI / 2.2, 0, -0.18]}
        material={mats.hoodie}
        castShadow
      >
        <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
      </mesh>
      {/* RIGHT HAND — at the handshake meeting point */}
      <mesh position={[0.7, 0.9, 0.62]} material={mats.skin} castShadow>
        <sphereGeometry args={[0.105, 20, 20]} />
      </mesh>

      {/* ─── HIPS / PANTS ─── */}
      <mesh position={[0, 0.45, 0]} material={mats.hoodieDark}>
        <boxGeometry args={[0.42, 0.12, 0.32]} />
      </mesh>

      {/* upper legs */}
      <mesh position={[-0.15, 0.12, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.13, 0.42, 6, 12]} />
      </mesh>
      <mesh position={[0.15, 0.12, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.13, 0.42, 6, 12]} />
      </mesh>

      {/* lower legs */}
      <mesh position={[-0.15, -0.32, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.115, 0.36, 6, 12]} />
      </mesh>
      <mesh position={[0.15, -0.32, 0]} material={mats.jeans} castShadow>
        <capsuleGeometry args={[0.115, 0.36, 6, 12]} />
      </mesh>

      {/* shoes */}
      <mesh position={[-0.15, -0.62, 0.07]} material={mats.shoe} castShadow>
        <boxGeometry args={[0.2, 0.12, 0.3]} />
      </mesh>
      <mesh position={[0.15, -0.62, 0.07]} material={mats.shoe} castShadow>
        <boxGeometry args={[0.2, 0.12, 0.3]} />
      </mesh>
      {/* shoe sole stripes */}
      <mesh position={[-0.15, -0.69, 0.07]} material={mats.hoodie}>
        <boxGeometry args={[0.21, 0.022, 0.31]} />
      </mesh>
      <mesh position={[0.15, -0.69, 0.07]} material={mats.hoodie}>
        <boxGeometry args={[0.21, 0.022, 0.31]} />
      </mesh>
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────
//                       FRIENDLY AI ROBOT (right)
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
        color: "#eef1f6",
        roughness: 0.22,
        metalness: 0.7,
      }),
      shellDark: new THREE.MeshStandardMaterial({
        color: "#3a4150",
        roughness: 0.28,
        metalness: 0.85,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: "#5aa9ff",
        emissive: "#5aa9ff",
        emissiveIntensity: 1.6,
        toneMapped: false,
      }),
      warm: new THREE.MeshStandardMaterial({
        color: "#ff6a3d",
        emissive: "#ff6a3d",
        emissiveIntensity: 1.8,
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
    root.current.rotation.z = Math.sin(t * 0.55 + 1.3) * 0.018;

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

    // visor pulse (stronger for more pop)
    if (visor.current) {
      visor.current.emissiveIntensity = 1.2 + Math.sin(t * 2.8) * 0.48;
    }
    // chest core pulse (offset phase)
    if (core.current) {
      core.current.emissiveIntensity = 1.8 + Math.sin(t * 2.0 + 1.0) * 0.6;
    }
    // antenna tip blink
    if (antennaTip.current) {
      antennaTip.current.emissiveIntensity = 1.2 + (Math.sin(t * 5) * 0.5 + 0.5) * 1.6;
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
          <sphereGeometry args={[0.34, 40, 40]} />
        </mesh>
        {/* helmet seam */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.shellDark}>
          <torusGeometry args={[0.335, 0.012, 8, 32]} />
        </mesh>
        {/* visor */}
        <mesh position={[0, 0.02, 0.21]}>
          <boxGeometry args={[0.46, 0.16, 0.06]} />
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
        <mesh position={[-0.34, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.shellDark}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 16]} />
        </mesh>
        <mesh position={[0.34, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.shellDark}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 16]} />
        </mesh>
        <mesh position={[-0.36, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
          <cylinderGeometry args={[0.028, 0.028, 0.045, 14]} />
        </mesh>
        <mesh position={[0.36, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
          <cylinderGeometry args={[0.028, 0.028, 0.045, 14]} />
        </mesh>

        {/* antenna */}
        <mesh position={[0, 0.36, 0]} material={mats.shellDark}>
          <cylinderGeometry args={[0.012, 0.014, 0.14, 12]} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            ref={antennaTip}
            color="#ff6a3d"
            emissive="#ff6a3d"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ─── NECK ─── */}
      <mesh position={[0, 1.0, 0]} material={mats.shellDark}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 16]} />
      </mesh>

      {/* ─── TORSO ─── */}
      <mesh position={[0, 0.66, 0]} material={mats.shell} castShadow>
        <capsuleGeometry args={[0.3, 0.36, 8, 16]} />
      </mesh>
      {/* chest plate */}
      <mesh position={[0, 0.76, 0.16]} material={mats.shellDark} castShadow>
        <boxGeometry args={[0.46, 0.36, 0.16]} />
      </mesh>
      {/* CHEST CORE — glowing orb */}
      <mesh position={[0, 0.76, 0.26]}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial
          ref={core}
          color="#ff6a3d"
          emissive="#ff6a3d"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {/* core ring */}
      <mesh position={[0, 0.76, 0.265]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.105, 0.012, 10, 24]} />
        <meshStandardMaterial color="#5aa9ff" emissive="#5aa9ff" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* chest accent strips */}
      <mesh position={[0, 0.94, 0.245]} material={mats.accent}>
        <boxGeometry args={[0.22, 0.02, 0.005]} />
      </mesh>

      {/* ─── SHOULDERS ─── */}
      <mesh position={[-0.36, 0.86, 0]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.14, 24, 24]} />
      </mesh>
      <mesh position={[0.36, 0.86, 0]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.14, 24, 24]} />
      </mesh>

      {/* RIGHT ARM (robot's right = screen-left) — extended for handshake */}
      {/* upper arm pointing toward the boy */}
      <mesh
        position={[-0.34, 0.78, 0.06]}
        rotation={[Math.PI / 2.4, 0, 0.28]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.1, 0.34, 6, 12]} />
      </mesh>
      {/* elbow joint */}
      <mesh position={[-0.5, 0.74, 0.3]} material={mats.shellDark}>
        <sphereGeometry args={[0.085, 16, 16]} />
      </mesh>
      {/* forearm */}
      <mesh
        position={[-0.6, 0.74, 0.5]}
        rotation={[Math.PI / 2.2, 0, 0.18]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
      </mesh>
      {/* elbow neon ring */}
      <mesh position={[-0.5, 0.74, 0.3]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
        <torusGeometry args={[0.092, 0.012, 8, 24]} />
      </mesh>
      {/* ROBOT HAND — meeting the boy's hand */}
      <mesh position={[-0.74, 0.72, 0.74]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.11, 20, 20]} />
      </mesh>
      {/* wrist accent */}
      <mesh position={[-0.68, 0.74, 0.66]} rotation={[0, 0, Math.PI / 2]} material={mats.warm}>
        <torusGeometry args={[0.085, 0.01, 8, 20]} />
      </mesh>

      {/* LEFT ARM (free side) — resting */}
      <mesh
        position={[0.4, 0.72, 0]}
        rotation={[0, 0, -0.08]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.1, 0.34, 6, 12]} />
      </mesh>
      <mesh position={[0.46, 0.5, 0]} material={mats.shellDark}>
        <sphereGeometry args={[0.075, 16, 16]} />
      </mesh>
      <mesh
        position={[0.48, 0.34, 0]}
        rotation={[0, 0, -0.04]}
        material={mats.shell}
        castShadow
      >
        <capsuleGeometry args={[0.085, 0.28, 6, 12]} />
      </mesh>
      <mesh position={[0.5, 0.16, 0]} material={mats.shell} castShadow>
        <sphereGeometry args={[0.1, 18, 18]} />
      </mesh>

      {/* ─── HIPS / SKIRT ─── */}
      <mesh position={[0, 0.34, 0]} material={mats.shellDark}>
        <cylinderGeometry args={[0.3, 0.36, 0.18, 24]} />
      </mesh>
      <mesh position={[0, 0.34, 0.18]} material={mats.accent}>
        <boxGeometry args={[0.24, 0.022, 0.006]} />
      </mesh>

      {/* ─── HOVER BASE (no legs) ─── */}
      <group ref={hoverDisc} position={[0, 0.0, 0]}>
        {/* base disc */}
        <mesh material={mats.shell} castShadow>
          <cylinderGeometry args={[0.42, 0.5, 0.1, 32]} />
        </mesh>
        {/* under-glow ring */}
        <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.015, 12, 48]} />
          <meshStandardMaterial color="#5aa9ff" emissive="#5aa9ff" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
        {/* thruster orbs (3 around the disc) */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.38, -0.05, Math.sin(a) * 0.38]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial
              color="#ff6a3d"
              emissive="#ff6a3d"
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* under-disc plume (soft glow) */}
      <pointLight position={[0, -0.2, 0]} color="#5aa9ff" intensity={1.2} distance={1.6} />
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
    const s = 1 + Math.sin(t * 3) * 0.15;
    ring.current.scale.setScalar(s);
    ring.current.position.y = 0.05 + bobRef.current;
    // glow pulse
    if (glow.current) {
      const gp = 0.9 + Math.abs(Math.sin(t * 3.8)) * 1.6;
      glow.current.scale.set(gp, gp * 0.6, gp);
      const mat = glow.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.18 + Math.abs(Math.sin(t * 3.2)) * 0.55;
      glow.current.position.y = 0.05 + bobRef.current;
    }
    // dynamic handshake light
    if (lightRef.current) {
      lightRef.current.intensity = 1.4 + Math.abs(Math.sin(t * 5.2)) * 2.2;
      lightRef.current.position.y = 0.05 + bobRef.current;
    }
  });
  return (
    <group position={[0, 0.05, 0.68]}>
      {/* additive soft glow under the ring to simulate bloom */}
      <mesh ref={glow}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color="#ffd8bf" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh ref={ring}>
        <torusGeometry args={[0.16, 0.008, 10, 32]} />
        <meshStandardMaterial
          color="#ff8a5b"
          emissive="#ff8a5b"
          emissiveIntensity={2.4}
          toneMapped={false}
          transparent
          opacity={0.95}
        />
      </mesh>

      <Sparkles count={48} scale={[0.9, 0.8, 0.6]} size={2.8} speed={0.9} color="#ffd8bf" opacity={0.98} />
      <Sparkles count={22} scale={[0.7, 0.6, 0.5]} size={3.6} speed={0.18} color="#8fd1ff" opacity={0.6} />

      {/* small dynamic point light to brighten nearby materials */}
      <pointLight ref={lightRef} position={[0, 0.05, 0.68]} color="#ffb38a" intensity={1.8} distance={1.6} />
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
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 5, 14]} />

      <ambientLight intensity={0.18} />
      {/* warm key from upper-right */}
      <spotLight
        position={[3.2, 5, 4]}
        angle={0.55}
        penumbra={1}
        intensity={3.0}
        color="#ff8a5b"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* cool rim from back-left */}
      <spotLight position={[-4, 3.5, -3]} angle={0.75} penumbra={1} intensity={3.4} color="#5aa9ff" />
      {/* soft front fill */}
      <pointLight position={[0, 0.5, 3]} color="#cfe4ff" intensity={1.0} distance={10} />
      {/* warm under glow */}
      <pointLight position={[0, -2.2, 2]} color="#ff6a3d" intensity={1.4} distance={6} />

      <Suspense fallback={null}>
        <CameraRig mouseRef={mouseRef} />

        <Boy mouseRef={mouseRef} bobRef={bobRef} />
        <Robot mouseRef={mouseRef} bobRef={bobRef} />
        <HandshakeFX bobRef={bobRef} />

        <ContactShadows
          position={[0, -1.62, 0]}
          opacity={0.6}
          scale={6}
          blur={2.6}
          far={3.2}
          color="#000000"
        />

        <Sparkles count={80} scale={[8, 6, 4]} size={2} speed={0.22} color="#7cc0ff" opacity={0.55} />
        <Sparkles count={40} scale={[10, 8, 6]} size={4} speed={0.1} color="#ff8a5b" opacity={0.4} />
        <Stars radius={50} depth={40} count={1500} factor={2} fade saturation={0} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
