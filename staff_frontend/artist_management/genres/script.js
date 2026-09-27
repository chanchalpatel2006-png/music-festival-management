const addGenreBtn = document.getElementById("addGenreBtn");
const genreModal = document.getElementById("genreModal");
const closeModal = document.getElementById("closeModal");
const genreForm = document.getElementById("genreForm");
const genreTableBody = document.getElementById("genreTableBody");

let editingRow = null;


// OPEN ADD GENRE
addGenreBtn.addEventListener("click", function () {
    editingRow = null;
    genreForm.reset();

    document.querySelector("#genreModal h2").textContent = "Add Genre";
    document.querySelector(".save-btn").textContent = "Add Genre";

    genreModal.style.display = "flex";
});


// CLOSE MODAL
closeModal.addEventListener("click", function () {
    genreModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === genreModal) {
        genreModal.style.display = "none";
    }
});


// ADD / UPDATE GENRE
genreForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const genreId = document.getElementById("genreId").value;
    const genreName = document.getElementById("genreName").value;

    if (editingRow !== null) {

        editingRow.cells[0].textContent = genreId;
        editingRow.cells[1].textContent = genreName;

        editingRow = null;

    } else {

        const row = genreTableBody.insertRow();

        row.insertCell(0).textContent = genreId;
        row.insertCell(1).textContent = genreName;

        const actionCell = row.insertCell(2);

        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }

    genreForm.reset();
    genreModal.style.display = "none";
});


// EDIT / DELETE
genreTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");

    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this genre?")) {
            row.remove();
        }
    }

    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        document.getElementById("genreId").value = row.cells[0].textContent;
        document.getElementById("genreName").value = row.cells[1].textContent;

        document.querySelector("#genreModal h2").textContent = "Edit Genre";
        document.querySelector(".save-btn").textContent = "Save Changes";

        genreModal.style.display = "flex";
    }
});