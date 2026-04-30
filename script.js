// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const isOpen = mobileNav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  
  mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

fetch("navbar.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  })
  .catch(error => console.log("Navbar error:", error));


  
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch("http://127.0.0.1:8080/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName: name, email: email, password: password })
        })
        .then(res => res.json())
        .then(data => {
            alert("Registration successful! Welcome " + data.fullName);
            // Redirect to login page (frontend page)
            window.location.href = "login.html";
        })
        .catch(err => {
            console.error("Fetch failed:", err);
            alert("Failed to register. Check console for details.");
        });
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        fetch("http://127.0.0.1:8080/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {

            alert(data.message);

            // 🔥 IMPORTANT
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userName", data.fullName);
            localStorage.setItem("userEmail", data.email);

            if (data.message.toLowerCase().includes("successful")) {
                window.location.href = "dashboard.html";
            }
        })
        .catch(err => {
            console.error("Fetch failed:", err);
            alert("Login failed");
        });
    });
}
