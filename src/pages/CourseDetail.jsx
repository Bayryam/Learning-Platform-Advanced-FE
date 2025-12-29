import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { courseService } from '../api/services'
import { useAuth } from '../context/AuthContext'

function CourseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
  })

  const startCourseMutation = useMutation({
    mutationFn: () => courseService.startCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['course', id])
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading course...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading course: {error.message}</div>
      </div>
    )
  }

  const course = data?.data?.course
  const assignments = data?.data?.assignments || []
  const userSolutionStatus = data?.data?.userSolutionStatus || {}
  const highscores = data?.data?.highscores || []
  const isCreator = data?.data?.isCreator || false
  const isCourseStarted = data?.data?.isCourseStarted || false
  const isCourseCompleted = data?.data?.isCourseCompleted || false

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex gap-2 mb-4">
              {course.categories?.map(cat => (
                <span key={cat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {cat}
                </span>
              ))}
            </div>
          </div>
          {course.imageBase64 && (
            <img src={`data:image/jpeg;base64,${course.imageBase64}`} alt={course.name} className="w-48 h-32 object-cover rounded" />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">{course.participantCount || 0}</div>
            <div className="text-gray-600">Students Enrolled</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">{course.lessonsCount || 0}</div>
            <div className="text-gray-600">Lessons</div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-2xl font-bold text-purple-600">{assignments.length}</div>
            <div className="text-gray-600">Assignments</div>
          </div>
        </div>

        {user && !isCourseStarted && !isCreator && (
          <button
            onClick={() => startCourseMutation.mutate()}
            disabled={startCourseMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {startCourseMutation.isPending ? 'Starting...' : 'Start Course'}
          </button>
        )}

        {isCourseCompleted && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold">
            ✓ Course Completed!
          </div>
        )}
      </div>

      {/* Lessons Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lessons</h2>
          {isCreator && (
            <button
              onClick={() => navigate(`/courses/${id}/lessons/create`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Lesson
            </button>
          )}
        </div>
        {course.lessons?.length > 0 ? (
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={`/courses/${id}/lessons/${lesson.id}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 mr-3">Lesson {index + 1}</span>
                    <span className="font-semibold">{lesson.title}</span>
                  </div>
                  <span className="text-blue-600">→</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No lessons available yet.</p>
        )}
      </div>

      {/* Quiz Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Quiz</h2>
        {user && isCourseStarted && !isCreator ? (
          <button
            onClick={() => navigate(`/courses/${id}/quiz`)}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
          >
            <span>📝</span>
            <span>Take Course Quiz</span>
          </button>
        ) : isCreator ? (
          <p className="text-gray-500">Instructors cannot take their own quizzes.</p>
        ) : (
          <p className="text-gray-500">Start the course to access the quiz.</p>
        )}
      </div>

      {/* Assignments Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Assignments</h2>
        {assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map(assignment => (
              <div key={assignment.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    <p className="text-gray-600 text-sm">{assignment.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Due: {new Date(assignment.dueDate).toLocaleString()}
                    </p>
                  </div>
                  {userSolutionStatus[assignment.id] ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Submitted ✓
                    </span>
                  ) : (
                    <Link
                      to={`/assignments/${assignment.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Submit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No assignments available.</p>
        )}
      </div>

      {/* Highscores Section */}
      {highscores.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="space-y-2">
            {highscores.map((score, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="font-bold text-lg mr-4 text-gray-500">#{index + 1}</span>
                  <span>{score.username}</span>
                </div>
                <span className="font-bold text-blue-600">{score.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetail