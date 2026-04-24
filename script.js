import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8RtYq8BOYXAWr51MBm7-Z1T_B3ggz3PE",
  authDomain: "nexusauthpro.firebaseapp.com",
  projectId: "nexusauthpro",
  storageBucket: "nexusauthpro.firebasestorage.app",
  messagingSenderId: "665588426216",
  appId: "1:665588426216:web:824c5bd22d2cc5d1db705d"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");
const message = document.getElementById("message");
const userInfo = document.getElementById("userInfo");
const tokenInfo = document.getElementById("tokenInfo");


// 🔥 VALIDATION
function validate(email, password) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return "All fields are required";
  }

  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}


// 🔥 CLEAR INPUTS
function clearInputs() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}


// 🔥 SIGN UP
window.signUp = async () => {
  const email = getEmail();
  const password = getPassword();

  const error = validate(email, password);
  if (error) {
    message.innerText = error;
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    message.innerText = "Account created successfully";

    // ⏳ delay effect
    setTimeout(() => {
      clearInputs();
      message.innerText = "";
    }, 1200);

    // 🔑 token
    const token = await userCred.user.getIdToken();
    localStorage.setItem("token", token);

  } catch (e) {
    message.innerText = e.message;
  }
};


// 🔥 SIGN IN
window.signIn = async () => {
  const email = getEmail();
  const password = getPassword();

  const error = validate(email, password);
  if (error) {
    message.innerText = error;
    return;
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const token = await userCred.user.getIdToken();
    localStorage.setItem("token", token);

    clearInputs();

  } catch (e) {
    message.innerText = e.message;
  }
};


// 🔥 GOOGLE LOGIN
window.googleLogin = async () => {
  try {
    const userCred = await signInWithPopup(auth, provider);

    const token = await userCred.user.getIdToken();
    localStorage.setItem("token", token);

  } catch (e) {
    message.innerText = e.message;
  }
};


// 🔥 RESET PASSWORD
window.resetPassword = async () => {
  const email = getEmail();

  try {
    await sendPasswordResetEmail(auth, email);
    message.innerText = "Reset email sent";
  } catch (e) {
    message.innerText = e.message;
  }
};


// 🔥 LOGOUT
window.logout = async () => {
  await signOut(auth);
  localStorage.removeItem("token");
};


// 🔥 AUTH STATE + TOKEN DISPLAY
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    dashboard.classList.remove("hidden");

    userInfo.innerText = "User: " + user.email;

    const token = await user.getIdToken();
    tokenInfo.innerText = "Token: " + token.slice(0, 30) + "...";

  } else {
    loginSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
});


// 🔧 HELPERS
function getEmail() {
  return document.getElementById("email").value.trim();
}

function getPassword() {
  return document.getElementById("password").value.trim();
}