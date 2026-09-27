const artists = [
    {
        artist_id: "AR001",
        artist_name: "The Driver Era",
        artist_type: "BAND",
        country: "USA",
        manager_id: "MN001"
    },

    {
        artist_id: "AR002",
        artist_name: "Sabrina Carpenter",
        artist_type: "SOLO",
        country: "USA",
        manager_id: "MN002"
    },

    {
        artist_id: "AR003",
        artist_name: "Armaan Malik",
        artist_type: "SOLO",
        country: "INDIA",
        manager_id: "MN001"
    }
];

const artistTableBody =
    document.getElementById("artistTableBody");


function displayArtists() {

    artistTableBody.innerHTML = "";

    artists.forEach(function(artist) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${artist.artist_id}</td>
            <td>${artist.artist_name}</td>
            <td>${artist.artist_type}</td>
            <td>${artist.country}</td>
            <td>${artist.manager_id}</td>
            <td>
                <button onclick="editArtist('${artist.artist_id}')">
                    Edit
                </button>

                <button onclick="deleteArtist('${artist.artist_id}')">
                    Delete
                </button>
            </td>
        `;

        artistTableBody.appendChild(row);
    });
}


displayArtists();