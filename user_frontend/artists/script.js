const search =
    document.getElementById("artistSearch");

const artistCards =
    document.querySelectorAll(".artist-card");


search.addEventListener("input", function () {

    const value =
        search.value.toLowerCase();

    artistCards.forEach(function (card) {

        const content =
            card.textContent.toLowerCase();

        card.style.display =
            content.includes(value)
                ? ""
                : "none";

    });

});