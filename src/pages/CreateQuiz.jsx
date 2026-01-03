import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { quizService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function CreateQuiz() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    numberOfQuestions: '',
  })
  const [error, setError] = useState('')

  const createQuizMutation = useMutation({
    mutationFn: (data) => quizService.createQuiz(data),
    onSuccess: () => {
      navigate(`/courses/${courseId}`)
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create quiz')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Please enter a quiz title')
      return
    }

    if (!formData.numberOfQuestions || formData.numberOfQuestions < 1) {
      setError('Please enter a valid number of questions')
      return
    }

    createQuizMutation.mutate({
      courseId: parseInt(courseId),
      title: formData.title,
      numberOfQuestions: parseInt(formData.numberOfQuestions),
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
        <div className="text-center text-red-600">Please log in to create a quiz.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create a Quiz</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
              Title:
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

          <div className="mb-6">
            <label htmlFor="numberOfQuestions" className="block text-gray-700 font-semibold mb-2">
              Number of Questions:
            </label>
            <input
              id="numberOfQuestions"
              type="number"
              name="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of questions"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createQuizMutation.isPending}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {createQuizMutation.isPending ? 'Creating...' : 'Create Quiz'}
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

