# GestioneSpaziCalvino
Sito Web per prenotare la Sala Agorà e L'aula Magna

Fasi:

1 - Progettare il Database

  1.1 - Schema ER
  1.2 - Schema Logico
  1.3 - Creazioni Stored Procedure & View

2 - Progettare il Sito Web

  2.1 - Struttura Sito
  2.2 - Wireframe
  2.3 - Mock Up

3 - Collegare i Due

  3.1 - Collegare il FrontEnd al BackEnd

4 - Test

  4.1 - Prove con Xampp
  4.2 - Caricamento sul database del Calvino

__FUNZIONALITÀ DELL'APPLICAZIONE__:
Gli user sono coloro che prenoteranno le stanze, e essi faranno parte di una compagnia.
Gli user saranno gli impiegati di un'azienda, e questi potranno prenotare delle stanze. 
Nel caso in cui siano i professori, saranno impiegati del Calvino, così come i rappresentanti d'istituto. 

PER SCIUTTI: (tette culo solo se <= 12)
registrzazione (http://localhost:3000/api/auth/register) : name, surname, email, password
login (http://localhost:3000/api/auth/login): email, password
prenotazione (http://localhost:3000/api/bookings/booksroom): date, room, start_time, end_time