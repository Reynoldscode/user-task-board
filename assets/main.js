// Get the popup form and button
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const popupForm = document.getElementById('formModal');
const addButton = document.getElementById('add-task-button');
const taskListContainer = document.getElementById('task-list');

taskList = [];

function generateTaskId() {
  return nextId++
}

function addTaskToList(task) {
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  console.log(task)
}

// Add the task to the page
function addTask(title, dueDate, description) {
  const task = {
    id: generateTaskId(),
    title,
    dueDate,
    description,
  };
  addTaskToList(task);
  renderTaskList();
}

// Add event listener to the form to handle submission
addButton.addEventListener('click', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const dueDate = document.getElementById('task-due-date').value;
  const description = document.getElementById('task-description').value;
  const dueDateParsed = dayjs(dueDate);
  addTask(title, dueDateParsed, description);
  document.getElementById('task-title').value = '';
  document.getElementById('task-due-date').value = '';
  document.getElementById('task-description').value = '';
  popupForm.style.display = 'none';
  popupForm.style.display = "block";
});

// Function to render the task list
function renderTaskList() {
  const todoCardsContainer = document.getElementById('todo-cards');
  todoCardsContainer.innerHTML = '';
  taskList.forEach((task) => {
    const taskCard = document.createElement('div');
    taskCard.className = 'card mb-3';
    taskCard.innerHTML = `
      <h5 class="card-title">${task.title}</h5>
      <p class="card-text">${task.description}</p>
      <p class="card-text">Due: ${task.dueDate}</p>
    `;
    
    // Make the task card draggable
    taskCard.draggable = true; 
    taskCard.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData('text', task.id);
      console.log("Drag started for task:", task.title);
    });
    todoCardsContainer.appendChild(taskCard);
    console.log("Task card appended:", task.title);
  });
}

// Add event listeners for dragover and drop
const inProgressCardsContainer = document.getElementById('in-progress-cards');
const doneCardsContainer = document.getElementById('done-cards');

inProgressCardsContainer.addEventListener('dragover', (e) => {
  allowDrop(e);
  console.log("Drag over in progress container");
});

inProgressCardsContainer.addEventListener('drop', (e) => {
  console.log("Drop event triggered");
  drop(e);
});

doneCardsContainer.addEventListener('dragover', (e) => {
  allowDrop(e);
  console.log("Drag over done container");
});

doneCardsContainer.addEventListener('drop', (e) => {
  console.log("Drop event triggered");
  drop(e);
});

function allowDrop(e) {
  e.preventDefault();
  console.log("Allowed drop");
}

function drop(e) {
  e.preventDefault();
  console.log("Dropped");


  // Rest of the drop function code
}

function drop(e) {
  e.preventDefault();
  console.log("Dropped");
  const taskId = e.dataTransfer.getData('text'); // Get the task ID from the data transfer
  const task = taskList.find((task) => task.id === parseInt(taskId)); // Find the task by ID
  if (task) {
    // Move the task to the "In Progress" or "Done" list
    taskList.splice(taskList.indexOf(task), 1);
    renderTaskList();
    const taskCard = document.createElement('div');
    taskCard.className = 'card mb-3';
    taskCard.innerHTML = `
      <h5 class="card-title">${task.title}</h5>
      <p class="card-text">${task.description}</p>
      <p class="card-text">Due: ${task.dueDate}</p>
    `;
    if (e.target.id === 'in-progress-cards') {
      inProgressCardsContainer.appendChild(taskCard); // Append the task card to the "In Progress" container
      task.status = 'in-progress'; // Update the task status
    } else {
      doneCardsContainer.appendChild(taskCard); // Append the task card to the "Done" container
      task.status = 'done'; // Update the task status
    }
  }
}
