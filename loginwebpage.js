document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log(Username input:", username);
    console.log(Password input:", password);
      
    const accounts = {
        "rasyafarozanhunata": "501251043",
        "revanalhaviz": "501251042",
        "davindiopratama": "501251041",
        "hanzutakanashii": "501251051",
        "aryadewapamungkas": "501251052",
        "admin": "admin",
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
