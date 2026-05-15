"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function HolographicBody({ activeOrgan }: { activeOrgan: string | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      
      // Continuous 24/7 rotation base
      const autoRotateY = time * 0.2; 
      
      // Add cursor/touch interaction on top of auto-rotation
      targetRotation.current.y = autoRotateY + (mouse.x * 0.8); 
      targetRotation.current.x = -mouse.y * 0.4; 
      
      // Smoothly interpolate current rotation to target rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetRotation.current.y, 
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 
        targetRotation.current.x, 
        0.06
      );

      // Gentle floating
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.04 - 0.3;
    }
  });

  // Shared materials
  const skinMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#dce8ff"),
    emissive: new THREE.Color("#3b82f6"),
    emissiveIntensity: 0.06,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.28,
    side: THREE.FrontSide,
  }), []);

  const structureMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#93c5fd"),
    emissive: new THREE.Color("#2563eb"),
    emissiveIntensity: 0.2,
    roughness: 0.4,
    metalness: 0.15,
    transparent: true,
    opacity: 0.75,
  }), []);

  const muscleMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#f87171"),
    emissive: new THREE.Color("#dc2626"),
    emissiveIntensity: 0.25,
    roughness: 0.5,
    transparent: true,
    opacity: 0.82,
  }), []);

  const heartMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(activeOrgan === "heart" ? "#ff2244" : "#e11d48"),
    emissive: new THREE.Color("#be123c"),
    emissiveIntensity: activeOrgan === "heart" ? 0.9 : 0.45,
    roughness: 0.3,
    transparent: true,
    opacity: 0.95,
  }), [activeOrgan]);

  const lungMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(activeOrgan === "lung" ? "#fb923c" : "#ea580c"),
    emissive: new THREE.Color("#c2410c"),
    emissiveIntensity: activeOrgan === "lung" ? 0.6 : 0.2,
    roughness: 0.5,
    transparent: true,
    opacity: 0.88,
  }), [activeOrgan]);

  const brainMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(activeOrgan === "brain" ? "#c084fc" : "#a855f7"),
    emissive: new THREE.Color("#7c3aed"),
    emissiveIntensity: activeOrgan === "brain" ? 0.7 : 0.25,
    roughness: 0.6,
    transparent: true,
    opacity: 0.9,
  }), [activeOrgan]);

  const boneMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#e2e8f0"),
    emissive: new THREE.Color("#94a3b8"),
    emissiveIntensity: 0.1,
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity: 0.72,
  }), []);

  const veinMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#60a5fa"),
    emissive: new THREE.Color("#2563eb"),
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.7,
  }), []);

  // Animated references
  const heartRef = useRef<THREE.Group>(null);
  const lungLRef = useRef<THREE.Mesh>(null);
  const lungRRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Heartbeat
    if (heartRef.current) {
      const beat = 1 + Math.abs(Math.sin(t * 1.25)) * 0.14;
      heartRef.current.scale.setScalar(beat);
    }
    // Breathing lungs
    if (lungLRef.current) {
      const b = 1 + Math.sin(t * 0.45) * 0.07;
      lungLRef.current.scale.set(b, 1 + Math.sin(t * 0.45) * 0.09, b);
    }
    if (lungRRef.current) {
      const b = 1 + Math.sin(t * 0.45) * 0.07;
      lungRRef.current.scale.set(b, 1 + Math.sin(t * 0.45) * 0.09, b);
    }
    // Scan ring
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 0.4) * 0.9;
      (scanRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 1.5) * 0.15;
    }
  });

  const ribPairs = [1.02, 0.94, 0.86, 0.78, 0.70, 0.62];
  const ribR    = [0.155, 0.175, 0.182, 0.180, 0.165, 0.148];

  return (
    <group ref={groupRef}>
      {/* ── SKULL ── */}
      <mesh position={[0, 1.58, 0]} material={boneMat}>
        <sphereGeometry args={[0.196, 28, 22]} />
      </mesh>
      <mesh position={[0, 1.44, 0.06]} rotation={[0.15, 0, 0]} material={boneMat}>
        <boxGeometry args={[0.14, 0.06, 0.1]} />
      </mesh>

      {/* ── BRAIN ── */}
      <mesh position={[-0.055, 1.59, 0]} material={brainMat}>
        <sphereGeometry args={[0.1, 18, 14]} />
      </mesh>
      <mesh position={[0.055, 1.59, 0]} material={brainMat}>
        <sphereGeometry args={[0.1, 18, 14]} />
      </mesh>
      <mesh position={[0, 1.49, -0.07]} material={brainMat}>
        <sphereGeometry args={[0.062, 12, 10]} />
      </mesh>

      {/* ── NECK ── */}
      <mesh position={[0, 1.32, 0]} material={structureMat}>
        <cylinderGeometry args={[0.079, 0.088, 0.2, 18]} />
      </mesh>

      {/* ── SPINE ── */}
      {[1.15, 1.04, 0.93, 0.82, 0.71, 0.60, 0.49, 0.38].map((y, i) => (
        <mesh key={i} position={[0, y, -0.08]} material={boneMat}>
          <sphereGeometry args={[0.022, 8, 6]} />
        </mesh>
      ))}

      {/* ── STERNUM ── */}
      <mesh position={[0, 0.82, 0.1]} material={boneMat}>
        <boxGeometry args={[0.038, 0.42, 0.04]} />
      </mesh>

      {/* ── RIB CAGE ── */}
      {ribPairs.map((y, i) => (
        <group key={i}>
          <mesh position={[-ribR[i] * 0.5, y, 0]} rotation={[0, 0, Math.PI * 0.56 + i * 0.028]} material={boneMat}>
            <torusGeometry args={[ribR[i], 0.011, 8, 22, Math.PI * 0.72]} />
          </mesh>
          <mesh position={[ribR[i] * 0.5, y, 0]} rotation={[0, Math.PI, -(Math.PI * 0.56 + i * 0.028)]} material={boneMat}>
            <torusGeometry args={[ribR[i], 0.011, 8, 22, Math.PI * 0.72]} />
          </mesh>
        </group>
      ))}

      {/* ── TORSO MUSCLE CORE ── */}
      <mesh position={[0, 0.86, 0]} material={structureMat}>
        <cylinderGeometry args={[0.22, 0.18, 0.58, 26]} />
      </mesh>
      <mesh position={[0, 0.46, 0]} material={structureMat}>
        <cylinderGeometry args={[0.18, 0.155, 0.4, 26]} />
      </mesh>
      <mesh position={[0, 0.22, 0]} material={structureMat}>
        <cylinderGeometry args={[0.175, 0.155, 0.22, 26]} />
      </mesh>

      {/* ── PECTORALS ── */}
      <mesh position={[-0.1, 0.98, 0.115]} material={muscleMat}>
        <sphereGeometry args={[0.105, 14, 12]} />
      </mesh>
      <mesh position={[0.1, 0.98, 0.115]} material={muscleMat}>
        <sphereGeometry args={[0.105, 14, 12]} />
      </mesh>

      {/* ── DELTOIDS ── */}
      <mesh position={[-0.27, 1.08, 0.02]} rotation={[0, 0.2, 0.28]} material={muscleMat}>
        <sphereGeometry args={[0.072, 12, 10]} />
      </mesh>
      <mesh position={[0.27, 1.08, 0.02]} rotation={[0, -0.2, -0.28]} material={muscleMat}>
        <sphereGeometry args={[0.072, 12, 10]} />
      </mesh>

      {/* ── ABS ── */}
      {([-0.068, 0.068] as const).map((x) =>
        ([0.78, 0.66, 0.54] as const).map((y, ri) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.13]} material={muscleMat}>
            <sphereGeometry args={[0.046, 10, 8]} />
          </mesh>
        ))
      )}

      {/* ── ARMS ── */}
      {/* Left upper arm */}
      <mesh position={[-0.38, 0.88, 0]} rotation={[0, 0, 0.16]} material={structureMat}>
        <cylinderGeometry args={[0.065, 0.058, 0.44, 18]} />
      </mesh>
      <mesh position={[-0.37, 0.9, 0.05]} rotation={[0, 0, 0.16]} material={muscleMat}>
        <sphereGeometry args={[0.054, 10, 8]} />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-0.45, 0.5, 0]} rotation={[0, 0, 0.28]} material={structureMat}>
        <cylinderGeometry args={[0.048, 0.042, 0.42, 16]} />
      </mesh>
      {/* Right upper arm */}
      <mesh position={[0.38, 0.88, 0]} rotation={[0, 0, -0.16]} material={structureMat}>
        <cylinderGeometry args={[0.065, 0.058, 0.44, 18]} />
      </mesh>
      <mesh position={[0.37, 0.9, 0.05]} rotation={[0, 0, -0.16]} material={muscleMat}>
        <sphereGeometry args={[0.054, 10, 8]} />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.45, 0.5, 0]} rotation={[0, 0, -0.28]} material={structureMat}>
        <cylinderGeometry args={[0.048, 0.042, 0.42, 16]} />
      </mesh>

      {/* ── LEGS ── */}
      <mesh position={[-0.1, -0.2, 0]} rotation={[0, 0, 0.06]} material={structureMat}>
        <cylinderGeometry args={[0.098, 0.088, 0.46, 20]} />
      </mesh>
      <mesh position={[-0.1, -0.14, 0.065]} material={muscleMat}>
        <sphereGeometry args={[0.068, 12, 10]} />
      </mesh>
      <mesh position={[-0.11, -0.65, 0]} material={structureMat}>
        <cylinderGeometry args={[0.07, 0.054, 0.44, 18]} />
      </mesh>
      <mesh position={[0.1, -0.2, 0]} rotation={[0, 0, -0.06]} material={structureMat}>
        <cylinderGeometry args={[0.098, 0.088, 0.46, 20]} />
      </mesh>
      <mesh position={[0.1, -0.14, 0.065]} material={muscleMat}>
        <sphereGeometry args={[0.068, 12, 10]} />
      </mesh>
      <mesh position={[0.11, -0.65, 0]} material={structureMat}>
        <cylinderGeometry args={[0.07, 0.054, 0.44, 18]} />
      </mesh>

      {/* ── LUNGS ── */}
      <mesh ref={lungLRef} position={[-0.1, 0.86, 0.04]} rotation={[0.1, -0.15, 0.08]} material={lungMat}>
        <sphereGeometry args={[0.1, 16, 12]} />
      </mesh>
      <mesh position={[-0.11, 0.72, 0.02]} material={lungMat}>
        <sphereGeometry args={[0.082, 14, 10]} />
      </mesh>
      <mesh ref={lungRRef} position={[0.1, 0.86, 0.04]} rotation={[0.1, 0.15, -0.08]} material={lungMat}>
        <sphereGeometry args={[0.1, 16, 12]} />
      </mesh>
      <mesh position={[0.11, 0.72, 0.02]} material={lungMat}>
        <sphereGeometry args={[0.082, 14, 10]} />
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 1.1, 0.04]} material={veinMat}>
        <cylinderGeometry args={[0.018, 0.02, 0.24, 10]} />
      </mesh>

      {/* ── HEART ── */}
      <group ref={heartRef} position={[-0.038, 0.9, 0.1]}>
        <mesh material={heartMat}>
          <sphereGeometry args={[0.062, 16, 14]} />
        </mesh>
        <mesh position={[0, -0.038, 0.018]} rotation={[0.45, 0, 0.1]} material={heartMat}>
          <coneGeometry args={[0.038, 0.065, 10]} />
        </mesh>
      </group>
      {/* Aorta */}
      <mesh position={[-0.018, 0.97, 0.06]} rotation={[0.18, 0, -0.1]} material={veinMat}>
        <cylinderGeometry args={[0.014, 0.014, 0.12, 8]} />
      </mesh>

      {/* ── LIVER ── */}
      <mesh position={[0.1, 0.62, 0.08]} material={new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#92400e"), roughness: 0.55, transparent: true, opacity: 0.8,
        emissive: new THREE.Color("#78350f"), emissiveIntensity: 0.1,
      })}>
        <sphereGeometry args={[0.096, 14, 10]} />
      </mesh>

      {/* ── SKIN SHELL ── */}
      <mesh position={[0, 0.86, 0]} material={skinMat}>
        <cylinderGeometry args={[0.26, 0.22, 0.6, 28]} />
      </mesh>
      <mesh position={[0, 0.46, 0]} material={skinMat}>
        <cylinderGeometry args={[0.21, 0.18, 0.42, 28]} />
      </mesh>
      <mesh position={[0, 1.58, 0]} material={skinMat}>
        <sphereGeometry args={[0.22, 28, 22]} />
      </mesh>

      {/* ── HOLOGRAPHIC SCAN RING ── */}
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.004, 8, 80]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={0.45} />
      </mesh>

      {/* ── OUTER GLOW RINGS ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <torusGeometry args={[0.55, 0.003, 6, 80]} />
        <meshBasicMaterial color="#5b8def" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.5, 0]}>
        <torusGeometry args={[0.62, 0.002, 6, 80]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

interface HumanBody3DProps {
  activeOrgan?: string | null;
}

export default function HumanBody3D({ activeOrgan = null }: HumanBody3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 3.4], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Soft ambient */}
      <ambientLight intensity={1.8} color="#e0eaff" />
      {/* Key light — warm from front-right */}
      <directionalLight position={[2, 3, 3]} intensity={2.5} color="#dbeafe" />
      {/* Fill — cool from left */}
      <directionalLight position={[-3, 2, 1]} intensity={1.2} color="#bfdbfe" />
      {/* Rim from behind */}
      <directionalLight position={[0, -1, -3]} intensity={0.8} color="#a5f3fc" />
      {/* Organ accent lights */}
      <pointLight position={[-0.04, 0.1, 0.5]} intensity={1.5} color="#f43f5e" />
      <pointLight position={[0, 0.15, 0.5]} intensity={1.0} color="#fb923c" />

      <Suspense fallback={null}>
        <Float speed={1.0} rotationIntensity={0} floatIntensity={0.2}>
          <HolographicBody activeOrgan={activeOrgan} />
        </Float>
        <ContactShadows position={[0, -1.32, 0]} opacity={0.08} scale={2.5} blur={2.5} />
      </Suspense>
    </Canvas>
  );
}
