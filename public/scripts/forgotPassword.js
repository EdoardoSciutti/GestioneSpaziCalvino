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
        console.log("Fallito: " + data.error);
    } else {
        console.log("Riucito: " + data.message);
        window.location.href = '/changePassword';
    }

    console.log(data);
}
