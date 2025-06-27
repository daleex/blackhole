import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 1000;
const DEATH_RADIUS = 2;
const SPAWN_RADIUS_MIN = 30;
const SPAWN_RADIUS_MAX = 60;

function getRandomPosition() {
  const angle = Math.random() * Math.PI * 2;
  const radius = THREE.MathUtils.randFloat(SPAWN_RADIUS_MIN, SPAWN_RADIUS_MAX);
  const height = THREE.MathUtils.randFloatSpread(30);
  const x = Math.cos(angle) * radius;
  const y = height;
  const z = Math.sin(angle) * radius;
  return new THREE.Vector3(x, y, z);
}

function LightRays({ active }) {
  const meshRef = useRef();
  const positions = useMemo(() => Array.from({ length: STAR_COUNT }, getRandomPosition), []);
  const velocities = useRef([]);
  const speeds = useRef([]);

  useEffect(() => {
    velocities.current = positions.map(() => new THREE.Vector3());
    speeds.current = positions.map(() => THREE.MathUtils.randFloat(0.5, 1.5)); // vary per star
  }, [positions]);

  useFrame((_, delta) => {
    if (!active || !meshRef.current) return;

    const mesh = meshRef.current;
    const temp = new THREE.Object3D();

    for (let i = 0; i < STAR_COUNT; i++) {
      const pos = positions[i];
      const vel = velocities.current[i];
      const speed = speeds.current[i];

      // Pull toward center with individualized speed
      const dir = pos.clone().normalize().multiplyScalar(-1);
      vel.addScaledVector(dir, delta * speed);
      pos.addScaledVector(vel, delta);

      // Optional swirl for subtle spiral
      const swirlAmount = 0.01 * speed;
      const angle = Math.atan2(pos.z, pos.x);
      pos.x += Math.cos(angle + Math.PI / 2) * swirlAmount * delta;
      pos.z += Math.sin(angle + Math.PI / 2) * swirlAmount * delta;

      // If swallowed, respawn
      if (pos.length() < DEATH_RADIUS) {
        positions[i] = getRandomPosition();
        velocities.current[i].set(0, 0, 0);
        speeds.current[i] = THREE.MathUtils.randFloat(0.5, 1.5);
      }

      temp.position.copy(positions[i]);
      temp.scale.setScalar(0.2);
      temp.updateMatrix();
      mesh.setMatrixAt(i, temp.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, STAR_COUNT]}>
      <sphereGeometry args={[0.1, 6, 6]} />
      <meshBasicMaterial color="white" />
    </instancedMesh>
  );
}

export default LightRays;
