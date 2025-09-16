import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import * as THREE from 'three'
import useSceneStore from '../../store/useSceneStore'
import ARCameraController from '../Camera/ARCameraController'
import Lights from '../Lighting/Lights'
import GLBModel from '../Model/GLBModel'

function Models() {
  const models = useSceneStore((state) => state.models)
  
  return (
    <>
      {models.map((model) => (
        <GLBModel
          key={model.id}
          id={model.id}
          url={model.url}
          position={model.position}
          rotation={model.rotation}
          scale={model.scale}
        />
      ))}
    </>
  )
}

export default function SceneRoot() {
  const { shadows } = useSceneStore()

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows={shadows}
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.01, far: 100, position: [0, 0, 2] }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <Suspense fallback={null}>
          <Lights />
          <Models />
        </Suspense>
      </Canvas>
    </div>
  )
}
