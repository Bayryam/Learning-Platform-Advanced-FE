// src/pages/CreateEvent.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { eventService, userService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function CreateEvent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    instructor: '',
  })
  const [error, setError] = useState('')

  const { data: instructors, isLoading: loadingInstructors } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await userService.getInstructors()
      return response.data
    },
  })

  useEffect(() => {
    if (user && instructors && instructors.length > 0 && !formData.instructor) {
      const currentUserIsInstructor = instructors.some(
        instructor => instructor.username === user.username
      )
      if (currentUserIsInstructor) {
        setFormData(prev => ({ ...prev, instructor: user.username }))
      }
    }
  }, [user, instructors, formData.instructor])

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      }
      return eventService.createEvent(payload)
    },
    onSuccess: () => {
      navigate('/events')
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create event')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      setError('End time must be after start time')
      return
    }

    createMutation.mutate(formData)
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block font-semibold mb-2">Event Title</label>
            <input
              id="title"
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block font-semibold mb-2">Description</label>
            <textarea
              id="description"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter event description"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="instructor" className="block font-semibold mb-2">Instructor</label>
            <select
              id="instructor"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.instructor}
              onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              required
              disabled={loadingInstructors}
            >
              <option value="">Select an instructor</option>
              {instructors?.map((instructor) => (
                <option key={instructor.id} value={instructor.username}>
                  {instructor.firstName} {instructor.lastName} (@{instructor.username})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="startTime" className="block font-semibold mb-2">Start Time</label>
            <input
              id="startTime"
              type="datetime-local"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="endTime" className="block font-semibold mb-2">End Time</label>
            <input
              id="endTime"
              type="datetime-local"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
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

export default CreateEvent