import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { courseService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function CourseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
  })

const startCourseMutation = useMutation({
  mutationFn: () => courseService.startCourse(id),
  onSuccess: () => {
    showToast('Course started!', 'success')
    queryClient.invalidateQueries(['course', id])
  },
  onError: (err) => {
    showToast('Failed to start course', 'error')
  }
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
  const isCourseCompleted = (data?.data?.allLessonsCompleted && course?.lessons?.length > 0) || false
  const isCourseStarted = (data?.data?.isCourseStarted || isCourseCompleted) || false
  const hasQuiz = data?.data?.hasQuiz || false
  const hasCompletedQuiz = user ? highscores.some(score => {
    return score.username === user.username
  }) : false

  console.log(data?.data);

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

      {/* Only show content sections if course is started or user is the creator */}
      {(isCourseStarted || isCreator) && (
        <>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Final Quiz</h2>
          {user && isCourseStarted && !isCreator && isCourseCompleted && hasQuiz && !hasCompletedQuiz && (
            <button
              onClick={() => navigate(`/courses/${id}/quiz`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Quiz
            </button>
          )}
          {isCreator && (
            <button
              onClick={() => navigate(`/courses/${id}/quiz/create`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Create Quiz
            </button>
          )}
        </div>

        {user && isCourseStarted && !isCreator && !isCourseCompleted && (
          <p className="text-gray-500 mb-4">Complete all lessons to unlock the quiz.</p>
        )}

        {user && isCourseStarted && !isCreator && isCourseCompleted && !hasQuiz && (
          <p className="text-gray-500 mb-4">No quiz available for this course.</p>
        )}

        {user && isCourseStarted && !isCreator && isCourseCompleted && hasQuiz && hasCompletedQuiz && (
          <p className="text-green-600 font-semibold mb-4">✓ Quiz Completed! Check the leaderboard below to see your score.</p>
        )}

        {!user && (
          <p className="text-gray-500">Start the course to access the quiz.</p>
        )}

        {isCreator && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate(`/courses/${id}/questions/create`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Question
            </button>
            <button
              onClick={() => navigate(`/courses/${id}/questions`)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Question
            </button>
          </div>
        )}
      </div>

      {/* Assignments Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Assignments</h2>
          {isCreator && (
            <button
              onClick={() => navigate(`/assignments/create?courseId=${id}`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Assignment
            </button>
          )}
        </div>
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
                  {!isCreator && isCourseStarted && (
                    userSolutionStatus[assignment.id] ? (
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
                    )
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
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="space-y-2">
            {highscores
              .sort((a, b) => {
                if (b.percentage !== a.percentage) {
                  return b.percentage - a.percentage
                }
                return (a.elapsedTime || 0) - (b.elapsedTime || 0)
              })
              .map((score, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-gray-500 w-8">#{index + 1}</span>
                    <span className="font-medium">{score.username}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-600">
                      ⏱️ {score.elapsedTime ? `${Math.floor(score.elapsedTime / 60)}:${String(score.elapsedTime % 60).padStart(2, '0')}` : 'N/A'}
                    </span>
                    <span className="font-bold text-blue-600 w-16 text-right">{score.percentage}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Analytics Section - Only visible for course creator */}
      {isCreator && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Course Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <div className="text-sm text-blue-600 font-semibold mb-2">Total Students</div>
            <div className="text-3xl font-bold text-blue-700">{course.participantCount || 0}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <div className="text-sm text-green-600 font-semibold mb-2">Completion Rate</div>
            <div className="text-3xl font-bold text-green-700">
              {course.participantCount > 0
                ? Math.round((highscores.length / course.participantCount) * 100)
                : 0}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <div className="text-sm text-purple-600 font-semibold mb-2">Average Score</div>
            <div className="text-3xl font-bold text-purple-700">
              {highscores.length > 0
                ? Math.round(highscores.reduce((sum, score) => sum + score.percentage, 0) / highscores.length)
                : 0}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
            <div className="text-sm text-orange-600 font-semibold mb-2">Total Content</div>
            <div className="text-3xl font-bold text-orange-700">
              {(course.lessonsCount || 0) + assignments.length}
            </div>
            <div className="text-xs text-orange-600 mt-1">
              {course.lessonsCount || 0} lessons, {assignments.length} assignments
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        {highscores.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Best Score</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...highscores.map(s => s.percentage))}%
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Average Time</div>
                <div className="text-2xl font-bold text-blue-600">
                  {highscores.filter(s => s.elapsedTime).length > 0
                    ? (() => {
                        const avgTime = Math.round(
                          highscores
                            .filter(s => s.elapsedTime)
                            .reduce((sum, s) => sum + s.elapsedTime, 0) /
                          highscores.filter(s => s.elapsedTime).length
                        )
                        return `${Math.floor(avgTime / 60)}:${String(avgTime % 60).padStart(2, '0')}`
                      })()
                    : 'N/A'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Fastest Time</div>
                <div className="text-2xl font-bold text-purple-600">
                  {highscores.filter(s => s.elapsedTime).length > 0
                    ? (() => {
                        const minTime = Math.min(...highscores.filter(s => s.elapsedTime).map(s => s.elapsedTime))
                        return `${Math.floor(minTime / 60)}:${String(minTime % 60).padStart(2, '0')}`
                      })()
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
        </>
      )}
    </div>
  )
}

export default CourseDetail