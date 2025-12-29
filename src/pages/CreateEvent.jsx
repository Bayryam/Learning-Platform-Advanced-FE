// src/pages/CreateEvent.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { eventService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function CreateEvent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    instructor: user?.username || '',
  })
  const [error, setError] = useState('')

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
            <label className="block font-semibold mb-2">Event Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter event title"
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
              placeholder="Enter event description"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Instructor</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.instructor}
              onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              placeholder="Instructor name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Start Time</label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">End Time</label>
            <input
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