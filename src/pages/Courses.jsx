// src/pages/Courses.jsx - Updated with search
import { useQuery } from '@tanstack/react-query'
import { courseService } from '../api/services'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Courses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAllCourses,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading courses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading courses: {error.message}</div>
      </div>
    )
  }

  const coursesByCategory = data?.data || {}


  const uniqueCoursesMap = new Map()
  Object.entries(coursesByCategory).forEach(([category, courses]) => {
    courses.forEach(course => {
      if (!uniqueCoursesMap.has(course.id)) {
        uniqueCoursesMap.set(course.id, {
          ...course,
          categories: [category]
        })
      } else {
        const existingCourse = uniqueCoursesMap.get(course.id)
        existingCourse.categories.push(category)
      }
    })
  })

  const allCourses = Array.from(uniqueCoursesMap.values())

  const allCategories = ['All', ...new Set(Object.keys(coursesByCategory))]

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.categories.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Courses</h1>
        {user?.roles?.includes('INSTRUCTOR') && (
          <button
            onClick={() => navigate('/courses/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create Course
          </button>
        )}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Filter by Category:</h3>
        <div className="flex flex-wrap gap-2">
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">
            {searchTerm || selectedCategory !== 'All'
              ? 'No courses found matching your filters.'
              : 'No courses available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {course.imageBase64 && (
                <img
                  src={`data:image/jpeg;base64,${course.imageBase64}`}
                  alt={course.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-gray-600 mb-3 line-clamp-3">{course.description}</p>

                {/* Display course categories as badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>{course.participantCount || 0} students</span>
                  <span>{course.lessonsCount || 0} lessons</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Courses