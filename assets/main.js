
const popupForm = document.getElementById('formModal');
const addButton = document.getElementById('add-task-button');
const taskListContainer = document.getElementById('task-list');
const todoCardsContainer = document.getElementById('todo-cards');
const inProgressCardsContainer = document.getElementById('in-progress-cards');
const doneCardsContainer = document.getElementById('done-cards');

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
let storedTasks = [];

window.onload = function () {
  let storedData = JSON.parse(localStorage.getItem("tasks"));
  if (storedData) {
    taskList = storedData;
  }
  renderTaskList();
};

function generateTaskId() {
  return nextId++;
}

function addTaskToList(task) {
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);
  storeCardData(taskList);
  console.log(task);
}

function storeCardData() {
  const storedData = JSON.parse(localStorage.getItem("taskCard"));
  if (storedData) {
    taskList = taskList.concat(storedData);
  }
}

// Add the task to the page
function addTask(title, dueDate, description) {
  const task = {
    id: generateTaskId(),
    title,
    dueDate,
    description,
    status: 'to-do'
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
  popupForm.style.display = "block";
});
function exampleDrag(e){
  console.log("drag")
  // const id = e.target.getAttribute("id")
  // e.dataTransfer.setData("text/plain", id)
}
// Function to render the task list
function renderTaskList() {
  todoCardsContainer.innerHTML = '';
  inProgressCardsContainer.innerHTML = '';
  doneCardsContainer.innerHTML = '';

  taskList.forEach((task) => {
    const taskCard = document.createElement('div');
    taskCard.className = 'card mb-3';
    taskCard.draggable = true; // Add the draggable attribute
    taskCard.id = 1
    taskCard.setAttribute("ondragStart", "exampleDrag(event)")
    // taskCard.ondragstart = exampleDrag();


    // Constructing task card
    taskCard.innerHTML = `
      <h5 class="card-title">${task.title}</h5>
      <p class="card-text">${task.description}</p>
      <p class="card-text">Due: ${task.dueDate}</p>
      <button class="btn btn-danger delete-button">Delete</button>
    `;
    //  Add event listner for delete button
    const deleteButton = taskCard.querySelector(".delete-button");
    deleteButton.addEventListener("click", () =>{
      deleteTask(addTask)
    })

    // Add event listener for dragstart
    taskCard.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData('text/plain', task.id);
      console.log("Drag started for task:", todoCardsContainer);
    });

    // Append task card to the correct container
    if (task.status === 'to-do') {
      todoCardsContainer.appendChild(taskCard);
    } else if (task.status === 'in-progress') {
      inProgressCardsContainer.appendChild(taskCard);
    } else if (task.status === 'done') {
      doneCardsContainer.appendChild(taskCard);
    }
  });
}

// Function to handle drop event
function handleDrop(event) {
  event.preventDefault()
  console.log("drop");
 
  const taskId = event.dataTransfer.getData('text/plain');
  const task = taskList.find((task) => task.id === parseInt(taskId));
  renderTaskList();
  return tasks
  
}

function dragover(e){
  e.preventDefault()
}
