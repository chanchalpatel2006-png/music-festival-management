// MANAGERS CARD
const managersCard = document.getElementById("managersCard");

if (managersCard) {
    managersCard.addEventListener("click", function () {
        window.location.href = "managers/index.html";
    });
}


// ARTISTS CARD
const artistsCard = document.getElementById("artistsCard");

if (artistsCard) {
    artistsCard.addEventListener("click", function () {
        window.location.href = "artists/index.html";
    });
}

// GENRES CARD
const genresCard = document.getElementById("genresCard");

if (genresCard) {
    genresCard.addEventListener("click", function () {
        window.location.href = "genres/index.html";
    });
}

// ARTIST GENRES CARD
const artistGenreCard =
    document.getElementById("artistGenreCard");

if (artistGenreCard) {

    artistGenreCard.addEventListener("click", function () {

        window.location.href = "artist_genres/index.html";

    });

}

// ARTIST MEMBERS CARD
const membersCard = document.getElementById("membersCard");

if (membersCard) {
    membersCard.addEventListener("click", function () {
        window.location.href = "artist_members/index.html";
    });
}