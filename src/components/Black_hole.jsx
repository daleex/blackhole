import React, { Suspense, useRef, useEffect,  useState  } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../styles/Black_Hole.module.css';
import LightRays from './LightRays';
import ZoomText from './ZoomText';
import GlowHalo from './GlowHalo';


function Scene() {
  const diskRef = useRef();

  useFrame((state, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <hemisphereLight skyColor="#87CEEB" groundColor="#444444" intensity={0.5} />
      <pointLight position={[10, 15, 10]} intensity={0.8} color="#ffffff" castShadow />

      {/* Glow halo behind black hole */}
      <GlowHalo innerRadius={1.4} outerRadius={1.6} color="#ffffff" />

      <mesh position={[0, 0, 0]} renderOrder={10}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="black" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      <LightRays />
      <Stars radius={0} depth={300} count={10000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}


function ControlledOrbitControls({ distance, onDistanceChange }) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  const zoomSpeed = distance > 300 
    ? 0.06
    : distance > 100  
      ? 0.18
      : 0.4;

  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();
    controlsRef.current?.target.set(0, 0, 0);
    controlsRef.current?.update();
  }, [distance]);

  // Touch swipe to zoom
  useEffect(() => {
    let startY = null;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY === null || e.touches.length !== 1) return;

      const deltaY = e.touches[0].clientY - startY;
      const zoomChange = deltaY * 0.5; // adjust this sensitivity
      const newDistance = Math.min(Math.max(distance + zoomChange, 5), 1000);

      onDistanceChange(newDistance);
      startY = e.touches[0].clientY;
    };

    const canvas = gl.domElement;
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [distance, onDistanceChange, gl.domElement]);

  return (
    <OrbitControls
      ref={controlsRef}
      zoomSpeed={zoomSpeed}
      enableRotate={!(window.innerWidth < 768)} // disable orbiting on mobile
      enablePan={false}
      enableZoom={false} // We'll handle zoom manually
    />
  );
}



function Black_hole() {
  const [distance, setDistance] = useState(700);

  return (
    <div className={styles.canvasContainer}>
      <Canvas shadows camera={{ position: [0, 0, 600], fov: 50, near: 0.01}}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <ControlledOrbitControls distance={distance} onDistanceChange={setDistance} />
      </Canvas>
      <ZoomText distance={distance} setDistance={setDistance} />
    </div>
  );
}

export default Black_hole;