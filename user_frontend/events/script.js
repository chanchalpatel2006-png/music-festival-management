const eventCards = document.querySelectorAll(".event-card");

const modal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const bookEventBtn = document.getElementById("bookEventBtn");

let selectedEvent = null;


eventCards.forEach(function (card) {

    const button = card.querySelector(".view-btn");

    button.addEventListener("click", function () {

        selectedEvent = {
            name: card.dataset.event,
            date: card.dataset.date,
            time: card.dataset.time,
            venue: card.dataset.venue,
            stage: card.dataset.stage,
            artists: card.dataset.artists
        };

        document.getElementById("modalEventName").textContent =
            selectedEvent.name;

        document.getElementById("modalDate").textContent =
            selectedEvent.date;

        document.getElementById("modalTime").textContent =
            selectedEvent.time;

        document.getElementById("modalVenue").textContent =
            selectedEvent.venue;

        document.getElementById("modalStage").textContent =
            selectedEvent.stage;

        document.getElementById("modalArtists").textContent =
            selectedEvent.artists;

        modal.style.display = "flex";
    });

});


closeModal.addEventListener("click", function () {
    modal.style.display = "none";
});


modal.addEventListener("click", function (event) {

    if (event.target === modal) {
        modal.style.display = "none";
    }

});


bookEventBtn.addEventListener("click", function () {

    if (!selectedEvent) {
        return;
    }

    localStorage.setItem(
        "selectedEvent",
        JSON.stringify(selectedEvent)
    );

    window.location.href =
        "../booking/index.html";
});


// SEARCH

document.getElementById("searchInput")
    .addEventListener("input", function () {

        const search =
            this.value.toLowerCase();

        eventCards.forEach(function (card) {

            const text =
                card.textContent.toLowerCase();

            card.style.display =
                text.includes(search) ? "" : "none";

        });

    });