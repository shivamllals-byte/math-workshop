const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");
const contactStatus = document.querySelector(".form-status");
const heroVisual = document.querySelector(".hero-visual");
const authForms = document.querySelectorAll(".auth-form");
const enrollButtons = document.querySelectorAll(".enroll-button");
const gatedLinks = document.querySelectorAll(".gated-link");
const paymentTitle = document.querySelector(".payment-title");
const paymentCourseChip = document.querySelector(".payment-course-chip");
const paymentCourseLabel = document.querySelector(".payment-course-label");
const paymentDescription = document.querySelector(".payment-description");
const loginPopup = document.querySelector("#login-popup");
const popupCloseButtons = document.querySelectorAll("[data-close-popup]");
const signupRedirectLink = document.querySelector(".signup-redirect-link");
const revealElements = document.querySelectorAll(
  ".hero-content, .hero-visual, .course-card, .contact-copy, .contact-form, .page-hero-copy, .page-hero-panel, .class-card, .auth-copy, .auth-card, .payment-copy, .payment-card, .login-popup-card"
);
const supportsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let firebaseServicesPromise = null;
const courseMap = {
  "class-6": "Class 6",
  "class-7": "Class 7",
  "class-8": "Class 8",
  "class-9": "Class 9",
  "class-10": "Class 10"
};

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
}

function safeStorageRemove(key) {
  try {
    window.localStorage.removeItem(key);
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

function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect") || safeStorageGet("pendingRedirect") || "";
}

function buildLoginHref(redirectTarget) {
  return redirectTarget ? `login.html?redirect=${encodeURIComponent(redirectTarget)}` : "login.html";
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
    const app = appModule.getApps().length > 0 ? appModule.getApp() : appModule.initializeApp(firebaseConfig);

    return {
      auth: authModule.getAuth(app),
      db: firestoreModule.getFirestore(app),
      createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
      signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
      updateProfile: authModule.updateProfile,
      addDoc: firestoreModule.addDoc,
      setDoc: firestoreModule.setDoc,
      doc: firestoreModule.doc,
      collection: firestoreModule.collection,
      serverTimestamp: firestoreModule.serverTimestamp
    };
  });

  return firebaseServicesPromise;
}

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

revealElements.forEach((element, index) => {
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

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

if (heroVisual && !supportsReducedMotion) {
  window.addEventListener("mousemove", (event) => {
    const xShift = (event.clientX / window.innerWidth - 0.5) * 18;
    const yShift = (event.clientY / window.innerHeight - 0.5) * 18;
    heroVisual.style.transform = `translate3d(${xShift}px, ${yShift * -0.35}px, 0)`;
  });
}

enrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.closest(".class-card")?.querySelector(".class-pill")?.textContent || "";
    if (selected) {
      safeStorageSet("selectedCourse", selected);
    }
  });
});

gatedLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const selected = link.dataset.course || "";
    const redirectTarget = link.dataset.redirect || "";
    if (selected) {
      safeStorageSet("selectedCourse", selected);
    }
    if (redirectTarget) {
      safeStorageSet("pendingRedirect", redirectTarget);
      link.href = buildLoginHref(redirectTarget);
    }
  });
});

if (loginPopup) {
  const dismissed = safeStorageGet("dismissedLoginPopup");

  if (dismissed === "true") {
    loginPopup.classList.remove("is-visible");
    loginPopup.setAttribute("aria-hidden", "true");
  }

  popupCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      loginPopup.classList.remove("is-visible");
      loginPopup.setAttribute("aria-hidden", "true");
      safeStorageSet("dismissedLoginPopup", "true");
    });
  });
}

if (paymentTitle && paymentCourseChip && paymentCourseLabel && paymentDescription) {
  const params = new URLSearchParams(window.location.search);
  const courseFromQuery = params.get("course");
  const storedCourse = safeStorageGet("selectedCourse");
  const selectedCourse = courseMap[courseFromQuery] || storedCourse || "";

  if (selectedCourse) {
    paymentCourseChip.textContent = selectedCourse;
    paymentTitle.textContent = `Scan the QR to reserve your ${selectedCourse} seat.`;
    paymentCourseLabel.textContent = `${selectedCourse} Enrollment`;
    paymentDescription.textContent = `Quick, simple payment for ${selectedCourse}. After payment, contact us with your class and student name so we can confirm your seat faster.`;
  }
}

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
  });
}

if (authForms.length > 0) {
  const params = new URLSearchParams(window.location.search);
  const courseFromQuery = params.get("course");
  const redirectTarget = params.get("redirect") || safeStorageGet("pendingRedirect") || "";
  const storedCourse = safeStorageGet("selectedCourse");
  const signupClassSelect = document.querySelector("#signup-class");
  let selectedCourse = courseMap[courseFromQuery] || storedCourse;

  if (signupRedirectLink && redirectTarget) {
    signupRedirectLink.href = `signup.html?redirect=${encodeURIComponent(redirectTarget)}`;
  }

  if (signupClassSelect && selectedCourse) {
    signupClassSelect.value = selectedCourse;
  }

  authForms.forEach((authForm) => {
    authForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const authType = authForm.dataset.auth;
      const status = authForm.querySelector(".auth-status");

      if (!status) {
        return;
      }

      const email = authForm.querySelector('input[name="email"]')?.value.trim() || "";
      const password = authForm.querySelector('input[name="password"]')?.value || "";

      try {
        const firebase = await initFirebaseServices();

        if (!firebase) {
          throw new Error("Firebase config is missing. Add your firebase config to window.firebaseConfig before using auth.");
        }

        if (authType === "login") {
          const credential = await firebase.signInWithEmailAndPassword(firebase.auth, email, password);
          await firebase.setDoc(
            firebase.doc(firebase.db, "loginEvents", credential.user.uid),
            {
              uid: credential.user.uid,
              email: credential.user.email,
              lastLoginAt: firebase.serverTimestamp()
            },
            { merge: true }
          );
          setStatus(status, `Welcome back! ${email} is now logged in.`);
          authForm.reset();
          window.setTimeout(() => {
            const nextPage = redirectTarget || "dashboard.html";
            safeStorageRemove("pendingRedirect");
            window.location.href = nextPage;
          }, 1200);
          return;
        }

        if (authType === "signup") {
          const name = authForm.querySelector('input[name="name"]')?.value.trim() || "Student";
          const studentClass = authForm.querySelector('select[name="studentClass"]')?.value || "";

          const userCredential = await firebase.createUserWithEmailAndPassword(firebase.auth, email, password);
          await firebase.updateProfile(userCredential.user, { displayName: name });
          await firebase.setDoc(
            firebase.doc(firebase.db, "students", userCredential.user.uid),
            {
              uid: userCredential.user.uid,
              studentName: name,
              parentEmail: email,
              studentClass,
              createdAt: firebase.serverTimestamp(),
              lastLoginAt: firebase.serverTimestamp()
            },
            { merge: true }
          );

          safeStorageSet("selectedCourse", studentClass);
          selectedCourse = studentClass;
          setStatus(status, `Account created for ${name} in ${studentClass}. Redirecting to login...`);
          authForm.reset();

          if (signupClassSelect && selectedCourse) {
            signupClassSelect.value = selectedCourse;
          }

          window.setTimeout(() => {
            const loginUrl = redirectTarget
              ? `login.html?redirect=${encodeURIComponent(redirectTarget)}`
              : "login.html";
            window.location.href = loginUrl;
          }, 1400);
        }
      } catch (error) {
        setStatus(status, toFriendlyError(error), true);
      }
    });
  });
}
