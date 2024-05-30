window.onload = function () {
    var inputDate = document.getElementById('inputDate');
    var today = new Date();
    var formattedDate = today.toISOString().split('T')[0];
    inputDate.value = formattedDate;
};

function buttonDelete(event) {
    searchBookings();
}

function searchBookings() {
    var inputDate = document.getElementById('inputDate');
    var formattedDate = inputDate.value;
    var endpoint = `http://localhost:3000/api/bookings/getBookingsOfDay/${formattedDate}`;

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            creaCheckBox(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function creaCheckBox(data) {
    var checkBoxDiv = document.getElementById('checkBoxDiv');
    checkBoxDiv.innerHTML = ''; // Clear previous content

    if (data.length === 0) {
        checkBoxDiv.innerHTML = '<p>Nessuna prenotazione trovata per questa data.</p>';
    } else {
        data.forEach(booking => {
            var card = document.createElement('div');
            card.classList.add('card', 'mb-3');

            var cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            var startTime = document.createElement('p');
            startTime.textContent = 'Orario di inizio: ' + booking.start_time;

            var endTime = document.createElement('p');
            endTime.textContent = 'Orario di fine: ' + booking.end_time;

            var description = document.createElement('p');
            description.textContent = 'Descrizione: ' + booking.description;

            var room = document.createElement('p');
            room.textContent = 'Aula: ' + booking.room.description; // Utilizza la descrizione della stanza invece dell'ID

            var user = document.createElement('p');
            user.textContent = 'Utente: ' + booking.user.name + ' ' + booking.user.surname;

            var button = document.createElement('button');
            button.type = 'button';
            button.textContent = 'Elimina';
            button.classList.add('btn', 'btn-danger');
            button.addEventListener('click', function () {
                // Deselect all other buttons
                var buttons = document.querySelectorAll('.btn-danger');
                buttons.forEach(function (btn) {
                    if (btn !== button) {
                        btn.disabled = false;
                    }
                });
                // Disable this button
                button.disabled = true;

                // Call deleteBooking function passing booking data
                deleteBooking(booking.start_time, booking.end_time, booking.room.room_id); // Passa la descrizione della stanza
            });

            cardBody.appendChild(room); // Aggiungi la descrizione della stanza
            cardBody.appendChild(startTime);
            cardBody.appendChild(endTime);
            cardBody.appendChild(description);
            cardBody.appendChild(user);
            cardBody.appendChild(button);

            card.appendChild(cardBody);
            checkBoxDiv.appendChild(card);
        });
    }
}

function deleteBooking(start_time, end_time, room_description) {

    var inputDate = document.getElementById('inputDate');

    var requestData = {
        date_day: inputDate.value,
        start_time: start_time,
        end_time: end_time,
        room_id: room_description
    };

    // Send POST request to deleteBooking endpoint
    fetch('http://localhost:3000/api/bookings/deleteBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            searchBookings();
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error or show a message to the user
        });
}
