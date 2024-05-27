document.getElementById('cambiaTema').addEventListener('click', function() {
    if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
        document.documentElement.removeAttribute('data-bs-theme');
        document.body.style.backgroundColor = 'transparent';
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.body.style.backgroundColor = '#384551';
    }
});
