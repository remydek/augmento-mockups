import React, { useState } from 'react'

export default function ScreenRecorder({ currentTab }) {
  const [sidebarBackgroundVideo, setSidebarBackgroundVideo] = useState(null)

  // Handle video background upload for phone background
  const handleSidebarVideoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log('Video file selected:', file.name, file.type)
      const videoUrl = URL.createObjectURL(file)
      setSidebarBackgroundVideo(videoUrl)

      // Apply to phone background
      const phoneBackground = document.querySelector('.phone-background')
      console.log('Phone background element:', phoneBackground)

      if (phoneBackground) {
        // Remove existing video background
        const existingVideo = phoneBackground.querySelector('.sidebar-background-video')
        if (existingVideo) {
          console.log('Removing existing video')
          existingVideo.remove()
        }

        // Create video element
        const videoElement = document.createElement('video')
        videoElement.src = videoUrl
        videoElement.className = 'sidebar-background-video'
        videoElement.autoplay = true
        videoElement.loop = true
        videoElement.muted = true
        videoElement.playsInline = true

        videoElement.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          pointer-events: none;
        `

        phoneBackground.insertBefore(videoElement, phoneBackground.firstChild)

        videoElement.play().catch(err => {
          console.error('Error playing video:', err)
        })

        console.log('Video element added to phone background')
      }
    }
  }

  const removeSidebarVideo = () => {
    setSidebarBackgroundVideo(null)
    const phoneBackground = document.querySelector('.phone-background')
    if (phoneBackground) {
      const existingVideo = phoneBackground.querySelector('.sidebar-background-video')
      if (existingVideo) {
        existingVideo.remove()
      }
    }
  }

  return (
    <div className="background-controls-unified">
      {/* Video Background for AR Screens */}
      <div className="video-background-section">
        <input
          type="file"
          accept="video/*"
          id="sidebar-video-upload"
          style={{ display: 'none' }}
          onChange={handleSidebarVideoUpload}
        />
        <button
          className="bg-upload-btn video-btn"
          onClick={() => document.getElementById('sidebar-video-upload').click()}
        >
          🎥 Upload Video
        </button>
        {sidebarBackgroundVideo && (
          <button
            onClick={removeSidebarVideo}
            className="remove-video-btn"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
