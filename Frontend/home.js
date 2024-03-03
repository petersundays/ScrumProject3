window.onload = async function() {

  sessionStorage.clear();
  const tokenValue = localStorage.getItem('token');
  const user = await getUser(tokenValue);
  const typeOfUser = await getTypeOfUser(tokenValue);

  console.log(typeOfUser);

  let usernameLogged;
  
  if (tokenValue === null) {
    window.location.href = "index.html";
  } else {
    try {
        cleanAllTaskFields();
        usernameLogged = await getUsername(tokenValue);

        getFirstName(tokenValue);
        getPhotoUrl(tokenValue);
      
        await pageToLoad(typeOfUser);
        await loadTasks(tokenValue, typeOfUser);
        await getCategories(tokenValue);
    } catch (error) {
        
        console.error("An error occurred:", error);
        window.location.href = "index.html";
        
    }
  }
};

const tokenValue = localStorage.getItem('token');
let usernameLogged = getUsername(tokenValue);
const DEVELOPER = 100;
const SCRUM_MASTER = 200;
const PRODUCT_OWNER = 300;


async function pageToLoad(typeOfUser) {
 if (parseInt(typeOfUser) === SCRUM_MASTER) {
    scrumMasterPage();

  }else if(parseInt(typeOfUser) === PRODUCT_OWNER){
    productOwnerPage();
}
}


function scrumMasterPage(){

  const usersButton = document.createElement('a');
  usersButton.href = 'users.html';
  usersButton.draggable = 'false';
  usersButton.innerText = 'Agile Users';

  let liElement = document.createElement('li');
  liElement.id = 'nav-users';

  liElement.appendChild(usersButton);
  document.getElementById('menu').appendChild(liElement);
  createSearchMenu();

}

function productOwnerPage(){

  scrumMasterPage();

  const addUsersButton = document.createElement('a');
  addUsersButton.href = 'register.html?fromAddUser=true';
  addUsersButton.draggable = 'false';
  addUsersButton.innerText = 'Add User';

  let liElement = document.createElement('li');
  liElement.id = 'nav-users';

  liElement.appendChild(addUsersButton);
  document.getElementById('menu').appendChild(liElement);
  createCategoriesMenu();
}

  function cleanAllTaskFields() {
    document.getElementById('warningMessage2').innerText = '';
    // Limpar os input fields depois de adicionar a task
    document.getElementById('taskName').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('task-startDate').value = '';
    document.getElementById('task-limitDate').value = '';
    document.getElementById('task-category').value = '';
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
      await loadTasks(tokenValue, await getTypeOfUser(tokenValue));    
  });
}

panels.forEach(panel => { 
  panel.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(panel, e.clientY);
    const task = document.querySelector('.dragging');
    
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
      return numericStatus;
  }


  const updateTaskUrl = `http://localhost:8080/project_backend/rest/users/tasks/${taskId}/${numericStatus}`;
  try {
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
    option.value = category.name;
    option.textContent = category.name;
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

  console.log(task);

  const usernameLogged = await getUsername(tokenValue);
  let newTask = `http://localhost:8080/project_backend/rest/users/${usernameLogged}/addTask`;
    
    try {
        const response = await fetch(newTask, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
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



  async function getAllTasksFromUser(tokenValue) {

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



async function getTasksByCategory(tokenValue, category) {

  let getTasks = `http://localhost:8080/project_backend/rest/users/tasks/${category}`;

  try {
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
      return tasks;

    } else if (response.status === 401) {
      alert("Invalid credentials")
    } else if (response.status === 404) {
      alert("No tasks found")
    } else if (response.status === 403) {
      alert("No tasks foundYou don't have permission for this request")
    }

  } catch (error) {
    console.error('Error:', error);
    alert("Something went wrong");
  }
}

async function getErasedTasks(tokenValue) {
  let getErasedTasks = `http://localhost:8080/project_backend/rest/users/erasedTasks`;

  try {
    const response = await fetch(getErasedTasks, {
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
    } else if (response.status === 403) {
      alert("You don't have permission for this request")
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert("Something went wrong");
  }
}



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
      await loadTasks(tokenValue, await getTypeOfUser(tokenValue));
      cleanAllTaskFields();
    });
  }
});

document.getElementById('nav-all-tasks').addEventListener('click', async function() {
  
  let button = document.getElementById('nav-all-tasks');
  let tasksButton = document.querySelector('#nav-all-tasks a');
  const userLogged = await getUser(tokenValue);
  const typeOfUser = userLogged.typeOfUser;

  removeAllTaskElements();
  
   if (button.classList.contains('selected')) {
    tasksButton.innerHTML= 'All Tasks';
    removeAllTaskElements();
    await loadTasks(tokenValue, await getTypeOfUser(tokenValue));
    button.classList.remove('selected');
   } else {
    button.classList.add('selected');
    tasksButton.innerHTML= 'My Tasks';
    await loadAllTasks(tokenValue, await getTypeOfUser(tokenValue));
}
});

async function createSearchMenu() {

  const searchNav = document.createElement('li');
  searchNav.id = 'nav-search-tasks';
  const searchLink = document.createElement('a');
  searchLink.innerText = "Search";
  searchNav.appendChild(searchLink);
  document.getElementById('menu').appendChild(searchNav);
  let users = await getAllUsers(tokenValue);
  let categories = await getAllCategories(tokenValue);

 

  searchNav.addEventListener('click', function() {
     
      removeAsideElements();
      createAsideSearchTasks();
      populateDropdownCategories(categories);
      populateDropdownUsers(users);
    
  });
}

async function createCategoriesMenu() {
  const categoriesNav = document.createElement('li');
  categoriesNav.id = 'nav-categories';
  const categoriesLink = document.createElement('a');
  categoriesLink.innerText = "Categories";
  categoriesNav.appendChild(categoriesLink);
  document.getElementById('menu').appendChild(categoriesNav);
  let categories = await getAllCategories(tokenValue);


  categoriesNav.addEventListener('click', function() {

      removeAsideElements();
      const asideElement = document.querySelector('aside');
      const asideTitle = document.createElement('h3');
      asideTitle.innerText = "Categories";
      asideElement.appendChild(asideTitle);
      createCategoriesMenuElements(asideElement);
      populateDropdownCategories(categories);
      createCategoryButtonsListeners()
  });
}


function removeAsideElements() {
 
  document.querySelector('aside').innerHTML = '';
}

function createAsideSearchTasks() {
  
  const asideElement = document.querySelector('aside');
  const asideTitle = document.createElement('h3');
  asideTitle.innerText = "Search Tasks";
  asideElement.appendChild(asideTitle);

  createUserSearchElements(asideElement);
  createUserSearchEventListeners();
  createCategoriesElements(asideElement);
  createCategoriesEventListeners();
  createDeletedTasksElements(asideElement);
  createDeletedTasksEventListeners();
  
}

function createAsideCategories() {
  createCategoriesElements(document.querySelector('aside'));
}



function createDefaultOption(dropdown, textContent) {
  dropdown.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  defaultOption.textContent = textContent;
  dropdown.appendChild(defaultOption);
}

function createUserSearchElements(asideElement) {
  const userLabel = document.createElement('label');
  userLabel.innerText = "User";
  userLabel.id = 'label-search-user';
  asideElement.appendChild(userLabel);

  const usernameInput = document.createElement('input');
  usernameInput.type = 'search';
  usernameInput.id = 'search-input-home';
  usernameInput.placeholder = 'Username';
  asideElement.appendChild(usernameInput);

  const dropdownUsers = document.createElement('select');
  dropdownUsers.id = 'usersType-home';
  dropdownUsers.name = 'usersType';
  dropdownUsers.textContent = 'Select User';
  asideElement.appendChild(dropdownUsers);

  const searchUserButton = document.createElement('button');
  searchUserButton.id = 'search-user-button';
  searchUserButton.innerText = "Search User's Tasks";
  asideElement.appendChild(searchUserButton);
}

function createUserSearchEventListeners() {

  const usernameInput = document.getElementById('search-input-home');
  const dropdownUsers = document.getElementById('usersType-home');
  const searchUserButton = document.getElementById('search-user-button');


  usernameInput.addEventListener('input', async function(event) {
    const searchValue = event.target.value.toLowerCase().trim(); 
    const users = await getAllUsers(tokenValue);
    let filteredUsers = [];
    for (i=0; i<users.length; i++) {
      if (users[i].username.toLowerCase()!== 'notassigned' || users[i].username.toLowerCase()!== 'admin') {
        filteredUsers.push(users[i]);
      } 
    }
    
    

        
        if (searchValue === '') {
            filteredUsers = users;
        } else {
            // Filtra os usuários com base no valor da pesquisa
            filteredUsers = users.filter(user => {
              
                
            // Verificar se o nome de usuário, primeiro nome, último nome ou e-mail contém o valor da pesquisa
            return (
                user.username.toLowerCase().includes(searchValue)
            );
            });
        }

    // Renderizar a tabela com os usuários filtrados
    populateDropdownUsers(filteredUsers);
});


  searchUserButton.addEventListener('click', async function() {
    let userLogged = await getUser(tokenValue);
    const typeOfUser = userLogged.typeOfUser;
    removeAllTaskElements();
    const allTasks = await getAllTasks(tokenValue);
    
    if (dropdownUsers.textContent === 'Select User' || dropdownUsers.textContent === '') {
      document.getElementById('nav-all-tasks').click();
    
    } else if (dropdownUsers.innerHTML !== 'Select User') {
      allTasks.forEach(task => {
        if (task.owner.username === dropdownUsers.options[dropdownUsers.selectedIndex].textContent) {
          const taskElement = createTaskElement(task, typeOfUser);
          task.stateId = parseStateIdToString(task.stateId);
          const panel = document.getElementById(task.stateId);
          panel.appendChild(taskElement);
          attachDragAndDropListeners(taskElement);
        }
      });
    }
    //createDefaultOption(dropdownUsers, 'Select User');
  });
}



function createCategoriesElements(asideElement) {
  const categoryLabel = document.createElement('label');
  categoryLabel.innerText = "Category";
  categoryLabel.id = 'label-search-category';
  asideElement.appendChild(categoryLabel);

  const categoryInput = document.createElement('input');
  categoryInput.type = 'search';
  categoryInput.id = 'search-category-home';
  categoryInput.placeholder = 'Category';
  asideElement.appendChild(categoryInput);

  const dropdownCategories = document.createElement('select');
  dropdownCategories.id = 'categoriesType-home';
  dropdownCategories.name = 'categoriesType';
  asideElement.appendChild(dropdownCategories);
  createSearchCategoriesButton(asideElement);
  

}

function createSearchCategoriesButton(asideElement) {
  const searchCategoryButton = document.createElement('button');
  searchCategoryButton.id = 'search-category-button';
  searchCategoryButton.innerText = 'Search Category';
  asideElement.appendChild(searchCategoryButton);
}

function createCategoriesMenuElements(asideElement) {
  const categoryLabel = document.createElement('label');
  categoryLabel.innerText = "Search";
  categoryLabel.id = 'label-search-category';
  asideElement.appendChild(categoryLabel);

  const categoryInput = document.createElement('input');
  categoryInput.type = 'search';
  categoryInput.id = 'search-category-home';
  categoryInput.placeholder = 'Category';
  asideElement.appendChild(categoryInput);

  const dropdownCategories = document.createElement('select');
  dropdownCategories.id = 'categoriesType-home';
  dropdownCategories.name = 'categoriesType';
  asideElement.appendChild(dropdownCategories);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.id = 'buttonsDiv';
  asideElement.appendChild(buttonsDiv);

  const editCategoryButton = document.createElement('button');
  editCategoryButton.id = 'edit-category-button';
  editCategoryButton.innerText = 'Edit';
  buttonsDiv.appendChild(editCategoryButton);



  const deleteCategoryButton = document.createElement('button');
  deleteCategoryButton.id = 'delete-category-button';
  deleteCategoryButton.innerText = 'Delete';
  buttonsDiv.appendChild(deleteCategoryButton);

  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.id = 'newCategory';
  asideElement.appendChild(newInput);

  const newCategoryButton = document.createElement('button');
  newCategoryButton.id = 'new-category-button';
  newCategoryButton.innerText = 'Create category';
  asideElement.appendChild(newCategoryButton);

}

function createCategoryButtonsListeners() {
  const editCategoryButton = document.getElementById('edit-category-button');
  const deleteCategoryButton = document.getElementById('delete-category-button');
  const newCategoryButton = document.getElementById('new-category-button');
  let container = document.getElementById('buttonsDiv');

  editCategoryButton.addEventListener('click', function() {

    const inputEditCateg = document.createElement('input');
    inputEditCateg.type = 'text';
    inputEditCateg.id = 'editCategory-input';
    inputEditCateg.placeholder = 'Write New Title';
    container.appendChild(inputEditCateg);

    const saveCategoryButton = document.createElement('button');
    saveCategoryButton.id ='save-category-button';
    saveCategoryButton.innerText = 'Save Edit';
    container.appendChild(saveCategoryButton);

    saveCategoryButton.addEventListener('click', async function () {
      const oldName = document.getElementById('categoriesType-home').value;
      const newName = document.getElementById('editCategory-input').value;

      console.log(oldName, newName);
      
      await editCategory(tokenValue, oldName, newName);

    })
  });


  deleteCategoryButton.addEventListener('click', function () {

    const selectedCategory = document.getElementById('categoriesType-home').value;
    deleteCategory(tokenValue, selectedCategory);
  });

  newCategoryButton.addEventListener('click', async function() {
    
    const name = document.getElementById('newCategory').value;
    console.log(name);
    await newCategory(tokenValue, name);
  });

}

async function newCategory(tokenValue, name) {

  console.log(name);
  let category = {
    name: name
  }
  let newCategory = "http://localhost:8080/project_backend/rest/users/newCategory";
    
    try {
        const response = await fetch(newCategory, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: tokenValue
            },    
            body: JSON.stringify(category)
        });

          if (response.ok) {
            alert("Task created successfully");
          } else if (response.status === 401) {
            alert("Invalid credentials")
          } else if (response.status === 404) {
            alert("Impossible to create task. Verify all fields")
          } else if (response.status === 409) {
            alert("Category already exists")
          } else {
            alert("Category not created. Something went wrong")
          }
      
    } catch (error) {
        console.error('Error:', error);
        alert("Category not created. Something went wrong");
    }
};

async function editCategory(tokenValue, oldName, newName) {

  let editCategory = `http://localhost:8080/project_backend/rest/users/editCategory/${oldName}`;
    
    try {
        const response = await fetch(editCategory, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: tokenValue,
                newCategoryName: newName
            },    
        });

          if (response.ok) {
            alert("Task edited successfully");
          } else if (response.status === 401) {
            alert("Invalid credentials")
          } else if (response.status === 404) {
            alert("Impossible to edit task. Verify all fields")
          } else if (response.status === 409) {
            alert("Category already exists")
          } else {
            alert("Category not created. Something went wrong")
          }
      
    } catch (error) {
        console.error('Error:', error);
        alert("Category not created. Something went wrong");
    }
};


async function deleteCategory(tokenValue, category) {

  let deleteCategory = `http://localhost:8080/project_backend/rest/users/deleteCategory/${category}`;
    
    try {
        const response = await fetch(deleteCategory, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                token: tokenValue
            },    
        });
          
          if (response.status==200) {
            alert("Category deleted successfully");
          } else if (response.status==400){
            alert("Category with this name can't be deleted while it has tasks associated")
          }
      
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong. Please try again later.");
    }
};


function createCategoriesEventListeners() {
  const categoryInput = document.getElementById('search-category-home');
  const dropdownCategories = document.getElementById('categoriesType-home');
  const searchCategoryButton = document.getElementById('search-category-button');


  categoryInput.addEventListener('input', async function(event) {
    dropdownCategories.innerHTML = '';
    const searchValue = event.target.value.toLowerCase().trim(); 
    const categories = await getAllCategories(tokenValue);

    let filteredCatg = [];
        
        if (searchValue === '') {
          filteredCatg = categories;
        } else {
            // Filtra os usuários com base no valor da pesquisa
            filteredCatg = categories.filter(category => {
              
                
            // Verificar se o nome de usuário, primeiro nome, último nome ou e-mail contém o valor da pesquisa
            return (
                category.name.toLowerCase().includes(searchValue)
            );
            });
        }

    // Renderizar a tabela com os usuários filtrados
    populateDropdownCategories(filteredCatg);
});


  searchCategoryButton.addEventListener('click', async function() {
    let userLogged = await getUser(tokenValue);
    const typeOfUser = userLogged.typeOfUser;
    removeAllTaskElements();
    const allTasks = await getTasksByCategory(tokenValue, dropdownCategories.options[dropdownCategories.selectedIndex].textContent);

    if (dropdownCategories.textContent === 'Select Category' || dropdownCategories.textContent === '') {
      document.getElementById('nav-all-tasks').click();
    
    } else if (dropdownCategories.innerHTML !== 'Select Category') {
      allTasks.forEach(task => {
        const taskElement = createTaskElement(task, typeOfUser);
        task.stateId = parseStateIdToString(task.stateId);
        const panel = document.getElementById(task.stateId);
        panel.appendChild(taskElement);
        attachDragAndDropListeners(taskElement);
      });
    }
    //createDefaultOption(dropdownCategories, 'Select Category');
  });
}

function createDeletedTasksElements(asideElement) {
  const deletedTasksLabel = document.createElement('label');
  deletedTasksLabel.innerText = "Deleted Tasks";
  deletedTasksLabel.id = 'label-search-deleted';
  asideElement.appendChild(deletedTasksLabel);

  const deletedTasksButton = document.createElement('button');
  deletedTasksButton.id = 'search-deleted-button';
  deletedTasksButton.innerText = 'Deleted Tasks';
  asideElement.appendChild(deletedTasksButton);
}

function createDeletedTasksEventListeners() {
  const deletedTasksButton = document.getElementById('search-deleted-button');

  deletedTasksButton.addEventListener('click', async function() {
    let userLogged = await getUser(tokenValue);
    const typeOfUser = userLogged.typeOfUser;
    removeAllTaskElements();
    const allTasks = await getErasedTasks(tokenValue);
    allTasks.forEach(task => {
      const taskElement = createTaskElement(task, typeOfUser);
      task.stateId = parseStateIdToString(task.stateId);
      const panel = document.getElementById(task.stateId);
      panel.appendChild(taskElement);
      attachDragAndDropListeners(taskElement);
    });
  });
}



  function createTaskElement(task, typeOfUser) {
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
  taskElement.erased = task.erased;
  if (task.erased === true) {
    taskElement.classList.add('erased');
  }

  const postIt = document.createElement('div');
  postIt.className = 'post-it';

  const taskTitle = document.createElement('h3');
  taskTitle.textContent = task.title;
  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'post-it-text';
  const displayDescription = document.createElement('p');
  displayDescription.textContent = task.description;

  
  
  if ((typeOfUser === SCRUM_MASTER && task.erased === false)|| (typeOfUser === PRODUCT_OWNER && task.erased === false)) {  

    console.log('bababa');
    
    const deleteButton = document.createElement('img');
    deleteButton.src = 'multimedia/dark-cross-01.png';
    deleteButton.className = 'apagarButton';
    deleteButton.dataset.taskId = task.id;
    postIt.appendChild(deleteButton);

  }  else if (typeOfUser === PRODUCT_OWNER && task.erased === true) {

    const permanentlyDeleteButton = document.createElement('img');
    permanentlyDeleteButton.src = 'multimedia/dark-cross-01.png';
    permanentlyDeleteButton.className = 'permanent-delete-button';
    permanentlyDeleteButton.dataset.taskId = task.id;
    postIt.appendChild(permanentlyDeleteButton);

    const restoreButton = document.createElement('img');
    restoreButton.src = 'multimedia/restoreIcon.png';
    restoreButton.className = 'restore-button';
    restoreButton.dataset.taskId = task.id;
    postIt.appendChild(restoreButton);

  }


  descriptionContainer.appendChild(displayDescription);
  postIt.appendChild(taskTitle);
  
  postIt.appendChild(descriptionContainer); 
  taskElement.appendChild(postIt);


  taskElement.classList.add('not-draggable');
  taskElement.addEventListener('dblclick', function () {
  sessionStorage.setItem("taskId", taskElement.id);
  window.location.href = 'task.html';
  }
  );

  return taskElement;
}

document.addEventListener('click', function (event) {
  if (event.target.matches('.apagarButton')) {
    const taskElement = event.target.closest('.task');
    const taskId = event.target.dataset.taskId;

    const deletemodal = document.getElementById('delete-modal');
    deletemodal.style.display = "grid";

    function deleteButtonClickHandler() {
      eraseTask(tokenValue, taskId);
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

document.addEventListener('click', function (event) {
  if (event.target.matches('.permanent-delete-button')) {
    const taskElement = event.target.closest('.task');
    const taskId = event.target.dataset.taskId;

    const deletemodal = document.getElementById('delete-modal');
    deletemodal.style.display = "grid";

    function deleteButtonClickHandler() {
      deleteTask(taskId, tokenValue);
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

document.addEventListener('click', function (event) {
  
  if (event.target.matches('.restore-button')) {
    const taskElement = event.target.closest('.task');
    const taskId = event.target.dataset.taskId;

    const restoremodal = document.getElementById('restore-modal');
    restoremodal.style.display = "grid";

    function restoreButtonClickHandler() {
      eraseTask(tokenValue, taskId);
      taskElement.classList.remove('erased');
      restoremodal.style.display = "none";
      restorebtn.removeEventListener('click', restoreButtonClickHandler); 
    }

    const restorebtn = document.getElementById('restore-button');
    restorebtn.addEventListener('click', restoreButtonClickHandler);

    const cancelbtn = document.getElementById('cancel-restore-button');
    cancelbtn.addEventListener('click', () => {
      restoremodal.style.display = "none";
    });
  }
});



async function populateDropdownUsers(users) {
  document.getElementById('usersType-home').innerHTML = '';
  const notAssigned = 'notAssigned';
  users.forEach(user => {
    if (user.username.toLowerCase() !== notAssigned.toLowerCase()) {
      let option = document.createElement('option');
      option.value = user;
      option.textContent = user.username;
      document.getElementById("usersType-home").appendChild(option);
    }
  });
}

async function populateDropdownCategories(categories) {
  
  categories.forEach(category => {
    let option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    document.getElementById("categoriesType-home").appendChild(option);
  });
}

async function getUsersContainingName(tokenValue, username) {
  let users = await getAllUsers(tokenValue);
  let usersContainingName = users.filter(user => user.username.includes(username));
  return usersContainingName;
}



async function getAllUsers(tokenValue) {

  let getUsers = `http://localhost:8080/project_backend/rest/users/all`;
    
    try {
        const response = await fetch(getUsers, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                token: tokenValue
            },    
        });

          if (response.ok) {
            return response.json();
          } else {
            alert("Invalid credentials")
          }
      
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong. Please try again later.");
    }
};



async function loadTasks(tokenValue, typeOfUser) {
  
  getAllTasksFromUser(tokenValue).then(tasksArray => {
      tasksArray.forEach(task => {
      const taskElement = createTaskElement(task, typeOfUser);

      
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

async function loadAllTasks(tokenValue, typeOfUser) {
  
  getAllTasks(tokenValue).then(tasksArray => {
      tasksArray.forEach(task => {
      const taskElement = createTaskElement(task, typeOfUser);

      
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
   
  let deleteTaskUrl = `http://localhost:8080/project_backend/rest/users/delete/${id}`;

  try {
    const response = await fetch(deleteTaskUrl, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
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
  sessionStorage.clear();
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

//Obter o tipo de user a partir do token
async function getTypeOfUser(tokenValue) {
  let typeOfUserRequest = "http://localhost:8080/project_backend/rest/users/getTypeOfUser";

  try {
      const response = await fetch(typeOfUserRequest, {
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
      } else {
          return null;
      }
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
}