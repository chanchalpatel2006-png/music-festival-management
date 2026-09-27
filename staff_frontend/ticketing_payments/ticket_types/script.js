const API_URL = "http://localhost:3000/api/ticket-type";

const ticketTypeTableBody =
    document.getElementById("ticketTypeTableBody");


// ------------------------------------
// LOAD TICKET TYPES
// ------------------------------------

async function loadTicketTypes() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Failed to load ticket types"
            );

        }

        const ticketTypes =
            await response.json();


        ticketTypeTableBody.innerHTML = "";


        ticketTypes.forEach(ticketType => {

            const row =
                ticketTypeTableBody.insertRow();


            row.insertCell(0).textContent =
                ticketType.ticket_type_id;

            row.insertCell(1).textContent =
                ticketType.type_name;

            row.insertCell(2).textContent =
                ticketType.total_quantity;

            row.insertCell(3).textContent =
                ticketType.available;

            row.insertCell(4).textContent =
                Number(ticketType.price).toFixed(2);

        });


    } catch (error) {

        console.error(error);

        alert(
            "Could not load ticket types from database."
        );

    }

}


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

loadTicketTypes();