const addEventBtn = document.getElementById("addEventBtn");
const eventModal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");

const eventForm = document.getElementById("eventForm");
const eventTableBody = document.getElementById("eventTableBody");

const timeError = document.getElementById("timeError");

let editingRow = null;


// ------------------------------------
// OPEN ADD EVENT
// ------------------------------------

addEventBtn.addEventListener("click", function () {

    editingRow = null;

    eventForm.reset();

    timeError.textContent = "";

    document.querySelector("#eventModal h2").textContent =
        "Add Event";

    document.querySelector(".save-btn").textContent =
        "Add Event";

    eventModal.style.display = "flex";
});


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener("click", function () {
    eventModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === eventModal) {
        eventModal.style.display = "none";
    }

});


// ------------------------------------
// ADD / UPDATE EVENT
// ------------------------------------

eventForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const eventId =
        document.getElementById("eventId").value;

    const eventName =
        document.getElementById("eventName").value;

    const eventDate =
        document.getElementById("eventDate").value;

    const startTime =
        document.getElementById("startTime").value;

    const endTime =
        document.getElementById("endTime").value;

    const venueId =
        document.getElementById("venueId").value;


    // CHECK DATABASE RULE:
    // end_time > start_time

    if (endTime <= startTime) {

        timeError.textContent =
            "End time must be later than start time.";

        return;
    }

    timeError.textContent = "";


    // --------------------------------
    // EDIT EXISTING EVENT
    // --------------------------------

    if (editingRow !== null) {

        editingRow.cells[0].textContent = eventId;
        editingRow.cells[1].textContent = eventName;
        editingRow.cells[2].textContent = eventDate;
        editingRow.cells[3].textContent = startTime;
        editingRow.cells[4].textContent = endTime;
        editingRow.cells[5].textContent = venueId;

        editingRow = null;

    }


    // --------------------------------
    // ADD NEW EVENT
    // --------------------------------

    else {

        const row = eventTableBody.insertRow();


        row.insertCell(0).textContent = eventId;

        row.insertCell(1).textContent = eventName;

        row.insertCell(2).textContent = eventDate;

        row.insertCell(3).textContent = startTime;

        row.insertCell(4).textContent = endTime;

        row.insertCell(5).textContent = venueId;


        const actionCell = row.insertCell(6);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    eventForm.reset();

    eventModal.style.display = "none";

});


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

eventTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");


    // DELETE EVENT
    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm("Are you sure you want to delete this event?");


        if (confirmDelete) {
            row.remove();
        }

    }


    // EDIT EVENT
    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("eventId").value =
            row.cells[0].textContent;

        document.getElementById("eventName").value =
            row.cells[1].textContent;

        document.getElementById("eventDate").value =
            row.cells[2].textContent;

        document.getElementById("startTime").value =
            row.cells[3].textContent;

        document.getElementById("endTime").value =
            row.cells[4].textContent;

        document.getElementById("venueId").value =
            row.cells[5].textContent;


        timeError.textContent = "";


        document.querySelector("#eventModal h2").textContent =
            "Edit Event";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        eventModal.style.display = "flex";

    }

});