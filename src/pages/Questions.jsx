import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { questionService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'

function Questions() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['questions', courseId],
    queryFn: () => questionService.getQuestions(courseId),
  })

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId) => questionService.deleteQuestion(questionId),
    onSuccess: () => {
      showToast('Question deleted successfully!', 'success')
      queryClient.invalidateQueries(['questions', courseId])
    },
    onError: (err) => {
      showToast(err.response?.data?.error || 'Failed to delete question', 'error')
    },
  })

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center text-red-600">Please log in to manage questions.</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading questions...</div>
      </div>
    )
  }

  const questions = data?.data || []

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Questions</h1>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Course
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">No questions available yet.</p>
            <button
              onClick={() => navigate(`/courses/${courseId}/questions/create`)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Create First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      Question {index + 1}: {question.questionTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Difficulty: <span className="font-medium">{question.difficulty}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteQuestionMutation.mutate(question.id)}
                    disabled={deleteQuestionMutation.isPending}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="pl-4">
                    <p className="text-gray-700">
                      <span className="font-medium">A:</span> {question.option1}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">B:</span> {question.option2}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">C:</span> {question.option3}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">D:</span> {question.option4}
                    </p>
                  </div>
                  <p className="text-green-600 font-medium mt-3">
                    Correct Answer: {question.correctAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Questions

