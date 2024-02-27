window.onload = function() {

    localStorage.clear();
}


// ID do botão loginButton
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();


    let loginValue = document.getElementById('username').value.trim();
    let passwordValue = document.getElementById('password').value.trim();


    
    let loginRequest = "http://localhost:8080/project_backend/rest/users/login";
    const inputFieldIds = [
        'username', 
        'password'
    ];

    let credentials = {
        username: loginValue,
        password: passwordValue
    }

    try {   
        const response = await fetch(loginRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*'
            },
            body: JSON.stringify(credentials)
            
        });

        if (response.ok) {

            const token = await response.text();
            
            localStorage.setItem('token', token);

            //depois de login com sucesso, apaga os values

            inputFieldIds.forEach(fieldId => {
                document.getElementById(fieldId).value = '';
            });
            window.location.href = 'home.html';

        } else if (response.status === 401) {
            alert("Invalid credentials, please try again :(");
        } else if (!response.ok) {
            alert("something went wrong")
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }

    function createUserData() {
        let isFormValid = document.getElementById('login-form').checkValidity();
    
        if (isFormValid) {
            let username = document.getElementById('username').value.trim();
            let password = document.getElementById('password').value.trim();
    
            return {
                username: username,
                password: password
            };
        } else {
            document.getElementById('login-form').reportValidity();
            console.error('Form is not valid');
            return null;
        }
    }
    
});

