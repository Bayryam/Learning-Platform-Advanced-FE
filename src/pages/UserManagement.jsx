import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService, userService } from '../api/services'
import { useState } from 'react'

function UserManagement() {
  const queryClient = useQueryClient()
  const [editingUser, setEditingUser] = useState(null)

  const { data: users, isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: adminService.getAllUsers,
  })

  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers'])
      alert('User deleted successfully')
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => userService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers'])
      setEditingUser(null)
      alert('Role updated successfully')
    },
  })

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.data?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingUser?.id === user.id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Student">Student</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded ${
                      user.roles?.includes('ROLE_ADMIN') ? 'bg-red-100 text-red-800' :
                      user.roles?.includes('ROLE_INSTRUCTOR') ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.roles?.includes('ROLE_ADMIN') ? 'Admin' :
                       user.roles?.includes('ROLE_INSTRUCTOR') ? 'Instructor' : 'Student'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {editingUser?.id === user.id ? (
                    <>
                      <button
                        onClick={() => updateRoleMutation.mutate({ userId: user.id, role: editingUser.role })}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUser({ 
                          id: user.id, 
                          role: user.roles?.includes('ROLE_ADMIN') ? 'Admin' :
                                user.roles?.includes('ROLE_INSTRUCTOR') ? 'Instructor' : 'Student'
                        })}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            deleteUserMutation.mutate(user.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement