import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useSceneStore from '../../store/useSceneStore'

// Set up DRACO decoder
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')

export default function GLBModel({ id, url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(url)
  const select = useSceneStore((state) => state.select)
  const enableBounce = useSceneStore((state) => state.enableBounce)
  const enableRotation = useSceneStore((state) => state.enableRotation)
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
  
  // Add animations based on settings
  useFrame((state) => {
    if (groupRef.current) {
      // Bounce animation (up-down motion)
      if (enableBounce) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1
      } else {
        groupRef.current.position.y = position[1]
      }

      // Rotation animation (spin around Y-axis)
      if (enableRotation) {
        groupRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.5
      } else {
        groupRef.current.rotation.y = rotation[1]
      }
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
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerDown={handleClick}
    >
      <primitive object={scene} scale={[-1, 1, 1]} />
    </group>
  )
}

// Preload the default sample model
useGLTF.preload('/models/heart-red.glb')