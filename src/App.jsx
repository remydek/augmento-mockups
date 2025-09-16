import React, { useEffect } from 'react'
import SceneRoot from './components/Scene/SceneRoot'
import useSceneStore from './store/useSceneStore'
import './App.css'

function App() {
  const addModel = useSceneStore((state) => state.addModel)
  
  // Add default model on app load
  useEffect(() => {
    const defaultModel = {
      id: 'default-model',
      name: 'DamagedHelmet.glb',
      url: '/models/DamagedHelmet.glb',
      position: [0, -0.5, -1.5],
      rotation: [0, Math.PI * 0.25, 0],
      scale: 0.8
    }
    addModel(defaultModel)
  }, [addModel])
  
  return (
    <div className="phone-mockup">
      {/* Phone frame */}
      <div className="phone-frame">
        {/* Background */}
        <div className="phone-background">
          {/* Quiz interface overlay */}
          <div className="quiz-overlay">
            <div className="quiz-modal">
              <div className="quiz-header">
                <div className="quiz-title">Quiz</div>
                <div className="quiz-points">+45</div>
                <div className="coin-icon">🪙</div>
              </div>
              <div className="quiz-progress">
                <div className="progress-text">Question 1 of 5</div>
                <div className="time-left">19s left</div>
              </div>
              <div className="progress-bars">
                <div className="progress-bar active"></div>
                <div className="progress-bar"></div>
              </div>
              <div className="question-text">
                Who was one of the headliners in the 2024 edition of Worlds Away
              </div>
              <div className="answer-options">
                <div className="answer-option">The Weekend & Post Malone</div>
                <div className="answer-option selected">
                  The Swedish House Mafia
                  <div className="answer-badge">My answer ✓</div>
                </div>
                <div className="answer-option">Tiësto</div>
                <div className="answer-submit">Submit</div>
              </div>
            </div>
          </div>
          
          {/* AR 3D Model Area */}
          <div className="ar-model-area">
            <SceneRoot />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
