// src/pages/InstructorDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { instructorService } from '../api/services'

function InstructorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['instructor-dashboard'],
    queryFn: instructorService.getDashboardData,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  const stats = data?.data || {}

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Instructor Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{stats.totalCourses || 0}</div>
          <div className="text-gray-600 mt-2">My Courses</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">{stats.totalStudents || 0}</div>
          <div className="text-gray-600 mt-2">Total Students</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-purple-600">{stats.totalAssignments || 0}</div>
          <div className="text-gray-600 mt-2">Assignments</div>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-orange-600">{stats.pendingTickets || 0}</div>
          <div className="text-gray-600 mt-2">Pending Tickets</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/courses/create"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 text-center"
          >
            + Create New Course
          </Link>
          <Link
            to="/assignments/create"
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 text-center"
          >
            + Create Assignment
          </Link>
          <Link
            to="/events/create"
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 text-center"
          >
            + Create Event
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        <Link to="/courses" className="text-blue-600 hover:underline">
          View all courses →
        </Link>
      </div>
    </div>
  )
}

export default InstructorDashboard