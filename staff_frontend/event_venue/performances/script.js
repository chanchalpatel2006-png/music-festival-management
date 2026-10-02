const API_URL = "http://localhost:3000/api/performance";

const EVENT_API_URL = "http://localhost:3000/api/event";
const ARTIST_API_URL = "http://localhost:3000/api/artists";
const STAGE_API_URL = "http://localhost:3000/api/stage";


const addPerformanceBtn =
    document.getElementById("addPerformanceBtn");

const performanceModal =
    document.getElementById("performanceModal");

const closeModal =
    document.getElementById("closeModal");

const performanceForm =
    document.getElementById("performanceForm");

const performanceTableBody =
    document.getElementById("performanceTableBody");

const eventSelect =
    document.getElementById("eventId");

const artistSelect =
    document.getElementById("artistId");

const stageSelect =
    document.getElementById("stageId");


let editingRow = null;

let eventsList = [];
let artistsList = [];
let stagesList = [];


// ------------------------------------
// LOAD EVENTS
// ------------------------------------

async function loadEvents() {

    const response =
        await fetch(EVENT_API_URL);

    if (!response.ok) {
        throw new Error("Failed to load events");
    }

    eventsList =
        await response.json();

    eventSelect.innerHTML =
        `<option value="">Select Event</option>`;

    eventsList.forEach(event => {

        const option =
            document.createElement("option");

        option.value =
            event.event_id;

        option.textContent =
            `${event.event_name} (${event.event_id})`;

        eventSelect.appendChild(option);

    });

}


// ------------------------------------
// LOAD ARTISTS
// ------------------------------------

async function loadArtists() {

    const response =
        await fetch(ARTIST_API_URL);

    if (!response.ok) {
        throw new Error("Failed to load artists");
    }

    artistsList =
        await response.json();

    artistSelect.innerHTML =
        `<option value="">Select Artist</option>`;

    artistsList.forEach(artist => {

        const option =
            document.createElement("option");

        option.value =
            artist.artist_id;

        option.textContent =
            `${artist.artist_name} (${artist.artist_id})`;

        artistSelect.appendChild(option);

    });

}


// ------------------------------------
// LOAD STAGES
// ------------------------------------

async function loadStages() {

    const response =
        await fetch(STAGE_API_URL);

    if (!response.ok) {
        throw new Error("Failed to load stages");
    }

    stagesList =
        await response.json();

    stageSelect.innerHTML =
        `<option value="">Select Stage</option>`;

    stagesList.forEach(stage => {

        const option =
            document.createElement("option");

        option.value =
            stage.stage_id;

        option.textContent =
            `${stage.stage_name} (${stage.stage_id})`;

        stageSelect.appendChild(option);

    });

}


// ------------------------------------
// GET DISPLAY NAMES
// ------------------------------------

function getEventName(eventId) {

    const event =
        eventsList.find(
            event => event.event_id === eventId
        );

    return event
        ? event.event_name
        : "Unknown Event";

}


function getArtistName(artistId) {

    const artist =
        artistsList.find(
            artist => artist.artist_id === artistId
        );

    return artist
        ? artist.artist_name
        : "Unknown Artist";

}


function getStageName(stageId) {

    const stage =
        stagesList.find(
            stage => stage.stage_id === stageId
        );

    return stage
        ? stage.stage_name
        : "Unknown Stage";

}


// ------------------------------------
// LOAD PERFORMANCES
// ------------------------------------

async function loadPerformances() {

    try {

        await Promise.all([
            loadEvents(),
            loadArtists(),
            loadStages()
        ]);

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load performances"
            );
        }

        const performances =
            await response.json();

        performanceTableBody.innerHTML = "";

        performances.forEach(performance => {

            addRow(performance);

        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load performances from database."
        );

    }

}


// ------------------------------------
// ADD ROW
// ------------------------------------

function addRow(performance) {

    const row =
        performanceTableBody.insertRow();


    row.insertCell(0).textContent =
        performance.performance_id;


    row.insertCell(1).textContent =
        performance.event_name ||
        getEventName(performance.event_id);


    row.insertCell(2).textContent =
        performance.artist_name ||
        getArtistName(performance.artist_id);


    row.insertCell(3).textContent =
        performance.stage_name ||
        getStageName(performance.stage_id);


    row.insertCell(4).textContent =
        performance.performance_type;


    // Store actual FK IDs
    row.dataset.eventId =
        performance.event_id;

    row.dataset.artistId =
        performance.artist_id;

    row.dataset.stageId =
        performance.stage_id;


    const actionCell =
        row.insertCell(5);


    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

}


// ------------------------------------
// OPEN ADD
// ------------------------------------

addPerformanceBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        performanceForm.reset();

        try {
            document.getElementById("performanceId").value =
                await generateNextId("performance");
        } catch (error) {
            console.error(error);
            alert("Could not generate Performance ID.");
            return;
        }

        await Promise.all([
            loadEvents(),
            loadArtists(),
            loadStages()
        ]);

        document.querySelector(
            "#performanceModal h2"
        ).textContent =
            "Add Performance";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Performance";

        performanceModal.style.display =
            "flex";

    }
);


// ------------------------------------
// CLOSE
// ------------------------------------

closeModal.addEventListener(
    "click",
    function () {

        performanceModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === performanceModal) {

            performanceModal.style.display =
                "none";

        }

    }
);


// ------------------------------------
// ADD / UPDATE
// ------------------------------------

performanceForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const performanceId =
            document.getElementById(
                "performanceId"
            ).value.trim();


        const eventId =
            eventSelect.value;


        const artistId =
            artistSelect.value;


        const stageId =
            stageSelect.value;


        const performanceType =
            document.getElementById(
                "performanceType"
            ).value;


        if (!eventId ||
            !artistId ||
            !stageId ||
            !performanceType) {

            alert(
                "Please select all required fields."
            );

            return;

        }


        try {

            // --------------------------------
            // EDIT
            // --------------------------------

            if (editingRow !== null) {

                const oldPerformanceId =
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

                            old_performance_id:
                                oldPerformanceId,

                            performance_id:
                                performanceId,

                            event_id:
                                eventId,

                            artist_id:
                                artistId,

                            stage_id:
                                stageId,

                            performance_type:
                                performanceType

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Performance update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.performance_id;

                editingRow.cells[1].textContent =
                    result.event_name ||
                    getEventName(result.event_id);

                editingRow.cells[2].textContent =
                    result.artist_name ||
                    getArtistName(result.artist_id);

                editingRow.cells[3].textContent =
                    result.stage_name ||
                    getStageName(result.stage_id);

                editingRow.cells[4].textContent =
                    result.performance_type;


                editingRow.dataset.eventId =
                    result.event_id;

                editingRow.dataset.artistId =
                    result.artist_id;

                editingRow.dataset.stageId =
                    result.stage_id;


                editingRow = null;

            }


            // --------------------------------
            // ADD
            // --------------------------------

            else {

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            performance_id:
                                performanceId,

                            event_id:
                                eventId,

                            artist_id:
                                artistId,

                            stage_id:
                                stageId,

                            performance_type:
                                performanceType

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Performance insertion failed"
                    );

                }


                addRow(result);

            }


            performanceForm.reset();

            performanceModal.style.display =
                "none";


        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    }
);


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

performanceTableBody.addEventListener(
    "click",
    async function (event) {

        const row =
            event.target.closest("tr");

        if (!row) return;


        // --------------------------------
        // DELETE
        // --------------------------------

        if (
            event.target.classList
                .contains("delete-btn")
        ) {

            const performanceId =
                row.cells[0].textContent;


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this performance?"
                );


            if (!confirmDelete) return;


            try {

                const response =
                    await fetch(
                        `${API_URL}/${performanceId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Performance deletion failed"
                    );

                }


                row.remove();

            } catch (error) {

                console.error(error);

                alert(error.message);

            }

        }


        // --------------------------------
        // EDIT
        // --------------------------------

        if (
            event.target.classList
                .contains("edit-btn")
        ) {

            editingRow = row;


            await Promise.all([
                loadEvents(),
                loadArtists(),
                loadStages()
            ]);


            document.getElementById(
                "performanceId"
            ).value =
                row.cells[0].textContent;


            eventSelect.value =
                row.dataset.eventId;


            artistSelect.value =
                row.dataset.artistId;


            stageSelect.value =
                row.dataset.stageId;


            document.getElementById(
                "performanceType"
            ).value =
                row.cells[4].textContent;


            document.querySelector(
                "#performanceModal h2"
            ).textContent =
                "Edit Performance";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            performanceModal.style.display =
                "flex";

        }

    }
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

loadPerformances();