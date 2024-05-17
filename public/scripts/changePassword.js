document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('flexCheckDefault').addEventListener('change', function () {
        let password = document.getElementById('inputPassword');
        let confirmPassword = document.getElementById('inputPasswordConfirm');

        if (this.checked) {
            password.type = 'text';
            confirmPassword.type = 'text';
        } else {
            password.type = 'password';
            confirmPassword.type = 'password';
        }
    });
});

function button() {
    let password = document.getElementById('inputPassword').value;
    let passwordConfirm = document.getElementById('inputPasswordConfirm').value;
    let errors = [];

    if (password !== passwordConfirm) {
        errors.push("Le password non corrispondono");
    }

    if (password.length < 8) {
        errors.push("La password deve essere lunga almeno 8 caratteri");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("La password deve contenere almeno una lettera maiuscola");
    }

    if (!/[0-9]/.test(password)) {
        errors.push("La password deve contenere almeno un numero");
    }

    if (!/[!@#$%^&*]/.test(password)) {
        errors.push("La password deve contenere almeno un carattere speciale");
    }

    if (errors.length === 0) {
        invioDatiPassword(password);
    } else {
        let errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = errors.join(', ');
        errorMessage.style.display = 'block';
    }
}

async function invioDatiPassword(password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
            })
        });

        const data = await response.json();

        if (response.status === 400) {
            console.log("Fallito: " + data.error);
        } else {
            console.log("Riucito: " + data.message);
            window.location.href = '/login';
        }

        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
