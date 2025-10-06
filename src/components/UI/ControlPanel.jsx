import React, { useRef, useEffect, useState } from 'react'
import useSceneStore from '../../store/useSceneStore'
import '../../styles/app.css'

export default function ControlPanel({ currentTab }) {
  const fileInputRef = useRef(null)
  const backgroundInputRef = useRef(null)
  const [streetViewUrl, setStreetViewUrl] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('')
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 50, y: 50 })
  const [streetViewParams, setStreetViewParams] = useState({ heading: 0, pitch: 0, panoramaId: null })
  const [sidebarBackgroundVideo, setSidebarBackgroundVideo] = useState(null)
  const [showLightingControls, setShowLightingControls] = useState(false)
  const [showModelGrid, setShowModelGrid] = useState(false)

  // Welcome screen background controls
  const [welcomeBackgroundType, setWelcomeBackgroundType] = useState('color')
  const [welcomeBackgroundImage, setWelcomeBackgroundImage] = useState(null)
  const [welcomeBackgroundColor, setWelcomeBackgroundColor] = useState('#2a1b69')

  // Available models from public/models
  const availableModels = [
    { name: 'Heart Red', file: 'heart-red.glb', emoji: '❤️' },
    { name: 'Heart Coin', file: 'heart-coin.glb', emoji: '💰' },
    { name: 'Trophy A', file: 'Trophy-A.glb', emoji: '🏆' },
    { name: 'Trophy B', file: 'Trophy-B.glb', emoji: '🥇' },
    { name: 'Crown', file: 'CrownB.glb', emoji: '👑' },
    { name: 'Diamond', file: 'Gem-Diamond.glb', emoji: '💎' },
    { name: 'Emerald', file: 'Gem-Emerald.glb', emoji: '🟢' },
    { name: 'Gold Key', file: 'KeyGold.glb', emoji: '🗝️' },
    { name: 'Gift Black', file: 'Gift-A_Black.glb', emoji: '🎁' },
    { name: 'Gift White', file: 'Gift-A_White.glb', emoji: '🤍' },
    { name: 'Shopping Bag', file: 'ShoppingBag_White.glb', emoji: '🛍️' },
    { name: 'Chest', file: 'Chest.glb', emoji: '📦' },
    { name: 'Coffee A', file: 'coffee-A.glb', emoji: '☕' },
    { name: 'Coffee B', file: 'coffee-B.glb', emoji: '🥤' },
    { name: 'Pizza', file: 'pizza.glb', emoji: '🍕' },
    { name: 'Burger', file: 'burger.glb', emoji: '🍔' },
    { name: 'Taco', file: 'taco.glb', emoji: '🌮' },
    { name: 'Ice Cream', file: 'ice-cream-a.glb', emoji: '🍦' },
    { name: 'Cupcake', file: 'cupcake-a.glb', emoji: '🧁' },
    { name: 'Champagne', file: 'champagne.glb', emoji: '🍾' },
    { name: 'Wine', file: 'wine.glb', emoji: '🍷' },
    { name: 'Star 4', file: 'star(4).glb', emoji: '⭐' },
    { name: 'Star 5', file: 'star(5).glb', emoji: '🌟' }
  ]

  const {
    models,
    selectedId,
    environment,
    showVideoBackground,
    shadows,
    cameraFov,
    enableBounce,
    enableRotation,
    lightPosition,
    lightIntensity,
    lightDistance,
    shadowRadius,
    contactShadowBlur,
    contactShadowOpacity,
    addModel,
    select,
    updateSelected,
    removeSelected,
    setEnvironment,
    setShadows,
    setCameraFov,
    setShowVideoBackground,
    setEnableBounce,
    setEnableRotation,
    setLightPosition,
    setLightIntensity,
    setLightDistance,
    setShadowRadius,
    setContactShadowBlur,
    setContactShadowOpacity
  } = useSceneStore()
  
  const selectedModel = models.find(m => m.id === selectedId)
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file)
      const newModel = {
        id: `model-${Date.now()}`,
        name: file.name,
        url: url,
        position: [0, 0, -2], // X=0 for horizontal center
        rotation: [0, 0, 0],
        scale: 1
      }
      addModel(newModel)
    }
  }

  // Handle background image upload
  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setBackgroundImage(url)
      // Apply background to phone
      const phoneBackground = document.querySelector('.phone-background')
      if (phoneBackground) {
        phoneBackground.style.backgroundImage = `url(${url})`
        phoneBackground.style.backgroundSize = 'cover'
        phoneBackground.style.backgroundPosition = `${backgroundPosition.x}% ${backgroundPosition.y}%`
        phoneBackground.style.cursor = 'grab'

        // Add drag functionality (regular image dragging)
        addBackgroundDragListeners(phoneBackground)
      }
    }
  }

  // Handle Street View URL
  const applyStreetView = () => {
    if (streetViewUrl.trim()) {
      const phoneBackground = document.querySelector('.phone-background')
      if (phoneBackground) {
        let imageUrl = streetViewUrl.trim()
        console.log('Input URL:', imageUrl)

        // Check if it's a Google Street View URL and extract image
        if (imageUrl.includes('google.') && imageUrl.includes('maps')) {
          console.log('Processing Google Maps URL:', imageUrl)

          // First try to extract Street View parameters for orbital dragging
          const coordMatch = imageUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
          const panoramaMatch = imageUrl.match(/!1s([a-zA-Z0-9_-]+)/)
          const headingMatch = imageUrl.match(/(\d+(?:\.\d+)?)h/)
          const pitchMatch = imageUrl.match(/(\d+(?:\.\d+)?)t/)

          if (panoramaMatch) {
            const panoramaId = panoramaMatch[1]
            const heading = headingMatch ? parseFloat(headingMatch[1]) : 0
            let pitch = pitchMatch ? parseFloat(pitchMatch[1]) : 0

            // Fix pitch value - Google Maps URLs sometimes have pitch values that need adjustment
            // Street View pitch: 0 = eye level, negative = looking up, positive = looking down
            // If pitch is > 90, it's likely looking straight down - convert to eye level
            if (pitch > 90) {
              pitch = 0 // Default to eye level
            } else if (pitch > 45) {
              pitch = pitch - 90 // Adjust the pitch to be more reasonable
            }

            console.log('Extracted Street View params:', { panoramaId, heading, originalPitch: pitchMatch ? parseFloat(pitchMatch[1]) : 0, adjustedPitch: pitch })

            // Store Street View parameters for orbital dragging
            setStreetViewParams({ heading, pitch, panoramaId })

            // Generate initial Street View image with adjusted pitch
            imageUrl = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=640&h=640&pitch=${pitch}&panoid=${panoramaId}&yaw=${heading}`
            console.log('Using Street View with parameters:', imageUrl)
          } else {
            // Fallback: Try to extract direct image URL from the Street View data
            const thumbnailMatch = imageUrl.match(/6s(https?[^!]+)/)

            if (thumbnailMatch) {
              // Decode the URL and clean it up
              let directImageUrl = decodeURIComponent(thumbnailMatch[1])
              console.log('Found direct image URL (no orbital control):', directImageUrl)

              // Use the direct image URL (no orbital dragging)
              imageUrl = directImageUrl
            } else if (coordMatch) {
              const lat = parseFloat(coordMatch[1])
              const lng = parseFloat(coordMatch[2])
              console.log('Extracted coordinates:', lat, lng)

              alert('No direct image found in URL. For coordinates-based Street View, you would need a valid API key. Please try copying the image URL directly from Street View.')
              return
            } else {
              console.log('Could not extract image or coordinates from URL')
              alert('Could not parse the Google Maps URL. Please try copying the image URL directly from Street View or use a direct image URL.')
              return
            }
          }
        }

        phoneBackground.style.backgroundImage = `url(${imageUrl})`
        phoneBackground.style.backgroundSize = 'cover'
        phoneBackground.style.backgroundPosition = `${backgroundPosition.x}% ${backgroundPosition.y}%`
        phoneBackground.style.cursor = 'grab'
        console.log('Applied background:', imageUrl)

        // Add appropriate drag functionality
        if (streetViewParams.panoramaId) {
          addStreetViewOrbitalListeners(phoneBackground)
        } else {
          addBackgroundDragListeners(phoneBackground)
        }
      }
    }
  }

  // Add background drag functionality
  const addBackgroundDragListeners = (phoneBackground) => {
    let isDragging = false
    let startX, startY
    let currentX = backgroundPosition.x
    let currentY = backgroundPosition.y

    const handleMouseDown = (e) => {
      // Only drag if clicking on the background (not on quiz overlay)
      if (e.target === phoneBackground) {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        phoneBackground.style.cursor = 'grabbing'
        e.preventDefault()
      }
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      // Convert pixel movement to percentage (adjust sensitivity)
      const sensitivity = 0.1
      const newX = Math.max(0, Math.min(100, currentX - (deltaX * sensitivity)))
      const newY = Math.max(0, Math.min(100, currentY - (deltaY * sensitivity)))

      phoneBackground.style.backgroundPosition = `${newX}% ${newY}%`
    }

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false
        phoneBackground.style.cursor = 'grab'

        // Update state with final position
        const finalPosition = phoneBackground.style.backgroundPosition.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
        if (finalPosition) {
          const newPos = {
            x: parseFloat(finalPosition[1]),
            y: parseFloat(finalPosition[2])
          }
          setBackgroundPosition(newPos)
          currentX = newPos.x
          currentY = newPos.y
        }
      }
    }

    // Remove existing listeners to prevent duplicates
    phoneBackground.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    // Add new listeners
    phoneBackground.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Add Street View orbital dragging functionality
  const addStreetViewOrbitalListeners = (phoneBackground) => {
    let isDragging = false
    let startX, startY
    let currentHeading = streetViewParams.heading
    let currentPitch = streetViewParams.pitch

    const handleMouseDown = (e) => {
      // Only drag if clicking on the background (not on quiz overlay)
      if (e.target === phoneBackground) {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        phoneBackground.style.cursor = 'grabbing'
        e.preventDefault()
      }
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      // Convert pixel movement to Street View heading/pitch changes
      const sensitivity = 0.3
      const newHeading = (currentHeading + (deltaX * sensitivity)) % 360
      const newPitch = Math.max(-90, Math.min(90, currentPitch - (deltaY * sensitivity)))

      console.log('Mouse movement:', { deltaX, deltaY, newHeading: newHeading.toFixed(1), newPitch: newPitch.toFixed(1) })

      // Update Street View image with new heading/pitch
      if (streetViewParams.panoramaId) {
        const newImageUrl = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=640&h=640&pitch=${newPitch}&panoid=${streetViewParams.panoramaId}&yaw=${newHeading}`
        phoneBackground.style.backgroundImage = `url(${newImageUrl})`
      }
    }

    const handleMouseUp = (e) => {
      if (isDragging) {
        isDragging = false
        phoneBackground.style.cursor = 'grab'

        // Update state with final heading/pitch
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY
        const sensitivity = 0.3

        const finalHeading = (currentHeading + (deltaX * sensitivity)) % 360
        const finalPitch = Math.max(-90, Math.min(90, currentPitch - (deltaY * sensitivity)))

        setStreetViewParams(prev => ({
          ...prev,
          heading: finalHeading,
          pitch: finalPitch
        }))

        currentHeading = finalHeading
        currentPitch = finalPitch

        console.log('Final Street View params:', { heading: finalHeading, pitch: finalPitch })
      }
    }

    // Remove existing listeners to prevent duplicates
    phoneBackground.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    // Add new listeners
    phoneBackground.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Add model from grid selection
  const addModelFromGrid = (modelData) => {
    const newModel = {
      id: `model-${Date.now()}`,
      name: modelData.name,
      url: `/models/${modelData.file}`,
      position: [0, -0.9, -2], // Start at bottom 0%
      rotation: [0, 0, 0],
      scale: 1
    }
    addModel(newModel)
    setShowModelGrid(false) // Close grid after selection
  }
  
  // Update Y and Z position (keep X centered)
  const updatePosition = (axis, value) => {
    if (!selectedModel) return
    const newPosition = [...selectedModel.position]
    if (axis === 0) {
      // Keep X at 0 for horizontal center
      return
    }
    newPosition[axis] = parseFloat(value)
    updateSelected({ position: newPosition })
  }
  
  // Update scale
  const updateScale = (value) => {
    if (!selectedModel) return
    updateSelected({ scale: parseFloat(value) })
  }
  
  // Snap to ground
  const snapToGround = () => {
    if (!selectedModel) return
    const newPosition = [...selectedModel.position]
    newPosition[1] = 0
    updateSelected({ position: newPosition })
  }

  // Handle video background for sidebar screens (Quiz/Collectible/Rewards)
  const handleSidebarVideoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log('Video file selected:', file.name, file.type)
      const videoUrl = URL.createObjectURL(file)
      setSidebarBackgroundVideo(videoUrl)

      // Apply to phone background (affects Quiz, Collectible, Rewards screens)
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

        // Add event listeners for debugging
        videoElement.addEventListener('loadstart', () => console.log('Video: loadstart'))
        videoElement.addEventListener('canplay', () => console.log('Video: canplay'))
        videoElement.addEventListener('error', (e) => console.error('Video error:', e))

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

        console.log('Appending video element to phone background')
        phoneBackground.appendChild(videoElement)

        // Force play after a short delay
        setTimeout(() => {
          videoElement.play().catch(e => console.error('Video play error:', e))
        }, 100)
      } else {
        console.error('Phone background not found!')
      }
    }
  }

  const removeSidebarVideo = () => {
    setSidebarBackgroundVideo(null)
    const phoneBackground = document.querySelector('.phone-background')
    if (phoneBackground) {
      const existingVideo = phoneBackground.querySelector('.sidebar-background-video')
      if (existingVideo) existingVideo.remove()
    }
  }

  // Welcome screen background handlers
  const handleWelcomeBackgroundImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setWelcomeBackgroundImage(imageUrl)
      setWelcomeBackgroundType('image')

      const welcomeScreen = document.querySelector('.welcome-fullscreen')
      if (welcomeScreen) {
        welcomeScreen.style.backgroundImage = `url(${imageUrl})`
        welcomeScreen.style.backgroundSize = 'cover'
        welcomeScreen.style.backgroundPosition = 'center'
        welcomeScreen.style.backgroundRepeat = 'no-repeat'
      }
    }
  }

  const handleWelcomeColorChange = (e) => {
    const color = e.target.value
    setWelcomeBackgroundColor(color)
    setWelcomeBackgroundType('color')

    const welcomeScreen = document.querySelector('.welcome-fullscreen')
    if (welcomeScreen) {
      welcomeScreen.style.backgroundImage = 'none'
      welcomeScreen.style.backgroundColor = color
    }
  }

  const handleWelcomeTypeChange = (type) => {
    setWelcomeBackgroundType(type)

    const welcomeScreen = document.querySelector('.welcome-fullscreen')
    if (type === 'color' && welcomeScreen) {
      welcomeScreen.style.backgroundImage = 'none'
      welcomeScreen.style.backgroundColor = welcomeBackgroundColor
    } else if (type === 'image' && welcomeBackgroundImage && welcomeScreen) {
      welcomeScreen.style.backgroundImage = `url(${welcomeBackgroundImage})`
      welcomeScreen.style.backgroundSize = 'cover'
      welcomeScreen.style.backgroundPosition = 'center'
      welcomeScreen.style.backgroundRepeat = 'no-repeat'
    }
  }

  return (
    <div className="control-panel">
      <h2>AR Mockup Tool</h2>

      {/* Background Controls */}
      <div className="control-section">
        <h3>Background</h3>

        {/* Video Upload */}
        <input
          type="file"
          accept="video/*"
          id="sidebar-video-upload-panel"
          style={{ display: 'none' }}
          onChange={handleSidebarVideoUpload}
        />
        <button
          onClick={() => document.getElementById('sidebar-video-upload-panel').click()}
          className="save-btn save-current"
          style={{ width: '100%', height: '40px', marginBottom: '8px' }}
        >
          🎥 Upload Video
        </button>

        <div className="control-group">
          <label>Or Upload Image:</label>
          <input
            ref={backgroundInputRef}
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            style={{ display: 'none' }}
          />
          <button onClick={() => backgroundInputRef.current?.click()}>
            Upload Background Image
          </button>
          {backgroundImage && (
            <button
              onClick={() => {
                setBackgroundImage('')
                const phoneBackground = document.querySelector('.phone-background')
                if (phoneBackground) {
                  phoneBackground.style.backgroundImage = ''
                }
              }}
              style={{ marginLeft: '8px', background: '#ff4444' }}
            >
              Clear
            </button>
          )}
        </div>



        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          id="welcome-background-upload"
          style={{ display: 'none' }}
          onChange={handleWelcomeBackgroundImageUpload}
        />
        <h3 style={{ marginTop: '10px' }}>Welcome Screen Background or Color</h3>
        <button
          onClick={() => document.getElementById('welcome-background-upload').click()}
          className="save-btn save-current"
          style={{ width: '100%', height: '40px', marginBottom: sidebarBackgroundVideo ? '8px' : '0' }}
        >
          📷 Upload Welcome Screen BG Image
        </button>

        {/* Remove Video Button */}
        {sidebarBackgroundVideo && (
          <button
            onClick={removeSidebarVideo}
            className="save-btn"
            style={{ width: '100%', height: '40px', background: 'linear-gradient(145deg, #ff6b6b 0%, #ff4757 50%, #ff3742 100%)', marginBottom: '10px' }}
          >
            Remove Video
          </button>
        )}

        {/* Color Picker */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ width: '100%', height: '40px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <input
              type="color"
              value={welcomeBackgroundColor}
              onChange={handleWelcomeColorChange}
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Model Loading */}
      <div className="control-section">
        <h3>SELECT OR UPLOAD AR Model</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          Upload GLB/GLTF
        </button>
        <button onClick={() => setShowModelGrid(!showModelGrid)}>
          Choose AR Model {showModelGrid ? '▼' : '▶'}
        </button>
      </div>

      {/* Model Grid */}
      {showModelGrid && (
        <div className="model-grid">
          {availableModels.map((model) => (
            <div
              key={model.file}
              className="model-grid-item"
              onClick={() => addModelFromGrid(model)}
            >
              <div className="model-emoji">{model.emoji}</div>
              <div className="model-name">{model.name}</div>
            </div>
          ))}
        </div>
      )}
      
      {/* Model Selection */}
      {models.length > 0 && (
        <div className="control-section">
          <h3>Select Model</h3>
          <select value={selectedId || ''} onChange={(e) => select(e.target.value)}>
            <option value="">-- Select Model --</option>
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {selectedId && (
            <button onClick={removeSelected} className="remove-btn">
              Remove Selected
            </button>
          )}
        </div>
      )}
      
      {/* Transform Controls */}
      {selectedModel && (
        <div className="control-section">
          <h3>Transform</h3>
          
          <div className="control-group">
            <label>Position</label>
            <div className="axis-controls">
              <div>
                <span>Y (Up/Down):</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={selectedModel.position[1]}
                  onChange={(e) => updatePosition(1, e.target.value)}
                />
                <span>{selectedModel.position[1].toFixed(1)}</span>
              </div>
              <div>
                <span>Z (Depth):</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={selectedModel.position[2]}
                  onChange={(e) => updatePosition(2, e.target.value)}
                />
                <span>{selectedModel.position[2].toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <label>Scale</label>
            <div className="axis-controls">
              <div>
                <span>Size:</span>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={selectedModel.scale}
                  onChange={(e) => updateScale(e.target.value)}
                />
                <span>{selectedModel.scale.toFixed(1)}x</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Controls */}
      <div className="control-section">
        <h3>Animations</h3>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={enableBounce}
              onChange={(e) => setEnableBounce(e.target.checked)}
            />
            Bounce Animation
          </label>
          <label>
            <input
              type="checkbox"
              checked={enableRotation}
              onChange={(e) => setEnableRotation(e.target.checked)}
            />
            Rotation Animation
          </label>
        </div>
      </div>


      {/* Background Settings */}
      <div className="control-section">
        <h3>Google Maps Background</h3>

        <div className="control-group">
          <label>Background Image URL:</label>
          <input
            type="text"
            value={streetViewUrl}
            onChange={(e) => setStreetViewUrl(e.target.value)}
            placeholder="Paste Google Maps/Street View URL or direct image URL..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#2a2a2a',
              color: 'white',
              marginBottom: '8px'
            }}
          />
          <button onClick={applyStreetView}>Apply Background</button>
          <div style={{
            fontSize: '11px',
            color: '#888',
            marginTop: '4px',
            lineHeight: '1.3'
          }}>
            ✅ Supports Google Street View URLs or direct image URLs (jpg, png, etc.). For best results, right-click on Street View and "Copy image address".
          </div>
        </div>

        {(backgroundImage || streetViewUrl) && (
          <div className="control-group">
            <label>Background Controls:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setBackgroundPosition({ x: 50, y: 50 })
                  const phoneBackground = document.querySelector('.phone-background')
                  if (phoneBackground) {
                    phoneBackground.style.backgroundPosition = '50% 50%'
                  }
                }}
                style={{
                  width: 'auto',
                  padding: '4px 8px',
                  fontSize: '11px'
                }}
              >
                Reset Position
              </button>
              <span style={{ fontSize: '11px', color: '#aaa' }}>
                {streetViewParams.panoramaId ? '🌍 Drag to orbit Street View' : '💡 Drag to reposition'}
              </span>
            </div>
          </div>
        )}

        
      </div>

      {/* Scene Settings */}
      <div className="control-section">
        <h3>Scene Settings</h3>
        
        <div className="control-group">
          <label>Environment</label>
          <select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
            <option value="city">City</option>
            <option value="sunset">Sunset</option>
            <option value="dawn">Dawn</option>
            <option value="night">Night</option>
            <option value="warehouse">Warehouse</option>
            <option value="forest">Forest</option>
            <option value="apartment">Apartment</option>
            <option value="studio">Studio</option>
            <option value="park">Park</option>
            <option value="lobby">Lobby</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={shadows}
              onChange={(e) => setShadows(e.target.checked)}
            />
            Shadows
          </label>
        </div>
        
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showVideoBackground}
              onChange={(e) => setShowVideoBackground(e.target.checked)}
            />
            Camera Background
          </label>
        </div>
      </div>

      {/* Lighting Controls */}
      <div className="control-section">
        <h3
          onClick={() => setShowLightingControls(!showLightingControls)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          💡 Lighting Controls {showLightingControls ? '▼' : '▶'}
        </h3>

        {showLightingControls && (
          <>
            <div className="control-group">
              <label>Light Height: {lightPosition[1]}</label>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={lightPosition[1]}
                onChange={(e) => setLightPosition([0, parseFloat(e.target.value), 0])}
              />
            </div>

            <div className="control-group">
              <label>Light Intensity: {lightIntensity}</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Light Distance: {lightDistance}</label>
              <input
                type="range"
                min="8"
                max="25"
                step="1"
                value={lightDistance}
                onChange={(e) => setLightDistance(parseFloat(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Shadow Softness: {shadowRadius}</label>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={shadowRadius}
                onChange={(e) => setShadowRadius(parseFloat(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Contact Shadow Blur: {contactShadowBlur}</label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={contactShadowBlur}
                onChange={(e) => setContactShadowBlur(parseFloat(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Contact Shadow Opacity: {contactShadowOpacity}</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={contactShadowOpacity}
                onChange={(e) => setContactShadowOpacity(parseFloat(e.target.value))}
              />
            </div>
          </>
        )}
      </div>


    </div>
  )
}