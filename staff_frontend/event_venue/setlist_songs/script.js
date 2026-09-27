const API_URL = "http://localhost:3000/api/setlist-song";
const SONG_API_URL = "http://localhost:3000/api/song";

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

const songSelect =
    document.getElementById("songId");


let editingRow = null;
let songsList = [];


// ------------------------------------
// LOAD SONGS INTO DROPDOWN
// ------------------------------------

async function loadSongs() {

    try {

        const response = await fetch(SONG_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load songs");
        }

        songsList = await response.json();

        songSelect.innerHTML =
            `<option value="">Select Song</option>`;

        songsList.forEach(song => {

            const option =
                document.createElement("option");

            option.value = song.song_id;

            option.textContent =
                `${song.song_name} (${song.song_id})`;

            songSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("Could not load songs from database.");

    }

}


// ------------------------------------
// GET SONG NAME
// ------------------------------------

function getSongName(songId) {

    const song =
        songsList.find(
            song => song.song_id === songId
        );

    return song
        ? song.song_name
        : "Unknown Song";

}


// ------------------------------------
// LOAD SETLIST SONGS
// ------------------------------------

async function loadSetlistSongs() {

    try {

        await loadSongs();

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load setlist songs");
        }

        const records =
            await response.json();

        setlistSongTableBody.innerHTML = "";

        records.forEach(record => {

            addRow(record);

        });

    } catch (error) {

        console.error(error);

        alert("Could not load setlist songs from database.");

    }

}


// ------------------------------------
// ADD ROW
// ------------------------------------

function addRow(record) {

    const row =
        setlistSongTableBody.insertRow();

    row.insertCell(0).textContent =
        record.setlist_id;

    const songCell =
        row.insertCell(1);

    songCell.textContent =
        record.song_name ||
        getSongName(record.song_id);

    row.insertCell(2).textContent =
        record.song_order;


    // Store actual song ID
    row.dataset.songId =
        record.song_id;


    const actionCell =
        row.insertCell(3);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

}


// ------------------------------------
// OPEN ADD MODAL
// ------------------------------------

addSetlistSongBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        setlistSongForm.reset();

        formError.textContent = "";

        await loadSongs();

        document.querySelector(
            "#setlistSongModal h2"
        ).textContent = "Add Setlist Song";

        document.querySelector(
            ".save-btn"
        ).textContent = "Add Setlist Song";

        setlistSongModal.style.display = "flex";

    }
);


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener(
    "click",
    function () {

        setlistSongModal.style.display = "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === setlistSongModal) {

            setlistSongModal.style.display = "none";

        }

    }
);


// ------------------------------------
// ADD / UPDATE
// ------------------------------------

setlistSongForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const setlistId =
            document.getElementById("setlistId")
                .value
                .trim();

        const songId =
            songSelect.value;

        const songOrder =
            document.getElementById("songOrder")
                .value;


        // ------------------------------------
        // VALIDATION
        // ------------------------------------

        if (Number(songOrder) <= 0) {

            formError.textContent =
                "Song order must be greater than 0.";

            return;

        }


        if (!songId) {

            formError.textContent =
                "Please select a song.";

            return;

        }


        formError.textContent = "";


        try {

            // ------------------------------------
            // EDIT
            // ------------------------------------

            if (editingRow !== null) {

                const oldSetlistId =
                    editingRow.cells[0].textContent;

                const oldSongId =
                    editingRow.dataset.songId;


                const response =
                    await fetch(API_URL, {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            old_setlist_id:
                                oldSetlistId,

                            old_song_id:
                                oldSongId,

                            setlist_id:
                                setlistId,

                            song_id:
                                songId,

                            song_order:
                                songOrder

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Setlist song update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.setlist_id;

                editingRow.cells[1].textContent =
                    result.song_name ||
                    getSongName(result.song_id);

                editingRow.cells[2].textContent =
                    result.song_order;

                editingRow.dataset.songId =
                    result.song_id;


                editingRow = null;

            }


            // ------------------------------------
            // ADD
            // ------------------------------------

            else {

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            setlist_id:
                                setlistId,

                            song_id:
                                songId,

                            song_order:
                                songOrder

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Setlist song insertion failed"
                    );

                }


                addRow(result);

            }


            setlistSongForm.reset();

            setlistSongModal.style.display =
                "none";


        } catch (error) {

            console.error(error);

            formError.textContent =
                error.message;

        }

    }
);


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

setlistSongTableBody.addEventListener(
    "click",
    async function (event) {

        const row =
            event.target.closest("tr");

        if (!row) return;


        // ------------------------------------
        // DELETE
        // ------------------------------------

        if (
            event.target.classList
                .contains("delete-btn")
        ) {

            const setlistId =
                row.cells[0].textContent;

            const songId =
                row.dataset.songId;


            const confirmDelete =
                confirm(
                    "Are you sure you want to remove this song from the setlist?"
                );


            if (!confirmDelete) return;


            try {

                const response =
                    await fetch(
                        `${API_URL}/${setlistId}/${songId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Setlist song deletion failed"
                    );

                }


                row.remove();

            } catch (error) {

                console.error(error);

                alert(error.message);

            }

        }


        // ------------------------------------
        // EDIT
        // ------------------------------------

        if (
            event.target.classList
                .contains("edit-btn")
        ) {

            editingRow = row;


            await loadSongs();


            document.getElementById(
                "setlistId"
            ).value =
                row.cells[0].textContent;


            songSelect.value =
                row.dataset.songId;


            document.getElementById(
                "songOrder"
            ).value =
                row.cells[2].textContent;


            formError.textContent = "";


            document.querySelector(
                "#setlistSongModal h2"
            ).textContent =
                "Edit Setlist Song";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            setlistSongModal.style.display =
                "flex";

        }

    }
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

loadSetlistSongs();