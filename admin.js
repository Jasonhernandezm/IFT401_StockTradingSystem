// =======================
// ADMIN PAGE LOGIC
// =======================

// Role check + initial load
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const adminLink = document.getElementById("adminLink");

  // Only admins can stay on this page
  if (role === "Admin") {
    if (adminLink) adminLink.style.display = "inline";
  } else {
    window.location.href = "index.html";
    return;
  }

  renderAdminUsers();
  renderAdminMarket();
  hydrateMarketConfigForm(); // load hours/schedule into the form
});

// ------------------ USERS ------------------

function renderAdminUsers() {
  const users = loadUsers(); // from script.js
  const tbody = document.querySelector("#admUserTable tbody");
  if (!tbody) return;

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

// ------------------ MARKET (TICKERS) ------------------

function renderAdminMarket() {
  const rows = JSON.parse(localStorage.getItem("marketData") || "[]");
  const tbody = document.querySelector("#admMarketTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.t}</td>
      <td>$${Number(row.p).toFixed(2)}</td>
      <td>
        <button class="btn"
                style="background:#a44;border:none;border-radius:8px;padding:6px 12px;"
                onclick="adminRemoveTicker(${idx})">
          Remove
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function adminAddTicker() {
  const input = document.getElementById("admTicker");
  if (!input) return;

  const t = input.value.toUpperCase().trim();
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

// ------------------ MARKET HOURS & SCHEDULE ------------------

function hydrateMarketConfigForm() {
  // uses loadMarketConfig() from script.js
  const cfg = loadMarketConfig();

  // Times
  const openInput  = document.getElementById("cfgOpenTime");
  const closeInput = document.getElementById("cfgCloseTime");
  if (openInput)  openInput.value  = cfg.openTime;
  if (closeInput) closeInput.value = cfg.closeTime;

  // Days
  const dayIds = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  dayIds.forEach(d => {
    const box = document.getElementById("day" + d);
    if (box) box.checked = cfg.openDays.includes(d);
  });
}

function saveMarketHours() {
  const openInput  = document.getElementById("cfgOpenTime");
  const closeInput = document.getElementById("cfgCloseTime");
  const msg        = document.getElementById("hoursSavedMsg");

  if (!openInput || !closeInput) return;

  const cfg = loadMarketConfig();
  cfg.openTime  = openInput.value || "09:30";
  cfg.closeTime = closeInput.value || "16:00";
  saveMarketConfig(cfg);

  if (msg) {
    msg.textContent = `Saved: ${cfg.openTime} – ${cfg.closeTime}`;
  }
}

function saveMarketSchedule() {
  const msg = document.getElementById("scheduleSavedMsg");
  const cfg = loadMarketConfig();

  const dayIds = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const selected = [];

  dayIds.forEach(d => {
    const box = document.getElementById("day" + d);
    if (box && box.checked) selected.push(d);
  });

  cfg.openDays = selected;
  saveMarketConfig(cfg);

  if (msg) {
    msg.textContent = selected.length
      ? `Saved: Open on ${selected.join(", ")}`
      : "Saved: Market closed all days";
  }
}
