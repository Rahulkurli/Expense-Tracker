const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const address = document.getElementById("address").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const imageFile = document.getElementById("image").files[0];
    const termsAccepted = document.getElementById("terms").checked;

    /* ===== Validation ===== */
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !address ||
      !mobile ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Mobile number must be 10 digits");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Invalid email format");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!imageFile) {
      alert("Please upload profile image");
      return;
    }

    if (!termsAccepted) {
      alert("You must accept Terms & Conditions");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.some((u) => u.email === email)) {
        alert("Email already registered");
        return;
      }

      users.push({
        firstName,
        lastName,
        dob,
        gender,
        address,
        mobile,
        email,
        password,
        image: reader.result,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful!");
      window.location.href = "login.html";
    };

    reader.readAsDataURL(imageFile);
  });
}

/* =========================
   LOGIN LOGIC
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    // ✅ Save logged-in user
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // ✅ Redirect to dashboard
    window.location.href = "index.html"; // your main expense tracker page
  });
}
