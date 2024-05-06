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
            if (data.success) {
                tutto.style.display = 'block';
                messaggio.style.display = 'none';
                esci.style.display = 'block';
                accedi.style.display = 'none';
                registrati.style.display = 'none';
            } else {
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
            if (data.success) {
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

document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('date');
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10);

    $(datePicker).datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
    });

    $(datePicker).datepicker('setDate', today);

    document.getElementById('results').innerHTML = '';
    for (let roomId = 1; roomId <= 8; roomId++) {
        fetchBookings(roomId, formattedToday);
    }

    $(datePicker).on('changeDate', function(e) {
        document.getElementById('results').innerHTML = '';
        for (let roomId = 1; roomId <= 8; roomId++) {
            fetchBookings(roomId, e.format('yyyy-mm-dd'));
        }
    });
});

function fetchBookings(roomId, date) {
    fetch(`http://localhost:3000/api/bookings/getBookingsOfRoom/${roomId}/${date}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => displayResults(data, roomId))
        .catch(error => console.error('There was a problem with your fetch operation:', error));
}

function displayResults(data, roomId) {
    const resultsDiv = document.getElementById('results');  
    let rowDiv;
    if (roomId % 3 === 1) {
        rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        resultsDiv.appendChild(rowDiv);
    } else {
        rowDiv = resultsDiv.lastElementChild;
    }

    if (data && data.length > 0) {
        data.forEach(room => {
            if (room && room.bookings && room.bookings.length > 0) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-4';
                const roomDesc = document.createElement('h3');
                roomDesc.textContent = `Stanza ${roomId}: ${room.description}`;
                colDiv.appendChild(roomDesc);

                room.bookings.forEach(booking => {
                    const bookingDetails = document.createElement('p');
                    bookingDetails.innerHTML = `
                        <strong>Ora d'inizio:</strong> ${formatTime(booking.start_time)}<br>
                        <strong>Ora di fine:</strong> ${formatTime(booking.end_time)}<br>
                        <strong>Prenotato da:</strong> ${booking.user.name} ${booking.user.surname}<br>
                        <strong>Descrizione:</strong> ${booking.description || "Nessuna descrizione fornita"}
                    `;
                    colDiv.appendChild(bookingDetails);
                });
                rowDiv.appendChild(colDiv);
            }
        });
    }
}

function formatTime(timeStr) {
    return timeStr.substring(0, 5);
}
