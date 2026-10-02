const API_URL = "http://localhost:3000/api/payment";

const addPaymentBtn =
    document.getElementById("addPaymentBtn");

const paymentModal =
    document.getElementById("paymentModal");

const closeModal =
    document.getElementById("closeModal");

const paymentForm =
    document.getElementById("paymentForm");

const paymentTableBody =
    document.getElementById("paymentTableBody");

const formError =
    document.getElementById("formError");

let editingRow = null;


/* =========================================================
   LOAD PAYMENTS
========================================================= */

async function loadPayments() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load payments"
            );

        }


        const payments =
            await response.json();


        paymentTableBody.innerHTML = "";


        payments.forEach(payment => {

            addRow(payment);

        });


    } catch (error) {

        console.error(error);

        alert(
            "Could not load payments from database."
        );

    }

}


/* =========================================================
   ADD ROW
========================================================= */

function addRow(payment) {

    const row =
        paymentTableBody.insertRow();


    row.insertCell(0).textContent =
        payment.payment_id;


    row.insertCell(1).textContent =
        payment.ticket_id;


    row.insertCell(2).textContent =
        Number(payment.amount).toFixed(2);


    row.insertCell(3).textContent =
        payment.payment_date;


    row.insertCell(4).textContent =
        payment.payment_method;


    row.insertCell(5).textContent =
        payment.payment_status;


    const actionCell =
        row.insertCell(6);


    actionCell.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

}


/* =========================================================
   OPEN ADD PAYMENT
========================================================= */

addPaymentBtn.addEventListener(
    "click",
    async function () {

        editingRow = null;

        paymentForm.reset();

        formError.textContent = "";

        try {
            document.getElementById("paymentId").value =
                await generateNextId("payment");
        } catch (error) {
            console.error(error);
            alert("Could not generate Payment ID.");
            return;
        }

        document.querySelector(
            "#paymentModal h2"
        ).textContent =
            "Add Payment";

        document.querySelector(
            ".save-btn"
        ).textContent =
            "Add Payment";

        paymentModal.style.display =
            "flex";
    }
);


/* =========================================================
   CLOSE MODAL
========================================================= */

closeModal.addEventListener(
    "click",
    function () {

        paymentModal.style.display =
            "none";

    }
);


window.addEventListener(
    "click",
    function (event) {

        if (event.target === paymentModal) {

            paymentModal.style.display =
                "none";

        }

    }
);


/* =========================================================
   ADD / UPDATE PAYMENT
========================================================= */

paymentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const paymentId =
            document.getElementById(
                "paymentId"
            ).value.trim();


        const ticketId =
            document.getElementById(
                "ticketId"
            ).value.trim();


        const amount =
            Number(
                document.getElementById(
                    "amount"
                ).value
            );


        const paymentDate =
            document.getElementById(
                "paymentDate"
            ).value;


        const paymentMethod =
            document.getElementById(
                "paymentMethod"
            ).value;


        const paymentStatus =
            document.getElementById(
                "paymentStatus"
            ).value;


        /* -----------------------------------------
           VALIDATION
        ----------------------------------------- */

        if (
            !paymentId ||
            !ticketId ||
            !paymentDate ||
            !paymentMethod ||
            !paymentStatus
        ) {

            formError.textContent =
                "Please fill all required fields.";

            return;

        }


        if (amount < 0) {

            formError.textContent =
                "Payment amount cannot be negative.";

            return;

        }


        formError.textContent = "";


        try {

            /* -----------------------------------------
               EDIT PAYMENT
            ----------------------------------------- */

            if (editingRow !== null) {

                const oldPaymentId =
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

                            old_payment_id:
                                oldPaymentId,

                            payment_id:
                                paymentId,

                            ticket_id:
                                ticketId,

                            amount:
                                amount,

                            payment_date:
                                paymentDate,

                            payment_method:
                                paymentMethod,

                            payment_status:
                                paymentStatus

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Payment update failed"
                    );

                }


                editingRow.cells[0].textContent =
                    result.payment_id;


                editingRow.cells[1].textContent =
                    result.ticket_id;


                editingRow.cells[2].textContent =
                    Number(
                        result.amount
                    ).toFixed(2);


                editingRow.cells[3].textContent =
                    result.payment_date;


                editingRow.cells[4].textContent =
                    result.payment_method;


                editingRow.cells[5].textContent =
                    result.payment_status;


                editingRow = null;

            }


            /* -----------------------------------------
               ADD PAYMENT
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

                            payment_id:
                                paymentId,

                            ticket_id:
                                ticketId,

                            amount:
                                amount,

                            payment_date:
                                paymentDate,

                            payment_method:
                                paymentMethod,

                            payment_status:
                                paymentStatus

                        })

                    });


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Payment insertion failed"
                    );

                }


                addRow(result);

            }


            paymentForm.reset();

            paymentModal.style.display =
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

paymentTableBody.addEventListener(
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

            const paymentId =
                row.cells[0]
                    .textContent;


            if (
                !confirm(
                    "Are you sure you want to delete this payment?"
                )
            ) {

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${paymentId}`,
                        {
                            method: "DELETE"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Payment deletion failed"
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
                "paymentId"
            ).value =
                row.cells[0]
                    .textContent;


            document.getElementById(
                "ticketId"
            ).value =
                row.cells[1]
                    .textContent;


            document.getElementById(
                "amount"
            ).value =
                row.cells[2]
                    .textContent;


            document.getElementById(
                "paymentDate"
            ).value =
                row.cells[3]
                    .textContent;


            document.getElementById(
                "paymentMethod"
            ).value =
                row.cells[4]
                    .textContent;


            document.getElementById(
                "paymentStatus"
            ).value =
                row.cells[5]
                    .textContent;


            formError.textContent = "";


            document.querySelector(
                "#paymentModal h2"
            ).textContent =
                "Edit Payment";


            document.querySelector(
                ".save-btn"
            ).textContent =
                "Save Changes";


            paymentModal.style.display =
                "flex";

        }

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

loadPayments();