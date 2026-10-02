const selectedEvent =
    JSON.parse(localStorage.getItem("selectedEvent"));

const bookingContent =
    document.getElementById("bookingContent");

const noEventMessage =
    document.getElementById("noEventMessage");


if (!selectedEvent) {

    bookingContent.style.display = "none";
    noEventMessage.style.display = "block";

} else {

    document.getElementById("eventName").textContent =
        selectedEvent.name;

    document.getElementById("eventDate").textContent =
        selectedEvent.date;

    document.getElementById("eventTime").textContent =
        selectedEvent.time;

    document.getElementById("eventVenue").textContent =
        selectedEvent.venue;

    document.getElementById("eventArtists").textContent =
        selectedEvent.artists;
}


document.getElementById("bookingForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const selectedTicket =
            document.querySelector(
                'input[name="ticket"]:checked'
            );


        const selectedDate =
            document.querySelector(
                'input[name="eventDate"]:checked'
            );


        const age =
            Number(
                document.getElementById("age").value
            );


        const error =
            document.getElementById("errorMessage");


        if (!selectedTicket) {

            error.textContent =
                "Please select a ticket type.";

            return;
        }


        if (!selectedDate) {

            error.textContent =
                "Please select a festival date.";

            return;
        }


        if (age < 15) {

            error.textContent =
                "Attendee must be at least 15 years old.";

            return;
        }


        error.textContent = "";


        const booking = {

            event: selectedEvent,

            eventDate:
                selectedDate.value,

            ticketType:
                selectedTicket.value,

            ticketTypeId:
                selectedTicket.dataset.ticketTypeId,

            price:
                Number(
                    selectedTicket.dataset.price
                ),

            attendee: {

                name:
                    document.getElementById(
                        "attendeeName"
                    ).value.trim(),

                age: age,

                email:
                    document.getElementById(
                        "email"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim()

            }

        };


        localStorage.setItem(
            "currentBooking",
            JSON.stringify(booking)
        );


        window.location.href =
            "../payment/index.html";

    });