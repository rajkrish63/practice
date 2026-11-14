/* ============================================================
   SKANDX — js/interactions.js
   Toasts, modals (login / register / bid), notifications,
   countdown engine, wishlist storage.
   ============================================================ */

/* ------------------------------------------------------------
   localStorage helpers
   ------------------------------------------------------------ */
function lsGet(key, fallback) {
  try {
    var v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch (e) { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
}

var WISHLIST_KEY = 'skandx_wishlist';
var USER_KEY = 'skandx_user';
var BIDS_KEY = 'skandx_bids';

function getWishlist() { return lsGet(WISHLIST_KEY, []); }
function toggleWishlist(id) {
  var w = getWishlist();
  var i = w.indexOf(id);
  if (i === -1) { w.push(id); } else { w.splice(i, 1); }
  lsSet(WISHLIST_KEY, w);
  return i !== -1; /* true = now wishlisted */
}

function getUser() { return lsGet(USER_KEY, null); }
function setUser(u) { lsSet(USER_KEY, u); }

/* user bids map: { propId: { amount, at } } */
function getMyBids() { return lsGet(BIDS_KEY, {}); }
function saveMyBid(propId, amount) {
  var b = getMyBids();
  b[propId] = { amount: amount, at: Date.now() };
  lsSet(BIDS_KEY, b);
}

/* ------------------------------------------------------------
   Toast notification system
   ------------------------------------------------------------ */
function toast(msg, type, icon) {
  var wrap = document.getElementById('toastWrap');
  var el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.innerHTML =
    '<i class="fa-solid ' + (icon || (type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info')) + '"></i>' +
    '<span>' + msg + '</span>';
  wrap.appendChild(el);
  setTimeout(function () {
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 320);
  }, 3600);
}

/* ------------------------------------------------------------
   Modals
   ------------------------------------------------------------ */
function openModal(id) { document.getElementById(id).hidden = false; document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).hidden = true; document.body.style.overflow = ''; }

function initModals() {
  /* close buttons */
  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.dataset.close); });
  });
  /* overlay click */
  document.querySelectorAll('.modal-overlay').forEach(function (ov) {
    ov.addEventListener('click', function (e) { if (e.target === ov) closeModal(ov.id); });
  });
  /* switch links between login/register */
  document.querySelectorAll('[data-switch]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.modal-overlay').forEach(function (m) { m.hidden = true; });
      openModal(a.dataset.switch);
    });
  });
  /* ESC closes */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(function (m) { m.hidden = true; document.body.style.overflow = ''; });
      closeSearchOverlay();
      document.getElementById('notifDropdown').hidden = true;
    }
  });

  /* Login / register triggers */
  ['loginBtn', 'loginBtnMobile'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', function () { closeMobileNav(); openModal('loginModal'); });
  });
  ['registerBtn', 'registerBtnMobile', 'ctaRegister'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', function () { closeMobileNav(); openModal('registerModal'); });
  });

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    closeModal('loginModal');
    var u = getUser() || {};
    u.loggedIn = true;
    setUser(u);
    toast('Welcome back, ' + (u.name || DEMO_USER.name) + '!', 'success');
    if (typeof renderDashboard === 'function') renderDashboard();
  });

  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('regName').value.trim() || DEMO_USER.name;
    closeModal('registerModal');
    setUser({ name: name, email: document.getElementById('regEmail').value, loggedIn: true });
    toast('Account created — welcome to SKANDX, ' + name.split(' ')[0] + '!', 'success');
    if (typeof renderDashboard === 'function') renderDashboard();
  });
}

/* ------------------------------------------------------------
   Notifications dropdown
   ------------------------------------------------------------ */
function renderNotifications() {
  var list = document.getElementById('notifList');
  var dashList = document.getElementById('dashNotifList');
  var unread = NOTIFICATIONS.filter(function (n) { return n.unread; }).length;
  document.getElementById('notifBadge').textContent = unread;
  document.getElementById('notifBadge').classList.toggle('hide', unread === 0);

  var html = NOTIFICATIONS.map(function (n) {
    return '<div class="notif-item' + (n.unread ? ' unread' : '') + '">' +
      '<span class="ni-icon"><i class="fa-solid ' + n.icon + '"></i></span>' +
      '<div><strong>' + n.title + '</strong><p>' + n.text + '</p><time>' + n.time + '</time></div></div>';
  }).join('');
  list.innerHTML = html;
  if (dashList) dashList.innerHTML = html;

  document.getElementById('dashMarkRead') && (document.getElementById('dashMarkRead').onclick = markAllRead);
}

function markAllRead() {
  NOTIFICATIONS.forEach(function (n) { n.unread = false; });
  renderNotifications();
  toast('All notifications marked as read', 'info', 'fa-bell');
}

function initNotifications() {
  var toggle = document.getElementById('notifToggle');
  var dd = document.getElementById('notifDropdown');
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    dd.hidden = !dd.hidden;
  });
  document.addEventListener('click', function (e) {
    if (!dd.hidden && !dd.contains(e.target)) dd.hidden = true;
  });
  document.getElementById('notifMarkRead').addEventListener('click', markAllRead);
}

/* ------------------------------------------------------------
   Countdown engine
   - elements with [data-countdown="card"][data-p] -> inline text
   - elements with [data-countdown="ends"][data-p]  -> hero card
   - #countdown on detail page -> four units
   ------------------------------------------------------------ */
var COUNTDOWN_TIMERS = [];

function initCountdowns() {
  setInterval(tickCountdowns, 1000);
  tickCountdowns();
}

function tickCountdowns() {
  /* inline card countdowns */
  document.querySelectorAll('[data-countdown="card"]').forEach(function (el) {
    var p = findProperty(el.dataset.p);
    if (!p) return;
    var t = timeRemaining(p.auctionEnd);
    if (t.total === 0) { el.textContent = 'Auction closed'; return; }
    el.innerHTML =
      '<i class="fa-regular fa-clock"></i> ' +
      pad2(t.d) + 'd ' + pad2(t.h) + 'h ' + pad2(t.m) + 'm ' + pad2(t.s) + 's';
  });

  /* hero floating card */
  var heroCd = document.querySelector('[data-countdown="ends"]');
  if (heroCd) {
    var hp = findProperty(heroCd.dataset.p);
    if (hp) {
      var ht = timeRemaining(hp.auctionEnd);
      heroCd.textContent = ht.total === 0
        ? 'Closed'
        : pad2(ht.d) + 'd : ' + pad2(ht.h) + 'h : ' + pad2(ht.m) + 'm : ' + pad2(ht.s) + 's';
    }
  }

  /* detail page big countdown */
  var cd = document.getElementById('countdown');
  if (cd && cd.dataset.end) {
    var t2 = timeRemaining(Number(cd.dataset.end));
    if (t2.total === 0) {
      cd.querySelector('.cd-d').textContent = '0';
      document.getElementById('placeBidBtn').disabled = true;
      document.getElementById('placeBidBtn').innerHTML = '<i class="fa-solid fa-ban"></i> Auction Closed';
      return;
    }
    cd.querySelector('.cd-d').textContent = t2.d;
    cd.querySelector('.cd-h').textContent = pad2(t2.h);
    cd.querySelector('.cd-m').textContent = pad2(t2.m);
    cd.querySelector('.cd-s').textContent = pad2(t2.s);
  }
}

function pad2(n) { return String(n).padStart(2, '0'); }

/* find property by id (exposed for all modules) */
function findProperty(id) {
  for (var i = 0; i < PROPERTIES.length; i++) if (PROPERTIES[i].id === id) return PROPERTIES[i];
  return null;
}
