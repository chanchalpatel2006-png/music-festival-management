const API_URL = "http://localhost:3000/api/song";
const ARTIST_API_URL = "http://localhost:3000/api/artists";

const addSongBtn =
    document.getElementById("addSongBtn");

const songModal =
    document.getElementById("songModal");

const closeModal =
    document.getElementById("closeModal");

const songForm =
    document.getElementById("songForm");

const songTableBody =
    document.getElementById("songTableBody");

const artistSelect =
    document.getElementById("artistId");

let editingRow = null;

let artistsList = [];


// ====================================
// LOAD ARTISTS
// ====================================

async function loadArtists() {

    try {

        const response =
            await fetch(ARTIST_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load artists");
        }

        artistsList =
            await response.json();

        artistSelect.innerHTML = `
            <option value="">Select Artist</option>
        `;

        artistsList.forEach(artist => {

            const option =
                document.createElement("option");

            option.value =
                artist.artist_id;

            option.textContent =
                `${artist.artist_name} (${artist.artist_id})`;

            artistSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load artists from database."
        );

    }
}


// ====================================
// GET ARTIST NAME
// ====================================

function getArtistName(artistId) {

    const artist =
        artistsList.find(
            artist => artist.artist_id === artistId
        );

    return artist
        ? artist.artist_name
        : "Unknown Artist";
}


// ====================================
// LOAD SONGS
// ====================================

async function loadSongs() {

    try {

        // Load artists first
        await loadArtists();

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load songs"
            );
        }

        const songs =
            await response.json();

        songTableBody.innerHTML = "";

        songs.forEach(song => {
            addRow(song);
        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load songs from database."
        );

    }
}


// ====================================
// ADD ROW
// ====================================

function addRow(song) {

    const row =
        songTableBody.insertRow();


    row.insertCell(0).textContent =
        song.song_id;


    row.insertCell(1).textContent =
        song.song_name;


    const artistName =
        song.artist_name ||
        getArtistName(song.artist_id);

    row.insertCell(2).textContent =
        artistName;


    // Keep actual FK ID
    row.dataset.artistId =
        song.artist_id;


    const actionCell =
        row.insertCell(3);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// ====================================
// OPEN ADD SONG
// ====================================

addSongBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        songForm.reset();

        try {
            document.getElementById("songId").value =
                await generateNextId("song");
        } catch (error) {
            console.error(error);
            alert("Could not generate Song ID.");
            return;
        }

        await loadArtists();

        document.querySelector(
            "#songModal h2"
        ).textContent =
            "Add Song";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Song";

        songModal.style.display =
            "flex";

    }
);


// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener(
    "click",
    function () {

        songModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === songModal) {

            songModal.style.display =
                "none";

        }

    }
);


// ====================================
// ADD / UPDATE SONG
// ====================================

songForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const songId =
            document.getElementById(
                "songId"
            ).value.trim();


        const songName =
            document.getElementById(
                "songName"
            ).value.trim();


        const artistId =
            artistSelect.value;


        try {

            // ====================================
            // UPDATE
            // ====================================

            if (editingRow !== null) {

                const oldSongId =
                    editingRow.cells[0]
                        .textContent;


                const response =
                    await fetch(API_URL, {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            old_song_id:
                                oldSongId,

                            song_id:
                                songId,

                            song_name:
                                songName,

                            artist_id:
                                artistId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Song update failed"
                    );

                }


                editingRow.cells[0]
                    .textContent =
                    result.song_id;


                editingRow.cells[1]
                    .textContent =
                    result.song_name;


                editingRow.cells[2]
                    .textContent =
                    result.artist_name ||
                    getArtistName(
                        result.artist_id
                    );


                editingRow.dataset.artistId =
                    result.artist_id;


                editingRow = null;

            }


            // ====================================
            // INSERT
            // ====================================

            else {

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            song_id:
                                songId,

                            song_name:
                                songName,

                            artist_id:
                                artistId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Song insertion failed"
                    );

                }


                addRow(result);

            }


            songForm.reset();

            songModal.style.display =
                "none";


        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    }
);


// ====================================
// EDIT / DELETE
// ====================================

songTableBody.addEventListener(
    "click",
    async function (event) {

        const row =
            event.target.closest("tr");

        if (!row) return;


        // ====================================
        // DELETE
        // ====================================

        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            const songId =
                row.cells[0].textContent;


            if (!confirm(
                `Are you sure you want to delete song ${songId}?`
            )) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${songId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Song deletion failed"
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

        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            editingRow = row;


            await loadArtists();


            document.getElementById(
                "songId"
            ).value =
                row.cells[0].textContent;


            document.getElementById(
                "songName"
            ).value =
                row.cells[1].textContent;


            // Select existing artist
            artistSelect.value =
                row.dataset.artistId || "";


            document.querySelector(
                "#songModal h2"
            ).textContent =
                "Edit Song";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            songModal.style.display =
                "flex";

        }

    }
);


// ====================================
// INITIAL LOAD
// ====================================

loadSongs();