import { io } from 'socket.io-client';

const NOTIFICATION_SERVICE_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3001';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = [];
  }

  connect(userId, enrolledCourseIds) {
    if (this.socket?.connected) {
      console.log('Already connected to notification service');
      return;
    }

    console.log('Connecting to notification service...');
    this.socket = io(NOTIFICATION_SERVICE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✓ Connected to notification service');

      this.socket.emit('join-courses', {
        userId: userId,
        courseIds: enrolledCourseIds
      });
    });

    this.socket.on('courses-joined', (data) => {
      console.log('✓ Joined courses:', data.enrolledCourses);
      if (data.rejectedCourses?.length > 0) {
        console.warn('⚠️ Not enrolled in courses:', data.rejectedCourses);
      }
    });

    this.socket.on('enrollment-error', (error) => {
      console.error('❌ Enrollment error:', error.message);
    });

    this.socket.on('new-assignment', (notification) => {
      console.log('📩 New assignment notification:', notification);
      this.notifyListeners(notification);
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Disconnected from notification service');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners = [];
      console.log('Notification service disconnected');
    }
  }

  onNotification(callback) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(notification) {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  leaveCourse(courseId) {
    if (this.socket?.connected) {
      this.socket.emit('leave-course', courseId);
    }
  }

  joinCourse(userId, courseId) {
    if (this.socket?.connected) {
      this.socket.emit('join-course', {
        userId: userId,
        courseId: courseId
      });
      console.log(`✓ Joining course room: ${courseId}`);
    } else {
      console.warn('⚠️ Cannot join course - WebSocket not connected');
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

const notificationService = new NotificationService();

export default notificationService;

