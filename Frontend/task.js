window.onload = async function() {

  const taskId = sessionStorage.getItem("taskId");
  const owner = sessionStorage.getItem("owner");
  console.log("OWNER ON LOAD: ", owner);
  const tokenValue = localStorage.getItem('token');
  const user = await getUser(tokenValue);
  let usernameLogged;
  
  if (tokenValue === null) {
    window.location.href = "index.html";
  } else { 
    try {
        usernameLogged = await getUsername(tokenValue);
        const task = await taskToShow(tokenValue, taskId);
        console.log("Task: ", task);
        await getFirstName(tokenValue);
        await getPhotoUrl(tokenValue);
        await getCategories(task,tokenValue);
        pageToLoad(task, user);

    } catch (error) {
        
        console.error("An error occurred:", error);
        window.location.href = "index.html";
        
    }
  }
};

const taskId = sessionStorage.getItem("taskId");
const DEVELOPER = 100;
const SCRUM_MASTER = 200;
const PRODUCT_OWNER = 300;

async function taskToShow (tokenValue, taskId) {
  const allTasks = await getAllTasks(tokenValue);
  let task = null;
  allTasks.forEach(t => {
    if (t.id == taskId) {
      task = t;
    }
  });
  return task;
}


function disableAllElements() {
  const elements = document.querySelectorAll("input, textarea, button, select");
  elements.forEach((element) => {
    element.disabled = true;
  });
  document.getElementById("save-button").remove();
  document.getElementById("cancel-button").remove();
 }

function pageToLoad(task, user) {
  if ((task.owner.username === user.username || user.typeOfUser === SCRUM_MASTER || user.typeOfUser === PRODUCT_OWNER) && task.erased === false) {
    showTask(task);
  } else if ((user.typeOfUser === SCRUM_MASTER || user.typeOfUser === PRODUCT_OWNER) && task.erased === true) {
    showTask(task);
    disableAllElements();
  } else {
    alert("You don't have permission to access this task");
    window.location.href = "home.html";
  }
}




// Definir os botões de status
const todoButton = document.getElementById("todo-button"); // Atribuir o elemento respetivo à variável todoButton
const doingButton = document.getElementById("doing-button"); // Atribuir o elemento respetivo à variável doingButton
const doneButton = document.getElementById("done-button"); // Atribuir o elemento respetivo à variável doneButton

// Definir os botões de priority
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

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

async function updateTask() {

  const priority = returnPriorityFromSelectedButton();
  const stateId = returnStateIdFromSelectedButton();
  const category = {
    name: document.getElementById("task-category-edit").value,
  }
  const categoryName = category.name;
  console.log('CategoryName = ', categoryName);


  startDate = document.getElementById("startDate-editTask").value.toString(),
  limitDate = document.getElementById("endDate-editTask").value.toString()


  const task = {
    id: taskId,
    title: document.getElementById("titulo-task").value,
    description: document.getElementById("descricao-task").value,
    priority: priority,
    stateId: stateId,
  };
  let updateTaskRequest = `http://localhost:8080/project_backend/rest/users/updatetask/${taskId}`;
  try {
    console.log("Task to update: ", task);
    const response = await fetch(updateTaskRequest, {
        method: "PUT",
        headers: {
          "Content-Type": "application/JSON",
          Accept: "*/*",
          token: localStorage.getItem("token"),
          categoryName: categoryName,
          startDate: startDate,
          limitDate: limitDate
        },
        body: JSON.stringify(task),
      }
    );

    console.log("Response: ", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else if (response.status === 404) {
      alert("Impossible to update task. Verify all fields");
    } else if (response.status === 403){
      alert("You don't have permission to update this task");
    } else {
      console.log("Task updated successfully");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Something went wrong");
    throw error; // Propagar o erro para ser tratado no catch do bloco que chamou a função
  }
}

async function updateDates(taskId, startDate, limitDate) {
  const dates = {
    startDate: startDate,
    limitDate: limitDate
  
  }
  let updateDatesRequest = `http://localhost:8080/project_backend/rest/users/${taskId}/dates`;
  try {
    console.log("Dates to update: ", dates);
    const response = await fetch(updateDatesRequest, {
        method: "PUT",
        headers: {
          "Content-Type": "application/JSON",
          Accept: "*/*",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(dates),
      }
    );

    console.log("Response: ", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else if (response.status === 404) {
      alert("Impossible to update dates. Verify all fields");
    } else {
      console.log("Dates updated successfully");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Something went wrong");
    throw error; // Propagar o erro para ser tratado no catch do bloco que chamou a função
  }
}

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

async function getAllTasksFromUser(tokenValue) {

  const usernameLogged = localStorage.getItem('username');
  console.log("Username ENDPOINT: ", usernameLogged);
    let getTasks = `http://localhost:8080/project_backend/rest/users/${usernameLogged}/tasks`;
      
      try {
        console.log("Entrein no try do getTasks");
          const response = await fetch(getTasks, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  token: tokenValue
              },    
          });
  
            if (response.ok) {
              const tasks = await response.json(); 
              //console.log("Tasks: ", tasks);
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

async function getAllTasks(tokenValue) {

  let getAllTasks = `http://localhost:8080/project_backend/rest/users/tasks`;

  try {
      const response = await fetch(getAllTasks, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/JSON',
              'Accept': '*/*',
              token: tokenValue
          },    
      });

      if (response.ok) {
        const tasks = await response.json();
        return tasks;

      } else if (response.status === 401) {
        alert("Invalid credentials")
      } else if (response.status === 404) {
        alert("No tasks found")
      }

  } catch (error) {
      console.error('Error:', error);
      alert("Something went wrong");
  }
}

function showTask(task) {
  if (task) {
    document.getElementById("titulo-task").textContent = task.title; // Colocar o título no input title
    document.getElementById("descricao-task").textContent = task.description; // Colocar a descrição na text area
    document.getElementById("tasktitle").innerHTML = task.title; // Colocar o título no título da página
    document.getElementById("startDate-editTask").value = task.startDate;
    document.getElementById("endDate-editTask").value = task.limitDate;
    
  

    let taskStateId = task.stateId;
  
    if (taskStateId == 100) {
      todoButton.classList.add("selected");
      setStatusButtonSelected(todoButton);
    } else if (taskStateId == 200) {
      doingButton.classList.add("selected");
      setStatusButtonSelected(doingButton);
    } else if (taskStateId == 300) {
      doneButton.classList.add("selected");
      setStatusButtonSelected(doneButton);
    }

    let taskPriority = task.priority;

    if (taskPriority == 100) {
      lowButton.classList.add("selected");
      setPriorityButtonSelected(lowButton);
    } else if (taskPriority == 200) {
      mediumButton.classList.add("selected");
      setPriorityButtonSelected(mediumButton);
    } else if (taskPriority == 300) {
      highButton.classList.add("selected");
      setPriorityButtonSelected(highButton);
    }
  } else {
    alert("Task not found");
    sessionStorage.clear();
    window.location.href = "home.html";
  }
}


// Event listeners para os botões status
todoButton.addEventListener("click", () => setStatusButtonSelected(todoButton));
doingButton.addEventListener("click", () => setStatusButtonSelected(doingButton));
doneButton.addEventListener("click", () => setStatusButtonSelected(doneButton));

// Event listeners para os botões priority
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton));

const cancelbutton = document.getElementById("cancel-button");

cancelbutton.addEventListener("click", () => {
  // Abrir o modal de cancel
  const cancelModal = document.getElementById("cancel-modal");
  cancelModal.style.display = "block";

  const cancelButton = document.getElementById("continue-editing-button");
  cancelButton.addEventListener("click", () => {
    window.location.href = "task.html";
  });

  // Event listener para o botão de confirmação
  const confirmButton = document.getElementById("confirm-cancel-button");
  confirmButton.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "home.html";
  });

  cancelModal.style.display = "grid";
});

// Função para definir o estado no grupo de botões status
function setStatusButtonSelected(button) {
  const buttons = [todoButton, doingButton, doneButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
}

// Função para definir o estado no grupo de botões priority
function setPriorityButtonSelected(button) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
}

async function getCategories(task,tokenValue) {
  const defaultOption = document.createElement('option');
  //defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  defaultOption.textContent = task.category.name;
  defaultOption.value = task.category.name;
  document.getElementById("task-category-edit").appendChild(defaultOption); 

  let categories = await getAllCategories(tokenValue);
  
  categories.forEach(category => {
    let option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    document.getElementById("task-category-edit").appendChild(option);
  });
}

function parseStateIdToInt(stateId) {
  const TODO = 100;
  const DOING = 200;
  const DONE = 300;

  let newStateId = 0;
  if (stateId === "todo" || stateId === "to do") {
    newStateId = TODO;
  } else if (stateId === "doing") {
    newStateId = DOING;
  } else if (stateId === "done") {
    newStateId = DONE;
  }
  return newStateId;
}

function parsePriorityToInt(priority) {
  const LOW = 100;
  const MEDIUM = 200;
  const HIGH = 300;

  let newPriority = 0;
  if (priority === "low") {
    newPriority = LOW;
  } else if (priority === "medium") {
    newPriority = MEDIUM;
  } else if (priority === "high") {
    newPriority = HIGH;
  }
  return newPriority;
}

function returnPriorityFromSelectedButton() {
  const buttons = [lowButton, mediumButton, highButton];
  let selectedButton = null;
  buttons.forEach((btn) => {
    if (btn.classList.contains("selected")) {
      selectedButton = btn;
    }
  });
  const priorityInt = parsePriorityToInt(selectedButton.innerText.toLowerCase());
  return priorityInt;
} 

function returnStateIdFromSelectedButton() {
  const buttons = [todoButton, doingButton, doneButton];
  let selectedButton = null;
  buttons.forEach((btn) => {
    if (btn.classList.contains("selected")) {
      selectedButton = btn;
    }
  });
  const stateIdInt = parseStateIdToInt(selectedButton.innerText.toLowerCase());
  return stateIdInt;
}

// Event listener para o botão save
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", async () => {

  try {
      await updateTask();
      alert("Task updated successfully");
      sessionStorage.clear();
      window.location.href = "home.html";
   
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while updating the task");
  }
});

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

document.getElementById("logout-button-header").addEventListener('click', async function() {

  let logoutRequest = "http://localhost:8080/project_backend/rest/users/logout";
     const tokenValue = localStorage.getItem('token');
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
});

async function getUser (tokenValue) {
  const usernameLogged = await getUsername(tokenValue);
  let getUserRequest = `http://localhost:8080/project_backend/rest/users/${usernameLogged}`;
      
      try {
          const response = await fetch(getUserRequest, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  token: tokenValue
              },    
          });
  
          if (response.ok) {
            const user = await response.json();
            return user;
  
          } else if (!response.ok) {
              alert("Invalid username on path")
          } else if (response.status === 401) {
            alert("Invalid credentials")
          }
  
      } catch (error) {
          console.error('Error:', error);
          alert("Something went wrong");
      }
  }
