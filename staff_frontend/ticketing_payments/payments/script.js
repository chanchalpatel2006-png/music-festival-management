const addPaymentBtn =
    document.getElementById("addPaymentBtn");

const paymentModal =
    document.getElementById("paymentModal");

const closeModal =
    document.getElementById("closeModal");

const paymentForm =
    document.getElementById("paymentForm");

const paymentTableBody =
    document.getElementById("paymentTableBody");

const formError =
    document.getElementById("formError");

let editingRow = null;


// OPEN ADD

addPaymentBtn.addEventListener("click", function () {

    editingRow = null;

    paymentForm.reset();

    formError.textContent = "";

    document.querySelector("#paymentModal h2").textContent =
        "Add Payment";

    document.querySelector(".save-btn").textContent =
        "Add Payment";

    paymentModal.style.display = "flex";
});


// CLOSE

closeModal.addEventListener("click", function () {
    paymentModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === paymentModal) {
        paymentModal.style.display = "none";
    }

});


// ADD / UPDATE

paymentForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const paymentId =
        document.getElementById("paymentId").value.trim();

    const ticketId =
        document.getElementById("ticketId").value.trim();

    const amount =
        Number(document.getElementById("amount").value);

    const paymentDate =
        document.getElementById("paymentDate").value;

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const paymentStatus =
        document.getElementById("paymentStatus").value;


    if (amount < 0) {

        formError.textContent =
            "Payment amount cannot be negative.";

        return;
    }


    // PRIMARY KEY CHECK

    const rows =
        paymentTableBody.querySelectorAll("tr");

    for (const row of rows) {

        if (row === editingRow) {
            continue;
        }

        if (row.cells[0].textContent === paymentId) {

            formError.textContent =
                "Payment ID already exists.";

            return;
        }

    }


    formError.textContent = "";


    // EDIT

    if (editingRow !== null) {

        editingRow.cells[0].textContent = paymentId;
        editingRow.cells[1].textContent = ticketId;
        editingRow.cells[2].textContent = amount.toFixed(2);
        editingRow.cells[3].textContent = paymentDate;
        editingRow.cells[4].textContent = paymentMethod;
        editingRow.cells[5].textContent = paymentStatus;

        editingRow = null;

    }


    // ADD

    else {

        const row =
            paymentTableBody.insertRow();

        row.insertCell(0).textContent = paymentId;
        row.insertCell(1).textContent = ticketId;
        row.insertCell(2).textContent = amount.toFixed(2);
        row.insertCell(3).textContent = paymentDate;
        row.insertCell(4).textContent = paymentMethod;
        row.insertCell(5).textContent = paymentStatus;

        const actionCell =
            row.insertCell(6);

        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    paymentForm.reset();

    paymentModal.style.display = "none";
});


// EDIT / DELETE

paymentTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");


    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this payment?")) {
            row.remove();
        }

    }


    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        document.getElementById("paymentId").value =
            row.cells[0].textContent;

        document.getElementById("ticketId").value =
            row.cells[1].textContent;

        document.getElementById("amount").value =
            row.cells[2].textContent;

        document.getElementById("paymentDate").value =
            row.cells[3].textContent;

        document.getElementById("paymentMethod").value =
            row.cells[4].textContent;

        document.getElementById("paymentStatus").value =
            row.cells[5].textContent;

        formError.textContent = "";

        document.querySelector("#paymentModal h2").textContent =
            "Edit Payment";

        document.querySelector(".save-btn").textContent =
            "Save Changes";

        paymentModal.style.display = "flex";
    }

});