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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Smooth zoom target state for mobile
  const targetDistanceRef = useRef(distance);

  // Sync camera position with distance (desktop and initial load)
  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    targetDistanceRef.current = distance;
  }, [distance, camera]);

  // Desktop behavior: update distance on orbit changes
  useEffect(() => {
    if (!controlsRef.current || isMobile) return;

    const controls = controlsRef.current;

    const onChange = () => {
      const newDistance = camera.position.distanceTo(controls.target);
      onDistanceChange(newDistance);
    };

    controls.addEventListener('change', onChange);
    return () => controls.removeEventListener('change', onChange);
  }, [camera, onDistanceChange, isMobile]);

  // Mobile swipe zoom with easing animation
  useEffect(() => {
    if (!isMobile) return;

    let startY = null;
    const canvas = gl.domElement;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) startY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (startY === null || e.touches.length !== 1) return;

      const deltaY = e.touches[0].clientY - startY;
      const zoomDelta = deltaY * 0.8; // increase sensitivity for smoother zoom

      // Update target distance (clamp)
      targetDistanceRef.current = THREE.MathUtils.clamp(
        targetDistanceRef.current + zoomDelta,
        5,
        1000
      );

      startY = e.touches[0].clientY;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    // Animate camera zoom smoothly towards targetDistanceRef.current
    let frameId;
    const animate = () => {
      // Smoothly interpolate distance towards target
      const currentDist = camera.position.length();
      const targetDist = targetDistanceRef.current;
      const lerpFactor = 0.1; // tweak for smoothness, smaller = slower

      if (Math.abs(currentDist - targetDist) > 0.01) {
        const newDist = THREE.MathUtils.lerp(currentDist, targetDist, lerpFactor);
        camera.position.set(0, 0, newDist);
        camera.updateProjectionMatrix();

        if (controlsRef.current) {
          controlsRef.current.update();
        }
        onDistanceChange(newDist);
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(frameId);
    };
  }, [isMobile, camera, gl.domElement, onDistanceChange]);

  // Custom zoom speed based on distance (for desktop)
  const zoomSpeed =
    distance > 300 ? 0.06 :
    distance > 100 ? 0.18 : 0.4;

  return (
    <OrbitControls
      ref={controlsRef}
      zoomSpeed={zoomSpeed}
      enableRotate={!isMobile}
      enablePan={false}
      enableZoom={!isMobile} // disable pinch zoom if you want
      minDistance={
        distance > 20 && distance <= 30 ? distance : 1
      }
      maxDistance={
        distance > 20 && distance <= 30
          ? distance
          : (distance <= 19 || distance >= 700 ? distance : 1000)
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