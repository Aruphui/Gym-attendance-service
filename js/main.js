// =====================================
// main.js - Member functionality
// =====================================

const db = new Database();
let currentUser = null;

// Check if user is logged in
function checkSession() {
  const userSession = sessionStorage.getItem('currentUser');
  if (userSession) {
    currentUser = JSON.parse(userSession);
    showMemberDashboard();
  } else {
    showLoginForm();
  }
}

// Login functionality
function login() {
  const userId = document.getElementById('userId').value;
  const password = document.getElementById('password').value;
  
  const user = db.validateUser(userId, password);
  
  if (user) {
    currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    if (user.role === 'admin') {
      window.location.href = 'admin/index.html';
    } else {
      showMemberDashboard();
    }
  } else {
    alert('Invalid username or password');
  }
}

// Logout functionality
function logout() {
  if (currentUser) {
    db.logAttendance(currentUser.id, 'logout');
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    showLoginForm();
  }
}

// Toggle between login form and member dashboard
function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('memberDashboard').style.display = 'none';
}

function showMemberDashboard() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('memberDashboard').style.display = 'block';
  document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}!`;
  
  updateAttendanceStatus();
}

// Check-in functionality
function checkIn() {
  const timestamp = db.logAttendance(currentUser.id, 'login');
  alert(`Checked in at ${new Date(timestamp).toLocaleTimeString()}`);
  updateAttendanceStatus();
}

// Member attendance status
function updateAttendanceStatus() {
  const attendance = db.getUserAttendance(currentUser.id);
  const statusContainer = document.getElementById('attendanceStatus');
  statusContainer.innerHTML = '';
  
  // Get today's records
  const today = new Date().toDateString();
  const todayRecords = attendance.filter(record => 
    new Date(record.timestamp).toDateString() === today
  );
  
  if (todayRecords.length > 0) {
    const statusTable = document.createElement('table');
    statusTable.className = 'attendance-table';
    
    const header = document.createElement('tr');
    header.innerHTML = '<th>Action</th><th>Time</th>';
    statusTable.appendChild(header);
    
    todayRecords.forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.action === 'login' ? 'Check In' : 'Check Out'}</td>
        <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
      `;
      statusTable.appendChild(row);
    });
    
    statusContainer.appendChild(statusTable);
  } else {
    statusContainer.textContent = 'No attendance recorded for today';
  }
}

// Initialize on page load
window.onload = checkSession;