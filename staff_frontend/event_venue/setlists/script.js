const addSetlistBtn =
    document.getElementById("addSetlistBtn");

const setlistModal =
    document.getElementById("setlistModal");

const closeModal =
    document.getElementById("closeModal");

const setlistForm =
    document.getElementById("setlistForm");

const setlistTableBody =
    document.getElementById("setlistTableBody");


let editingRow = null;


// OPEN ADD MODAL

addSetlistBtn.addEventListener("click", function () {

    editingRow = null;

    setlistForm.reset();

    document.querySelector("#setlistModal h2").textContent =
        "Add Setlist";

    document.querySelector(".save-btn").textContent =
        "Add Setlist";

    setlistModal.style.display = "flex";
});


// CLOSE

closeModal.addEventListener("click", function () {
    setlistModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === setlistModal) {
        setlistModal.style.display = "none";
    }

});


// ADD / UPDATE

setlistForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const setlistId =
        document.getElementById("setlistId").value;

    const performanceId =
        document.getElementById("performanceId").value;


    // EDIT

    if (editingRow !== null) {

        editingRow.cells[0].textContent =
            setlistId;

        editingRow.cells[1].textContent =
            performanceId;

        editingRow = null;

    }


    // ADD

    else {

        const row =
            setlistTableBody.insertRow();


        row.insertCell(0).textContent =
            setlistId;

        row.insertCell(1).textContent =
            performanceId;


        const actionCell =
            row.insertCell(2);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    setlistForm.reset();

    setlistModal.style.display = "none";

});


// EDIT / DELETE

setlistTableBody.addEventListener("click", function (event) {

    const row =
        event.target.closest("tr");


    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm("Are you sure you want to delete this setlist?");


        if (confirmDelete) {
            row.remove();
        }

    }


    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("setlistId").value =
            row.cells[0].textContent;

        document.getElementById("performanceId").value =
            row.cells[1].textContent;


        document.querySelector("#setlistModal h2").textContent =
            "Edit Setlist";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        setlistModal.style.display = "flex";

    }

});