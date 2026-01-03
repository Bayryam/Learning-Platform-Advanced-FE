// src/pages/QuizTake.jsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { quizService } from '../api/services'
import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'

function QuizTake() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})
  const [startTime] = useState(() => Date.now())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const { showToast } = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz', courseId],
    queryFn: () => quizService.getQuizForCourse(courseId),
  })

  const submitMutation = useMutation({
    mutationFn: (submission) => {
      const quizId = data?.data?.quizId
      return quizService.submitQuiz(courseId, quizId, submission)
    },
    onSuccess: () => {
      showToast('Quiz submitted successfully!', 'success')
      navigate(`/courses/${courseId}`)
    },
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer: answer
    }))

    const submission = {
      answers: answersArray,
      elapsedTime: timeElapsed
    }

    submitMutation.mutate(submission)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading quiz...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading quiz: {error.message}</div>
      </div>
    )
  }

  const questions = data?.data?.quizQuestions || []

  if (questions.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No quiz available for this course yet.</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quiz</h1>
          <div className="text-right">
            <div className="text-sm text-gray-600">Time Elapsed</div>
            <div className="text-2xl font-mono font-bold text-blue-600">
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <span className="text-sm font-semibold text-gray-500">
                    Question {index + 1} of {questions.length}
                  </span>
                  <h3 className="text-xl font-semibold mt-2">{question.questionTitle}</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { value: question.option1, label: 'A' },
                    { value: question.option2, label: 'B' },
                    { value: question.option3, label: 'C' },
                    { value: question.option4, label: 'D' }
                  ].map((option) => (
                    <label
                      key={option.label}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        answers[question.id] === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="mr-3 w-5 h-5"
                      />
                      <span className="font-semibold mr-2">{option.label}.</span>
                      <span>{option.value}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Answered: {Object.keys(answers).length} / {questions.length}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Object.keys(answers).length !== questions.length || submitMutation.isPending}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuizTake