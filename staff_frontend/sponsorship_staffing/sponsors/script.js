const API_URL = "http://localhost:3000/api/sponsor";

const form = document.getElementById("recordForm");
const modal = document.getElementById("recordModal");
const modalTitle = document.getElementById("modalTitle");
const tableBody = document.getElementById("recordTableBody");
const formError = document.getElementById("formError");

const sponsorId = document.getElementById("sponsor_id");
const sponsorName = document.getElementById("sponsor_name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const sponsorshipType = document.getElementById("sponsorship_type");
const sponsorshipTier = document.getElementById("sponsorship_tier");
const sponsorshipAmount = document.getElementById("sponsorship_amount");

let sponsors = [];

let editingId = "";


// ===============================
// MODAL
// ===============================

document.getElementById("addRecordBtn").addEventListener("click", () => {
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

    editingId = "";

    sponsorId.disabled = false;

    formError.textContent = "";

    try {
        document.getElementById("sponsor_id").value =
            await generateNextId("sponsor");
    } catch (error) {
        console.error(error);
        alert("Could not generate Sponsor ID.");
        return;
    }

    modalTitle.textContent =
        "Add Sponsor";

    document.getElementById("saveBtn").textContent =
        "Add Sponsor";

    modal.style.display =
        "flex";
}


function openEditModal(sponsor) {

    editingId = sponsor.sponsor_id;

    sponsorId.value = sponsor.sponsor_id;
    sponsorName.value = sponsor.sponsor_name;
    phone.value = sponsor.phone;
    email.value = sponsor.email;
    sponsorshipType.value = sponsor.sponsorship_type;
    sponsorshipTier.value = sponsor.sponsorship_tier;

    sponsorshipAmount.value =
        sponsor.sponsorship_amount ?? "";

    sponsorId.disabled = true;

    modalTitle.textContent = "Edit Sponsor";

    document.getElementById("saveBtn").textContent =
        "Update Sponsor";

    formError.textContent = "";

    modal.style.display = "flex";
}


function closeModal() {

    modal.style.display = "none";

    form.reset();

    sponsorId.disabled = false;

    editingId = "";

    formError.textContent = "";
}


// ===============================
// LOAD SPONSORS
// ===============================

async function loadSponsors() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load sponsors.");
        }

        sponsors = await response.json();

        renderTable();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to load sponsor records.
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

    sponsors.forEach(sponsor => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sponsor.sponsor_id}</td>

            <td>${sponsor.sponsor_name}</td>

            <td>${sponsor.phone}</td>

            <td>${sponsor.email}</td>

            <td>${sponsor.sponsorship_type}</td>

            <td>${sponsor.sponsorship_tier}</td>

            <td>
                ${
                    sponsor.sponsorship_amount !== null &&
                    sponsor.sponsorship_amount !== undefined
                        ? sponsor.sponsorship_amount
                        : "-"
                }
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editSponsor('${sponsor.sponsor_id}')"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteSponsor('${sponsor.sponsor_id}')"
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

window.editSponsor = function(id) {

    const sponsor = sponsors.find(
        item => item.sponsor_id === id
    );

    if (sponsor) {
        openEditModal(sponsor);
    }
};


// ===============================
// DELETE
// ===============================

window.deleteSponsor = async function(id) {

    if (
        !confirm(
            "Are you sure you want to delete this sponsor?"
        )
    ) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.error ||
                "Unable to delete sponsor."
            );

            return;
        }

        await loadSponsors();

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


    const amount = sponsorshipAmount.value.trim();


    // Email validation

    if (!email.value.includes("@")) {

        formError.textContent =
            "Email must contain @.";

        return;
    }


    // Amount validation

    if (amount !== "") {

        const numericAmount = Number(amount);

        if (
            isNaN(numericAmount) ||
            numericAmount < 0 ||
            numericAmount > 9999999999.99
        ) {

            formError.textContent =
                "Sponsorship amount must be between 0 and 9999999999.99.";

            return;
        }
    }


    const record = {

        sponsor_id: sponsorId.value.trim(),

        sponsor_name: sponsorName.value.trim(),

        phone: phone.value.trim(),

        email: email.value.trim(),

        sponsorship_type:
            sponsorshipType.value,

        sponsorship_tier:
            sponsorshipTier.value,

        sponsorship_amount:
            amount === "" ? null : Number(amount)
    };


    try {

        let response;


        // UPDATE

        if (editingId) {

            record.old_sponsor_id = editingId;

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
                "Unable to save sponsor.";

            return;
        }


        closeModal();

        await loadSponsors();


    } catch (error) {

        console.error(error);

        formError.textContent =
            "Server error.";
    }
});


// ===============================
// INITIAL LOAD
// ===============================

loadSponsors();