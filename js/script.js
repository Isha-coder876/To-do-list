let tasks = [];
let currentFilter = 'all';

// Load tasks from memory on page load
function loadTasks() {
    // Tasks persist in memory during the session
    renderTasks();
    updateStats();
}

// Add new task
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    input.value = '';

    renderTasks();
    updateStats();
}

// Handle Enter key press
function handleEnter(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

// Toggle task completion
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );

    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    renderTasks();
    updateStats();
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    const completedCount = tasks.filter(task => task.completed).length;

    if (completedCount === 0) {
        return;
    }

    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    updateStats();
}

// Render tasks
function renderTasks() {
    const tasksList = document.getElementById('tasksList');

    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Check if there are no tasks
    if (filteredTasks.length === 0) {
        let emptyMessage = 'No tasks yet. Add one to get started!';
        if (currentFilter === 'pending') {
            emptyMessage = 'No pending tasks. Great job! 🎉';
        } else if (currentFilter === 'completed') {
            emptyMessage = 'No completed tasks yet. Keep working! 💪';
        }

        tasksList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <div class="empty-state-text">${emptyMessage}</div>
                    </div>
                `;
        return;
    }

    // Render tasks
    tasksList.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <div class="checkbox ${task.completed ? 'checked' : ''}" 
                         onclick="toggleTask(${task.id})">
                    </div>
                    <div class="task-text">${task.text}</div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
                </div>
            `).join('');
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// Initialize app
window.addEventListener('load', loadTasks);