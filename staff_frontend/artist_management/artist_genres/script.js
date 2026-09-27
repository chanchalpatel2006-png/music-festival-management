const API_URL = "http://localhost:3000/api/artist_genre";
const ARTIST_API_URL = "http://localhost:3000/api/artists";
const GENRE_API_URL = "http://localhost:3000/api/genre";

const addArtistGenreBtn =
    document.getElementById("addArtistGenreBtn");

const artistGenreModal =
    document.getElementById("artistGenreModal");

const closeModal =
    document.getElementById("closeModal");

const artistGenreForm =
    document.getElementById("artistGenreForm");

const artistGenreTableBody =
    document.getElementById("artistGenreTableBody");

const artistSelect =
    document.getElementById("artistId");

const genreSelect =
    document.getElementById("genreId");


let editingRow = null;

let editingArtistId = null;
let editingGenreId = null;

let artistsList = [];
let genresList = [];


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

        alert("Could not load artists from database.");

    }
}


// ====================================
// LOAD GENRES
// ====================================

async function loadGenres() {

    try {

        const response =
            await fetch(GENRE_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load genres");
        }

        genresList =
            await response.json();

        genreSelect.innerHTML = `
            <option value="">Select Genre</option>
        `;

        genresList.forEach(genre => {

            const option =
                document.createElement("option");

            option.value =
                genre.genre_id;

            option.textContent =
                `${genre.genre_name} (${genre.genre_id})`;

            genreSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("Could not load genres from database.");

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
// GET GENRE NAME
// ====================================

function getGenreName(genreId) {

    const genre =
        genresList.find(
            genre => genre.genre_id === genreId
        );

    return genre
        ? genre.genre_name
        : "Unknown Genre";
}


// ====================================
// LOAD ARTIST GENRE RECORDS
// ====================================

async function loadArtistGenres() {

    try {

        // Load FK data first
        await loadArtists();
        await loadGenres();

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load artist genres"
            );
        }

        const records =
            await response.json();

        artistGenreTableBody.innerHTML = "";

        records.forEach(record => {
            addRow(record);
        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load artist genre records from database."
        );

    }
}


// ====================================
// ADD ROW TO TABLE
// ====================================

function addRow(record) {

    const row =
        artistGenreTableBody.insertRow();


    // Artist name
    const artistName =
        record.artist_name ||
        getArtistName(record.artist_id);

    row.insertCell(0).textContent =
        artistName;


    // Genre name
    const genreName =
        record.genre_name ||
        getGenreName(record.genre_id);

    row.insertCell(1).textContent =
        genreName;


    // Store actual FK IDs
    row.dataset.artistId =
        record.artist_id;

    row.dataset.genreId =
        record.genre_id;


    const actionCell =
        row.insertCell(2);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// ====================================
// OPEN ADD MODAL
// ====================================

addArtistGenreBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        editingArtistId = null;
        editingGenreId = null;

        artistGenreForm.reset();

        // Reload dropdowns
        await loadArtists();
        await loadGenres();

        document.querySelector(
            "#artistGenreModal h2"
        ).textContent =
            "Assign Genre to Artist";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Assign Genre";

        artistGenreModal.style.display =
            "flex";
    }
);


// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener(
    "click",
    function () {

        artistGenreModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === artistGenreModal) {

            artistGenreModal.style.display =
                "none";

        }

    }
);


// ====================================
// ADD / UPDATE
// ====================================

artistGenreForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const artistId =
            artistSelect.value;

        const genreId =
            genreSelect.value;


        try {

            // ====================================
            // UPDATE
            // ====================================

            if (editingRow !== null) {

                const response =
                    await fetch(API_URL, {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            old_artist_id:
                                editingArtistId,

                            old_genre_id:
                                editingGenreId,

                            artist_id:
                                artistId,

                            genre_id:
                                genreId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Update failed"
                    );

                }


                // Display names
                editingRow.cells[0]
                    .textContent =
                    result.artist_name ||
                    getArtistName(artistId);

                editingRow.cells[1]
                    .textContent =
                    result.genre_name ||
                    getGenreName(genreId);


                // Update hidden FK IDs
                editingRow.dataset.artistId =
                    artistId;

                editingRow.dataset.genreId =
                    genreId;


                editingRow = null;

                editingArtistId = null;
                editingGenreId = null;

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

                            artist_id:
                                artistId,

                            genre_id:
                                genreId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Insert failed"
                    );

                }


                addRow(result);

            }


            artistGenreForm.reset();

            artistGenreModal.style.display =
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

artistGenreTableBody.addEventListener(
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

            // Get actual IDs from dataset
            const artistId =
                row.dataset.artistId;

            const genreId =
                row.dataset.genreId;


            const artistName =
                getArtistName(artistId);

            const genreName =
                getGenreName(genreId);


            if (!confirm(
                `Are you sure you want to remove ${genreName} from ${artistName}?`
            )) {
                return;
            }


            try {

                const response =
                    await fetch(API_URL, {

                        method: "DELETE",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            artist_id:
                                artistId,

                            genre_id:
                                genreId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Delete failed"
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


            // Get actual FK IDs
            editingArtistId =
                row.dataset.artistId;

            editingGenreId =
                row.dataset.genreId;


            // Reload dropdowns
            await loadArtists();
            await loadGenres();


            // Select existing values
            artistSelect.value =
                editingArtistId;

            genreSelect.value =
                editingGenreId;


            document.querySelector(
                "#artistGenreModal h2"
            ).textContent =
                "Edit Artist Genre";

            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            artistGenreModal.style.display =
                "flex";

        }

    }
);


// ====================================
// INITIAL LOAD
// ====================================

loadArtistGenres();