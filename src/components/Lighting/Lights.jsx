import React from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import useSceneStore from '../../store/useSceneStore'

export default function Lights() {
  const { shadows } = useSceneStore()

  return (
    <>
      {/* Environment for realistic lighting */}
      <Environment preset="city" background={false} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      
      {/* Key light with shadows */}
      <directionalLight
        castShadow={shadows}
        position={[2, 3, 2]}
        intensity={1.0}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={10}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      
      {/* Contact shadows for realistic grounding - smaller scale */}
      {shadows && (
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.4}
          scale={2}
          blur={1.5}
          far={4}
          resolution={256}
        />
      )}
    </>
  )
}
