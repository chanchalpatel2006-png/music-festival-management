const addManagerBtn = document.getElementById("addManagerBtn");
const managerModal = document.getElementById("managerModal");
const closeModal = document.getElementById("closeModal");

const managerForm = document.getElementById("managerForm");
const managerTableBody = document.getElementById("managerTableBody");


// This will remember which row we are editing
let editingRow = null;


// ------------------------------------
// OPEN ADD MANAGER POPUP
// ------------------------------------

addManagerBtn.addEventListener("click", function () {

    // We are adding a NEW manager
    editingRow = null;

    // Clear old form values
    managerForm.reset();

    // Change heading/button back to Add
    document.querySelector("#managerModal h2").textContent = "Add Manager";
    document.querySelector(".save-btn").textContent = "Add Manager";

    managerModal.style.display = "flex";
});


// ------------------------------------
// CLOSE POPUP
// ------------------------------------

closeModal.addEventListener("click", function () {
    managerModal.style.display = "none";
});


// Close when clicking outside popup
window.addEventListener("click", function (event) {

    if (event.target === managerModal) {
        managerModal.style.display = "none";
    }

});


// ------------------------------------
// ADD OR UPDATE MANAGER
// ------------------------------------

managerForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get values from form
    const managerId =
        document.getElementById("managerId").value;

    const managerName =
        document.getElementById("managerName").value;

    const managerPhone =
        document.getElementById("managerPhone").value;

    const managerEmail =
        document.getElementById("managerEmail").value;


    // ====================================
    // EDIT EXISTING MANAGER
    // ====================================

    if (editingRow !== null) {

        editingRow.cells[0].textContent = managerId;
        editingRow.cells[1].textContent = managerName;
        editingRow.cells[2].textContent = managerPhone;
        editingRow.cells[3].textContent = managerEmail;

        editingRow = null;
    }


    // ====================================
    // ADD NEW MANAGER
    // ====================================

    else {

        const row = managerTableBody.insertRow();


        // Create cells
        const idCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const phoneCell = row.insertCell(2);
        const emailCell = row.insertCell(3);
        const actionCell = row.insertCell(4);


        // Add manager information
        idCell.textContent = managerId;
        nameCell.textContent = managerName;
        phoneCell.textContent = managerPhone;
        emailCell.textContent = managerEmail;


        // EDIT BUTTON
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";


        // DELETE BUTTON
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";


        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    }


    // Clear form
    managerForm.reset();


    // Close popup
    managerModal.style.display = "none";

});


// ------------------------------------
// EDIT + DELETE
// ------------------------------------

managerTableBody.addEventListener("click", function (event) {

    const clickedButton = event.target;


    // ====================================
    // DELETE
    // ====================================

    if (clickedButton.classList.contains("delete-btn")) {

        const row = clickedButton.closest("tr");

        const confirmDelete =
            confirm("Are you sure you want to delete this manager?");

        if (confirmDelete) {
            row.remove();
        }

    }


    // ====================================
    // EDIT
    // ====================================

    if (clickedButton.classList.contains("edit-btn")) {

        const row = clickedButton.closest("tr");

        // Remember which row we are editing
        editingRow = row;


        // Put existing values into form
        document.getElementById("managerId").value =
            row.cells[0].textContent;

        document.getElementById("managerName").value =
            row.cells[1].textContent;

        document.getElementById("managerPhone").value =
            row.cells[2].textContent;

        document.getElementById("managerEmail").value =
            row.cells[3].textContent;


        // Change popup text
        document.querySelector("#managerModal h2").textContent =
            "Edit Manager";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        // Open popup
        managerModal.style.display = "flex";

    }

});