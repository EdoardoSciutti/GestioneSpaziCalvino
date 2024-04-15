document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('bsb-calendar-1');
  var aggiungiEventoEl = document.querySelector('.aggiungi-evento');
  var giornoEl = document.querySelector('.giorno');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    dateClick: function(info) {
      aggiungiEventoEl.style.display = 'block';
      giornoEl.textContent = "Aggiungi un Evento nel giorno " + info.dateStr;
    }
  });

  calendar.render();
});

function chiudiAggiungi(){
  var aggiungiEventoEl = document.querySelector('.aggiungi-evento');
  aggiungiEventoEl.style.display = 'none';
}