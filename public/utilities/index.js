document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('bsb-calendar-1');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      dateClick: function(info) {
        alert('Data selezionata ' + info.dateStr)
      }
    });
  
    calendar.render();
  });