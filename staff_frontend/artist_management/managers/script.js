const API_URL = "http://localhost:3000/api/manager";

const addManagerBtn = document.getElementById("addManagerBtn");
const managerModal = document.getElementById("managerModal");
const closeModal = document.getElementById("closeModal");

const managerForm = document.getElementById("managerForm");
const managerTableBody = document.getElementById("managerTableBody");

let editingRow = null;
let editingManagerId = null;


// ------------------------------------
// LOAD MANAGERS FROM DATABASE
// ------------------------------------

async function loadManagers() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load managers");
        }

        const managers = await response.json();

        managerTableBody.innerHTML = "";

        managers.forEach(manager => {
            addRow(manager);
        });

    } catch (error) {

        console.error(error);
        alert("Could not load managers from database.");

    }
}


// ------------------------------------
// ADD ROW TO TABLE
// ------------------------------------

function addRow(manager) {

    const row = managerTableBody.insertRow();

    row.insertCell(0).textContent = manager.manager_id;
    row.insertCell(1).textContent = manager.manager_name;
    row.insertCell(2).textContent = manager.phone;
    row.insertCell(3).textContent = manager.email;

    const actionCell = row.insertCell(4);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


// ------------------------------------
// OPEN ADD MANAGER POPUP
// ------------------------------------

addManagerBtn.addEventListener("click", function () {

    editingRow = null;
    editingManagerId = null;

    managerForm.reset();

    document.querySelector("#managerModal h2").textContent =
        "Add Manager";

    document.querySelector(".save-btn").textContent =
        "Add Manager";

    managerModal.style.display = "flex";
});


// ------------------------------------
// CLOSE POPUP
// ------------------------------------

closeModal.addEventListener("click", function () {
    managerModal.style.display = "none";
});


window.addEventListener("click", function (event) {

    if (event.target === managerModal) {
        managerModal.style.display = "none";
    }

});


// ------------------------------------
// ADD / UPDATE MANAGER
// ------------------------------------

managerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const managerId =
        document.getElementById("managerId").value.trim();

    const managerName =
        document.getElementById("managerName").value.trim();

    const managerPhone =
        document.getElementById("managerPhone").value.trim();

    const managerEmail =
        document.getElementById("managerEmail").value.trim();


    try {

        // ====================================
        // UPDATE EXISTING MANAGER
        // ====================================

        if (editingRow !== null) {

            const response = await fetch(API_URL, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    old_manager_id: editingManagerId,

                    manager_id: managerId,
                    manager_name: managerName,
                    phone: managerPhone,
                    email: managerEmail

                })

            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Manager update failed"
                );
            }


            editingRow.cells[0].textContent = managerId;
            editingRow.cells[1].textContent = managerName;
            editingRow.cells[2].textContent = managerPhone;
            editingRow.cells[3].textContent = managerEmail;


            editingRow = null;
            editingManagerId = null;

        }


        // ====================================
        // ADD NEW MANAGER
        // ====================================

        else {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    manager_id: managerId,
                    manager_name: managerName,
                    phone: managerPhone,
                    email: managerEmail

                })

            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Manager insertion failed"
                );
            }


            addRow(result);

        }


        managerForm.reset();

        managerModal.style.display = "none";


    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});


// ------------------------------------
// EDIT + DELETE
// ------------------------------------

managerTableBody.addEventListener("click", async function (event) {

    const clickedButton = event.target;


    // ====================================
    // DELETE
    // ====================================

    if (clickedButton.classList.contains("delete-btn")) {

        const row = clickedButton.closest("tr");

        const managerId = row.cells[0].textContent;


        const confirmDelete = confirm(
            `Are you sure you want to delete manager ${managerId}?`
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/${managerId}`,
                {
                    method: "DELETE"
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Manager deletion failed"
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

    if (clickedButton.classList.contains("edit-btn")) {

        const row = clickedButton.closest("tr");

        editingRow = row;

        editingManagerId =
            row.cells[0].textContent;


        document.getElementById("managerId").value =
            row.cells[0].textContent;

        document.getElementById("managerName").value =
            row.cells[1].textContent;

        document.getElementById("managerPhone").value =
            row.cells[2].textContent;

        document.getElementById("managerEmail").value =
            row.cells[3].textContent;


        document.querySelector("#managerModal h2").textContent =
            "Edit Manager";

        document.querySelector(".save-btn").textContent =
            "Save Changes";


        managerModal.style.display = "flex";

    }

});


// ------------------------------------
// LOAD DATA WHEN PAGE OPENS
// ------------------------------------

loadManagers();