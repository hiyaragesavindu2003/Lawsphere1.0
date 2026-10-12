(() => {
  "use strict";

  const mock = window.LawyerPortalMock;
  const page = document.body.dataset.page;

  function formatMoney(amount) {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0
    }).format(Number(amount || 0));
  }

  function formatDate(dateValue) {
    if (!dateValue) return "—";
    const date = new Date(`${dateValue}T12:00:00`);
    return date.toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatTime(value) {
    if (!value) return "—";
    const [hours, minutes] = value.split(":").map(Number);
    return new Date(2020, 0, 1, hours, minutes).toLocaleTimeString("en-LK", {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function statusClass(status) {
    const map = {
      "Pending Review": "status-pending",
      "Awaiting Payment": "status-awaiting",
      "Confirmed": "status-confirmed",
      "Completed": "status-completed",
      "Rejected": "status-rejected",
      "Cancelled": "status-cancelled",
      "Alternative Proposed": "status-alt",
      "New Request": "status-pending",
      "Pending": "status-approval",
      "Approved": "status-confirmed",
      "Processed": "status-confirmed",
      "Scheduled": "status-awaiting"
    };
    return map[status] || "status-pending";
  }

  function renderStatus(status) {
    return `<span class="status-badge ${statusClass(status)}">${status}</span>`;
  }

  function showToast(message, type = "success") {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove("success", "error");
    toast.classList.add(type);
    toast.classList.add("visible");
    clearTimeout(window.__lawyerToastTimer);
    window.__lawyerToastTimer = setTimeout(() => toast.classList.remove("visible"), 2500);
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("visible");
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("visible");
  }

  function initCommonUI() {
    const sidebar = document.querySelector(".portal-sidebar");
    const overlay = document.querySelector(".mobile-overlay");
    const toggleButton = document.querySelector("[data-action='toggle-sidebar']");
    const profileTrigger = document.querySelector(".profile-trigger");
    const profileMenu = document.querySelector(".profile-menu");

    if (toggleButton && sidebar) {
      toggleButton.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("is-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
        if (overlay) {
          overlay.classList.toggle("is-visible", isOpen);
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", () => {
        sidebar?.classList.remove("is-open");
        toggleButton?.setAttribute("aria-expanded", "false");
        overlay.classList.remove("is-visible");
      });
    }

    if (profileTrigger && profileMenu) {
      profileTrigger.addEventListener("click", () => {
        const isOpen = profileMenu.classList.toggle("is-open");
        profileTrigger.setAttribute("aria-expanded", String(isOpen));
      });

      document.addEventListener("click", (event) => {
        if (!profileMenu.contains(event.target) && !profileTrigger.contains(event.target)) {
          profileMenu.classList.remove("is-open");
          profileTrigger.setAttribute("aria-expanded", "false");
        }
      });
    }

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => {
        const modalId = button.getAttribute("data-close-modal");
        closeModal(modalId);
      });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.remove("visible");
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        document.querySelectorAll(".modal.visible").forEach((modal) => modal.classList.remove("visible"));
      }
    });
  }

  function initDashboard() {
    const upcoming = mock.dashboard.upcoming;
    const requests = mock.dashboard.requests;
    const activity = mock.dashboard.activity;
    const stats = mock.stats;

    const summaryEls = {
      totalConsultations: document.getElementById("stat-total-consultations"),
      upcomingConsultations: document.getElementById("stat-upcoming-consultations"),
      pendingRequests: document.getElementById("stat-pending-requests"),
      completedConsultations: document.getElementById("stat-completed-consultations")
    };

    if (summaryEls.totalConsultations) summaryEls.totalConsultations.textContent = stats.totalConsultations;
    if (summaryEls.upcomingConsultations) summaryEls.upcomingConsultations.textContent = stats.upcomingConsultations;
    if (summaryEls.pendingRequests) summaryEls.pendingRequests.textContent = stats.pendingRequests;
    if (summaryEls.completedConsultations) summaryEls.completedConsultations.textContent = stats.completedConsultations;

    const upcomingList = document.getElementById("upcoming-consultations-list");
    if (upcomingList) {
      upcomingList.innerHTML = upcoming.map((item) => `
        <div class="list-item">
          <div class="list-item-main">
            <div class="avatar avatar-lg blue" aria-hidden="true">${item.client.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
            <div class="list-item-copy">
              <strong>${item.client}</strong>
              <span>${formatDate(item.date)} · ${formatTime(item.time)}</span>
            </div>
          </div>
          <div class="context-meta">
            <span>${item.method}</span>
            ${renderStatus(item.status)}
          </div>
        </div>
      `).join("");
    }

    const requestList = document.getElementById("new-request-list");
    if (requestList) {
      requestList.innerHTML = requests.map((item) => `
        <div class="list-item">
          <div class="list-item-main">
            <div class="avatar rose" aria-hidden="true">${item.client.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
            <div class="list-item-copy">
              <strong>${item.client}</strong>
              <small>${formatDate(item.date)} · ${formatTime(item.time)} · ${item.duration} mins</small>
            </div>
          </div>
          <div class="context-meta">
            <span>${item.speciality}</span>
            <div class="action-row">
              <button class="btn btn-primary" type="button" data-action="accept-request" data-request-id="${item.id}">Accept</button>
              <button class="btn btn-secondary" type="button" data-action="reject-request" data-request-id="${item.id}">Reject</button>
            </div>
          </div>
        </div>
      `).join("");
    }

    const activityList = document.getElementById("recent-activity-list");
    if (activityList) {
      activityList.innerHTML = activity.map((item) => `
        <div class="list-item">
          <div class="list-item-main">
            <div class="avatar gold" aria-hidden="true">•</div>
            <div class="list-item-copy">
              <strong>${item.title}</strong>
              <small>${item.detail}</small>
            </div>
          </div>
          <small>${item.time}</small>
        </div>
      `).join("");
    }

    const earningValues = mock.dashboard.earnings;
    const summary = document.getElementById("earnings-summary");
    if (summary) {
      summary.innerHTML = `
        <div class="summary-row"><span>Gross consultation earnings</span><strong>${formatMoney(earningValues.gross)}</strong></div>
        <div class="summary-row"><span>LawSphere commission (10%)</span><strong>-${formatMoney(earningValues.commission)}</strong></div>
        <div class="summary-row"><span>Net lawyer earnings</span><strong>${formatMoney(earningValues.net)}</strong></div>
        <div class="summary-row"><span>Pending settlement</span><strong>${formatMoney(earningValues.pending)}</strong></div>
      `;
    }

    document.querySelectorAll("[data-action='accept-request']").forEach((button) => {
      button.addEventListener("click", () => {
        const requestId = button.getAttribute("data-request-id");
        const request = mock.requests.find((item) => item.id === requestId);
        if (request) {
          request.status = "Awaiting Payment";
          showToast(`Request ${requestId} accepted. The consultation is awaiting verified payment.`, "success");
          initRequests();
        }
      });
    });

    document.querySelectorAll("[data-action='reject-request']").forEach((button) => {
      button.addEventListener("click", () => {
        const requestId = button.getAttribute("data-request-id");
        const request = mock.requests.find((item) => item.id === requestId);
        if (request) {
          request.status = "Rejected";
          showToast(`Request ${requestId} was rejected in the prototype.`, "error");
          initRequests();
        }
      });
    });
  }

  function initRequests() {
    const tableBody = document.getElementById("request-table-body");
    if (!tableBody) return;

    const searchInput = document.getElementById("request-search");
    const statusFilter = document.getElementById("request-status-filter");
    const query = (searchInput?.value || "").trim().toLowerCase();
    const currentStatus = statusFilter?.value || "All";

    const filtered = mock.requests.filter((item) => {
      const matchesQuery = !query || item.client.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
      const matchesStatus = currentStatus === "All" || item.status === currentStatus;
      return matchesQuery && matchesStatus;
    });

    if (!filtered.length) {
      tableBody.innerHTML = '<tr><td colspan="8"><div class="empty-state">No consultation requests match the current search or filter.</div></td></tr>';
      return;
    }

    tableBody.innerHTML = filtered.map((item) => `
      <tr>
        <td data-label="Request ID">${item.id}</td>
        <td data-label="Client">${item.client}</td>
        <td data-label="Requested">${formatDate(item.date)} · ${formatTime(item.time)}</td>
        <td data-label="Method">${item.method}</td>
        <td data-label="Duration">${item.duration} mins</td>
        <td data-label="Fee">${formatMoney(item.fee)}</td>
        <td data-label="Status">${renderStatus(item.status)}</td>
        <td data-label="Actions">
          <div class="table-actions">
            <button class="btn btn-secondary" type="button" data-action="view-request" data-request-id="${item.id}">View Details</button>
            <button class="btn btn-primary" type="button" data-action="accept-request" data-request-id="${item.id}">Accept</button>
            <button class="btn btn-danger" type="button" data-action="reject-request" data-request-id="${item.id}">Reject</button>
            <button class="btn btn-soft" type="button" data-action="propose-request" data-request-id="${item.id}">Propose Alternative</button>
          </div>
        </td>
      </tr>
    `).join("");

    bindRequestButtons();
  }

  function bindRequestButtons() {
    document.querySelectorAll("[data-action='view-request']").forEach((button) => {
      button.addEventListener("click", () => {
        const requestId = button.getAttribute("data-request-id");
        const request = mock.requests.find((item) => item.id === requestId);
        if (!request) return;

        document.getElementById("request-detail-client").textContent = request.client;
        document.getElementById("request-detail-specialty").textContent = request.speciality;
        document.getElementById("request-detail-method").textContent = request.method;
        document.getElementById("request-detail-date").textContent = `${formatDate(request.date)} at ${formatTime(request.time)}`;
        document.getElementById("request-detail-duration").textContent = `${request.duration} minutes`;
        document.getElementById("request-detail-fee").textContent = formatMoney(request.fee);
        document.getElementById("request-detail-id").textContent = request.id;
        openModal("request-detail-modal");
      });
    });

    document.querySelectorAll("[data-action='accept-request']").forEach((button) => {
      button.addEventListener("click", () => {
        const requestId = button.getAttribute("data-request-id");
        const request = mock.requests.find((item) => item.id === requestId);
        if (!request) return;
        request.status = "Awaiting Payment";
        showToast(`Prototype action: ${requestId} accepted. Consultation is awaiting verified payment.`, "success");
        if (page === "dashboard") initDashboard();
        if (page === "requests") initRequests();
      });
    });

    document.querySelectorAll("[data-action='reject-request']").forEach((button) => {
      button.addEventListener("click", () => {
        const requestId = button.getAttribute("data-request-id");
        const request = mock.requests.find((item) => item.id === requestId);
        if (!request) return;
        document.getElementById("reject-request-id").value = requestId;
        const reason = document.getElementById("reject-reason");
        if (reason) reason.value = "";
        openModal("reject-request-modal");
      });
    });

    document.querySelectorAll("[data-action='propose-request']").forEach((button) => {
      button.addEventListener("click", () => {
        const requestId = button.getAttribute("data-request-id");
        const request = mock.requests.find((item) => item.id === requestId);
        if (!request) return;
        document.getElementById("alternative-request-id").value = requestId;
        document.getElementById("proposal-original-date").textContent = `${formatDate(request.date)} ${formatTime(request.time)}`;
        const dateField = document.getElementById("proposal-date");
        const timeField = document.getElementById("proposal-time");
        if (dateField) dateField.min = new Date().toISOString().split("T")[0];
        if (dateField) dateField.value = request.date;
        if (timeField) timeField.value = request.time;
        openModal("proposal-modal");
      });
    });
  }

  function initConsultations() {
    const tableBody = document.getElementById("consultation-table-body");
    if (!tableBody) return;

    const queryInput = document.getElementById("consultation-search");
    const statusFilter = document.getElementById("consultation-status-filter");
    const query = (queryInput?.value || "").trim().toLowerCase();
    const statusValue = statusFilter?.value || "All";

    const filtered = mock.consultations.filter((item) => {
      const matchesQuery = !query || item.client.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
      const matchesStatus = statusValue === "All" || item.status === statusValue;
      return matchesQuery && matchesStatus;
    });

    if (!filtered.length) {
      tableBody.innerHTML = '<tr><td colspan="8"><div class="empty-state">No consultations match the current filter.</div></td></tr>';
      return;
    }

    tableBody.innerHTML = filtered.map((item) => `
      <tr>
        <td data-label="Booking ID">${item.id}</td>
        <td data-label="Client">${item.client}</td>
        <td data-label="Date">${formatDate(item.date)} · ${formatTime(item.time)}</td>
        <td data-label="Method">${item.method}</td>
        <td data-label="Duration">${item.duration} mins</td>
        <td data-label="Fee">${formatMoney(item.fee)}</td>
        <td data-label="Status">${renderStatus(item.status)}</td>
        <td data-label="Actions">
          <div class="table-actions">
            <button class="btn btn-secondary" type="button" data-action="view-consultation" data-consultation-id="${item.id}">View Details</button>
            ${item.status === "Confirmed" ? `<button class="btn btn-primary" type="button" data-action="complete-consultation" data-consultation-id="${item.id}">Mark as Completed</button>` : ""}
            <button class="btn btn-ghost" type="button" data-action="cancel-consultation" data-consultation-id="${item.id}">Request Cancellation</button>
          </div>
        </td>
      </tr>
    `).join("");

    document.querySelectorAll("[data-action='view-consultation']").forEach((button) => {
      button.addEventListener("click", () => {
        const consultationId = button.getAttribute("data-consultation-id");
        const item = mock.consultations.find((entry) => entry.id === consultationId);
        if (!item) return;

        document.getElementById("consultation-detail-id").textContent = item.id;
        document.getElementById("consultation-detail-client").textContent = item.client;
        document.getElementById("consultation-detail-date").textContent = `${formatDate(item.date)} at ${formatTime(item.time)}`;
        document.getElementById("consultation-detail-method").textContent = item.method;
        document.getElementById("consultation-detail-duration").textContent = `${item.duration} minutes`;
        document.getElementById("consultation-detail-fee").textContent = formatMoney(item.fee);
        document.getElementById("consultation-detail-status").innerHTML = renderStatus(item.status);
        document.getElementById("consultation-detail-link").textContent = item.meetingLink || "No external meeting link provided yet.";
        openModal("consultation-detail-modal");
      });
    });

    document.querySelectorAll("[data-action='complete-consultation']").forEach((button) => {
      button.addEventListener("click", () => {
        const consultationId = button.getAttribute("data-consultation-id");
        document.getElementById("complete-consultation-id").value = consultationId;
        openModal("complete-consultation-modal");
      });
    });

    document.querySelectorAll("[data-action='cancel-consultation']").forEach((button) => {
      button.addEventListener("click", () => {
        const consultationId = button.getAttribute("data-consultation-id");
        document.getElementById("cancel-consultation-id").value = consultationId;
        openModal("cancel-consultation-modal");
      });
    });
  }

  function initProfileForm() {
    const form = document.getElementById("lawyer-profile-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const requiredFields = [
        document.getElementById("profile-first-name"),
        document.getElementById("profile-last-name"),
        document.getElementById("profile-email"),
        document.getElementById("profile-phone"),
        document.getElementById("profile-licence"),
        document.getElementById("profile-bar-id"),
        document.getElementById("profile-qualification"),
        document.getElementById("profile-bio"),
        document.getElementById("profile-district"),
        document.getElementById("profile-city")
      ];

      let valid = true;
      requiredFields.forEach((field) => {
        const error = field.closest(".field").querySelector(".error-message");
        if (!field.value.trim()) {
          valid = false;
          if (error) error.textContent = "This field is required.";
        } else if (error) {
          error.textContent = "";
        }
      });

      const emailField = document.getElementById("profile-email");
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.closest(".field").querySelector(".error-message").textContent = "Enter a valid email address.";
      }

      if (valid) {
        const status = document.getElementById("verification-status");
        if (status) status.textContent = "Pending re-verification";
        const formStatus = document.getElementById("profile-form-message");
        if (formStatus) formStatus.textContent = "Profile saved as a prototype. Changes to licence, Bar Council ID, or verification evidence require administrator review.";
        showToast("Profile updated in prototype. Re-verification remains pending.", "success");
      }
    });
  }

  function initEarnings() {
    const gross = document.getElementById("gross-earnings-value");
    const commission = document.getElementById("commission-earnings-value");
    const net = document.getElementById("net-earnings-value");
    const pending = document.getElementById("pending-settlement-value");
    if (gross) gross.textContent = formatMoney(mock.earnings.gross);
    if (commission) commission.textContent = `-${formatMoney(mock.earnings.commission)}`;
    if (net) net.textContent = formatMoney(mock.earnings.net);
    if (pending) pending.textContent = formatMoney(mock.earnings.pending);

    const historyBody = document.getElementById("earnings-history-body");
    if (historyBody) {
      historyBody.innerHTML = mock.earnings.history.map((row) => `
        <tr>
          <td data-label="Booking ID">${row.bookingId}</td>
          <td data-label="Client">${row.client}</td>
          <td data-label="Consultation date">${formatDate(row.date)}</td>
          <td data-label="Gross fee">${formatMoney(row.gross)}</td>
          <td data-label="Commission">${formatMoney(row.commission)}</td>
          <td data-label="Net earnings">${formatMoney(row.net)}</td>
          <td data-label="Status">${renderStatus(row.status)}</td>
        </tr>
      `).join("");
    }

    const settlementBody = document.getElementById("settlement-history-body");
    if (settlementBody) {
      settlementBody.innerHTML = mock.earnings.settlements.map((row) => `
        <tr>
          <td data-label="Reference">${row.reference}</td>
          <td data-label="Settlement period">${row.period}</td>
          <td data-label="Amount">${formatMoney(row.amount)}</td>
          <td data-label="Status">${renderStatus(row.status)}</td>
          <td data-label="Date">${formatDate(row.date)}</td>
        </tr>
      `).join("");
    }
  }

  function initReviews() {
    const reviews = mock.reviews;
    const total = reviews.length;
    const average = reviews.reduce((sum, item) => sum + item.rating, 0) / total;

    const summaryEl = document.getElementById("review-summary");
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="summary-row"><span>Average rating</span><strong>${average.toFixed(1)} / 5</strong></div>
        <div class="summary-row"><span>Total reviews</span><strong>${total}</strong></div>
      `;
    }

    const list = document.getElementById("review-cards");
    if (list) {
      list.innerHTML = reviews.map((review) => `
        <article class="review-card">
          <div class="review-head">
            <strong>${review.client}</strong>
            <span class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
          </div>
          <small>${review.consultation} · ${formatDate(review.date)}</small>
          <p>${review.comment}</p>
        </article>
      `).join("");
    }
  }

  function initNotifications() {
    const list = document.getElementById("notification-list");
    if (!list) return;

    list.innerHTML = mock.notifications.map((item) => `
      <article class="notification-item ${item.read ? "" : "unread"}">
        <div class="notification-copy">
          <strong>${item.title}</strong>
          <p>${item.detail}</p>
        </div>
        <div class="context-meta">
          <span class="notification-time">${item.time}</span>
          <button class="btn btn-secondary" type="button" data-action="mark-notification-read" data-notification-id="${item.id}">${item.read ? "Read" : "Mark as read"}</button>
        </div>
      </article>
    `).join("");

    document.querySelectorAll("[data-action='mark-notification-read']").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-notification-id");
        const item = mock.notifications.find((entry) => entry.id === id);
        if (!item) return;
        item.read = true;
        button.textContent = "Read";
        button.closest(".notification-item").classList.remove("unread");
        showToast("Notification marked as read.", "success");
      });
    });

    const markAll = document.getElementById("mark-all-read");
    if (markAll) {
      markAll.addEventListener("click", () => {
        mock.notifications.forEach((item) => { item.read = true; });
        initNotifications();
        showToast("All notifications marked as read.", "success");
      });
    }
  }

  function initSettings() {
    const passwordForm = document.getElementById("change-password-form");
    if (passwordForm) {
      passwordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const password = document.getElementById("new-password").value;
        const confirm = document.getElementById("confirm-password").value;
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
          showToast("Password must have at least 8 characters, include a letter and a number.", "error");
          return;
        }
        if (password !== confirm) {
          showToast("Passwords do not match.", "error");
          return;
        }
        showToast("Prototype password change submitted. No data was stored.", "success");
        passwordForm.reset();
      });
    }

    const prefsForm = document.getElementById("preference-form");
    if (prefsForm) {
      prefsForm.addEventListener("submit", (event) => {
        event.preventDefault();
        showToast("Notification preferences updated in the prototype.", "success");
      });
    }
  }

  function bindModalsAndForms() {
    document.getElementById("reject-request-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const requestId = document.getElementById("reject-request-id").value;
      const request = mock.requests.find((item) => item.id === requestId);
      if (request) {
        request.status = "Rejected";
        showToast(`Request ${requestId} marked as rejected.`, "error");
      }
      closeModal("reject-request-modal");
      if (page === "requests") initRequests();
    });

    document.getElementById("proposal-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const requestId = document.getElementById("alternative-request-id").value;
      const date = document.getElementById("proposal-date").value;
      const time = document.getElementById("proposal-time").value;
      const request = mock.requests.find((item) => item.id === requestId);
      if (request) {
        request.status = "Alternative Proposed";
        request.proposedDate = date;
        request.proposedTime = time;
      }
      showToast(`Alternative time proposed for ${requestId}. Client must accept it first.`, "success");
      closeModal("proposal-modal");
      if (page === "requests") initRequests();
    });

    document.getElementById("complete-consultation-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const consultationId = document.getElementById("complete-consultation-id").value;
      const consultation = mock.consultations.find((item) => item.id === consultationId);
      if (consultation) {
        consultation.status = "Completed";
        showToast(`Consultation ${consultationId} marked as completed.`, "success");
      }
      closeModal("complete-consultation-modal");
      if (page === "consultations") initConsultations();
    });

    document.getElementById("cancel-consultation-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const consultationId = document.getElementById("cancel-consultation-id").value;
      const consultation = mock.consultations.find((item) => item.id === consultationId);
      if (consultation) {
        consultation.status = "Cancelled";
        showToast(`Cancellation request submitted for ${consultationId}. Admin review is required.`, "success");
      }
      closeModal("cancel-consultation-modal");
      if (page === "consultations") initConsultations();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCommonUI();
    bindModalsAndForms();

    if (page === "dashboard") {
      initDashboard();
    }

    if (page === "requests") {
      initRequests();
      const searchInput = document.getElementById("request-search");
      const statusFilter = document.getElementById("request-status-filter");
      searchInput?.addEventListener("input", initRequests);
      statusFilter?.addEventListener("change", initRequests);
    }

    if (page === "consultations") {
      initConsultations();
      const searchInput = document.getElementById("consultation-search");
      const statusFilter = document.getElementById("consultation-status-filter");
      searchInput?.addEventListener("input", initConsultations);
      statusFilter?.addEventListener("change", initConsultations);
    }

    if (page === "profile") {
      initProfileForm();
    }

    if (page === "earnings") {
      initEarnings();
    }

    if (page === "reviews") {
      initReviews();
    }

    if (page === "notifications") {
      initNotifications();
    }

    if (page === "settings") {
      initSettings();
    }
  });
})();
