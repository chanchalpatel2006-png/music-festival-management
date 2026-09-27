const API_URL = "http://localhost:3000/api/venue";

const addVenueBtn =
    document.getElementById("addVenueBtn");

const venueModal =
    document.getElementById("venueModal");

const closeModal =
    document.getElementById("closeModal");

const venueForm =
    document.getElementById("venueForm");

const venueTableBody =
    document.getElementById("venueTableBody");

let editingRow = null;


// ====================================
// LOAD VENUES FROM DATABASE
// ====================================

async function loadVenues() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load venues"
            );
        }

        const venues =
            await response.json();

        // Clear current table
        venueTableBody.innerHTML = "";

        // Add database records
        venues.forEach(venue => {
            addRow(venue);
        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load venues from database."
        );

    }
}


// ====================================
// ADD ROW TO TABLE
// ====================================

function addRow(venue) {

    const row =
        venueTableBody.insertRow();

    row.insertCell(0).textContent =
        venue.venue_id;

    row.insertCell(1).textContent =
        venue.venue_name;

    row.insertCell(2).textContent =
        venue.location;

    const actionCell =
        row.insertCell(3);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// ====================================
// OPEN ADD VENUE
// ====================================

addVenueBtn.addEventListener(
    "click",
    function () {

        editingRow = null;

        venueForm.reset();

        document.querySelector(
            "#venueModal h2"
        ).textContent =
            "Add Venue";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Venue";

        venueModal.style.display =
            "flex";

    }
);


// ====================================
// CLOSE MODAL
// ====================================

closeModal.addEventListener(
    "click",
    function () {

        venueModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === venueModal) {

            venueModal.style.display =
                "none";

        }

    }
);


// ====================================
// ADD / UPDATE VENUE
// ====================================

venueForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const venueId =
            document.getElementById(
                "venueId"
            ).value.trim();

        const venueName =
            document.getElementById(
                "venueName"
            ).value.trim();

        const venueLocation =
            document.getElementById(
                "venueLocation"
            ).value.trim();


        try {

            // ====================================
            // UPDATE EXISTING VENUE
            // ====================================

            if (editingRow !== null) {

                const oldVenueId =
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

                            old_venue_id:
                                oldVenueId,

                            venue_id:
                                venueId,

                            venue_name:
                                venueName,

                            location:
                                venueLocation

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Venue update failed"
                    );

                }


                // Update table
                editingRow.cells[0]
                    .textContent =
                    result.venue_id;

                editingRow.cells[1]
                    .textContent =
                    result.venue_name;

                editingRow.cells[2]
                    .textContent =
                    result.location;


                editingRow = null;

            }


            // ====================================
            // INSERT NEW VENUE
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

                            venue_id:
                                venueId,

                            venue_name:
                                venueName,

                            location:
                                venueLocation

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Venue insertion failed"
                    );

                }


                // Add newly inserted DB record
                addRow(result);

            }


            venueForm.reset();

            venueModal.style.display =
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

venueTableBody.addEventListener(
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

            const venueId =
                row.cells[0].textContent;


            const confirmDelete =
                confirm(
                    `Are you sure you want to delete venue ${venueId}?`
                );


            if (!confirmDelete) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${venueId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Venue deletion failed"
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


            document.getElementById(
                "venueId"
            ).value =
                row.cells[0].textContent;


            document.getElementById(
                "venueName"
            ).value =
                row.cells[1].textContent;


            document.getElementById(
                "venueLocation"
            ).value =
                row.cells[2].textContent;


            document.querySelector(
                "#venueModal h2"
            ).textContent =
                "Edit Venue";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            venueModal.style.display =
                "flex";

        }

    }
);


// ====================================
// INITIAL LOAD
// ====================================

loadVenues();