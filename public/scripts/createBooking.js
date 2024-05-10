document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('inputDate');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    datePicker.value = tomorrow.toISOString().slice(0,10);
});

function buttonLogin(event){
    event.preventDefault();
    let errors = [];

    let roomId = document.getElementById('roomSelection').value;
    let beginTime = document.getElementById('inputTime1').value;
    let endTime = document.getElementById('inputTime2').value;
    let date = document.getElementById('inputDate').value;
    let description = document.getElementById('inputDescription').value;

    let beginTimeDate = new Date(`1970-01-01T${beginTime}:00`);
    let endTimeDate = new Date(`1970-01-01T${endTime}:00`);

    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    let selectedDate = new Date(date);

    if (selectedDate < currentDate) {
        errors.push("La data non può essere antecedente a oggi");
    }

    if (endTimeDate <= beginTimeDate) {
        errors.push("L'orario di fine deve essere maggiore dell'orario di inizio");
    }

    const errorMessageElement = document.getElementById('errorMessage');
    if (errors.length > 0) {
        errorMessageElement.style.display = 'block';
        errorMessageElement.innerHTML = errors.join('<br>');
    } else {
        errorMessageElement.style.display = 'none';
        invioDati(roomId, beginTime, endTime, date, description)
    }
}

async function invioDati(roomId, beginTime, endTime, date, description) {
    const response = await fetch('http://localhost:3000/api/bookings/booksRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room: roomId,
            date: date,
            start_time: beginTime,
            end_time: endTime,
            description: description
        })
    });

    const data = await response.json();

    if (response.status === 400 || response.status === 500) {
        const errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.style.display = 'block';
        errorMessageElement.innerHTML = 'Stanza già prenotata in questo orario';
    } else {
        window.location.href = "/";
    }

    console.log(data);
}