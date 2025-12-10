// ----------------- CONFIG -----------------
const API_URL = "https://script.google.com/macros/s/AKfycbyhp1ZoX717GxywRo-tdnjRHpW0Jz0RDNtNVUZCRYtbRbNGRETzIwsMWY940Pmstl-Wiw/exec"; // ganti dengan URL Web App kamu
document.getElementById('api-url').textContent = API_URL || '(not set)';

// helper: deteksi kolom penting
function detectKeys(sampleRow) {
  const keys = Object.keys(sampleRow || {});
  let playerKey = keys.find(k => /player|nama|namamu|username/i.test(k)) || keys.find(k=>/name/i.test(k));
  let jobKey = keys.find(k => /pekerjaan|job|role|position/i.test(k)) || keys.find(k=>/job/i.test(k));
  let folderKey = keys.find(k => /folder|dir|directory/i.test(k));
  let fileKey = keys.find(k => /file|filename|berkas/i.test(k));
  let idKey = keys.find(k => /^id$/i.test(k));
  let timeKey = keys.find(k => /time|timestamp|waktu|date/i.test(k));
  return { playerKey, jobKey, folderKey, fileKey, idKey, timeKey, keys };
}

// UI elements
const totalPlayersEl = document.getElementById('total-players');
const totalJobsEl = document.getElementById('total-jobs');
const topJobEl = document.getElementById('top-job');
const reloadBtn = document.getElementById('reload');
const createSampleBtn = document.getElementById('create-sample');
const exportBtn = document.getElementById('export-json');

let rawData = [];
let detected = {};

// ------------------- API -------------------
async function api(action, payload = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);

  let res;
  if (action === "read") {
    res = await fetch(url.toString());
  } else {
    // contoh untuk add data
    res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
  return res.json();
}
// ------------------------------------------------------

// load data
async function loadData() {
  setStatus(false, 'loading...');
  try {
    const data = await api('read');
    rawData = Array.isArray(data) ? data : Object.values(data);

    if (rawData.length === 0) {
      setStatus(false, 'no data');
      renderEmpty();
      return;
    }

    detected = detectKeys(rawData[0]);
    processData();
    setStatus(true, 'connected');

  } catch (e) {
    console.error(e);
    setStatus(false, 'error');
    alert('Gagal memuat data. Pastikan API_URL benar dan Apps Script aktif.');
  }
}

function setStatus(on, text) {
  const dot = document.getElementById('dc-dot');
  const txt = document.getElementById('dc-status');
  if (on) {
    dot.classList.remove('offline'); 
    dot.classList.add('online');
    txt.textContent = text || 'online';
  } else {
    dot.classList.remove('online'); 
    dot.classList.add('offline');
    txt.textContent = text || 'offline';
  }
}

function processData() {
  const { playerKey, jobKey } = detected;

  const players = [...new Set(rawData.map(r => 
    (r[playerKey] || r['Nama'] || r['name'] || r['Nama Lengkap'] || r['NAMAMU'] || 'Unknown')
      .toString().trim()
  ).filter(Boolean))];

  totalPlayersEl.textContent = players.length;

  const jobCounts = {};
  rawData.forEach(r => {
    const j = (r[jobKey] || r['Pekerjaan'] || r['job'] || 'Unknown').toString();
    jobCounts[j] = (jobCounts[j] || 0) + 1;
  });

  totalJobsEl.textContent = Object.keys(jobCounts).length;

  const top = Object.entries(jobCounts).sort((a,b)=>b[1]-a[1])[0];
  topJobEl.textContent = top ? `${top[0]} (${top[1]})` : '-';

  renderHomeChart(jobCounts);
}

let homePieChart = null;
function renderHomeChart(map) {
  const ctx = document.getElementById('homePie').getContext('2d');
  const labels = Object.keys(map);
  const values = Object.values(map);
  const colors = labels.map((_,i)=>`hsl(${(i*47)%360} 75% 55%)`);

  if (homePieChart) homePieChart.destroy();

  homePieChart = new Chart(ctx, { 
    type:'pie', 
    data:{ labels, datasets:[{ data:values, backgroundColor:colors }]}, 
    options:{ responsive:true }
  });
}

// UI actions
reloadBtn.addEventListener('click', loadData);

createSampleBtn.addEventListener('click', async ()=>{
  try {
    const result = await api('add', { username:"sampleUser", job:"Warrior" });
    alert(result.message || "Sample row ditambahkan!");
    loadData();
  } catch (e) {
    alert("Gagal menambah data: " + e);
  }
});

exportBtn.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(rawData, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); 
  a.href = url; 
  a.download = 'datacenter-export-'+Date.now()+'.json'; 
  a.click(); 
  URL.revokeObjectURL(url);
});

function renderEmpty() {
  totalPlayersEl.textContent = '0';
  totalJobsEl.textContent = '0';
  topJobEl.textContent = '-';
}

// init
window.addEventListener('load', ()=>{
  document.getElementById('api-url').textContent = API_URL || '(not set)';
  if (API_URL && !API_URL.includes('REPLACE_WITH')) {
    loadData();
  } else {
    setStatus(false, 'no API configured');
  }
});