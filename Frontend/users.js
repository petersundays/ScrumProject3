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

    let getUsersByStatus = `http://localhost:8080/project_backend/rest/users/all/${visible}`;
      
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
        let usersList;

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


function cleanInputs(){
    document.getElementById('search-input').value = '';
    document.getElementById('usersType').value = 'none';
    document.querySelector('.table tbody').innerHTML = '';
}

//Escrever os botões de edição e de apagar na tabela
function writeTableButtons(cell){

    const btn_delete_user = document.createElement("button");

    btn_delete_user.innerHTML = "&times;";
    btn_delete_user.setAttribute("id", "deleteUser");
    btn_delete_user.type = "button";

    btn_delete_user.addEventListener("click", async function(event) {
        await changeUserVisibility(event);
    });

    cell.appendChild(btn_delete_user);

}

// Adicionar evento de clique para cada linha da tabela
document.querySelector('.table tbody').addEventListener('click', function(event) {
    const clickedRow = event.target.closest('tr'); // Encontra a linha clicada
    if (clickedRow) {
        const username = clickedRow.cells[0].textContent; // Obtém o nome de usuário da primeira célula
        // Chama a função para carregar os dados do usuário clicado
        loadUserData(username, localStorage.getItem('token'));
    }
});

//Função que vai ler os dados do user clicado
async function loadUserData(username, tokenValue) {

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
            createEditProfileForm();
            
            document.getElementById("first name-editUser").placeholder = data.firstName || '';
            document.getElementById("last name-editUser").placeholder = data.lastName || '';
            document.getElementById("phone-editUser").placeholder = data.phone || '';
            document.getElementById("photo url-editUser").placeholder = data.photoURL || '';
            document.getElementById("email-editUser").placeholder = data.email || '';
            document.getElementById("profile-clicked-pic").src = data.photoURL || "multimedia/default-profile-pic.png";

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
function createEditProfileForm() {

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

        // Adiciona os elementos à div
        form.appendChild(label);
        form.appendChild(input);
    }

    const btn_edit = document.createElement("button");
    btn_edit.innerHTML = "&#9998";
    btn_edit.id="save_edit";
    btn_edit.type = "button";
    form.appendChild(btn_edit);

    container.appendChild(form);

    btn_edit.addEventListener('click', saveEdit);
}


// Função para ordenar e escrever a tabela
document.addEventListener('DOMContentLoaded', function () {
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

            // Re-renderiza a tabela com os usuários ordenados
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
function renderTable() {
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
            document.createElement('td'),
            document.createElement('td')
        ];
        cells[0].textContent = user.username;
        cells[1].textContent = user.firstName;
        cells[2].textContent = user.lastName;
        cells[3].textContent = user.email;
        cells[4].textContent = parseTypeToString(user.typeOfUser);
        cells[5].textContent = 'nº';
        writeTableButtons(cells[6]);
        cells.forEach(cell => newRow.appendChild(cell));
        tbody.appendChild(newRow);
    });
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

                // Atualiza os dados do usuário na lista filteredUsers
                const index = filteredUsers.findIndex(user => user.username === username);
                if (index !== -1) {
                    // Atualiza apenas os campos alterados na lista filteredUsers
                    for (let key in updatedUser) {
                        if (updatedUser[key] !== "") {
                            filteredUsers[index][key] = updatedUser[key];
                        }
                    }
                }

                renderTable();

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

    return updatedUser;
}

//Obter o username através do email
async function getUsernameFromEmail(email, tokenValue) {

    let firstNameRequest = "http://localhost:8080/project_backend/rest/users/getUsernameFromEmail";

    console.log(email);
      
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

    fieldsArray.forEach(function(field) {
        if (field.value !== '') {
            allFieldsUnchanged = false;
        }
    });
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

            if (response.ok && confirmDelete()) {

                console.log("certo");
                alert(await response.text());

                renderTable();

            } else {
                alert("No changes occured");

                console.log("fora");

            }

        } catch (error) {
            console.error('Error:', error);
            alert("Something went wrong");
        }
};

document.querySelectorAll('#deleteUser').forEach(btn => {
    btn.addEventListener('click', async function (event) {
        await changeUserVisibility(event);
    });
});



//Função para confirmar "delete"
function confirmDelete() {
    return confirm("Are you sure you want to change this user state?");
 }