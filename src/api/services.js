import api from './axiosConfig';

export const adminService = {
  getActivityLog: () => api.get('/admin/activity-log'),
  getAllUsers: () => api.get('/admin/users/all'),  // Changed from /admin/users
  getStats: () => api.get('/home'),  // This has the stats
  createUser: (userData) => api.post('/admin/register', userData),
};

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const courseService = {
  getAllCourses: () => api.get('/courses'),
  getTop3Courses: () => api.get('/courses/top3'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (formData) => api.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createLesson: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  getLesson: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`),
  markLessonComplete: (courseId, lessonId) => api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
  startCourse: (id) => api.post(`/courses/${id}/start`),
  getCoursesByCategory: (category) => api.get(`/courses/category/${category}`),
};

export const quizService = {
  getQuizForCourse: (courseId) => api.get(`/quizzes/course/${courseId}`),
  submitQuiz: (courseId, quizId, submission) => 
    api.post(`/quizzes/submit?courseId=${courseId}&quizId=${quizId}`, submission),
  createQuiz: (quizData) =>
    api.post(`/quizzes/create?courseId=${quizData.courseId}`, {
      title: quizData.title,
      numberOfQuestions: quizData.numberOfQuestions
    }),
};

export const questionService = {
  createQuestion: (questionData) =>
    api.post(`/questions?courseId=${questionData.courseId}`, {
      questionTitle: questionData.questionTitle,
      option1: questionData.option1,
      option2: questionData.option2,
      option3: questionData.option3,
      option4: questionData.option4,
      correctAnswer: questionData.correctAnswer,
      difficulty: questionData.difficulty,
    }),
  getQuestions: (courseId) => api.get(`/questions?courseId=${courseId}`),
  deleteQuestion: (questionId) => api.delete(`/questions/${questionId}`),
};

export const homeService = {
  getHomeData: () => api.get('/home'),
  checkUserRole: () => api.get('/home/check-role'),
};

export const announcementService = {
  getAllActiveAnnouncements: () => api.get('/announcements/strings'),
  createAnnouncement: (data) => api.post('/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export const newsService = {
  getAllNews: () => api.get('/news'),
  getNewsById: (id) => api.get(`/news/${id}`),
  createNews: (data) => api.post('/news', data),
  deleteNews: (id) => api.delete(`/news/${id}`),
};

export const ticketService = {
  getUserTickets: () => api.get('/tickets'),
  createTicket: (data) => api.post('/tickets', data),
  resolveTicket: (ticketId) => api.post(`/tickets/${ticketId}/resolve`),
};

export const instructorService = {
  getDashboardData: () => api.get('/instructor/dashboard'),
  getMyCourses: () => api.get('/instructor/courses'),
};

export const groupService = {
  getAllGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },
  getGroupById: async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },
  createGroup: async (formData) => {
    const response = await api.post('/groups', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  joinGroup: async (id) => {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
  },
  leaveGroup: async (id) => {
    const response = await api.post(`/groups/${id}/leave`);
    return response.data;
  },
  deleteGroup: async (id) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },
  createArticle: async (groupId, articleData) => {
    const response = await api.post(`/groups/${groupId}/articles`, articleData);
    return response.data;
  },
};

export const faqService = {
  getAllFAQs: () => api.get('/faq'),
  createFAQ: (data) => api.post('/faq', data),
  deleteFAQ: (id) => api.delete(`/faq/${id}`),
};

export const assignmentService = {
  getAllAssignments: async () => {
    const response = await api.get('/assignments');
    console.log('=== Assignment Service Response ===');
    console.log('Response:', response);
    console.log('Response.data:', response.data);
    console.log('Response.data type:', typeof response.data);
    console.log('Response.data.assignments:', response.data?.assignments);
    console.log('===================================');
    return response;
  },
  getAssignmentById: (id) => api.get(`/assignments/${id}`),
  createAssignment: (assignmentData) => api.post('/assignments', assignmentData),
  uploadSolution: (formData) => api.post('/assignments/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const eventService = {
  getAllEvents: () => api.get('/events'),
  getUpcomingEvents: () => api.get('/events/upcoming'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  searchUsers: (query, loggedInUsername) =>
    api.get(`/users/search?query=${query}&loggedInUsername=${loggedInUsername}`),
  getUserCertificates: (userId) => api.get(`/users/${userId}/certificates`),
  updateUserRole: (userId, role) => api.patch(`/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getInstructors: () => api.get('/users/instructors'),
};