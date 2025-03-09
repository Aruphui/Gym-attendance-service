
// =====================================
// database.js - Simulates a database using localStorage
// =====================================

class Database {
    constructor() {
      // Initialize storage if it doesn't exist
      if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
          { id: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' }
        ]));
      }
      
      if (!localStorage.getItem('attendance')) {
        localStorage.setItem('attendance', JSON.stringify([]));
      }
    }
    
    // User management
    getUsers() {
      return JSON.parse(localStorage.getItem('users'));
    }
    
    addUser(user) {
      const users = this.getUsers();
      // Check if user already exists
      if (users.some(u => u.id === user.id)) {
        return false;
      }
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    
    validateUser(id, password) {
      const users = this.getUsers();
      return users.find(user => user.id === id && user.password === password);
    }
    
    // Attendance management
    logAttendance(userId, action) {
      const attendance = JSON.parse(localStorage.getItem('attendance'));
      const timestamp = new Date().toISOString();
      
      attendance.push({
        userId,
        action, // 'login' or 'logout'
        timestamp
      });
      
      localStorage.setItem('attendance', JSON.stringify(attendance));
      return timestamp;
    }
    
    getUserAttendance(userId) {
      const attendance = JSON.parse(localStorage.getItem('attendance'));
      return attendance.filter(record => record.userId === userId);
    }
    
    getAllAttendance() {
      return JSON.parse(localStorage.getItem('attendance'));
    }
    
    getAttendanceByDate(date) {
      const attendance = this.getAllAttendance();
      return attendance.filter(record => {
        const recordDate = new Date(record.timestamp).toDateString();
        return recordDate === new Date(date).toDateString();
      });
    }
    
    getAttendanceByMonth(year, month) {
      const attendance = this.getAllAttendance();
      return attendance.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getFullYear() === year && 
               recordDate.getMonth() === month;
      });
    }
  }
  