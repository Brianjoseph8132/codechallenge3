document.addEventListener("DOMContentLoaded", () => {
    const filmList = document.getElementById("films");
    const posterImage = document.getElementById("poster");
    const titleElement = document.getElementById("title");
    const runtimeElement = document.getElementById("runtime");
    const filmInfoElement = document.getElementById("film-info");
    const showtimeElement = document.getElementById("showtime");
    const ticketNumElement = document.getElementById("ticket-num");
    const buyTicketButton = document.getElementById("buy-ticket");
  
    // This is fetch event
    fetch("http://localhost:3000/films")
      .then((response) => response.json())
      .then((movie) => {
        movie.forEach(film => {
          const li = document.createElement("li");
          li.className = "film item";
          li.innerText = film.title;
          li.dataset.id = film.id;

          function deleteFilm(filmId) {
            fetch(`http://localhost:3000/films/${filmId}`, {
              method: "DELETE",
            })
              
          }





          //delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "button delete";
      deleteButton.innerText = "delete";

      //add the delete button
      li.appendChild(deleteButton);

      //onclick display the details
      li.addEventListener("click", (e) =>{
        if(!e.target.classList.contains("button delete")){
          displayFilmDetails(film);
          filmList.appendChild(li);
        }
    })
  
          
          li.addEventListener("click", () => displayFilmDetails(film));
          filmList.appendChild(li);
        });
      });
  
    // Function for displaying film details
    function displayFilmDetails(film) {
      const availableTickets = film.capacity - film.tickets_sold;
      posterImage.src = film.poster;
      titleElement.innerText = film.title;
      runtimeElement.innerText = `${film.runtime} minutes`;
      filmInfoElement.innerText = film.description;
      showtimeElement.innerText = film.showtime;
      ticketNumElement.innerText = availableTickets;
  
      //disable the buy ticket button 
      buyTicketButton.innerText = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
      buyTicketButton.disabled = availableTickets === 0;
  
      // ticket purchase
      buyTicketButton.onclick = () => {
        if (availableTickets > 0) {
          buyTicket(film);
        }
      };
    }
  
    // creating function to buy a ticket
    function buyTicket(film) {
      const newTicketsSold = film.tickets_sold + 1;
  
      // for upating tickets sold on the server
      fetch(`http://localhost:3000/films/${film.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets_sold: newTicketsSold }),
      })
        .then(response => response.json())
        .then(updatedFilm => {
          // Updating new films details display
          displayFilmDetails(updatedFilm);
  
          // POST new ticket to the tickets endpoint
          fetch("http://localhost:3000/tickets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              film_id: film.id,
              number_of_tickets: 1,
            }),
          });
        });
    }
  
    
  });