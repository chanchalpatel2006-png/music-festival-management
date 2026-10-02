const API_URL = "http://localhost:3000/api/staff";

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
   LOAD STAFF
========================================================= */

async function loadStaff() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load staff.");
        }

        const staff =
            await response.json();

        recordTableBody.innerHTML = "";

        staff.forEach(function (member) {
            addRow(member);
        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load staff from database.\n" +
            error.message
        );
    }
}


/* =========================================================
   ADD ROW
========================================================= */

function addRow(staff) {

    const row =
        recordTableBody.insertRow();

    row.insertCell(0).textContent =
        staff.staff_id;

    row.insertCell(1).textContent =
        staff.staff_name;

    row.insertCell(2).textContent =
        staff.role;

    row.insertCell(3).textContent =
        staff.phone;

    row.insertCell(4).textContent =
        staff.email;

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
            document.getElementById("staff_id").value =
                await generateNextId("staff");
        } catch (error) {
            console.error(error);
            alert("Could not generate Staff ID.");
            return;
        }

        modalTitle.textContent =
            "Add Staff";

        saveBtn.textContent =
            "Add Staff";

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
   ADD / UPDATE STAFF
========================================================= */

recordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const staff_id =
            document.getElementById(
                "staff_id"
            ).value.trim();

        const staff_name =
            document.getElementById(
                "staff_name"
            ).value.trim();

        const role =
            document.getElementById(
                "role"
            ).value;

        const phone =
            document.getElementById(
                "phone"
            ).value.trim();

        const email =
            document.getElementById(
                "email"
            ).value.trim();


        /* =========================
           VALIDATION
        ========================= */

        if (
            !staff_id ||
            !staff_name ||
            !role ||
            !phone ||
            !email
        ) {

            formError.textContent =
                "Please fill all required fields.";

            return;
        }


        if (!email.includes("@")) {

            formError.textContent =
                "Email must contain @.";

            return;
        }


        formError.textContent = "";


        try {

            /* =========================
               UPDATE
            ========================= */

            if (editingRow !== null) {

                const oldStaffId =
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

                            old_staff_id:
                                oldStaffId,

                            staff_id:
                                staff_id,

                            staff_name:
                                staff_name,

                            role:
                                role,

                            phone:
                                phone,

                            email:
                                email

                        })
                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Staff update failed."
                    );
                }


                editingRow.cells[0].textContent =
                    result.staff_id;

                editingRow.cells[1].textContent =
                    result.staff_name;

                editingRow.cells[2].textContent =
                    result.role;

                editingRow.cells[3].textContent =
                    result.phone;

                editingRow.cells[4].textContent =
                    result.email;
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

                            staff_id:
                                staff_id,

                            staff_name:
                                staff_name,

                            role:
                                role,

                            phone:
                                phone,

                            email:
                                email

                        })
                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Staff insertion failed."
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

            const staffId =
                row.cells[0].textContent;


            const confirmed =
                confirm(
                    "Are you sure you want to delete this staff member?"
                );


            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${staffId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Staff deletion failed."
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
                "staff_id"
            ).value =
                row.cells[0].textContent;


            document.getElementById(
                "staff_name"
            ).value =
                row.cells[1].textContent;


            document.getElementById(
                "role"
            ).value =
                row.cells[2].textContent;


            document.getElementById(
                "phone"
            ).value =
                row.cells[3].textContent;


            document.getElementById(
                "email"
            ).value =
                row.cells[4].textContent;


            formError.textContent = "";

            modalTitle.textContent =
                "Edit Staff";

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

loadStaff();