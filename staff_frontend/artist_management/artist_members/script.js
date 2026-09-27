const API_URL = "http://localhost:3000/api/artist_member";
const ARTIST_API_URL = "http://localhost:3000/api/artists";

const addMemberBtn = document.getElementById("addMemberBtn");
const memberModal = document.getElementById("memberModal");
const closeModal = document.getElementById("closeModal");
const memberForm = document.getElementById("memberForm");
const memberTableBody = document.getElementById("memberTableBody");

const artistSelect = document.getElementById("artistId");

let editingRow = null;
let artistsList = [];


// ====================================
// LOAD ARTISTS FOR DROPDOWN
// ====================================

async function loadArtists() {

    try {

        const response = await fetch(ARTIST_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load artists");
        }

        const artists = await response.json();

        // Save artists for later use
        artistsList = artists;

        artistSelect.innerHTML = `
            <option value="">Select Artist</option>
        `;

        artists.forEach(artist => {

            const option = document.createElement("option");

            option.value = artist.artist_id;

            option.textContent =
                `${artist.artist_name} (${artist.artist_id})`;

            artistSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("Could not load artists from database.");

    }
}

function getArtistName(artistId) {

    const artist = artistsList.find(
        artist => artist.artist_id === artistId
    );

    return artist ? artist.artist_name : "Unknown Artist";
}

// ====================================
// LOAD ARTIST MEMBERS
// ====================================

async function loadMembers() {

    try {

        // Make sure artists are loaded first
        await loadArtists();

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load artist members");
        }

        const members = await response.json();

        memberTableBody.innerHTML = "";

        members.forEach(member => {
            addRow(member);
        });

    } catch (error) {

        console.error(error);

        alert("Could not load artist members from database.");

    }
}


// ====================================
// ADD ROW TO TABLE
// ====================================

function addRow(member) {

    const row = memberTableBody.insertRow();

    row.insertCell(0).textContent =
        member.member_id;

    // Get artist name from backend or artists list
    const artistName =
        member.artist_name ||
        getArtistName(member.artist_id);

    row.insertCell(1).textContent =
        artistName;

    row.insertCell(2).textContent =
        member.member_name;

    row.insertCell(3).textContent =
        member.instrument || "";

    // Store actual FK ID
    row.dataset.artistId =
        member.artist_id;

    const actionCell = row.insertCell(4);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// ====================================
// OPEN ADD MEMBER
// ====================================

addMemberBtn.addEventListener("click", async function () {

    editingRow = null;

    memberForm.reset();

    await loadArtists();

    document.querySelector("#memberModal h2").textContent =
        "Add Artist Member";

    document.querySelector(".save-btn").textContent =
        "Add Member";

    memberModal.style.display = "flex";
});


// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener("click", function () {
    memberModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === memberModal) {
        memberModal.style.display = "none";
    }

});


// ====================================
// ADD / UPDATE MEMBER
// ====================================

memberForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const memberId =
        document.getElementById("memberId").value.trim();

    const artistId =
        artistSelect.value;

    const memberName =
        document.getElementById("memberName").value.trim();

    const instrument =
        document.getElementById("instrument").value.trim();


    try {

        // ====================================
        // UPDATE
        // ====================================

        if (editingRow !== null) {

            const oldMemberId =
                editingRow.cells[0].textContent;

            const response = await fetch(API_URL, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    old_member_id: oldMemberId,

                    member_id: memberId,
                    artist_id: artistId,
                    member_name: memberName,
                    instrument: instrument

                })

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Member update failed"
                );

            }


            editingRow.cells[0].textContent =
                memberId;

            editingRow.cells[1].textContent =
                result.artist_name ||
                getArtistName(artistId);

            editingRow.cells[2].textContent =
                memberName;

            editingRow.cells[3].textContent =
                instrument;

            editingRow.dataset.artistId =
                artistId;

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

                    member_id: memberId,
                    artist_id: artistId,
                    member_name: memberName,
                    instrument: instrument

                })

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Member insertion failed"
                );

            }


            addRow(result);

        }


        memberForm.reset();

        memberModal.style.display = "none";


    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});


// ====================================
// EDIT / DELETE
// ====================================

memberTableBody.addEventListener("click", async function (event) {

    const row = event.target.closest("tr");

    if (!row) return;


    // ====================================
    // DELETE
    // ====================================

    if (event.target.classList.contains("delete-btn")) {

        const memberId =
            row.cells[0].textContent;


        if (!confirm(
            `Are you sure you want to delete member ${memberId}?`
        )) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/${memberId}`,
                {
                    method: "DELETE"
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Member deletion failed"
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

        await loadArtists();


        document.getElementById("memberId").value =
            row.cells[0].textContent;

        document.getElementById("memberName").value =
            row.cells[2].textContent;

        document.getElementById("instrument").value =
            row.cells[3].textContent;


        // Select existing artist
        artistSelect.value =
            row.dataset.artistId || "";


        document.querySelector("#memberModal h2").textContent =
            "Edit Artist Member";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        memberModal.style.display = "flex";

    }

});


// ====================================
// INITIAL LOAD
// ====================================

loadArtists();
loadMembers();