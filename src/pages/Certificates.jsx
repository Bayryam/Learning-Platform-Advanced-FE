import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { userService } from '../api/services'

function Certificates() {
  const { user } = useAuth()

  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: () => userService.getUserCertificates(user?.id),
    enabled: !!user?.id,
  })

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>

      {certificates?.data?.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">You haven't earned any certificates yet.</p>
          <p className="text-sm text-gray-500 mt-2">Complete courses to earn certificates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates?.data?.map((course) => (
            <div key={course.id} className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📜</div>
                <h3 className="text-xl font-bold text-blue-600">{course.name}</h3>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Awarded to:</p>
                <p className="font-semibold">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-500 mt-2">
                  For successfully completing all course requirements
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Certificates