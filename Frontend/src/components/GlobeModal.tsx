"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

type Marker = { name: string; lat: number; lng: number };

function latLngToVector3(lat: number, lng: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Globe({ markers }: { markers: Marker[] }) {
  const texture = useMemo(() => {
    // Simple grayscale texture placeholder using data URL; replace with a proper B/W earth map if desired.
    // For now, we'll use a basic color and lines to keep it lightweight.
    return null as any;
  }, []);

  return (
    <group>
      {/* Sphere for globe body in grayscale */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#101010" roughness={1} metalness={0} />
      </mesh>

      {/* Subtle starfield backdrop */}
      <Stars
        radius={50}
        depth={20}
        count={1500}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Markers */}
      {markers.map((m) => {
        const pos = latLngToVector3(m.lat, m.lng, 1.02);
        return (
          <mesh key={m.name} position={pos}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        );
      })}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={0.8} />
    </group>
  );
}

export default function GlobeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const markers: Marker[] = [
    { name: "Mumbai", lat: 19.076, lng: 72.8777 },
    { name: "Delhi", lat: 28.6139, lng: 77.209 },
    { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
  ];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-black text-white w-[92vw] max-w-3xl aspect-[16/11] rounded-lg shadow-xl border border-white/10 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 h-9 w-9 text-lg rounded-full bg-white/10 hover:bg-white/20"
          aria-label="Close"
        >
          ×
        </button>

        {/* Canvas */}
        {mounted && (
          <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
            <color attach="background" args={[0, 0, 0]} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.8}
            />
            <Globe markers={markers} />
          </Canvas>
        )}

        {/* Legend */}
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs tracking-wider uppercase opacity-80">
          Mumbai • Delhi • Varanasi
        </div>
      </div>
    </div>
  );
}
