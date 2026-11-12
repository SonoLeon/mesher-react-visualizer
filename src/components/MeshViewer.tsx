// src/components/MeshViewer/MeshViewer.tsx
import React from 'react'
import * as THREE from 'three'
import { Superfici } from '../utils/genera_mesh'
import { colorPalette } from "../utils/colorPalette";

interface MeshViewerProps {
  superfici: Superfici
}

/**
 * Riordina i 4 vertici di un quadrilatero
 * in modo che la triangolazione di Three.js non “buchi” la faccia
 */
function reorderPatch(coords: number[]): number[] {
  const v = [
    new THREE.Vector3(coords[0],  coords[1],  coords[2]),
    new THREE.Vector3(coords[3],  coords[4],  coords[5]),
    new THREE.Vector3(coords[6],  coords[7],  coords[8]),
    new THREE.Vector3(coords[9],  coords[10], coords[11]),
  ]

  // 1) Baricentro
  const center = new THREE.Vector3(
    (v[0].x + v[1].x + v[2].x + v[3].x) / 4,
    (v[0].y + v[1].y + v[2].y + v[3].y) / 4,
    (v[0].z + v[1].z + v[2].z + v[3].z) / 4
  )

  // 2) Normale (ipotesi planare)
  const side1 = new THREE.Vector3().subVectors(v[1], v[0])
  const side2 = new THREE.Vector3().subVectors(v[2], v[0])
  const n = new THREE.Vector3().crossVectors(side1, side2).normalize()

  // 3) Asse “u” per definire un sistema 2D nel piano
  const arbitrary = new THREE.Vector3(1, 0, 0)
  if (Math.abs(n.dot(arbitrary)) > 0.9) {
    arbitrary.set(0, 1, 0)
  }
  const u = new THREE.Vector3().crossVectors(n, arbitrary).normalize()
  const v2 = new THREE.Vector3().crossVectors(n, u).normalize()

  // 4) Ordino in base all'angolo polare
  interface CornerAngle {
    vertex: THREE.Vector3
    angle: number
  }
  const corners: CornerAngle[] = v.map((vertex) => {
    const d = vertex.clone().sub(center)
    const du = d.dot(u)
    const dv = d.dot(v2)
    const angle = Math.atan2(dv, du)
    return { vertex, angle }
  })

  corners.sort((a, b) => a.angle - b.angle)

  // 5) Ricompongo i 4 vertici
  const reordered: number[] = []
  corners.forEach(({ vertex }) => {
    reordered.push(vertex.x, vertex.y, vertex.z)
  })
  return reordered
}

/** Visualizza tutte le superfici come quadrilateri 2D + contorno */
export function MeshViewer({ superfici }: MeshViewerProps) {
  const faces = superfici.estremi_celle || []
  
  // Se usi epsr come “categoria”
  const epsrArray = superfici.epsr || []
  
  // 1) Trovo i valori unici di epsr
  const uniqueEpsr = React.useMemo(() => {
    return Array.from(new Set(epsrArray)) // es: [1, 5, 9.7]
  }, [epsrArray])

  // 2) Creo una mappa epsr → colore
  const colorMap = React.useMemo(() => {
    const map = new Map<number, string>()
    uniqueEpsr.forEach((val, idx) => {
      // idx è 0,1,2... 
      const c = colorPalette[idx % colorPalette.length]
      map.set(val, c)
    })
    return map
  }, [uniqueEpsr])

  // Poi mappo ogni patch (faccia)
  return (
    <>
      {faces.map((coordinates, i) => {
        // Prendo l’epsr corrispondente
        const eVal = epsrArray[i]
        // Ottengo il colore
        const color = colorMap.get(eVal) || '#FDF5E6'

        return (
          <QuadFace
            key={i}
            coordinates={coordinates}
            color={color}
          />
        )
      })}
    </>
  )
}


/** Singola faccia quadrilatera: 2 triangoli + outline */
// Singolo quadrilatero
function QuadFace({ coordinates, color }: { coordinates: number[], color: string }) {
  // reorderPatch() come hai già definito
  const sortedCoords = React.useMemo(
    () => reorderPatch(coordinates),
    [coordinates]
  )

  const meshGeometry = React.useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertices = new Float32Array(sortedCoords)
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geo.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1))
    geo.computeVertexNormals()
    return geo
  }, [sortedCoords])

  // Outline
  const lineGeometry = React.useMemo(() => {
    const points = [
      new THREE.Vector3(sortedCoords[0], sortedCoords[1], sortedCoords[2]),
      new THREE.Vector3(sortedCoords[3], sortedCoords[4], sortedCoords[5]),
      new THREE.Vector3(sortedCoords[6], sortedCoords[7], sortedCoords[8]),
      new THREE.Vector3(sortedCoords[9], sortedCoords[10], sortedCoords[11])
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [sortedCoords])

  return (
    <group>
      <mesh geometry={meshGeometry}>
          
          
      <meshLambertMaterial color={color} side={THREE.DoubleSide} />

      </mesh>
      <lineLoop geometry={lineGeometry}>
        <lineBasicMaterial color="#333" />
      </lineLoop>
    </group>
  )
}
