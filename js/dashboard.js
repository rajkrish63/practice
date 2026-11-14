/* ============================================================
   SKANDX — js/dashboard.js
   Dashboard rendering: stats, bids tables, saved properties,
   profile/KYC/support views.
   ============================================================ */

var DASH_VIEWS = {
  overview: 'Dashboard',
  bids: 'My Bids',
  saved: 'Saved Properties',
  alerts: 'Alerts & Notifications',
  profile: 'My Profile',
  kyc: 'KYC & Documents',
  support: 'Support'
};

function renderDashboard() {
  renderDashUser();
  renderDashStats();
  renderBidsTable();
  renderSavedProperties();
  renderNotifications();
}

function renderDashUser() {
  var u = getUser() || DEMO_USER;
  var name = u.name || DEMO_USER.name;
  var initials = name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
  document.getElementById('dashName').textContent = 'Welcome back, ' + name;
  document.getElementById('dashAvatar').textContent = initials;
  document.getElementById('dashMeta').textContent = 'Verified Bidder · Member since ' + (DEMO_USER.memberSince);

  var d = new Date();
  document.getElementById('dashDate').textContent =
    d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function renderDashStats() {
  var bids = getMyBids();
  var active = 0;
  Object.keys(bids).forEach(function (id) {
    var p = findProperty(id);
    if (p && !auctionEnded(p)) active++;
  });
  /* seed demo values so the dashboard never looks empty */
  active = Math.max(active, 3);
  document.getElementById('dActiveBids').textContent = active;
  document.getElementById('dWatched').textContent = Math.max(getWishlist().length, 5);
  document.getElementById('dWon').textContent = DASH_STATS_DEMO.won;
  document.getElementById('dInProcess').textContent = DASH_STATS_DEMO.inProcess;
}

/* Build merged bid rows: demo bids + user's saved bids */
function getBidRows() {
  var rows = [];
  var myBids = getMyBids();

  /* user's own bids first (live) */
  Object.keys(myBids).forEach(function (id) {
    var p = findProperty(id);
    if (p && !auctionEnded(p)) {
      rows.push({ p: p, myBid: myBids[id].amount, status: 'Live' });
    }
  });

  /* demo seed bids for realism */
  var seeds = [
    { id: 'p3', amount: 6300000 },
    { id: 'p9', amount: 12100000 },
    { id: 'p14', amount: 13600000 }
  ];
  seeds.forEach(function (s) {
    var p = findProperty(s.id);
    if (p && !rows.some(function (r) { return r.p.id === s.id; })) {
      rows.push({ p: p, myBid: myBids[s.id] ? myBids[s.id].amount : s.amount, status: auctionEnded(p) ? 'Closed' : 'Live' });
    }
  });
  return rows;
}

function renderBidsTable() {
  var rows = getBidRows();
  var tb = document.getElementById('bidsTable');
  var tbh = document.getElementById('bidsHistoryTable');

  var trs = rows.map(function (r) {
    var t = timeRemaining(r.p.auctionEnd);
    var ends = t.total === 0
      ? 'Closed'
      : pad2(t.d) + 'd ' + pad2(t.h) + 'h ' + pad2(t.m) + 'm';
    var statusBadge = r.status === 'Live'
      ? '<span class="badge badge-green">Live</span>'
      : '<span class="badge badge-red">Closed</span>';
    var row =
      '<tr>' +
        '<td><div class="t-prop"><img src="' + r.p.images[0] + '" alt="" onerror="imgFallback(this)" />' +
          '<div><strong>' + r.p.title + '</strong><small>' + r.p.bank + ' · ' + r.p.badge + '</small></div></div></td>' +
        '<td>' + r.p.locality + '</td>' +
        '<td class="navy-val">' + formatPrice(r.p.reserve) + '</td>' +
        '<td class="gold-val">' + formatPrice(r.myBid) + '</td>' +
        '<td>' + ends + '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td><button class="btn btn-outline btn-sm" data-detail="' + r.p.id + '">View Details</button></td>' +
      '</tr>';
    return row;
  }).join('');

  if (!trs) {
    trs = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px;">No active bids yet — explore auctions to place your first bid.</td></tr>';  }
  tb.innerHTML = trs;
  tbh.innerHTML = trs;

  /* view-details buttons */
  [tb, tbh].forEach(function (t) {
    t.querySelectorAll('[data-detail]').forEach(function (b) {
      b.addEventListener('click', function () { showPage('property', { id: b.dataset.detail }); });
    });
  });
}

function renderSavedProperties() {
  var ids = getWishlist();
  var grid = document.getElementById('savedGrid');
  var empty = document.getElementById('savedEmpty');
  var saved = ids.map(findProperty).filter(Boolean);

  document.getElementById('savedCount').textContent = saved.length + ' saved';
  grid.innerHTML = saved.map(propertyCard).join('');
  grid.style.display = saved.length ? 'grid' : 'none';
  empty.style.display = saved.length ? 'none' : 'grid';
  if (saved.length) initCardEvents(grid);
}

function initDashboard() {
  /* sidebar navigation */
  document.querySelectorAll('#dashNav .dash-link[data-view]').forEach(function (btn) {
    btn.addEventListener('click', function () { switchDashView(btn.dataset.view); });
  });
  document.querySelectorAll('[data-view-link]').forEach(function (btn) {
    btn.addEventListener('click', function () { switchDashView(btn.dataset.view); });
  });

  /* logout */
  document.getElementById('logoutBtn').addEventListener('click', function () {
    setUser({ loggedIn: false });
    toast('Logged out — demo session ended', 'info', 'fa-arrow-right-from-bracket');
    showPage('home');
  });

  /* profile save */
  document.getElementById('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var u = getUser() || {};
    u.name = document.getElementById('pfName').value.trim() || DEMO_USER.name;
    u.email = document.getElementById('pfEmail').value;
    u.phone = document.getElementById('pfPhone').value;
    setUser(u);
    renderDashUser();
    toast('Profile updated successfully', 'success');
  });

  /* KYC upload demo */
  document.getElementById('kycUpload').addEventListener('click', function () {
    toast('Bank proof uploaded for review (demo)', 'success', 'fa-cloud-arrow-up');
  });

  /* raise ticket demo */
  document.getElementById('raiseTicket').addEventListener('click', function () {
    toast('Support ticket #SKX-2048 created (demo)', 'success', 'fa-headset');
  });

  /* FAQ accordions */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (f) { f.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function switchDashView(view) {
  if (!DASH_VIEWS[view]) view = 'overview';
  document.querySelectorAll('.dash-view').forEach(function (v) {
    v.classList.toggle('active', v.id === 'dv-' + view);
  });
  document.querySelectorAll('#dashNav .dash-link').forEach(function (l) {
    l.classList.toggle('active', l.dataset.view === view);
  });
  document.getElementById('dashTitle').textContent = DASH_VIEWS[view];
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'overview' || view === 'bids') renderBidsTable();
  if (view === 'saved') renderSavedProperties();
  if (view === 'alerts') renderNotifications();
}
