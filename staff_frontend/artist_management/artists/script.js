const API_URL = "http://localhost:3000/api/artists";
const MANAGER_API_URL = "http://localhost:3000/api/manager";

const addArtistBtn = document.getElementById("addArtistBtn");
const artistModal = document.getElementById("artistModal");
const closeModal = document.getElementById("closeModal");
const artistForm = document.getElementById("artistForm");
const artistTableBody = document.getElementById("artistTableBody");

const managerSelect = document.getElementById("managerId");

let editingRow = null;


// ====================================
// LOAD MANAGERS
// ====================================

async function loadManagers() {

    try {

        const response = await fetch(MANAGER_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load managers");
        }

        const managers = await response.json();

        managerSelect.innerHTML = `
            <option value="">No Manager</option>
        `;

        managers.forEach(manager => {

            const option = document.createElement("option");

            option.value = manager.manager_id;

            option.textContent =
                `${manager.manager_name} (${manager.manager_id})`;

            managerSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("Could not load managers from database.");

    }
}


// ====================================
// LOAD ARTISTS
// ====================================

async function loadArtists() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load artists");
        }

        const artists = await response.json();

        artistTableBody.innerHTML = "";

        artists.forEach(artist => {
            addRow(artist);
        });

    } catch (error) {

        console.error(error);

        alert("Could not load artists from database.");

    }
}


// ====================================
// ADD ARTIST ROW
// ====================================

function addRow(artist) {

    const row = artistTableBody.insertRow();

    row.insertCell(0).textContent = artist.artist_id;
    row.insertCell(1).textContent = artist.artist_name;
    row.insertCell(2).textContent = artist.artist_type;
    row.insertCell(3).textContent = artist.country;

    // Display manager name
    row.insertCell(4).textContent =
        artist.manager_name || "No Manager";

    // Store actual manager ID in the row
    row.dataset.managerId =
        artist.manager_id || "";

    const actionCell = row.insertCell(5);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// ====================================
// OPEN ADD ARTIST
// ====================================

addArtistBtn.addEventListener("click", async function () {

    editingRow = null;

    artistForm.reset();

    await loadManagers();

    document.querySelector("#artistModal h2").textContent =
        "Add Artist";

    document.querySelector(".save-btn").textContent =
        "Add Artist";

    artistModal.style.display = "flex";
});


// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener("click", function () {
    artistModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === artistModal) {
        artistModal.style.display = "none";
    }

});


// ====================================
// ADD / UPDATE ARTIST
// ====================================

artistForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const artistId =
        document.getElementById("artistId").value.trim();

    const artistName =
        document.getElementById("artistName").value.trim();

    const artistType =
        document.getElementById("artistType").value;

    const artistCountry =
        document.getElementById("artistCountry").value.trim();

    const managerId =
        managerSelect.value;


    try {

        // ====================================
        // UPDATE
        // ====================================

        if (editingRow !== null) {

            const oldArtistId =
                editingRow.cells[0].textContent;

            const response = await fetch(API_URL, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    old_artist_id: oldArtistId,

                    artist_id: artistId,
                    artist_name: artistName,
                    artist_type: artistType,
                    country: artistCountry,
                    manager_id: managerId || null

                })

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Artist update failed"
                );

            }


            // Update table
            editingRow.cells[0].textContent = artistId;
            editingRow.cells[1].textContent = artistName;
            editingRow.cells[2].textContent = artistType;
            editingRow.cells[3].textContent = artistCountry;

            editingRow.cells[4].textContent =
                result.manager_name || "No Manager";

            editingRow.dataset.managerId =
                managerId || "";


            editingRow = null;

        }


        // ====================================
        // INSERT
        // ====================================

        else {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    artist_id: artistId,
                    artist_name: artistName,
                    artist_type: artistType,
                    country: artistCountry,
                    manager_id: managerId || null

                })

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Artist insertion failed"
                );

            }


            addRow(result);

        }


        artistForm.reset();

        artistModal.style.display = "none";


    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});


// ====================================
// EDIT / DELETE
// ====================================

artistTableBody.addEventListener("click", async function (event) {

    const row = event.target.closest("tr");

    if (!row) return;


    // ====================================
    // DELETE
    // ====================================

    if (event.target.classList.contains("delete-btn")) {

        const artistId =
            row.cells[0].textContent;


        if (!confirm(
            `Are you sure you want to delete artist ${artistId}?`
        )) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/${artistId}`,
                {
                    method: "DELETE"
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Artist deletion failed"
                );

            }


            row.remove();


        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    }


    // ====================================
    // EDIT
    // ====================================

    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;


        await loadManagers();


        document.getElementById("artistId").value =
            row.cells[0].textContent;

        document.getElementById("artistName").value =
            row.cells[1].textContent;

        document.getElementById("artistType").value =
            row.cells[2].textContent;

        document.getElementById("artistCountry").value =
            row.cells[3].textContent;


        // Select the existing manager
        managerSelect.value =
            row.dataset.managerId || "";


        document.querySelector("#artistModal h2").textContent =
            "Edit Artist";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        artistModal.style.display = "flex";

    }

});


// ====================================
// INITIAL LOAD
// ====================================

loadManagers();
loadArtists();