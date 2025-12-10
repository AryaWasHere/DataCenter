// ----------------- CONFIG -----------------
const API_URL = "https://script.google.com/macros/s/AKfycbzEToLcYfIVNEtGyZ_9PjttN150ej9fBr8bR2oct4KuoIBjsLlhOSp8s7ScC9FTpKsckA/exec";

// ----------------- LOGIN -----------------
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    // kirim data sebagai form-urlencoded biar lolos CORS
    const formData = new URLSearchParams();
    formData.append("action", "login");
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();

    if (data.success) {
      // login sukses → redirect ke halaman kamu sendiri
      window.location.href = data.redirect || "redirecting.html";
    } else {
      alert("Login failed: " + data.message);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Error connecting to server.");
  }
}

// ----------------- INIT -----------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", handleLogin);
  }
});
