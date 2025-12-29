import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'

function Profile() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Username:</span> {user.username}
            </div>
            <div>
              <span className="font-semibold">Full Name:</span> {user.fullName || `${user.firstName} ${user.lastName}`}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-semibold">Roles:</span> {user.roles?.join(', ') || 'N/A'}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Course Progress</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-3xl font-bold text-blue-600">
                {user.startedCourses?.length || 0}
              </div>
              <div className="text-gray-600">Courses Started</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-3xl font-bold text-green-600">
                {user.completedCourses?.length || 0}
              </div>
              <div className="text-gray-600">Courses Completed</div>
            </div>
          </div>

          <Link 
            to="/certificates" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            📜 View My Certificates
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile