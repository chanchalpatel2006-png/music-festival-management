const API_URL = "http://localhost:3000/api/stage";
const VENUE_API_URL = "http://localhost:3000/api/venue";

const addStageBtn =
    document.getElementById("addStageBtn");

const stageModal =
    document.getElementById("stageModal");

const closeModal =
    document.getElementById("closeModal");

const stageForm =
    document.getElementById("stageForm");

const stageTableBody =
    document.getElementById("stageTableBody");

const venueSelect =
    document.getElementById("venueId");

const capacityError =
    document.getElementById("capacityError");

let editingRow = null;

let venuesList = [];


// ====================================
// LOAD VENUES FOR DROPDOWN
// ====================================

async function loadVenues() {

    try {

        const response =
            await fetch(VENUE_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load venues");
        }

        venuesList =
            await response.json();

        venueSelect.innerHTML = `
            <option value="">Select Venue</option>
        `;

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

        alert(
            "Could not load venues from database."
        );

    }
}


// ====================================
// GET VENUE NAME
// ====================================

function getVenueName(venueId) {

    const venue =
        venuesList.find(
            venue => venue.venue_id === venueId
        );

    return venue
        ? venue.venue_name
        : "Unknown Venue";
}


// ====================================
// LOAD STAGES FROM DATABASE
// ====================================

async function loadStages() {

    try {

        // Load venues first
        await loadVenues();

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load stages"
            );
        }

        const stages =
            await response.json();

        stageTableBody.innerHTML = "";

        stages.forEach(stage => {
            addRow(stage);
        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load stages from database."
        );

    }
}


// ====================================
// ADD ROW
// ====================================

function addRow(stage) {

    const row =
        stageTableBody.insertRow();


    row.insertCell(0).textContent =
        stage.stage_id;


    row.insertCell(1).textContent =
        stage.stage_name;


    const venueName =
        stage.venue_name ||
        getVenueName(stage.venue_id);

    row.insertCell(2).textContent =
        venueName;


    row.insertCell(3).textContent =
        stage.capacity;


    row.insertCell(4).textContent =
        stage.stage_type;


    // Store actual FK
    row.dataset.venueId =
        stage.venue_id;


    const actionCell =
        row.insertCell(5);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// ====================================
// OPEN ADD STAGE
// ====================================

addStageBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        stageForm.reset();

        capacityError.textContent = "";

        // Reload venues
        await loadVenues();

        document.querySelector(
            "#stageModal h2"
        ).textContent =
            "Add Stage";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Stage";

        stageModal.style.display =
            "flex";

    }
);


// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener(
    "click",
    function () {

        stageModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === stageModal) {

            stageModal.style.display =
                "none";

        }

    }
);


// ====================================
// ADD / UPDATE STAGE
// ====================================

stageForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const stageId =
            document.getElementById(
                "stageId"
            ).value.trim();


        const stageName =
            document.getElementById(
                "stageName"
            ).value.trim();


        const venueId =
            venueSelect.value;


        const capacity =
            document.getElementById(
                "capacity"
            ).value;


        const stageType =
            document.getElementById(
                "stageType"
            ).value;


        // ====================================
        // CAPACITY VALIDATION
        // ====================================

        if (Number(capacity) <= 0) {

            capacityError.textContent =
                "Capacity must be greater than 0.";

            return;

        }

        capacityError.textContent = "";


        try {

            // ====================================
            // UPDATE
            // ====================================

            if (editingRow !== null) {

                const oldStageId =
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

                            old_stage_id:
                                oldStageId,

                            stage_id:
                                stageId,

                            stage_name:
                                stageName,

                            venue_id:
                                venueId,

                            capacity:
                                Number(capacity),

                            stage_type:
                                stageType

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Stage update failed"
                    );

                }


                editingRow.cells[0]
                    .textContent =
                    result.stage_id;


                editingRow.cells[1]
                    .textContent =
                    result.stage_name;


                editingRow.cells[2]
                    .textContent =
                    result.venue_name ||
                    getVenueName(result.venue_id);


                editingRow.cells[3]
                    .textContent =
                    result.capacity;


                editingRow.cells[4]
                    .textContent =
                    result.stage_type;


                editingRow.dataset.venueId =
                    result.venue_id;


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

                            stage_id:
                                stageId,

                            stage_name:
                                stageName,

                            venue_id:
                                venueId,

                            capacity:
                                Number(capacity),

                            stage_type:
                                stageType

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Stage insertion failed"
                    );

                }


                addRow(result);

            }


            stageForm.reset();

            stageModal.style.display =
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

stageTableBody.addEventListener(
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

            const stageId =
                row.cells[0].textContent;


            if (!confirm(
                `Are you sure you want to delete stage ${stageId}?`
            )) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${stageId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Stage deletion failed"
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


            const venueId =
                row.dataset.venueId;


            await loadVenues();


            document.getElementById(
                "stageId"
            ).value =
                row.cells[0].textContent;


            document.getElementById(
                "stageName"
            ).value =
                row.cells[1].textContent;


            venueSelect.value =
                venueId;


            document.getElementById(
                "capacity"
            ).value =
                row.cells[3].textContent;


            document.getElementById(
                "stageType"
            ).value =
                row.cells[4].textContent;


            capacityError.textContent = "";


            document.querySelector(
                "#stageModal h2"
            ).textContent =
                "Edit Stage";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            stageModal.style.display =
                "flex";

        }

    }
);


// ====================================
// INITIAL LOAD
// ====================================

loadStages();