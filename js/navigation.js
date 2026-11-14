/* ============================================================
   SKANDX — js/navigation.js
   SPA-style routing between pages, header interactions,
   mobile hamburger, search overlay.
   ============================================================ */

var PAGES = ['home', 'properties', 'property', 'auctions', 'services', 'about', 'dashboard'];
var currentPage = 'home';

/* Show a page by key; `sub` = optional filter/detail id */
function showPage(name, opts) {
  opts = opts || {};
  if (PAGES.indexOf(name) === -1) name = 'home';

  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.toggle('active', p.id === 'page-' + name);
  });

  document.querySelectorAll('.main-nav .nav-link, .mobile-nav .nav-link').forEach(function (l) {
    l.classList.toggle('active', l.dataset.page === name);
  });

  currentPage = name;
  closeMobileNav();
  closeSearchOverlay();

  /* page-specific hooks */
  if (name === 'properties') {
    if (opts.cat) applyCategoryPreset(opts.cat);
    if (typeof opts.query === 'string') {
      document.getElementById('propLocation').value = opts.query;
      applyFilters();
    }
    renderProperties();
  }
  if (name === 'auctions' && typeof renderAuctions === 'function') renderAuctions();
  if (name === 'dashboard' && typeof renderDashboard === 'function') renderDashboard();
  if (name === 'property' && opts.id && typeof openPropertyDetail === 'function') {
    openPropertyDetail(opts.id);
  }

  /* scroll to top of main content */
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* Wire all [data-page] triggers (nav links, buttons, footer, breadcrumbs) */
function initNavigation() {
  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showPage(el.dataset.page);
    });
  });

  /* Hamburger */
  var burger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', function () {
    var open = !mobileNav.hidden;
    mobileNav.hidden = open;
    burger.setAttribute('aria-expanded', String(!open));
    burger.innerHTML = open
      ? '<i class="fa-solid fa-bars"></i>'
      : '<i class="fa-solid fa-xmark"></i>';
  });

  /* Search overlay */
  document.getElementById('searchToggle').addEventListener('click', openSearchOverlay);
  document.getElementById('searchClose').addEventListener('click', closeSearchOverlay);
  document.getElementById('searchOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeSearchOverlay();
  });
  document.getElementById('searchGo').addEventListener('click', runHeaderSearch);
  document.getElementById('searchInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') runHeaderSearch();
  });
}

function runHeaderSearch() {
  var q = document.getElementById('searchInput').value.trim();
  closeSearchOverlay();
  showPage('properties', { query: q });
}

function openSearchOverlay() {
  var ov = document.getElementById('searchOverlay');
  ov.hidden = false;
  setTimeout(function () { document.getElementById('searchInput').focus(); }, 60);
}
function closeSearchOverlay() {
  document.getElementById('searchOverlay').hidden = true;
}

function closeMobileNav() {
  var nav = document.getElementById('mobileNav');
  if (!nav.hidden) {
    nav.hidden = true;
    var b = document.getElementById('hamburger');
    b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
}
