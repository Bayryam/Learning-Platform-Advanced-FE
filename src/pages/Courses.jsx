// src/pages/Courses.jsx - Updated with search
import { useQuery } from '@tanstack/react-query'
import { courseService } from '../api/services'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Courses() {
  const [searchTerm, setSearchTerm] = useState('')

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

  // Filter courses based on search term
  const filteredCoursesByCategory = Object.entries(coursesByCategory).reduce((acc, [category, courses]) => {
    const filteredCourses = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filteredCourses.length > 0) {
      acc[category] = filteredCourses
    }
    return acc
  }, {})

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Courses</h1>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {Object.keys(filteredCoursesByCategory).length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No courses found matching your search.' : 'No courses available yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredCoursesByCategory).map(([category, courses]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4 text-blue-600">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(courses).map(course => (
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
                      <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{course.participantCount || 0} students</span>
                        <span>{course.lessonsCount || 0} lessons</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Courses