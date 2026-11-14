/* ============================================================
   SKANDX — js/properties.js
   Property cards, listings page (filters/sort/search),
   property detail page with gallery & bid modal.
   ============================================================ */

/* ------------------------------------------------------------
   Shared card renderer
   ------------------------------------------------------------ */
function propertyCard(p) {
  var wished = getWishlist().indexOf(p.id) !== -1;
  var ended = auctionEnded(p);
  var specs = [];
  if (p.beds) specs.push(p.beds + ' BHK');
  if (p.area) specs.push(formatSqft(p.area));
  if (p.landArea && !p.area) specs.push(formatSqft(p.landArea) + ' land');

  return '' +
  '<article class="prop-card" data-id="' + p.id + '">' +
    '<div class="pc-media">' +
      '<span class="badge badge-gold">' + p.badge + '</span>' +
      '<button class="wish-btn' + (wished ? ' active' : '') + '" data-wish="' + p.id + '" aria-label="Save to wishlist">' +
        '<i class="fa-' + (wished ? 'solid' : 'regular') + ' fa-heart"></i></button>' +
      '<img src="' + p.images[0] + '" alt="' + p.title + '" loading="lazy" onerror="imgFallback(this)" />' +
      '<span class="type-tag">' + typeLabel(p.type) + (specs.length ? ' · ' + specs.join(' · ') : '') + '</span>' +
    '</div>' +
    '<div class="pc-body">' +
      '<h3>' + p.title + '</h3>' +
      '<span class="pc-loc"><i class="fa-solid fa-location-dot"></i>' + p.locality + '</span>' +
      (ended
        ? '<span class="pc-count" style="background:rgba(220,38,38,.08);color:#DC2626;"><i class="fa-solid fa-ban"></i> Auction closed</span>'
        : '<span class="pc-count" data-countdown="card" data-p="' + p.id + '"></span>') +
      '<div class="pc-footer">' +
        '<div class="pc-price"><small>Reserve Price</small><strong>' + formatPrice(p.reserve) + '</strong></div>' +
        '<button class="btn btn-gold btn-sm bid-btn" data-bid="' + p.id + '"><i class="fa-solid fa-gavel"></i> Bid Now</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

/* Delegate card clicks: card -> detail, heart -> wishlist, Bid Now -> modal */
function initCardEvents(container) {
  container.addEventListener('click', function (e) {
    var wishBtn = e.target.closest('[data-wish]');
    if (wishBtn) {
      e.stopPropagation();
      var id = wishBtn.dataset.wish;
      var added = toggleWishlist(id);
      wishBtn.classList.toggle('active', added);
      wishBtn.innerHTML = '<i class="fa-' + (added ? 'solid' : 'regular') + ' fa-heart"></i>';
      toast(added ? 'Property saved to your wishlist' : 'Removed from wishlist', added ? 'success' : 'info', 'fa-heart');
      if (typeof renderDashboard === 'function' && currentPage === 'dashboard') renderDashboard();
      return;
    }

    var bidBtn = e.target.closest('.bid-btn');
    if (bidBtn) {
      e.stopPropagation();
      openBidModal(bidBtn.dataset.bid);
      return;
    }

    var card = e.target.closest('.prop-card');
    if (card) showPage('property', { id: card.dataset.id });
  });
}

/* ------------------------------------------------------------
   LISTINGS PAGE — filters, sorting, rendering
   ------------------------------------------------------------ */
var listState = { cat: null, query: '' };

function applyCategoryPreset(cat) {
  /* preset from home search panel tabs */
  if (cat && cat !== 'all') {
    document.querySelectorAll('.type-check').forEach(function (c) { c.checked = c.value === cat; });
  }
  var budget = document.getElementById('homeBudget').value;
  if (budget && budget !== 'all') {
    var max = Number(budget.split('-')[1]);
    var range = document.getElementById('budgetRange');
    range.value = Math.min(max, Number(range.max));
    updateBudgetLabel();
  }
}

function applyFilters() {
  var q = document.getElementById('propLocation').value.trim().toLowerCase();
  var types = [].slice.call(document.querySelectorAll('.type-check:checked')).map(function (c) { return c.value; });
  var banks = [].slice.call(document.querySelectorAll('.bank-check:checked')).map(function (c) { return c.value; });
  var maxBudget = Number(document.getElementById('budgetRange').value);
  var sort = document.getElementById('sortSelect').value;

  var results = PROPERTIES.filter(function (p) {
    if (q && (p.locality + ' ' + p.address + ' ' + p.title + ' ' + p.bank).toLowerCase().indexOf(q) === -1) return false;
    if (types.indexOf(p.type) === -1) return false;
    if (p.bank === 'Axis Bank') {
      if (banks.indexOf('Axis Bank') === -1) return false;
    } else if (banks.indexOf(p.bank) === -1) return false;
    if (p.reserve > maxBudget) return false;
    return true;
  });

  if (sort === 'price-asc') results.sort(function (a, b) { return a.reserve - b.reserve; });
  else if (sort === 'price-desc') results.sort(function (a, b) { return b.reserve - a.reserve; });
  else if (sort === 'ending') results.sort(function (a, b) { return a.auctionEnd - b.auctionEnd; });
  else results.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });

  renderGrid(results);
}

function renderGrid(results) {
  var grid = document.getElementById('propertiesGrid');
  var empty = document.getElementById('emptyState');
  document.getElementById('resultsCount').textContent =
    'Showing ' + results.length + ' of ' + PROPERTIES.length + ' properties';
  if (!results.length) {
    grid.innerHTML = '';
    empty.hidden = false;
  } else {
    empty.hidden = true;
    grid.innerHTML = results.map(propertyCard).join('');
  }
}

function renderProperties() { applyFilters(); }

function resetFilters() {
  document.getElementById('propLocation').value = '';
  document.querySelectorAll('.type-check, .bank-check').forEach(function (c) { c.checked = true; });
  var range = document.getElementById('budgetRange');
  range.value = range.max;
  updateBudgetLabel();
  document.getElementById('sortSelect').value = 'featured';
  document.getElementById('homeBudget').value = 'all';
  applyFilters();
  toast('Filters reset', 'info', 'fa-rotate-left');
}

function updateBudgetLabel() {
  var v = Number(document.getElementById('budgetRange').value);
  document.getElementById('budgetLabel').textContent = 'Up to ' + formatPrice(v);
}

function initPropertiesPage() {
  initCardEvents(document.getElementById('propertiesGrid'));
  initCardEvents(document.getElementById('featuredGrid'));
  initCardEvents(document.getElementById('auctionsGrid'));
  initCardEvents(document.getElementById('relatedGrid'));

  document.getElementById('propLocation').addEventListener('input', applyFilters);
  document.getElementById('sortSelect').addEventListener('change', applyFilters);
  document.querySelectorAll('.type-check, .bank-check').forEach(function (c) {
    c.addEventListener('change', applyFilters);
  });
  document.getElementById('budgetRange').addEventListener('input', function () {
    updateBudgetLabel();
    applyFilters();
  });
  document.getElementById('resetFilters').addEventListener('click', resetFilters);
  document.getElementById('emptyReset').addEventListener('click', resetFilters);

  /* mobile filters drawer */
  var sidebar = document.getElementById('filtersSidebar');
  var backdrop = document.getElementById('filtersBackdrop');
  document.getElementById('filterToggleBtn').addEventListener('click', function () {
    sidebar.classList.add('open');
    backdrop.hidden = false;
  });
  document.getElementById('closeFilters').addEventListener('click', closeFiltersDrawer);
  backdrop.addEventListener('click', closeFiltersDrawer);
  function closeFiltersDrawer() { sidebar.classList.remove('open'); backdrop.hidden = true; }

  /* home search panel */
  document.querySelectorAll('#spTabs .sp-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('#spTabs .sp-tab').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
    });
  });
  document.getElementById('homeSearchBtn').addEventListener('click', function () {
    var cat = document.querySelector('#spTabs .sp-tab.active').dataset.cat;
    document.getElementById('homeType').value = cat === 'all' ? 'all' : cat;
    showPage('properties', { cat: cat });
    /* carry the typed location */
    var loc = document.getElementById('homeLocation').value.trim();
    if (loc) {
      document.getElementById('propLocation').value = loc;
      applyFilters();
    }
  });

  updateBudgetLabel();
  renderFeatured();
  renderAuctions();
}

function renderFeatured() {
  var featured = PROPERTIES.filter(function (p) { return p.featured; });
  document.getElementById('featuredGrid').innerHTML = featured.map(propertyCard).join('');
}

function renderAuctions() {
  var all = PROPERTIES.slice().sort(function (a, b) { return a.auctionEnd - b.auctionEnd; });
  document.getElementById('auctionsGrid').innerHTML = all.map(propertyCard).join('');
}

/* ------------------------------------------------------------
   PROPERTY DETAIL PAGE
   ------------------------------------------------------------ */
var detailProp = null;
var galIndex = 0;

function openPropertyDetail(id) {
  var p = findProperty(id);
  if (!p) return showPage('properties');
  detailProp = p;
  galIndex = 0;

  document.getElementById('crumbCurrent').textContent = p.title;
  document.getElementById('detailTitle').textContent = p.title;
  document.getElementById('detailLocation').textContent = p.address;
  document.getElementById('detailBadge').textContent = p.badge;
  document.getElementById('detailArea').textContent = formatSqft(p.area);
  document.getElementById('detailLandArea').textContent = formatSqft(p.landArea);
  document.getElementById('detailType').textContent = typeLabel(p.type);
  document.getElementById('dpReserve').textContent = formatPrice(p.reserve);
  document.getElementById('dpEmd').textContent = formatPrice(p.emd);
  document.getElementById('dpIncrement').textContent = formatRupees(p.increment);
  document.getElementById('detailDesc').textContent = p.desc;
  document.getElementById('bankName').textContent = p.bank;
  document.getElementById('bankBranch').textContent = p.branch;
  document.getElementById('bankAsset').textContent = p.assetCode;
  document.getElementById('bankContact').textContent = p.contact + ' (Demo)';
  document.getElementById('countdown').dataset.end = p.auctionEnd;
  document.getElementById('placeBidBtn').disabled = false;
  document.getElementById('placeBidBtn').innerHTML = '<i class="fa-solid fa-gavel"></i> Place Bid Now';

  /* wishlist state */
  var wished = getWishlist().indexOf(p.id) !== -1;
  var wbtn = document.getElementById('detailWishlist');
  wbtn.dataset.id = p.id;
  wbtn.classList.toggle('active', wished);
  wbtn.innerHTML = '<i class="fa-' + (wished ? 'solid' : 'regular') + ' fa-heart"></i>';

  renderGallery();
  renderRelated(p);
  tickCountdowns();
}

function renderGallery() {
  var p = detailProp;
  var main = document.getElementById('galleryMain');
  main.src = p.images[galIndex];
  main.alt = p.title + ' — image ' + (galIndex + 1);
  document.getElementById('galleryBadge').textContent = p.badge;

  document.getElementById('galleryThumbs').innerHTML = p.images.map(function (src, i) {
    return '<img src="' + src + '" alt="Thumbnail ' + (i + 1) + '" data-idx="' + i + '"' +
      (i === galIndex ? ' class="active"' : '') + ' loading="lazy" onerror="imgFallback(this)" />';
  }).join('');
}

function initDetailPage() {
  /* gallery controls */
  document.getElementById('galleryPrev').addEventListener('click', function () {
    if (!detailProp) return;
    galIndex = (galIndex - 1 + detailProp.images.length) % detailProp.images.length;
    renderGallery();
  });
  document.getElementById('galleryNext').addEventListener('click', function () {
    if (!detailProp) return;
    galIndex = (galIndex + 1) % detailProp.images.length;
    renderGallery();
  });
  document.getElementById('galleryThumbs').addEventListener('click', function (e) {
    var t = e.target.closest('img[data-idx]');
    if (!t) return;
    galIndex = Number(t.dataset.idx);
    renderGallery();
  });

  /* wishlist on detail */
  document.getElementById('detailWishlist').addEventListener('click', function () {
    if (!detailProp) return;
    var added = toggleWishlist(detailProp.id);
    this.classList.toggle('active', added);
    this.innerHTML = '<i class="fa-' + (added ? 'solid' : 'regular') + ' fa-heart"></i>';
    toast(added ? 'Property saved to your wishlist' : 'Removed from wishlist', added ? 'success' : 'info', 'fa-heart');
  });

  /* share */
  document.getElementById('detailShare').addEventListener('click', function () {
    if (!detailProp) return;
    if (navigator.share) {
      navigator.share({ title: 'SKANDX — ' + detailProp.title, text: detailProp.desc, url: location.href }).catch(function () {});
    } else {
      toast('Share link copied to clipboard', 'success', 'fa-share-nodes');
    }
  });

  /* action buttons (simulated) */
  document.getElementById('downloadBrochure').addEventListener('click', function () {
    toast('Brochure download started (demo)', 'success', 'fa-file-arrow-down');
  });
  document.getElementById('propertyDocs').addEventListener('click', function () {
    toast('Opening property documents (demo)', 'info', 'fa-folder-open');
  });
  document.getElementById('siteVisit').addEventListener('click', function () {
    toast('Site visit request sent — our officer will call you (demo)', 'success', 'fa-person-walking-luggage');
  });

  /* bid modal triggers */
  document.getElementById('placeBidBtn').addEventListener('click', function () {
    if (detailProp) openBidModal(detailProp.id);
  });
}

function renderRelated(current) {
  var rel = PROPERTIES.filter(function (p) { return p.id !== current.id && p.type === current.type; })
    .slice(0, 3);
  if (rel.length < 3) {
    rel = rel.concat(PROPERTIES.filter(function (p) {
      return p.id !== current.id && rel.indexOf(p) === -1;
    })).slice(0, 3);
  }
  document.getElementById('relatedGrid').innerHTML = rel.map(propertyCard).join('');
}

/* ------------------------------------------------------------
   BID MODAL (simulated)
   ------------------------------------------------------------ */
var bidTarget = null;

function openBidModal(id) {
  var p = findProperty(id);
  if (!p) return;
  if (auctionEnded(p)) {
    toast('This auction has already closed', 'error', 'fa-hourglass-end');
    return;
  }
  bidTarget = p;
  document.getElementById('bidPropName').textContent = p.title + ' · ' + p.locality;
  document.getElementById('bidCurrent').textContent = formatPrice(p.reserve);
  document.getElementById('bidIncrementNote').textContent =
    'Minimum bid: ' + formatPrice(p.reserve + p.increment) + ' (increments of ' + formatRupees(p.increment) + ')';
  document.getElementById('bidInput').value = '';
  document.getElementById('bidInput').min = p.reserve + p.increment;
  document.getElementById('bidError').hidden = true;
  openModal('bidModal');
}

function initBidModal() {
  document.getElementById('bidForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!bidTarget) return;
    var amount = Number(document.getElementById('bidInput').value);
    var err = document.getElementById('bidError');

    /* validation */
    if (!amount || amount <= 0) {
      err.textContent = 'Please enter a valid bid amount.';
      err.hidden = false;
      return;
    }
    if (amount < bidTarget.reserve + bidTarget.increment) {
      err.textContent = 'Your bid must be at least ' + formatPrice(bidTarget.reserve + bidTarget.increment) + '.';
      err.hidden = false;
      return;
    }

    err.hidden = true;
    saveMyBid(bidTarget.id, amount);
    closeModal('bidModal');
    toast('Bid of ' + formatPrice(amount) + ' placed on "' + bidTarget.title + '"', 'success', 'fa-gavel');
    if (typeof renderDashboard === 'function') renderDashboard();
  });
}
