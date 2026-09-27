const config = window.pageConfig;

const addBtn =
    document.getElementById("addRecordBtn");

const modal =
    document.getElementById("recordModal");

const closeBtn =
    document.getElementById("closeModal");

const form =
    document.getElementById("recordForm");

const tableBody =
    document.getElementById("recordTableBody");

const formError =
    document.getElementById("formError");

const modalTitle =
    document.getElementById("modalTitle");

const saveBtn =
    document.getElementById("saveBtn");


let editingRow = null;


// OPEN ADD FORM

addBtn.addEventListener("click", function () {

    editingRow = null;

    form.reset();

    formError.textContent = "";

    modalTitle.textContent =
        "Add " + config.name;

    saveBtn.textContent =
        "Add " + config.name;

    modal.style.display = "flex";

});


// CLOSE FORM

function closeForm() {

    modal.style.display = "none";

    editingRow = null;

    formError.textContent = "";

}


closeBtn.addEventListener("click", closeForm);


modal.addEventListener("click", function (event) {

    if (event.target === modal) {

        closeForm();

    }

});


// ADD / EDIT

form.addEventListener("submit", function (event) {

    event.preventDefault();


    const values = {};


    config.fields.forEach(function (field) {

        values[field] =
            document.getElementById(field).value.trim();

    });


    // CHECK PRIMARY KEY

    const rows =
        tableBody.querySelectorAll("tr");


    for (const row of rows) {

        if (row === editingRow) {
            continue;
        }


        if (
            config.primaryKey.some(function (field, index) {

                const columnIndex =
                    config.fields.indexOf(field);

                return row.cells[columnIndex].textContent !==
                       values[field];

            }) === false
        ) {

            formError.textContent =
                "A record with this primary key already exists.";

            return;

        }

    }


    // PAGE-SPECIFIC VALIDATION

    const error =
        config.validate(values, rows, editingRow);


    if (error) {

        formError.textContent = error;

        return;

    }


    formError.textContent = "";


    // EDIT

    if (editingRow) {

        config.fields.forEach(function (field, index) {

            editingRow.cells[index].textContent =
                values[field];

        });

    }


    // ADD

    else {

        const row =
            tableBody.insertRow();


        config.fields.forEach(function (field) {

            row.insertCell().textContent =
                values[field];

        });


        const actionCell =
            row.insertCell();


        actionCell.innerHTML = `
            <button type="button" class="edit-btn">
                Edit
            </button>

            <button type="button" class="delete-btn">
                Delete
            </button>
        `;

    }


    form.reset();

    closeForm();

});


// EDIT / DELETE

tableBody.addEventListener("click", function (event) {

    const button =
        event.target.closest("button");


    if (!button) {
        return;
    }


    const row =
        button.closest("tr");


    // DELETE

    if (button.classList.contains("delete-btn")) {

        if (
            confirm(
                "Are you sure you want to delete this record?"
            )
        ) {

            row.remove();

        }

        return;

    }


    // EDIT

    if (button.classList.contains("edit-btn")) {

        editingRow = row;


        config.fields.forEach(function (field, index) {

            document.getElementById(field).value =
                row.cells[index].textContent;

        });


        formError.textContent = "";


        modalTitle.textContent =
            "Edit " + config.name;


        saveBtn.textContent =
            "Save Changes";


        modal.style.display = "flex";

    }

});