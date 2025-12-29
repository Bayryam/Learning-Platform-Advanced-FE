// src/pages/Tickets.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketService } from '../api/services'
import { useNavigate } from 'react-router-dom'

function Tickets() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getUserTickets,
  })

  const resolveMutation = useMutation({
    mutationFn: (ticketId) => ticketService.resolveTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets'])
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading tickets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading tickets: {error.message}</div>
      </div>
    )
  }

  const tickets = data?.data || []

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Support Tickets</h1>
        <button
          onClick={() => navigate('/tickets/create')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Open Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No tickets found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{ticket.id}</td>
                  <td className="px-6 py-4">{ticket.subject}</td>
                  <td className="px-6 py-4">{ticket.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.resolved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.resolved ? 'Resolved' : 'Open'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {!ticket.resolved && (
                      <button
                        onClick={() => resolveMutation.mutate(ticket.id)}
                        disabled={resolveMutation.isPending}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Tickets