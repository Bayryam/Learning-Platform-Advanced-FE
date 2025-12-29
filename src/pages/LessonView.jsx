import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { courseService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function LessonView() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showRawContent, setShowRawContent] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => courseService.getLesson(courseId, lessonId),
  })

  const markCompleteMutation = useMutation({
    mutationFn: () => courseService.markLessonComplete(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries(['lesson', courseId, lessonId])
      queryClient.invalidateQueries(['course', courseId])
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading lesson...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading lesson: {error.message}</div>
      </div>
    )
  }

  const lesson = data?.data?.lesson
  const course = data?.data?.course
  const completedLessons = data?.data?.completedLessons || []
  const isCreator = data?.data?.isCreator || false
  
  if (!lesson) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Lesson not found</div>
      </div>
    )
  }

  const isCompleted = completedLessons.some(l => l.id === lesson.id)

  return (
    <div className="container mx-auto p-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/courses" className="hover:text-blue-600">Courses</Link>
        {' > '}
        <Link to={`/courses/${courseId}`} className="hover:text-blue-600">{course?.name}</Link>
        {' > '}
        <span className="text-gray-800">{lesson.title}</span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
            {isCompleted && (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✓ Completed
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRawContent(!showRawContent)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              {showRawContent ? 'Show Formatted' : 'Show Raw'}
            </button>
            {user && !isCompleted && !isCreator && (
              <button
                onClick={() => markCompleteMutation.mutate()}
                disabled={markCompleteMutation.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {markCompleteMutation.isPending ? 'Marking...' : 'Mark as Complete'}
              </button>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          {showRawContent ? (
            <pre className="bg-gray-50 p-4 rounded border overflow-x-auto whitespace-pre-wrap">
              {lesson.content}
            </pre>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {lesson.content}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t flex justify-between">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            ← Back to Course
          </button>
          {user && !isCompleted && !isCreator && (
            <button
              onClick={() => markCompleteMutation.mutate()}
              disabled={markCompleteMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {markCompleteMutation.isPending ? 'Marking...' : 'Mark as Complete ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonView