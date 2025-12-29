import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { courseService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function CreateCourse() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [],
    imageFile: null,
    imagePreview: null,
  })
  const [categoryInput, setCategoryInput] = useState('')
  const [error, setError] = useState('')

  const createCourseMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      data.categories.forEach(cat => formData.append('categories', cat))
      
      if (data.imageFile) {
        formData.append('image', data.imageFile)
      }
      
      return courseService.createCourse(formData)
    },
    onSuccess: (response) => {
      navigate('/courses')
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create course')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (formData.categories.length === 0) {
      setError('Please add at least one category')
      return
    }

    createCourseMutation.mutate(formData)
  }

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      })
      setCategoryInput('')
    }
  }

  const removeCategory = (cat) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== cat)
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center text-red-600">Please log in to create a course.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Course Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Categories</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                placeholder="Enter category and press Enter"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map(cat => (
                <span key={cat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.imagePreview && (
              <div className="mt-2">
                <img src={formData.imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createCourseMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/courses')}
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

export default CreateCourse