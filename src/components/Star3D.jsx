import React, { useRef } from 'react'
import * as THREE from 'three'

const Star3D = () => {
  // Funzione per creare la shape della stella 5 punte
  const createStarShape = () => {
    const shape = new THREE.Shape()
    const outerRadius = 1
    const innerRadius = 0.5
    const spikes = 5
    let rot = -Math.PI / 2 // punta dritta verso l’alto
    let x = 0
    let y = 0
    const step = Math.PI / spikes

    shape.moveTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius)
    for (let i = 0; i < spikes; i++) {
      rot += step
      x = Math.cos(rot) * innerRadius
      y = Math.sin(rot) * innerRadius
      shape.lineTo(x, y)
      rot += step
      x = Math.cos(rot) * outerRadius
      y = Math.sin(rot) * outerRadius
      shape.lineTo(x, y)
    }
    shape.closePath()
    return shape
  }

  const shape = createStarShape()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
  })

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#ffd700" emissive="#ffff55" emissiveIntensity={0.7} />
    </mesh>
  )
}

export default Star3D

