(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const requestedRole = params.get("role") === "lawyer" ? "lawyer" : "client";
  const loginRole = document.getElementById("login-role");
  const createAccountLink = document.getElementById("create-account-link");

  if (loginRole) {
    loginRole.value = requestedRole;
    loginRole.addEventListener("change", () => {
      createAccountLink.href = `register.html?role=${encodeURIComponent(loginRole.value)}`;
    });
    createAccountLink.href = `register.html?role=${encodeURIComponent(loginRole.value)}`;
  }

  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      button.textContent = reveal ? "Hide" : "Show";
      button.setAttribute("aria-pressed", String(reveal));
    });
  });

  const registrationForms = {
    client: document.getElementById("client-registration"),
    lawyer: document.getElementById("lawyer-registration")
  };

  function selectRole(role, updateUrl = true) {
    if (!registrationForms.client || !registrationForms.lawyer) return;
    Object.entries(registrationForms).forEach(([name, section]) => {
      section.hidden = name !== role;
    });
    document.querySelectorAll("[data-role-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.roleChoice === role));
    });
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("role", role);
      window.history.replaceState({}, "", url);
    }
  }

  if (registrationForms.client && registrationForms.lawyer) {
    document.querySelectorAll("[data-role-choice]").forEach((button) => {
      button.addEventListener("click", () => selectRole(button.dataset.roleChoice));
    });
    selectRole(requestedRole, false);
  }

  function errorFor(input) {
    return document.getElementById(`${input.id}-error`);
  }

  function setError(input, message) {
    const error = errorFor(input);
    if (!error) return;
    error.setAttribute("aria-live", "polite");
    error.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    const ids = new Set((input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    ids.delete(error.id);
    if (message) ids.add(error.id);
    if (ids.size) input.setAttribute("aria-describedby", [...ids].join(" "));
    else input.removeAttribute("aria-describedby");
  }

  function passwordProblem(value) {
    if (value.length < 8) return "Use at least 8 characters.";
    if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return "Include at least one letter and one number.";
    return "";
  }

  function phoneProblem(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15 ? "" : "Enter a valid phone number.";
  }

  function validateField(input) {
    if (input.disabled) return "";
    let message = "";
    if (input.type === "file") {
      const file = input.files[0];
      if (!file && input.required) message = "Choose an image to continue.";
      else if (file && !["image/jpeg", "image/png"].includes(file.type)) message = "Choose a JPG or PNG image.";
      else if (file && file.size > 5 * 1024 * 1024) message = "The image must be 5 MB or smaller.";
    } else if (input.name === "phone" && input.value.trim()) {
      message = phoneProblem(input.value.trim());
    } else if (input.type === "password" && input.value) {
      message = passwordProblem(input.value);
    } else if (input.type === "number" && input.value !== "") {
      const number = Number(input.value);
      if (input.id === "experience" && (!Number.isFinite(number) || number < 0)) message = "Years of experience cannot be negative.";
      if (input.id === "consultation-fee" && (!Number.isFinite(number) || number <= 0)) message = "Enter a consultation fee greater than 0.";
    } else if (input.type === "email" && input.value && !input.validity.valid) {
      message = "Enter a valid email address.";
    }
    if (!message && input.required && !input.value.trim() && input.type !== "file") message = "This field is required.";
    setError(input, message);
    return message;
  }

  document.querySelectorAll("form").forEach((form) => {
    form.querySelectorAll("input:not([type=checkbox]), select").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);
      });
      input.addEventListener("change", () => validateField(input));
    });
  });

  function setGroupError(name, message) {
    const id = `${name}-error`;
    const error = document.getElementById(id);
    error.setAttribute("aria-live", "polite");
    error.textContent = message;
    document.querySelectorAll(`[name="${name}"]`).forEach((checkbox) => {
      checkbox.setAttribute("aria-invalid", message ? "true" : "false");
      if (message) checkbox.setAttribute("aria-describedby", id);
      else checkbox.removeAttribute("aria-describedby");
    });
  }

  ["specializations", "languages"].forEach((name) => {
    document.querySelectorAll(`[name="${name}"]`).forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (document.querySelector(`[name="${name}"]:checked`)) setGroupError(name, "");
      });
    });
  });

  document.querySelectorAll('input[type="file"]').forEach((input) => {
    let previewUrl = "";
    input.addEventListener("change", () => {
      const preview = document.getElementById(`${input.id}-preview`);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = "";
      preview.replaceChildren();
      const file = input.files[0];
      const error = validateField(input);
      if (!file || error) return;
      previewUrl = URL.createObjectURL(file);
      const image = document.createElement("img");
      image.src = previewUrl;
      image.alt = `Preview of selected ${input.labels[0].textContent.replace("*", "").trim()}`;
      const filename = document.createElement("span");
      filename.textContent = file.name;
      preview.append(image, filename);
    });
  });

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll("input:not([type=checkbox]), select").forEach((input) => {
      if (validateField(input)) valid = false;
    });
    if (form.id === "lawyer-form") {
      ["specializations", "languages"].forEach((name) => {
        const checked = form.querySelector(`[name="${name}"]:checked`);
        const message = checked ? "" : "Select at least one option.";
        setGroupError(name, message);
        if (message) valid = false;
      });
    }
    return valid;
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = document.getElementById("login-message");
      message.textContent = "";
      if (!validateForm(loginForm)) {
        loginForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      const role = document.getElementById("login-role").value;
      const dashboard = role === "lawyer" ? "lawyer/dashboard.html" : "client/dashboard.html";
      message.textContent = `Prototype demo: opening the ${role} portal. No account was authenticated.`;
      window.setTimeout(() => {
        window.location.href = dashboard;
      }, 650);
    });
  }

  const clientForm = document.getElementById("client-form");
  if (clientForm) {
    clientForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = document.getElementById("client-message");
      message.textContent = "";
      if (!validateForm(clientForm)) {
        clientForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      message.textContent = "Prototype success: your details passed validation. No account was created or data saved.";
    });
  }

  const lawyerForm = document.getElementById("lawyer-form");
  if (lawyerForm) {
    lawyerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = document.getElementById("lawyer-message");
      message.textContent = "";
      if (!validateForm(lawyerForm)) {
        lawyerForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      window.location.href = "pending-approval.html";
    });
  }
})();
