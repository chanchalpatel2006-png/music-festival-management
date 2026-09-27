const addAttendeeBtn =
    document.getElementById("addAttendeeBtn");

const attendeeModal =
    document.getElementById("attendeeModal");

const closeModal =
    document.getElementById("closeModal");

const attendeeForm =
    document.getElementById("attendeeForm");

const attendeeTableBody =
    document.getElementById("attendeeTableBody");

const formError =
    document.getElementById("formError");


let editingRow = null;


// ------------------------------------
// OPEN ADD ATTENDEE
// ------------------------------------

addAttendeeBtn.addEventListener("click", function () {

    editingRow = null;

    attendeeForm.reset();

    formError.textContent = "";

    document.querySelector("#attendeeModal h2").textContent =
        "Add Attendee";

    document.querySelector(".save-btn").textContent =
        "Add Attendee";

    attendeeModal.style.display = "flex";

});


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener("click", function () {

    attendeeModal.style.display = "none";

});


window.addEventListener("click", function (event) {

    if (event.target === attendeeModal) {

        attendeeModal.style.display = "none";

    }

});


// ------------------------------------
// ADD / UPDATE ATTENDEE
// ------------------------------------

attendeeForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const attendeeId =
        document.getElementById("attendeeId").value.trim();

    const attendeeName =
        document.getElementById("attendeeName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const age =
        document.getElementById("age").value;


    // ------------------------------------
    // AGE VALIDATION
    // ------------------------------------

    if (Number(age) < 15) {

        formError.textContent =
            "Attendee must be at least 15 years old.";

        return;

    }


    // ------------------------------------
    // EMAIL VALIDATION
    // Matches database CHECK email LIKE '%@%'
    // ------------------------------------

    if (!email.includes("@")) {

        formError.textContent =
            "Please enter a valid email address.";

        return;

    }


    // ------------------------------------
    // PRIMARY KEY CHECK
    // attendee_id must be unique
    // ------------------------------------

    const rows =
        attendeeTableBody.querySelectorAll("tr");


    for (const row of rows) {

        // Ignore current row while editing
        if (row === editingRow) {
            continue;
        }


        const existingId =
            row.cells[0].textContent;


        if (existingId === attendeeId) {

            formError.textContent =
                "Attendee ID already exists.";

            return;

        }

    }


    formError.textContent = "";


    // ------------------------------------
    // EDIT EXISTING ATTENDEE
    // ------------------------------------

    if (editingRow !== null) {

        editingRow.cells[0].textContent =
            attendeeId;

        editingRow.cells[1].textContent =
            attendeeName;

        editingRow.cells[2].textContent =
            email;

        editingRow.cells[3].textContent =
            phone;

        editingRow.cells[4].textContent =
            age;


        editingRow = null;

    }


    // ------------------------------------
    // ADD NEW ATTENDEE
    // ------------------------------------

    else {

        const row =
            attendeeTableBody.insertRow();


        row.insertCell(0).textContent =
            attendeeId;

        row.insertCell(1).textContent =
            attendeeName;

        row.insertCell(2).textContent =
            email;

        row.insertCell(3).textContent =
            phone;

        row.insertCell(4).textContent =
            age;


        const actionCell =
            row.insertCell(5);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

    }


    attendeeForm.reset();

    attendeeModal.style.display = "none";

});


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

attendeeTableBody.addEventListener("click", function (event) {

    const row =
        event.target.closest("tr");


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this attendee?"
            );


        if (confirmDelete) {

            row.remove();

        }

    }


    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("attendeeId").value =
            row.cells[0].textContent;

        document.getElementById("attendeeName").value =
            row.cells[1].textContent;

        document.getElementById("email").value =
            row.cells[2].textContent;

        document.getElementById("phone").value =
            row.cells[3].textContent;

        document.getElementById("age").value =
            row.cells[4].textContent;


        formError.textContent = "";


        document.querySelector("#attendeeModal h2").textContent =
            "Edit Attendee";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        attendeeModal.style.display = "flex";

    }

});