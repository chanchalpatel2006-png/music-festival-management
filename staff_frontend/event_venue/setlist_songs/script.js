const addSetlistSongBtn =
    document.getElementById("addSetlistSongBtn");

const setlistSongModal =
    document.getElementById("setlistSongModal");

const closeModal =
    document.getElementById("closeModal");

const setlistSongForm =
    document.getElementById("setlistSongForm");

const setlistSongTableBody =
    document.getElementById("setlistSongTableBody");

const formError =
    document.getElementById("formError");


let editingRow = null;


// ------------------------------------
// OPEN ADD MODAL
// ------------------------------------

addSetlistSongBtn.addEventListener("click", function () {

    editingRow = null;

    setlistSongForm.reset();

    formError.textContent = "";

    document.querySelector("#setlistSongModal h2").textContent =
        "Add Setlist Song";

    document.querySelector(".save-btn").textContent =
        "Add Setlist Song";

    setlistSongModal.style.display = "flex";

});


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener("click", function () {

    setlistSongModal.style.display = "none";

});


window.addEventListener("click", function (event) {

    if (event.target === setlistSongModal) {

        setlistSongModal.style.display = "none";

    }

});


// ------------------------------------
// ADD / UPDATE
// ------------------------------------

setlistSongForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const setlistId =
        document.getElementById("setlistId").value.trim();

    const songId =
        document.getElementById("songId").value.trim();

    const songOrder =
        document.getElementById("songOrder").value;


    // CHECK: song_order > 0

    if (Number(songOrder) <= 0) {

        formError.textContent =
            "Song order must be greater than 0.";

        return;

    }


    // ------------------------------------
    // CHECK COMPOSITE PRIMARY KEY
    // (setlist_id, song_id)
    // ------------------------------------

    const rows = setlistSongTableBody.querySelectorAll("tr");

    for (const row of rows) {

        // Ignore the row currently being edited
        if (row === editingRow) {
            continue;
        }

        const existingSetlistId =
            row.cells[0].textContent;

        const existingSongId =
            row.cells[1].textContent;


        if (
            existingSetlistId === setlistId &&
            existingSongId === songId
        ) {

            formError.textContent =
                "This song is already present in this setlist.";

            return;
        }
    }


    formError.textContent = "";


    // ------------------------------------
    // EDIT
    // ------------------------------------

    if (editingRow !== null) {

        editingRow.cells[0].textContent =
            setlistId;

        editingRow.cells[1].textContent =
            songId;

        editingRow.cells[2].textContent =
            songOrder;


        editingRow = null;

    }


    // ------------------------------------
    // ADD
    // ------------------------------------

    else {

        const row =
            setlistSongTableBody.insertRow();


        row.insertCell(0).textContent =
            setlistId;

        row.insertCell(1).textContent =
            songId;

        row.insertCell(2).textContent =
            songOrder;


        const actionCell =
            row.insertCell(3);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

    }


    setlistSongForm.reset();

    setlistSongModal.style.display = "none";

});


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

setlistSongTableBody.addEventListener("click", function (event) {

    const row =
        event.target.closest("tr");


    // DELETE

    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm(
                "Are you sure you want to remove this song from the setlist?"
            );


        if (confirmDelete) {

            row.remove();

        }

    }


    // EDIT

    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("setlistId").value =
            row.cells[0].textContent;

        document.getElementById("songId").value =
            row.cells[1].textContent;

        document.getElementById("songOrder").value =
            row.cells[2].textContent;


        formError.textContent = "";


        document.querySelector("#setlistSongModal h2").textContent =
            "Edit Setlist Song";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        setlistSongModal.style.display = "flex";

    }

});