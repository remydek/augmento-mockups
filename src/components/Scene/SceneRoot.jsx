import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import * as THREE from 'three'
import useSceneStore from '../../store/useSceneStore'
import ARCameraController from '../Camera/ARCameraController'
import Lights from '../Lighting/Lights'
import GLBModel from '../Model/GLBModel'

function ScreenshotHandler() {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    const handleScreenshot = () => {
      // Force a render
      gl.render(scene, camera)
    }

    window.addEventListener('screenshot-prepare', handleScreenshot)
    return () => window.removeEventListener('screenshot-prepare', handleScreenshot)
  }, [gl, scene, camera])

  return null
}

function Models() {
  const models = useSceneStore((state) => state.models)

  return (
    <>
      <ScreenshotHandler />
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
    <div style={{ width: '100%', height: '100%', position: 'relative', transform: 'scaleX(-1)' }}>
      <Canvas
        shadows={shadows}
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.01, far: 100, position: [0, 0, 2] }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
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
