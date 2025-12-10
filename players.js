// ----------------- CONFIG -----------------
const API_URL = "https://script.google.com/macros/s/AKfycbyhp1ZoX717GxywRo-tdnjRHpW0Jz0RDNtNVUZCRYtbRbNGRETzIwsMWY940Pmstl-Wiw/exec";

let rawData = [];
let jobChart, trendChart;

// ----------------- STATUS -----------------
function setStatus(on, text) {
  const dot = document.getElementById("dc-dot");
  const statusText = document.getElementById("dc-status");

  if (on) {
    dot.classList.remove("offline");
    dot.classList.add("online");
    statusText.textContent = text || "connected";
  } else {
    dot.classList.remove("online");
    dot.classList.add("offline");
    statusText.textContent = text || "disconnected";
  }
}

// ----------------- SUMMARY -----------------
function updateSummary() {
  const jobCounts = {};

  rawData.forEach(r => {
    const job = r.job || r.role || r.Pekerjaan;
    if (!job) return;
    jobCounts[job] = (jobCounts[job] || 0) + 1;
  });

  const jobs = Object.entries(jobCounts);
  const total = jobs.reduce((sum, [_, count]) => sum + count, 0);
  const sorted = jobs.sort((a, b) => b[1] - a[1]);

  document.getElementById("total-jobs").textContent = total;
  document.getElementById("popular-job").textContent = sorted[0]?.[0] || "-";
  document.getElementById("least-job").textContent = sorted.at(-1)?.[0] || "-";

  renderCharts(jobCounts);
}

// ----------------- CHARTS -----------------
function renderCharts(jobCounts) {
  const ctxDist = document.getElementById("jobPie").getContext("2d");
  const ctxTrend = document.getElementById("jobLine").getContext("2d");

  const labels = Object.keys(jobCounts);
  const values = Object.values(jobCounts);

  // Hapus chart lama kalau ada
  if (jobChart) jobChart.destroy();
  if (trendChart) trendChart.destroy();

  // Distribusi Job (diagram batang horizontal)
  jobChart = new Chart(ctxDist, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Jumlah Job",
        data: values,
        backgroundColor: "#2dd4bf"
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  // Tren Job (diagram batang biasa)
  trendChart = new Chart(ctxTrend, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Tren Job",
        data: values,
        backgroundColor: "#94a3b8"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// ----------------- LOAD PLAYERS -----------------
async function loadPlayers() {
  setStatus(false, "loading...");

  try {
    const res = await fetch(API_URL + "?action=read");
    if (!res.ok) throw new Error("HTTP " + res.status);
    rawData = await res.json();

    const tbody = document.getElementById("player-list");
    tbody.innerHTML = "";

    rawData.forEach(r => {
      const tr = document.createElement("tr");
      const playerName = r.username || r.player || r.Nama || "Unknown";
      const jobName = r.job || r.role || r.Pekerjaan || "-";

      tr.innerHTML = `
        <td>${playerName}</td>
        <td>${jobName}</td>
      `;
      tbody.appendChild(tr);
    });

    updateSummary();
    setStatus(true, "connected");
  } catch (err) {
    console.error("Fetch error:", err);
    setStatus(false, "error");
  }
}

// ----------------- INIT -----------------
window.addEventListener("load", loadPlayers);

// Tombol reload
document.getElementById("reload")?.addEventListener("click", loadPlayers);