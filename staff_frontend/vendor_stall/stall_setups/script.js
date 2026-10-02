const API_URL = "http://localhost:3000/api/stall-setup";

const addRecordBtn =
    document.getElementById("addRecordBtn");

const recordModal =
    document.getElementById("recordModal");

const closeModal =
    document.getElementById("closeModal");

const recordForm =
    document.getElementById("recordForm");

const recordTableBody =
    document.getElementById("recordTableBody");

const formError =
    document.getElementById("formError");

const modalTitle =
    document.getElementById("modalTitle");

const saveBtn =
    document.getElementById("saveBtn");

let editingRow = null;


/* =========================================================
   LOAD STALLS
   stall_id is a FOREIGN KEY
========================================================= */

async function loadStalls() {

    try {

        const response =
            await fetch("http://localhost:3000/api/stall");

        if (!response.ok) {
            throw new Error("Failed to load stalls.");
        }

        const stalls =
            await response.json();

        const stallSelect =
            document.getElementById("stall_id");

        stallSelect.innerHTML =
            `<option value="">Select Stall</option>`;

        stalls.forEach(function (stall) {

            const option =
                document.createElement("option");

            option.value =
                stall.stall_id;

            option.textContent =
                `${stall.stall_name} (${stall.stall_id})`;

            stallSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load stalls.\n" +
            error.message
        );
    }
}


/* =========================================================
   LOAD VENUES
   venue_id is a FOREIGN KEY
========================================================= */

async function loadVenues() {

    try {

        const response =
            await fetch("http://localhost:3000/api/venue");

        if (!response.ok) {
            throw new Error("Failed to load venues.");
        }

        const venues =
            await response.json();

        const venueSelect =
            document.getElementById("venue_id");

        venueSelect.innerHTML =
            `<option value="">Select Venue</option>`;

        venues.forEach(function (venue) {

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
            "Could not load venues.\n" +
            error.message
        );
    }
}


/* =========================================================
   LOAD STALL SETUPS
========================================================= */

async function loadStallSetups() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load stall setups.");
        }

        const setups =
            await response.json();

        recordTableBody.innerHTML = "";

        setups.forEach(function (setup) {
            addRow(setup);
        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load stall setups.\n" +
            error.message
        );
    }
}


/* =========================================================
   ADD ROW
========================================================= */

function addRow(setup) {

    const row =
        recordTableBody.insertRow();

    row.insertCell(0).textContent =
        setup.setup_id;

    row.insertCell(1).textContent =
        setup.stall_id;

    row.insertCell(2).textContent =
        setup.venue_id;

    row.insertCell(3).textContent =
        setup.stall_rent;

    row.insertCell(4).textContent =
        setup.stall_date;

    const actionCell =
        row.insertCell(5);

    actionCell.innerHTML = `
        <button type="button" class="edit-btn">
            Edit
        </button>

        <button type="button" class="delete-btn">
            Delete
        </button>
    `;
}


/* =========================================================
   OPEN ADD MODAL
========================================================= */

addRecordBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        recordForm.reset();

        formError.textContent = "";

        try {
            document.getElementById("setup_id").value =
                await generateNextId("stall_setup");
        } catch (error) {
            console.error(error);
            alert("Could not generate Stall Setup ID.");
            return;
        }

        modalTitle.textContent =
            "Add Stall Setup";

        saveBtn.textContent =
            "Add Stall Setup";

        recordModal.style.display =
            "flex";
    }
);


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeForm() {

    recordModal.style.display =
        "none";

    editingRow = null;

    formError.textContent = "";
}

closeModal.addEventListener(
    "click",
    closeForm
);

window.addEventListener(
    "click",
    function (event) {

        if (event.target === recordModal) {
            closeForm();
        }

    }
);


/* =========================================================
   ADD / UPDATE
========================================================= */

recordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const setup_id =
            document.getElementById(
                "setup_id"
            ).value.trim();

        const stall_id =
            document.getElementById(
                "stall_id"
            ).value;

        const venue_id =
            document.getElementById(
                "venue_id"
            ).value;

        const stall_rent =
            document.getElementById(
                "stall_rent"
            ).value;

        const stall_date =
            document.getElementById(
                "stall_date"
            ).value;


        /* =========================
           VALIDATION
        ========================= */

        if (
            !setup_id ||
            !stall_id ||
            !venue_id ||
            !stall_rent ||
            !stall_date
        ) {

            formError.textContent =
                "Please fill all required fields.";

            return;
        }


        const rent =
            Number(stall_rent);

        if (
            !Number.isFinite(rent) ||
            rent < 0 ||
            rent > 99999999.99
        ) {

            formError.textContent =
                "Stall rent must be between 0 and 99999999.99.";

            return;
        }


        formError.textContent = "";


        try {

            /* =========================
               UPDATE
            ========================= */

            if (editingRow !== null) {

                const oldSetupId =
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

                            old_setup_id:
                                oldSetupId,

                            setup_id:
                                setup_id,

                            stall_id:
                                stall_id,

                            venue_id:
                                venue_id,

                            stall_rent:
                                rent,

                            stall_date:
                                stall_date

                        })
                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Stall setup update failed."
                    );
                }


                editingRow.cells[0].textContent =
                    result.setup_id;

                editingRow.cells[1].textContent =
                    result.stall_id;

                editingRow.cells[2].textContent =
                    result.venue_id;

                editingRow.cells[3].textContent =
                    result.stall_rent;

                editingRow.cells[4].textContent =
                    result.stall_date;

            }


            /* =========================
               INSERT
            ========================= */

            else {

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            setup_id:
                                setup_id,

                            stall_id:
                                stall_id,

                            venue_id:
                                venue_id,

                            stall_rent:
                                rent,

                            stall_date:
                                stall_date

                        })
                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Stall setup insertion failed."
                    );
                }


                addRow(result);
            }


            recordForm.reset();

            closeForm();


        } catch (error) {

            console.error(error);

            formError.textContent =
                error.message;
        }

    }
);


/* =========================================================
   EDIT / DELETE
========================================================= */

recordTableBody.addEventListener(
    "click",
    async function (event) {

        const row =
            event.target.closest("tr");

        if (!row) {
            return;
        }


        /* =========================
           DELETE
        ========================= */

        if (
            event.target.classList
                .contains("delete-btn")
        ) {

            const setupId =
                row.cells[0].textContent;


            const confirmed =
                confirm(
                    "Are you sure you want to delete this stall setup?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${setupId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Stall setup deletion failed."
                    );
                }


                row.remove();

            } catch (error) {

                console.error(error);

                alert(error.message);
            }

            return;
        }


        /* =========================
           EDIT
        ========================= */

        if (
            event.target.classList
                .contains("edit-btn")
        ) {

            editingRow = row;


            document.getElementById(
                "setup_id"
            ).value =
                row.cells[0].textContent;


            document.getElementById(
                "stall_id"
            ).value =
                row.cells[1].textContent;


            document.getElementById(
                "venue_id"
            ).value =
                row.cells[2].textContent;


            document.getElementById(
                "stall_rent"
            ).value =
                row.cells[3].textContent;


            document.getElementById(
                "stall_date"
            ).value =
                row.cells[4].textContent;


            formError.textContent = "";

            modalTitle.textContent =
                "Edit Stall Setup";

            saveBtn.textContent =
                "Save Changes";

            recordModal.style.display =
                "flex";
        }

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

loadStalls();
loadVenues();
loadStallSetups();