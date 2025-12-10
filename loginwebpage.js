const API_URL = "https://script.google.com/macros/s/AKfycbzEToLcYfIVNEtGyZ_9PjttN150ej9fBr8bR2oct4KuoIBjsLlhOSp8s7ScC9FTpKsckA/exec";

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("action", "login");
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
      // tanpa headers → dianggap simple request → lolos CORS
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = data.redirect || "redirecting.html";
    } else {
      alert("Login failed: " + data.message);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Error connecting to server.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", handleLogin);
});
