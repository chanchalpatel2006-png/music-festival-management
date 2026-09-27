const customerBtn = document.getElementById("customerBtn");
const adminBtn = document.getElementById("adminBtn");

customerBtn.addEventListener("click", function () {
    window.location.href = "../user_frontend/index.html";
});

adminBtn.addEventListener("click", function () {
    window.location.href = "../staff_frontend/index.html";
});