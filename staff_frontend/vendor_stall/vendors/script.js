const API_URL = "http://localhost:3000/api/vendor";

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
   LOAD VENDORS
========================================================= */

async function loadVendors() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load vendors"
            );
        }

        const vendors =
            await response.json();

        recordTableBody.innerHTML = "";

        vendors.forEach(vendor => {
            addRow(vendor);
        });

    } catch (error) {

        console.error(error);

        alert(
            "Could not load vendors from database."
        );

    }

}


/* =========================================================
   ADD ROW
========================================================= */

function addRow(vendor) {

    const row =
        recordTableBody.insertRow();

    row.insertCell(0).textContent =
        vendor.vendor_id;

    row.insertCell(1).textContent =
        vendor.vendor_name;

    row.insertCell(2).textContent =
        vendor.phone;

    row.insertCell(3).textContent =
        vendor.email;

    row.insertCell(4).textContent =
        vendor.vendor_type;

    const actionCell =
        row.insertCell(5);

    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
}


/* =========================================================
   OPEN ADD MODAL
========================================================= */

/* =========================================================
   OPEN ADD MODAL
========================================================= */

addRecordBtn.addEventListener("click", async function () {

    editingRow = null;

    recordForm.reset();

    try {
        document.getElementById("vendor_id").value =
            await generateNextId("vendor");
    } catch (error) {
        console.error(error);
        alert("Could not generate Vendor ID.");
        return;
    }

    modalTitle.textContent =
        "Add Vendor";

    saveBtn.textContent =
        "Add Vendor";

    recordModal.style.display =
        "flex";
});

/* =========================================================
   CLOSE MODAL
========================================================= */

closeModal.addEventListener(
    "click",
    function () {

        recordModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === recordModal) {

            recordModal.style.display =
                "none";

        }

    }
);


/* =========================================================
   ADD / UPDATE VENDOR
========================================================= */

recordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const vendor_id =
            document.getElementById(
                "vendor_id"
            ).value.trim();

        const vendor_name =
            document.getElementById(
                "vendor_name"
            ).value.trim();

        const phone =
            document.getElementById(
                "phone"
            ).value.trim();

        const email =
            document.getElementById(
                "email"
            ).value.trim();

        const vendor_type =
            document.getElementById(
                "vendor_type"
            ).value;


        /* -----------------------------------------
           VALIDATION
        ----------------------------------------- */

        if (
            !vendor_id ||
            !vendor_name ||
            !phone ||
            !email ||
            !vendor_type
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

            /* -----------------------------------------
               UPDATE
            ----------------------------------------- */

            if (editingRow !== null) {

                const oldVendorId =
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

                            old_vendor_id:
                                oldVendorId,

                            vendor_id:
                                vendor_id,

                            vendor_name:
                                vendor_name,

                            phone:
                                phone,

                            email:
                                email,

                            vendor_type:
                                vendor_type

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Vendor update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.vendor_id;

                editingRow.cells[1].textContent =
                    result.vendor_name;

                editingRow.cells[2].textContent =
                    result.phone;

                editingRow.cells[3].textContent =
                    result.email;

                editingRow.cells[4].textContent =
                    result.vendor_type;


                editingRow = null;

            }


            /* -----------------------------------------
               INSERT
            ----------------------------------------- */

            else {

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            vendor_id:
                                vendor_id,

                            vendor_name:
                                vendor_name,

                            phone:
                                phone,

                            email:
                                email,

                            vendor_type:
                                vendor_type

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Vendor insertion failed"
                    );

                }


                addRow(result);

            }


            recordForm.reset();

            recordModal.style.display =
                "none";


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


        /* -----------------------------------------
           DELETE
        ----------------------------------------- */

        if (
            event.target.classList
                .contains("delete-btn")
        ) {

            const vendorId =
                row.cells[0]
                    .textContent;


            if (
                !confirm(
                    "Are you sure you want to delete this vendor?"
                )
            ) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${vendorId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Vendor deletion failed"
                    );

                }


                row.remove();


            } catch (error) {

                console.error(error);

                alert(error.message);

            }

        }


        /* -----------------------------------------
           EDIT
        ----------------------------------------- */

        if (
            event.target.classList
                .contains("edit-btn")
        ) {

            editingRow = row;


            document.getElementById(
                "vendor_id"
            ).value =
                row.cells[0]
                    .textContent;


            document.getElementById(
                "vendor_name"
            ).value =
                row.cells[1]
                    .textContent;


            document.getElementById(
                "phone"
            ).value =
                row.cells[2]
                    .textContent;


            document.getElementById(
                "email"
            ).value =
                row.cells[3]
                    .textContent;


            document.getElementById(
                "vendor_type"
            ).value =
                row.cells[4]
                    .textContent;


            formError.textContent = "";


            modalTitle.textContent =
                "Edit Vendor";

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

loadVendors();