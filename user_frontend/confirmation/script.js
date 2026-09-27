const booking =
    JSON.parse(
        localStorage.getItem("confirmedBooking")
    );


if (!booking) {

    alert("No confirmed booking found.");

    window.location.href =
        "../events/index.html";

} else {

    document.getElementById("eventName").textContent =
        booking.event.name;

    document.getElementById("ticketType").textContent =
        booking.ticketType;

    document.getElementById("attendeeName").textContent =
        booking.attendee.name;

    document.getElementById("eventDate").textContent =
        booking.event.date;

    document.getElementById("eventTime").textContent =
        booking.event.time;

    document.getElementById("eventVenue").textContent =
        booking.event.venue;

    document.getElementById("eventStage").textContent =
        booking.event.stage;

    document.getElementById("amount").textContent =
        "₹" + booking.price.toLocaleString("en-IN");

    document.getElementById("paymentMethod").textContent =
        booking.paymentMethod;


    // TEMPORARY FRONTEND TICKET ID
    // Backend/database can generate the real ticket_id later.

    let ticketId =
        localStorage.getItem("generatedTicketId");


    if (!ticketId) {

        ticketId =
            "TK" +
            Date.now()
                .toString()
                .slice(-6);

        localStorage.setItem(
            "generatedTicketId",
            ticketId
        );

    }


    document.getElementById("ticketId").textContent =
        ticketId;

}