const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
<<<<<<< HEAD
const contactForm = document.querySelector(".contact-form");
const contactStatus = document.querySelector(".form-status");
const heroVisual = document.querySelector(".hero-visual");
const authForms = document.querySelectorAll(".auth-form");
const enrollButtons = document.querySelectorAll(".enroll-button");
const revealElements = document.querySelectorAll(
  ".hero-content, .hero-visual, .course-card, .contact-copy, .contact-form, .page-hero-copy, .page-hero-panel, .class-card, .auth-copy, .auth-card"
);
const supportsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let firebaseServicesPromise = null;
=======
const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const heroVisual = document.querySelector(".hero-visual");
const authForms = document.querySelectorAll(".auth-form");
const enrollButtons = document.querySelectorAll(".enroll-button");
const revealElements = document.querySelectorAll(".hero-content, .hero-visual, .course-card, .contact-copy, .contact-form");
const pageRevealElements = document.querySelectorAll(".page-hero-copy, .page-hero-panel, .class-card, .auth-copy, .auth-card");
const supportsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
<<<<<<< HEAD
  } catch {
=======
  } catch (error) {
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
<<<<<<< HEAD
  } catch {
    // Ignore storage failures.
  }
}

function setStatus(element, message, isError = false) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.style.color = isError ? "#c62828" : "#0f766e";
}

function toFriendlyError(error) {
  const code = error?.code || "";

  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Incorrect email or password.";
  }

  if (code.includes("email-already-in-use")) {
    return "This email is already registered. Please log in instead.";
  }

  if (code.includes("weak-password")) {
    return "Password should be at least 6 characters long.";
  }

  if (code.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }

  return error?.message || "Something went wrong. Please try again.";
}

async function initFirebaseServices() {
  if (firebaseServicesPromise) {
    return firebaseServicesPromise;
  }

  const firebaseConfig = window.firebaseConfig || null;

  if (!firebaseConfig) {
    return null;
  }

  firebaseServicesPromise = Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")
  ]).then(([appModule, authModule, firestoreModule]) => {
    const existingApp = appModule.getApps().length > 0 ? appModule.getApp() : appModule.initializeApp(firebaseConfig);

    return {
      auth: authModule.getAuth(existingApp),
      db: firestoreModule.getFirestore(existingApp),
      createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
      signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
      updateProfile: authModule.updateProfile,
      addDoc: firestoreModule.addDoc,
      collection: firestoreModule.collection,
      serverTimestamp: firestoreModule.serverTimestamp
    };
  });

  return firebaseServicesPromise;
}

=======
  } catch (error) {
    // Ignore storage failures for local previews or private browsing.
  }
}

>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

<<<<<<< HEAD
revealElements.forEach((element, index) => {
=======
const allRevealElements = [...revealElements, ...pageRevealElements];

allRevealElements.forEach((element, index) => {
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
  element.classList.add("reveal");
  if (index > 0) {
    element.classList.add(`reveal-delay-${Math.min(index, 3)}`);
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

<<<<<<< HEAD
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
=======
  allRevealElements.forEach((element) => observer.observe(element));
} else {
  allRevealElements.forEach((element) => element.classList.add("visible"));
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
}

if (heroVisual && !supportsReducedMotion) {
  window.addEventListener("mousemove", (event) => {
    const xShift = (event.clientX / window.innerWidth - 0.5) * 18;
    const yShift = (event.clientY / window.innerHeight - 0.5) * 18;
<<<<<<< HEAD
=======

>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
    heroVisual.style.transform = `translate3d(${xShift}px, ${yShift * -0.35}px, 0)`;
  });
}

<<<<<<< HEAD
enrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.closest(".class-card")?.querySelector(".class-pill")?.textContent || "";
    safeStorageSet("selectedCourse", selected);
  });
});

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentName = document.querySelector("#name")?.value.trim() || "Student";
    const grade = document.querySelector("#grade")?.value || "";
    const email = document.querySelector("#parent-email")?.value.trim() || "";
    const message = document.querySelector("#message")?.value.trim() || "";

    try {
      const firebase = await initFirebaseServices();

      if (firebase) {
        await firebase.addDoc(firebase.collection(firebase.db, "enquiries"), {
          studentName,
          grade,
          parentEmail: email,
          message,
          createdAt: firebase.serverTimestamp()
        });
      }

      setStatus(contactStatus, `Thanks, ${studentName}! Your demo class enquiry has been received.`);
      contactForm.reset();
    } catch (error) {
      setStatus(contactStatus, toFriendlyError(error), true);
    }
=======
if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const studentName = document.querySelector("#name")?.value.trim() || "Student";

    formStatus.textContent = `Thanks, ${studentName}! Your demo class enquiry has been received.`;
    form.reset();
  });
}

if (enrollButtons.length > 0) {
  enrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      safeStorageSet("selectedCourse", button.closest(".class-card")?.querySelector(".class-pill")?.textContent || "");
    });
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
  });
}

if (authForms.length > 0) {
  const params = new URLSearchParams(window.location.search);
  const courseFromQuery = params.get("course");
  const storedCourse = safeStorageGet("selectedCourse");
  const signupClassSelect = document.querySelector("#signup-class");
<<<<<<< HEAD
=======

>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
  const courseMap = {
    "class-6": "Class 6",
    "class-7": "Class 7",
    "class-8": "Class 8",
    "class-9": "Class 9",
    "class-10": "Class 10"
  };

  let selectedCourse = courseMap[courseFromQuery] || storedCourse;

  if (signupClassSelect && selectedCourse) {
    signupClassSelect.value = selectedCourse;
  }

  authForms.forEach((authForm) => {
<<<<<<< HEAD
    authForm.addEventListener("submit", async (event) => {
=======
    authForm.addEventListener("submit", (event) => {
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
      event.preventDefault();

      const authType = authForm.dataset.auth;
      const status = authForm.querySelector(".auth-status");

      if (!status) {
        return;
      }

<<<<<<< HEAD
      const email = authForm.querySelector('input[name="email"]')?.value.trim() || "";
      const password = authForm.querySelector('input[name="password"]')?.value || "";

      try {
        const firebase = await initFirebaseServices();

        if (!firebase) {
          throw new Error("Firebase config is missing. Add your firebase config to window.firebaseConfig before using auth.");
        }

        if (authType === "login") {
          await firebase.signInWithEmailAndPassword(firebase.auth, email, password);
          setStatus(status, `Welcome back! ${email} is now logged in.`);
          authForm.reset();
          window.setTimeout(() => {
            window.location.href = "courses.html";
          }, 1200);
          return;
        }

        if (authType === "signup") {
          const name = authForm.querySelector('input[name="name"]')?.value.trim() || "Student";
          const studentClass = authForm.querySelector('select[name="studentClass"]')?.value || "";

          const userCredential = await firebase.createUserWithEmailAndPassword(firebase.auth, email, password);
          await firebase.updateProfile(userCredential.user, { displayName: name });
          await firebase.addDoc(firebase.collection(firebase.db, "students"), {
            uid: userCredential.user.uid,
            studentName: name,
            parentEmail: email,
            studentClass,
            createdAt: firebase.serverTimestamp()
          });

          safeStorageSet("selectedCourse", studentClass);
          selectedCourse = studentClass;
          setStatus(status, `Account created for ${name} in ${studentClass}. Redirecting to login...`);
          authForm.reset();

          if (signupClassSelect && selectedCourse) {
            signupClassSelect.value = selectedCourse;
          }

          window.setTimeout(() => {
            window.location.href = "login.html";
          }, 1400);
        }
      } catch (error) {
        setStatus(status, toFriendlyError(error), true);
=======
      if (authType === "login") {
        const email = authForm.querySelector('input[name="email"]')?.value.trim() || "";
        status.textContent = `Welcome back! ${email} is now logged in.`;
      }

      if (authType === "signup") {
        const name = authForm.querySelector('input[name="name"]')?.value.trim() || "Student";
        const studentClass = authForm.querySelector('select[name="studentClass"]')?.value || "your class";
        safeStorageSet("selectedCourse", studentClass);
        selectedCourse = studentClass;
        status.textContent = `Account created for ${name} in ${studentClass}.`;
      }

      authForm.reset();

      if (signupClassSelect && selectedCourse) {
        signupClassSelect.value = selectedCourse;
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
      }
    });
  });
}
<<<<<<< HEAD
=======
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function signup() {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)

    .then((userCredential) => {

      const user = userCredential.user;

      db.collection("students").add({
        name: name,
        email: email,
        uid: user.uid,
        createdAt: new Date()
      });

      alert("Signup Successful!");

      window.location.href = "dashboard.html";

    })

    .catch((error) => {
      alert(error.message);
    });
}
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const form = document.querySelector(".contact-form");

form.addEventListener("submit", function(e) {

  e.preventDefault();

  const name = document.getElementById("name").value;

  const grade = document.getElementById("grade").value;

  const email = document.getElementById("parent-email").value;

  const message = document.getElementById("message").value;

  db.collection("students").add({
    name: name,
    grade: grade,
    email: email,
    message: message,
    createdAt: new Date()
  })

  .then(() => {

    alert("Data submitted successfully!");

    form.reset();

  })

  .catch((error) => {

    alert(error.message);

  });

});
>>>>>>> 6d9a5b05b1e1aea3ce0405d5d9212fc3780fd34f
