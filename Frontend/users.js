window.onload = async function() {

let tokenValue = localStorage.getItem('token');

if (tokenValue === null) {
    window.location.href = "index.html";
} else {
    try {
        let typeOfUser = await getTypeOfUser(tokenValue);

        if(typeOfUser){

            const userType = parseInt(typeOfUser);
            if(userType === 200){
                scrumMasterPage();
            }else if(userType === 300){
                productOwnerPage();
            }
        }

        getFirstName(tokenValue);
        getPhotoUrl(tokenValue);

    } catch (error) {
        
        console.error("An error occurred:", error);
        window.location.href = "index.html";
        
    }
    }
};
    
const tokenValue = localStorage.getItem('token');

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

    scrumMasterPage();
    
    const addUsersButton = document.createElement('a');
    addUsersButton.href = 'register.html?fromAddUser=true';
    addUsersButton.draggable = 'false';
    addUsersButton.innerText = 'Add User';
    
    let liElement = document.createElement('li');
    liElement.id = 'nav-users';
    
    liElement.appendChild(addUsersButton);
    document.getElementById('menu').appendChild(liElement);
    
}

    async function getPhotoUrl(tokenValue) {

        let photoUrlRequest = "http://localhost:8080/project_backend/rest/users/getPhotoUrl";
          
          try {
              const response = await fetch(photoUrlRequest, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/JSON',
                      'Accept': '*/*',
                      token: tokenValue
                  },    
              });
      
              if (response.ok) {
      
                const data = await response.text();
                document.getElementById("profile-pic").src = data;
      
              } else if (response.status === 401) {
                  alert("Invalid credentials")
              } else if (response.status === 404) {
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

//Definir os users filtrados fora das funções
let filteredUsers = [];
let usersList = [];

//Receber todos os users mediante o tipo
async function getAllUsersByType(tokenValue, typeOfUser) {

    let getUsersByType = `http://localhost:8080/project_backend/rest/users/all/${typeOfUser}`;
      
      try {
          const response = await fetch(getUsersByType, {
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

//Receber todos os users mediante a visibilidade
async function getAllUsersByVisibility(tokenValue, visible) {

    let getUsersByStatus = `http://localhost:8080/project_backend/rest/users/all/visible/${visible}`;
      
      try {
          const response = await fetch(getUsersByStatus, {
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

//Receber todos os users mediante o tipo e a visibilidade
async function getAllUsersByTypeAndVisibility(tokenValue, typeOfUser, visible) {

    let getUsersByTypeAndStatus = `http://localhost:8080/project_backend/rest/users/all/${typeOfUser}/${visible}`;
      
      try {
          const response = await fetch(getUsersByTypeAndStatus, {
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

    
document.getElementById('showUsers-button').addEventListener('click', async function () {
    try {
        const tokenValue = localStorage.getItem('token');

        // Limpa a tabela antes de adicionar os novos dados
        document.querySelector('.table tbody').innerHTML = '';

        let typeOfUser = document.getElementById('usersType').value;
        let userStatus = document.getElementById('usersVisibility').value;

        if(typeOfUser === 'All' && userStatus === 'All') {
            usersList = await getAllUsers(tokenValue);
            filteredUsers = usersList;
        } else if(typeOfUser === 'All' && userStatus !== 'All') {
            usersList = await getAllUsersByVisibility(tokenValue, userStatus);
            filteredUsers = usersList;
        }else if(typeOfUser === '300' && userStatus !== 'All') {
            usersList = await getAllUsersByTypeAndVisibility(tokenValue, typeOfUser, userStatus);
            filteredUsers = usersList;
        } else if(typeOfUser === '200' && userStatus !== 'All') {
            usersList = await getAllUsersByTypeAndVisibility(tokenValue, typeOfUser, userStatus);
            filteredUsers = usersList;
        } else if(typeOfUser === '100' && userStatus !== 'All') {
            usersList = await getAllUsersByTypeAndVisibility(tokenValue, typeOfUser, userStatus);
            filteredUsers = usersList;
        }else {
            usersList = await getAllUsersByType(tokenValue, typeOfUser);
            filteredUsers = usersList;
        }

        // Adiciona os users à tabela
        renderTable();

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
});

//Pesquisa na tabela
document.getElementById('search-input').addEventListener('input', function(event) {
    const searchValue = event.target.value.toLowerCase().trim(); // Obtém o valor da pesquisa e o limpa

        // Se o valor da pesquisa estiver vazio, restaura a lista de usuários para a lista original
        if (searchValue === '') {
            filteredUsers = usersList.slice(0);
        } else {
            // Filtra os usuários com base no valor da pesquisa
            filteredUsers = usersList.filter(user => {
            // Verificar se o nome de usuário, primeiro nome, último nome ou e-mail contém o valor da pesquisa
            return (
                user.username.toLowerCase().includes(searchValue) ||
                user.firstName.toLowerCase().includes(searchValue) ||
                user.lastName.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue)
            );
            });
        }

    // Renderizar a tabela com os usuários filtrados
    renderTable();
});

//Escrever os botões de edição e de apagar na tabela
async function writeTableButtons(cell, visible){

    let typeOfUser = await getTypeOfUser(tokenValue);

    if(typeOfUser){
        const userType = parseInt(typeOfUser);
        if(userType === 300){
        
            const btn_visibility_user = document.createElement("button");
            const btn_delete_user = document.createElement("button");

            if(visible){
                btn_visibility_user.innerHTML = `<img src="multimedia/visibility_FILL0_wght200_GRAD0_opsz20.svg" alt="&#128065;">`;
                btn_delete_user.innerHTML = '';
            }else{
                btn_visibility_user.innerHTML = `<img src="multimedia/visibility_off_FILL0_wght200_GRAD0_opsz20.svg" alt="/">`
                btn_delete_user.innerHTML = `<img src="multimedia/delete_FILL0_wght200_GRAD0_opsz20.svg" alt="&#128465;">`;

                btn_delete_user.id = "deleteUser";
                btn_delete_user.type = "button";

                btn_delete_user.addEventListener("click", async function(event) {
                    if(confirmPermDelete()){
                        await deleteUser(event);
                    }
                });
            }

            btn_visibility_user.setAttribute("id", "visibleUser");
            btn_visibility_user.type = "button";
            

            btn_visibility_user.addEventListener("click", async function(event) {
                await changeUserVisibility(event);
            });

            cell.appendChild(btn_visibility_user);

            if(!visible){
                cell.appendChild(btn_delete_user);
            }
        }
    }
}

// Adicionar evento de clique para cada linha da tabela
document.querySelector('.table tbody').addEventListener('click', function(event) {
    const clickedCellIndex = event.target.cellIndex; // Obtém o índice da célula clicada
    // Verifica se a célula clicada não é a última célula da linha (índice 6)
    if (clickedCellIndex !== 6) {
        const clickedRow = event.target.closest('tr'); // Encontra a linha clicada
        if (clickedRow) {
            const username = clickedRow.cells[0].textContent; // Obtém o nome de usuário da primeira célula
            if (!event.target.matches('img')) {
            // Chama a função para carregar os dados do usuário clicado
            loadUserData(username, localStorage.getItem('token'));
            }
        }
    }
});

//Função que vai ler os dados do user clicado
async function loadUserData(username, tokenValue) {

    let typeOfUser = await getTypeOfUser(tokenValue);

    let loadDataRequest = `http://localhost:8080/project_backend/rest/users/${username}`;

    try {
        const response = await fetch(loadDataRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                token: tokenValue
            },
        });


        if (response.ok) {
            const data = await response.json();

            //Ler o formulário de edição do user
            await createEditProfileForm(tokenValue);
            
            document.getElementById("first name-editUser").placeholder = data.firstName || '';
            document.getElementById("last name-editUser").placeholder = data.lastName || '';
            document.getElementById("phone-editUser").placeholder = data.phone || '';
            document.getElementById("photo url-editUser").placeholder = data.photoURL || '';
            document.getElementById("email-editUser").placeholder = data.email || '';
            document.getElementById("profile-clicked-pic").src = data.photoURL || "multimedia/default-profile-pic.png";

            if(typeOfUser){
                const userType = parseInt(typeOfUser);
                if(userType === 300){
                    document.getElementById("user_role_loaded").innerText = parseTypeToString(data.typeOfUser) || '';
                }
            }

        } else {

            console.error('Failed to load user data');
            alert("Failed to load user data");

        }
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}

//Escrever os dados do user clicado no html
async function createEditProfileForm(tokenValue) {

    let typeOfUser = await getTypeOfUser(tokenValue);

    // Cria os elementos
    const labels = [
        "Email",
        "First Name",
        "Last Name",
        "Phone",
        "Photo URL"
    ];
    const inputTypes = [
        "email",
        "text",
        "text",
        "text",
        "url"
    ];
    const container = document.querySelector('.users-details-container');

    // Limpa o conteúdo atual da div
    container.innerHTML = '';

    const img = document.createElement('img');
    img.id = "profile-clicked-pic";

    container.appendChild(img);

    const form = document.createElement('form');
    form.id = "edit-user-form";

    // Loop para criar os elementos
    for (let i = 0; i < labels.length; i++) {
        const label = document.createElement('label');
        label.textContent = labels[i];
        label.classList.add('labels-edit-profile');
        label.setAttribute('id', labels[i].toLowerCase() + '-editProfile-label');

        const input = document.createElement('input');
        input.type = inputTypes[i];
        input.classList.add('editUser-fields');
        input.setAttribute('id', labels[i].toLowerCase() + '-editUser');
        input.setAttribute('name', labels[i].toLowerCase());
        input.setAttribute('placeholder', '');
        if(typeOfUser){
            const userType = parseInt(typeOfUser);
            if(userType === 200){
                input.disabled=true;
            }
        }

        // Adiciona os elementos à div
        form.appendChild(label);
        form.appendChild(input);
    }

    if(typeOfUser){
        const userType = parseInt(typeOfUser);
        if(userType === 300){
            const select_role = document.createElement('select');
            select_role.id='select_role';

            const roles = ["user_role_loaded", "Developer", "Scrum Master", "Product Owner"];

            roles.forEach((role, index) => {
            const option = document.createElement('option');
            if (index === 0){
                option.disabled = true;
                option.selected = true;
                option.value = '';
            }else {
                option.value = index * 100;
            }
            option.textContent = role;
            option.id = role;
            select_role.appendChild(option);
            });    

            const btn_edit = document.createElement("button");
            btn_edit.innerHTML = "&#9998";
            btn_edit.id="save_edit";
            btn_edit.type = "button";
            form.appendChild(select_role);
            form.appendChild(btn_edit);

            btn_edit.addEventListener('click', saveEdit);
        }
    }

    container.appendChild(form);
}


// Função para ordenar e escrever a tabela
document.addEventListener('DOMContentLoaded', async function () {

    let typeOfUser = await getTypeOfUser(tokenValue);

    if(typeOfUser){
        const userType = parseInt(typeOfUser);
        if(userType === 200){
            const tableHeaders = document.querySelectorAll('.table-header th');
            tableHeaders.forEach(header => {
                if (header.textContent.trim() === 'Actions') {
                    header.remove();
                }
            });
        }
    }

    const headers = document.querySelectorAll('.table-header th');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            // Obtém o índice da coluna clicada
            const columnIndex = Array.from(headers).indexOf(header);
            // Obtém a ordem atual da coluna
            const currentOrder = header.getAttribute('data-order') || 'asc';

            // Ordena os usuários com base na coluna clicada
            filteredUsers.sort((a, b) => {
                const aValue = String(a[getColumnProperty(columnIndex)]);
                const bValue = String(b[getColumnProperty(columnIndex)]);
                if (currentOrder === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            });

            // Inverte a ordem para a próxima vez que for clicado
            header.setAttribute('data-order', currentOrder === 'asc' ? 'desc' : 'asc');

            // Rescreve a tabela com os usuários ordenados
            renderTable();
        });
    });
});

// Função para obter a propriedade correta com base no índice da coluna
function getColumnProperty(index) {
    switch (index) {
        case 0:
            return 'username';
        case 1:
            return 'firstName';
        case 2:
            return 'lastName';
        case 3:
            return 'email';
        case 4:
            return 'typeOfUser';
        default:
            return '';
    }
}

// Função para escrever a tabela com os usuários filtrados e ordenados
async function renderTable() {

    let typeOfUser = await getTypeOfUser(tokenValue);

        if(typeOfUser){

            const userType = parseInt(typeOfUser);

            const tbody = document.querySelector('.table tbody');
            tbody.innerHTML = '';
            filteredUsers.forEach(user => {
                const newRow = document.createElement('tr');
                const cells = [
                    document.createElement('td'),
                    document.createElement('td'),
                    document.createElement('td'),
                    document.createElement('td'),
                    document.createElement('td'),
                    document.createElement('td')
                ];
                cells[0].textContent = user.username;
                cells[1].textContent = user.firstName;
                cells[2].textContent = user.lastName;
                cells[3].textContent = user.email;
                cells[4].textContent = parseTypeToString(user.typeOfUser);
                cells[5].textContent = user.userTasks.length;
                cells.forEach(cell => newRow.appendChild(cell));

                if(userType === 300){
                    const actionCell = document.createElement('td');
                    writeTableButtons(actionCell, user.visible);
                    newRow.appendChild(actionCell);
                }

                tbody.appendChild(newRow);
            });
        }
}

//Gravar edições do user
async function saveEdit(event) {
    event.preventDefault();

    let email = document.getElementById("email-editUser").placeholder;
    let token = localStorage.getItem('token');

    let updatedUser = updateUserInfo();

    //verifica se todos os campos não estão vazios, se estiverem nem faz o request e avisa o user
    if (!isEveryFieldUnchanged()) {

        try {

            let username = await getUsernameFromEmail(email, token);

            const response = await fetch(`http://localhost:8080/project_backend/rest/users/update/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                alert("Profile updated successfully");
                loadUserData(username, token);

                reloadUsers();

            } else {
                switch (response.status) {
                case 422:
                    const errorData = await response.text();
                
                    switch (errorData) {
                        case "Invalid email":
                            alert("The email you used is not valid");
                            break;
                        case "Image URL invalid":
                            alert("Image url provided not valid");
                            break;
                        case "Invalid phone number":
                            alert("The phone number is not valid");
                            break;
                        default:
                            console.error('Unknown error message:', errorData);
                            alert("Something went wrong switch");
                    }
                    break;
                case 406: 
                    alert("Wrong username on path");
                    break;
                case 401: 
                    alert("Invalid credentials");
                    break;
                default:
                    alert("Something went wrong");
            }
        }

        } catch (error) {
            console.error('Error:', error);
            alert("Something went wrong");
        }
    } else {
        alert("No changes detected")
    }
};

//Retorna valores que foram alterados
//Apenas envia dados que foram modificados
function updateUserInfo() { 

    let updatedUser = {};

    let email = getInputValue('email-editUser');
    if (email !== '') {
        updatedUser.email = email;
    }

    let firstName = getInputValue('first name-editUser');
    if(firstName !== '') {
        updatedUser.firstName = firstName;
    }

    let lastName = getInputValue('last name-editUser');
    if(lastName!== '') {
        updatedUser.lastName = lastName;
    }

    let phone = getInputValue('phone-editUser');
    if(phone!== '') {
        updatedUser.phone = phone;
    }

    let photoURL = getInputValue('photo url-editUser');
    if(photoURL!== '') {
        updatedUser.photoURL = photoURL;
    }

    let typeOfUser = getInputValue('select_role');
    if(typeOfUser!== '') {
        updatedUser.typeOfUser = typeOfUser;
    }

    return updatedUser;
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

//Obter o username através do email
async function getUsernameFromEmail(email, tokenValue) {

    let firstNameRequest = "http://localhost:8080/project_backend/rest/users/getUsernameFromEmail";
      
      try {
          const response = await fetch(firstNameRequest, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  email: email,
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


function isEveryFieldUnchanged() {

    let allFieldsUnchanged = true;

    let form = document.getElementById('edit-user-form');
    let fieldsArray = [...form.querySelectorAll('input')];
    let selectField = form.querySelector('select');

    fieldsArray.forEach(function(field) {
        if (field.value !== '') {
            allFieldsUnchanged = false;
        }
    });

    if (selectField.selectedIndex !== 0) {
        allFieldsUnchanged = false;
    }

    return allFieldsUnchanged;
}


function parseTypeToString (type) {
    let newType = '';
    if(type === 100) {
        newType = 'Developer';
    } else if(type === 200) {
        newType = 'Scrum Master';
    } else if(type === 300) {
        newType = 'Product Owner';
    }
    return newType;
  }
  
  function parseTypeToInt (type) {
    let newType = 0;
    if(type === 'Developer') {
        newType = 100;
    } else if(type === 'Scrum Master') {
        newType = 200;
    } else if(type === 'Product Owner') {
        newType = 300;
    }
    return newType;
}

//Se campo não for preenchido, retorna null
function getInputValue(elementId) {
    let inputValue;
    let valueElement = document.getElementById(elementId);
    
    if (valueElement.value === '') {
        inputValue = '';
    } else {
        inputValue = valueElement.value.trim();
    }

    return inputValue;
}


//Alterar visibilidade do user 
async function changeUserVisibility(event) {
    event.preventDefault();

    if(confirmDelete()){ 

    let token = localStorage.getItem('token');
    let username;

    const clickedRow = event.target.closest('tr'); // Encontra a linha clicada
    if (clickedRow) {
        username = clickedRow.cells[0].textContent; // Obtém o nome de usuário da primeira célula
    }

        try {

            const response = await fetch(`http://localhost:8080/project_backend/rest/users/update/${username}/visibility`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: token
                },
            });

            if (response.ok) {

                alert(await response.text());

                await reloadUsers();

            } else {
                alert("No changes occured");

            }

        } catch (error) {
            console.error('Error:', error);
            alert("Something went wrong");
        }
    }
};

//Reler a informação e colocar na tabela
async function reloadUsers() {
    try {
        const tokenValue = localStorage.getItem('token');
        let typeOfUser = document.getElementById('usersType').value;
        let userStatus = document.getElementById('usersVisibility').value;

        // Limpa a tabela antes de adicionar os novos dados
        document.querySelector('.table tbody').innerHTML = '';

        let usersList;
        if(typeOfUser === 'All' && userStatus === 'All') {
            usersList = await getAllUsers(tokenValue);
        } else if(typeOfUser === 'All' && userStatus !== 'All') {
            usersList = await getAllUsersByVisibility(tokenValue, userStatus);
        } else if(typeOfUser === '300' && userStatus !== 'All') {
            usersList = await getAllUsersByTypeAndVisibility(tokenValue, typeOfUser, userStatus);
        } else if(typeOfUser === '200' && userStatus !== 'All') {
            usersList = await getAllUsersByTypeAndVisibility(tokenValue, typeOfUser, userStatus);
        } else if(typeOfUser === '100' && userStatus !== 'All') {
            usersList = await getAllUsersByTypeAndVisibility(tokenValue, typeOfUser, userStatus);
        } else {
            usersList = await getAllUsersByType(tokenValue, typeOfUser);
        }

        // Atualiza a lista de usuários filtrados
        filteredUsers = usersList;

        // Renderiza a tabela com os usuários atualizados
        renderTable();

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}

async function deleteUser(event) {
    event.preventDefault();

    let token = localStorage.getItem('token');
    let username;

    const clickedRow = event.target.closest('tr'); // Encontra a linha clicada
    if (clickedRow) {
        username = clickedRow.cells[0].textContent; // Obtém o nome de usuário da primeira célula
    }

    let deleteThisUser = `http://localhost:8080/project_backend/rest/users/${username}`;

    try {
        const response = await fetch(deleteThisUser, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                token: token
            },
        });

        if (response.ok) {
            alert('User deleted successfully');
            reloadUsers();
        } else {
            console.error('Error deleting User:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.querySelectorAll('#deleteUser').forEach(btn => {
    btn.addEventListener('click', async function (event) {
        await changeUserVisibility(event);
    });
});



//Função para confirmar mudança de visibilidade
function confirmDelete() {
    return confirm("Are you sure you want to change this user state?");
 }

//Função para confirmar "delete"
function confirmPermDelete() {
    return confirm("Are you sure you want to delete this user?");
 }
