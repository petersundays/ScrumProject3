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
    
    
    document.getElementById('showUsers-button').addEventListener('click', async function () {
    try {
        const tokenValue = localStorage.getItem('token');
        const users = await getAllUsers(tokenValue);

        // Limpa a tabela antes de adicionar os novos dados
        document.querySelector('.table tbody').innerHTML = '';

        // Adiciona os usuários à tabela
        users.forEach(user => {
            const newRow = `<tr>
                <td>${user.username}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.typeOfUser}</td>
                <td>nº</td>
                <td>buttons</td>
            </tr>`;
            document.querySelector('.table tbody').innerHTML += newRow;
        });
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
});

