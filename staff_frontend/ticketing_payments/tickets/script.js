const API_URL = "http://localhost:3000/api/ticket";
const ATTENDEE_API_URL = "http://localhost:3000/api/attendee";
const TICKET_TYPE_API_URL = "http://localhost:3000/api/ticket-type";

const addTicketBtn =
    document.getElementById("addTicketBtn");

const ticketModal =
    document.getElementById("ticketModal");

const closeModal =
    document.getElementById("closeModal");

const ticketForm =
    document.getElementById("ticketForm");

const ticketTableBody =
    document.getElementById("ticketTableBody");

const formError =
    document.getElementById("formError");

const attendeeSelect =
    document.getElementById("attendeeId");

const ticketTypeSelect =
    document.getElementById("ticketTypeId");

let editingRow = null;

let attendeesList = [];
let ticketTypesList = [];


// ------------------------------------
// LOAD ATTENDEES
// ------------------------------------

async function loadAttendees() {

    const response =
        await fetch(ATTENDEE_API_URL);

    if (!response.ok) {
        throw new Error("Failed to load attendees");
    }

    attendeesList =
        await response.json();

    attendeeSelect.innerHTML =
        `<option value="">Select Attendee</option>`;

    attendeesList.forEach(attendee => {

        const option =
            document.createElement("option");

        option.value =
            attendee.attendee_id;

        option.textContent =
            `${attendee.attendee_name} (${attendee.attendee_id})`;

        attendeeSelect.appendChild(option);

    });

}


// ------------------------------------
// LOAD TICKET TYPES
// ------------------------------------

async function loadTicketTypes() {

    const response =
        await fetch(TICKET_TYPE_API_URL);

    if (!response.ok) {
        throw new Error("Failed to load ticket types");
    }

    ticketTypesList =
        await response.json();

    ticketTypeSelect.innerHTML =
        `<option value="">Select Ticket Type</option>`;

    ticketTypesList.forEach(ticketType => {

        const option =
            document.createElement("option");

        option.value =
            ticketType.ticket_type_id;

        option.textContent =
            `${ticketType.type_name} (${ticketType.ticket_type_id})`;

        ticketTypeSelect.appendChild(option);

    });

}


// ------------------------------------
// DISPLAY NAMES
// ------------------------------------

function getAttendeeName(attendeeId) {

    const attendee =
        attendeesList.find(
            attendee =>
                attendee.attendee_id === attendeeId
        );

    return attendee
        ? attendee.attendee_name
        : "Unknown Attendee";

}


function getTicketTypeName(ticketTypeId) {

    const ticketType =
        ticketTypesList.find(
            ticketType =>
                ticketType.ticket_type_id === ticketTypeId
        );

    return ticketType
        ? ticketType.type_name
        : "Unknown Type";

}


// ------------------------------------
// LOAD TICKETS
// ------------------------------------

async function loadTickets() {

    try {

        await Promise.all([
            loadAttendees(),
            loadTicketTypes()
        ]);

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }

        const tickets =
            await response.json();

        ticketTableBody.innerHTML = "";

        tickets.forEach(ticket => {

            addRow(ticket);

        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load tickets from database."
        );

    }

}


// ------------------------------------
// ADD ROW
// ------------------------------------

function addRow(ticket) {

    const row =
        ticketTableBody.insertRow();

    row.insertCell(0).textContent =
        ticket.ticket_id;

    row.insertCell(1).textContent =
        ticket.attendee_name ||
        getAttendeeName(ticket.attendee_id);

    row.insertCell(2).textContent =
        ticket.type_name ||
        getTicketTypeName(ticket.ticket_type_id);

    row.insertCell(3).textContent =
        ticket.purchase_date;

    row.insertCell(4).textContent =
        ticket.entry_date;

    row.insertCell(5).textContent =
        ticket.ticket_status;


    row.dataset.attendeeId =
        ticket.attendee_id;

    row.dataset.ticketTypeId =
        ticket.ticket_type_id;


    const actionCell =
        row.insertCell(6);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

}


// ------------------------------------
// OPEN ADD
// ------------------------------------

addTicketBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        ticketForm.reset();

        formError.textContent = "";

        try {
            document.getElementById("ticketId").value =
                await generateNextId("ticket");
        } catch (error) {
            console.error(error);
            alert("Could not generate Ticket ID.");
            return;
        }

        await Promise.all([
            loadAttendees(),
            loadTicketTypes()
        ]);

        document.querySelector(
            "#ticketModal h2"
        ).textContent =
            "Add Ticket";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Ticket";

        ticketModal.style.display =
            "flex";

    }
);


// ------------------------------------
// CLOSE
// ------------------------------------

closeModal.addEventListener(
    "click",
    function () {

        ticketModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === ticketModal) {

            ticketModal.style.display =
                "none";

        }

    }
);


// ------------------------------------
// ADD / UPDATE
// ------------------------------------

ticketForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const ticketId =
            document.getElementById(
                "ticketId"
            ).value.trim();

        const attendeeId =
            attendeeSelect.value;

        const ticketTypeId =
            ticketTypeSelect.value;

        const purchaseDate =
            document.getElementById(
                "purchaseDate"
            ).value;

        const entryDate =
            document.getElementById(
                "entryDate"
            ).value;

        const ticketStatus =
            document.getElementById(
                "ticketStatus"
            ).value;


        if (!attendeeId ||
            !ticketTypeId ||
            !purchaseDate ||
            !entryDate ||
            !ticketStatus) {

            formError.textContent =
                "Please fill all required fields.";

            return;

        }


        if (entryDate < purchaseDate) {

            formError.textContent =
                "Entry date cannot be before purchase date.";

            return;

        }


        formError.textContent = "";


        try {

            // --------------------------------
            // EDIT
            // --------------------------------

            if (editingRow !== null) {

                const oldTicketId =
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

                            old_ticket_id: oldTicketId,

                            ticket_id: ticketId,

                            attendee_id: attendeeId,

                            ticket_type_id: ticketTypeId,

                            purchase_date: purchaseDate,

                            entry_date: entryDate,

                            ticket_status: ticketStatus

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Ticket update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.ticket_id;

                editingRow.cells[1].textContent =
                    result.attendee_name;

                editingRow.cells[2].textContent =
                    result.type_name;

                editingRow.cells[3].textContent =
                    result.purchase_date;

                editingRow.cells[4].textContent =
                    result.entry_date;

                editingRow.cells[5].textContent =
                    result.ticket_status;


                editingRow.dataset.attendeeId =
                    result.attendee_id;

                editingRow.dataset.ticketTypeId =
                    result.ticket_type_id;


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

                            ticket_id: ticketId,

                            attendee_id: attendeeId,

                            ticket_type_id: ticketTypeId,

                            purchase_date: purchaseDate,

                            entry_date: entryDate,

                            ticket_status: ticketStatus

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Ticket insertion failed"
                    );

                }


                addRow(result);

            }


            ticketForm.reset();

            ticketModal.style.display =
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

ticketTableBody.addEventListener(
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

            const ticketId =
                row.cells[0].textContent;


            if (!confirm(
                "Are you sure you want to delete this ticket?"
            )) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${ticketId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Ticket deletion failed"
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
                loadAttendees(),
                loadTicketTypes()
            ]);


            document.getElementById(
                "ticketId"
            ).value =
                row.cells[0].textContent;


            attendeeSelect.value =
                row.dataset.attendeeId;


            ticketTypeSelect.value =
                row.dataset.ticketTypeId;


            document.getElementById(
                "purchaseDate"
            ).value =
                row.cells[3].textContent;


            document.getElementById(
                "entryDate"
            ).value =
                row.cells[4].textContent;


            document.getElementById(
                "ticketStatus"
            ).value =
                row.cells[5].textContent;


            formError.textContent = "";


            document.querySelector(
                "#ticketModal h2"
            ).textContent =
                "Edit Ticket";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            ticketModal.style.display =
                "flex";

        }

    }
);


// ------------------------------------
// INITIAL LOAD
// ------------------------------------

loadTickets();