const API_URL = "http://localhost:3000/api/staff-assignment";

const form = document.getElementById("recordForm");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const tableBody = document.getElementById("tableBody");
const errorMessage = document.getElementById("errorMessage");

const assignmentId = document.getElementById("assignment_id");
const oldAssignmentId = document.getElementById("old_assignment_id");

const staffSelect = document.getElementById("staff_id");
const stageSelect = document.getElementById("stage_id");
const eventSelect = document.getElementById("event_id");

const shiftStart = document.getElementById("shift_start");
const shiftEnd = document.getElementById("shift_end");

let assignments = [];


// ===============================
// MODAL
// ===============================

document.getElementById("addBtn").addEventListener("click", () => {
    openAddModal();
});

document.getElementById("closeModal").addEventListener("click", () => {
    closeModal();
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

async function openAddModal() {

    form.reset();

    oldAssignmentId.value = "";

    modalTitle.textContent = "Add Assignment";

    try {
        assignmentId.value =
            await generateNextId("staff_assignment");
    } catch (error) {
        console.error(error);
        alert("Could not generate Assignment ID.");
        return;
    }

    errorMessage.textContent = "";

    stageSelect.innerHTML = `
        <option value="">No Stage</option>
    `;

    loadStaff();
    loadAllEvents();
    loadAllStages();

    modal.style.display = "flex";
}


function openEditModal(record) {

    form.reset();

    oldAssignmentId.value = record.assignment_id;

    assignmentId.value = record.assignment_id;

    modalTitle.textContent = "Edit Assignment";

    errorMessage.textContent = "";

    loadStaff().then(() => {
        staffSelect.value = record.staff_id;
    });

    loadAllEvents().then(() => {
        eventSelect.value = record.event_id;
    });

    loadAllStages().then(() => {
        stageSelect.value = record.stage_id || "";
    });

    shiftStart.value = formatDateTimeForInput(record.shift_start);
    shiftEnd.value = formatDateTimeForInput(record.shift_end);

    modal.style.display = "flex";
}


function closeModal() {
    modal.style.display = "none";
}


// ===============================
// LOAD STAFF
// ===============================

async function loadStaff() {

    const response = await fetch("http://localhost:3000/api/staff");

    if (!response.ok) {
        throw new Error("Unable to load staff");
    }

    const data = await response.json();

    staffSelect.innerHTML = `
        <option value="">Select Staff</option>
    `;

    data.forEach(staff => {

        const option = document.createElement("option");

        option.value = staff.staff_id;

        option.textContent =
            `${staff.staff_name} (${staff.staff_id})`;

        staffSelect.appendChild(option);
    });
}


// ===============================
// LOAD ALL EVENTS
// ===============================

async function loadAllEvents() {

    const response = await fetch(
        "http://localhost:3000/api/event"
    );

    if (!response.ok) {
        throw new Error("Unable to load events");
    }

    const data = await response.json();

    setEventOptions(data);
}


// ===============================
// LOAD ALL STAGES
// ===============================

async function loadAllStages() {

    const response = await fetch(
        "http://localhost:3000/api/stage"
    );

    if (!response.ok) {
        throw new Error("Unable to load stages");
    }

    const data = await response.json();

    setStageOptions(data);
}


// ===============================
// SET EVENT OPTIONS
// ===============================

function setEventOptions(events, selectedValue = "") {

    eventSelect.innerHTML = `
        <option value="">Select Event</option>
    `;

    events.forEach(event => {

        const option = document.createElement("option");

        option.value = event.event_id;

        option.textContent =
            `${event.event_name} (${event.event_id})`;

        eventSelect.appendChild(option);
    });

    if (selectedValue) {
        eventSelect.value = selectedValue;
    }
}


// ===============================
// SET STAGE OPTIONS
// ===============================

function setStageOptions(stages, selectedValue = "") {

    stageSelect.innerHTML = `
        <option value="">No Stage</option>
    `;

    stages.forEach(stage => {

        const option = document.createElement("option");

        option.value = stage.stage_id;

        option.textContent =
            `${stage.stage_name} (${stage.stage_id})`;

        stageSelect.appendChild(option);
    });

    if (selectedValue) {
        stageSelect.value = selectedValue;
    }
}


// ===============================
// EVENT → STAGE
// ===============================

eventSelect.addEventListener("change", async () => {

    const eventId = eventSelect.value;

    if (!eventId) {

        await loadAllStages();

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/event/${eventId}/stages`
        );

        if (!response.ok) {
            throw new Error("Unable to load stages for event");
        }

        const stages = await response.json();

        const currentStage = stageSelect.value;

        setStageOptions(stages);

        /*
         * Keep the current stage if it is valid
         * for the selected event.
         */
        if (
            currentStage &&
            stages.some(stage => stage.stage_id === currentStage)
        ) {
            stageSelect.value = currentStage;
        }

        /*
         * If only one stage is available,
         * select it automatically.
         */
        if (stages.length === 1) {
            stageSelect.value = stages[0].stage_id;
        }

    } catch (error) {

        errorMessage.textContent =
            "Unable to load stages for this event.";

        console.error(error);
    }
});


// ===============================
// STAGE → EVENT
// ===============================

stageSelect.addEventListener("change", async () => {

    const stageId = stageSelect.value;

    /*
     * "No Stage" selected.
     * Restore all events.
     */
    if (!stageId) {

        await loadAllEvents();

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/stage/${stageId}/events`
        );

        if (!response.ok) {
            throw new Error("Unable to load events for stage");
        }

        const events = await response.json();

        const currentEvent = eventSelect.value;

        setEventOptions(events);

        /*
         * Keep current event if it is valid
         * for the selected stage.
         */
        if (
            currentEvent &&
            events.some(event => event.event_id === currentEvent)
        ) {
            eventSelect.value = currentEvent;
        }

        /*
         * If only one event is available,
         * select it automatically.
         */
        if (events.length === 1) {
            eventSelect.value = events[0].event_id;
        }

    } catch (error) {

        errorMessage.textContent =
            "Unable to load events for this stage.";

        console.error(error);
    }
});


// ===============================
// LOAD ASSIGNMENTS
// ===============================

async function loadAssignments() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load assignments");
        }

        assignments = await response.json();

        renderTable();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load assignment records.
                </td>
            </tr>
        `;
    }
}


// ===============================
// RENDER TABLE
// ===============================

function renderTable() {

    tableBody.innerHTML = "";

    assignments.forEach(record => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.assignment_id}</td>

            <td>
                ${record.staff_id}
            </td>

            <td>
                ${record.stage_id || "-"}
            </td>

            <td>
                ${record.event_id}
            </td>

            <td>
                ${formatDateTime(record.shift_start)}
            </td>

            <td>
                ${formatDateTime(record.shift_end)}
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editAssignment('${record.assignment_id}')"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteAssignment('${record.assignment_id}')"
                >
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ===============================
// EDIT
// ===============================

window.editAssignment = function(id) {

    const record = assignments.find(
        item => item.assignment_id === id
    );

    if (record) {
        openEditModal(record);
    }
};


// ===============================
// DELETE
// ===============================

window.deleteAssignment = async function(id) {

    if (!confirm("Are you sure you want to delete this assignment?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Unable to delete assignment.");
            return;
        }

        loadAssignments();

    } catch (error) {

        console.error(error);

        alert("Server error.");
    }
};


// ===============================
// ADD / UPDATE
// ===============================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    errorMessage.textContent = "";

    const start = new Date(shiftStart.value);
    const end = new Date(shiftEnd.value);

    if (end <= start) {

        errorMessage.textContent =
            "Shift End must be after Shift Start.";

        return;
    }


    /*
     * If a stage is selected, verify that
     * the selected event and stage have a
     * performance relationship.
     */

    if (stageSelect.value && eventSelect.value) {

        try {

            const response = await fetch(
                `http://localhost:3000/api/event/${eventSelect.value}/stages`
            );

            const stages = await response.json();

            const valid = stages.some(
                stage => stage.stage_id === stageSelect.value
            );

            if (!valid) {

                errorMessage.textContent =
                    "Selected stage is not associated with the selected event.";

                return;
            }

        } catch (error) {

            errorMessage.textContent =
                "Unable to verify event and stage.";

            return;
        }
    }


    const record = {

        assignment_id: assignmentId.value.trim(),

        staff_id: staffSelect.value,

        stage_id: stageSelect.value || null,

        event_id: eventSelect.value,

        shift_start: shiftStart.value,

        shift_end: shiftEnd.value
    };


    try {

        let response;

        if (oldAssignmentId.value) {

            record.old_assignment_id =
                oldAssignmentId.value;

            response = await fetch(API_URL, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(record)
            });

        } else {

            response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(record)
            });
        }


        const data = await response.json();


        if (!response.ok) {

            errorMessage.textContent =
                data.error || "Unable to save assignment.";

            return;
        }


        closeModal();

        loadAssignments();


    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Server error.";
    }
});


// ===============================
// DATE / TIME
// ===============================

function formatDateTime(value) {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}


function formatDateTimeForInput(value) {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    const hours = String(
        date.getHours()
    ).padStart(2, "0");

    const minutes = String(
        date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}


// ===============================
// INITIAL LOAD
// ===============================

loadStaff();
loadAllEvents();
loadAllStages();
loadAssignments();