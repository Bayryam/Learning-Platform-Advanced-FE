import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { announcementService } from '../api/services'
import { useToast } from '../context/ToastContext'

function CreateAnnouncement() {
  const navigate = useNavigate()
  const { showToast } = useToast()


  const [formData, setFormData] = useState({
    title: '',
    content: '',
    expiresAt: ''
  })

  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: (data) => announcementService.createAnnouncement(data),
    onSuccess: () => {
      showToast('Announcement created successfully!', 'success')
      navigate('/admin')
    },
    onError: (err) => {
      showToast(err.response?.data?.error || 'Failed to create announcement', 'error')
    },
  })


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')



    createMutation.mutate(formData)
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

            {/* 2. Поле за TITLE (Задължително според DTO) */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Title</label>
              <input
                  type="text"
                  name="title"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Important Update"
                  required
              />
            </div>

            {/* Поле за CONTENT (Съвпада с 'content' в DTO) */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Announcement Message</label>
              <textarea
                  name="content"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Enter announcement message"
                  required
              />
            </div>

            {/* 3. Поле за EXPIRES AT (Задължително според DTO) */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Expires At</label>
              <input
                  type="datetime-local"
                  name="expiresAt"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  required
              />
              <p className="text-sm text-gray-500 mt-1">
                When should this announcement stop showing?
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