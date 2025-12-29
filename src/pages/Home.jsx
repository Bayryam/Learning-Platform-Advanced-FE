import { useQuery } from '@tanstack/react-query'
import { homeService } from '../api/services'
import AnnouncementBanner from '../components/AnnouncementBanner'

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['homeData'],
    queryFn: homeService.getHomeData,
  })

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <AnnouncementBanner />
      
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Learning Platform</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            {data?.data?.upcomingEvents?.length > 0 ? (
              <ul>
                {data.data.upcomingEvents.map(event => (
                  <li key={event.id} className="mb-2">{event.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Top Courses</h2>
            {Object.keys(data?.data?.top3CoursesByCategory || {}).length > 0 ? (
              Object.entries(data.data.top3CoursesByCategory).map(([category, courses]) => (
                <div key={category} className="mb-4">
                  <h3 className="font-semibold">{category}</h3>
                  <ul className="ml-4">
                    {courses.map(course => (
                      <li key={course.id}>{course.name}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No courses available</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Assignments</h2>
            {data?.data?.upcomingAssignments?.length > 0 ? (
              <ul>
                {data.data.upcomingAssignments.map(assignment => (
                  <li key={assignment.id} className="mb-2">{assignment.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming assignments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home