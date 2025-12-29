// src/pages/CreateAnnouncement.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { announcementService } from '../api/services'

function CreateAnnouncement() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: (data) => announcementService.createAnnouncement(data),
    onSuccess: () => {
      navigate('/admin')
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create announcement')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    createMutation.mutate({ message })
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Create Announcement</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Announcement Message</label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter announcement message"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be displayed as a banner across the platform.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Announcement'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
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

export default CreateAnnouncement