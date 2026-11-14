/* ============================================================
   SKANDX — js/app.js
   Application bootstrap: wires all modules on DOM ready.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* Seed the demo user on first visit */
  if (!getUser()) setUser(DEMO_USER);

  /* Core wiring */
  initNavigation();
  initModals();
  initNotifications();
  initCountdowns();

  /* Pages */
  initPropertiesPage();
  initDetailPage();
  initDashboard();

  /* First paint */
  renderProperties();
  renderAuctions();
  renderDashboard();
  showPage('home');

  /* Keep hero + card countdowns ticking even when pages re-render */
  setInterval(function () {
    if (currentPage === 'home' || currentPage === 'properties' || currentPage === 'auctions') {
      /* countdowns live in the DOM via data-countdown attributes */
    }
  }, 60000);
});
