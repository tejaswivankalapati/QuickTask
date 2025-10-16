const newTaskInput = document.getElementById('new-task');
const dueDateInput = document.getElementById('due-date');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ------------------ Functions ------------------

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const span = document.createElement('span');
    span.textContent = task.text + (task.dueDate ? ` (Due: ${new Date(task.dueDate).toLocaleString()})` : '');
    span.addEventListener('click', () => toggleComplete(index));

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.addEventListener('click', () => deleteTask(index));

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = newTaskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!text) return alert('Enter a task first!');
  
  const newTask = { text, dueDate, completed: false };
  tasks.push(newTask);
  saveTasks();
  renderTasks();

  newTaskInput.value = '';
  dueDateInput.value = '';
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function applyFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
  renderTasks();
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

// ------------------ Event Listeners ------------------

addBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompleted);
filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
themeToggle.addEventListener('click', toggleTheme);

// ------------------ Init ------------------

(function init() {
  renderTasks();

  // Restore theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
})();
