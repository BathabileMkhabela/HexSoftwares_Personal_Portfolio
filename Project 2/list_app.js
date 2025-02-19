document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const taskTime = document.getElementById("taskTime");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const statsDiv = document.getElementById("stats");

  // Loading tasks from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Rendering tasks and update stats
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.toggle("completed", task.completed);
      li.classList.toggle("read", task.read); // For styling "read" tasks

      li.innerHTML = `
        <span class="task-name" data-index="${index}">${task.name} ${
        task.dueTime ? ` (${task.dueTime})` : ""
      }</span>
        <button class="edit" data-index="${index}">Edit</button>
        <button class="read" data-index="${index}">${
        task.read ? "Completed" : "InComplete"
      }</button>
        <button class="delete" data-index="${index}">Delete</button>
      `;
      taskList.appendChild(li);
    });
    updateStats();
  }

  // Adding a new task
  function addTask() {
    const taskName = taskInput.value.trim();
    const taskDueTime = taskTime.value;

    if (taskName) {
      const newTask = {
        name: taskName,
        dueTime: taskDueTime,
        completed: false,
        read: false,
      };
      tasks.push(newTask);
      taskInput.value = "";
      taskTime.value = "";
      saveTasks();
      renderTasks();
    } else {
      alert("Please enter a task.");
    }
  }

  // Toggle task completion
  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  // Mark a task as complete/incomplete
  function markAsRead(index) {
    tasks[index].read = !tasks[index].read;
    saveTasks();
    renderTasks();
  }

  // Edit a task
  function editTask(index) {
    const newTaskName = prompt("Edit Task:", tasks[index].name);
    if (newTaskName !== null && newTaskName.trim() !== "") {
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

  // Saving tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update stats and encouragement message
  function updateStats() {
    const total = tasks.length;
    const readCount = tasks.filter((task) => task.read).length;
    const unreadCount = total - readCount;

    let message = "";
    if (total === 0) {
      message = "No tasks yet. Let's add some and get started!";
    } else if (unreadCount === 0) {
      message = "Excellent! You've read all your tasks. Keep up the great work!";
    } else {
      message = `You have ${readCount} task${
        readCount !== 1 ? "s" : ""
      } read and ${unreadCount} task${
        unreadCount !== 1 ? "s" : ""
      } unread. Keep going, you're doing great!`;
    }
    statsDiv.textContent = message;
  }

  // Event listeners
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Event delegation for dynamically created buttons
  taskList.addEventListener("click", (e) => {
    const index = e.target.getAttribute("data-index");
    if (index !== null) {
      if (e.target.classList.contains("edit")) {
        editTask(index);
      } else if (e.target.classList.contains("read")) {
        markAsRead(index);
      } else if (e.target.classList.contains("delete")) {
        removeTask(index);
      } else if (e.target.classList.contains("task-name")) {
        toggleTask(index);
      }
    }
  });

  // Initial render
  renderTasks();
});
