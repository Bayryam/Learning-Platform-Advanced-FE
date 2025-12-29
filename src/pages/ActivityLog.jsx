import { useQuery } from '@tanstack/react-query'
import { adminService } from '../api/services'
import { useState } from 'react'

function ActivityLog() {
  const [filter, setFilter] = useState('')
  const [usernameFilter, setUsernameFilter] = useState('')

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['activityLog'],
    queryFn: adminService.getActivityLog,
  })

  const logs = response?.data || []

  const filteredLogs = logs.filter(log => {
    const matchesAction = !filter || log.action?.toLowerCase().includes(filter.toLowerCase())
    const matchesUsername = !usernameFilter || log.username?.toLowerCase().includes(usernameFilter.toLowerCase())
    return matchesAction && matchesUsername
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <div className="text-xl">Loading activity log...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Activity Log</h2>
          <p className="text-red-600">{error.message}</p>
          <p className="text-sm text-gray-600 mt-2">Make sure you are logged in as an admin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Activity Log</h1>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Filter by action..."
          className="border rounded px-4 py-2 flex-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by username..."
          className="border rounded px-4 py-2 flex-1"
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
        />
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No activity logs found.</p>
          <p className="text-sm text-gray-500 mt-2">
            {logs.length === 0 
              ? 'No activities have been logged yet.' 
              : 'No logs match your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.formattedDate || new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ActivityLog