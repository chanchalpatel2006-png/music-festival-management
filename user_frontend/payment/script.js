const booking =
    JSON.parse(localStorage.getItem("currentBooking"));


if (!booking) {

    alert("No booking found.");

    window.location.href =
        "../events/index.html";

} else {

    document.getElementById("summaryEvent").textContent =
        booking.event.name;

    document.getElementById("summaryTicket").textContent =
        booking.ticketType;

    document.getElementById("summaryAttendee").textContent =
        booking.attendee.name;

    document.getElementById("summaryPrice").textContent =
        "₹" + booking.price.toLocaleString("en-IN");

}


document.getElementById("paymentForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const paymentMethod =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        if (!paymentMethod) {

            document.getElementById(
                "paymentError"
            ).textContent =
                "Please select a payment method.";

            return;
        }


        booking.paymentMethod =
            paymentMethod.value;


        booking.paymentStatus =
            "Success";


        booking.ticketStatus =
            "Active";


        localStorage.setItem(
            "confirmedBooking",
            JSON.stringify(booking)
        );


        window.location.href =
            "../confirmation/index.html";

    });