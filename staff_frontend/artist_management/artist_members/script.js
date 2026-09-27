const addMemberBtn = document.getElementById("addMemberBtn");
const memberModal = document.getElementById("memberModal");
const closeModal = document.getElementById("closeModal");
const memberForm = document.getElementById("memberForm");
const memberTableBody = document.getElementById("memberTableBody");

let editingRow = null;


// OPEN ADD MEMBER
addMemberBtn.addEventListener("click", function () {
    editingRow = null;
    memberForm.reset();

    document.querySelector("#memberModal h2").textContent =
        "Add Artist Member";

    document.querySelector(".save-btn").textContent =
        "Add Member";

    memberModal.style.display = "flex";
});


// CLOSE MODAL
closeModal.addEventListener("click", function () {
    memberModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === memberModal) {
        memberModal.style.display = "none";
    }
});


// ADD / UPDATE MEMBER
memberForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const memberId = document.getElementById("memberId").value;
    const artistId = document.getElementById("artistId").value;
    const memberName = document.getElementById("memberName").value;
    const instrument = document.getElementById("instrument").value;

    if (editingRow !== null) {

        editingRow.cells[0].textContent = memberId;
        editingRow.cells[1].textContent = artistId;
        editingRow.cells[2].textContent = memberName;
        editingRow.cells[3].textContent = instrument;

        editingRow = null;

    } else {

        const row = memberTableBody.insertRow();

        row.insertCell(0).textContent = memberId;
        row.insertCell(1).textContent = artistId;
        row.insertCell(2).textContent = memberName;
        row.insertCell(3).textContent = instrument;

        const actionCell = row.insertCell(4);

        actionCell.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
    }

    memberForm.reset();
    memberModal.style.display = "none";
});


// EDIT / DELETE
memberTableBody.addEventListener("click", function (event) {

    const row = event.target.closest("tr");

    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this member?")) {
            row.remove();
        }
    }

    if (event.target.classList.contains("edit-btn")) {

        editingRow = row;

        document.getElementById("memberId").value =
            row.cells[0].textContent;

        document.getElementById("artistId").value =
            row.cells[1].textContent;

        document.getElementById("memberName").value =
            row.cells[2].textContent;

        document.getElementById("instrument").value =
            row.cells[3].textContent;

        document.querySelector("#memberModal h2").textContent =
            "Edit Artist Member";

        document.querySelector(".save-btn").textContent =
            "Save Changes";

        memberModal.style.display = "flex";
    }
});