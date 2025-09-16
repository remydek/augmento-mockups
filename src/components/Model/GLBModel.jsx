import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useSceneStore from '../../store/useSceneStore'

// Set up DRACO decoder
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')

export default function GLBModel({ id, url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(url)
  const select = useSceneStore((state) => state.select)
  const groupRef = useRef()
  
  // Set up shadows for all meshes in the model
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])
  
  // Add slow rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })
  
  const handleClick = (e) => {
    e.stopPropagation()
    select(id)
  }
  
  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerDown={handleClick}
    >
      <primitive object={scene} />
    </group>
  )
}

// Preload the default sample model
useGLTF.preload('/models/DamagedHelmet.glb')