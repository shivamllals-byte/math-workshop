const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const heroVisual = document.querySelector(".hero-visual");
const authForms = document.querySelectorAll(".auth-form");
const enrollButtons = document.querySelectorAll(".enroll-button");
const revealElements = document.querySelectorAll(".hero-content, .hero-visual, .course-card, .contact-copy, .contact-form");
const pageRevealElements = document.querySelectorAll(".page-hero-copy, .page-hero-panel, .class-card, .auth-copy, .auth-card");
const supportsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures for local previews or private browsing.
  }
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

const allRevealElements = [...revealElements, ...pageRevealElements];

allRevealElements.forEach((element, index) => {
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

  allRevealElements.forEach((element) => observer.observe(element));
} else {
  allRevealElements.forEach((element) => element.classList.add("visible"));
}

if (heroVisual && !supportsReducedMotion) {
  window.addEventListener("mousemove", (event) => {
    const xShift = (event.clientX / window.innerWidth - 0.5) * 18;
    const yShift = (event.clientY / window.innerHeight - 0.5) * 18;

    heroVisual.style.transform = `translate3d(${xShift}px, ${yShift * -0.35}px, 0)`;
  });
}

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
  });
}

if (authForms.length > 0) {
  const params = new URLSearchParams(window.location.search);
  const courseFromQuery = params.get("course");
  const storedCourse = safeStorageGet("selectedCourse");
  const signupClassSelect = document.querySelector("#signup-class");

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
    authForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const authType = authForm.dataset.auth;
      const status = authForm.querySelector(".auth-status");

      if (!status) {
        return;
      }

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
      }
    });
  });
}
