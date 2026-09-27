const addArtistBtn = document.getElementById("addArtistBtn");
const artistModal = document.getElementById("artistModal");
const closeModal = document.getElementById("closeModal");
const artistForm = document.getElementById("artistForm");
const artistTableBody = document.getElementById("artistTableBody");

let editingRow = null;


// OPEN ADD ARTIST
addArtistBtn.addEventListener("click", function () {
    editingRow = null;
    artistForm.reset();

    document.querySelector("#artistModal h2").textContent = "Add Artist";
    document.querySelector(".save-btn").textContent = "Add Artist";

    artistModal.style.display = "flex";
});


// CLOSE MODAL
closeModal.addEventListener("click", function () {
    artistModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === artistModal) {
        artistModal.style.display = "none";
    }
});


// ADD / UPDATE ARTIST
artistForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const artistId = document.getElementById("artistId").value;
    const artistName = document.getElementById("artistName").value;
    const artistType = document.getElementById("artistType").value;
    const artistCountry = document.getElementById("artistCountry").value;
    const managerId = document.getElementById("managerId").value;

    if (editingRow !== null) {

        editingRow.cells[0].textContent = artistId;
        editingRow.cells[1].textContent = artistName;
        editingRow.cells[2].textContent = artistType;
        editingRow.cells[3].textContent = artistCountry;
        editingRow.cells[4].textContent = managerId;

        editingRow = null;

    } else {

        const row = artistTableBody.insertRow();

        row.insertCell(0).textContent = artistId;
        row.insertCell(1).textContent = artistName;
        row.insertCell(2).textContent = artistType;
        row.insertCell(3).textContent = artistCountry;
        row.insertCell(4).textContent = managerId;

        const actionCell = row.insertCell(5);

        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }

    artistForm.reset();
    artistModal.style.display = "none";
});


// EDIT / DELETE
artistTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");

    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this artist?")) {
            row.remove();
        }
    }

    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        document.getElementById("artistId").value = row.cells[0].textContent;
        document.getElementById("artistName").value = row.cells[1].textContent;
        document.getElementById("artistType").value = row.cells[2].textContent;
        document.getElementById("artistCountry").value = row.cells[3].textContent;
        document.getElementById("managerId").value = row.cells[4].textContent;

        document.querySelector("#artistModal h2").textContent = "Edit Artist";
        document.querySelector(".save-btn").textContent = "Save Changes";

        artistModal.style.display = "flex";
    }
});