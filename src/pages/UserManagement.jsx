import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService, userService } from '../api/services'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'

function UserManagement() {
  const queryClient = useQueryClient()


  const [editingUser, setEditingUser] = useState(null)
  const { showToast } = useToast()


  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '', password: '', firstName: '', lastName: '', email: '', role: 'STUDENT'
  })
  const [modalError, setModalError] = useState(null)


  const [userToDelete, setUserToDelete] = useState(null)


  const [notification, setNotification] = useState(null)


  const { data: response, isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: adminService.getAllUsers,
  })


  let userList = [];
  if (response?.data) {
    if (Array.isArray(response.data)) userList = response.data;
    else if (typeof response.data === 'string') {
      try { userList = JSON.parse(response.data); } catch (e) {}
    } else if (response.data.content) userList = response.data.content;
  }



  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers'])
      setUserToDelete(null)
      showToast('User deleted successfully', 'success')
    },
    onError: (err) => {
      setUserToDelete(null)
      showToast(err.message || 'Failed to delete user', 'error')
    }
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => userService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers'])
      setEditingUser(null)
      showToast('Role updated successfully', 'success')
    },
    onError: (err) => showToast(err.message || 'Failed to update role', 'error')
  })

  const createUserMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['allUsers'])
      setIsModalOpen(false)
      setNewUser({ username: '', password: '', firstName: '', lastName: '', email: '', role: 'STUDENT' })
      setModalError(null)
      showToast('User created successfully', 'success')
    },
    onError: (error) => {
      let errorMessage = 'Failed to create user.';
      const errorData = error.response?.data;
      if (errorData) {
        if (errorData.errors && !Array.isArray(errorData.errors) && typeof errorData.errors === 'object') {
          errorMessage = Object.values(errorData.errors).join('. ');
        } else if (Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map(e => e.defaultMessage || e).join('. ');
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      setModalError(errorMessage);
      showToast(errorMessage, 'error')
    }
  })


  const openCreateModal = () => {
    setModalError(null);
    setIsModalOpen(true);
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    setModalError(null)
    const payload = {
      username: newUser.username,
      password: newUser.password,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      roles: [newUser.role]
    }
    createUserMutation.mutate(payload)
  }


  const initiateDelete = (user) => {
    setUserToDelete(user);
  }


  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
      <div className="container mx-auto p-8 relative">

        {/* Global Notification Toast */}
        {notification && (
            <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded shadow-lg flex items-center ${
                notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'
            }`}>
              <span className="font-medium mr-2">{notification.type === 'success' ? '✓' : '⚠'}</span>
              {notification.message}
              <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-75">✕</button>
            </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add New User
          </button>
        </div>

        {/* Table */}
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
            {userList.length > 0 ? userList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingUser?.id === user.id ? (
                        <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                            className="border rounded px-2 py-1"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                    ) : (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.roles?.some(r => r.includes('ADMIN')) ? 'bg-red-100 text-red-800' :
                                user.roles?.some(r => r.includes('INSTRUCTOR')) ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                        }`}>
                      {user.roles?.some(r => r.includes('ADMIN')) ? 'Admin' :
                          user.roles?.some(r => r.includes('INSTRUCTOR')) ? 'Instructor' : 'Student'}
                    </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {editingUser?.id === user.id ? (
                        <>
                          <button onClick={() => updateRoleMutation.mutate({ userId: user.id, role: editingUser.role })} className="text-green-600 hover:text-green-900 font-medium">Save</button>
                          <button onClick={() => setEditingUser(null)} className="text-gray-600 hover:text-gray-900">Cancel</button>
                        </>
                    ) : (
                        <>
                          <button
                              onClick={() => setEditingUser({
                                id: user.id,
                                role: user.roles?.some(r => r.includes('ADMIN')) ? 'ADMIN' :
                                    user.roles?.some(r => r.includes('INSTRUCTOR')) ? 'INSTRUCTOR' : 'STUDENT'
                              })}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                              onClick={() => initiateDelete(user)}
                              className="text-red-600 hover:text-red-900 ml-2"
                          >
                            Delete
                          </button>
                        </>
                    )}
                  </td>
                </tr>
            )) : (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No users found.</td></tr>
            )}
            </tbody>
          </table>
        </div>

        {/* --- ADD USER MODAL --- */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4">Add New User</h2>

                {modalError && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
                      <p className="font-bold">Error</p>
                      <p>{modalError}</p>
                    </div>
                )}

                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input required type="text" className="mt-1 w-full border rounded p-2"
                             value={newUser.firstName} onChange={e => setNewUser({...newUser, firstName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input required type="text" className="mt-1 w-full border rounded p-2"
                             value={newUser.lastName} onChange={e => setNewUser({...newUser, lastName: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input required type="text" className="mt-1 w-full border rounded p-2"
                           value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input required type="email" className="mt-1 w-full border rounded p-2"
                           value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input required type="password" className="mt-1 w-full border rounded p-2"
                           value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select className="mt-1 w-full border rounded p-2"
                            value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                      <option value="STUDENT">Student</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                      Cancel
                    </button>
                    <button type="submit" disabled={createUserMutation.isLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      {createUserMutation.isLoading ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* --- DELETE CONFIRMATION MODAL --- */}
        {userToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the user <span className="font-semibold text-gray-800">{userToDelete.username}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => setUserToDelete(null)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={confirmDelete}
                      disabled={deleteUserMutation.isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
                  >
                    {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete User'}
                  </button>
                </div>
              </div>
            </div>
        )}

      </div>
  )
}

export default UserManagement