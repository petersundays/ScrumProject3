window.onload = async function() {

 let tokenValue = localStorage.getItem('token');

 if (tokenValue === null) {
    window.location.href = "index.html";
    } else {
    try {
        const usernameLogged = await getUsername(tokenValue);
        getFirstName(tokenValue);
        getPhotoUrl(tokenValue);
        loadUserData(usernameLogged, tokenValue);

        clearInputValues();
    } catch (error) {
        
        console.error("An error occurred:", error);
        window.location.href = "index.html";
        
    }
    }
};
    
const tokenValue = localStorage.getItem('token');

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

  async function loadUserData(usernameLogged, tokenValue) {

    let loadDataRequest = `http://localhost:8080/project_backend/rest/users/${usernameLogged}`;

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
            
            document.getElementById("username-title-editProfile").textContent = "Bem vindo " + data.username || '';
            document.getElementById("firstName-editProfile").placeholder = data.firstName || '';
            document.getElementById("lastName-editProfile").placeholder = data.lastName || '';
            document.getElementById("phone-editProfile").placeholder = data.phone || '';
            document.getElementById("photoURL-editProfile").placeholder = data.photoURL || '';
            document.getElementById("email-editProfile").placeholder = data.email || '';
            //document.getElementById("currentPass-editProfile").placeholder = '******';

        } else {

        }
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}

document.getElementById("profile-save-button").addEventListener('click', async function (event) {
    event.preventDefault();

    //let newPassword = document.getElementById('newPassword-editProfile').value.trim();
    //let confirmNewPassword = document.getElementById('newPasswordConfirm-editProfile').value.trim();
    let usernameLogged = await getUsername(tokenValue);


    /*
    Para verificar qual a password que se atualizar, se os campos não estiverem vazios e forem iguais
    a nova password vai ser isso, se os campos estiverem vazios a password vai ficar a password antiga 
    que está guardada na local storage se não, se o user escrever nova passaword mas não for igual, vai ficar 
    null e vai rebentar não deixando o user fazer update ao perfil
    
    */
    /*let updatedPasswordToObejct;

    if (newPassword !== '' && confirmNewPassword !== '' && newPassword === confirmNewPassword) {
        updatedPasswordToObejct = confirmNewPassword;
    } else if (newPassword === '' && confirmNewPassword === '') {
        // Password sem alterações
        // updatedPasswordToObejct = passwordValue;
    } else {
        alert("Passwords don't match")
        return;
    }

    let updatedUser = updateUserInfo(updatedPasswordToObejct);*/


    //verifica se todos os campos não estão vazios, se estiverem nem faz o request e avisa o user
    if (!isEveryFieldUnchanged()) {

        try {
            const response = await fetch(`http://localhost:8080/project_backend/rest/users/update/${usernameLogged}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    token: tokenValue
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                alert("Profile updated successfully")
                location.reload();

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
});

//Apenas envia dados que foram modificados
function updateUserInfo() { 

    let updatedUser = {};

    let email = getInputValue('email-editProfile');
    if (email !== '') {
        updatedUser.email = email;
    }

    let firstName = getInputValue('firstName-editProfile');
    if(firstName !== '') {
        updatedUser.firstName = firstName;
    }

    let lastName = getInputValue('lastName-editProfile');
    if(lastName!== '') {
        updatedUser.lastName = lastName;
    }

    let phone = getInputValue('phone-editProfile');
    if(phone!== '') {
        updatedUser.phone = phone;
    }

    let photoURL = getInputValue('photoURL-editProfile');
    if(photoURL!== '') {
        updatedUser.photoURL = photoURL;
    }

    return updatedUser;


}

function clearInputValues() {
    //document.getElementById('newPassword-editProfile').value = '';
    //document.getElementById('newPasswordConfirm-editProfile').value = ''; 
    document.getElementById('email-editProfile').value = '';
    document.getElementById('firstName-editProfile').value = '';
    document.getElementById('lastName-editProfile').value = '';
    document.getElementById('phone-editProfile').value = '';
    document.getElementById('photoURL-editProfile').value = '';
}

function isEveryFieldUnchanged() {

    let allFieldsUnchanged = true;

    let form = document.getElementById('edit-profile-form');
    let fieldsArray = [...form.querySelectorAll('input')];

    fieldsArray.forEach(function(field) {
        if (field.value !== '') {
            allFieldsUnchanged = false;
        }
    });
    return allFieldsUnchanged;
}


//Obter o username a partir do token
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

//Atualiza foto instantaneamente
document.getElementById('photoURL-editprofile').addEventListener('input', function(){
    let url = this.value.trim(); // Obter o value do input
    let photoInst = document.getElementById('profile-pic');

    // Verificar URL
    if (url !== '') {
        // Update o src para o novo URL
        photoInst.src = url;
        document.getElementById('profile-pic').src = url;
    } else {
        // Se o URL é vazio, atualiza o src para a imagem padrão
        photoInst.src = this.placeholder;
    }
});


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

// Alteração apenas da password
async function save_editPass(oldPassword, newPassword, token) {

    const response = await fetch(`http://localhost:8080/project_backend/rest/users/update/${usernameLogged}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'oldpassword': oldPassword,
        'newpassword': newPassword
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
  
    return response.status;
  };

// Botão para abrir a Modal da password
const btnOpenPasswordModal = document.getElementById('profile-changePass-button');

// Abrir Modal Password no clique
btnOpenPasswordModal.addEventListener('click', function(){
    openPassModal;
});

// Obter a Modal da password
const passwordModal = document.getElementById("passwordModal");

// Obter o  <span> que fecha a Modal
const spanClosePasswordModal = document.getElementsByClassName("close")[0];

// Fechar Modal Password no clique
spanClosePasswordModal.onclick = closePassModal;

//Abrir Modal Password
function openPassModal(){

    console.log('Abrir Modal');
    //Desfoca o background do modal
    document.getElementsByClassName("main-editProfile")[0].style.filter = "blur(5px)";
    //Torna modal visivel
    passwordModal.style.display = "block";
}

function closePassModal(){
    document.getElementsByClassName("main-editProfile")[0].style.filter = "none";
    passwordModal.style.display = "none";
    document.getElementById('changePasswordForm').reset();
};

document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {

    e.preventDefault();

    const oldPassword = document.getElementById("profile_oldPassword").value;
    const newPassword = document.getElementById("profile_newPassword").value;
    const confirmPassword = document.getElementById("profile_confirmPassword").value;

    // Valida nova password com confirmação
    if (newPassword !== confirmPassword) {
        alert("Nova password e confirmação não são iguais.");
        return;
    }

    const save_newPass = await save_editPass(oldPassword, newPassword);

    if (save_newPass === 200) {
        alert('Password changed successfully.');
        passwordModal.style.display = "none";
        document.getElementsByClassName("container")[0].style.filter = "none";
        localStorage.setItem("password", newPassword);

    } else {
        alert('Failed to change password.');
    }
});