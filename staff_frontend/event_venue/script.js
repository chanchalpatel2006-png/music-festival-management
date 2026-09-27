const venuesCard = document.getElementById("venuesCard");
const eventsCard = document.getElementById("eventsCard");
const stagesCard = document.getElementById("stagesCard");
const songsCard = document.getElementById("songsCard");
const performancesCard = document.getElementById("performancesCard");
const setlistsCard = document.getElementById("setlistsCard");
const setlistSongsCard = document.getElementById("setlistSongsCard");


venuesCard.addEventListener("click", function () {
    window.location.href = "venues/index.html";
});


eventsCard.addEventListener("click", function () {
    window.location.href = "events/index.html";
});


stagesCard.addEventListener("click", function () {
    window.location.href = "stages/index.html";
});


songsCard.addEventListener("click", function () {
    window.location.href = "songs/index.html";
});


performancesCard.addEventListener("click", function () {
    window.location.href = "performances/index.html";
});


setlistsCard.addEventListener("click", function () {
    window.location.href = "setlists/index.html";
});


setlistSongsCard.addEventListener("click", function () {
    window.location.href = "setlist_songs/index.html";
});