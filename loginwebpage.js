document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // daftar akun valid
    const accounts = {
      "Rasya Farozan Hunata": "501251043",
      "Revan Al Haviz": "501251042",
      "Davin Dio Pratama": "50125141"
    };

    if (accounts[username] && accounts[username] === password) {
      // login sukses → redirect
      window.location.href = "redirecting.html";
    } else {
      // login gagal
      alert("Login failed: Invalid username or password");
    }
  });
});
