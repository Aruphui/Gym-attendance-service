// Initialize database
const db = new Database();
let currentUser = null;

// Check if admin is logged in
function checkAdminSession() {
  const userSession = sessionStorage.getItem('currentUser');
  if (userSession) {
    const user = JSON.parse(userSession);
    if (user.role === 'admin') {
      currentUser = user;
      document.getElementById('adminName').textContent = user.name;
      loadUsers();
      loadAttendance();
    } else {
      window.location.href = '../index.html';
    }
  } else {
    window.location.href = '../index.html';
  }
}

// Load user list
function loadUsers() {
  const users = db.getUsers().filter(user => user.id !== 'admin');
  const userTable = document.getElementById('userList');
  userTable.innerHTML = '<tr><th>User ID</th><th>Name</th></tr>';
  
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
    `;
    userTable.appendChild(row);
  });
}

// Add new user - FIXED FUNCTION
function addNewUser() {
  const userId = document.getElementById('newUserId').value;
  const name = document.getElementById('newUserName').value;
  const password = document.getElementById('newUserPassword').value;
  
  if (!userId || !name || !password) {
    alert('All fields are required');
    return;
  }
  
  // Create the new user object
  const newUser = {
    id: userId,
    name: name,
    password: password,
    role: 'member'
  };
  
  // Add the user to the database
  const success = db.addUser(newUser);
  
  if (success) {
    alert('User added successfully');
    document.getElementById('newUserForm').reset();
    loadUsers(); // Refresh the user list
  } else {
    alert('User ID already exists');
  }
}

// Load attendance data
function loadAttendance() {
  // Default to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('attendanceDate').value = today;
  filterAttendanceByDate();
}

// Filter attendance by date
function filterAttendanceByDate() {
  const dateInput = document.getElementById('attendanceDate').value;
  const attendance = db.getAttendanceByDate(dateInput);
  displayAttendance(attendance);
}

// Filter attendance by month
function filterAttendanceByMonth() {
  const monthInput = document.getElementById('attendanceMonth').value;
  if (!monthInput) {
    alert('Please select a month');
    return;
  }
  
  const [year, month] = monthInput.split('-');
  const attendance = db.getAttendanceByMonth(parseInt(year), parseInt(month) - 1);
  displayAttendance(attendance);
}

// Display attendance data
function displayAttendance(attendanceData) {
  const attendanceTable = document.getElementById('attendanceData');
  attendanceTable.innerHTML = '<tr><th>User ID</th><th>Name</th><th>Action</th><th>Date & Time</th></tr>';
  
  // Get all users for name lookup
  const users = db.getUsers();
  
  attendanceData.forEach(record => {
    const user = users.find(u => u.id === record.userId);
    const userName = user ? user.name : 'Unknown';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.userId}</td>
      <td>${userName}</td>
      <td>${record.action === 'login' ? 'Check In' : 'Check Out'}</td>
      <td>${new Date(record.timestamp).toLocaleString()}</td>
    `;
    attendanceTable.appendChild(row);
  });
  
  if (attendanceData.length === 0) {
    attendanceTable.innerHTML += '<tr><td colspan="4" class="center">No attendance records found</td></tr>';
  }
}

// Admin logout
function adminLogout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}

// Initialize admin page
window.onload = checkAdminSession;