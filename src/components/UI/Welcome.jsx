import React, { useState, useRef } from 'react'

export default function Welcome({ onStart }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState('Welcome to Augmento')
  const [logo, setLogo] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [backgroundColor, setBackgroundColor] = useState('#2a1b69')
  const [backgroundType, setBackgroundType] = useState('color') // 'color' or 'image'

  const logoInputRef = useRef(null)

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      setLogo(imageUrl)
      console.log('Logo uploaded:', imageUrl)
    }
  }

  const triggerLogoUpload = () => {
    logoInputRef.current?.click()
  }

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(imageUrl)
      setBackgroundType('image')
    }
  }

  const triggerBackgroundUpload = () => {
    document.getElementById('background-upload').click()
  }

  const getWelcomeStyle = () => {
    if (backgroundType === 'image' && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    } else {
      return {
        backgroundColor: backgroundColor
      }
    }
  }

  return (
    <div className="welcome-fullscreen" style={getWelcomeStyle()}>

        {/* Logo Section */}
        <div className="welcome-logo-section">
          <div
            className={`welcome-logo clickable ${logo ? 'has-logo' : 'placeholder'}`}
            onClick={triggerLogoUpload}
          >
            {logo ? (
              <img src={logo} alt="Logo" className="logo-image" />
            ) : (
              <div className="logo-placeholder">
                <span>📷</span>
                <span>Click to upload logo</span>
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        {/* Title Section */}
        <div className="welcome-title-section">
          {isEditingTitle ? (
            <textarea
              className="title-edit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  setIsEditingTitle(false)
                }
              }}
              autoFocus
            />
          ) : (
            <div
              className="welcome-title"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
              <button
                className="edit-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditingTitle(true)
                }}
                title="Edit title"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        {/* Start Button */}
        <div className="welcome-button-section">
          <button className="welcome-start-btn" onClick={onStart}>
            START
          </button>
        </div>
    </div>
  )
}