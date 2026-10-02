const API_URL = "http://localhost:3000/api/attendee";

const addAttendeeBtn =
    document.getElementById("addAttendeeBtn");

const attendeeModal =
    document.getElementById("attendeeModal");

const closeModal =
    document.getElementById("closeModal");

const attendeeForm =
    document.getElementById("attendeeForm");

const attendeeTableBody =
    document.getElementById("attendeeTableBody");

const formError =
    document.getElementById("formError");

let editingRow = null;


// ------------------------------------
// LOAD ATTENDEES
// ------------------------------------

async function loadAttendees() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load attendees"
            );
        }

        const attendees =
            await response.json();

        attendeeTableBody.innerHTML = "";

        attendees.forEach(attendee => {

            addRow(attendee);

        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load attendees from database."
        );

    }

}


// ------------------------------------
// ADD ROW
// ------------------------------------

function addRow(attendee) {

    const row =
        attendeeTableBody.insertRow();


    row.insertCell(0).textContent =
        attendee.attendee_id;

    row.insertCell(1).textContent =
        attendee.attendee_name;

    row.insertCell(2).textContent =
        attendee.email;

    row.insertCell(3).textContent =
        attendee.phone;

    row.insertCell(4).textContent =
        attendee.age;


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

addAttendeeBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        attendeeForm.reset();

        formError.textContent = "";

        try {
            document.getElementById("attendeeId").value =
                await generateNextId("attendee");
        } catch (error) {
            console.error(error);
            alert("Could not generate Attendee ID.");
            return;
        }

        document.querySelector(
            "#attendeeModal h2"
        ).textContent =
            "Add Attendee";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Attendee";

        attendeeModal.style.display =
            "flex";
    }
);


// ------------------------------------
// CLOSE
// ------------------------------------

closeModal.addEventListener(
    "click",
    function () {

        attendeeModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === attendeeModal) {

            attendeeModal.style.display =
                "none";

        }

    }
);


// ------------------------------------
// ADD / UPDATE
// ------------------------------------

attendeeForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const attendeeId =
            document.getElementById(
                "attendeeId"
            ).value.trim();


        const attendeeName =
            document.getElementById(
                "attendeeName"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const phone =
            document.getElementById(
                "phone"
            ).value.trim();


        const age =
            document.getElementById(
                "age"
            ).value;


        // --------------------------------
        // AGE VALIDATION
        // --------------------------------

        if (Number(age) < 15) {

            formError.textContent =
                "Attendee must be at least 15 years old.";

            return;

        }


        // --------------------------------
        // EMAIL VALIDATION
        // --------------------------------

        if (!email.includes("@")) {

            formError.textContent =
                "Please enter a valid email address.";

            return;

        }


        formError.textContent = "";


        try {

            // --------------------------------
            // EDIT
            // --------------------------------

            if (editingRow !== null) {

                const oldAttendeeId =
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

                            old_attendee_id:
                                oldAttendeeId,

                            attendee_id:
                                attendeeId,

                            attendee_name:
                                attendeeName,

                            email:
                                email,

                            phone:
                                phone,

                            age:
                                age

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Attendee update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.attendee_id;

                editingRow.cells[1].textContent =
                    result.attendee_name;

                editingRow.cells[2].textContent =
                    result.email;

                editingRow.cells[3].textContent =
                    result.phone;

                editingRow.cells[4].textContent =
                    result.age;


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

                            attendee_id:
                                attendeeId,

                            attendee_name:
                                attendeeName,

                            email:
                                email,

                            phone:
                                phone,

                            age:
                                age

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Attendee insertion failed"
                    );

                }


                addRow(result);

            }


            attendeeForm.reset();

            attendeeModal.style.display =
                "none";


        } catch (error) {

            console.error(error);

            formError.textContent =
                error.message;

        }

    }
);


// ------------------------------------
// EDIT / DELETE
// ------------------------------------

attendeeTableBody.addEventListener(
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

            const attendeeId =
                row.cells[0].textContent;


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this attendee?"
                );


            if (!confirmDelete) return;


            try {

                const response =
                    await fetch(
                        `${API_URL}/${attendeeId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Attendee deletion failed"
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


            document.getElementById(
                "attendeeId"
            ).value =
                row.cells[0].textContent;


            document.getElementById(
                "attendeeName"
            ).value =
                row.cells[1].textContent;


            document.getElementById(
                "email"
            ).value =
                row.cells[2].textContent;


            document.getElementById(
                "phone"
            ).value =
                row.cells[3].textContent;


            document.getElementById(
                "age"
            ).value =
                row.cells[4].textContent;


            formError.textContent = "";


            document.querySelector(
                "#attendeeModal h2"
            ).textContent =
                "Edit Attendee";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            attendeeModal.style.display =
                "flex";

        }

    }
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

loadAttendees();