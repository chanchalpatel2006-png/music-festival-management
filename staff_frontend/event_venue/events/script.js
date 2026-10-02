const API_URL = "http://localhost:3000/api/event";
const VENUE_API_URL = "http://localhost:3000/api/venue";

const addEventBtn =
    document.getElementById("addEventBtn");

const eventModal =
    document.getElementById("eventModal");

const closeModal =
    document.getElementById("closeModal");

const eventForm =
    document.getElementById("eventForm");

const eventTableBody =
    document.getElementById("eventTableBody");

const timeError =
    document.getElementById("timeError");

const venueSelect =
    document.getElementById("venueId");

let editingRow = null;
let venuesList = [];


// ------------------------------------
// LOAD VENUES
// ------------------------------------

async function loadVenues() {

    try {

        const response =
            await fetch(VENUE_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load venues");
        }

        venuesList =
            await response.json();

        venueSelect.innerHTML =
            `<option value="">Select Venue</option>`;

        venuesList.forEach(venue => {

            const option =
                document.createElement("option");

            option.value =
                venue.venue_id;

            option.textContent =
                `${venue.venue_name} (${venue.venue_id})`;

            venueSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("Could not load venues from database.");

    }

}


// ------------------------------------
// GET VENUE NAME
// ------------------------------------

function getVenueName(venueId) {

    const venue =
        venuesList.find(
            venue => venue.venue_id === venueId
        );

    return venue
        ? venue.venue_name
        : "Unknown Venue";

}


// ------------------------------------
// LOAD EVENTS
// ------------------------------------

async function loadEvents() {

    try {

        await loadVenues();

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load events");
        }

        const events =
            await response.json();

        eventTableBody.innerHTML = "";

        events.forEach(event => {

            addRow(event);

        });

    } catch (error) {

        console.error(error);

        alert("Could not load events from database.");

    }

}


// ------------------------------------
// ADD ROW
// ------------------------------------

function addRow(event) {

    const row =
        eventTableBody.insertRow();

    row.insertCell(0).textContent =
        event.event_id;

    row.insertCell(1).textContent =
        event.event_name;

    row.insertCell(2).textContent =
        event.event_date;

    row.insertCell(3).textContent =
        event.start_time;

    row.insertCell(4).textContent =
        event.end_time;


    const venueCell =
        row.insertCell(5);

    venueCell.textContent =
        event.venue_name ||
        getVenueName(event.venue_id);


    // Store actual venue ID
    row.dataset.venueId =
        event.venue_id;


    const actionCell =
        row.insertCell(6);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

}


// ------------------------------------
// OPEN ADD EVENT
// ------------------------------------

addEventBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        eventForm.reset();

        timeError.textContent = "";

        try {
            document.getElementById("eventId").value =
                await generateNextId("event");
        } catch (error) {
            console.error(error);
            alert("Could not generate Event ID.");
            return;
        }

        await loadVenues();

        document.querySelector(
            "#eventModal h2"
        ).textContent =
            "Add Event";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Event";

        eventModal.style.display =
            "flex";
    }
);


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener(
    "click",
    function () {

        eventModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === eventModal) {

            eventModal.style.display =
                "none";

        }

    }
);


// ------------------------------------
// ADD / UPDATE EVENT
// ------------------------------------

eventForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const eventId =
            document.getElementById("eventId")
                .value
                .trim();

        const eventName =
            document.getElementById("eventName")
                .value
                .trim();

        const eventDate =
            document.getElementById("eventDate")
                .value;

        const startTime =
            document.getElementById("startTime")
                .value;

        const endTime =
            document.getElementById("endTime")
                .value;

        const venueId =
            venueSelect.value;


        // ------------------------------------
        // CHECK TIME
        // ------------------------------------

        if (endTime <= startTime) {

            timeError.textContent =
                "End time must be later than start time.";

            return;

        }


        if (!venueId) {

            timeError.textContent =
                "Please select a venue.";

            return;

        }


        timeError.textContent = "";


        try {

            // ------------------------------------
            // EDIT
            // ------------------------------------

            if (editingRow !== null) {

                const oldEventId =
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

                            old_event_id:
                                oldEventId,

                            event_id:
                                eventId,

                            event_name:
                                eventName,

                            event_date:
                                eventDate,

                            start_time:
                                startTime,

                            end_time:
                                endTime,

                            venue_id:
                                venueId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Event update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.event_id;

                editingRow.cells[1].textContent =
                    result.event_name;

                editingRow.cells[2].textContent =
                    result.event_date;

                editingRow.cells[3].textContent =
                    result.start_time;

                editingRow.cells[4].textContent =
                    result.end_time;

                editingRow.cells[5].textContent =
                    result.venue_name ||
                    getVenueName(result.venue_id);

                editingRow.dataset.venueId =
                    result.venue_id;


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

                            event_id:
                                eventId,

                            event_name:
                                eventName,

                            event_date:
                                eventDate,

                            start_time:
                                startTime,

                            end_time:
                                endTime,

                            venue_id:
                                venueId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Event insertion failed"
                    );

                }


                addRow(result);

            }


            eventForm.reset();

            eventModal.style.display =
                "none";


        } catch (error) {

            console.error(error);

            timeError.textContent =
                error.message;

        }

    }
);


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

eventTableBody.addEventListener(
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

            const eventId =
                row.cells[0].textContent;


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this event?"
                );


            if (!confirmDelete) return;


            try {

                const response =
                    await fetch(
                        `${API_URL}/${eventId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Event deletion failed"
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


            await loadVenues();


            document.getElementById(
                "eventId"
            ).value =
                row.cells[0].textContent;


            document.getElementById(
                "eventName"
            ).value =
                row.cells[1].textContent;


            document.getElementById(
                "eventDate"
            ).value =
                row.cells[2].textContent;


            document.getElementById(
                "startTime"
            ).value =
                row.cells[3].textContent;


            document.getElementById(
                "endTime"
            ).value =
                row.cells[4].textContent;


            venueSelect.value =
                row.dataset.venueId || "";


            timeError.textContent = "";


            document.querySelector(
                "#eventModal h2"
            ).textContent =
                "Edit Event";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            eventModal.style.display =
                "flex";

        }

    }
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

loadEvents();