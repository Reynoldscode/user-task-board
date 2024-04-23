// Get the popup form and button
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"))  || 0;

const popupForm = document.getElementById('formModal');
const addButton = document.getElementById('add-task-button');
const taskListContainer = document.getElementById('task-list');

function generateTaskId(){
  return nextId
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
popupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const dueDate = document.getElementById('task-due-date').value;
  const description = document.getElementById('task-description').value;
  const dueDateParsed = dayjs(dueDate);
  addTask(title, dueDateParsed, description);
  document.getElementById('task-title').value = '';
  document.getElementById('task-due-date').value = '';
  document.getElementById('task-description').value = '';
  popupForm.style.display='none';
});

  // Clear the form inputs
  document.getElementById('task-title').value = '';
  document.getElementById('task-due-date').value = '';
  document.getElementById('task-description').value = '';
