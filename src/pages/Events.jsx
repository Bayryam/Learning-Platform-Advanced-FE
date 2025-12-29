import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function Events() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAllEvents,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading events: {error.message}</div>
      </div>
    )
  }

  const events = Array.isArray(data?.data) ? data.data : []
  const isInstructor = user?.roles?.includes('ROLE_INSTRUCTOR') || user?.roles?.includes('ROLE_ADMIN')

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Events</h1>
        {isInstructor && (
          <button
            onClick={() => navigate('/events/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create Event
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No events available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-gray-500">
                <p><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(event.endTime).toLocaleString()}</p>
                <p><strong>Instructor:</strong> {event.instructor}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events