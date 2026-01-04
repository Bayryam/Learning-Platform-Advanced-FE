import { createContext, useContext, useState, useEffect } from 'react'
import { authService, userService } from '../api/services'
import api from '../api/axiosConfig'
import notificationService from '../services/notificationService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authService.getCurrentUser()
      if (response.data && response.data.authenticated !== false) {
        setUser(response.data)

        try {
          const enrolledCoursesResponse = await userService.getEnrolledCourses(response.data.id)
          const enrolledCourseIds = enrolledCoursesResponse.data || []
          notificationService.connect(response.data.id, enrolledCourseIds)
        } catch (error) {
          console.error('Failed to connect to notification service:', error)
        }
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    try {
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (response.status === 200 && response.data.id) {
        setUser(response.data)

        try {
          const enrolledCoursesResponse = await userService.getEnrolledCourses(response.data.id)
          const enrolledCourseIds = enrolledCoursesResponse.data || []
          notificationService.connect(response.data.id, enrolledCourseIds)
        } catch (error) {
          console.error('Failed to connect to notification service:', error)
        }

        return { success: true }
      }
      throw new Error('Invalid login response')
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Invalid credentials')
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      notificationService.disconnect()
      setUser(null)
    }
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    return response.data
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}