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
    onSuccess: () => {
      queryClient.invalidateQueries(['groups'])
    },
  })

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

  const groups = data?.data || []

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Study Groups</h1>
        {user && (
          <button
            onClick={() => navigate('/groups/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create Group
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No groups available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div key={group.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{group.memberCount || 0} members</span>
                <button
                  onClick={() => joinMutation.mutate(group.id)}
                  disabled={joinMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {joinMutation.isPending ? 'Joining...' : 'Join Group'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Groups