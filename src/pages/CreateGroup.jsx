import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { groupService, userService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'


function CreateGroups() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageFile: null,
    imagePreview: null,
  })
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const createGroupMutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description || '')
      formData.append('image', data.imageFile)

      if (data.members && data.members.length > 0) {
        data.members.forEach((member) => {
          formData.append('members', member)
        })
      }

      return groupService.createGroup(formData)
    },
    onSuccess: () => {
      setToast({ message: 'Group created successfully!', type: 'success' })
      setTimeout(() => navigate('/groups'), 1500)
    },
    onError: (err) => {
      let errorMsg = 'Failed to create group'

      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'string') {
          errorMsg = data
        } else if (data.error) {
          errorMsg = data.error
        } else if (data.message) {
          errorMsg = data.message
        } else if (data.errorMessage) {
          errorMsg = data.errorMessage
        }
      } else if (err.message) {
        errorMsg = err.message
      }

      setError(errorMsg)
      setToast({ message: errorMsg, type: 'error' })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Group name is required')
      return
    }

    if (!formData.imageFile) {
      setError('Group image is required')
      return
    }

    const memberUsernames = members
      .map(m => m.username)
      .filter(username => username && username.trim())

    createGroupMutation.mutate({
      ...formData,
      members: memberUsernames,
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const addMember = () => {
    setMembers(prev => [...prev, { id: Date.now(), username: '', searchQuery: '', suggestions: [] }])
  }

  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const updateMemberSearch = async (id, searchQuery) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, searchQuery } : m))
    )

    if (searchQuery.trim().length === 0) {
      setMembers(prev =>
        prev.map(m => (m.id === id ? { ...m, suggestions: [] } : m))
      )
      return
    }

    try {
      const response = await userService.searchUsers(searchQuery, user?.username || '')
      const suggestions = Array.isArray(response.data) ? response.data : []

      setMembers(prev =>
        prev.map(m => (m.id === id ? { ...m, suggestions } : m))
      )
    } catch {
      setMembers(prev =>
        prev.map(m => (m.id === id ? { ...m, suggestions: [] } : m))
      )
    }
  }

  const selectMember = (id, username) => {
    setMembers(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, username, searchQuery: username, suggestions: [] }
          : m
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 border-2 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Group</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
              Group Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="groupName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter group name"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Group Description */}
          <div>
            <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Group Description:
            </label>
            <textarea
              id="groupDescription"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter group description"
              rows="4"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Group Image */}
          <div>
            <label htmlFor="groupImage" className="block text-sm font-medium text-gray-700 mb-2">
              Group Image: <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="groupImage"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
            {formData.imagePreview && (
              <div className="mt-3">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border-2 border-blue-300 shadow-md"
                />
              </div>
            )}
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Members:</label>
            <div className="space-y-3 mb-3">
              {members.map((member) => (
                <div key={member.id} className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={member.searchQuery}
                        onChange={(e) => updateMemberSearch(member.id, e.target.value)}
                        placeholder="Search for username"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {member.suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {member.suggestions.map((username, idx) => (
                            <li
                              key={idx}
                              onClick={() => selectMember(member.id, username)}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {username}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMember}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              ➕ Add Member
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-md">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createGroupMutation.isPending}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateGroups

