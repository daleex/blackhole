import React, { Suspense, useRef, useEffect,  useState  } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../styles/Black_Hole.module.css';
import LightRays from './LightRays';
import ZoomText from './ZoomText'; // aggiungi questo in alto


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

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="black" side={THREE.DoubleSide}/>
      </mesh>

      <LightRays />
      <Stars radius={0} depth={300} count={10000} factor={4} saturation={0} fade speed={1} />

    </>
  );
}

function ControlledOrbitControls({ distance, onDistanceChange }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Dynamically set zoomSpeed: slower when far, faster when close
  // You can tweak these values to your liking
  const zoomSpeed = distance > 300 
    ? 0.06            // slow zoom far away
    : distance > 100  
      ? 0.18          // medium speed mid range
      : 0.4;         // fast zoom when very close

  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [distance, camera]);

  useEffect(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;

    const onChange = () => {
      const newDistance = camera.position.distanceTo(controls.target);
      onDistanceChange(newDistance);
    };

    controls.addEventListener('change', onChange);

    return () => {
      controls.removeEventListener('change', onChange);
    };
  }, [camera, onDistanceChange]);

  return (
    <OrbitControls
      ref={controlsRef}
      zoomSpeed={zoomSpeed}
      minDistance={
        distance > 10 && distance <= 20
          ? distance
          : 1
      }
      maxDistance={
        distance > 10 && distance <= 20
          ? distance
          : (distance <= 7 || distance >= 600 ? distance : 1000)
      }
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