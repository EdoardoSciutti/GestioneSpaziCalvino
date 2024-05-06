window.onload = function() {
    var tutto = document.getElementById('tutto');
    var messaggio = document.getElementById('logga');
    var esci = document.getElementById('esci');
    var accedi = document.getElementById('accedi');
    var registrati = document.getElementById('registrati');
    esci.addEventListener('click', logout);

    fetch('http://localhost:3000/api/auth/isLogged', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data) {
            console.log(data);
            if (data.success) {
                console.log('L\'utente è loggato');
                tutto.style.display = 'block';
                messaggio.style.display = 'none';
                esci.style.display = 'block';
                accedi.style.display = 'none';
                registrati.style.display = 'none';
            } else {
                console.log('L\'utente non è loggato');
                tutto.style.display = 'none';
                messaggio.style.display = 'block';
                esci.style.display = 'none';
                accedi.style.display = 'block';
                registrati.style.display = 'block';
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

 const today = new Date();
 const dateStr = today.toISOString().substring(0, 10);  // Converte la data odierna in stringa formato 'YYYY-MM-DD'

 $('#date').val(dateStr);  // Imposta il valore del campo di input

 // Inizializza il datepicker
 $('.datepicker').datepicker({
     format: 'yyyy-mm-dd',   // Imposta il formato della data
     autoclose: true,        // Chiude il datepicker quando una data è stata scelta
     todayHighlight: true,   // Evidenzia la data odierna
 });

function logout() {
    fetch('http://localhost:3000/api/auth/logout', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data) {
            console.log(data);
            if (data.success) {
                console.log('Logout effettuato con successo');
                window.location.href = '/';
            } else {
                console.log('Errore durante il logout');
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const roomId = document.getElementById('roomId').value;
    const date = document.getElementById('date').value;
    
    fetch(`http://localhost:3000/api/bookings/getBookingsOfRoom/${roomId}/${date}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => displayResults(data))
        .catch(error => console.error('There was a problem with your fetch operation:', error));
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results
    
    // Stampa per debug
    console.log(data);

    // Aggiungi un controllo per assicurarti che data sia definito e non vuoto
    if (!data || data.length === 0) {
        resultsDiv.innerHTML = '<p>Nessuna prenotazione per questa data</p>';
        return;
    }

    // Processa ogni stanza nell'array di stanze
    data.forEach(room => {
        if (room && room.bookings && room.bookings.length > 0) {
            const roomDesc = document.createElement('h3');
            roomDesc.textContent = `Room Description: ${room.description}`;
            resultsDiv.appendChild(roomDesc);

            // Itera su ogni prenotazione nella stanza
            room.bookings.forEach(booking => {
                const bookingDetails = document.createElement('p');
                bookingDetails.innerHTML = `
                    <strong>Ora di inizio - fine:</strong> ${formatTime(booking.start_time)} to ${formatTime(booking.end_time)}<br>
                    <strong>Prenotato da:</strong> ${booking.user.name} ${booking.user.surname}
                `;
                resultsDiv.appendChild(bookingDetails);
            });
        } else {
            resultsDiv.innerHTML += '<p>No bookings found for this room on this date.</p>';
        }
    });
}

function formatTime(timeStr) {
    // Assuming timeStr is in 'HH:mm:ss' format
    return timeStr.substring(0, 5); // This trims off seconds for better readability
}
