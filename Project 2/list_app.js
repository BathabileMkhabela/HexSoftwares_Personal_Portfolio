// Get elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const statsDiv = document.getElementById('stats');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks and update stats
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.classList.toggle('read', task.read); // For styling "read" tasks

    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.name}</span>
      <button class="edit" onclick="editTask(${index})">Edit</button>
      <button class="read" onclick="markAsRead(${index})">${task.read ? 'Unread' : 'Read'}</button>
      <button class="delete" onclick="removeTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
  updateStats();
}

// Add a new task
function addTask() {
  const taskName = taskInput.value.trim();
  if (taskName) {
    const newTask = { name: taskName, completed: false, read: false };
    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
}

// Toggle task completion (if needed)
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Mark a task as read/unread
function markAsRead(index) {
  tasks[index].read = !tasks[index].read;
  saveTasks();
  renderTasks();
}

// Edit a task
function editTask(index) {
  const newTaskName = prompt('Edit Task:', tasks[index].name);
  if (newTaskName !== null && newTaskName.trim() !== '') {
    tasks[index].name = newTaskName.trim();
    saveTasks();
    renderTasks();
  }
}

// Remove a task
function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update the stats and encouragement message
function updateStats() {
  const total = tasks.length;
  const readCount = tasks.filter(task => task.read).length;
  const unreadCount = total - readCount;
  
  let message = "";
  if (total === 0) {
    message = "No tasks yet. Let's add some and get started!";
  } else if (unreadCount === 0) {
    message = "Excellent! You've read all your tasks. Keep up the great work!";
  } else {
    message = `You have ${readCount} task${readCount !== 1 ? 's' : ''} read and ${unreadCount} task${unreadCount !== 1 ? 's' : ''} unread. Keep going, you're doing great!`;
  }
  statsDiv.textContent = message;
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initial render
renderTasks();
