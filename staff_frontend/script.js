// ARTIST MANAGEMENT CARD
const artistCard = document.getElementById("artistCard");

if (artistCard) {
    artistCard.addEventListener("click", function () {
        window.location.href = "artist_management/index.html";
    });
}


// EVENT & VENUE CARD
const eventVenueCard = document.getElementById("eventVenueCard");

if (eventVenueCard) {
    eventVenueCard.addEventListener("click", function () {
        window.location.href = "event_venue/index.html";
    });
}


// TICKETING & PAYMENTS CARD

const ticketingCard =
    document.getElementById("ticketingCard");

if (ticketingCard) {

    ticketingCard.addEventListener("click", function () {

        window.location.href =
            "ticketing_payments/index.html";

    });

}

// VENDOR & STALL CARD
const vendorCard = document.getElementById("vendorCard");

if (vendorCard) {
    vendorCard.addEventListener("click", function () {
        window.location.href = "vendor_stall/index.html";
    });
}


// SPONSORSHIPS & STAFFING CARD

const sponsorStaffCard =
    document.getElementById("sponsorStaffCard");

if (sponsorStaffCard) {

    sponsorStaffCard.addEventListener("click", function () {

        window.location.href =
            "sponsorship_staffing/index.html";

    });

}