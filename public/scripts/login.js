window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload()
    }

    let errorMessage = document.getElementById('errorMessage');
    let errors = [];

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'DominioNoCalvino') {
        errors.push('L\'email deve essere un\'email istituzionale dell\'Istituto Calvino');
        urlParams.delete('error');
        let newUrl = location.pathname;
        if(urlParams.toString().length > 0) {
            newUrl += `?${urlParams}`;
        }
        window.history.replaceState({}, '', newUrl);
    }

    if (errors.length > 0) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = errors.join(', ');
        return;
    }
});

function buttonLogin(event) {
    event.preventDefault();

    let errors = [];

    let email = document.getElementById('inputEmail');
    let password = document.getElementById('inputPassword');
    let errorMessage = document.getElementById('errorMessage');

    email.classList.remove('is-invalid');
    password.classList.remove('is-invalid');

    if (!email.value) {
        errors.push('Email è un campo obbligatorio');
        email.classList.add('is-invalid');
    }
    if (!password.value) {
        errors.push('Password è un campo obbligatorio');
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
        email: email.value.toLowerCase(),
        password: password.value
    };

    axios.post('http://localhost:3000/api/auth/login', data)
        .then((response) => {
            window.location.href = "/";
        }, (error) => {
            if (error.response && error.response.status === 404) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Utente inesistente';
            } else if (error.response && error.response.status === 401) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Password errata';
                password.classList.add('is-invalid');
            } else if (error.response && error.response.status === 402) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Utente non Verificato, vai sulla mail';
                password.classList.add('is-invalid');
            } else {
                console.error("Error:", error);
            }
        });
}

document.getElementById('flexCheckDefault').addEventListener('change', function () {
    let password = document.getElementById('inputPassword');

    if (this.checked) {
        password.type = 'text';
    } else {
        password.type = 'password';
    }
});

function cambio(){
    window.location.href = '/forgotPassword';
}
