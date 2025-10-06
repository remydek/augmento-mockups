import React, { useState } from 'react'

export default function BackgroundControls() {
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [backgroundColor, setBackgroundColor] = useState('#2a1b69')
  const [backgroundType, setBackgroundType] = useState('color') // 'color' or 'image' only

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(imageUrl)
      setBackgroundType('image')

      // Apply to welcome screen
      const welcomeScreen = document.querySelector('.welcome-fullscreen')
      if (welcomeScreen) {
        welcomeScreen.style.backgroundImage = `url(${imageUrl})`
        welcomeScreen.style.backgroundSize = 'cover'
        welcomeScreen.style.backgroundPosition = 'center'
        welcomeScreen.style.backgroundRepeat = 'no-repeat'
      }

      // Apply to camera feed (for Quiz, Collectible, Rewards)
      const cameraFeed = document.querySelector('.camera-feed')
      if (cameraFeed) {
        cameraFeed.style.backgroundImage = `url(${imageUrl})`
        cameraFeed.style.backgroundSize = 'cover'
        cameraFeed.style.backgroundPosition = 'center'
        cameraFeed.style.backgroundRepeat = 'no-repeat'
      }
    }
  }

  const triggerBackgroundUpload = () => {
    document.getElementById('background-upload').click()
  }

  const handleColorChange = (e) => {
    const color = e.target.value
    setBackgroundColor(color)
    setBackgroundType('color')

    // Apply to welcome screen
    const welcomeScreen = document.querySelector('.welcome-fullscreen')
    if (welcomeScreen) {
      welcomeScreen.style.backgroundImage = 'none'
      welcomeScreen.style.backgroundColor = color
    }

    // Apply to camera feed
    const cameraFeed = document.querySelector('.camera-feed')
    if (cameraFeed) {
      cameraFeed.style.backgroundImage = 'none'
      cameraFeed.style.backgroundColor = color
    }
  }

  const handleTypeChange = (type) => {
    setBackgroundType(type)

    const welcomeScreen = document.querySelector('.welcome-fullscreen')
    const cameraFeed = document.querySelector('.camera-feed')

    if (type === 'color') {
      if (welcomeScreen) {
        welcomeScreen.style.backgroundImage = 'none'
        welcomeScreen.style.backgroundColor = backgroundColor
      }
      if (cameraFeed) {
        cameraFeed.style.backgroundImage = 'none'
        cameraFeed.style.backgroundColor = backgroundColor
      }
    } else if (type === 'image' && backgroundImage) {
      if (welcomeScreen) {
        welcomeScreen.style.backgroundImage = `url(${backgroundImage})`
        welcomeScreen.style.backgroundSize = 'cover'
        welcomeScreen.style.backgroundPosition = 'center'
        welcomeScreen.style.backgroundRepeat = 'no-repeat'
      }
      if (cameraFeed) {
        cameraFeed.style.backgroundImage = `url(${backgroundImage})`
        cameraFeed.style.backgroundSize = 'cover'
        cameraFeed.style.backgroundPosition = 'center'
        cameraFeed.style.backgroundRepeat = 'no-repeat'
      }
    }
  }

  return (
    <div className="external-background-controls">
      <div className="background-type-toggle">
        <button
          className={`bg-toggle ${backgroundType === 'color' ? 'active' : ''}`}
          onClick={() => handleTypeChange('color')}
        >
          Color
        </button>
        <button
          className={`bg-toggle ${backgroundType === 'image' ? 'active' : ''}`}
          onClick={() => handleTypeChange('image')}
        >
          Image
        </button>
      </div>

      {backgroundType === 'color' ? (
        <input
          type="color"
          value={backgroundColor}
          onChange={handleColorChange}
          className="color-picker"
        />
      ) : (
        <div className="background-image-controls">
          <button
            className="bg-upload-btn"
            onClick={triggerBackgroundUpload}
          >
            📷 Upload Image
          </button>
          <input
            type="file"
            accept="image/*"
            id="background-upload"
            style={{ display: 'none' }}
            onChange={handleBackgroundImageUpload}
          />
        </div>
      )}
    </div>
  )
}