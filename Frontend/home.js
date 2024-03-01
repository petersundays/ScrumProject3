window.onload = async function() {

  sessionStorage.clear();
  const tokenValue = localStorage.getItem('token');
  let usernameLogged;
  
  if (tokenValue === null) {
    window.location.href = "index.html";
  } else {
    try {
        usernameLogged = await getUsername(tokenValue);
        getFirstName(tokenValue);
        getPhotoUrl(tokenValue);
        scrumMasterPage();
        await loadTasks(tokenValue);
        await getCategories(tokenValue);
    } catch (error) {
        
        console.error("An error occurred:", error);
        window.location.href = "index.html";
        
    }
  }
};

const tokenValue = localStorage.getItem('token');
let usernameLogged = getUsername(tokenValue);


function scrumMasterPage(){

  const usersButton = document.createElement('a');
  usersButton.href = 'users.html';
  usersButton.draggable = 'false';
  usersButton.innerText = 'Agile Users';

  let liElement = document.createElement('li');
  liElement.id = 'nav-users';

  liElement.appendChild(usersButton);
  document.getElementById('menu').appendChild(liElement);

}

function productOwnerPage(){

  const addUsersButton = document.createElement('a');
  addUsersButton.href = 'register.html';
  addUsersButton.draggable = 'false';
  addUsersButton.innerText = 'Add User';

  let liElement = document.createElement('li');
  liElement.id = 'nav-users';

  liElement.appendChild(addUsersButton);
  document.getElementById('menu').appendChild(liElement);

}

  function cleanAllTaskFields() {
    document.getElementById('warningMessage2').innerText = '';
    // Limpar os input fields depois de adicionar a task
    document.getElementById('taskName').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('task-startDate').value = '';
    document.getElementById('task-limitDate').value = '';
    removeSelectedPriorityButton();
    taskPriority = null;
  }



const tasks = document.querySelectorAll('.task')
const panels = document.querySelectorAll('.panel')

function attachDragAndDropListeners(task) { // Adiciona os listeners de drag and drop a uma tarefa criada dinamicamente
  task.addEventListener('dragstart', () => {
      task.classList.add('dragging')
      console.log('added dragging');
  });

  task.addEventListener('dragend', async () => {
      task.classList.remove('dragging')
      removeAllTaskElements();
      await updateTaskStatus(localStorage.getItem('token'), task.id, task.stateId);
      await loadTasks(tokenValue);    
  });
}

panels.forEach(panel => { 
  panel.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(panel, e.clientY);
    const task = document.querySelector('.dragging');
    console.log('banana' , e);
    
    const panelID = panel.id; 

    if (task !== null) {
      if (afterElement == null) {
        panel.appendChild(task);
        task.stateId = panelID;
      } else {
        panel.insertBefore(task, afterElement);
        task.stateId = panelID;
      }
    }
  })
})

async function updateTaskStatus(token, taskId, newStatus) {

  console.log('Entrei no updateTasksatus');

  let numericStatus;
  switch (newStatus) {
    case "todo":
      numericStatus = 100;
      break;
    case "doing":
      numericStatus = 200;
      break;
    case "done":
      numericStatus = 300;
      break;
    default:
      console.error('Invalid status:', newStatus);
      console.log('numericStatus: ', numericStatus);
      return numericStatus;
  }

  console.log('numericStatus: ', numericStatus);

  const updateTaskUrl = `http://localhost:8080/project_backend/rest/users/tasks/${taskId}/${numericStatus}`;
  try {
    console.log('Entrei no try', updateTaskUrl, taskId, numericStatus, token);
    const response = await fetch(updateTaskUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        token: token
      },
      body: JSON.stringify(numericStatus)
    });
    if (response.ok) {
      console.log('Task status updated successfully');
      
    } else {
      console.error('Error updating task status:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

function getDragAfterElement(panel, y) {
  const draggableElements = [...panel.querySelectorAll('.task:not(.dragging)')] // Dentro da lista de painéis, seleciona todos os elementos com a classe task que nao tenham a classe dragging  
  return draggableElements.reduce((closest, child) => { // Retorna o elemento mais próximo do que esáa a ser arrastado e que está a ser comparado
      const box = child.getBoundingClientRect() // Retorna o tamanho do elemento e a sua posição relativamente ao viewport
      const offset = y - box.top - box.height / 2 // Calcula a distância entre o elemento que está a ser arrastado e o que está a ser comparado
      if (offset < 0 && offset > closest.offset) { // Se a distância for menor que 0 e maior que a distância do elemento mais próximo até agora
          return { offset: offset, element: child }
      } else { //
          return closest // Retorna o elemento mais próximo até agora
      }
  }, { offset: Number.NEGATIVE_INFINITY }).element}

// Definir os botões de priority
const lowButton = document.getElementById("low-button-home");
const mediumButton = document.getElementById("medium-button-home");
const highButton = document.getElementById("high-button-home");
let taskPriority;


function setPriorityButtonSelected(button, priority) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  taskPriority = priority;
}

function removeSelectedPriorityButton() {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach(btn => btn.classList.remove("selected"));
}

// Event listeners para os botões priority
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton, "low"));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton, "medium"));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton, "high"));

async function getCategories(tokenValue) {
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  defaultOption.textContent = 'Select Category';
  document.getElementById("task-category").appendChild(defaultOption);

  let categories = await getAllCategories(tokenValue);
  
  categories.forEach(category => {
    let option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    document.getElementById("task-category").appendChild(option);
  });
}



async function getAllCategories(tokenValue) {
  
    let getCategories = "http://localhost:8080/project_backend/rest/users/categories";
      
      try {
          const response = await fetch(getCategories, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  token: tokenValue
              },    
          });
  
          if (response.ok) {
            const categories = await response.json();
            return categories;
  
          } else if (response.status === 401) {
            alert("Invalid credentials")
          } else if (response.status === 404) {
            alert("No categories found")
          }
  
      } catch (error) {
          console.error('Error:', error);
          alert("Something went wrong");
      }
  }


async function newTask(tokenValue, task) {

  const usernameLogged = await getUsername(tokenValue);
  let newTask = `http://localhost:8080/project_backend/rest/users/${usernameLogged}/addTask`;
    
    try {
        const response = await fetch(newTask, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                username: usernameLogged,
                token: tokenValue
            },    
            body: JSON.stringify(task)
        });

          if (response.ok) {
            alert("Task created successfully");
          } else if (response.status === 401) {
            alert("Invalid credentials")
          } else if (response.status === 404) {
            alert("Impossible to create task. Verify all fields")
          }
      
    } catch (error) {
        console.error('Error:', error);
        alert("Task not created. Something went wrong");
    }
  };


  async function getAllUsersTasks(tokenValue) {

  const usernameLogged = await getUsername(tokenValue);
    let getTasks = `http://localhost:8080/project_backend/rest/users/${usernameLogged}/tasks`;
      
      try {
          const response = await fetch(getTasks, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  username: usernameLogged,
                  token: tokenValue
              },    
          });
  
            if (response.ok) {
              const tasks = await response.json(); 
              return tasks;
            } else if (response.status === 401) {
              alert("Invalid credentials")
            } else if (response.status === 406) {
              alert("Unauthorized access")
            }
        
      } catch (error) {
          console.error('Error:', error);
          alert("Task not created. Something went wrong");
      }
    };


function createTask(title, description, priority, startDate, limitDate, categoryName) { // Cria uma nova task com os dados inseridos pelo utilizador
  let todoStateId = 'todo';
  let newPriority = parsePriorityToInt(priority);
  const category = {
    name: categoryName
  } 
  const task = {
  title: title,
  description: description,
  stateId: parseStateIdToInt(todoStateId),
  priority: newPriority,
  startDate: startDate,
  limitDate: limitDate,
  category: category
  }
  return task;
}

 // Event listener do botão add task para criar uma nova task e colocá-la no painel To Do (default para qualquer task criada)
 document.getElementById('addTask').addEventListener('click', function() {

  let description = document.getElementById('taskDescription').value.trim();
  let title = document.getElementById('taskName').value.trim();
  let priority = taskPriority;
  let startDate = document.getElementById('task-startDate').value;
  let limitDate = document.getElementById('task-limitDate').value;
  let categoryName = document.getElementById('task-category').value;
            
  if (title === '' || description === '' || priority === null || startDate === '' || limitDate === '' || startDate > limitDate || document.getElementsByClassName('selected').length === 0 || document.getElementById('task-category').value === ''){
      document.getElementById('warningMessage2').innerText = 'Fill in all fields, define a priority and select a category';
  } else {
    let task = createTask(title, description, priority, startDate, limitDate, categoryName);
    
    newTask(tokenValue, task).then (async() => {
      removeAllTaskElements();
      await loadTasks(tokenValue);
      cleanAllTaskFields();
    });
  }
});

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.id = task.id;
  task.priority = parsePriorityToString(task.priority);
  taskElement.priority = task.priority;
  taskElement.classList.add('task'); 
  if (task.priority === 'low') {
    taskElement.classList.add('low');
  } else if (task.priority === 'medium') {
    taskElement.classList.add('medium');
  } else if (task.priority === 'high') {
    taskElement.classList.add('high');
  }
  taskElement.draggable = true;
  taskElement.description = task.description;
  taskElement.title = task.title;
  taskElement.stateId = task.stateId;

  const postIt = document.createElement('div');
  postIt.className = 'post-it';

  const taskTitle = document.createElement('h3');
  taskTitle.textContent = task.title;
  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'post-it-text';
  const displayDescription = document.createElement('p');
  displayDescription.textContent = task.description;

  const deleteButton = document.createElement('img');
  deleteButton.src = 'multimedia/dark-cross-01.png';
  deleteButton.className = 'apagarButton';
  deleteButton.dataset.taskId = task.id;


  descriptionContainer.appendChild(displayDescription);
  postIt.appendChild(taskTitle);
  postIt.appendChild(deleteButton);
  postIt.appendChild(descriptionContainer); 
  taskElement.appendChild(postIt);

  taskElement.addEventListener('dblclick', function () {
    sessionStorage.setItem("taskId", taskElement.id);
    window.location.href = 'task.html';
  });

  return taskElement;
}

document.addEventListener('click', function (event) {
  if (event.target.matches('.apagarButton')) {
    const taskElement = event.target.closest('.task');
    const taskId = event.target.dataset.taskId;

    const deletemodal = document.getElementById('delete-modal');
    deletemodal.style.display = "grid";

    function deleteButtonClickHandler() {
      deleteTask(taskId, usernameLogged, tokenValue);
      taskElement.remove();
      deletemodal.style.display = "none";
      deletebtn.removeEventListener('click', deleteButtonClickHandler); 
    }

    const deletebtn = document.getElementById('delete-button');
    deletebtn.addEventListener('click', deleteButtonClickHandler);

    const cancelbtn = document.getElementById('cancel-delete-button');
    cancelbtn.addEventListener('click', () => {
      deletemodal.style.display = "none";
    });
  }
});


// Carrega as tarefas guardadas na local storage
async function loadTasks(tokenValue) {
  getAllUsersTasks(tokenValue).then(tasksArray => {
      tasksArray.forEach(task => {
      const taskElement = createTaskElement(task);
      
      if (!taskElement) {
        return;
      }

      task.stateId = parseStateIdToString(task.stateId);
      const panel = document.getElementById(task.stateId);
      
      if (!panel) {
        console.error('Panel not found for stateId:', task.stateId);
        return;
      }
      panel.appendChild(taskElement);
      attachDragAndDropListeners(taskElement);
    });
  }).catch(error => {
    console.error('Error:', error);
    alert("Something went wrong while loading tasks");
  });
}


function removeAllTaskElements() {
  const tasks = document.querySelectorAll('.task');
  tasks.forEach(task => task.remove());
}

function parseStateIdToString (stateId) {
  let newStateId = '';
  if(stateId === 100) {
    newStateId = 'todo';
  } else if(stateId === 200) {
    newStateId = 'doing';
  } else if(stateId === 300) {
    newStateId = 'done';
  }
  return newStateId;
}

function parseStateIdToInt (stateId) {
  let newStateId = 0;
  if(stateId === 'todo') {
    newStateId = 100;
  } else if(stateId === 'doing') {
    newStateId = 200;
  } else if(stateId === 'done') {
    newStateId = 300;
  }
  return newStateId;
}

function parsePriorityToString (priority) {
  let newPriority = '';
  if(priority === 100) {
    newPriority = 'low';
  } else if(priority === 200) {
    newPriority = 'medium';
  } else if(priority === 300) {
    newPriority = 'high';
  }
  return newPriority;
}

function parsePriorityToInt (priority) {
  let newPriority = 0;
  if(priority === 'low') {
    newPriority = 100;
  } else if(priority === 'medium') {
    newPriority = 200;
  } else if(priority === 'high') {
    newPriority = 300;
  }
  return newPriority;
}

async function eraseTask(tokenValue, taskId) {

  let eraseTask = `http://localhost:8080/project_backend/rest/users/${taskId}`;
      
      try {
          const response = await fetch(eraseTask, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': '*/*',
                  token: tokenValue
              },    
          });
  
            if (response.ok) {
              alert("Task deleted successfully");
            } else if (response.status === 401) {
              alert("Invalid credentials")
            } else if (response.status === 404) {
              alert("Something went wrong. The task was not deleted.")
            }
        
      } catch (error) {
          console.error('Error:', error);
          alert("Task was not deleted. Something went wrong");
      }
    }

async function deleteTask(id, tokenValue) {
   
  const usernameLogged = await getUsername(tokenValue);
  let deleteTaskUrl = `http://localhost:8080/project_backend/rest/users/${usernameLogged}/${id}`;

  try {
    const response = await fetch(deleteTaskUrl, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        username: usernameLogged,
        token: tokenValue
      },
    });

    if (response.ok) {
      
      console.log('Task deleted successfully');
    } else {
      console.error('Error deleting task:', response.statusText);
    }

  } catch (error) {
    console.error('Error deleting task:', error);
  }
}


window.onclose = function () { // Guarda as tarefas na local storage quando a página é fechada

  localStorage.clear();
}

//LOGOUT 
document.getElementById("logout-button-header").addEventListener('click', async function() {

  let logoutRequest = "http://localhost:8080/project_backend/rest/users/logout";
    
    try {   
        const response = await fetch(logoutRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                token: tokenValue
            }, 
        });
        if (response.ok) {
            
          localStorage.clear();

          window.location.href="index.html";

        } 
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
})


async function getFirstName(tokenValue) {

  let firstNameRequest = "http://localhost:8080/project_backend/rest/users/getFirstName";
    
    try {
        const response = await fetch(firstNameRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                token: tokenValue
            },    
        });

        if (response.ok) {

          const data = await response.text();
          document.getElementById("first-name-label").innerText = data;

        } else if (!response.ok) {
            alert("Invalid credentials")
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}

async function getPhotoUrl(tokenValue) {

  
  let photoUrlRequest = "http://localhost:8080/project_backend/rest/users/getPhotoUrl";
    
    try {
        const response = await fetch(photoUrlRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                token: tokenValue,
            },    
        });

        if (response.ok) {

          const data = await response.text();
          document.getElementById("profile-pic").src = data;

        } else if (response.stateId === 401) {
            alert("Invalid credentials")
        } else if (response.stateId === 404) {
          alert("teste 404")
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}

async function getUsername(tokenValue) {

  let firstNameRequest = "http://localhost:8080/project_backend/rest/users/getUsername";
    
    try {
        const response = await fetch(firstNameRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                token: tokenValue
            },    
        });

        if (response.ok) {

          const data = await response.text();
          return data;

        } else if (!response.ok) {
            alert("Invalid credentials")
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}