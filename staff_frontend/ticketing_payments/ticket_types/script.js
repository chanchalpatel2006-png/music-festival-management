const addTicketTypeBtn =
    document.getElementById("addTicketTypeBtn");

const ticketTypeModal =
    document.getElementById("ticketTypeModal");

const closeModal =
    document.getElementById("closeModal");

const ticketTypeForm =
    document.getElementById("ticketTypeForm");

const ticketTypeTableBody =
    document.getElementById("ticketTypeTableBody");

const formError =
    document.getElementById("formError");

let editingRow = null;


// OPEN ADD MODAL

addTicketTypeBtn.addEventListener("click", function () {

    editingRow = null;

    ticketTypeForm.reset();

    formError.textContent = "";

    document.querySelector("#ticketTypeModal h2").textContent =
        "Add Ticket Type";

    document.querySelector(".save-btn").textContent =
        "Add Ticket Type";

    ticketTypeModal.style.display = "flex";
});


// CLOSE MODAL

closeModal.addEventListener("click", function () {
    ticketTypeModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === ticketTypeModal) {
        ticketTypeModal.style.display = "none";
    }

});


// ADD / UPDATE

ticketTypeForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const ticketTypeId =
        document.getElementById("ticketTypeId").value.trim();

    const typeName =
        document.getElementById("typeName").value;

    const totalQuantity =
        Number(document.getElementById("totalQuantity").value);

    const available =
        Number(document.getElementById("available").value);

    const price =
        Number(document.getElementById("price").value);


    if (totalQuantity <= 0) {

        formError.textContent =
            "Total quantity must be greater than 0.";

        return;
    }


    if (available < 0) {

        formError.textContent =
            "Available quantity cannot be negative.";

        return;
    }


    if (available > totalQuantity) {

        formError.textContent =
            "Available quantity cannot exceed total quantity.";

        return;
    }


    if (price < 0) {

        formError.textContent =
            "Price cannot be negative.";

        return;
    }


    // CHECK PRIMARY KEY

    const rows =
        ticketTypeTableBody.querySelectorAll("tr");


    for (const row of rows) {

        if (row === editingRow) {
            continue;
        }

        if (row.cells[0].textContent === ticketTypeId) {

            formError.textContent =
                "Ticket Type ID already exists.";

            return;
        }

    }


    formError.textContent = "";


    // EDIT

    if (editingRow !== null) {

        editingRow.cells[0].textContent = ticketTypeId;
        editingRow.cells[1].textContent = typeName;
        editingRow.cells[2].textContent = totalQuantity;
        editingRow.cells[3].textContent = available;
        editingRow.cells[4].textContent = price.toFixed(2);

        editingRow = null;

    }


    // ADD

    else {

        const row =
            ticketTypeTableBody.insertRow();

        row.insertCell(0).textContent = ticketTypeId;
        row.insertCell(1).textContent = typeName;
        row.insertCell(2).textContent = totalQuantity;
        row.insertCell(3).textContent = available;
        row.insertCell(4).textContent = price.toFixed(2);

        const actionCell =
            row.insertCell(5);

        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    ticketTypeForm.reset();

    ticketTypeModal.style.display = "none";
});


// EDIT / DELETE

ticketTypeTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");

    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this ticket type?")) {
            row.remove();
        }
    }


    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        document.getElementById("ticketTypeId").value =
            row.cells[0].textContent;

        document.getElementById("typeName").value =
            row.cells[1].textContent;

        document.getElementById("totalQuantity").value =
            row.cells[2].textContent;

        document.getElementById("available").value =
            row.cells[3].textContent;

        document.getElementById("price").value =
            row.cells[4].textContent;

        formError.textContent = "";

        document.querySelector("#ticketTypeModal h2").textContent =
            "Edit Ticket Type";

        document.querySelector(".save-btn").textContent =
            "Save Changes";

        ticketTypeModal.style.display = "flex";
    }

});