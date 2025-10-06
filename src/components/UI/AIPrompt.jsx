import React, { useState } from 'react'

export default function AIPrompt({ onGenerate }) {
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    try {
      await onGenerate(topic)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="ai-prompt-overlay">
      <div className="ai-prompt-modal">
        <div className="ai-prompt-header">
          <div className="ai-prompt-title">AI Quiz Generator</div>
        </div>

        <div className="ai-prompt-content">
          <label className="ai-prompt-label">Enter a topic for your quiz:</label>
          <input
            type="text"
            className="ai-prompt-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Space Exploration, World History, Technology..."
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isGenerating) {
                handleGenerate()
              }
            }}
          />

          <button
            className="ai-prompt-generate-btn"
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Quiz & Rewards'}
          </button>
        </div>
      </div>
    </div>
  )
}
