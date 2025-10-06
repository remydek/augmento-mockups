import React, { useRef, useEffect, useState } from 'react'
import useSceneStore from '../../store/useSceneStore'

export default function CameraFeed() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [hasPermission, setHasPermission] = useState(false)
  const showVideoBackground = useSceneStore((state) => state.showVideoBackground)
  
  useEffect(() => {
    if (!showVideoBackground) {
      // Stop the stream if video is disabled
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
      return
    }
    
    // Request camera access
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        })
        
        setStream(mediaStream)
        setHasPermission(true)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setHasPermission(false)
      }
    }
    
    startCamera()
    
    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [showVideoBackground])
  
  if (!showVideoBackground) return null
  
  return (
    <div className="camera-feed-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-feed-video"
      />
      {!hasPermission && (
        <div className="camera-permission-message">
          Camera permission required for AR background
        </div>
      )}
    </div>
  )
}