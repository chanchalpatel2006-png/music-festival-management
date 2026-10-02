const API_URL = "http://localhost:3000/api/sponsor-demand";

const form = document.getElementById("recordForm");
const modal = document.getElementById("recordModal");
const modalTitle = document.getElementById("modalTitle");
const tableBody = document.getElementById("recordTableBody");
const formError = document.getElementById("formError");

const sponsorSelect = document.getElementById("sponsor_id");
const demandType = document.getElementById("demand_type");

let demands = [];


// ===============================
// MODAL
// ===============================

document.getElementById("addRecordBtn").addEventListener("click", async () => {

    form.reset();

    modalTitle.textContent = "Add Sponsor Demand";

    document.getElementById("saveBtn").textContent =
        "Add Sponsor Demand";

    formError.textContent = "";

    await loadSponsors();

    modal.style.display = "flex";
});


document.getElementById("closeModal").addEventListener("click", () => {
    closeModal();
});


window.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeModal();
    }

});


function closeModal() {

    modal.style.display = "none";

    form.reset();

    formError.textContent = "";
}


// ===============================
// LOAD SPONSORS
// ===============================

async function loadSponsors(selectedSponsorId = "") {

    try {

        const response = await fetch(
            "http://localhost:3000/api/sponsor"
        );

        if (!response.ok) {
            throw new Error("Unable to load sponsors.");
        }

        const sponsors = await response.json();

        sponsorSelect.innerHTML = `
            <option value="">
                Select Sponsor
            </option>
        `;

        sponsors.forEach(sponsor => {

            const option = document.createElement("option");

            option.value = sponsor.sponsor_id;

            option.textContent =
                `${sponsor.sponsor_name} (${sponsor.sponsor_id})`;

            sponsorSelect.appendChild(option);

        });

        if (selectedSponsorId) {
            sponsorSelect.value = selectedSponsorId;
        }

    } catch (error) {

        console.error(error);

        sponsorSelect.innerHTML = `
            <option value="">
                Unable to load sponsors
            </option>
        `;
    }
}


// ===============================
// LOAD DEMANDS
// ===============================

async function loadDemands() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load sponsor demands.");
        }

        demands = await response.json();

        renderTable();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    Unable to load sponsor demand records.
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

    demands.forEach(demand => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${demand.sponsor_id}</td>

            <td>${demand.demand_type}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editDemand(
                        '${demand.sponsor_id}',
                        '${demand.demand_type}'
                    )"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteDemand(
                        '${demand.sponsor_id}',
                        '${demand.demand_type}'
                    )"
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

window.editDemand = async function (
    sponsorId,
    demand
) {

    const record = demands.find(item =>
        item.sponsor_id === sponsorId &&
        item.demand_type === demand
    );

    if (!record) {
        return;
    }

    window.oldSponsorId = record.sponsor_id;
    window.oldDemandType = record.demand_type;

    form.reset();

    modalTitle.textContent =
        "Edit Sponsor Demand";

    document.getElementById("saveBtn").textContent =
        "Update Sponsor Demand";

    formError.textContent = "";

    await loadSponsors(record.sponsor_id);

    demandType.value = record.demand_type;

    modal.style.display = "flex";
};

// ===============================
// DELETE
// ===============================

window.deleteDemand = async function (
    sponsorId,
    demand
) {

    if (
        !confirm(
            "Are you sure you want to delete this sponsor demand?"
        )
    ) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${encodeURIComponent(sponsorId)}/${encodeURIComponent(demand)}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.error ||
                "Unable to delete sponsor demand."
            );

            return;
        }

        await loadDemands();

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

    formError.textContent = "";

    const sponsorId = sponsorSelect.value;

    const demand = demandType.value;


    if (!sponsorId) {

        formError.textContent =
            "Please select a sponsor.";

        return;
    }


    if (!demand) {

        formError.textContent =
            "Please select a demand type.";

        return;
    }


    const record = {

        sponsor_id: sponsorId,

        demand_type: demand
    };


    try {

        const existingRecord = demands.find(item =>
            item.sponsor_id === sponsorId &&
            item.demand_type === demand
        );


        let response;


        // UPDATE

        if (
            modalTitle.textContent ===
            "Edit Sponsor Demand"
        ) {

            /*
             * Sponsor ID + demand type are the
             * composite primary key.
             *
             * The update route uses the old
             * sponsor ID and old demand type.
             */

            record.old_sponsor_id =
                window.oldSponsorId;

            record.old_demand_type =
                window.oldDemandType;

            response = await fetch(API_URL, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(record)
            });

        }


        // INSERT

        else {

            if (existingRecord) {

                formError.textContent =
                    "This sponsor already has this demand type.";

                return;
            }

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

            formError.textContent =
                data.error ||
                "Unable to save sponsor demand.";

            return;
        }


        closeModal();

        await loadDemands();

    } catch (error) {

        console.error(error);

        formError.textContent =
            "Server error.";
    }

});


// ===============================
// INITIAL LOAD
// ===============================

loadDemands();