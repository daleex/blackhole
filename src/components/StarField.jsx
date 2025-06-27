import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import '../styles/StarField.css'

const RotatingStars = ({ rotate }) => {
  const stars = useRef()
  useFrame(() => {
    if (rotate && stars.current) {
      stars.current.rotation.x = stars.current.rotation.y += 0.00015
    }
  })
  return (
    <Stars
      ref={stars}
      count={3000}
      radius={40}
      depth={60}
      factor={4}
      fade
    />
  )
}

const StarField = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <Canvas>
      <OrbitControls enableZoom={false} enableRotate={!isMobile} />
      <RotatingStars rotate={!isMobile} />
      <Stars depth={100} />
    </Canvas>
  )
}

export default StarField
