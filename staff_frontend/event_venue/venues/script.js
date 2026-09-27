const addVenueBtn = document.getElementById("addVenueBtn");
const venueModal = document.getElementById("venueModal");
const closeModal = document.getElementById("closeModal");

const venueForm = document.getElementById("venueForm");
const venueTableBody = document.getElementById("venueTableBody");

let editingRow = null;


// ------------------------------------
// OPEN ADD VENUE
// ------------------------------------

addVenueBtn.addEventListener("click", function () {

    editingRow = null;

    venueForm.reset();

    document.querySelector("#venueModal h2").textContent =
        "Add Venue";

    document.querySelector(".save-btn").textContent =
        "Add Venue";

    venueModal.style.display = "flex";
});


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener("click", function () {
    venueModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === venueModal) {
        venueModal.style.display = "none";
    }

});


// ------------------------------------
// ADD / UPDATE VENUE
// ------------------------------------

venueForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const venueId =
        document.getElementById("venueId").value;

    const venueName =
        document.getElementById("venueName").value;

    const venueLocation =
        document.getElementById("venueLocation").value;


    // EDIT EXISTING VENUE
    if (editingRow !== null) {

        editingRow.cells[0].textContent = venueId;
        editingRow.cells[1].textContent = venueName;
        editingRow.cells[2].textContent = venueLocation;

        editingRow = null;

    }

    // ADD NEW VENUE
    else {

        const row = venueTableBody.insertRow();


        row.insertCell(0).textContent = venueId;

        row.insertCell(1).textContent = venueName;

        row.insertCell(2).textContent = venueLocation;


        const actionCell = row.insertCell(3);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    venueForm.reset();

    venueModal.style.display = "none";

});


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

venueTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm("Are you sure you want to delete this venue?");

        if (confirmDelete) {
            row.remove();
        }

    }


    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("venueId").value =
            row.cells[0].textContent;

        document.getElementById("venueName").value =
            row.cells[1].textContent;

        document.getElementById("venueLocation").value =
            row.cells[2].textContent;


        document.querySelector("#venueModal h2").textContent =
            "Edit Venue";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        venueModal.style.display = "flex";

    }

});