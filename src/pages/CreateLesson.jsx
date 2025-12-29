// src/pages/CreateLesson.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { courseService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function CreateLesson() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  const [error, setError] = useState('')

  // Fetch course details to show course name
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getCourseById(courseId),
  })

  const createLessonMutation = useMutation({
    mutationFn: (data) => courseService.createLesson(courseId, data),
    onSuccess: () => {
      navigate(`/courses/${courseId}`)
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create lesson')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (formData.title.length < 3 || formData.title.length > 256) {
      setError('Title must be between 3 and 256 characters')
      return
    }

    if (formData.content.length < 10 || formData.content.length > 65535) {
      setError('Content must be between 10 and 65535 characters')
      return
    }

    createLessonMutation.mutate(formData)
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center text-red-600">Please log in to create a lesson.</div>
      </div>
    )
  }

  if (courseLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading course...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create New Lesson</h1>
          {course && (
            <p className="text-gray-600">
              for course: <span className="font-semibold">{course.data.name}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Lesson Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter lesson title"
              required
              minLength={3}
              maxLength={256}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.title.length}/256 characters
            </p>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Lesson Content</label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows="20"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter lesson content (supports Markdown)"
              required
              minLength={10}
              maxLength={65535}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.content.length}/65535 characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createLessonMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createLessonMutation.isPending ? 'Creating...' : 'Create Lesson'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateLesson