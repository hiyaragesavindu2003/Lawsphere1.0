(function () {
  "use strict";

  const mock = window.AdminPortalMock || {};
  const page = document.body ? document.body.dataset.page : "";

  function formatMoney(value) {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-LK").format(Number(value || 0));
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-LK", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-LK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function statusClass(status) {
    const map = {
      Pending: "status-pending",
      Approved: "status-approved",
      Rejected: "status-rejected",
      "Pending Review": "status-review",
      "Awaiting Payment": "status-awaiting",
      Confirmed: "status-confirmed",
      Cancelled: "status-cancelled",
      Processing: "status-processing",
      Completed: "status-completed",
      Suspended: "status-suspended",
      Active: "status-active",
      Draft: "status-draft",
      Settled: "status-settled",
      "Alternative Proposed": "status-alt",
      Paid: "status-paid",
      Failed: "status-failed",
      Refunded: "status-refunded",
      Published: "status-approved",
      Flagged: "status-flagged",
      "Pending Lawyer Response": "status-pending",
      "New Request": "status-pending",
      "Awaiting Review": "status-review",
      "Hidden": "status-hidden"
    };
    return map[status] || "status-pending";
  }

  function renderStatus(status) {
    const safeStatus = status || "Pending";
    return `<span class="status-badge ${statusClass(safeStatus)}">${safeStatus}</span>`;
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
    clearTimeout(window.__lawSphereAdminToastTimer);
    window.__lawSphereAdminToastTimer = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2600);
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("visible");
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("visible");
  }

  function initCommonUI() {
    const sidebar = document.querySelector(".admin-sidebar");
    const overlay = document.querySelector(".mobile-overlay");
    const toggleButton = document.querySelector("[data-action='toggle-sidebar']");

    if (toggleButton && sidebar) {
      toggleButton.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("is-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
        if (overlay) overlay.classList.toggle("is-visible", isOpen);
      });
    }

    if (overlay && sidebar) {
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("is-open");
        if (toggleButton) toggleButton.setAttribute("aria-expanded", "false");
        overlay.classList.remove("is-visible");
      });
    }

    const profileTrigger = document.querySelector(".profile-trigger");
    const profileMenu = document.querySelector(".profile-menu");
    if (profileTrigger && profileMenu) {
      profileTrigger.addEventListener("click", (event) => {
        event.stopPropagation();
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
        if (modalId) closeModal(modalId);
      });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.classList.remove("visible");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        document.querySelectorAll(".modal.visible").forEach((modal) => modal.classList.remove("visible"));
      }
    });
  }

  function renderDashboard() {
    const stats = mock.stats || {};
    const dashboardDate = document.getElementById("dashboard-date");
    if (dashboardDate) {
      dashboardDate.textContent = new Date().toLocaleDateString("en-LK", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }

    const statMap = {
      "stat-total-clients": stats.totalClients,
      "stat-total-lawyers": stats.totalLawyers,
      "stat-pending-lawyer-approvals": stats.pendingLawyerApprovals,
      "stat-total-consultations": stats.totalConsultations,
      "stat-completed-consultations": stats.completedConsultations,
      "stat-total-payment-volume": formatMoney(stats.totalPaymentVolume),
      "stat-platform-commission": formatMoney(stats.platformCommissionRevenue),
      "stat-pending-settlements": stats.pendingLawyerSettlements
    };

    Object.entries(statMap).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const bookingChart = document.getElementById("booking-chart");
    if (bookingChart && Array.isArray(mock.bookingActivity) && mock.bookingActivity.length) {
      const maxValue = Math.max(...mock.bookingActivity.map((item) => item.count));
      bookingChart.innerHTML = mock.bookingActivity.map((item) => {
        const height = Math.max(18, (item.count / maxValue) * 100);
        return `
          <div class="bar-column">
            <div class="bar-shell">
              <div class="bar" style="height: ${height}%" aria-label="${item.month}: ${item.count} bookings"></div>
            </div>
            <span class="bar-label">${item.month}</span>
          </div>
        `;
      }).join("");
    }

    const kpiConsultationVolume = document.getElementById("kpi-consultation-volume");
    if (kpiConsultationVolume) {
      kpiConsultationVolume.textContent = formatMoney(mock.revenueComparison?.consultationVolume || 0);
    }

    const kpiCommissionRevenue = document.getElementById("kpi-commission-revenue");
    if (kpiCommissionRevenue) {
      kpiCommissionRevenue.textContent = formatMoney(mock.revenueComparison?.commissionRevenue || 0);
    }

    const kpiMonthlyChange = document.getElementById("kpi-monthly-change");
    if (kpiMonthlyChange) {
      kpiMonthlyChange.textContent = `${Number(mock.revenueComparison?.monthlyChange || 0).toFixed(1)}%`;
    }

    const pendingList = document.getElementById("pending-applications-list");
    if (pendingList && Array.isArray(mock.verificationApplications)) {
      const pending = mock.verificationApplications.filter((item) => item.status === "Pending").slice(0, 3);
      pendingList.innerHTML = pending.length
        ? pending.map((item) => `
            <div class="list-item">
              <div class="list-item-main">
                <span class="avatar gold" aria-hidden="true">${item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                <div class="list-item-copy">
                  <strong>${item.name}</strong>
                  <small>${item.specialization} · ${item.district}</small>
                </div>
              </div>
              <div class="context-meta">
                <span>${formatDate(item.submitted)}</span>
                ${renderStatus(item.status)}
              </div>
            </div>
          `).join("")
        : '<div class="empty-state">No pending lawyer applications.</div>';
    }

    const recentActivity = document.getElementById("recent-activity-list");
    if (recentActivity && Array.isArray(mock.activityLog)) {
      recentActivity.innerHTML = mock.activityLog.slice(0, 4).map((item) => `
        <div class="list-item">
          <div class="list-item-main">
            <span class="avatar blue" aria-hidden="true">${item.admin.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
            <div class="list-item-copy">
              <strong>${item.action}</strong>
              <small>${item.target} · ${item.reason}</small>
            </div>
          </div>
          <small>${item.date}</small>
        </div>
      `).join("");
    }
  }

  function renderVerification() {
    const rows = Array.isArray(mock.verificationApplications) ? mock.verificationApplications : [];
    const summary = {
      total: rows.length,
      pending: rows.filter((row) => row.status === "Pending").length,
      approved: rows.filter((row) => row.status === "Approved").length,
      rejected: rows.filter((row) => row.status === "Rejected").length
    };

    const totalEl = document.getElementById("verification-total");
    const pendingEl = document.getElementById("verification-pending");
    const approvedEl = document.getElementById("verification-approved");
    const rejectedEl = document.getElementById("verification-rejected");
    if (totalEl) totalEl.textContent = summary.total;
    if (pendingEl) pendingEl.textContent = summary.pending;
    if (approvedEl) approvedEl.textContent = summary.approved;
    if (rejectedEl) rejectedEl.textContent = summary.rejected;

    const tableBody = document.getElementById("verification-table-body");
    const searchField = document.getElementById("verification-search");
    const filterField = document.getElementById("verification-status-filter");

    function applyFilters() {
      const term = (searchField ? searchField.value : "").trim().toLowerCase();
      const status = filterField ? filterField.value : "All";
      const filtered = rows.filter((row) => {
        const matchesStatus = status === "All" || row.status === status;
        const matchesTerm = !term || [row.name, row.id, row.email, row.licenceNumber].join(" ").toLowerCase().includes(term);
        return matchesStatus && matchesTerm;
      });

      if (!tableBody) return;
      if (!filtered.length) {
        tableBody.innerHTML = '<tr><td colspan="10"><div class="empty-state">No verification applications match the current filter.</div></td></tr>';
        return;
      }

      tableBody.innerHTML = filtered.map((row) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.phone}</td>
          <td>${row.licenceNumber}</td>
          <td>${row.barCouncilId}</td>
          <td>${row.specialization}</td>
          <td>${formatDate(row.submitted)}</td>
          <td>${renderStatus(row.status)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-secondary" type="button" data-open-application="${row.id}">Review</button>
            </div>
          </td>
        </tr>
      `).join("");

      tableBody.querySelectorAll("[data-open-application]").forEach((button) => {
        button.addEventListener("click", () => {
          const app = rows.find((item) => item.id === button.getAttribute("data-open-application"));
          if (!app) return;
          fillVerificationDetail(app);
          openModal("verification-detail-modal");
        });
      });
    }

    if (searchField) searchField.addEventListener("input", applyFilters);
    if (filterField) filterField.addEventListener("change", applyFilters);
    applyFilters();

    const approveButton = document.querySelector("[data-action='approve-verification']");
    const rejectButton = document.querySelector("[data-action='reject-verification-request']");
    const confirmApprove = document.getElementById("confirm-approve-verification");
    const confirmReject = document.getElementById("confirm-reject-verification");

    approveButton?.addEventListener("click", () => {
      const id = approveButton.getAttribute("data-verification-id");
      const applyId = document.getElementById("approve-verification-id");
      if (applyId) applyId.value = id || "";
      openModal("verification-approve-modal");
    });

    rejectButton?.addEventListener("click", () => {
      const id = rejectButton.getAttribute("data-verification-id");
      const applyId = document.getElementById("reject-verification-id");
      if (applyId) applyId.value = id || "";
      openModal("verification-reject-modal");
    });

    confirmApprove?.addEventListener("click", () => {
      const id = document.getElementById("approve-verification-id")?.value;
      const selected = rows.find((item) => item.id === id);
      if (selected) selected.status = "Approved";
      closeModal("verification-approve-modal");
      closeModal("verification-detail-modal");
      renderVerification();
      showToast("Lawyer application marked as approved in this prototype.");
    });

    confirmReject?.addEventListener("click", () => {
      const id = document.getElementById("reject-verification-id")?.value;
      const reason = document.getElementById("verification-rejection-reason")?.value.trim();
      if (!reason) {
        showToast("Please provide a rejection reason before submitting.", "error");
        return;
      }
      const selected = rows.find((item) => item.id === id);
      if (selected) selected.status = "Rejected";
      closeModal("verification-reject-modal");
      closeModal("verification-detail-modal");
      document.getElementById("verification-rejection-reason").value = "";
      renderVerification();
      showToast("Lawyer application rejected in this prototype.", "error");
    });
  }

  function fillVerificationDetail(app) {
    const fields = {
      "verification-detail-name": app.name,
      "verification-detail-email": app.email,
      "verification-detail-phone": app.phone,
      "verification-detail-licence": app.licenceNumber,
      "verification-detail-bar": app.barCouncilId,
      "verification-detail-specialization": app.specialization,
      "verification-detail-location": `${app.district}, ${app.city}`,
      "verification-detail-status": app.status
    };

    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const approveButton = document.querySelector("[data-action='approve-verification']");
    const rejectButton = document.querySelector("[data-action='reject-verification-request']");
    if (approveButton) approveButton.setAttribute("data-verification-id", app.id);
    if (rejectButton) rejectButton.setAttribute("data-verification-id", app.id);
  }

  function renderUsers() {
    const rows = Array.isArray(mock.users) ? mock.users : [];
    const total = rows.length;
    const activeClients = rows.filter((row) => row.role === "Client" && row.status === "Active").length;
    const approvedLawyers = rows.filter((row) => row.role === "Lawyer" && row.status === "Approved").length;
    const suspended = rows.filter((row) => row.status === "Suspended").length;

    const ids = [
      ["users-total", total],
      ["users-active-clients", activeClients],
      ["users-approved-lawyers", approvedLawyers],
      ["users-suspended", suspended]
    ];

    ids.forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const tableBody = document.getElementById("users-table-body");
    const searchField = document.getElementById("users-search");
    const roleFilter = document.getElementById("users-role-filter");
    const statusFilter = document.getElementById("users-status-filter");

    function applyFilters() {
      const term = (searchField ? searchField.value : "").trim().toLowerCase();
      const roleValue = roleFilter ? roleFilter.value : "All";
      const statusValue = statusFilter ? statusFilter.value : "All";
      const filtered = rows.filter((row) => {
        const matchesRole = roleValue === "All" || row.role === roleValue;
        const matchesStatus = statusValue === "All" || row.status === statusValue;
        const matchesTerm = !term || [row.name, row.email, row.id].join(" ").toLowerCase().includes(term);
        return matchesRole && matchesStatus && matchesTerm;
      });

      if (!tableBody) return;
      if (!filtered.length) {
        tableBody.innerHTML = '<tr><td colspan="8"><div class="empty-state">No users match the current filter.</div></td></tr>';
        return;
      }

      tableBody.innerHTML = filtered.map((row) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.phone}</td>
          <td>${row.role}</td>
          <td>${formatDate(row.registered)}</td>
          <td>${renderStatus(row.status)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-secondary" type="button" data-open-user="${row.id}">View</button>
            </div>
          </td>
        </tr>
      `).join("");

      tableBody.querySelectorAll("[data-open-user]").forEach((button) => {
        button.addEventListener("click", () => {
          const user = rows.find((item) => item.id === button.getAttribute("data-open-user"));
          if (!user) return;
          fillUserDetail(user);
          openModal("user-modal");
        });
      });
    }

    if (searchField) searchField.addEventListener("input", applyFilters);
    if (roleFilter) roleFilter.addEventListener("change", applyFilters);
    if (statusFilter) statusFilter.addEventListener("change", applyFilters);
    applyFilters();

    const suspendButton = document.getElementById("suspend-user-action");
    const reactivateButton = document.getElementById("reactivate-user-action");

    suspendButton?.addEventListener("click", () => {
      const id = document.getElementById("user-detail-id")?.textContent;
      const user = rows.find((item) => item.id === id);
      if (user) user.status = "Suspended";
      closeModal("user-modal");
      renderUsers();
      showToast("User account suspended in this prototype.", "error");
    });

    reactivateButton?.addEventListener("click", () => {
      const id = document.getElementById("user-detail-id")?.textContent;
      const user = rows.find((item) => item.id === id);
      if (user) user.status = user.role === "Lawyer" ? "Approved" : "Active";
      closeModal("user-modal");
      renderUsers();
      showToast("User account reactivated in this prototype.");
    });
  }

  function fillUserDetail(user) {
    const ids = {
      "user-detail-id": user.id,
      "user-detail-name": user.name,
      "user-detail-email": user.email,
      "user-detail-phone": user.phone,
      "user-detail-role": user.role,
      "user-detail-registration": formatDate(user.registered),
      "user-detail-status": user.status
    };

    Object.entries(ids).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  function renderBookings() {
    const rows = Array.isArray(mock.bookings) ? mock.bookings : [];
    const tableBody = document.getElementById("bookings-table-body");
    const searchField = document.getElementById("bookings-search");
    const statusFilter = document.getElementById("bookings-status-filter");
    const paymentFilter = document.getElementById("bookings-payment-filter");

    function applyFilters() {
      const term = (searchField ? searchField.value : "").trim().toLowerCase();
      const statusValue = statusFilter ? statusFilter.value : "All";
      const paymentValue = paymentFilter ? paymentFilter.value : "All";
      const filtered = rows.filter((row) => {
        const matchesStatus = statusValue === "All" || row.bookingStatus === statusValue;
        const matchesPayment = paymentValue === "All" || row.paymentStatus === paymentValue;
        const matchesTerm = !term || [row.id, row.client, row.lawyer, row.specialization].join(" ").toLowerCase().includes(term);
        return matchesStatus && matchesPayment && matchesTerm;
      });

      if (!tableBody) return;
      if (!filtered.length) {
        tableBody.innerHTML = '<tr><td colspan="10"><div class="empty-state">No bookings match the current filter.</div></td></tr>';
        return;
      }

      tableBody.innerHTML = filtered.map((row) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.client}</td>
          <td>${row.lawyer}</td>
          <td>${row.specialization}</td>
          <td>${formatDate(row.date)} · ${row.time}</td>
          <td>${row.method}</td>
          <td>${formatMoney(row.fee)}</td>
          <td>${renderStatus(row.bookingStatus)}</td>
          <td>${renderStatus(row.paymentStatus)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-secondary" type="button" data-open-booking="${row.id}">View</button>
            </div>
          </td>
        </tr>
      `).join("");

      tableBody.querySelectorAll("[data-open-booking]").forEach((button) => {
        button.addEventListener("click", () => {
          const booking = rows.find((item) => item.id === button.getAttribute("data-open-booking"));
          if (!booking) return;
          fillBookingDetail(booking);
          openModal("booking-detail-modal");
        });
      });
    }

    if (searchField) searchField.addEventListener("input", applyFilters);
    if (statusFilter) statusFilter.addEventListener("change", applyFilters);
    if (paymentFilter) paymentFilter.addEventListener("change", applyFilters);
    applyFilters();
  }

  function fillBookingDetail(booking) {
    const ids = {
      "booking-detail-id": booking.id,
      "booking-detail-client": booking.client,
      "booking-detail-lawyer": booking.lawyer,
      "booking-detail-specialization": booking.specialization,
      "booking-detail-date": `${formatDate(booking.date)} at ${booking.time}`,
      "booking-detail-method": booking.method,
      "booking-detail-fee": formatMoney(booking.fee),
      "booking-detail-booking-status": booking.bookingStatus,
      "booking-detail-payment-status": booking.paymentStatus
    };

    Object.entries(ids).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  function renderPayments() {
    const rows = Array.isArray(mock.payments) ? mock.payments : [];
    const totalVolume = rows.reduce((sum, row) => sum + Number(row.gross || 0), 0);
    const successful = rows.filter((row) => row.status === "Paid").length;
    const pending = rows.filter((row) => row.status === "Pending").length;
    const commission = rows.reduce((sum, row) => sum + Number(row.commission || 0), 0);

    const ids = {
      "payments-total-volume": formatMoney(totalVolume),
      "payments-successful": successful,
      "payments-pending": pending,
      "payments-commission": formatMoney(commission)
    };

    Object.entries(ids).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const tbody = document.getElementById("payments-table-body");
    if (tbody) {
      tbody.innerHTML = rows.map((row) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.bookingId}</td>
          <td>${row.client}</td>
          <td>${row.lawyer}</td>
          <td>${formatMoney(row.gross)}</td>
          <td>${formatMoney(row.commission)}</td>
          <td>${formatMoney(row.net)}</td>
          <td>${formatDate(row.paidOn)}</td>
          <td>${renderStatus(row.status)}</td>
          <td>${row.reference}</td>
        </tr>
      `).join("");
    }
  }

  function renderSettlements() {
    const rows = Array.isArray(mock.settlements) ? mock.settlements : [];
    const totalPayables = rows.reduce((sum, row) => sum + Number(row.gross || 0), 0);
    const pendingCount = rows.filter((row) => row.status === "Pending").length;
    const completedCount = rows.filter((row) => row.status === "Settled").length;
    const recoverable = rows.reduce((sum, row) => sum + Number(row.recoverableBalance || 0), 0);

    const ids = {
      "settlements-total-payables": formatMoney(totalPayables),
      "settlements-pending": pendingCount,
      "settlements-completed": completedCount,
      "settlements-recoverable": formatMoney(recoverable)
    };

    Object.entries(ids).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    const tbody = document.getElementById("settlements-table-body");
    if (tbody) {
      tbody.innerHTML = rows.map((row) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.lawyer}</td>
          <td>${row.period}</td>
          <td>${formatMoney(row.gross)}</td>
          <td>${formatMoney(row.commission)}</td>
          <td>${formatMoney(row.refundAdjustment)}</td>
          <td>${formatMoney(row.recoverableBalance)}</td>
          <td>${formatMoney(row.net)}</td>
          <td>${renderStatus(row.status)}</td>
          <td>${formatDate(row.date)}</td>
          <td><button class="btn btn-secondary" type="button">Release</button></td>
        </tr>
      `).join("");
    }
  }

  function renderReviews() {
    const rows = Array.isArray(mock.reviews) ? mock.reviews : [];
    const tableBody = document.getElementById("reviews-table-body");
    const ratingFilter = document.getElementById("reviews-rating-filter");
    const statusFilter = document.getElementById("reviews-status-filter");

    function applyFilters() {
      const ratingValue = ratingFilter ? ratingFilter.value : "All";
      const statusValue = statusFilter ? statusFilter.value : "All";
      const filtered = rows.filter((row) => {
        const matchesRating = ratingValue === "All" || String(row.rating) === ratingValue;
        const matchesStatus = statusValue === "All" || row.status === statusValue;
        return matchesRating && matchesStatus;
      });

      if (!tableBody) return;
      if (!filtered.length) {
        tableBody.innerHTML = '<tr><td colspan="8"><div class="empty-state">No reviews match the current filter.</div></td></tr>';
        return;
      }

      tableBody.innerHTML = filtered.map((row) => `
        <tr>
          <td>${row.id}</td>
          <td>${row.client}</td>
          <td>${row.lawyer}</td>
          <td>${row.bookingId}</td>
          <td>${"★".repeat(row.rating)}${"☆".repeat(5 - row.rating)}</td>
          <td>${formatDate(row.date)}</td>
          <td>${renderStatus(row.status)}</td>
          <td><button class="btn btn-secondary" type="button">Moderate</button></td>
        </tr>
      `).join("");
    }

    if (ratingFilter) ratingFilter.addEventListener("change", applyFilters);
    if (statusFilter) statusFilter.addEventListener("change", applyFilters);
    applyFilters();
  }

  function renderNotifications() {
    const rows = Array.isArray(mock.notifications) ? mock.notifications : [];
    const list = document.getElementById("notifications-list");
    const unreadCount = rows.filter((item) => !item.read).length;
    const summary = document.getElementById("notifications-summary");
    if (summary) summary.textContent = `${unreadCount} unread`;

    if (!list) return;
    list.innerHTML = rows.map((notification) => `
      <div class="list-item ${notification.read ? "" : "unread"}">
        <div class="list-item-main">
          <span class="avatar ${notification.read ? "slate" : "blue"}" aria-hidden="true">•</span>
          <div class="list-item-copy">
            <strong>${notification.title}</strong>
            <small>${notification.detail}</small>
          </div>
        </div>
        <div class="context-meta">
          <span>${notification.time}</span>
          <div class="table-actions">
            <button class="btn btn-secondary" type="button" data-mark-read="${notification.id}">${notification.read ? "Read" : "Mark as read"}</button>
          </div>
        </div>
      </div>
    `).join("");

    list.querySelectorAll("[data-mark-read]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-mark-read");
        const item = rows.find((row) => row.id === id);
        if (item) item.read = true;
        renderNotifications();
        showToast("Notification marked as read.");
      });
    });

    const markAll = document.getElementById("mark-all-notifications-read");
    markAll?.addEventListener("click", () => {
      rows.forEach((item) => { item.read = true; });
      renderNotifications();
      showToast("All notifications marked as read.");
    });
  }

  function renderSettings() {
    const form = document.getElementById("settings-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Settings saved in this prototype only.");
    });

    const passwordForm = document.getElementById("settings-password-form");
    passwordForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Password change requested in prototype only.");
    });
  }

  function initPage() {
    initCommonUI();
    const renderers = {
      dashboard: renderDashboard,
      verification: renderVerification,
      users: renderUsers,
      bookings: renderBookings,
      payments: renderPayments,
      settlements: renderSettlements,
      reviews: renderReviews,
      notifications: renderNotifications,
      settings: renderSettings
    };

    if (renderers[page]) {
      renderers[page]();
    }
  }

  document.addEventListener("DOMContentLoaded", initPage);
})();
