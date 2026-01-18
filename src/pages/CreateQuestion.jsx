import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { questionService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

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
    correctAnswer: '1',
    difficulty: 'Medium',
  })
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const createQuestionMutation = useMutation({
    mutationFn: (data) => questionService.createQuestion(data),
    onSuccess: () => {
      showToast('Question created successfully!', 'success')
      navigate(`/courses/${courseId}`)
    },
    onError: (err) => {
      showToast(err.response?.data?.error || 'Failed to create question', 'error')
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


    const correctAnswerText = formData[`option${formData.correctAnswer}`]

    createQuestionMutation.mutate({
      courseId: parseInt(courseId),
      questionTitle: formData.questionTitle,
      option1: formData.option1,
      option2: formData.option2,
      option3: formData.option3,
      option4: formData.option4,
      correctAnswer: correctAnswerText,
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

  const handleCorrectAnswerChange = (optionNumber) => {
    setFormData({
      ...formData,
      correctAnswer: optionNumber,
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
              Question:
            </label>
            <textarea
              id="questionTitle"
              name="questionTitle"
              value={formData.questionTitle}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your question"
            />
          </div>

          <div className="mb-6 space-y-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Options (select the correct answer):
            </label>

            {/* Option 1 */}
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                id="correct1"
                name="correctAnswer"
                checked={formData.correctAnswer === '1'}
                onChange={() => handleCorrectAnswerChange('1')}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="option1" className="flex-1">
                <span className="font-semibold text-gray-600 mr-2">A.</span>
                <input
                  id="option1"
                  type="text"
                  name="option1"
                  value={formData.option1}
                  onChange={handleChange}
                  required
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mt-1"
                  placeholder="Enter option A"
                />
              </label>
            </div>

            {/* Option 2 */}
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                id="correct2"
                name="correctAnswer"
                checked={formData.correctAnswer === '2'}
                onChange={() => handleCorrectAnswerChange('2')}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="option2" className="flex-1">
                <span className="font-semibold text-gray-600 mr-2">B.</span>
                <input
                  id="option2"
                  type="text"
                  name="option2"
                  value={formData.option2}
                  onChange={handleChange}
                  required
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mt-1"
                  placeholder="Enter option B"
                />
              </label>
            </div>

            {/* Option 3 */}
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                id="correct3"
                name="correctAnswer"
                checked={formData.correctAnswer === '3'}
                onChange={() => handleCorrectAnswerChange('3')}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="option3" className="flex-1">
                <span className="font-semibold text-gray-600 mr-2">C.</span>
                <input
                  id="option3"
                  type="text"
                  name="option3"
                  value={formData.option3}
                  onChange={handleChange}
                  required
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mt-1"
                  placeholder="Enter option C"
                />
              </label>
            </div>

            {/* Option 4 */}
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                id="correct4"
                name="correctAnswer"
                checked={formData.correctAnswer === '4'}
                onChange={() => handleCorrectAnswerChange('4')}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="option4" className="flex-1">
                <span className="font-semibold text-gray-600 mr-2">D.</span>
                <input
                  id="option4"
                  type="text"
                  name="option4"
                  value={formData.option4}
                  onChange={handleChange}
                  required
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mt-1"
                  placeholder="Enter option D"
                />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="difficulty" className="block text-gray-700 font-semibold mb-2">
              Difficulty:
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
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