const BASE_URL = "http://localhost:3000/api";

const API_URL = `${BASE_URL}/artists`;

// Tries these in order until one works
const MANAGER_ENDPOINTS = [
    `${BASE_URL}/managers`,
    `${BASE_URL}/manager`
];

const addArtistBtn = document.getElementById("addArtistBtn");
const artistModal = document.getElementById("artistModal");
const closeModal = document.getElementById("closeModal");
const artistForm = document.getElementById("artistForm");
const artistTableBody = document.getElementById("artistTableBody");

const artistIdInput = document.getElementById("artistId");
const managerSelect = document.getElementById("managerId");
const modalTitle = document.getElementById("modalTitle");
const saveBtn = document.getElementById("saveBtn");

let editingRow = null;


// ====================================
// LOAD MANAGERS
// ====================================

async function fetchManagers() {

    let lastError = null;

    for (const url of MANAGER_ENDPOINTS) {

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} from ${url}`);
            }

            const data = await response.json();

            // Accept either an array or { managers: [...] }
            return Array.isArray(data) ? data : (data.managers || []);

        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error("Failed to load managers");
}


async function loadManagers(selectedId = "") {

    try {

        const managers = await fetchManagers();

        managerSelect.innerHTML =
            `<option value="">No Manager</option>`;

        managers.forEach(manager => {

            const id = manager.manager_id ?? manager.id;
            const name = manager.manager_name ?? manager.name ?? id;

            const option = document.createElement("option");
            option.value = id;
            option.textContent = `${name} (${id})`;

            managerSelect.appendChild(option);
        });

        managerSelect.value = selectedId || "";

    } catch (error) {

        console.error("Manager load error:", error);

        managerSelect.innerHTML = `
            <option value="">No Manager</option>
            <option value="" disabled>Failed to load managers</option>
        `;
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

        artists.forEach(addRow);

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
    row.insertCell(4).textContent = artist.manager_name || "No Manager";

    // Store actual manager ID for editing
    row.dataset.managerId = artist.manager_id || "";

    row.insertCell(5).innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}

// ====================================
// GENERATE NEXT ARTIST ID
// ====================================

async function generateArtistId() {

    let ids = [];

    try {
        // Fetch fresh from the server so the ID is always up to date
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch artists");
        }

        const artists = await response.json();
        ids = artists.map(a => a.artist_id);

    } catch (error) {
        // Fall back to whatever is currently in the table
        ids = Array.from(artistTableBody.rows)
            .map(row => row.cells[0].textContent);
    }

    // Defaults when the table is empty: AR001
    let prefix = "AR";
    let width = 3;
    let maxNumber = 0;

    ids.forEach(id => {

        // Split e.g. "AR012" into "AR" + "012"
        const match = /^([A-Za-z]*)(\d+)$/.exec(String(id).trim());

        if (!match) return;

        const number = parseInt(match[2], 10);

        if (number >= maxNumber) {
            maxNumber = number;
            prefix = match[1] || prefix;   // keep the existing prefix
            width = match[2].length;       // keep the existing zero-padding
        }
    });

    return prefix + String(maxNumber + 1).padStart(width, "0");
}
// ====================================
// OPEN ADD ARTIST
// ====================================

addArtistBtn.addEventListener("click", async function () {

    editingRow = null;

    artistForm.reset();

    modalTitle.textContent = "Add Artist";
    saveBtn.textContent = "Add Artist";

    artistIdInput.readOnly = true;
    artistIdInput.value = "Generating...";

    artistModal.style.display = "flex";

    // Fill the ID and load managers at the same time
    const [newId] = await Promise.all([
        generateArtistId(),
        loadManagers()
    ]);

    artistIdInput.value = newId;
});

// ====================================
// CLOSE MODAL
// ====================================

function hideModal() {
    artistModal.style.display = "none";
    editingRow = null;
}

closeModal.addEventListener("click", hideModal);

window.addEventListener("click", function (event) {
    if (event.target === artistModal) {
        hideModal();
    }
});


// ====================================
// ADD / UPDATE ARTIST
// ====================================

artistForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const artistId = artistIdInput.value.trim();
    const artistName = document.getElementById("artistName").value.trim();
    const artistType = document.getElementById("artistType").value;
    const artistCountry = document.getElementById("artistCountry").value.trim();
    const managerId = managerSelect.value;

    const payload = {
        artist_id: artistId,
        artist_name: artistName,
        artist_type: artistType,
        country: artistCountry,
        manager_id: managerId || null
    };

    try {

        let response;

        if (editingRow !== null) {

            // UPDATE
            payload.old_artist_id = editingRow.cells[0].textContent;

            response = await fetch(API_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

        } else {

            // INSERT
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.error ||
                (editingRow ? "Artist update failed" : "Artist insertion failed")
            );
        }

        hideModal();
        artistForm.reset();

        // Reload so the manager name is always correct
        await loadArtists();

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


    // DELETE
    if (event.target.classList.contains("delete-btn")) {

        const artistId = row.cells[0].textContent;

        if (!confirm(`Are you sure you want to delete artist ${artistId}?`)) {
            return;
        }

        try {

            const response = await fetch(`${API_URL}/${artistId}`, {
                method: "DELETE"
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || "Artist deletion failed");
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

        artistIdInput.value = row.cells[0].textContent;
        document.getElementById("artistName").value = row.cells[1].textContent;
        document.getElementById("artistType").value = row.cells[2].textContent;
        document.getElementById("artistCountry").value = row.cells[3].textContent;

        modalTitle.textContent = "Edit Artist";
        saveBtn.textContent = "Save Changes";

        artistModal.style.display = "flex";

        // Load managers, then select the artist's current one
        await loadManagers(row.dataset.managerId || "");
    }
});


// ====================================
// INITIAL LOAD
// ====================================

loadManagers();
loadArtists();