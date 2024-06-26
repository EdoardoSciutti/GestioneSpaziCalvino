function button() {
    mail = document.getElementById('inputEmail').value;
    invioDati(mail);
}

async function invioDati(mail) {
    const response = await fetch('http://localhost:3000/api/auth/forgotPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: mail
        })
    });

    const data = await response.json();

    if (response.status === 400) {
        console.log("Error: " + data.error);
    } else {
        window.location.href = '/passwordSuccess'; // change this to the correct path
    }
}
