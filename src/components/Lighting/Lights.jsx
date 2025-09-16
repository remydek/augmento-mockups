import React from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import useSceneStore from '../../store/useSceneStore'

export default function Lights() {
  const { shadows, environment } = useSceneStore()

  return (
    <>
      {/* Environment for realistic lighting */}
      <Environment preset={environment} background={false} />
      
      {/* Ambient lighting */}
      <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#404040" />
      
      {/* Key light with shadows */}
      <directionalLight
        castShadow={shadows}
        position={[5, 10, 5]}
        intensity={1.2}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow={shadows}>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
      
      {/* Contact shadows for realistic grounding */}
      {shadows && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.7}
          scale={10}
          blur={2.5}
          far={20}
          resolution={256}
        />
      )}
    </>
  )
}