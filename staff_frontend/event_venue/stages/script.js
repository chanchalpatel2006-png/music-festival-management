const addStageBtn = document.getElementById("addStageBtn");
const stageModal = document.getElementById("stageModal");
const closeModal = document.getElementById("closeModal");

const stageForm = document.getElementById("stageForm");
const stageTableBody = document.getElementById("stageTableBody");

const capacityError = document.getElementById("capacityError");

let editingRow = null;


// ------------------------------------
// OPEN ADD STAGE
// ------------------------------------

addStageBtn.addEventListener("click", function () {

    editingRow = null;

    stageForm.reset();

    capacityError.textContent = "";

    document.querySelector("#stageModal h2").textContent =
        "Add Stage";

    document.querySelector(".save-btn").textContent =
        "Add Stage";

    stageModal.style.display = "flex";
});


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener("click", function () {
    stageModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === stageModal) {
        stageModal.style.display = "none";
    }

});


// ------------------------------------
// ADD / UPDATE STAGE
// ------------------------------------

stageForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const stageId =
        document.getElementById("stageId").value;

    const stageName =
        document.getElementById("stageName").value;

    const venueId =
        document.getElementById("venueId").value;

    const capacity =
        document.getElementById("capacity").value;

    const stageType =
        document.getElementById("stageType").value;


    // DATABASE RULE: capacity > 0

    if (Number(capacity) <= 0) {

        capacityError.textContent =
            "Capacity must be greater than 0.";

        return;
    }

    capacityError.textContent = "";


    // --------------------------------
    // EDIT EXISTING STAGE
    // --------------------------------

    if (editingRow !== null) {

        editingRow.cells[0].textContent = stageId;
        editingRow.cells[1].textContent = stageName;
        editingRow.cells[2].textContent = venueId;
        editingRow.cells[3].textContent = capacity;
        editingRow.cells[4].textContent = stageType;

        editingRow = null;

    }


    // --------------------------------
    // ADD NEW STAGE
    // --------------------------------

    else {

        const row = stageTableBody.insertRow();


        row.insertCell(0).textContent = stageId;

        row.insertCell(1).textContent = stageName;

        row.insertCell(2).textContent = venueId;

        row.insertCell(3).textContent = capacity;

        row.insertCell(4).textContent = stageType;


        const actionCell = row.insertCell(5);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    stageForm.reset();

    stageModal.style.display = "none";

});


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

stageTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm("Are you sure you want to delete this stage?");

        if (confirmDelete) {
            row.remove();
        }

    }


    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("stageId").value =
            row.cells[0].textContent;

        document.getElementById("stageName").value =
            row.cells[1].textContent;

        document.getElementById("venueId").value =
            row.cells[2].textContent;

        document.getElementById("capacity").value =
            row.cells[3].textContent;

        document.getElementById("stageType").value =
            row.cells[4].textContent;


        capacityError.textContent = "";


        document.querySelector("#stageModal h2").textContent =
            "Edit Stage";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        stageModal.style.display = "flex";

    }

});