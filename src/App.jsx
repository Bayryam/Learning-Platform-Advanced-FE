import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Assignments from './pages/Assignments'
import AssignmentSubmit from './pages/AssignmentSubmit'
import Events from './pages/Events'
import Profile from './pages/Profile'
import CreateCourse from './pages/CreateCourse'
import CreateLesson from './pages/CreateLesson'
import LessonView from './pages/LessonView'
import QuizTake from './pages/QuizTake'
import CreateQuiz from './pages/CreateQuiz'
import CreateQuestion from './pages/CreateQuestion'
import Questions from './pages/Questions'
import AdminDashboard from './pages/AdminDashboard'
import CreateAssignment from './pages/CreateAssignment'
import CreateEvent from './pages/CreateEvent'
import News from './pages/News'
import CreateNews from './pages/CreateNews'
import FAQ from './pages/FAQ'
import Groups from './pages/Groups'
import Tickets from './pages/Tickets'
import CreateTicket from './pages/CreateTicket'
import InstructorDashboard from './pages/InstructorDashboard'
import CreateAnnouncement from './pages/CreateAnnouncement'
import Certificates from './pages/Certificates'
import ActivityLog from './pages/ActivityLog'
import UserManagement from './pages/UserManagement'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonView />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<News />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/groups" element={<Groups />} />

        {/* Protected Routes */}
        <Route path="/assignments" element={
          <ProtectedRoute>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/assignments/:id" element={
          <ProtectedRoute>
            <AssignmentSubmit />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/courses/create" element={
          <ProtectedRoute>
            <CreateCourse />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId/lessons/create" element={
          <ProtectedRoute>
            <CreateLesson />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId/quiz" element={
          <ProtectedRoute>
            <QuizTake />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId/quiz/create" element={
          <ProtectedRoute>
            <CreateQuiz />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId/questions/create" element={
          <ProtectedRoute>
            <CreateQuestion />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseId/questions" element={
          <ProtectedRoute>
            <Questions />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/assignments/create" element={
  <ProtectedRoute>
    <CreateAssignment />
  </ProtectedRoute>
} />
<Route path="/events/create" element={
  <ProtectedRoute>
    <CreateEvent />
  </ProtectedRoute>
} />
<Route path="/news/create" element={
  <ProtectedRoute>
    <CreateNews />
  </ProtectedRoute>
} />
<Route path="/tickets" element={
  <ProtectedRoute>
    <Tickets />
  </ProtectedRoute>
} />
<Route path="/tickets/create" element={
  <ProtectedRoute>
    <CreateTicket />
  </ProtectedRoute>
} />
<Route path="/instructor" element={
  <ProtectedRoute>
    <InstructorDashboard />
  </ProtectedRoute>
} />
<Route path="/announcements/create" element={
  <ProtectedRoute>
    <CreateAnnouncement />
  </ProtectedRoute>
} />
<Route path="/certificates" element={
  <ProtectedRoute>
    <Certificates />
  </ProtectedRoute>
} />
<Route path="/admin/activity-log" element={
  <ProtectedRoute>
    <ActivityLog />
  </ProtectedRoute>
} />
<Route path="/admin/users" element={
  <ProtectedRoute>
    <UserManagement />
  </ProtectedRoute>
} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App