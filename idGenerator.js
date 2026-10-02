// ============================================================
// idGenerator.js
// Automatically generates the next ID for any table.
//
// Usage:
//     const newId = await generateNextId("artists");
//     input.value = newId;
// ============================================================

const ID_API = "http://localhost:3000/api";


// ------------------------------------------------------------
// ID configuration for all tables
//
// url      = API endpoint that returns all records
// idField  = ID field returned by the API
// maxLen   = maximum length of the ID in PostgreSQL
// prefix   = default prefix used when the table is empty
// ------------------------------------------------------------

const ID_CONFIG = {

    manager: {
        url: `${ID_API}/manager`,
        idField: "manager_id",
        maxLen: 5,
        prefix: "MN"
    },

    genre: {
        url: `${ID_API}/genre`,
        idField: "genre_id",
        maxLen: 4,
        prefix: "GN"
    },

    artists: {
        url: `${ID_API}/artists`,
        idField: "artist_id",
        maxLen: 5,
        prefix: "AR"
    },

    artist_member: {
        url: `${ID_API}/artist_member`,
        idField: "member_id",
        maxLen: 6,
        prefix: "MB"
    },

    venue: {
        url: `${ID_API}/venue`,
        idField: "venue_id",
        maxLen: 6,
        prefix: "VN"
    },

    event: {
        url: `${ID_API}/event`,
        idField: "event_id",
        maxLen: 6,
        prefix: "EV"
    },

    stage: {
        url: `${ID_API}/stage`,
        idField: "stage_id",
        maxLen: 6,
        prefix: "ST"
    },

    song: {
        url: `${ID_API}/song`,
        idField: "song_id",
        maxLen: 6,
        prefix: "SG"
    },

    performance: {
        url: `${ID_API}/performance`,
        idField: "performance_id",
        maxLen: 6,
        prefix: "PF"
    },

    setlist: {
        url: `${ID_API}/setlist`,
        idField: "setlist_id",
        maxLen: 6,
        prefix: "SL"
    },

    attendee: {
        url: `${ID_API}/attendee`,
        idField: "attendee_id",
        maxLen: 8,
        prefix: "AT"
    },

    ticket_type: {
        url: `${ID_API}/ticket-type`,
        idField: "ticket_type_id",
        maxLen: 4,
        prefix: "TT"
    },

    ticket: {
        url: `${ID_API}/ticket`,
        idField: "ticket_id",
        maxLen: 8,
        prefix: "TK"
    },

    payment: {
        url: `${ID_API}/payment`,
        idField: "payment_id",
        maxLen: 8,
        prefix: "PM"
    },

    vendor: {
        url: `${ID_API}/vendor`,
        idField: "vendor_id",
        maxLen: 4,
        prefix: "VD"
    },

    stall: {
        url: `${ID_API}/stall`,
        idField: "stall_id",
        maxLen: 4,
        prefix: "SL"
    },

    stall_setup: {
        url: `${ID_API}/stall-setup`,
        idField: "setup_id",
        maxLen: 6,
        prefix: "SU"
    },

    sponsor: {
        url: `${ID_API}/sponsor`,
        idField: "sponsor_id",
        maxLen: 6,
        prefix: "SP"
    },

    staff: {
        url: `${ID_API}/staff`,
        idField: "staff_id",
        maxLen: 6,
        prefix: "SF"
    },

    staff_assignment: {
        url: `${ID_API}/staff-assignment`,
        idField: "assignment_id",
        maxLen: 6,
        prefix: "AS"
    }
};


// ------------------------------------------------------------
// Generate the next ID
// ------------------------------------------------------------

async function generateNextId(tableKey) {

    const config = ID_CONFIG[tableKey];

    if (!config) {
        throw new Error(
            `No ID configuration found for table "${tableKey}".`
        );
    }

    // Get all existing records from the backend
    const response = await fetch(config.url);

    if (!response.ok) {
        throw new Error(
            `Could not load existing ${tableKey} records.`
        );
    }

    const rows = await response.json();


    // Default values if the table is empty
    let prefix = config.prefix;
    let width = config.maxLen - config.prefix.length;
    let maxNumber = 0;


    // Look through all existing IDs
    rows.forEach(row => {

        const id = String(row[config.idField] || "").trim();

        // Example:
        // AR001 -> prefix = AR, number = 001
        // AT000009 -> prefix = AT, number = 000009

        const match = /^([A-Za-z]*)(\d+)$/.exec(id);

        if (!match) {
            return;
        }

        const existingPrefix = match[1];
        const numberPart = match[2];

        const number = parseInt(numberPart, 10);

        if (number > maxNumber) {
            maxNumber = number;
            prefix = existingPrefix;
            width = numberPart.length;
        }
    });


    // Generate the next number
    const nextNumber = maxNumber + 1;

    const newId =
        prefix + String(nextNumber).padStart(width, "0");


    // Make sure it fits in the PostgreSQL column
    if (newId.length > config.maxLen) {
        throw new Error(
            `Next ID "${newId}" is longer than the ` +
            `${config.maxLen} characters allowed for this table.`
        );
    }

    return newId;
}