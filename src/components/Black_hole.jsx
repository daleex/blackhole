import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../styles/Black_Hole.module.css';
import LightRays from './LightRays';
import ZoomText from './ZoomText';
import GlowHalo from './GlowHalo';

function Scene({ distance }) {
  const diskRef = useRef();
  console.log('Current distance:', distance);

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
      <GlowHalo innerRadius={1.4} outerRadius={1.6} color="#ffffff" />

      <mesh position={[0, 0, 0]} renderOrder={10}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="black" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Render LightRays only if distance <= threshold, e.g. 200 */}
      <LightRays active={distance <= 20} />

      <Stars radius={0} depth={300} count={10000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}


function ControlledOrbitControls({ distance, onDistanceChange, ctaActive }) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const [isMobile, setIsMobile] = useState(false);
  const targetDistanceRef = useRef(distance);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    targetDistanceRef.current = distance;
  }, [distance, camera]);

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

  useEffect(() => {
    if (!isMobile) return;

    let startY = null;
    const canvas = gl.domElement;

    const onTouchStart = (e) => {
      if (ctaActive) return;
      if (e.touches.length === 1) startY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (ctaActive) return;
      if (startY === null || e.touches.length !== 1) return;

      const deltaY = e.touches[0].clientY - startY;
      const scaleFactor =
        targetDistanceRef.current > 20
          ? 0.4
          : targetDistanceRef.current > 10
          ? 0.1
          : targetDistanceRef.current > 3
          ? 0.05
          : 0.02; // ultra slow zoom very close to zero

      let zoomDelta = deltaY * scaleFactor;


      // Prevent zooming out once CTA is triggered
      const closeThreshold = 19;
      if (targetDistanceRef.current <= closeThreshold && zoomDelta > 0) {
        zoomDelta = 0;
      }

      targetDistanceRef.current = THREE.MathUtils.clamp(
        targetDistanceRef.current + zoomDelta,
        0,
        1000
      );

      startY = e.touches[0].clientY;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });

    let frameId;
    const animate = () => {
      const currentDist = camera.position.length();
      const targetDist = targetDistanceRef.current;
      const lerpFactor = 0.1;

      if (Math.abs(currentDist - targetDist) > 0.01) {
        const newDist = THREE.MathUtils.lerp(currentDist, targetDist, lerpFactor);
        camera.position.set(0, 0, newDist);
        camera.updateProjectionMatrix();
        if (controlsRef.current) controlsRef.current.update();
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
  }, [isMobile, camera, gl.domElement, onDistanceChange, ctaActive]);

  const zoomSpeed =
    distance > 600 ? 0.015 :
    distance > 500 ? 0.01 :
    distance > 400 ? 0.02 :
    distance > 300 ? 0.025 :
    distance > 200 ? 0.035 :
    distance > 100 ? 0.2 :
    distance > 50  ? 0.075 :
    0.1;


    const isLockedZoom = ctaActive;

    const maxAllowedDistance = distance < 20 ? distance : 1000;


    return (
    <OrbitControls
      ref={controlsRef}
      zoomSpeed={zoomSpeed}
      enableRotate={!isMobile}
      enablePan={false}
      enableZoom={!isMobile}
      minDistance={isLockedZoom ? distance : 1}
      maxDistance={isLockedZoom ? distance : maxAllowedDistance}
      touches={{
        ONE: isMobile ? THREE.TOUCH.NONE : THREE.TOUCH.ROTATE,
        TWO: isMobile ? THREE.TOUCH.NONE : THREE.TOUCH.DOLLY,
      }}
    />
    );


}

function Black_hole() {
  const [distance, setDistance] = useState(1000);
  const [ctaActive, setCtaActive] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    let frameId;

    function animate(t) {
      const threshold = 180;
      const el = containerRef.current;
      if (!el) return;

      if (distance > threshold) {
        // No shake if too far
        el.style.transform = '';
      } else {
        // Intensity: from 0 (far) to 1 (close)
        const intensity = 1 - Math.min(Math.max((distance - 1) / (threshold - 1), 0), 1);
        const maxShake = 0.7; // pixels
        const shakeStrength = intensity * maxShake;

        // Oscillate using sin and cos for smooth wiggle
        const offsetX = Math.sin(t / 50) * shakeStrength;
        const offsetY = Math.cos(t / 60) * shakeStrength;

        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [distance]);

  return (
    <div ref={containerRef} className={styles.canvasContainer}>
      <Canvas shadows camera={{ position: [0, 0, 1000], fov: 50, near: 0.01 }}>
        <Suspense fallback={null}>
          <Scene distance={distance} />
        </Suspense>
        <ControlledOrbitControls
          distance={distance}
          onDistanceChange={setDistance}
          ctaActive={ctaActive}
        />
        {/* Remove CameraShake here */}
      </Canvas>
      <ZoomText
        distance={distance}
        setDistance={setDistance}
        setCtaActive={setCtaActive}
      />
    </div>
  );
}

export default Black_hole;
