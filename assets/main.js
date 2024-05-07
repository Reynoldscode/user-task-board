

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Create a function to create a task card
function createTaskCard(task) {
  const taskCard = document.createElement('div');
  taskCard.className = 'card mb-3';
  taskCard.draggable = true;
  taskCard.setAttribute('data-id', task.id);
  taskCard.setAttribute('data-status', task.status); // Set status attribute dynamically

  // Set background color based on status
  if (task.status === 'todo') {
    taskCard.style.backgroundColor = 'green';
  } else if (task.status === 'in-progress') {
    taskCard.style.backgroundColor = 'yellow';
    taskCard.style.color = 'black'; // Change font color to black for in-progress tasks
  } else if (task.status === 'done') {
    taskCard.style.backgroundColor = 'red';
  }

  taskCard.innerHTML = `
    <h5 class="card-title">${task.title}</h5>
    <p class="card-text">${task.description}</p>
    <p class="card-text">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
    <button class="btn btn-danger delete-button">Delete</button>
  `;
  const deleteButton = taskCard.querySelector(".delete-button");
  deleteButton.addEventListener("click", handleDeleteTask);
  
  // Add dragstart event listener
  taskCard.addEventListener('dragstart', function(event) {
    event.dataTransfer.setData('text/plain', task.id);
    console.log('Drag started from card:', task.id);
  });

  return taskCard;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoCardsContainer = document.getElementById('todo-cards');
  const inProgressCardsContainer = document.getElementById('in-progress-cards');
  const doneCardsContainer = document.getElementById('done-cards');

  todoCardsContainer.innerHTML = '';
  inProgressCardsContainer.innerHTML = '';
  doneCardsContainer.innerHTML = '';
  // todoCardsContainer.innerHTML = '';
  
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);
    if (task.status == "todo") {
      todoCardsContainer.appendChild(taskCard);
    } else if (task.status === 'in-progress') {
        inProgressCardsContainer.appendChild(taskCard);
    } else if (task.status === 'done') {
      doneCardsContainer.appendChild(taskCard)
    }
  });
}

// Create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDate = document.getElementById('task-due-date').value;
  const task = {
    id: generateTaskId(),
    title,
    description,
    dueDate,
    status: 'todo' // Initial status is 'todo'
  };

 taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);
  const taskCard = createTaskCard(task);
  const todoCardsContainer = document.getElementById('todo-cards');
  if (todoCardsContainer.children.length === 0) {
    todoCardsContainer.style.display = 'block';
  }
  
  todoCardsContainer.appendChild(taskCard);
  $('#formModal').modal('hide');
  document.getElementById('formModal').style.display = 'none';
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-due-date').value = '';
}

// Create a function to handle deleting a task
function handleDeleteTask(event) {
  const card = event.target.closest('.card');
  const taskId = parseInt(card.getAttribute('data-id'));
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  card.remove();
}

function dragover(event) {
  event.preventDefault();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event) {
  event.preventDefault();
  const taskId = parseInt(event.dataTransfer.getData('text/plain'));
  const taskIndex = taskList.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    const newStatus = event.target.parentElement.id; 
    const sourceLane = event.target.closest('.lane').id;
    taskList[taskIndex].status = newStatus; 
    localStorage.setItem("tasks", JSON.stringify(taskList)); 

    // Render the updated task list
    renderTaskList();

    // If moving from progress to done, remove the task from the progress lane
    if (sourceLane === 'in-progress' && newStatus === 'done') {
      const taskCard = document.querySelector(`[data-id="${taskId}"]`);
      event.target.appendChild(taskCard);
      taskList[taskIndex].status = newStatus; // Update the status of the task
      // Update local storage
      localStorage.setItem("tasks", JSON.stringify(taskList));

      // Remove the task card from the progress lane
      const progressLane = document.getElementById('in-progress-cards');
      progressLane.removeChild(taskCard);
      return;
    }

    // If not moving from progress to done, continue with the original logic
    taskList[taskIndex].status = newStatus; 
    // Update local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList(); 

    // Remove the original card from its previous location
    const taskCard = document.querySelector(`[data-id="${taskId}"]`);
    taskCard.parentNode.removeChild(taskCard);

    // Append the dropped task card to the correct lane
    event.target.appendChild(taskCard);

    // Clear the source lane if it's not the same as the destination lane
    if (sourceLane !== newStatus) {
      const sourceLaneCards = document.getElementById(sourceLane + '-cards');
      sourceLaneCards.removeChild(taskCard);
    // Check if the source lane is 'To Do' and if it's empty, hide it
      if (sourceLane === 'todo' && sourceLaneCards.children.length === 0) {
        sourceLaneCards.style.display = 'none';
      }
      // Check if the destination lane is 'Done' and if it's not empty, prevent dropping
      if (newStatus === 'done' && event.target.children.length > 1) {
        event.preventDefault();
        return;
      }
    }
  }
}
// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
  renderTaskList();

  // Load tasks from local storage if available
  const storedTaskData = JSON.parse(localStorage.getItem("taskData"));
  if (storedTaskData) {
    taskData = storedTaskData;
    renderTaskList();
  }

  $('.lane').droppable({ drop: handleDrop });
  $('#add-task-button').on('click', handleAddTask);
  $('#todo-cards').on('dragstart', '.card', function(event) {
    console.log('Drag started from To-Do card');
  });
  $('#in-progress-cards, #done-cards').droppable({
    drop: function(event, ui) {
      console.log('Dropped in ' + event.target.id);
    }
  });
  $('#formModal').on('hidden.bs.modal', function() {
    $(this).find('form')[0].reset(); // Reset form fields
  });
});