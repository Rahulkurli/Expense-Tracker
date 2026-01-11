const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const tab = item.dataset.tab;
    showSection(tab);
  });
});

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  transactions.forEach((tx) => {
    const isIncome = tx.amount > 0;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center p-3";

    div.innerHTML = `
      <div>
        <p class="font-medium">${tx.title}</p>
        <p class="text-xs text-gray-500">${tx.date}</p>
      </div>
      <span class="${
        isIncome ? "text-green-500" : "text-red-500"
      } font-semibold">
        ${isIncome ? "+" : "-"} ₹${Math.abs(tx.amount)}
      </span>
    `;

    list.appendChild(div);
  });
}

renderTransactions();

function updateSummary() {
  const amounts = transactions.map((tx) => tx.amount);

  const balance = amounts.reduce((a, b) => a + b, 0);
  const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0);

  document.getElementById("balance").innerText = `₹${balance}`;
  document.getElementById("income").innerText = `₹${income}`;
  document.getElementById("expense").innerText = `₹${Math.abs(expense)}`;
}
updateSummary();

function showSection(tab) {
  document
    .querySelectorAll(".page-section")
    .forEach((sec) => sec.classList.add("hidden"));

  document.getElementById(`${tab}-section`).classList.remove("hidden");
}

// transaction;

let transactionType = "income";

function setType(type) {
  transactionType = type;

  document.getElementById("income-btn").className =
    "flex-1 py-2 rounded-lg font-medium " +
    (type === "income" ? "bg-green-500 text-white" : "text-gray-600");

  document.getElementById("expense-btn").className =
    "flex-1 py-2 rounded-lg font-medium " +
    (type === "expense" ? "bg-red-500 text-white" : "text-gray-600");
}

// function addTransaction() {
//   const title = document.getElementById("title").value;
//   const amount = +document.getElementById("amount").value;

//   if (!title || !amount) return alert("Fill all fields");

//   transactions.push({
//     id: Date.now(),
//     title,
//     amount,
//     date: new Date().toISOString().split("T")[0],
//   });

//   saveTransactions();
//   renderTransactions();
//   updateSummary();
// }

// 2nd

// function addTransaction() {
//   const title = document.getElementById("title").value;
//   let amount = +document.getElementById("amount").value;

//   if (!title || !amount) return alert("Fill all fields");

//   if (transactionType === "expense") {
//     amount = -amount;
//   }

//   transactions.push({
//     id: Date.now(),
//     title,
//     amount,
//     date: new Date().toISOString().split("T")[0],
//   });

//   saveTransactions();
//   renderTransactions();
//   updateSummary();

//   showSection("home");
// }

function addTransaction() {
  const titleInput = document.getElementById("title");
  const amountInput = document.getElementById("amount");

  const title = titleInput.value.trim();
  let amount = +amountInput.value;

  if (!title || !amount) {
    alert("Fill all fields");
    return;
  }

  if (transactionType === "expense") {
    amount = -amount;
  }

  transactions.push({
    id: Date.now(),
    title,
    amount,
    date: new Date().toISOString().split("T")[0],
  });

  saveTransactions();
  renderTransactions();
  updateSummary();

  /* ✅ Clear inputs */
  titleInput.value = "";
  amountInput.value = "";

  /* ✅ Reset toggle to Income */
  setType("income");

  /* ✅ Switch to Home section */
  showSection("home");

  /* ✅ Update navbar active state */
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  document.getElementById("amount").focus();
  document.querySelector('.nav-item[data-tab="home"]').classList.add("active");
}
