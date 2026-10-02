const API_URL = "http://localhost:3000/api/genre";

const addGenreBtn = document.getElementById("addGenreBtn");
const genreModal = document.getElementById("genreModal");
const closeModal = document.getElementById("closeModal");
const genreForm = document.getElementById("genreForm");
const genreTableBody = document.getElementById("genreTableBody");

let editingRow = null;
let editingGenreId = null;


// LOAD GENRES FROM DATABASE
async function loadGenres() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load genres");
        }

        const genres = await response.json();

        genreTableBody.innerHTML = "";

        genres.forEach(genre => {
            addRow(genre);
        });

    } catch (error) {
        console.error(error);
        alert("Could not load genres from database.");
    }
}


// ADD ROW TO TABLE
function addRow(genre) {

    const row = genreTableBody.insertRow();

    row.insertCell(0).textContent = genre.genre_id;
    row.insertCell(1).textContent = genre.genre_name;

    const actionCell = row.insertCell(2);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// OPEN ADD GENRE MODAL
addGenreBtn.addEventListener("click", async function () {

    editingRow = null;
    editingGenreId = null;

    genreForm.reset();

    try {
        document.getElementById("genreId").value =
            await generateNextId("genre");
    } catch (error) {
        console.error(error);
        alert("Could not generate Genre ID.");
        return;
    }

    document.querySelector("#genreModal h2").textContent =
        "Add Genre";

    document.querySelector(".save-btn").textContent =
        "Add Genre";

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
genreForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const genreId = document.getElementById("genreId").value.trim();
    const genreName = document.getElementById("genreName").value.trim();

    try {

        // UPDATE
        if (editingRow !== null) {

            const response = await fetch(API_URL, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    old_genre_id: editingGenreId,
                    genre_id: genreId,
                    genre_name: genreName
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Update failed");
            }

            editingRow.cells[0].textContent = genreId;
            editingRow.cells[1].textContent = genreName;

            editingRow = null;
            editingGenreId = null;

        }

        // INSERT
        else {

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    genre_id: genreId,
                    genre_name: genreName
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Insert failed");
            }

            addRow(result);
        }

        genreForm.reset();
        genreModal.style.display = "none";

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

});


// EDIT / DELETE
genreTableBody.addEventListener("click", async function (event) {

    const row = event.target.closest("tr");

    if (!row) return;


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const genreId = row.cells[0].textContent;

        if (!confirm(`Are you sure you want to delete genre ${genreId}?`)) {
            return;
        }

        try {

            const response = await fetch(`${API_URL}/${genreId}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Delete failed");
            }

            row.remove();

        } catch (error) {

            console.error(error);
            alert(error.message);

        }
    }


    // EDIT
    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        editingGenreId = row.cells[0].textContent;

        document.getElementById("genreId").value =
            editingGenreId;

        document.getElementById("genreName").value =
            row.cells[1].textContent;

        document.querySelector("#genreModal h2").textContent =
            "Edit Genre";

        document.querySelector(".save-btn").textContent =
            "Save Changes";

        genreModal.style.display = "flex";
    }

});


// LOAD DATA WHEN PAGE OPENS
loadGenres();