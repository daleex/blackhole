import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function GlowHalo({ innerRadius = 1.4, outerRadius = 1.6, color = '#ffffff' }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * 4) * 0.5 + 0.5; // normalize to [0, 1]
    const scale = 1 + pulse * 0.05; // subtle pulsing scale
    const opacity = 0.5 + pulse * 0.5; // range from 0.2 to 0.5

    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={5}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        side={THREE.DoubleSide}
        toneMapped={false}
        transparent={true}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default GlowHalo;
