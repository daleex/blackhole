import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import '../styles/StarField.css'

const RotatingStars = () => {
  const stars = useRef()
  useFrame(() => {
    stars.current.rotation.x = stars.current.rotation.y += 0.00015
  })
  return (
    <Stars
      ref={stars}
      count={1000}
      radius={40}
      depth={60}
      factor={4}
      fade
    />
  )
}

const StarField = () => {
  return (
    <Canvas>
      <OrbitControls enableZoom={false} />
      <RotatingStars />
      <Stars depth={100} />
    </Canvas>
  )
}

export default StarField
