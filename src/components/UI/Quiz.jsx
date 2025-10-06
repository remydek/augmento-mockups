import React, { useState, useEffect } from 'react'

export default function Quiz({ quizData }) {
  const [isEditingQuestion, setIsEditingQuestion] = useState(false)
  const [isEditingAnswers, setIsEditingAnswers] = useState([false, false, false])

  const [questionText, setQuestionText] = useState('Who was one of the headliners in the 2024 edition of Worlds Away')
  const [answers, setAnswers] = useState([
    'The Weekend & Post Malone',
    'The Swedish House Mafia',
    'Tiësto'
  ])
  const [selectedAnswer, setSelectedAnswer] = useState(1)

  // Update quiz content when AI generates new data
  useEffect(() => {
    if (quizData) {
      setQuestionText(quizData.question)
      setAnswers(quizData.answers)
      setSelectedAnswer(0) // Reset to first answer
    }
  }, [quizData])

  const handleAnswerEdit = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const toggleAnswerEdit = (index) => {
    const newEditStates = [...isEditingAnswers]
    newEditStates[index] = !newEditStates[index]
    setIsEditingAnswers(newEditStates)
  }

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        <div className="quiz-header">
          <div className="quiz-title">Quiz</div>
          <div className="quiz-points-container">
            <img src="/coin.png" alt="Coin" className="coin-icon" />
            <div className="quiz-points">+45</div>
          </div>
        </div>
        <div className="quiz-progress">
          <div className="progress-text">Question 1 of 5</div>
          <div className="time-left">19s left</div>
        </div>
        <div className="progress-bars">
          <div className="progress-bar active"></div>
          <div className="progress-bar"></div>
        </div>

        <div className="question-container">
          {isEditingQuestion ? (
            <textarea
              className="question-edit"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              onBlur={() => setIsEditingQuestion(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  setIsEditingQuestion(false)
                }
              }}
              autoFocus
            />
          ) : (
            <div className="question-text">
              {questionText}
              <button
                className="edit-icon"
                onClick={() => setIsEditingQuestion(true)}
                title="Edit question"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        <div className="answer-options">
          {answers.map((answer, index) => (
            <div key={index} className={`answer-option ${selectedAnswer === index ? 'selected' : ''}`}>
              {isEditingAnswers[index] ? (
                <input
                  className="answer-edit"
                  value={answer}
                  onChange={(e) => handleAnswerEdit(index, e.target.value)}
                  onBlur={() => toggleAnswerEdit(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      toggleAnswerEdit(index)
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span onClick={() => setSelectedAnswer(index)}>
                    {answer}
                  </span>
                  <button
                    className="edit-icon"
                    onClick={() => toggleAnswerEdit(index)}
                    title="Edit answer"
                  >
                    ✏️
                  </button>
                </>
              )}
              {selectedAnswer === index && (
                <div className="answer-badge">My answer ✓</div>
              )}
            </div>
          ))}
          <div className="answer-submit">Submit</div>
        </div>
        <div className="quiz-pointer"></div>
      </div>
    </div>
  )
}