document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log(Username input:", username);
    console.log(Password input:", password);
      
    const accounts = {
      "Rasya Farozan Hunata": "501251043",
      "Revan Al Haviz": "501251042",
      "Davin Dio Pratama": "501251041",
      "Hanzu Takanashii": "501251051",
      "Arya Dewa Pamungkas": "501251052",
    };

    console.log("Password match:", accounts[username] == password);
    let errorBox = document.getElementById("error-box");
    if (!errorBox) {
      errorBox = document.createElement("div");
      errorBox.id = "error-box";
      errorBox.style.color = "red";
      errorBox.style.marginTop = "10px";
      form.appendChild(errorBox);
    }

    if (accounts[username] && accounts[username] === password) {
      window.location.href = "redirecting.html";
    } else {
      errorBox.textContent = "Login failed: Invalid username or password";
    }
  });
});
