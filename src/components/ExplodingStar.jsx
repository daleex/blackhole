// components/ExplodingStar.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ExplodingStarMesh = ({ onExplode }) => {
  const ref = useRef();
  const [scale, setScale] = useState(1);
  const [exploded, setExploded] = useState(false);

  useFrame((state, delta) => {
    if (!exploded) {
      const newScale = scale + delta * 2;
      setScale(newScale);

      if (newScale >= 10) {
        setExploded(true);
        onExplode();
      }
    }

    if (ref.current) {
      ref.current.scale.set(scale, scale, scale);
      ref.current.material.opacity = Math.max(0, 1 - scale / 10);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="orange" transparent />
    </mesh>
  );
};

const ExplodingStar = ({ onFinish }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} />
      <ExplodingStarMesh onExplode={onFinish} />
      <Stars radius={100} depth={50} count={2000} factor={2} />
    </Canvas>
  );
};

export default ExplodingStar;
