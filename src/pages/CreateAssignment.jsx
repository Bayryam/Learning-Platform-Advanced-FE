// src/pages/CreateAssignment.jsx
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { assignmentService, courseService } from '../api/services'

function CreateAssignment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const courseIdParam = searchParams.get('courseId')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    courseId: courseIdParam || '',
  })
  const [error, setError] = useState('')

  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAllCourses,
  })

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
        courseId: parseInt(data.courseId)
      }
      return assignmentService.createAssignment(payload)
    },
    onSuccess: () => {
      navigate('/assignments')
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create assignment')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.courseId) {
      setError('Please select a course')
      return
    }

    createMutation.mutate(formData)
  }

  // Get all courses from all categories and deduplicate by ID
  const allCourses = coursesData?.data
    ? Array.from(
        new Map(
          Object.values(coursesData.data)
            .flat()
            .map(course => [course.id, course])
        ).values()
      )
    : []

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Create New Assignment</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Assignment Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter assignment description"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Course</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              required
            >
              <option value="">Select a course</option>
              {allCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Due Date</label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Assignment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/assignments')}
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

export default CreateAssignment