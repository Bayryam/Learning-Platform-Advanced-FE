// src/pages/CreateTicket.jsx
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ticketService } from '../api/services'
import { useToast } from '../context/ToastContext'

function CreateTicket() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
  })
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const createMutation = useMutation({
    mutationFn: (data) => ticketService.createTicket(courseId, data),
    onSuccess: () => {
      showToast('Ticket created successfully!', 'success')
      navigate('/tickets')
    },
    onError: (err) => {
      showToast(err.response?.data?.error || 'Failed to create ticket', 'error')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!courseId) {
      setError('Course ID is required')
      return
    }

    createMutation.mutate(formData)
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Open Support Ticket</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Subject</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of your issue"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tickets')}
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

export default CreateTicket