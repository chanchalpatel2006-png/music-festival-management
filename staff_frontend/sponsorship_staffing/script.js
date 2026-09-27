const pages = {
    sponsorsCard: "sponsors/index.html",
    sponsorDemandsCard: "sponsor_demands/index.html",
    staffCard: "staff/index.html",
    staffAssignmentsCard: "staff_assignments/index.html"
};


Object.entries(pages).forEach(function ([id, page]) {

    const card = document.getElementById(id);

    if (card) {

        card.addEventListener("click", function () {

            window.location.href = page;

        });

    }

});