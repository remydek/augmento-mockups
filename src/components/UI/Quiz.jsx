import React, { useState, useEffect, useRef } from 'react'

export default function Quiz({ quizData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isEditingQuestion, setIsEditingQuestion] = useState(false)
  const [isEditingAnswers, setIsEditingAnswers] = useState([false, false, false])
  const [timeLeft, setTimeLeft] = useState(20)
  const timerRef = useRef(null)

  // Define 3 questions
  const [questions, setQuestions] = useState([
    {
      question: 'Who was one of the headliners in the 2024 edition of Worlds Away',
      answers: [
        'The Weekend & Post Malone',
        'The Swedish House Mafia',
        'Tiësto'
      ],
      selectedAnswer: null
    },
    {
      question: 'What year was the first Worlds Away festival held?',
      answers: [
        '2019',
        '2020',
        '2021'
      ],
      selectedAnswer: null
    },
    {
      question: 'Which city hosts the Worlds Away festival?',
      answers: [
        'Amsterdam',
        'Miami',
        'Las Vegas'
      ],
      selectedAnswer: null
    }
  ])

  // Current question data for easy access
  const questionText = questions[currentQuestion].question
  const answers = questions[currentQuestion].answers
  const selectedAnswer = questions[currentQuestion].selectedAnswer

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto advance to next question when time runs out
          setCurrentQuestion((curr) => {
            if (curr < questions.length - 1) {
              return curr + 1
            }
            return curr
          })
          return 20
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [questions.length])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(20)
  }, [currentQuestion])

  // Update quiz content when AI generates new data
  useEffect(() => {
    if (quizData) {
      // Check if quizData has a questions array (new format)
      if (Array.isArray(quizData.questions) && quizData.questions.length > 0) {
        const newQuestions = quizData.questions.map(q => ({
          question: q.question,
          answers: q.answers,
          selectedAnswer: null,
          correctAnswerIndex: q.correctAnswerIndex
        }))
        setQuestions(newQuestions)
      } else {
        // Fallback for old format (single question)
        const newQuestions = [...questions]
        newQuestions[0] = {
          question: quizData.question,
          answers: quizData.answers,
          selectedAnswer: null
        }
        setQuestions(newQuestions)
      }
      setCurrentQuestion(0)
      setTimeLeft(20)
    }
  }, [quizData])

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleAnswerEdit = (index, value) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestion].answers[index] = value
    setQuestions(newQuestions)
  }

  const toggleAnswerEdit = (index) => {
    const newEditStates = [...isEditingAnswers]
    newEditStates[index] = !newEditStates[index]
    setIsEditingAnswers(newEditStates)
  }

  const handleQuestionEdit = (value) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestion].question = value
    setQuestions(newQuestions)
  }

  const handleAnswerClick = (index) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestion].selectedAnswer = index
    setQuestions(newQuestions)
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
          <div className="progress-text">Question {currentQuestion + 1} of {questions.length}</div>
          <div className="time-left">{timeLeft}s left</div>
        </div>
        <div className="progress-bars">
          {questions.map((_, index) => (
            <div key={index} className={`progress-bar ${index === currentQuestion ? 'active' : ''}`}></div>
          ))}
        </div>

        {/* Timer bar */}
        <div className="timer-bar-container">
          <div
            className="timer-bar-progress"
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          ></div>
        </div>

        <div className="question-container">
          {isEditingQuestion ? (
            <textarea
              className="question-edit"
              value={questionText}
              onChange={(e) => handleQuestionEdit(e.target.value)}
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
            <div
              key={index}
              className={`answer-option ${selectedAnswer === index ? 'selected' : ''}`}
              style={{ cursor: isEditingAnswers[index] ? 'default' : 'pointer' }}
            >
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
                  <span onClick={() => handleAnswerClick(index)}>
                    {answer}
                  </span>
                  <button
                    className="edit-icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleAnswerEdit(index)
                    }}
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
          <div className="answer-submit" onClick={handleNextQuestion}>
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit'}
          </div>
        </div>
        <div className="quiz-pointer"></div>
      </div>
    </div>
  )
}