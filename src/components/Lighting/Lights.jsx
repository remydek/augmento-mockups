import React from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import useSceneStore from '../../store/useSceneStore'

export default function Lights() {
  const {
    shadows,
    environment,
    lightPosition,
    lightIntensity,
    lightDistance,
    shadowRadius,
    contactShadowBlur,
    contactShadowOpacity
  } = useSceneStore()

  return (
    <>
      {/* Environment for realistic lighting */}
      <Environment preset={environment} background={false} />

      {/* Minimal ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Single BIG omni light high above for soft shadows */}
      <pointLight
        castShadow={shadows}
        position={lightPosition}
        intensity={lightIntensity}
        color="#ffffff"
        distance={lightDistance}
        decay={1}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.1}
        shadow-camera-far={lightDistance}
        shadow-radius={shadowRadius}
        shadow-bias={-0.0001}
      />
      
      {/* Shadow catcher plane for actual model shadows */}
      {shadows && (
        <>
          {/* Soft shadow catcher plane */}
          <mesh
            receiveShadow
            position={[0, -0.9, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[10, 10]} />
            <shadowMaterial
              transparent
              opacity={0.2}
              color="#000000"
            />
          </mesh>

          {/* Enhanced contact shadows for softer ground effect */}
          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={contactShadowOpacity}
            scale={4}
            blur={contactShadowBlur}
            far={6}
            resolution={2048}
            smooth={true}
          />
        </>
      )}
    </>
  )
}
