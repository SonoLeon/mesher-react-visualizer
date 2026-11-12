// src/components/RegionViewer/Parallelepipedo.tsx
import React from 'react'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

interface ParallelepipedoProps {
  center: [number, number, number]
  size: [number, number, number]
  color: string
}

export function Parallelepipedo({ center, size, color }: ParallelepipedoProps) {
  const [w, h, d] = size
  return (
    <mesh position={center as THREE.Vector3Tuple}>
  <boxGeometry args={[w, h, d]} />
  <meshStandardMaterial
  color={color}
  side={THREE.DoubleSide}
  roughness={0.5}  // da 0.0 (specchio) a 1.0 (superficie molto opaca)
  metalness={0.5} // da 0.0 (non metallico) a 1.0 (completamente metallico)
/>

  <Edges color="#000000" threshold={1} />
</mesh>

  )
}
