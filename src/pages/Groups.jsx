// src/pages/Groups.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupService } from '../api/services'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Groups() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: groupService.getAllGroups,
  })

  const joinMutation = useMutation({
    mutationFn: (groupId) => groupService.joinGroup(groupId),
    onSuccess: (data, groupId) => {
      queryClient.invalidateQueries(['groups'])
      navigate(`/groups/${groupId}`)
    },
    onError: (error) => {
      alert('Failed to join group: ' + (error.response?.data?.message || error.message))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (groupId) => groupService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries(['groups'])
    },
    onError: (error) => {
      alert('Failed to delete group: ' + (error.response?.data?.message || error.message))
    },
  })

  const handleDeleteGroup = (groupId, groupName, e) => {
    e.stopPropagation()
    if (globalThis.confirm(`Are you sure you want to delete the group "${groupName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(groupId)
    }
  }

  const isAdmin = user?.roles?.some(role => {
    if (typeof role === 'string') {
      return role === 'ADMIN' || role === 'ROLE_ADMIN'
    }
    return role?.authority === 'ADMIN' || role?.authority === 'ROLE_ADMIN'
  }) || false

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading groups...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading groups: {error.message}</div>
      </div>
    )
  }

  let groups = []

  if (Array.isArray(data)) {
    groups = data
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.data)) {
      groups = data.data
    } else if (data.groups && Array.isArray(data.groups)) {
      groups = data.groups
    }
  }


  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">📚 Study Groups</h1>
        {user && (
          <button
            onClick={() => navigate('/groups/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            ➕ Create Group
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-lg shadow-lg text-center border-2 border-gray-200">
          <p className="text-gray-500 text-lg">No groups available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => {
            const isMember = group.members?.some(member => member.username === user?.username) || false

            return (
              <div
                key={group.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden relative border border-gray-200"
              >
                {/* Admin Delete Button */}
                {isAdmin && (
                  <button
                    onClick={(e) => handleDeleteGroup(group.id, group.name, e)}
                    disabled={deleteMutation.isPending}
                    className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:bg-gray-400 shadow-lg hover:shadow-xl text-xl font-bold"
                    title="Delete Group (Admin)"
                  >
                    ×
                  </button>
                )}
                {group.image?.image && (
                  <img
                    src={`data:image/png;base64,${group.image.image}`}
                    alt={group.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{group.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                      👥 {group.members?.length || 0} members
                    </span>
                    {isMember ? (
                      <button
                        onClick={() => navigate(`/groups/${group.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
                      >
                        View Group
                      </button>
                    ) : (
                      <button
                        onClick={() => joinMutation.mutate(group.id)}
                        disabled={joinMutation.isPending}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all shadow-md hover:shadow-lg font-medium"
                      >
                        {joinMutation.isPending ? 'Joining...' : 'Join Group'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Groups