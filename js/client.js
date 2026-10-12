(() => {
  "use strict";

  const mock = window.LawSphereMock;
  if (!mock) return;

  const page = document.body.dataset.page;
  const client = { name: "Nimal", fullName: "Nimal Perera", initials: "NP", email: "nimal.perera@example.com", phone: "+94 77 456 8910" };
  const reviewedIds = new Set(mock.reviews.map((review) => review.bookingId));
  let selectedStatus = "All";
  let toastTimer;

  const icons = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18m-5 5h2"/>',
    star: '<path d="m12 3 2.75 5.58 6.16.9-4.45 4.34 1.05 6.13L12 17.06l-5.51 2.9 1.05-6.13L3.1 9.48l6.16-.9L12 3Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9L16 21h-3l-.4-2.1a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4 1.5-1.2a7 7 0 0 1 0-1.8l-1.5-1.3 1.4-2.4 1.8.6a8 8 0 0 1 1.5-.9L13 7h3l.3 2.2a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.5 1.2a8 8 0 0 1-.1 1.9ZM8.5 6.5 7 5m9.5 1.5L18 5M8 18l-1.5 1.5m9.5-1.5 1.5 1.5"/>',
    logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    building: '<path d="M4 21V4l8-2v19m0-13h8v13M2 21h20M7 6v1m0 4v1m0 4v1m9-3v1m3-1v1"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.4Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };

  function icon(name, className = "") {
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || icons.grid}</svg>`;
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function money(amount) {
    return `LKR ${Number(amount || 0).toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
  }

  function dateParts(value) {
    const date = new Date(`${value}T12:00:00`);
    return {
      day: date.toLocaleDateString("en-LK", { day: "2-digit" }),
      month: date.toLocaleDateString("en-LK", { month: "short" }),
      full: date.toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })
    };
  }

  function formatTime(value) {
    if (!value) return "";
    const [hour, minute] = value.split(":").map(Number);
    return new Date(2020, 0, 1, hour, minute).toLocaleTimeString("en-LK", { hour: "numeric", minute: "2-digit" });
  }

  function lawyerById(id) {
    return mock.lawyers.find((lawyer) => lawyer.id === id) || mock.lawyers[0];
  }

  function bookingById(id) {
    return mock.bookings.find((booking) => booking.id === id);
  }

  function statusClass(status) {
    if (status === "Pending Lawyer Response") return "status-pending";
    if (status === "Alternative Proposed") return "status-alternative";
    if (status === "Awaiting Payment") return "status-awaiting";
    if (status === "Confirmed") return "status-confirmed";
    if (status === "Completed") return "status-completed";
    if (status === "Paid") return "status-paid";
    if (status === "Rejected") return "status-rejected";
    return "status-cancelled";
  }

  function statusBadge(status) {
    return `<span class="status-badge ${statusClass(status)}">${escapeHtml(status)}</span>`;
  }

  function avatar(lawyer, large = false) {
    return `<span class="avatar ${escapeHtml(lawyer.color)}${large ? " avatar-lg" : ""}" aria-label="${escapeHtml(lawyer.name)}">${escapeHtml(lawyer.initials)}</span>`;
  }

  function rating(value, count) {
    return `<span class="rating"><span class="star" aria-hidden="true">★</span>${value.toFixed(1)}${count !== undefined ? ` <small>(${count} reviews)</small>` : ""}</span>`;
  }

  const navItems = [
    ["dashboard", "Dashboard", "grid", "dashboard.html"],
    ["lawyers", "Find Lawyers", "search", "lawyers.html"],
    ["my-bookings", "My Bookings", "calendar", "my-bookings.html"],
    ["payments", "Payments & Receipts", "wallet", "payments.html"],
    ["reviews", "My Reviews", "star", "reviews.html"],
    ["notifications", "Notifications", "bell", "notifications.html"],
    ["profile", "My Profile", "user", "profile.html"],
    ["settings", "Settings", "settings", "settings.html"]
  ];
  const sriLankanDistricts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
    "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
    "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
    "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura",
    "Trincomalee", "Vavuniya"
  ];

  function navLink(item) {
    const [key, label, glyph, href] = item;
    return `<a href="${href}"${page === key || (page === "lawyer-profile" && key === "lawyers") ? ' aria-current="page"' : ""}>${icon(glyph)}<span>${label}</span>${key === "notifications" && unreadCount() ? `<span class="nav-count" aria-label="${unreadCount()} unread">${unreadCount()}</span>` : ""}</a>`;
  }

  function unreadCount() {
    return mock.notifications.filter((notification) => !notification.read).length;
  }

  function shell(content) {
    return `
      <a class="skip-link" href="#main-content">Skip to main content</a>
      <div class="mobile-overlay" data-action="close-sidebar" aria-hidden="true"></div>
      <aside class="portal-sidebar" id="portal-sidebar" aria-label="Client navigation">
        <a class="portal-brand" href="dashboard.html"><span class="brand-mark" aria-hidden="true">L</span><span>LawSphere</span></a>
        <p class="sidebar-caption">Workspace</p>
        <nav class="portal-nav" aria-label="Main navigation">${navItems.slice(0, 6).map(navLink).join("")}</nav>
        <p class="sidebar-caption">Account</p>
        <nav class="portal-nav" aria-label="Account navigation">${navItems.slice(6).map(navLink).join("")}</nav>
        <div class="sidebar-bottom">
          <nav class="portal-nav" aria-label="Session navigation"><a href="../index.html">${icon("logout")}<span>Logout</span></a></nav>
          <p class="sidebar-note">LawSphere Client Portal · Prototype</p>
        </div>
      </aside>
      <main class="portal-main" id="main-content">
        <header class="portal-topbar">
          <div class="topbar-leading">
            <button class="icon-button mobile-menu-button" type="button" data-action="toggle-sidebar" aria-label="Open navigation menu" aria-controls="portal-sidebar" aria-expanded="false">${icon("menu")}</button>
            <form class="top-search" id="global-search" role="search">
              ${icon("search")}<input type="search" name="q" placeholder="Search lawyers..." aria-label="Search lawyers">
            </form>
          </div>
          <div class="topbar-actions">
            <a class="icon-button top-notifications" href="notifications.html" aria-label="Notifications, ${unreadCount()} unread">${icon("bell")}${unreadCount() ? `<span class="unread-count" aria-hidden="true">${unreadCount()}</span>` : ""}</a>
            <div class="topbar-profile">
              <button class="profile-trigger" type="button" data-action="profile-menu" aria-expanded="false" aria-haspopup="true">
                <span class="avatar" aria-hidden="true">${escapeHtml(client.initials || "NP")}</span>
                <span class="profile-trigger-name-wrap"><span class="profile-trigger-name">${escapeHtml(client.fullName)}</span><span class="profile-trigger-role">Client account</span></span>
                ${icon("chevron")}
              </button>
            </div>
          </div>
          <nav class="profile-menu" aria-label="Profile menu"><a href="profile.html">My profile</a><a href="settings.html">Settings</a><a href="../index.html">Log out</a></nav>
        </header>
        <div class="portal-content">${content}</div>
      </main>
      <div class="toast" id="portal-toast" role="status" aria-live="polite"></div>
      <dialog class="portal-dialog" id="portal-dialog" aria-labelledby="dialog-title"></dialog>`;
  }

  function pageHeading(eyebrow, title, description, action = "") {
    return `<div class="page-title-row"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
  }

  function statCard(glyph, number, label, color, trend = "") {
    return `<article class="stat-card"><span class="stat-icon ${color}">${icon(glyph)}</span><div><div class="stat-number">${number}</div><div class="stat-label">${label}</div>${trend ? `<div class="stat-trend">${trend}</div>` : ""}</div></article>`;
  }

  function appointmentRow(booking) {
    const lawyer = lawyerById(booking.lawyerId);
    const date = dateParts(booking.date);
    return `<div class="appointment-row"><div class="appointment-date"><strong>${date.day}</strong><span>${date.month}</span></div><div class="appointment-person">${avatar(lawyer)}<div class="appointment-info"><strong>${escapeHtml(lawyer.name)}</strong><span>${escapeHtml(lawyer.specialization)} · ${escapeHtml(booking.method)}</span></div></div><div class="appointment-meta"><strong>${formatTime(booking.time)}</strong>${statusBadge(booking.status)}</div></div>`;
  }

  function activityItem(glyph, text, time) {
    return `<div class="activity-item"><span class="activity-dot">${icon(glyph)}</span><p>${text}<time>${time}</time></p></div>`;
  }

  function miniLawyer(lawyer) {
    return `<div class="lawyer-mini">${avatar(lawyer)}<div class="lawyer-mini-copy"><strong>${escapeHtml(lawyer.name)}</strong><span>${escapeHtml(lawyer.specialization)} · ${rating(lawyer.rating)}</span></div><span class="mini-price">${money(lawyer.fee)}</span></div>`;
  }

  function dashboardView() {
    const upcoming = mock.bookings.filter((booking) => ["Confirmed", "Awaiting Payment"].includes(booking.status)).slice(0, 3);
    const upcomingTotal = mock.bookings.filter((booking) => ["Confirmed", "Awaiting Payment"].includes(booking.status)).length;
    const pendingTotal = mock.bookings.filter((booking) => ["Pending Lawyer Response", "Alternative Proposed"].includes(booking.status)).length;
    const completedTotal = mock.bookings.filter((booking) => booking.status === "Completed").length;
    const activities = [
      activityItem("check", "<strong>Consultation accepted</strong> by Dinithi Silva", "Today, 9:42 AM"),
      activityItem("calendar", "An alternative time was proposed by Nisha Fernando", "Yesterday, 4:18 PM"),
      activityItem("wallet", "Payment is ready for your agreed consultation", "12 Oct, 11:05 AM")
    ];
    return `
      <section class="welcome-banner" aria-labelledby="welcome-title">
        <div class="welcome-copy"><p class="eyebrow">Monday, 12 October 2026</p><h1 id="welcome-title">Welcome back, ${escapeHtml(client.name)}!</h1><p>Keep track of your consultations, manage requests, and find the right legal support for what comes next.</p></div>
        <div class="welcome-action"><a class="button" href="lawyers.html">${icon("search")} Find a Lawyer</a></div>
      </section>
      <section class="stat-grid" aria-label="Consultation overview">
        ${statCard("calendar", mock.bookings.length, "Total Consultations", "blue", "Across all request statuses")}
        ${statCard("clock", upcomingTotal, "Upcoming Consultations", "green", "Agreed schedule")}
        ${statCard("message", pendingTotal, "Pending Requests", "gold", "Need your attention")}
        ${statCard("check", completedTotal, "Completed Consultations", "purple", "Ready for your review")}
      </section>
      <div class="dashboard-grid">
        <div class="dashboard-stack">
          <section class="portal-card" aria-labelledby="upcoming-title">
            <div class="card-heading"><div><h2 id="upcoming-title">Upcoming Appointments</h2><p>Your next scheduled sessions</p></div><a class="text-link" href="my-bookings.html">All bookings ${icon("chevron")}</a></div>
            ${upcoming.length ? upcoming.map(appointmentRow).join("") : '<div class="empty-state"><strong>No upcoming consultations</strong>Find a lawyer to get started.</div>'}
          </section>
          <section class="portal-card" aria-labelledby="quick-actions-title">
            <div class="card-heading"><div><h2 id="quick-actions-title">Quick Actions</h2><p>Pick up where you left off</p></div></div>
            <div class="quick-actions">
              <a class="quick-action" href="lawyers.html">${icon("search")}Find a lawyer</a>
              <a class="quick-action" href="my-bookings.html">${icon("calendar")}Manage bookings</a>
              <a class="quick-action" href="payments.html">${icon("wallet")}View payments</a>
              <a class="quick-action" href="profile.html">${icon("user")}Edit profile</a>
            </div>
          </section>
        </div>
        <div class="dashboard-stack">
          <section class="portal-card" aria-labelledby="activity-title">
            <div class="card-heading"><div><h2 id="activity-title">Recent Activity</h2><p>Updates to your consultations</p></div><a class="text-link" href="notifications.html">See all ${icon("chevron")}</a></div>
            <div class="activity-list">${activities.join("")}</div>
          </section>
          <section class="portal-card" aria-labelledby="recommended-title">
            <div class="card-heading"><div><h2 id="recommended-title">Recommended Lawyers</h2><p>Top-rated professionals for you</p></div><a class="text-link" href="lawyers.html">Browse all ${icon("chevron")}</a></div>
            ${mock.lawyers.slice(0, 3).map(miniLawyer).join("")}
          </section>
        </div>
      </div>`;
  }

  function lawyerCard(lawyer) {
    return `<article class="lawyer-card" data-lawyer-card data-name="${escapeHtml(lawyer.name.toLowerCase())}" data-specialization="${escapeHtml(lawyer.specialization)}" data-district="${escapeHtml(lawyer.district)}" data-city="${escapeHtml(lawyer.city.toLowerCase())}">
      <div class="lawyer-card-head">${avatar(lawyer)}<div><h2 class="lawyer-name">${escapeHtml(lawyer.name)} <span class="verified-mark" title="Verified lawyer" aria-label="Verified lawyer">✓</span></h2><span class="lawyer-specialty">${escapeHtml(lawyer.specialization)}</span></div></div>
      <dl class="lawyer-facts"><div><dt>Experience</dt><dd>${lawyer.experience} years</dd></div><div><dt>Location</dt><dd>${escapeHtml(lawyer.district)}</dd></div><div><dt>City</dt><dd>${escapeHtml(lawyer.city)}</dd></div><div><dt>Rating</dt><dd>${rating(lawyer.rating, lawyer.reviews)}</dd></div></dl>
      <div class="lawyer-card-foot"><div class="fee"><strong>${money(lawyer.fee)}</strong><span>per hour</span></div><div class="lawyer-buttons"><a class="button button-secondary" href="lawyer-profile.html?id=${encodeURIComponent(lawyer.id)}">View Profile</a><a class="button button-primary" href="booking.html?lawyer=${encodeURIComponent(lawyer.id)}">Request Consultation</a></div></div>
    </article>`;
  }

  function lawyersView() {
    const query = new URLSearchParams(location.search);
    const specializations = [...new Set(mock.lawyers.map((lawyer) => lawyer.specialization))].sort();
    return `${pageHeading("Find legal support", "Find Lawyers", "Search verified legal professionals across Sri Lanka.")}
      <section class="portal-card filters-card" aria-label="Search and filter lawyers">
        <div class="filter-row">
          <div class="portal-field search-filter"><label for="lawyer-search">Search by name</label><input id="lawyer-search" type="search" placeholder="e.g. Amal Perera" value="${escapeHtml(query.get("q") || "")}"></div>
          <div class="portal-field"><label for="specialization-filter">Legal specialization</label><select id="specialization-filter"><option value="">All specializations</option>${specializations.map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select></div>
          <div class="portal-field"><label for="district-filter">District</label><select id="district-filter"><option value="">All districts</option>${sriLankanDistricts.map((value) => `<option>${escapeHtml(value)}</option>`).join("")}</select></div>
          <div class="portal-field"><label for="city-filter">City</label><input id="city-filter" type="search" placeholder="Any city"></div>
          <div class="filter-actions"><button class="button button-secondary button-small" type="button" data-action="clear-lawyer-filters">Clear filters</button></div>
        </div>
      </section>
      <p class="results-line" id="lawyer-results" aria-live="polite"></p>
      <section class="lawyer-grid" id="lawyer-results-grid" aria-label="Lawyer search results">${mock.lawyers.map(lawyerCard).join("")}</section>`;
  }

  function profileView() {
    const lawyer = mock.lawyers.find((item) => item.id === new URLSearchParams(location.search).get("id"));
    if (!lawyer) {
      return `${pageHeading("Lawyer profile", "Profile unavailable", "Choose a lawyer from the search results to see their profile.")}<div class="empty-state"><strong>We couldn’t find that lawyer</strong>Return to search and select a profile.<p><a class="button button-primary" href="lawyers.html">Find Lawyers</a></p></div>`;
    }
    return `${pageHeading("Lawyer profile", "Meet your legal professional", "Review the lawyer’s background and services before requesting a consultation.", '<a class="button button-secondary" href="lawyers.html">← Back to lawyers</a>')}
      <section class="portal-card profile-hero" aria-labelledby="lawyer-profile-name">
        ${avatar(lawyer, true)}
        <div class="profile-hero-copy"><p class="eyebrow">Verified legal professional</p><h1 id="lawyer-profile-name">${escapeHtml(lawyer.name)} <span class="verified-mark" aria-label="Verified lawyer">✓</span></h1><p>${escapeHtml(lawyer.specialization)} · ${lawyer.experience} years of experience</p><div class="profile-meta">${rating(lawyer.rating, lawyer.reviews)}<span>${icon("pin")}${escapeHtml(lawyer.city)}, ${escapeHtml(lawyer.district)}</span><span>${icon("message")}Responds to consultation requests</span></div></div>
        <div class="profile-hero-actions"><div class="fee"><strong>${money(lawyer.fee)} / hour</strong><span>Consultation fee</span></div><a class="button button-primary" href="booking.html?lawyer=${encodeURIComponent(lawyer.id)}">Request Consultation</a></div>
      </section>
      <div class="profile-columns">
        <div class="dashboard-stack">
          <section class="portal-card profile-section"><h2>About ${escapeHtml(lawyer.name.split(" ")[0])}</h2><p>${escapeHtml(lawyer.bio)}</p></section>
          <section class="portal-card profile-section"><h2>Client reviews</h2><div class="review-card">${rating(lawyer.rating)}<p>“${escapeHtml(mock.reviews.find((review) => review.lawyerId === lawyer.id)?.text || "Professional, attentive, and easy to talk to. I left with a clearer understanding of the next steps.")}”</p><span class="review-author">LawSphere client · Verified consultation</span></div><div class="review-card">${rating(Math.max(4.5, lawyer.rating - 0.2))}<p>“Clear communication and thoughtful advice throughout the consultation.”</p><span class="review-author">LawSphere client · Verified consultation</span></div></section>
        </div>
        <div class="dashboard-stack">
          <section class="portal-card"><h2>Professional details</h2><dl class="detail-list"><div class="detail-row"><dt>Qualifications</dt><dd><strong>${escapeHtml(lawyer.qualification)}</strong></dd></div><div class="detail-row"><dt>Experience</dt><dd><strong>${lawyer.experience} years</strong></dd></div><div class="detail-row"><dt>Location</dt><dd><strong>${escapeHtml(lawyer.city)}, ${escapeHtml(lawyer.district)}</strong></dd></div><div class="detail-row"><dt>Consultation duration</dt><dd><strong>${lawyer.duration}</strong></dd></div><div class="detail-row"><dt>Fee per hour</dt><dd><strong>${money(lawyer.fee)}</strong></dd></div></dl></section>
          <section class="portal-card"><h2>Legal specializations</h2><div class="tag-list"><span class="tag">${escapeHtml(lawyer.specialization)}</span><span class="tag">Consultation</span><span class="tag">Dispute resolution</span></div><h3 class="profile-language-title">Languages spoken</h3><div class="tag-list">${lawyer.languages.map((language) => `<span class="tag">${escapeHtml(language)}</span>`).join("")}</div></section>
        </div>
      </div>`;
  }

  function bookingView() {
    const lawyer = mock.lawyers.find((item) => item.id === new URLSearchParams(location.search).get("lawyer"));
    if (!lawyer) {
      return `${pageHeading("Consultation request", "Choose a Lawyer", "Select a legal professional before starting a consultation request.")}<div class="empty-state"><strong>No lawyer selected</strong>Visit Find Lawyers and choose “Request Consultation” on a lawyer’s card.<p><a class="button button-primary" href="lawyers.html">Find Lawyers</a></p></div>`;
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 2);
    const dateValue = `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, "0")}-${String(defaultDate.getDate()).padStart(2, "0")}`;
    return `${pageHeading("Consultation request", "Request a Consultation", "Share a preferred schedule. Your request is not confirmed until payment is verified.", '<a class="button button-secondary" href="lawyers.html">Browse lawyers</a>')}
      <div class="booking-layout">
        <section class="portal-card"><div class="card-heading"><div><h2>Consultation details</h2><p>Choose a preferred time for your request</p></div><span class="proto-label">Prototype</span></div>
          <form id="booking-form" class="booking-form" novalidate data-lawyer="${escapeHtml(lawyer.id)}">
            <div class="portal-field"><span class="portal-label">Consultation method</span><div class="booking-methods"><label class="method-option"><input type="radio" name="method" value="Online" checked> ${icon("video")} Online consultation</label><label class="method-option"><input type="radio" name="method" value="Physical"> ${icon("building")} In person</label></div></div>
            <div class="form-row"><div class="portal-field"><label for="preferred-date">Preferred date</label><input id="preferred-date" name="date" type="date" min="${dateValue}" aria-describedby="preferred-date-error" required><span class="field-error" id="preferred-date-error" aria-live="polite"></span></div><div class="portal-field"><label for="preferred-time">Preferred time</label><select id="preferred-time" name="time" aria-describedby="preferred-time-error" required><option value="">Select a time</option><option value="09:00">9:00 AM</option><option value="10:30">10:30 AM</option><option value="12:00">12:00 PM</option><option value="14:00">2:00 PM</option><option value="15:30">3:30 PM</option><option value="17:00">5:00 PM</option></select><span class="field-error" id="preferred-time-error" aria-live="polite"></span></div></div>
            <div class="portal-field"><label for="duration">Consultation duration</label><select id="duration" name="duration"><option value="30">30 minutes</option><option value="60" selected>60 minutes</option><option value="90">90 minutes</option></select></div>
            <div class="portal-field"><label for="legal-matter">Briefly describe what you’d like to discuss <span class="muted">(optional)</span></label><textarea id="legal-matter" name="description" maxlength="1000" placeholder="Please avoid sharing highly sensitive information in this prototype."></textarea><span class="field-hint">This prototype does not save your description.</span></div>
            <div class="prototype-banner">Your request begins as <strong>Pending Lawyer Response</strong>. The lawyer may accept, reject, or suggest another time. Payment is available only after you both agree on a schedule. A booking is confirmed only after future backend verification of payment.</div>
            <div class="form-actions"><button class="button button-primary" type="submit">Submit Consultation Request ${icon("chevron")}</button></div>
          </form>
          <div id="booking-confirmation" aria-live="polite"></div>
        </section>
        <aside class="dashboard-stack">
          <section class="portal-card"><div class="card-heading"><h2>Selected lawyer</h2><a class="text-link" href="lawyer-profile.html?id=${encodeURIComponent(lawyer.id)}">View profile ${icon("chevron")}</a></div><div class="lawyer-card-head">${avatar(lawyer)}<div><div class="lawyer-name">${escapeHtml(lawyer.name)} <span class="verified-mark" aria-label="Verified lawyer">✓</span></div><span class="lawyer-specialty">${escapeHtml(lawyer.specialization)}</span></div></div><div class="detail-row"><span>${icon("pin")} ${escapeHtml(lawyer.city)}, ${escapeHtml(lawyer.district)}</span>${rating(lawyer.rating)}</div>
            <div class="fee-summary"><div class="fee-line"><span>Rate per hour</span><strong>${money(lawyer.fee)}</strong></div><div class="fee-line"><span>Duration</span><strong id="summary-duration">60 minutes</strong></div><div class="fee-line total"><span>Estimated consultation fee</span><strong id="summary-fee">${money(lawyer.fee)}</strong></div></div>
          </section>
          <section class="portal-card"><h2>What happens next?</h2><div class="activity-list"><div class="activity-item"><span class="activity-dot">1</span><p><strong>Lawyer reviews</strong> your preferred schedule.</p></div><div class="activity-item"><span class="activity-dot">2</span><p>You both agree on a time, including any proposed alternative.</p></div><div class="activity-item"><span class="activity-dot">3</span><p>Payment becomes available. Confirmation follows verified payment.</p></div></div></section>
        </aside>
      </div>`;
  }

  const statuses = ["All", "Pending Lawyer Response", "Alternative Proposed", "Awaiting Payment", "Confirmed", "Completed", "Rejected", "Cancelled"];

  function bookingActions(booking) {
    const actions = ['<button class="button button-secondary button-small" type="button" data-action="booking-details" data-id="' + escapeHtml(booking.id) + '">View Details</button>'];
    if (booking.status === "Alternative Proposed") {
      actions.push(`<button class="button button-primary button-small" type="button" data-action="accept-alternative" data-id="${escapeHtml(booking.id)}">Accept Alternative</button>`);
      actions.push(`<button class="button button-secondary button-small" type="button" data-action="decline-alternative" data-id="${escapeHtml(booking.id)}">Decline Alternative</button>`);
    }
    if (booking.status === "Awaiting Payment") actions.push(`<button class="button button-primary button-small" type="button" data-action="pay-now" data-id="${escapeHtml(booking.id)}">Pay Now</button>`);
    if (["Pending Lawyer Response", "Alternative Proposed", "Awaiting Payment", "Confirmed"].includes(booking.status)) actions.push(`<button class="button button-secondary button-small" type="button" data-action="cancel-request" data-id="${escapeHtml(booking.id)}">Request Cancellation</button>`);
    if (booking.status === "Completed" && !reviewedIds.has(booking.id)) actions.push(`<a class="button button-soft button-small" href="reviews.html?booking=${encodeURIComponent(booking.id)}">Write Review</a>`);
    return actions.join("");
  }

  function bookingCard(booking) {
    const lawyer = lawyerById(booking.lawyerId);
    const date = dateParts(booking.date);
    return `<article class="booking-card" data-booking-card data-status="${escapeHtml(booking.status)}" data-search="${escapeHtml((booking.id + " " + lawyer.name + " " + lawyer.specialization).toLowerCase())}">
      <div class="booking-card-top"><div class="booking-primary">${avatar(lawyer)}<div><h3>${escapeHtml(lawyer.name)}</h3><p>${escapeHtml(lawyer.specialization)}</p><div class="booking-id">${escapeHtml(booking.id)}</div></div></div>${statusBadge(booking.status)}</div>
      ${booking.status === "Alternative Proposed" ? `<div class="alternative-note">Proposed alternative: <strong>${dateParts(booking.proposedDate).full} at ${formatTime(booking.proposedTime)}</strong>. Accept or decline to continue.</div>` : ""}
      <div class="booking-details"><span>${icon("calendar")}<strong>${date.full}</strong> · ${formatTime(booking.time)}</span><span>${booking.method === "Online" ? icon("video") : icon("building")}${escapeHtml(booking.method)}</span><span>${icon("clock")}${booking.duration} min</span><span><strong>${money(booking.fee)}</strong></span></div>
      <div class="booking-actions">${bookingActions(booking)}</div>
    </article>`;
  }

  function bookingsView() {
    return `${pageHeading("Consultation management", "My Bookings", "Review requests and keep track of every consultation.", '<a class="button button-primary" href="lawyers.html">+ Find a Lawyer</a>')}
      <section class="portal-card filters-card" aria-label="Filter bookings"><div class="filter-row"><div class="portal-field search-filter"><label for="booking-search">Search bookings</label><input id="booking-search" type="search" placeholder="Booking ID, lawyer or specialization"></div><div class="portal-field"><label for="booking-status-select">Status</label><select id="booking-status-select">${statuses.map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status === "All" ? "All statuses" : status)}</option>`).join("")}</select></div></div>
      <div class="booking-filters" aria-label="Quick status filters">${statuses.map((status) => `<button class="filter-chip" type="button" data-status-filter="${escapeHtml(status)}" aria-pressed="${status === "All"}">${escapeHtml(status)}</button>`).join("")}</div></section>
      <p class="results-line" id="booking-results" aria-live="polite"></p><section class="booking-list" id="booking-list" aria-label="Your bookings">${mock.bookings.map(bookingCard).join("")}</section>
      <p class="prototype-banner">Prototype data is in memory only. A client-side payment action does not process or verify a payment, and cannot confirm a booking.</p>`;
  }

  function paymentsView() {
    const total = mock.transactions.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
    const pending = mock.transactions.filter((item) => item.status === "Pending").reduce((sum, item) => sum + item.amount, 0);
    return `${pageHeading("Payments", "Payments & Receipts", "Review your consultation payment activity and receipts.")}
      <div class="payment-summary"><section class="portal-card payment-stat"><p>Total Paid</p><strong>${money(total)}</strong><small>Mock transactions marked paid</small></section><section class="portal-card payment-stat"><p>Pending Payments</p><strong>${money(pending)}</strong><small>Payment becomes available after both parties agree on a schedule</small></section></div>
      <section class="portal-card"><div class="card-heading"><div><h2>Payment history</h2><p>Transactions shown are demonstration data only</p></div><span class="proto-label">Prototype data</span></div>
      <div class="table-wrap"><table class="portal-table"><thead><tr><th>Reference</th><th>Booking</th><th>Lawyer</th><th>Amount</th><th>Payment date</th><th>Status</th><th>Receipt</th></tr></thead><tbody>${mock.transactions.map((transaction) => {
        const lawyer = lawyerById(transaction.lawyerId);
        return `<tr><td><strong>${escapeHtml(transaction.id)}</strong></td><td>${escapeHtml(transaction.bookingId)}</td><td>${escapeHtml(lawyer.name)}</td><td><strong>${money(transaction.amount)}</strong></td><td>${transaction.date ? dateParts(transaction.date).full : "—"}</td><td>${statusBadge(transaction.status)}</td><td><div class="table-actions"><button class="button button-secondary button-small" type="button" data-action="view-receipt" data-id="${escapeHtml(transaction.id)}">View</button>${transaction.status === "Paid" ? `<button class="button button-soft button-small" type="button" data-action="download-receipt" data-id="${escapeHtml(transaction.id)}">Download</button>` : "—"}</div></td></tr>`;
      }).join("")}</tbody></table></div></section>
      <div class="prototype-banner"><strong>Prototype only:</strong> No payment gateway is connected. Payment records and receipt downloads are mock examples, not evidence of a real transaction.</div>`;
  }

  function reviewCard(review) {
    const lawyer = lawyerById(review.lawyerId);
    return `<article class="review-card review-existing">${avatar(lawyer)}<div><div class="review-title"><strong>${escapeHtml(lawyer.name)}</strong><span class="review-stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span></div><p>${escapeHtml(review.text)}</p><span class="review-author">${escapeHtml(review.date)} · Booking ${escapeHtml(review.bookingId)}</span></div></article>`;
  }

  function reviewsView() {
    const eligible = mock.bookings.filter((booking) => booking.status === "Completed" && !reviewedIds.has(booking.id));
    const selectedBooking = new URLSearchParams(location.search).get("booking");
    return `${pageHeading("Share your experience", "My Reviews", "Your feedback helps others find the right legal support.")}
      <section class="portal-card review-form"><div class="card-heading"><div><h2>Consultations eligible for review</h2><p>Only completed consultations can be reviewed.</p></div></div>
      ${eligible.length ? eligible.map((booking) => {
        const lawyer = lawyerById(booking.lawyerId);
        return `<form class="review-submit-form" data-booking="${escapeHtml(booking.id)}" novalidate><div class="review-eligible">${avatar(lawyer)}<div><strong>${escapeHtml(lawyer.name)}</strong><span>${escapeHtml(lawyer.specialization)} · ${dateParts(booking.date).full} · ${escapeHtml(booking.id)}</span></div><fieldset class="star-rating" aria-describedby="rating-${escapeHtml(booking.id)}-error"><legend class="visually-hidden">Choose a rating from 1 to 5 stars</legend>${[5,4,3,2,1].map((value) => `<input id="rating-${escapeHtml(booking.id)}-${value}" type="radio" name="rating" value="${value}" ${value === 5 ? "required" : ""}><label for="rating-${escapeHtml(booking.id)}-${value}" aria-label="${value} ${value === 1 ? "star" : "stars"}">★</label>`).join("")}</fieldset><span class="field-error review-rating-error" id="rating-${escapeHtml(booking.id)}-error" data-error-for="rating" aria-live="polite"></span></div><div class="portal-field"><label for="review-${escapeHtml(booking.id)}">Your review</label><textarea id="review-${escapeHtml(booking.id)}" name="review" maxlength="1200" aria-describedby="review-${escapeHtml(booking.id)}-error" required placeholder="What was helpful about your consultation?"></textarea><span class="field-error" id="review-${escapeHtml(booking.id)}-error" data-error-for="review" aria-live="polite"></span></div><div class="form-actions"><button class="button button-primary" type="submit">Submit Review</button></div></form>`;
      }).join("") : '<div class="empty-state"><strong>No consultations awaiting a review</strong>Reviews are available after a consultation is completed and can only be submitted once.</div>'}</section>
      <section class="portal-card"><div class="card-heading"><div><h2>Previously submitted reviews</h2><p>Your feedback shared with the community</p></div></div>${mock.reviews.length ? mock.reviews.map(reviewCard).join("") : '<div class="empty-state"><strong>No reviews yet</strong>Your submitted reviews will appear here.</div>'}</section>`;
  }

  function notificationIcon(type) {
    const glyph = { accepted: "check", alternative: "calendar", payment: "wallet", confirmed: "check", cancelled: "close", completed: "star" }[type] || "bell";
    return icon(glyph);
  }

  function notificationCard(notification) {
    return `<article class="notification-item${notification.read ? "" : " unread"}" data-notification="${escapeHtml(notification.id)}"><span class="notification-icon">${notificationIcon(notification.type)}</span><div class="notification-copy"><h3>${escapeHtml(notification.title)}</h3><p>${escapeHtml(notification.text)}</p><time>${escapeHtml(notification.time)}</time></div><div class="notification-actions">${notification.read ? '<span class="muted read-label">Read</span>' : `<span class="unread-dot" aria-label="Unread"></span><button class="button button-secondary button-small" type="button" data-action="mark-read" data-id="${escapeHtml(notification.id)}">Mark as read</button>`}</div></article>`;
  }

  function notificationsView() {
    return `${pageHeading("Stay up to date", "Notifications", "Important updates about your requests, schedules, and consultations.", `<button class="button button-secondary" type="button" data-action="mark-all-read" ${unreadCount() ? "" : "disabled"}>Mark all as read</button>`)}
      <section class="notification-list" id="notification-list" aria-label="Your notifications">${mock.notifications.map(notificationCard).join("")}</section>`;
  }

  function profileViewPage() {
    return `${pageHeading("Your account", "My Profile", "Keep your contact information up to date.")}
      <section class="portal-card"><div class="profile-summary"><span class="avatar avatar-lg" aria-hidden="true">NP</span><div><strong>${escapeHtml(client.fullName)}</strong><span>Client account · Member since October 2026</span></div></div>
      <form id="profile-form" novalidate><div class="profile-edit-grid">
        <div class="portal-field"><label for="profile-name">Full name</label><input id="profile-name" name="name" autocomplete="name" value="${escapeHtml(client.fullName)}" aria-describedby="profile-name-error" required><span class="field-error" id="profile-name-error" data-error-for="name" aria-live="polite"></span></div>
        <div class="portal-field"><label for="profile-email">Email address</label><input id="profile-email" name="email" type="email" autocomplete="email" value="${escapeHtml(client.email)}" aria-describedby="profile-email-error" required><span class="field-error" id="profile-email-error" data-error-for="email" aria-live="polite"></span></div>
        <div class="portal-field"><label for="profile-phone">Phone number</label><input id="profile-phone" name="phone" type="tel" autocomplete="tel" value="${escapeHtml(client.phone)}" aria-describedby="profile-phone-error" required><span class="field-error" id="profile-phone-error" data-error-for="phone" aria-live="polite"></span></div>
      </div><div class="prototype-banner">Profile edits are only held temporarily in this page. No account data is sent to a server.</div><div class="form-actions"><button class="button button-primary" type="submit">Save profile changes</button></div></form></section>`;
  }

  function settingsView() {
    const preferences = [
      ["booking-updates", "Booking updates", "Lawyer responses, schedule changes, and confirmation notices.", true],
      ["payment-updates", "Payment reminders", "Updates when payment becomes available or is due.", true],
      ["review-reminders", "Review reminders", "A reminder when a completed consultation is ready for review.", true],
      ["product-news", "Product news", "Occasional tips and updates from LawSphere.", false]
    ];
    return `${pageHeading("Manage your account", "Settings", "Control your account security and in-app preferences.")}
      <div class="settings-layout">
        <section class="portal-card"><div class="card-heading"><div><h2>Account information</h2><p>Contact details associated with this prototype account</p></div></div><div class="detail-list"><div class="detail-row"><dt>Account type</dt><dd><strong>Client</strong></dd></div><div class="detail-row"><dt>Email</dt><dd><strong>${escapeHtml(client.email)}</strong></dd></div><div class="detail-row"><dt>Phone</dt><dd><strong>${escapeHtml(client.phone)}</strong></dd></div><div class="detail-row"><dt>Username</dt><dd><strong>Not assigned</strong></dd></div></div><a class="button button-secondary button-small settings-edit-link" href="profile.html">Edit profile</a></section>
        <section class="portal-card"><div class="card-heading"><div><h2>Change password</h2><p>Password changes are not saved in this prototype.</p></div></div>        <form id="password-form" novalidate><div class="portal-field"><label for="current-password">Current password</label><input id="current-password" type="password" autocomplete="current-password" aria-describedby="current-password-error" required><span class="field-error" id="current-password-error" data-error-for="current" aria-live="polite"></span></div><div class="portal-field"><label for="new-password">New password</label><input id="new-password" type="password" autocomplete="new-password" minlength="8" aria-describedby="new-password-error" required><span class="field-hint">At least 8 characters, including a letter and a number.</span><span class="field-error" id="new-password-error" data-error-for="new" aria-live="polite"></span></div><div class="portal-field"><label for="confirm-password">Confirm new password</label><input id="confirm-password" type="password" autocomplete="new-password" aria-describedby="confirm-password-error" required><span class="field-error" id="confirm-password-error" data-error-for="confirm" aria-live="polite"></span></div><button class="button button-primary button-small" type="submit">Update password</button></form></section>
        <section class="portal-card"><div class="card-heading"><div><h2>In-app notifications</h2><p>Choose which updates appear in your portal.</p></div></div><div class="toggle-list">${preferences.map(([id, title, text, checked]) => `<div class="toggle-row"><div class="toggle-copy"><strong>${title}</strong><span>${text}</span></div><label class="switch"><input type="checkbox" data-preference="${id}" ${checked ? "checked" : ""} aria-label="${title}"><span></span></label></div>`).join("")}</div></section>
        <aside class="portal-card"><h2>About your data</h2><p class="muted settings-data-copy">These settings are for demonstration. No password or preference is transmitted or stored by this prototype. Do not enter a real password.</p><div class="prototype-banner">No authentication or account service is connected.</div></aside>
      </div>`;
  }

  const views = {
    dashboard: dashboardView,
    lawyers: lawyersView,
    "lawyer-profile": profileView,
    booking: bookingView,
    "my-bookings": bookingsView,
    payments: paymentsView,
    reviews: reviewsView,
    notifications: notificationsView,
    profile: profileViewPage,
    settings: settingsView
  };

  const root = document.getElementById("portal-root");
  root.innerHTML = shell((views[page] || dashboardView)());
  document.title = `${({
    dashboard: "Dashboard", lawyers: "Find Lawyers", "lawyer-profile": "Lawyer Profile",
    booking: "Request Consultation", "my-bookings": "My Bookings", payments: "Payments & Receipts",
    reviews: "My Reviews", notifications: "Notifications", profile: "My Profile", settings: "Settings"
  })[page] || "Dashboard"} | LawSphere`;

  let dialog = document.getElementById("portal-dialog");

  function showToast(message) {
    const toast = document.getElementById("portal-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  }

  function showDialog(title, body, actions = '<button class="button button-primary" type="button" data-dialog-close>Close</button>') {
    dialog.innerHTML = `<div class="dialog-inner"><div class="dialog-head"><h2 id="dialog-title">${escapeHtml(title)}</h2><button class="icon-button" type="button" data-dialog-close aria-label="Close dialog">${icon("close")}</button></div><div class="dialog-body">${body}</div><div class="dialog-actions">${actions}</div></div>`;
    dialog.showModal();
  }

  function updateLawyerFilters() {
    const search = (document.getElementById("lawyer-search")?.value || "").trim().toLowerCase();
    const specialization = document.getElementById("specialization-filter")?.value || "";
    const district = document.getElementById("district-filter")?.value || "";
    const city = (document.getElementById("city-filter")?.value || "").trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll("[data-lawyer-card]").forEach((card) => {
      const matches = (!search || card.dataset.name.includes(search)) &&
        (!specialization || card.dataset.specialization === specialization) &&
        (!district || card.dataset.district === district) &&
        (!city || card.dataset.city.includes(city));
      card.hidden = !matches;
      if (matches) shown += 1;
    });
    const result = document.getElementById("lawyer-results");
    if (result) result.textContent = `${shown} ${shown === 1 ? "lawyer" : "lawyers"} found`;
    const grid = document.getElementById("lawyer-results-grid");
    if (grid && shown === 0) grid.insertAdjacentHTML("beforeend", '<div class="empty-state" id="lawyer-empty"><strong>No lawyers found</strong>Try changing or clearing one or more filters.</div>');
    else document.getElementById("lawyer-empty")?.remove();
  }

  function filterBookings() {
    const query = (document.getElementById("booking-search")?.value || "").trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll("[data-booking-card]").forEach((card) => {
      const matches = (selectedStatus === "All" || card.dataset.status === selectedStatus) && (!query || card.dataset.search.includes(query));
      card.hidden = !matches;
      if (matches) shown += 1;
    });
    const result = document.getElementById("booking-results");
    if (result) result.textContent = `${shown} ${shown === 1 ? "booking" : "bookings"} shown`;
    const list = document.getElementById("booking-list");
    if (list && shown === 0) list.insertAdjacentHTML("beforeend", '<div class="empty-state" id="booking-empty"><strong>No bookings match</strong>Try another search or status.</div>');
    else document.getElementById("booking-empty")?.remove();
  }

  if (page === "lawyers") {
    ["lawyer-search", "specialization-filter", "district-filter", "city-filter"].forEach((id) => {
      document.getElementById(id).addEventListener("input", updateLawyerFilters);
      document.getElementById(id).addEventListener("change", updateLawyerFilters);
    });
    updateLawyerFilters();
  }
  if (page === "my-bookings") {
    document.getElementById("booking-search").addEventListener("input", filterBookings);
    document.getElementById("booking-status-select").addEventListener("change", (event) => {
      selectedStatus = event.target.value;
      document.querySelectorAll("[data-status-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.statusFilter === selectedStatus)));
      filterBookings();
    });
    filterBookings();
  }

  function bindGlobalSearch() {
    const searchForm = document.getElementById("global-search");
    if (!searchForm) return;
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = new FormData(event.currentTarget).get("q").toString().trim();
      location.href = `lawyers.html${query ? `?q=${encodeURIComponent(query)}` : ""}`;
    });
  }
  bindGlobalSearch();

  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const action = control.dataset.action;

    if (action === "toggle-sidebar") {
      const open = !document.body.classList.contains("sidebar-open");
      document.body.classList.toggle("sidebar-open", open);
      control.setAttribute("aria-expanded", String(open));
      control.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    } else if (action === "close-sidebar") {
      document.body.classList.remove("sidebar-open");
      document.querySelector('[data-action="toggle-sidebar"]')?.setAttribute("aria-expanded", "false");
    } else if (action === "profile-menu") {
      const menu = document.querySelector(".profile-menu");
      const expanded = control.getAttribute("aria-expanded") === "true";
      control.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open", !expanded);
    } else if (action === "clear-lawyer-filters") {
      ["lawyer-search", "specialization-filter", "district-filter", "city-filter"].forEach((id) => { document.getElementById(id).value = ""; });
      updateLawyerFilters();
    } else if (action === "mark-read") {
      const notification = mock.notifications.find((item) => item.id === control.dataset.id);
      if (notification) notification.read = true;
      root.innerHTML = shell(notificationsView());
      bindAfterRerender();
      showToast("Notification marked as read.");
    } else if (action === "mark-all-read") {
      mock.notifications.forEach((notification) => { notification.read = true; });
      root.innerHTML = shell(notificationsView());
      bindAfterRerender();
      showToast("All notifications marked as read.");
    } else if (action === "booking-details") {
      const booking = bookingById(control.dataset.id);
      if (booking) {
        const lawyer = lawyerById(booking.lawyerId);
        const when = `${dateParts(booking.date).full} at ${formatTime(booking.time)}`;
        showDialog(`Booking ${booking.id}`, `<p><strong>${escapeHtml(lawyer.name)}</strong><br>${escapeHtml(lawyer.specialization)}</p><p>${escapeHtml(when)} · ${escapeHtml(booking.method)} · ${booking.duration} minutes</p><p>Consultation fee: <strong>${money(booking.fee)}</strong></p><p>Current status: ${escapeHtml(booking.status)}</p>`);
      }
    } else if (action === "accept-alternative" || action === "decline-alternative") {
      const booking = bookingById(control.dataset.id);
      if (booking && booking.status === "Alternative Proposed") {
        if (action === "accept-alternative") {
          booking.date = booking.proposedDate;
          booking.time = booking.proposedTime;
          booking.status = "Awaiting Payment";
          showToast("Alternative accepted. Payment is now available; the booking is not confirmed.");
        } else {
          booking.status = "Cancelled";
          showToast("Alternative declined. This prototype marks the request cancelled.");
        }
        root.innerHTML = shell(bookingsView());
        bindAfterRerender();
        filterBookings();
      }
    } else if (action === "pay-now") {
      showDialog("Prototype payment", "<p>This is a demonstration only. No payment gateway is connected and no payment will be processed.</p><p>Your booking will remain <strong>Awaiting Payment</strong>. A consultation can only be confirmed after payment is verified by a future backend service.</p>", '<button class="button button-secondary" type="button" data-dialog-close>Go back</button><button class="button button-primary" type="button" data-dialog-action="simulate-payment">Continue (prototype)</button>');
      dialog.dataset.booking = control.dataset.id;
    } else if (action === "cancel-request") {
      const booking = bookingById(control.dataset.id);
      if (booking) showDialog("Request a cancellation", `<p>Would you like to request cancellation for <strong>${escapeHtml(booking.id)}</strong>?</p><p>This prototype will update the displayed status only. No cancellation is sent to a lawyer.</p>`, '<button class="button button-secondary" type="button" data-dialog-close>Keep booking</button><button class="button button-danger" type="button" data-dialog-action="confirm-cancel">Request cancellation</button>');
      dialog.dataset.booking = control.dataset.id;
    } else if (action === "view-receipt") {
      const transaction = mock.transactions.find((item) => item.id === control.dataset.id);
      if (transaction) {
        const lawyer = lawyerById(transaction.lawyerId);
        showDialog(`Receipt ${transaction.id}`, `<p><span class="proto-label">Prototype receipt</span></p><p>Booking: <strong>${escapeHtml(transaction.bookingId)}</strong><br>Lawyer: <strong>${escapeHtml(lawyer.name)}</strong></p><p>Amount: <strong>${money(transaction.amount)}</strong><br>Status: ${escapeHtml(transaction.status)}<br>Date: ${transaction.date ? dateParts(transaction.date).full : "Not paid"}</p><p>This is sample data and not a payment record.</p>`);
      }
    } else if (action === "download-receipt") {
      downloadReceipt(control.dataset.id);
    }
  });

  function bindAfterRerender() {
    dialog = document.getElementById("portal-dialog");
    document.querySelectorAll("[data-status-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.statusFilter === selectedStatus)));
    bindGlobalSearch();
    if (page === "my-bookings") {
      document.getElementById("booking-search").addEventListener("input", filterBookings);
      document.getElementById("booking-status-select").addEventListener("change", (event) => {
        selectedStatus = event.target.value;
        document.querySelectorAll("[data-status-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.statusFilter === selectedStatus)));
        filterBookings();
      });
    }
  }

  document.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-status-filter]");
    if (filter && page === "my-bookings") {
      selectedStatus = filter.dataset.statusFilter;
      document.querySelectorAll("[data-status-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button === filter)));
      document.getElementById("booking-status-select").value = selectedStatus;
      filterBookings();
    }
    if (event.target.closest("[data-dialog-close]")) dialog.close();
    if (event.target.closest('[data-dialog-action="simulate-payment"]')) {
      dialog.close();
      showToast("Prototype only: no payment was processed. Booking remains Awaiting Payment.");
    }
    if (event.target.closest('[data-dialog-action="confirm-cancel"]')) {
      const booking = bookingById(dialog.dataset.booking);
      if (booking) booking.status = "Cancelled";
      dialog.close();
      root.innerHTML = shell(bookingsView());
      bindAfterRerender();
      filterBookings();
      showToast("Prototype only: cancellation was not sent to the lawyer; the local mock status changed.");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("sidebar-open")) {
      document.body.classList.remove("sidebar-open");
      document.querySelector('[data-action="toggle-sidebar"]')?.setAttribute("aria-expanded", "false");
      document.querySelector('[data-action="toggle-sidebar"]')?.focus();
    }
    if (event.key === "Escape" && document.querySelector(".profile-menu.is-open")) {
      document.querySelector(".profile-menu").classList.remove("is-open");
      const trigger = document.querySelector('[data-action="profile-menu"]');
      trigger?.setAttribute("aria-expanded", "false");
      trigger?.focus();
    }
    if (event.target.matches('[data-action="profile-menu"]') && event.key === "ArrowDown") {
      event.preventDefault();
      document.querySelector(".profile-menu a")?.focus();
    }
    if (event.key === "Tab" && document.querySelector(".profile-menu.is-open") && !event.target.closest(".topbar-profile, .profile-menu")) {
      document.querySelector(".profile-menu").classList.remove("is-open");
      document.querySelector('[data-action="profile-menu"]')?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "duration") updateFeeSummary();
  });
  document.addEventListener("change", (event) => {
    if (event.target.id === "duration") updateFeeSummary();
  });

  function updateFeeSummary() {
    const form = document.getElementById("booking-form");
    if (!form) return;
    const lawyer = lawyerById(form.dataset.lawyer);
    const duration = Number(document.getElementById("duration").value);
    document.getElementById("summary-duration").textContent = `${duration} minutes`;
    document.getElementById("summary-fee").textContent = money(lawyer.fee * duration / 60);
  }

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const date = document.getElementById("preferred-date");
      const time = document.getElementById("preferred-time");
      const dateError = document.getElementById("preferred-date-error");
      const timeError = document.getElementById("preferred-time-error");
      dateError.textContent = date.value ? (date.value < date.min ? "Choose today or a future date." : "") : "Choose a preferred date.";
      timeError.textContent = time.value ? "" : "Choose a preferred time.";
      date.setAttribute("aria-invalid", String(Boolean(dateError.textContent)));
      time.setAttribute("aria-invalid", String(Boolean(timeError.textContent)));
      if (dateError.textContent || timeError.textContent) {
        (dateError.textContent ? date : time).focus();
        return;
      }
      const lawyer = lawyerById(bookingForm.dataset.lawyer);
      const duration = Number(document.getElementById("duration").value);
      const newBooking = {
        id: `LS-${String(24100 + mock.bookings.length).padStart(5, "0")}`,
        lawyerId: lawyer.id,
        date: date.value,
        time: time.value,
        method: new FormData(bookingForm).get("method"),
        duration,
        fee: lawyer.fee * duration / 60,
        status: "Pending Lawyer Response"
      };
      mock.bookings.unshift(newBooking);
      bookingForm.querySelector("button[type=submit]").disabled = true;
      document.getElementById("booking-confirmation").innerHTML = `<div class="prototype-banner" role="status"><strong>Prototype request created · ${escapeHtml(newBooking.id)}</strong><br>Your request for ${escapeHtml(lawyer.name)} is marked <strong>Pending Lawyer Response</strong>. This is a local demonstration only; no request was sent and it is not confirmed. The optional legal-matter description was not retained.</div>`;
    });
  }

  document.addEventListener("submit", (event) => {
    if (event.target.matches(".review-submit-form")) {
      event.preventDefault();
      const form = event.target;
      const bookingId = form.dataset.booking;
      if (reviewedIds.has(bookingId)) {
        showToast("This consultation already has a review in this session.");
        return;
      }
      const ratingValue = new FormData(form).get("rating");
      const reviewText = form.querySelector('textarea[name="review"]').value.trim();
      const ratingError = form.querySelector('[data-error-for="rating"]');
      const reviewError = form.querySelector('[data-error-for="review"]');
      ratingError.textContent = "";
      reviewError.textContent = "";
      if (!ratingValue || !reviewText) {
        ratingError.textContent = !ratingValue ? "Choose a star rating." : "";
        reviewError.textContent = !reviewText ? "Write a short review." : "";
        if (!ratingValue) form.querySelector(".star-rating input").focus();
        else form.querySelector("textarea").focus();
        return;
      }
      const booking = bookingById(bookingId);
      if (!booking || booking.status !== "Completed") {
        showToast("Only completed consultations can be reviewed.");
        return;
      }
      reviewedIds.add(bookingId);
      mock.reviews.unshift({
        bookingId,
        lawyerId: booking.lawyerId,
        rating: Number(ratingValue),
        text: reviewText,
        date: new Date().toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })
      });
      root.innerHTML = shell(reviewsView());
      bindAfterRerender();
      showToast("Review submitted in this prototype session.");
    } else if (event.target.id === "profile-form") {
      event.preventDefault();
      const form = event.target;
      const name = form.elements.name;
      const email = form.elements.email;
      const phone = form.elements.phone;
      const errors = {
        name: name.value.trim() ? "" : "Enter your name.",
        email: email.validity.valid && email.value.trim() ? "" : "Enter a valid email.",
        phone: phone.value.replace(/\D/g, "").length >= 9 && phone.value.replace(/\D/g, "").length <= 15 ? "" : "Enter a valid phone number."
      };
      Object.entries(errors).forEach(([field, message]) => {
        form.querySelector(`[data-error-for="${field}"]`).textContent = message;
        form.elements[field].setAttribute("aria-invalid", String(Boolean(message)));
      });
      if (Object.values(errors).some(Boolean)) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      client.fullName = name.value.trim();
      client.name = client.fullName.split(/\s+/)[0];
      client.initials = client.fullName.split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
      client.email = email.value.trim();
      client.phone = phone.value.trim();
      document.querySelector(".profile-trigger-name").textContent = client.fullName;
      document.querySelector(".profile-trigger .avatar").textContent = client.initials;
      document.querySelector(".profile-summary strong").textContent = client.fullName;
      document.querySelector(".profile-summary .avatar").textContent = client.initials;
      showToast("Profile changes previewed in this page only. Nothing was saved.");
    } else if (event.target.id === "password-form") {
      event.preventDefault();
      const form = event.target;
      const current = form.querySelector("#current-password").value;
      const next = form.querySelector("#new-password").value;
      const confirm = form.querySelector("#confirm-password").value;
      const messages = {
        current: current ? "" : "Enter the current password.",
        new: next.length >= 8 && /[A-Za-z]/.test(next) && /[0-9]/.test(next) ? "" : "Use 8+ characters, a letter, and a number.",
        confirm: confirm && confirm === next ? "" : "The passwords do not match."
      };
      const fields = { current: "current-password", new: "new-password", confirm: "confirm-password" };
      Object.entries(messages).forEach(([key, message]) => {
        form.querySelector(`[data-error-for="${key}"]`).textContent = message;
        form.querySelector(`#${fields[key]}`).setAttribute("aria-invalid", String(Boolean(message)));
      });
      if (Object.values(messages).some(Boolean)) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      form.reset();
      showToast("Prototype only: password was not changed or stored.");
    }
  });

  function downloadReceipt(transactionId) {
    const transaction = mock.transactions.find((item) => item.id === transactionId);
    if (!transaction || transaction.status !== "Paid") return;
    const lawyer = lawyerById(transaction.lawyerId);
    const receipt = [
      "LAWSPHERE — SAMPLE RECEIPT (PROTOTYPE ONLY)",
      `Reference: ${transaction.id}`,
      `Booking: ${transaction.bookingId}`,
      `Lawyer: ${lawyer.name}`,
      `Amount: ${money(transaction.amount)}`,
      `Date: ${dateParts(transaction.date).full}`,
      "This mock document is not proof of payment."
    ].join("\n");
    const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `LawSphere-${transaction.id}-sample-receipt.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Sample receipt downloaded. It is not proof of payment.");
  }

  document.querySelectorAll("[data-preference]").forEach((input) => {
    input.addEventListener("change", () => showToast(`Preference updated for this page only: ${input.getAttribute("aria-label")}.`));
  });
})();
