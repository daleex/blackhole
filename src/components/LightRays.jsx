import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const count = 10000; // Number of particles
const distance = 60; // How far out particles start

function LightRays() {
  const pointsRef = useRef();

  // Initial positions (randomly distributed on a sphere)
  const initialPositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const phi = THREE.MathUtils.randFloatSpread(2 * Math.PI);
      const r = distance; // Start at a fixed distance

      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(theta);
    }
    return positions;
  }, []);

useFrame((state, delta) => {
  if (pointsRef.current) {
    const positions = pointsRef.current.geometry.attributes.position.array;
    const respawnThreshold = 2.5; // bigger than blackHoleRadius
    const pullStrength = 5; // slower pull speed for smooth flow
    const minRespawnRadius = distance;       // e.g. 60
    const maxRespawnRadius = distance * 1.5; // e.g. 90

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = positions[idx];
      const y = positions[idx + 1];
      const z = positions[idx + 2];

      const dist = Math.sqrt(x * x + y * y + z * z);

      if (dist < respawnThreshold) {
        // Respawn *before* they hit the black hole, so no gaps
        const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
        const phi = THREE.MathUtils.randFloat(0, 2 * Math.PI);
        const r = THREE.MathUtils.randFloat(minRespawnRadius, maxRespawnRadius);

        positions[idx] = r * Math.sin(theta) * Math.cos(phi);
        positions[idx + 1] = r * Math.sin(theta) * Math.sin(phi);
        positions[idx + 2] = r * Math.cos(theta);
      } else {
        // Pull stars toward black hole slowly for smooth flow
        const pullFactor = pullStrength * delta / dist;
        positions[idx] -= x * pullFactor;
        positions[idx + 1] -= y * pullFactor;
        positions[idx + 2] -= z * pullFactor;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  }
});




  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
         attach="material"
         size={0.05}
         color="#00ffff"
         sizeAttenuation={true}
         transparent={true}
         opacity={0.7}
         blending={THREE.AdditiveBlending}
       />
    </points>
  );
}

export default LightRays;
