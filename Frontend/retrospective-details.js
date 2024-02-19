window.onload = function() {
   
  const usernameValue = localStorage.getItem('username')
  const passwordValue = localStorage.getItem('password')
  
  if (usernameValue === null || passwordValue === null) {
    window.location.href = "index.html";
} else {
    try {
      getFirstName(usernameValue, passwordValue);
      getPhotoUrl(usernameValue, passwordValue);
    
      // Obter o ID da retrospectiva da URL
      const urlParams = new URLSearchParams(window.location.search);
      const retrospectiveId = urlParams.get('id');
      
    
      if (retrospectiveId) {
        // Obter detalhes da retrospectiva e atualizar a página
        getRetrospectiveDetails(usernameValue, passwordValue, retrospectiveId);
      } else {
        console.error('ID da retrospectiva não encontrado na URL.');
      }
    
      fillUsersDropdown(usernameValue, passwordValue);
      
    } catch (error) {
        
        console.error("An error occurred:", error);
        window.location.href = "index.html";
        
    }
}
  
};

function getValuesFromLocalStorage() {
  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');
  const userValues = [usernameValue, passwordValue];     
  return userValues;
}

function getRetrospectiveIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


async function fillUsersDropdown(usernameValue, passwordValue) {
  const dropdownUsers = document.getElementById('dropdown-users');

  // Adicionar a opção padrão
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  defaultOption.textContent = '--Choose a user--';
  dropdownUsers.appendChild(defaultOption);

  // Obter usuários do backend
  const usersEndpoint = 'http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/all';

  try {
    const response = await fetch(usersEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });

    if (response.ok) {
      const usersData = await response.json();

      usersData.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.username; // ou outra propriedade que identifique exclusivamente o usuário
        option.textContent = user.username; // ou outra propriedade que você deseja exibir
        dropdownUsers.appendChild(option);

      });
    } else if (response.status === 401) {
      alert('Invalid credentials');
    } else if (response.status === 404) {
      alert('Users not found');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

async function getRetrospectiveComments(retrospectiveId) {
  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');

  const retrospectiveCommentsEndpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/retrospective/${retrospectiveId}/allComments`;
  
  try {
    const response = await fetch(retrospectiveCommentsEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });

    if (response.ok) {
      const comments = await response.json();
      console.log('comments:', comments);
      return comments;
    } else if (response.status === 401) {
      alert('Invalid credentials');
    } else if (response.status === 404) {
      alert('Retrospective not found');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

async function getRetrospectiveDetails(usernameValue, passwordValue, retrospectiveId) {
  const retrospectiveEndpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/retrospective/${retrospectiveId}`;

  try {
    const response = await fetch(retrospectiveEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });

    if (response.ok) {
      const retrospectiveInfo = await response.json();

      const retroTitleElement = document.getElementById('retro-title');
      retroTitleElement.innerText = retrospectiveInfo.title;

      const retroTitleElement2 = document.getElementById('retro-title-aside');
      retroTitleElement2.innerText = retrospectiveInfo.title;

      const retroDateElement = document.getElementById('retro-date-each');
      retroDateElement.innerText = retrospectiveInfo.date;

    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else if (response.status === 404) {
      alert("Retrospective not found");
    }

  } catch (error) {
    alert("Something went wrong");
  }
}

async function getFirstName(usernameValue, passwordValue) {

  let firstNameRequest = "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/getFirstName";
    
    try {
        const response = await fetch(firstNameRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                username: usernameValue,
                password: passwordValue
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
  
  async function getPhotoUrl(usernameValue, passwordValue) {

  
    let photoUrlRequest = "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/getPhotoUrl";
      
      try {
          const response = await fetch(photoUrlRequest, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  username: usernameValue,
                  password: passwordValue
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


function createComment(description, user, commentStatus) {
const comment = {
  description: description,
  user: user,
  commentStatus: parseCommentIdToInt(commentStatus)
};
return comment;
}


function parseCommentIdToInt (commentStatus) {
  let newStatus = 0;
  if(commentStatus === 'strengths') {
    newStatus = 100;
  } else if(commentStatus === 'challenges') {
    newStatus = 200;
  } else if(commentStatus === 'improvements') {
    newStatus = 300;
  }
  return newStatus;
}

function parseCommentIdToString (commentStatus) {
  let newStatus = '';
  if(commentStatus === 100) {
    newStatus = 'strengths';
  } else if(commentStatus === 200) {
    newStatus = 'challenges';
  } else if(commentStatus === 300) {
    newStatus = 'improvements';
  }
  return newStatus;
}

function createCommentElement(comment) {
  const commentElement = document.createElement('div');
  commentElement.id = comment.id;
  comment.commentStatus = parseCommentIdToString(comment.commentStatus);
  commentElement.commentStatus = comment.commentStatus;
  commentElement.classList.add('comment');
  if (comment.commentStatus === 'strengths') {
    commentElement.classList.add('strengths');
  } else if (comment.commentStatus === 'challenges') {
    commentElement.classList.add('challenges');
  } else if (comment.commentStatus === 'improvements') {
    commentElement.classList.add('improvements');
  }
  commentElement.description = comment.description;
  commentElement.user = comment.user.username;

  const postIt = document.createElement('div');
  postIt.className = 'post-it';

  const elementUsername = document.createElement('h3');
  elementUsername.textContent = comment.user.username;
  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'post-it-text';
  const elementDescription = document.createElement('p');
  elementDescription.textContent = comment.description;

  descriptionContainer.appendChild(elementDescription);
  postIt.appendChild(elementUsername);
  postIt.appendChild(descriptionContainer);
  commentElement.appendChild(postIt);

  return commentElement;
}

function loadComments() {
  getRetrospectiveComments(getRetrospectiveIdFromURL()).then((commentsArray) => {
    commentsArray.forEach((comment) => {
      const commentElement = createCommentElement(comment);
      comment.commentStatus = parseCommentIdToString(comment.commentStatus);
      const panel = document.getElementById(comment.commentStatus);
      panel.appendChild(commentElement);
    });
  });
}


document.getElementById('addCommentBTN').addEventListener('click', async function(event) {
  event.preventDefault();

  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');
  console.log("usernameValue: ", usernameValue);

  const commentDescription = document.getElementById('commentDescription-retro').value;
  const commentCategory = document.getElementById('dropdown-categories').value;
  const commentUserValue = document.getElementById('dropdown-users').value;
  const commentUser =  await getUserByUsername(commentUserValue);
  console.log('commentUser:', commentUser);

  if (commentDescription === '' || commentCategory === '' || commentUser === '') {
    document.getElementById('warningMessage2').innerText ='Please fill in all fields';
  } else {
    document.getElementById('warningMessage2').innerText ='';
    const comment = createComment(commentDescription, commentUser, commentCategory);
    console.log('comment:', comment);
    const retrospectiveId = getRetrospectiveIdFromURL();
    console.log('retrospectiveId:', retrospectiveId);
    const retrospectiveCommentsEndpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/retrospective/${retrospectiveId}/addComment`;

    try {
      const response = await fetch(retrospectiveCommentsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'username': usernameValue,
          'password': passwordValue
        },
        body: JSON.stringify(comment)
      });

      if (response.ok) {
        console.log('Comment added successfully');
        removeAllCommentsElements();
        addCommentToPanel(commentCategory, commentDescription, commentUser);
        //loadComments();
        cleanAllCommentFields();
        //createCommentElement(comment);
        
      } else if (response.status === 401) {
        alert('Invalid credentials');
      } else if (response.status === 404) {
        alert('Retrospective not found');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  }
}
);

function addCommentToPanel(commentCategory, commentDescription, commentUser) {
  const panelStrengths = document.getElementById('strengths');
  const panelChallenges = document.getElementById('challenges');
  const panelImprovements = document.getElementById('improvements');

  if (commentCategory === 'strengths') {
    panelStrengths.innerHTML += `<div>${commentDescription} - ${commentUser.username}</div>`;
  } else if (commentCategory === 'challenges') {
    panelChallenges.innerHTML += `<div>${commentDescription} - ${commentUser.username}</div>`;
  } else if (commentCategory === 'improvements') {
    panelImprovements.innerHTML += `<div>${commentDescription} - ${commentUser.username}</div>`;
  }
}

async function getUserByUsername(username) {
  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');

  const endpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/${username}`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      throw new Error('Failed to get user by username');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

function removeAllCommentsElements() {
  const comments = document.querySelectorAll('.comment');
  comments.forEach(comment => {
    comment.remove();
  });
}

function cleanAllCommentFields() {
  document.getElementById('warningMessage2').innerText ='';
  document.getElementById('commentDescription-retro').value = '';
  document.getElementById('dropdown-categories').value = '';
  document.getElementById('dropdown-users').value = '';
}



  //LOGOUT 
document.getElementById("logout-button-header").addEventListener('click', async function() {

  let logoutRequest = "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/logout";
    
    try {   
        const response = await fetch(logoutRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
            }, 
        });
        if (response.ok) {
            
          localStorage.removeItem("username");
          localStorage.removeItem("password");

          window.location.href="index.html";

        } 
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
})
