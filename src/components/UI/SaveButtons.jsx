import React from 'react'
import html2canvas from 'html2canvas'

export default function SaveButtons({ currentTab }) {
  // Nuclear option: solid backgrounds that WILL show up
  const applyScreenshotCompatibleGlass = (element) => {
    // Store original styles
    const originalStyles = {
      element,
      backdropFilter: element.style.backdropFilter || '',
      webkitBackdropFilter: element.style.webkitBackdropFilter || '',
      background: element.style.background || '',
      backgroundImage: element.style.backgroundImage || '',
      backgroundColor: element.style.backgroundColor || '',
      border: element.style.border || '',
      boxShadow: element.style.boxShadow || ''
    }

    // Remove problematic backdrop-filter
    element.style.backdropFilter = 'none'
    element.style.webkitBackdropFilter = 'none'

    // SOLID backgrounds that html2canvas CANNOT miss
    element.style.background = 'none'
    element.style.backgroundImage = 'none'
    element.style.backgroundColor = 'rgba(0, 0, 0, 0.8)' // 80% black - guaranteed visibility
    element.style.border = '2px solid rgba(255, 255, 255, 0.9)'
    element.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)'

    return originalStyles
  }

  const saveCurrentMockup = async () => {
    try {
      const phoneBackground = document.querySelector('.phone-background')
      if (!phoneBackground) {
        alert('Phone background not found')
        return
      }

      console.log('Starting foolproof glassmorphism replacement...')

      // Wait for any animations/renders to complete
      await new Promise(resolve => setTimeout(resolve, 300))

      // Force WebGL context to render one more time (only if canvas exists)
      const threeCanvas = phoneBackground.querySelector('canvas')
      if (threeCanvas) {
        try {
          const context = threeCanvas.getContext('webgl2') || threeCanvas.getContext('webgl')
          if (context) {
            const event = new Event('screenshot-prepare')
            window.dispatchEvent(event)
            await new Promise(resolve => setTimeout(resolve, 200))
          }
        } catch (contextError) {
          console.warn('WebGL context error:', contextError)
        }
      }

      // Find all elements with backdrop-filter and replace with solid glassmorphism
      const backdropElements = []
      const elementsWithBackdrop = phoneBackground.querySelectorAll('*')

      for (const element of elementsWithBackdrop) {
        const computedStyle = window.getComputedStyle(element)
        const backdropFilter = computedStyle.getPropertyValue('backdrop-filter') ||
                               computedStyle.getPropertyValue('-webkit-backdrop-filter')

        if (backdropFilter && backdropFilter !== 'none' && backdropFilter.includes('blur')) {
          console.log('Replacing backdrop-filter with solid glass effect:', element.className)

          // Apply screenshot-compatible glassmorphism
          const originalStyles = applyScreenshotCompatibleGlass(element)
          backdropElements.push(originalStyles)
        }
      }

      console.log(`Replaced ${backdropElements.length} backdrop-filter elements with solid glassmorphism`)

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 200))

      console.log('Taking final screenshot...')
      // Take the screenshot
      const canvas = await html2canvas(phoneBackground, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
        scale: 2,
        logging: false,
        ignoreElements: (element) => {
          return element.tagName === 'LINK' && element.href && element.href.includes('googleapis.com')
        }
      })

      const dataUrl = canvas.toDataURL('image/png', 1.0)

      // Create download link
      const link = document.createElement('a')
      link.download = `mockup-${currentTab}-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log('Screenshot saved successfully!')

      // Clean up - restore original styles
      backdropElements.forEach(({
        element,
        backdropFilter,
        webkitBackdropFilter,
        background,
        backgroundImage,
        backgroundColor,
        border,
        boxShadow
      }) => {
        element.style.backdropFilter = backdropFilter
        element.style.webkitBackdropFilter = webkitBackdropFilter
        element.style.background = background
        element.style.backgroundImage = backgroundImage
        element.style.backgroundColor = backgroundColor
        element.style.border = border
        element.style.boxShadow = boxShadow
      })

      console.log('Cleanup completed')

    } catch (error) {
      console.error('Error saving mockup:', error)
      alert('Error saving mockup. Please try again.')
    }
  }

  const saveAllMockups = async () => {
    const tabs = ['welcome', 'quiz', 'collectible', 'rewards']

    try {
      const confirmSave = confirm('This will save all 4 screens automatically by switching tabs. Continue?')
      if (!confirmSave) return

      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i]
        console.log(`Processing tab: ${tab}`)

        // Find and click the tab button
        const tabButton = document.querySelector(`button[data-tab="${tab}"]`)
        if (tabButton) {
          tabButton.click()

          // Wait for DOM to update
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Use the same smart processing as single save
          await saveCurrentMockup()

          // Delay between saves
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      alert('All mockups saved! Check your downloads folder.')

    } catch (error) {
      console.error('Error saving all mockups:', error)
      alert('Some mockups may not have been saved. Please try individual saves.')
    }
  }

  return (
    <div className="save-buttons">
      <button
        onClick={saveCurrentMockup}
        className="save-btn save-current"
        title="Save current screen as PNG with proper backdrop blur"
      >
        💾 Save Mockup
      </button>
      <button
        onClick={saveAllMockups}
        className="save-btn save-all"
        title="Save all screens as PNG files with proper backdrop blur"
      >
        📁 Save All
      </button>
    </div>
  )
}