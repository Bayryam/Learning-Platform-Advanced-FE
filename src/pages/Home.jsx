import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { assignmentService, courseService, eventService } from '../api/services'
import AnnouncementBanner from '../components/AnnouncementBanner'
import { Link } from 'react-router-dom'

function Home() {
  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: assignmentService.getAllAssignments,
  })

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAllCourses,
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAllEvents,
  })

  const allAssignments = assignmentsData?.data?.assignments || []
  const userSolutionStatus = assignmentsData?.data?.userSolutionStatus || {}

  const upcomingAssignments = useMemo(() => {
    return allAssignments
      .filter(assignment => new Date(assignment.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3) // Get top 3
  }, [allAssignments])

  // Get all courses and deduplicate
  const allCourses = useMemo(() => {
    const coursesByCategory = coursesData?.data || {}
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

    return Array.from(uniqueCoursesMap.values())
  }, [coursesData])

  const topCourses = useMemo(() => {
    return [...allCourses]
      .sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0))
      .slice(0, 3)
  }, [allCourses])

  // Get all events and filter/sort to get top 3 most upcoming
  const upcomingEvents = useMemo(() => {
    const events = Array.isArray(eventsData?.data) ? eventsData.data : []
    const now = new Date()
    return events
      .filter(event => new Date(event.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 3)
  }, [eventsData])

  if (assignmentsLoading || coursesLoading || eventsLoading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <AnnouncementBanner />
      
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Learning Platform</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-b pb-3 last:border-b-0">
                    <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</p>
                      <p><strong>Instructor:</strong> {event.instructor}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
            <Link
              to="/events"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all events →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Popular Courses</h2>
            {topCourses.length > 0 ? (
              <div className="space-y-4">
                {topCourses.map(course => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="block border rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="flex gap-3">
                      {course.imageBase64 && (
                        <img
                          src={`data:image/jpeg;base64,${course.imageBase64}`}
                          alt={course.name}
                          className="w-24 h-24 object-cover"
                        />
                      )}
                      <div className="flex-1 p-3">
                        <h3 className="font-semibold text-blue-600 hover:text-blue-800 mb-1">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {course.description}
                        </p>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{course.participantCount || 0} students</span>
                          <span>•</span>
                          <span>{course.lessonsCount || 0} lessons</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses available</p>
            )}
            <Link
              to="/courses"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all courses →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Assignments</h2>
            {upcomingAssignments.length > 0 ? (
              <ul className="space-y-3">
                {upcomingAssignments.map(assignment => (
                  <li key={assignment.id} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          to={`/assignments/${assignment.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {assignment.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      {userSolutionStatus[assignment.id] && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold ml-2">
                          ✓
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming assignments</p>
            )}
            <Link
              to="/assignments"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all assignments →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home