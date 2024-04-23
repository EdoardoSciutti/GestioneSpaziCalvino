window.onload = function() {
    $('#datepicker').datepicker('setDate', new Date());
    generateWeekCalendar(new Date());

    var calendar = document.getElementById('calendar');
    var bottoni = document.getElementById('bottoni');
    var messaggio = document.getElementById('logga');
    var esci = document.getElementById('esci');
    var accedi = document.getElementById('accedi');
    var registrati = document.getElementById('registrati');
    document.getElementById('esci').addEventListener('click', logout);

    fetch('http://localhost:3000/api/auth/isLogged', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
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
                calendar.style.display = 'block';
                bottoni.style.display = 'block';
                messaggio.style.display = 'none';
                esci.style.display = 'block';
                accedi.style.display = 'none';
                registrati.style.display = 'none';
            } else {
                console.log('L\'utente non è loggato');
                calendar.style.display = 'none';
                bottoni.style.display = 'none';
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

$(document).ready(function () {
    $('#datepicker').datepicker({
        dateFormat: "dd mm yy",
        autoclose: true,
        todayHighlight: true,
        orientation: "bottom auto",
        templates: {
            leftArrow: '<i class="fa fa-chevron-left"></i>',
            rightArrow: '<i class="fa fa-chevron-right"></i>'
        }
    }).on('changeDate', function(e) {
        var selectedDate = $('#datepicker').datepicker('getDate');
        if (selectedDate !== null) {
            generateWeekCalendar(selectedDate);
        }
    });
    var currentSelectedDate = $('#datepicker').datepicker('getDate');
    if (currentSelectedDate !== null) {
        generateWeekCalendar(currentSelectedDate);
    }
});

$(document).on('click', '.card', function() {
    var day = $(this).find('.card-title').text(); // Ottieni il giorno dal calendario
    $('#dayModalLabel').text(day); // Imposta il giorno come titolo del modal
    $('#dayModal').modal('show'); // Mostra il modal
});

function logout() {
    fetch('http://localhost:3000/api/auth/logout', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
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
                // Aggiorna la pagina o reindirizza l'utente alla pagina di login
                window.location.href = '/';
            } else {
                console.log('Errore durante il logout');
                // Mostra un messaggio di errore all'utente
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function generateWeekCalendar(selectedDate) {
    var weekStart = new Date(selectedDate);
    var currentDayOfWeek = selectedDate.getDay();
    var offset = (currentDayOfWeek === 0) ? 6 : currentDayOfWeek - 1;
    weekStart.setDate(selectedDate.getDate() - offset);
    var daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    var weekHtml = '';
    for (var i = 0; i < 7; i++) {
        var day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        weekHtml += '<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">'; // Aggiunto mb-3 per il margine inferiore
        weekHtml += '<div class="card">';
        weekHtml += '<div class="card-body">';
        weekHtml += '<h5 class="card-title">' + daysOfWeek[i] + ' ' + day.getDate() + '/' + (day.getMonth() + 1) + '/' + day.getFullYear() + '</h5>';
        weekHtml += '</div></div></div>';
    }
    $('#week-calendar').html(weekHtml);
}