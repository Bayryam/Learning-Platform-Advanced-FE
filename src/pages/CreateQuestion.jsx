import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { questionService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function CreateQuestion() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    questionTitle: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
    difficulty: '',
  })
  const [error, setError] = useState('')

  const createQuestionMutation = useMutation({
    mutationFn: (data) => questionService.createQuestion(data),
    onSuccess: () => {
      navigate(`/courses/${courseId}`)
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create question')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.questionTitle.trim()) {
      setError('Please enter a question title')
      return
    }

    if (!formData.option1.trim() || !formData.option2.trim() || !formData.option3.trim() || !formData.option4.trim()) {
      setError('Please enter all 4 options')
      return
    }

    if (!formData.correctAnswer.trim()) {
      setError('Please enter the correct answer')
      return
    }

    if (!formData.difficulty.trim()) {
      setError('Please enter the difficulty level')
      return
    }

    createQuestionMutation.mutate({
      courseId: parseInt(courseId),
      questionTitle: formData.questionTitle,
      option1: formData.option1,
      option2: formData.option2,
      option3: formData.option3,
      option4: formData.option4,
      correctAnswer: formData.correctAnswer,
      difficulty: formData.difficulty,
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center text-red-600">Please log in to create a question.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create a Question</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label htmlFor="questionTitle" className="block text-gray-700 font-semibold mb-2">
              Title:
            </label>
            <input
              id="questionTitle"
              type="text"
              name="questionTitle"
              value={formData.questionTitle}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter question title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="option1" className="block text-gray-700 font-semibold mb-2">
              Option 1:
            </label>
            <input
              id="option1"
              type="text"
              name="option1"
              value={formData.option1}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter option 1"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="option2" className="block text-gray-700 font-semibold mb-2">
              Option 2:
            </label>
            <input
              id="option2"
              type="text"
              name="option2"
              value={formData.option2}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter option 2"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="option3" className="block text-gray-700 font-semibold mb-2">
              Option 3:
            </label>
            <input
              id="option3"
              type="text"
              name="option3"
              value={formData.option3}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter option 3"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="option4" className="block text-gray-700 font-semibold mb-2">
              Option 4:
            </label>
            <input
              id="option4"
              type="text"
              name="option4"
              value={formData.option4}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter option 4"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="correctAnswer" className="block text-gray-700 font-semibold mb-2">
              Correct Answer:
            </label>
            <input
              id="correctAnswer"
              type="text"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the correct answer"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="difficulty" className="block text-gray-700 font-semibold mb-2">
              Difficulty:
            </label>
            <input
              id="difficulty"
              type="text"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter difficulty level (e.g., Easy, Medium, Hard)"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createQuestionMutation.isPending}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {createQuestionMutation.isPending ? 'Creating...' : 'Create Question'}
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

export default CreateQuestion

