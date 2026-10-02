const API_URL = "http://localhost:3000/api/artists";

const artistGrid =
    document.querySelector(".artist-grid");

const search =
    document.getElementById("artistSearch");

let artists = [];


// ================================
// LOAD ARTISTS FROM DATABASE
// ================================

async function loadArtists() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load artists");
        }

        artists =
            await response.json();

        displayArtists(artists);

    } catch (error) {

        console.error("Error loading artists:", error);

        artistGrid.innerHTML = `
            <p style="color:#dc2626;">
                Could not load artists from database.
            </p>
        `;

    }

}


// ================================
// DISPLAY ARTISTS
// ================================

function displayArtists(data) {

    artistGrid.innerHTML = "";

    if (data.length === 0) {

        artistGrid.innerHTML = `
            <p>
                No artists found.
            </p>
        `;

        return;
    }


    data.forEach(function (artist) {

        const card =
            document.createElement("div");

        card.className = "artist-card";


        card.innerHTML = `

            <div class="artist-avatar">
                🎵
            </div>

            <span>ARTIST</span>

            <h2>
                ${artist.artist_name}
            </h2>

            <p>
                🌎 ${artist.country}
            </p>

        `;


        artistGrid.appendChild(card);

    });

}


// ================================
// SEARCH ARTISTS
// ================================

search.addEventListener("input", function () {

    const value =
        search.value.toLowerCase().trim();


    const filteredArtists =
        artists.filter(function (artist) {

            return (
                artist.artist_name
                    .toLowerCase()
                    .includes(value)
                ||
                artist.artist_id
                    .toLowerCase()
                    .includes(value)
            );

        });


    displayArtists(filteredArtists);

});


// ================================
// INITIAL LOAD
// ================================

loadArtists();