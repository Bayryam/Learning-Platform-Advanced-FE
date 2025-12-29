// src/pages/CreateNews.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { newsService } from '../api/services'

function CreateNews() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: (data) => newsService.createNews(data),
    onSuccess: () => {
      navigate('/news')
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create news')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(formData)
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Create News Article</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="News title"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Content</label>
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="10"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="News content"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createMutation.isPending ? 'Publishing...' : 'Publish News'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/news')}
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

export default CreateNews