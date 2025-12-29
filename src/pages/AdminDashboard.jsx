// src/pages/AdminDashboard.jsx
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { homeService, adminService } from '../api/services'
import { useState } from 'react'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const { data: homeData } = useQuery({
    queryKey: ['homeData'],
    queryFn: homeService.getHomeData,
  })

  const { data: usersData } = useQuery({
    queryKey: ['allUsers'],
    queryFn: adminService.getAllUsers,
  })

  const stats = homeData?.data || {}
  const totalUsers = usersData?.data?.length || 0

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'courses'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Users
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Platform Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.totalCourses || 0}
                  </div>
                  <div className="text-gray-600 mt-2">Total Courses</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {totalUsers}
                  </div>
                  <div className="text-gray-600 mt-2">Total Users</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.totalEvents || 0}
                  </div>
                  <div className="text-gray-600 mt-2">Upcoming Events</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.totalAssignments || 0}
                  </div>
                  <div className="text-gray-600 mt-2">Active Assignments</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link to="/courses/create" className="block w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">
                    Create Course
                  </Link>
                  <Link to="/announcements/create" className="block w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center">
                    Create Announcement
                  </Link>
                  <Link to="/news/create" className="block w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center">
                    Create News
                  </Link>
                  <Link to="/admin/users" className="block w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-center">
                    Manage Users
                  </Link>
                  <Link to="/admin/activity-log" className="block w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center">
                    View Activity Log
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Courses</h2>
                <Link
                  to="/courses/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + New Course
                </Link>
              </div>
              <p className="text-gray-600">
                Total courses: {stats.totalCourses || 0}
              </p>
              <Link to="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
                View all courses →
              </Link>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Link
                  to="/admin/users"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Manage Users
                </Link>
              </div>
              <p className="text-gray-600">
                Total registered users: {totalUsers}
              </p>
              <Link to="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">
                View all users →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard