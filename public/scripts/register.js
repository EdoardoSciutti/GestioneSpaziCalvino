window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload() 
    }
});

function buttonRegistrati(event){
    event.preventDefault();

    let errors = [];

    let nome = document.getElementById('inputNome');
    let cognome = document.getElementById('inputCognome');
    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    let password2 = document.getElementById('inputPassword2');
    let errorMessage = document.getElementById('errorMessage');

    nome.classList.remove('is-invalid');
    cognome.classList.remove('is-invalid');
    email.classList.remove('is-invalid');
    password.classList.remove('is-invalid');
    password2.classList.remove('is-invalid');

    if (!nome.value) {
        errors.push('Nome è un campo obbligatorio');
        nome.classList.add('is-invalid');
    }
    if (!cognome.value) {
        errors.push('Cognome è un campo obbligatorio');
        cognome.classList.add('is-invalid');
    }
    if (!email.value) {
        errors.push('Email è un campo obbligatorio');
        email.classList.add('is-invalid');
    }
    if (!password.value) {
        errors.push('Password è un campo obbligatorio');
        password.classList.add('is-invalid');
    }
    if (!password2.value) {
        errors.push('Conferma password è un campo obbligatorio');
        password2.classList.add('is-invalid');
    }

    if (password.value !== password2.value) {
        errors.push('Le password non coincidono');
        password.classList.add('is-invalid');
        password2.classList.add('is-invalid');
    }

    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (password.value && !passwordRegex.test(password.value)) {
        errors.push('Password non valida. Deve contenere almeno 8 caratteri, almeno una lettera maiuscola, una lettera minuscola e un carattere speciale.');
        password.classList.add('is-invalid');
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        errors.push('Email non valida');
        email.classList.add('is-invalid');
    }

    if (errors.length > 0) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = errors.join(', ');
        return;
    }

    let data = {
        name: nome.value,
        surname: cognome.value,
        email: email.value.toLowerCase(),
        password: password.value
    };

    axios.post('http://localhost:3000/api/auth/register', data) // Use HTTPS
    .then((response) => {
        window.location.href = "/login";
    }, (error) => {
        if (error.response && error.response.status === 400) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Email già utilizzata';
            email.classList.add('is-invalid');
        } else {
            console.error(error); // Use console.error to log errors
        }
    });
}
document.getElementById('flexCheckDefault').addEventListener('change', function() {
    let password = document.getElementById('inputPassword');
    let password2 = document.getElementById('inputPassword2');

    if (this.checked) {
        password.type = 'text';
        password2.type = 'text';
    } else {
        password.type = 'password';
        password2.type = 'password';
    }
});