const booking =
    JSON.parse(localStorage.getItem("currentBooking"));

const API_URL =
    "http://localhost:3000/api/bookings";


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
        "₹" + Number(booking.price).toLocaleString("en-IN");

}


document.getElementById("paymentForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const paymentError =
            document.getElementById("paymentError");

        paymentError.textContent = "";


        const paymentMethod =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        if (!paymentMethod) {

            paymentError.textContent =
                "Please select a payment method.";

            return;
        }


        if (!booking.eventDate) {

            paymentError.textContent =
                "Festival date is missing. Please go back and select a date.";

            return;
        }


        if (!booking.ticketTypeId) {

            paymentError.textContent =
                "Ticket Type ID is missing. Please go back and select the ticket.";

            return;
        }


        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        event_date:
                            booking.eventDate,

                        ticket_type_id:
                            booking.ticketTypeId,

                        attendee: {

                            name:
                                booking.attendee.name,

                            age:
                                booking.attendee.age,

                            email:
                                booking.attendee.email,

                            phone:
                                booking.attendee.phone

                        },

                        payment_method:
                            paymentMethod.value

                    })

                });


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Booking failed."
                );

            }


            /*
             * Save the real database result.
             */

            const confirmedBooking = {

                event:
                    booking.event,

                eventDate:
                    booking.eventDate,

                ticketType:
                    booking.ticketType,

                ticketTypeId:
                    booking.ticketTypeId,

                price:
                    Number(result.amount),

                attendee:
                    booking.attendee,

                paymentMethod:
                    paymentMethod.value,

                paymentStatus:
                    result.payment_status,

                ticketStatus:
                    result.ticket_status,

                attendeeId:
                    result.attendee_id,

                ticketId:
                    result.ticket_id,

                paymentId:
                    result.payment_id

            };


            localStorage.setItem(
                "confirmedBooking",
                JSON.stringify(confirmedBooking)
            );


            window.location.href =
                "../confirmation/index.html";


        } catch (error) {

            console.error(
                "Booking error:",
                error
            );

            paymentError.textContent =
                error.message ||
                "Could not complete the booking. Please try again.";

        }

    });