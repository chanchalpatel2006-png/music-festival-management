const cards = {
    vendorsCard: "vendors/index.html",
    stallsCard: "stalls/index.html",
    stallSetupsCard: "stall_setups/index.html"
};

Object.entries(cards).forEach(function ([cardId, destination]) {

    const card = document.getElementById(cardId);

    if (card) {
        card.addEventListener("click", function () {
            window.location.href = destination;
        });
    }

});