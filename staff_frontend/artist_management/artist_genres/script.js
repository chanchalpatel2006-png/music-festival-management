const addArtistGenreBtn = document.getElementById("addArtistGenreBtn");
const artistGenreModal = document.getElementById("artistGenreModal");
const closeModal = document.getElementById("closeModal");
const artistGenreForm = document.getElementById("artistGenreForm");
const artistGenreTableBody = document.getElementById("artistGenreTableBody");

let editingRow = null;


// OPEN ASSIGN GENRE
addArtistGenreBtn.addEventListener("click", function () {
    editingRow = null;
    artistGenreForm.reset();

    document.querySelector("#artistGenreModal h2").textContent =
        "Assign Genre to Artist";

    document.querySelector(".save-btn").textContent =
        "Assign Genre";

    artistGenreModal.style.display = "flex";
});


// CLOSE MODAL
closeModal.addEventListener("click", function () {
    artistGenreModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === artistGenreModal) {
        artistGenreModal.style.display = "none";
    }
});


// ADD / UPDATE
artistGenreForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const artistId = document.getElementById("artistId").value;
    const genreId = document.getElementById("genreId").value;

    if (editingRow !== null) {

        editingRow.cells[0].textContent = artistId;
        editingRow.cells[1].textContent = genreId;

        editingRow = null;

    } else {

        const row = artistGenreTableBody.insertRow();

        row.insertCell(0).textContent = artistId;
        row.insertCell(1).textContent = genreId;

        const actionCell = row.insertCell(2);

        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }

    artistGenreForm.reset();
    artistGenreModal.style.display = "none";
});


// EDIT / DELETE
artistGenreTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");

    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to remove this genre assignment?")) {
            row.remove();
        }
    }

    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        document.getElementById("artistId").value =
            row.cells[0].textContent;

        document.getElementById("genreId").value =
            row.cells[1].textContent;

        document.querySelector("#artistGenreModal h2").textContent =
            "Edit Artist Genre";

        document.querySelector(".save-btn").textContent =
            "Save Changes";

        artistGenreModal.style.display = "flex";
    }
});