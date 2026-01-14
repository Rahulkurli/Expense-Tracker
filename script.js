function formatDateTime(date = new Date()) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();

  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${d}/${m}/${y} ${h}:${min}`;
}

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
function deleteTransaction(id) {
  transactions = transactions.filter((tx) => tx.id !== id);
  saveTransactions();
  renderTransactions();
  updateSummary();
}
function clearAllTransactions() {
  if (!transactions.length) return;

  const confirmClear = confirm(
    "Are you sure you want to delete all transactions?"
  );
  if (!confirmClear) return;

  transactions = [];
  saveTransactions();
  renderTransactions();
  updateSummary();
}

// function renderTransactions() {
//   const list = document.getElementById("transaction-list");
//   list.innerHTML = "";

//   transactions.forEach((tx) => {
//     const isIncome = tx.amount > 0;

//     const div = document.createElement("div");
//     div.className = "flex justify-between items-center p-3";

//     div.innerHTML = `
//       <div>
//         <p class="font-medium">${tx.title}</p>
//         <p class="text-xs text-gray-500">${tx.date}</p>
//       </div>
//       <span class="${
//         isIncome ? "text-green-500" : "text-red-500"
//       } font-semibold">
//         ${isIncome ? "+" : "-"} ₹${Math.abs(tx.amount)}
//       </span>
//     `;

//     list.appendChild(div);
//   });
// }
function renderTransactions() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML = `<p class="text-center text-gray-400 text-sm py-2">No transactions yet</p>`;
    return;
  }

  transactions.forEach((tx) => {
    const isIncome = tx.amount > 0;

    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center p-3 border-b last:border-none";

    div.innerHTML = `
      <div>
        <p class="font-medium">${tx.title}</p>
        <p class="text-xs text-gray-500">${tx.date}</p>
      </div>

      <div class="flex items-center gap-3">
        <span class="${
          isIncome ? "text-green-500" : "text-red-500"
        } font-semibold">
          ${isIncome ? "+" : "-"} ₹${Math.abs(tx.amount)}
        </span>

        <button
          onclick="deleteTransaction(${tx.id})"
          class="text-gray-400 hover:text-red-500 text-sm"
          title="Delete"
        >
          ✕
        </button>
      </div>
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
    date: formatDateTime(),
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
