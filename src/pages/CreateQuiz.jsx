import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { quizService, questionService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function CreateQuiz() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
  })
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [error, setError] = useState('')
  const { showToast } = useToast()


  const { data: questionsData, isLoading: loadingQuestions } = useQuery({
    queryKey: ['questions', courseId],
    queryFn: () => questionService.getQuestions(courseId),
  })

  const createQuizMutation = useMutation({
    mutationFn: (data) => quizService.createQuiz(data),
    onSuccess: () => {
      showToast('Quiz created successfully!', 'success')
      navigate(`/courses/${courseId}`)
    },
    onError: (err) => {
      showToast(err.response?.data?.error || 'Failed to create quiz', 'error')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Please enter a quiz title')
      return
    }

    if (selectedQuestions.length === 0) {
      setError('Please select at least one question')
      return
    }

    createQuizMutation.mutate({
      courseId: parseInt(courseId),
      title: formData.title,
      numberOfQuestions: selectedQuestions.length,
      selectedQuestionIds: selectedQuestions,
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const toggleQuestion = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const selectAll = () => {
    const allQuestionIds = questions.map(q => q.id)
    setSelectedQuestions(allQuestionIds)
  }

  const deselectAll = () => {
    setSelectedQuestions([])
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center text-red-600">Please log in to create a quiz.</div>
      </div>
    )
  }

  const questions = questionsData?.data || []

  if (loadingQuestions) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading questions...</div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800">No Questions Available</h2>
          <p className="text-yellow-700 mb-4">
            You need to create questions before you can create a quiz.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/courses/${courseId}/questions/create`)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Create Questions
            </button>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create a Quiz</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Title */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
              Quiz Title:
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
            />
          </div>

          {/* Question Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Select Questions ({selectedQuestions.length} selected)
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
                >
                  Deselect All
                </button>
              </div>
            </div>

<div className="space-y-3 max-h-96 overflow-y-auto">
  {questions.map((question, index) => (
    <div
      key={question.id}
      className={`border rounded-lg p-4 transition-all ${
        selectedQuestions.includes(question.id)
          ? 'bg-blue-50 border-blue-500'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selectedQuestions.includes(question.id)}
          onChange={() => toggleQuestion(question.id)}
          className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <div 
          className="flex-1 cursor-pointer" 
          onClick={() => toggleQuestion(question.id)}
        >
          <h3 className="font-semibold text-gray-800 mb-2">
            {index + 1}. {question.questionTitle}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>A. {question.option1}</div>
            <div>B. {question.option2}</div>
            <div>C. {question.option3}</div>
            <div>D. {question.option4}</div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              ✓ {question.correctAnswer}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {question.difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createQuizMutation.isPending || selectedQuestions.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {createQuizMutation.isPending ? 'Creating...' : `Create Quiz (${selectedQuestions.length} questions)`}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuiz