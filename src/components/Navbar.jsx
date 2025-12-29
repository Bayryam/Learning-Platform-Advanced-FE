import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return null
  }

  // Check if user is admin (you can adjust this logic based on your user roles)
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.username === 'admin'

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Learning Platform
          </Link>

          <div className="flex space-x-6">
            <Link to="/news" className="hover:text-blue-200">News</Link>
<Link to="/groups" className="hover:text-blue-200">Groups</Link>
<Link to="/faq" className="hover:text-blue-200">FAQ</Link>
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/courses" className="hover:text-blue-200">Courses</Link>
            <Link to="/assignments" className="hover:text-blue-200">Assignments</Link>
            <Link to="/events" className="hover:text-blue-200">Events</Link>
            {user && <Link to="/profile" className="hover:text-blue-200">Profile</Link>}
            {isAdmin && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.firstName || user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar