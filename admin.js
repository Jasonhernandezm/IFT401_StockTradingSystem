// =======================
// ADMIN PAGE LOGIC
// =======================

// Role check
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const adminLink = document.getElementById("adminLink");

  if (role === "Admin") {
    if (adminLink) adminLink.style.display = "inline";
  } else {
    // Non-admin → redirect away
    window.location.href = "index.html";
  }

  renderAdminUsers();
  renderAdminMarket();
});

// ------------------ USERS ------------------

function renderAdminUsers() {
  const users = loadUsers();
  const tbody = document.querySelector("#admUserTable tbody");
  tbody.innerHTML = "";

  Object.entries(users).forEach(([username, data]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${username}</td>
      <td>${data.role}</td>
      <td>${data.password}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ------------------ MARKET ------------------

function renderAdminMarket() {
  const rows = JSON.parse(localStorage.getItem("marketData") || "[]");
  const tbody = document.querySelector("#admMarketTable tbody");
  tbody.innerHTML = "";

  rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.t}</td>
      <td>$${row.p.toFixed(2)}</td>
      <td><button class="btn" style="background:#a44;border:none;border-radius:8px;padding:6px 12px;"
                  onclick="adminRemoveTicker(${idx})">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function adminAddTicker() {
  const t = document.getElementById("admTicker").value.toUpperCase().trim();
  if (!t) return;

  const rows = JSON.parse(localStorage.getItem("marketData") || "[]");
  if (rows.some(r => r.t === t)) {
    alert("Ticker already exists");
    return;
  }

  rows.push({ t, p: 100, c: 0 });
  localStorage.setItem("marketData", JSON.stringify(rows));
  renderAdminMarket();
}

function adminRemoveTicker(idx) {
  const rows = JSON.parse(localStorage.getItem("marketData") || "[]");
  rows.splice(idx, 1);
  localStorage.setItem("marketData", JSON.stringify(rows));
  renderAdminMarket();
}
