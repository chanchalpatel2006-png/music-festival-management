const addSongBtn = document.getElementById("addSongBtn");
const songModal = document.getElementById("songModal");
const closeModal = document.getElementById("closeModal");

const songForm = document.getElementById("songForm");
const songTableBody = document.getElementById("songTableBody");

let editingRow = null;


// ------------------------------------
// OPEN ADD SONG
// ------------------------------------

addSongBtn.addEventListener("click", function () {

    editingRow = null;

    songForm.reset();

    document.querySelector("#songModal h2").textContent =
        "Add Song";

    document.querySelector(".save-btn").textContent =
        "Add Song";

    songModal.style.display = "flex";
});


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener("click", function () {
    songModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === songModal) {
        songModal.style.display = "none";
    }

});


// ------------------------------------
// ADD / UPDATE SONG
// ------------------------------------

songForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const songId =
        document.getElementById("songId").value;

    const songName =
        document.getElementById("songName").value;

    const artistId =
        document.getElementById("artistId").value;


    // EDIT EXISTING SONG
    if (editingRow !== null) {

        editingRow.cells[0].textContent = songId;
        editingRow.cells[1].textContent = songName;
        editingRow.cells[2].textContent = artistId;

        editingRow = null;

    }


    // ADD NEW SONG
    else {

        const row = songTableBody.insertRow();


        row.insertCell(0).textContent = songId;

        row.insertCell(1).textContent = songName;

        row.insertCell(2).textContent = artistId;


        const actionCell = row.insertCell(3);


        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }


    songForm.reset();

    songModal.style.display = "none";

});


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

songTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");


    // DELETE SONG
    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete =
            confirm("Are you sure you want to delete this song?");

        if (confirmDelete) {
            row.remove();
        }

    }


    // EDIT SONG
    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        document.getElementById("songId").value =
            row.cells[0].textContent;

        document.getElementById("songName").value =
            row.cells[1].textContent;

        document.getElementById("artistId").value =
            row.cells[2].textContent;


        document.querySelector("#songModal h2").textContent =
            "Edit Song";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        songModal.style.display = "flex";

    }

});