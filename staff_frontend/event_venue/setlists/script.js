const API_URL = "http://localhost:3000/api/setlist";
const PERFORMANCE_API_URL =
    "http://localhost:3000/api/performance";


const addSetlistBtn =
    document.getElementById("addSetlistBtn");

const setlistModal =
    document.getElementById("setlistModal");

const closeModal =
    document.getElementById("closeModal");

const setlistForm =
    document.getElementById("setlistForm");

const setlistTableBody =
    document.getElementById("setlistTableBody");

const performanceSelect =
    document.getElementById("performanceId");


let editingRow = null;
let performancesList = [];


// ------------------------------------
// LOAD PERFORMANCES
// ------------------------------------

async function loadPerformances() {

    try {

        const response =
            await fetch(PERFORMANCE_API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load performances"
            );
        }

        performancesList =
            await response.json();


        performanceSelect.innerHTML =
            `<option value="">Select Performance</option>`;


        performancesList.forEach(performance => {

            const option =
                document.createElement("option");


            option.value =
                performance.performance_id;


            option.textContent =
                `${performance.performance_id} - ${
                    performance.event_name ||
                    "Unknown Event"
                } - ${
                    performance.artist_name ||
                    "Unknown Artist"
                }`;


            performanceSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load performances from database."
        );

    }

}


// ------------------------------------
// GET PERFORMANCE DISPLAY NAME
// ------------------------------------

function getPerformanceName(performanceId) {

    const performance =
        performancesList.find(
            performance =>
                performance.performance_id ===
                performanceId
        );


    if (!performance) {
        return performanceId;
    }


    return `${performance.performance_id} - ${
        performance.event_name ||
        "Unknown Event"
    } - ${
        performance.artist_name ||
        "Unknown Artist"
    }`;

}


// ------------------------------------
// LOAD SETLISTS
// ------------------------------------

async function loadSetlists() {

    try {

        await loadPerformances();


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load setlists"
            );

        }


        const setlists =
            await response.json();


        setlistTableBody.innerHTML = "";


        setlists.forEach(setlist => {

            addRow(setlist);

        });


    } catch (error) {

        console.error(error);

        alert(
            "Could not load setlists from database."
        );

    }

}


// ------------------------------------
// ADD ROW
// ------------------------------------

function addRow(setlist) {

    const row =
        setlistTableBody.insertRow();


    row.insertCell(0).textContent =
        setlist.setlist_id;


    row.insertCell(1).textContent =
        setlist.performance_id_display ||
        getPerformanceName(
            setlist.performance_id
        );


    // Store actual FK
    row.dataset.performanceId =
        setlist.performance_id;


    const actionCell =
        row.insertCell(2);


    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

}


// ------------------------------------
// OPEN ADD MODAL
// ------------------------------------

addSetlistBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        setlistForm.reset();

        try {
            document.getElementById("setlistId").value =
                await generateNextId("setlist");
        } catch (error) {
            console.error(error);
            alert("Could not generate Setlist ID.");
            return;
        }

        await loadPerformances();

        document.querySelector(
            "#setlistModal h2"
        ).textContent =
            "Add Setlist";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Setlist";

        setlistModal.style.display =
            "flex";

    }
);


// ------------------------------------
// CLOSE MODAL
// ------------------------------------

closeModal.addEventListener(
    "click",
    function () {

        setlistModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === setlistModal) {

            setlistModal.style.display =
                "none";

        }

    }
);


// ------------------------------------
// ADD / UPDATE
// ------------------------------------

setlistForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const setlistId =
            document.getElementById(
                "setlistId"
            ).value.trim();


        const performanceId =
            performanceSelect.value;


        if (!performanceId) {

            alert(
                "Please select a performance."
            );

            return;

        }


        try {

            // --------------------------------
            // EDIT
            // --------------------------------

            if (editingRow !== null) {

                const oldSetlistId =
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

                            old_setlist_id:
                                oldSetlistId,

                            setlist_id:
                                setlistId,

                            performance_id:
                                performanceId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Setlist update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.setlist_id;


                editingRow.cells[1].textContent =
                    result.performance_id_display ||
                    getPerformanceName(
                        result.performance_id
                    );


                editingRow.dataset.performanceId =
                    result.performance_id;


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

                            setlist_id:
                                setlistId,

                            performance_id:
                                performanceId

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Setlist insertion failed"
                    );

                }


                addRow(result);

            }


            setlistForm.reset();

            setlistModal.style.display =
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

setlistTableBody.addEventListener(
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

            const setlistId =
                row.cells[0].textContent;


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this setlist?"
                );


            if (!confirmDelete) return;


            try {

                const response =
                    await fetch(
                        `${API_URL}/${setlistId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Setlist deletion failed"
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


            await loadPerformances();


            document.getElementById(
                "setlistId"
            ).value =
                row.cells[0].textContent;


            performanceSelect.value =
                row.dataset.performanceId;


            document.querySelector(
                "#setlistModal h2"
            ).textContent =
                "Edit Setlist";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            setlistModal.style.display =
                "flex";

        }

    }
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

loadSetlists();