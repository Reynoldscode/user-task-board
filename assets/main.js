let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const formModal = document.getElementById('formModal');
const addTaskButton = document.getElementById('add-task-button');
const todoCardsContainer = document.getElementById('todo-cards');

addTaskButton.addEventListener('click', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDate = document.getElementById('task-due-date').value;

  formModal.classList.add("hidden");

  // Create a new task object
  const task = {
    title,
    description,
    dueDate,
  };

  // Add the new task to the array
      tasks.push(task);


  // Store the updated tasks array in localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));




// // Todo: create a function to generate a unique task id
// function generateTaskId() {

// }

// // Todo: create a function to create a task card
// function createTaskCard(task) {

// }

// // Todo: create a function to render the task list and make cards draggable
// function renderTaskList() {

// }

// // Todo: create a function to handle adding a new task
// function handleAddTask(event){

// }

// // Todo: create a function to handle deleting a task
// function handleDeleteTask(event){

// }

// // Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {

// }

// // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// $(document).ready(function () {

// });
