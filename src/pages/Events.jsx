import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { eventService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function Events() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [filterView, setFilterView] = useState('all')
  const { showToast } = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAllEvents,
  })

  const deleteMutation = useMutation({
    mutationFn: (eventId) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      showToast('Event deleted successfully!', 'success')
      queryClient.invalidateQueries(['events'])
    },
  })

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(eventId)
    }
  }

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
  const isInstructor = user?.roles?.includes('INSTRUCTOR')
  const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  const filteredEvents = filterView === 'my' && isInstructor
    ? events.filter(event => event.instructor === user.username)
    : events

  const canDelete = (event) => {
    if (isAdmin) return true
    if (isInstructor && event.instructor === user.username) return true
    return false
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Events</h1>
        <div className="flex gap-4 items-center">
          {isInstructor && (
            <div className="flex gap-2">
              <button
                onClick={() => setFilterView('all')}
                className={`px-4 py-2 rounded ${
                  filterView === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilterView('my')}
                className={`px-4 py-2 rounded ${
                  filterView === 'my'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                My Events
              </button>
            </div>
          )}
          {(isInstructor || isAdmin) && (
            <button
              onClick={() => navigate('/events/create')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Create Event
            </button>
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No events available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow relative">
              {canDelete(event) && (
                <button
                  onClick={() => handleDelete(event.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 hover:scale-110"
                  title="Delete Event"
                >
                  ×
                </button>
              )}
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