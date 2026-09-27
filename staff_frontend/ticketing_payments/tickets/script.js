const addTicketBtn =
    document.getElementById("addTicketBtn");

const ticketModal =
    document.getElementById("ticketModal");

const closeModal =
    document.getElementById("closeModal");

const ticketForm =
    document.getElementById("ticketForm");

const ticketTableBody =
    document.getElementById("ticketTableBody");

const formError =
    document.getElementById("formError");

let editingRow = null;


// OPEN ADD

addTicketBtn.addEventListener("click", function () {

    editingRow = null;

    ticketForm.reset();

    formError.textContent = "";

    document.querySelector("#ticketModal h2").textContent =
        "Add Ticket";

    document.querySelector(".save-btn").textContent =
        "Add Ticket";

    ticketModal.style.display = "flex";
});


// CLOSE

closeModal.addEventListener("click", function () {
    ticketModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === ticketModal) {
        ticketModal.style.display = "none";
    }

});


// ADD / UPDATE

ticketForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const ticketId =
        document.getElementById("ticketId").value.trim();

    const attendeeId =
        document.getElementById("attendeeId").value.trim();

    const ticketTypeId =
        document.getElementById("ticketTypeId").value.trim();

    const purchaseDate =
        document.getElementById("purchaseDate").value;

    const entryDate =
        document.getElementById("entryDate").value;

    const ticketStatus =
        document.getElementById("ticketStatus").value;


    // PRIMARY KEY CHECK

    const rows =
        ticketTableBody.querySelectorAll("tr");

    for (const row of rows) {

        if (row === editingRow) {
            continue;
        }

        if (row.cells[0].textContent === ticketId) {

            formError.textContent =
                "Ticket ID already exists.";

            return;
        }
    }


    formError.textContent = "";


    // EDIT

    if (editingRow !== null) {

        editingRow.cells[0].textContent = ticketId;
        editingRow.cells[1].textContent = attendeeId;
        editingRow.cells[2].textContent = ticketTypeId;
        editingRow.cells[3].textContent = purchaseDate;
        editingRow.cells[4].textContent = entryDate;
        editingRow.cells[5].textContent = ticketStatus;

        editingRow = null;

    }


    // ADD

    else {

        const row =
            ticketTableBody.insertRow();

        row.insertCell(0).textContent = ticketId;
        row.insertCell(1).textContent = attendeeId;
        row.insertCell(2).textContent = ticketTypeId;
        row.insertCell(3).textContent = purchaseDate;
        row.insertCell(4).textContent = entryDate;
        row.insertCell(5).textContent = ticketStatus;

        const actionCell =
            row.insertCell(6);

        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    ticketForm.reset();

    ticketModal.style.display = "none";
});


// EDIT / DELETE

ticketTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");


    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this ticket?")) {
            row.remove();
        }

    }


    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        document.getElementById("ticketId").value =
            row.cells[0].textContent;

        document.getElementById("attendeeId").value =
            row.cells[1].textContent;

        document.getElementById("ticketTypeId").value =
            row.cells[2].textContent;

        document.getElementById("purchaseDate").value =
            row.cells[3].textContent;

        document.getElementById("entryDate").value =
            row.cells[4].textContent;

        document.getElementById("ticketStatus").value =
            row.cells[5].textContent;

        formError.textContent = "";

        document.querySelector("#ticketModal h2").textContent =
            "Edit Ticket";

        document.querySelector(".save-btn").textContent =
            "Save Changes";

        ticketModal.style.display = "flex";
    }

});