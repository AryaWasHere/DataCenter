// ----------------- CONFIG -----------------
const API_URL = "https://script.google.com/macros/s/AKfycbyhp1ZoX717GxywRo-tdnjRHpW0Jz0RDNtNVUZCRYtbRbNGRETzIwsMWY940Pmstl-Wiw/exec";
document.getElementById('api-url').textContent = API_URL || '(not set)';

let rawData = []; // simpan data hasil fetch

// ----------------- STATUS -----------------
function setStatus(on, text) {
  const dot = document.getElementById("dc-dot");
  const statusText = document.getElementById("dc-status");

  if (on) {
    dot.classList.remove("offline");
    dot.classList.add("online");
    statusText.textContent = text || "online";
  } else {
    dot.classList.remove("online");
    dot.classList.add("offline");
    statusText.textContent = text || "offline";
  }
}

// ----------------- MAIN FETCH -----------------
async function loadExplorer() {
  setStatus(false, "loading..."); // tampilkan loading

  try {
    const res = await fetch(API_URL + "?action=read");
    if (!res.ok) throw new Error("HTTP " + res.status);
    rawData = await res.json();

    const playerContainer = document.getElementById("player-folders");
    const jobContainer = document.getElementById("job-folders");
    if (!playerContainer || !jobContainer) {
      throw new Error("Elemen folder tidak ditemukan di HTML");
    }
    playerContainer.innerHTML = "";
    jobContainer.innerHTML = "";

    // Sesuaikan dengan header di sheet: "Nama" dan "Pekerjaan"
    const players = [...new Set(rawData.map(r => r.username || r.player || r.Nama || "Unknown"))];
    const jobs = [...new Set(rawData.map(r => r.job || r.role || r.Pekerjaan || "Unknown"))];

    // render player folders
    players.forEach(name => {
      const div = document.createElement("div");
      div.className = "folder";
      div.innerHTML = `<div class="name">📁 ${name}</div><div class="meta">Player folder</div>`;
      div.addEventListener("click", () => showPlayerDetail(name));
      playerContainer.appendChild(div);
    });

    // render job folders
    jobs.forEach(job => {
      const div = document.createElement("div");
      div.className = "folder";
      div.innerHTML = `<div class="name">📁 ${job}</div><div class="meta">Job folder</div>`;
      div.addEventListener("click", () => showJobDetail(job));
      jobContainer.appendChild(div);
    });

    setStatus(true, "connected"); // kalau sukses
  } catch (err) {
    console.error("Fetch error:", err);
    setStatus(false, "error: " + err.message); // tampilkan error detail
  }
}

// ----------------- DETAIL HANDLER -----------------
function showPlayerDetail(name) {
  const items = rawData.filter(r => (r.username || r.player || r.Nama) === name);
  console.log("Detail Player:", name, items);
  alert(`Player: ${name}\nJobs: ${items.map(r => r.job || r.role || r.Pekerjaan).join(", ")}`);
}

function showJobDetail(job) {
  const items = rawData.filter(r => (r.job || r.role || r.Pekerjaan) === job);
  console.log("Detail Job:", job, items);
  alert(`Job: ${job}\nPlayers: ${items.map(r => r.username || r.player || r.Nama).join(", ")}`);
}

// ----------------- EXPORT JSON -----------------
document.getElementById("export-json").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jobanalytics-export-" + Date.now() + ".json";
  a.click();
  URL.revokeObjectURL(url);
});

// ----------------- RELOAD BUTTON -----------------
document.getElementById("reload").addEventListener("click", loadExplorer);

// ----------------- INIT -----------------
window.addEventListener("load", loadExplorer);