const addPerformanceBtn =
    document.getElementById("addPerformanceBtn");

const performanceModal =
    document.getElementById("performanceModal");

const closeModal =
    document.getElementById("closeModal");

const performanceForm =
    document.getElementById("performanceForm");

const performanceTableBody =
    document.getElementById("performanceTableBody");


let editingRow = null;


// ------------------------------------
// OPEN ADD PERFORMANCE
// ------------------------------------

addPerformanceBtn.addEventListener("click", function () {

    editingRow = null;

    performanceForm.reset();

    document.querySelector("#performanceModal h2").textContent =
        "Add Performance";

    document.querySelector(".save-btn").textContent =
        "Add Performance";

    performanceModal.style.display = "flex";
});


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener("click", function () {

    performanceModal.style.display = "none";

});


window.addEventListener("click", function (event) {

    if (event.target === performanceModal) {

        performanceModal.style.display = "none";

    }

});


// ------------------------------------
// ADD / UPDATE PERFORMANCE
// ------------------------------------

performanceForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const performanceId =
        document.getElementById("performanceId").value;

    const eventId =
        document.getElementById("eventId").value;

    const artistId =
        document.getElementById("artistId").value;

    const stageId =
        document.getElementById("stageId").value;

    const performanceType =
        document.getElementById("performanceType").value;


    // --------------------------------
    // EDIT EXISTING PERFORMANCE
    // --------------------------------

    if (editingRow !== null) {

        editingRow.cells[0].textContent =
            performanceId;

        editingRow.cells[1].textContent =
            eventId;

        editingRow.cells[2].textContent =
            artistId;

        editingRow.cells[3].textContent =
            stageId;

        editingRow.cells[4].textContent =
            performanceType;


        editingRow = null;

    }


    // --------------------------------
    // ADD NEW PERFORMANCE
    // --------------------------------

    else {

        const row =
            performanceTableBody.insertRow();


        row.insertCell(0).textContent =
            performanceId;

        row.insertCell(1).textContent =
            eventId;

        row.insertCell(2).textContent =
            artistId;

        row.insertCell(3).textContent =
            stageId;

        row.insertCell(4).textContent =
            performanceType;


        const actionCell =
            row.insertCell(5);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    performanceForm.reset();

    performanceModal.style.display = "none";

});


// ------------------------------------
// EDIT / DELETE PERFORMANCE
// ------------------------------------

performanceTableBody.addEventListener("click", function (event) {

    const row =
        event.target.closest("tr");


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this performance?"
            );


        if (confirmDelete) {

            row.remove();

        }

    }


    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("performanceId").value =
            row.cells[0].textContent;

        document.getElementById("eventId").value =
            row.cells[1].textContent;

        document.getElementById("artistId").value =
            row.cells[2].textContent;

        document.getElementById("stageId").value =
            row.cells[3].textContent;

        document.getElementById("performanceType").value =
            row.cells[4].textContent;


        document.querySelector("#performanceModal h2").textContent =
            "Edit Performance";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        performanceModal.style.display = "flex";

    }

});