import React, { useEffect, useState } from 'react'
import SceneRoot from './components/Scene/SceneRoot'
import ControlPanel from './components/UI/ControlPanel'
import CameraFeed from './components/UI/CameraFeed'
import Quiz from './components/UI/Quiz'
import Collectible from './components/UI/Collectible'
import Rewards from './components/UI/Rewards'
import Welcome from './components/UI/Welcome'
import AIPrompt from './components/UI/AIPrompt'
import useSceneStore from './store/useSceneStore'
import { generateQuizContent } from './services/aiService'
import './App.css'

function App() {
  const addModel = useSceneStore((state) => state.addModel)
  const [activeTab, setActiveTab] = useState('welcome')
  const [showAIPrompt, setShowAIPrompt] = useState(false)
  const [quizData, setQuizData] = useState(null)
  const [rewardsData, setRewardsData] = useState(null)

  // Check if we're in popup mode
  const isPopupMode = new URLSearchParams(window.location.search).has('popup')
  const isRecordingMode = new URLSearchParams(window.location.search).has('recording')

  // Add default model on app load
  useEffect(() => {
    const defaultModel = {
      id: `default-model-${Date.now()}`,
      name: 'Heart Red',
      url: '/models/heart-red.glb',
      position: [0, -0.9, -1.5], // X=0 for horizontal center
      rotation: [0, 0, 0], // No rotation
      scale: 0.8
    }
    addModel(defaultModel)
  }, [addModel])

  // Auto-switch to tab based on URL parameter in popup mode
  useEffect(() => {
    if (isPopupMode) {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      setActiveTab(tabParam || 'collectible')
    }
  }, [isPopupMode])

  // Handle AI generation
  const handleAIGenerate = async (topic) => {
    try {
      const data = await generateQuizContent(topic)
      console.log('Generated content:', data)

      setQuizData({
        question: data.question,
        answers: data.answers,
        correctAnswerIndex: data.correctAnswerIndex
      })

      setRewardsData(data.rewards)
      setShowAIPrompt(false)

      // Show cost notification
      if (data.cost !== undefined) {
        const costFormatted = data.cost < 0.01 ? `$${data.cost.toFixed(6)}` : `$${data.cost.toFixed(4)}`
        alert(`✅ Quiz generated successfully!\n\nClaude API Cost: ${costFormatted}`)
      }

      // Auto-switch to quiz tab to show the generated content
      setActiveTab('quiz')
    } catch (error) {
      console.error('Failed to generate content:', error)
      alert('Failed to generate quiz content. Please try again.')
    }
  }

  // If recording mode, show ONLY the essential content - no frame, no padding
  if (isRecordingMode) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Video Background */}
        <CameraFeed />

        {/* Modal Content */}
        {activeTab === 'quiz' && <Quiz quizData={quizData} />}
        {activeTab === 'collectible' && <Collectible />}

        {/* 3D Model Area */}
        {activeTab !== 'rewards' && activeTab !== 'welcome' && (
          <div className="ar-model-area" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            pointerEvents: 'none'
          }}>
            <SceneRoot />
          </div>
        )}
      </div>
    )
  }

  // If popup mode (but not recording), show phone mockup
  if (isPopupMode) {
    return (
      <div className="app-layout popup-mode" style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent'
      }}>
        <div className="phone-mockup" style={{
          transform: 'scale(1.1)',
          filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.1))'
        }}>
          {/* Phone frame */}
          <div className="phone-frame">
            {/* Background */}
            <div className="phone-background">
              {/* Camera Feed Background */}
              <CameraFeed />
              {/* Tab Content */}
              {activeTab === 'welcome' && <Welcome onStart={() => setActiveTab('quiz')} />}
              {activeTab === 'quiz' && <Quiz quizData={quizData} />}
              {activeTab === 'collectible' && <Collectible />}
              {activeTab === 'rewards' && <Rewards rewardsData={rewardsData} />}

              {/* AI Prompt Modal */}
              {showAIPrompt && <AIPrompt onGenerate={handleAIGenerate} />}

              {/* AR 3D Model Area - Hide on rewards and welcome screens */}
              {activeTab !== 'rewards' && activeTab !== 'welcome' && (
                <div className="ar-model-area">
                  <SceneRoot />
                </div>
              )}

              {/* View Rewards Button - Only on rewards screen */}
              {activeTab === 'rewards' && (
                <div className="view-rewards-button">
                  <div className="view-rewards-btn">
                    <div className="rewards-btn-content">
                      <span className="trophy-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                          <path d="M13.8135 0.250004L14.4482 0.250981C15.0579 0.254875 15.5919 0.272069 16.039 0.344731C16.673 0.447813 17.2313 0.67717 17.664 1.20118H17.665C18.0829 1.70769 18.2264 2.27696 18.247 2.90723C18.2506 3.01704 18.2503 3.13129 18.247 3.25H18.7021C19.2798 3.25 19.7922 3.24869 20.1953 3.30469C20.5623 3.35571 20.952 3.4674 21.2646 3.76075L21.3935 3.89844L21.5058 4.05274C21.7382 4.41804 21.7702 4.82224 21.7412 5.19141C21.7098 5.59035 21.5955 6.07943 21.4707 6.62207L21.0791 8.32129C20.4402 11.0994 18.1658 13.1677 15.3945 13.6934C14.8046 14.6359 14.1145 15.4302 13.334 15.9727C14.3164 16.6216 15.0955 17.653 15.5781 18.8506C15.8396 19.4994 15.7862 20.1857 15.5302 20.7227C15.2832 21.241 14.7677 21.75 14.041 21.75H7.95896C7.2323 21.75 6.71678 21.241 6.4697 20.7227C6.21377 20.1857 6.16038 19.4994 6.42185 18.8506C6.9044 17.6533 7.68289 16.6216 8.66501 15.9727C7.88458 15.4301 7.19425 14.6358 6.60447 13.6934C3.8336 13.1674 1.55972 11.0991 0.920873 8.32129L0.530248 6.62207C0.405453 6.07941 0.290156 5.59037 0.258764 5.19141C0.225594 4.76945 0.271799 4.30155 0.60642 3.89844L0.735326 3.76075C1.04796 3.46738 1.43764 3.3557 1.80466 3.30469C2.20778 3.24869 2.72014 3.25 3.29783 3.25H3.7529C3.74966 3.13129 3.74932 3.01704 3.7529 2.90723C3.77354 2.27702 3.91715 1.70862 4.33494 1.20215C4.76778 0.67751 5.32658 0.447876 5.96091 0.344731C6.55709 0.247842 7.3076 0.250004 8.1865 0.250004H13.8135ZM11 16.75C9.73884 16.75 8.49696 17.7154 7.81345 19.4111C7.71576 19.6535 7.74009 19.9026 7.82322 20.0772C7.89319 20.224 7.95953 20.2472 7.96872 20.25H14.0312C14.0405 20.2472 14.1059 20.2237 14.1758 20.0772C14.259 19.9026 14.2842 19.6536 14.1865 19.4111C13.503 17.7154 12.2611 16.75 11 16.75ZM7.54685 1.75196C6.96326 1.75602 6.53822 1.7706 6.20212 1.8252C5.79216 1.89182 5.61841 2.00204 5.49119 2.15625C5.34901 2.32868 5.26558 2.53912 5.25193 2.95606C5.23713 3.4089 5.30645 4.00041 5.41501 4.90137C5.78946 8.00889 6.59521 10.6579 7.64158 12.5059C8.70922 14.3913 9.90479 15.25 11 15.25C12.0952 15.25 13.2907 14.3913 14.3584 12.5059C15.4047 10.6579 16.2105 8.00889 16.5849 4.90137C16.6935 4.0004 16.7628 3.40891 16.748 2.95606C16.7361 2.59077 16.6703 2.38414 16.5586 2.22266L16.5078 2.15625C16.3806 2.00217 16.2076 1.89179 15.7978 1.8252C15.4617 1.7706 15.0367 1.75602 14.4531 1.75196L13.8135 1.75H8.1865L7.54685 1.75196ZM3.29783 4.75C2.67475 4.75 2.28631 4.75174 2.01072 4.79004C1.88162 4.808 1.81471 4.83025 1.7822 4.84473C1.76892 4.85066 1.76307 4.85449 1.76169 4.85547C1.76143 4.85567 1.76139 4.85564 1.76072 4.85645C1.76009 4.85847 1.75972 4.86196 1.75876 4.86621C1.753 4.89215 1.7454 4.95263 1.75486 5.07325C1.77543 5.33499 1.8555 5.69609 1.99119 6.28614L2.38279 7.98536C2.78374 9.72829 4.01891 11.1355 5.64255 11.8379C4.82926 9.95662 4.23398 7.63883 3.92576 5.08106C3.91221 4.96865 3.89955 4.85794 3.88669 4.75H3.29783ZM18.0742 5.08106C17.766 7.63899 17.1698 9.95655 16.3564 11.8379C17.9805 11.1357 19.2162 9.72858 19.6172 7.98536L20.0088 6.28614C20.1444 5.69611 20.2245 5.33499 20.2451 5.07325C20.2545 4.95265 20.247 4.89217 20.2412 4.86621L20.2392 4.85645L20.2383 4.8545C20.2362 4.8531 20.2298 4.85012 20.2177 4.84473C20.1852 4.83024 20.1183 4.808 19.9892 4.79004C19.7136 4.75174 19.3252 4.75 18.7021 4.75H18.1133C18.1004 4.85794 18.0877 4.96865 18.0742 5.08106Z" fill="white"/>
                        </svg>
                      </span>
                      <span className="btn-text">View rewards</span>
                    </div>
                    <div className="rewards-btn-coins">
                      <img src="/coin.png" alt="Coin" className="coin-icon-btn" />
                      <span>71</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal mode with controls
  return (
    <div className="app-layout">
      {/* Left side - Control Panel */}
      <div className="controls-side">
        <img src="/logo_augmento_purple.svg" alt="Augmento" className="augmento-logo" />
        <ControlPanel currentTab={activeTab} />
      </div>

      {/* Center - Tab Navigation */}
      <div className="tab-navigation-vertical">
        <button
          className="tab-vertical ai-generate-btn"
          onClick={() => setShowAIPrompt(true)}
        >
          ✨ AI Generate
        </button>
        <button
          className={`tab-vertical ${activeTab === 'welcome' ? 'active' : ''}`}
          onClick={() => setActiveTab('welcome')}
        >
          Welcome
        </button>
        <button
          className={`tab-vertical ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz
        </button>
        <button
          className={`tab-vertical ${activeTab === 'collectible' ? 'active' : ''}`}
          onClick={() => setActiveTab('collectible')}
        >
          Collectible
        </button>
        <button
          className={`tab-vertical ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          Rewards
        </button>
      </div>

      {/* Right side - Phone Mockup */}
      <div className="mockup-side">

        <div className="phone-mockup">
          {/* Phone frame */}
          <div className="phone-frame">
            {/* Background */}
            <div className="phone-background">
              {/* Camera Feed Background */}
              <CameraFeed />
              {/* Tab Content */}
              {activeTab === 'welcome' && <Welcome onStart={() => setActiveTab('quiz')} />}
              {activeTab === 'quiz' && <Quiz quizData={quizData} />}
              {activeTab === 'collectible' && <Collectible />}
              {activeTab === 'rewards' && <Rewards rewardsData={rewardsData} />}

              {/* AI Prompt Modal */}
              {showAIPrompt && <AIPrompt onGenerate={handleAIGenerate} />}

              {/* AR 3D Model Area - Hide on rewards and welcome screens */}
              {activeTab !== 'rewards' && activeTab !== 'welcome' && (
                <div className="ar-model-area">
                  <SceneRoot />
                </div>
              )}

              {/* View Rewards Button - Only on rewards screen */}
              {activeTab === 'rewards' && (
                <div className="view-rewards-button">
                  <div className="view-rewards-btn">
                    <div className="rewards-btn-content">
                      <span className="trophy-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                          <path d="M13.8135 0.250004L14.4482 0.250981C15.0579 0.254875 15.5919 0.272069 16.039 0.344731C16.673 0.447813 17.2313 0.67717 17.664 1.20118H17.665C18.0829 1.70769 18.2264 2.27696 18.247 2.90723C18.2506 3.01704 18.2503 3.13129 18.247 3.25H18.7021C19.2798 3.25 19.7922 3.24869 20.1953 3.30469C20.5623 3.35571 20.952 3.4674 21.2646 3.76075L21.3935 3.89844L21.5058 4.05274C21.7382 4.41804 21.7702 4.82224 21.7412 5.19141C21.7098 5.59035 21.5955 6.07943 21.4707 6.62207L21.0791 8.32129C20.4402 11.0994 18.1658 13.1677 15.3945 13.6934C14.8046 14.6359 14.1145 15.4302 13.334 15.9727C14.3164 16.6216 15.0955 17.653 15.5781 18.8506C15.8396 19.4994 15.7862 20.1857 15.5302 20.7227C15.2832 21.241 14.7677 21.75 14.041 21.75H7.95896C7.2323 21.75 6.71678 21.241 6.4697 20.7227C6.21377 20.1857 6.16038 19.4994 6.42185 18.8506C6.9044 17.6533 7.68289 16.6216 8.66501 15.9727C7.88458 15.4301 7.19425 14.6358 6.60447 13.6934C3.8336 13.1674 1.55972 11.0991 0.920873 8.32129L0.530248 6.62207C0.405453 6.07941 0.290156 5.59037 0.258764 5.19141C0.225594 4.76945 0.271799 4.30155 0.60642 3.89844L0.735326 3.76075C1.04796 3.46738 1.43764 3.3557 1.80466 3.30469C2.20778 3.24869 2.72014 3.25 3.29783 3.25H3.7529C3.74966 3.13129 3.74932 3.01704 3.7529 2.90723C3.77354 2.27702 3.91715 1.70862 4.33494 1.20215C4.76778 0.67751 5.32658 0.447876 5.96091 0.344731C6.55709 0.247842 7.3076 0.250004 8.1865 0.250004H13.8135ZM11 16.75C9.73884 16.75 8.49696 17.7154 7.81345 19.4111C7.71576 19.6535 7.74009 19.9026 7.82322 20.0772C7.89319 20.224 7.95953 20.2472 7.96872 20.25H14.0312C14.0405 20.2472 14.1059 20.2237 14.1758 20.0772C14.259 19.9026 14.2842 19.6536 14.1865 19.4111C13.503 17.7154 12.2611 16.75 11 16.75ZM7.54685 1.75196C6.96326 1.75602 6.53822 1.7706 6.20212 1.8252C5.79216 1.89182 5.61841 2.00204 5.49119 2.15625C5.34901 2.32868 5.26558 2.53912 5.25193 2.95606C5.23713 3.4089 5.30645 4.00041 5.41501 4.90137C5.78946 8.00889 6.59521 10.6579 7.64158 12.5059C8.70922 14.3913 9.90479 15.25 11 15.25C12.0952 15.25 13.2907 14.3913 14.3584 12.5059C15.4047 10.6579 16.2105 8.00889 16.5849 4.90137C16.6935 4.0004 16.7628 3.40891 16.748 2.95606C16.7361 2.59077 16.6703 2.38414 16.5586 2.22266L16.5078 2.15625C16.3806 2.00217 16.2076 1.89179 15.7978 1.8252C15.4617 1.7706 15.0367 1.75602 14.4531 1.75196L13.8135 1.75H8.1865L7.54685 1.75196ZM3.29783 4.75C2.67475 4.75 2.28631 4.75174 2.01072 4.79004C1.88162 4.808 1.81471 4.83025 1.7822 4.84473C1.76892 4.85066 1.76307 4.85449 1.76169 4.85547C1.76143 4.85567 1.76139 4.85564 1.76072 4.85645C1.76009 4.85847 1.75972 4.86196 1.75876 4.86621C1.753 4.89215 1.7454 4.95263 1.75486 5.07325C1.77543 5.33499 1.8555 5.69609 1.99119 6.28614L2.38279 7.98536C2.78374 9.72829 4.01891 11.1355 5.64255 11.8379C4.82926 9.95662 4.23398 7.63883 3.92576 5.08106C3.91221 4.96865 3.89955 4.85794 3.88669 4.75H3.29783ZM18.0742 5.08106C17.766 7.63899 17.1698 9.95655 16.3564 11.8379C17.9805 11.1357 19.2162 9.72858 19.6172 7.98536L20.0088 6.28614C20.1444 5.69611 20.2245 5.33499 20.2451 5.07325C20.2545 4.95265 20.247 4.89217 20.2412 4.86621L20.2392 4.85645L20.2383 4.8545C20.2362 4.8531 20.2298 4.85012 20.2177 4.84473C20.1852 4.83024 20.1183 4.808 19.9892 4.79004C19.7136 4.75174 19.3252 4.75 18.7021 4.75H18.1133C18.1004 4.85794 18.0877 4.96865 18.0742 5.08106Z" fill="white"/>
                        </svg>
                      </span>
                      <span className="btn-text">View rewards</span>
                    </div>
                    <div className="rewards-btn-coins">
                      <img src="/coin.png" alt="Coin" className="coin-icon-btn" />
                      <span>71</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
