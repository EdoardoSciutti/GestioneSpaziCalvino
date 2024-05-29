document.getElementById('cambiaTema').addEventListener('click', function() {
    if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
        document.documentElement.removeAttribute('data-bs-theme');
        document.body.style.backgroundColor = 'transparent';
        document.body.style.color = 'black';
        localStorage.setItem('Tema', 'Chiaro');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.body.style.backgroundColor = '#384551';
        document.body.style.color = 'white';
        localStorage.setItem('Tema', 'Scuro');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var theme = localStorage.getItem('Tema');
    if (theme === 'Scuro') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.body.style.backgroundColor = '#384551';
        document.body.style.color = 'white';
    } else {
        document.documentElement.removeAttribute('data-bs-theme');
        document.body.style.backgroundColor = 'transparent';
        document.body.style.color = 'black';
    }
});
