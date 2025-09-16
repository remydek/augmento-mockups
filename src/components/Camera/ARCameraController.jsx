import React, { useRef, useState, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useSceneStore from '../../store/useSceneStore'

export default function ARCameraController() {
  const { camera } = useThree()
  const cameraFov = useSceneStore((state) => state.cameraFov)
  const [useGyro, setUseGyro] = useState(false)
  const [gyroPermission, setGyroPermission] = useState(false)
  const quaternion = useRef(new THREE.Quaternion())
  const euler = useRef(new THREE.Euler())
  
  // Update camera FOV when it changes
  useEffect(() => {
    camera.fov = cameraFov
    camera.updateProjectionMatrix()
  }, [cameraFov, camera])
  
  // Request gyroscope permission (iOS 13+)
  const requestGyroPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission()
        setGyroPermission(permission === 'granted')
        setUseGyro(permission === 'granted')
      } catch (error) {
        console.error('Error requesting device orientation permission:', error)
      }
    } else {
      // Not iOS or permission not needed
      setGyroPermission(true)
      setUseGyro(true)
    }
  }
  
  // Handle device orientation
  useEffect(() => {
    if (!useGyro) return
    
    const handleDeviceOrientation = (event) => {
      if (event.alpha === null || event.beta === null || event.gamma === null) return
      
      const alpha = THREE.MathUtils.degToRad(event.alpha) // Z axis
      const beta = THREE.MathUtils.degToRad(event.beta)   // X axis
      const gamma = THREE.MathUtils.degToRad(event.gamma) // Y axis
      
      // Convert to quaternion (with adjustments for phone orientation)
      euler.current.set(beta, alpha, -gamma, 'YXZ')
      quaternion.current.setFromEuler(euler.current)
    }
    
    window.addEventListener('deviceorientation', handleDeviceOrientation)
    
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [useGyro])
  
  // Apply gyro rotation smoothly
  useFrame(() => {
    if (useGyro && quaternion.current) {
      camera.quaternion.slerp(quaternion.current, 0.1)
    }
  })
  
  // Check if we need to show permission button
  const needsPermissionButton = typeof DeviceOrientationEvent !== 'undefined' && 
                                typeof DeviceOrientationEvent.requestPermission === 'function'
  
  return (
    <>
      {/* OrbitControls as fallback when gyro is not active */}
      {!useGyro && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={0.2}
          maxDistance={20}
          target={[0, 1, 0]}
          makeDefault
        />
      )}
      
      {/* Permission button for iOS */}
      {needsPermissionButton && !gyroPermission && (
        <group>
          <mesh position={[0, 2, -3]} onClick={requestGyroPermission}>
            <boxGeometry args={[2, 0.5, 0.1]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </group>
      )}
    </>
  )
}