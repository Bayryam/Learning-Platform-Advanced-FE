import { useQuery } from '@tanstack/react-query'
import { assignmentService } from '../api/services'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Assignments() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['assignments'],
    queryFn: assignmentService.getAllAssignments,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading assignments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading assignments: {error.message}</div>
      </div>
    )
  }

  const assignments = data?.data?.assignments || []
  const userSolutionStatus = data?.data?.userSolutionStatus || {}
  const isInstructor = user?.roles?.includes('ROLE_INSTRUCTOR') || user?.roles?.includes('ROLE_ADMIN')

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Assignments</h1>
        {isInstructor && (
          <button
            onClick={() => navigate('/assignments/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create Assignment
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No assignments available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(assignment => (
            <div key={assignment.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  <div className="text-sm text-gray-500">
                    <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleString()}</p>
                  </div>
                </div>
                <div className="ml-4">
                  {userSolutionStatus[assignment.id] ? (
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                      Submitted ✓
                    </span>
                  ) : (
                    <Link
                      to={`/assignments/${assignment.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold inline-block"
                    >
                      Submit Solution
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Assignments