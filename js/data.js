/* ============================================================
   SKANDX — js/data.js
   Demo data: properties, user, notifications, helpers.
   All data is simulated for the frontend demonstration.
   ============================================================ */

/* Helper to build stable Unsplash image URLs */
function unsplash(id, w = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
}

/* Shared interior / secondary shots used inside galleries */
const GALLERY_POOL = [
  unsplash('photo-1600607687939-ce8a6c25118c'), // modern living room
  unsplash('photo-1554995207-c18c203602cb'),    // bright interior
  unsplash('photo-1600121848594-d8644e57abab'), // luxury interior
  unsplash('photo-1584622650111-993a426fbf0a'), // bathroom
  unsplash('photo-1600566752355-35792bedcfea'), // kitchen / dining
  unsplash('photo-1600585154526-990dced4db0d')  // bedroom
];

/* ------------------------------------------------------------
   Demo properties (14 listings across Chennai & other cities)
   daysAhead: auction end offset from "now" (float days)
   ------------------------------------------------------------ */
const RAW_PROPERTIES = [
  {
    id: 'p1',
    title: 'Independent House (3 BHK)',
    badge: 'E-AUCTION',
    type: 'residential',
    locality: 'Madipakkam, Chennai',
    address: 'Madipakkam, Chennai – 600091',
    bank: 'Canara Bank', branch: 'Santhome, Chennai',
    assetCode: 'C8CHN10246', contact: '044-2811 4455',
    reserve: 7800000, increment: 50000, emdPct: 10,
    area: 2100, landArea: 1800, beds: 3, baths: 2,
    daysAhead: 5.4, featured: true,
    images: [
      unsplash('photo-1600585154340-be6161a56a0c'),
      GALLERY_POOL[0], GALLERY_POOL[1], GALLERY_POOL[4]
    ],
    desc: 'Well-maintained independent house in the heart of Madipakkam with excellent connectivity to Velachery MRTS and OMR. Clear title, bank-owned and ready for physical possession.'
  },
  {
    id: 'p2',
    title: 'Luxury Villa (4 BHK)',
    badge: 'BANK AUCTION',
    type: 'residential',
    locality: 'Thoraipakkam, OMR, Chennai',
    address: 'Thoraipakkam, OMR, Chennai – 600097',
    bank: 'SBI', branch: 'Sholinganallur, Chennai',
    assetCode: 'SBCHN45782', contact: '044-2455 1190',
    reserve: 14500000, increment: 100000, emdPct: 10,
    area: 3400, landArea: 2600, beds: 4, baths: 4,
    daysAhead: 3.2, featured: true,
    images: [
      unsplash('photo-1512917774080-9991f1c4c750'),
      GALLERY_POOL[2], GALLERY_POOL[0], GALLERY_POOL[5]
    ],
    desc: 'Premium gated-community villa on OMR with private garden, clubhouse access and covered parking. Ideal for end-use or high rental yield near IT corridor.'
  },
  {
    id: 'p3',
    title: '2 BHK Apartment',
    badge: 'E-AUCTION',
    type: 'residential',
    locality: 'Anna Nagar West, Chennai',
    address: 'Anna Nagar West, Chennai – 600040',
    bank: 'ICICI Bank', branch: 'Anna Nagar, Chennai',
    assetCode: 'ICCHN20911', contact: '044-3020 7788',
    reserve: 6200000, increment: 25000, emdPct: 10,
    area: 1080, landArea: null, beds: 2, baths: 2,
    daysAhead: 8.1, featured: false,
    images: [
      unsplash('photo-1545324418-cc1a3fa10c00'),
      GALLERY_POOL[1], GALLERY_POOL[3], GALLERY_POOL[4]
    ],
    desc: 'Corner apartment in a well-established tower with lift, covered car park and 24×7 security. Walking distance to Anna Nagar Tower metro station.'
  },
  {
    id: 'p4',
    title: 'Residential Plot (2,400 sq.ft)',
    badge: 'RESERVE AUCTION',
    type: 'land',
    locality: 'Perungudi, Chennai',
    address: 'Perungudi, Chennai – 600096',
    bank: 'SBI', branch: 'Perungudi, Chennai',
    assetCode: 'SBCHN51102', contact: '044-2496 2210',
    reserve: 9500000, increment: 50000, emdPct: 10,
    area: null, landArea: 2400, beds: null, baths: null,
    daysAhead: 2.3, featured: true,
    images: [
      unsplash('photo-1500382017468-9049fed7470f'),
      GALLERY_POOL[5], GALLERY_POOL[2]
    ],
    desc: 'CMDA-approved rectangular plot in a rapidly developing residential belt, 5 mins from Perungudi toll and Rajiv Gandhi Salai. Ready for immediate registration.'
  },
  {
    id: 'p5',
    title: 'Commercial Office Space',
    badge: 'E-AUCTION',
    type: 'commercial',
    locality: 'T. Nagar, Chennai',
    address: 'Usman Road, T. Nagar, Chennai – 600017',
    bank: 'Canara Bank', branch: 'T. Nagar, Chennai',
    assetCode: 'C8CHN40795', contact: '044-2815 6630',
    reserve: 21000000, increment: 200000, emdPct: 10,
    area: 4200, landArea: null, beds: null, baths: 2,
    daysAhead: 6.6, featured: true,
    images: [
      unsplash('photo-1497366216548-37526070297c'),
      GALLERY_POOL[1], GALLERY_POOL[0]
    ],
    desc: 'Grade-A fitted office floor on Usman Road with dedicated lobby and parking. Strong footfall commercial micro-market with assured tenant interest.'
  },
  {
    id: 'p6',
    title: 'Industrial Warehouse',
    badge: 'NPA SALE',
    type: 'industrial',
    locality: 'Ambattur Industrial Estate, Chennai',
    address: 'Ambattur Industrial Estate, Chennai – 600058',
    bank: 'ICICI Bank', branch: 'Ambattur, Chennai',
    assetCode: 'ICCHN61233', contact: '044-4012 9050',
    reserve: 34000000, increment: 250000, emdPct: 10,
    area: 12000, landArea: 18500, beds: null, baths: 2,
    daysAhead: 9.4, featured: false,
    images: [
      unsplash('photo-1553413077-190dd305871c'),
      GALLERY_POOL[2], GALLERY_POOL[1]
    ],
    desc: 'Standing warehouse with 24 ft clear height, 3-phase power and heavy-foundation industrial flooring. Direct highway access for container movement.'
  },
  {
    id: 'p7',
    title: '3 BHK Apartment',
    badge: 'BANK AUCTION',
    type: 'residential',
    locality: 'Whitefield, Bengaluru',
    address: 'Whitefield, Bengaluru – 560066',
    bank: 'Axis Bank', branch: 'Whitefield, Bengaluru',
    assetCode: 'AXBLR33218', contact: '080-6180 4422',
    reserve: 8800000, increment: 50000, emdPct: 10,
    area: 1675, landArea: null, beds: 3, baths: 3,
    daysAhead: 4.5, featured: false,
    images: [
      unsplash('photo-1460317442991-0ec209397118'),
      GALLERY_POOL[4], GALLERY_POOL[3], GALLERY_POOL[0]
    ],
    desc: 'Spacious apartment in a premium Whitefield community with pool, gym and clubhouse. Close to ITPL and major tech parks.'
  },
  {
    id: 'p8',
    title: 'Commercial Showroom',
    badge: 'E-AUCTION',
    type: 'commercial',
    locality: 'Banjara Hills, Hyderabad',
    address: 'Road No. 12, Banjara Hills, Hyderabad – 500034',
    bank: 'SBI', branch: 'Banjara Hills, Hyderabad',
    assetCode: 'SBHYD77410', contact: '040-2354 8890',
    reserve: 18500000, increment: 150000, emdPct: 10,
    area: 3800, landArea: 5200, beds: null, baths: 2,
    daysAhead: 7.2, featured: false,
    images: [
      unsplash('photo-1441986300917-64674bd600d8'),
      GALLERY_POOL[1], GALLERY_POOL[2]
    ],
    desc: 'Double-height retail showroom on Hyderabad\u2019s most premium retail stretch. Excellent visibility and signage rights included.'
  },
  {
    id: 'p9',
    title: 'Residential Plot (1,100 sq.ft)',
    badge: 'BANK AUCTION',
    type: 'land',
    locality: 'Gachibowli, Hyderabad',
    address: 'Gachibowli, Hyderabad – 500032',
    bank: 'Canara Bank', branch: 'Gachibowli, Hyderabad',
    assetCode: 'C8HYD18340', contact: '040-2318 7712',
    reserve: 12000000, increment: 100000, emdPct: 10,
    area: null, landArea: 1100, beds: null, baths: null,
    daysAhead: 10.5, featured: false,
    images: [
      unsplash('photo-1470071459604-3b5ec3a7fe05'),
      GALLERY_POOL[5], GALLERY_POOL[0]
    ],
    desc: 'HMDA-approved plot in the financial district corridor beside the Outer Ring Road. Surrounded by premium gated projects.'
  },
  {
    id: 'p10',
    title: 'Factory Building',
    badge: 'NPA SALE',
    type: 'industrial',
    locality: 'Peenya Industrial Area, Bengaluru',
    address: 'Peenya Industrial Area, Bengaluru – 560058',
    bank: 'SBI', branch: 'Peenya, Bengaluru',
    assetCode: 'SBBLR29561', contact: '080-2295 3341',
    reserve: 27500000, increment: 200000, emdPct: 10,
    area: 9800, landArea: 14000, beds: null, baths: 3,
    daysAhead: 11.3, featured: false,
    images: [
      unsplash('photo-1581094794329-c8112a89af12'),
      GALLERY_POOL[2], GALLERY_POOL[1]
    ],
    desc: 'Operational factory unit with eot cranes, staff block and transformer yard. Zoned industrial with clear transfer of possession.'
  },
  {
    id: 'p11',
    title: 'Sea-facing 3 BHK Apartment',
    badge: 'E-AUCTION',
    type: 'residential',
    locality: 'ECR, Chennai',
    address: 'East Coast Road, Chennai – 600115',
    bank: 'ICICI Bank', branch: 'Adyar, Chennai',
    assetCode: 'ICCHN58201', contact: '044-2445 3360',
    reserve: 11000000, increment: 75000, emdPct: 10,
    area: 1850, landArea: null, beds: 3, baths: 3,
    daysAhead: 5.7, featured: true,
    images: [
      unsplash('photo-1600596542815-ffad4c1539a9'),
      GALLERY_POOL[0], GALLERY_POOL[5], GALLERY_POOL[4]
    ],
    desc: 'Bright sea-facing apartment with wraparound balcony on ECR, minutes from Akkarai beach. Resort-style amenities and covered parking.'
  },
  {
    id: 'p12',
    title: 'Agricultural Land Parcel (2.5 Acres)',
    badge: 'RESERVE AUCTION',
    type: 'land',
    locality: 'Sriperumbudur, Chennai',
    address: 'Sriperumbudur Taluk, Kanchipuram Dist – 602105',
    bank: 'Axis Bank', branch: 'Sriperumbudur',
    assetCode: 'AXMSR11405', contact: '044-2710 4489',
    reserve: 6500000, increment: 25000, emdPct: 10,
    area: null, landArea: 108900, beds: null, baths: null,
    daysAhead: 12.6, featured: false,
    images: [
      unsplash('photo-1500595046743-cd271d694d30'),
      GALLERY_POOL[5], GALLERY_POOL[3]
    ],
    desc: 'Fertilised patta land with borewell and road frontage on the Sriperumbudur growth corridor. Strong long-term land-bank potential.'
  },
  {
    id: 'p13',
    title: 'Retail Complex',
    badge: 'NPA SALE',
    type: 'commercial',
    locality: 'Nehru Place, New Delhi',
    address: 'Nehru Place, New Delhi – 110019',
    bank: 'SBI', branch: 'Nehru Place, New Delhi',
    assetCode: 'SBDEL90227', contact: '011-4155 9080',
    reserve: 42000000, increment: 500000, emdPct: 10,
    area: 7400, landArea: null, beds: null, baths: 4,
    daysAhead: 6.9, featured: false,
    images: [
      unsplash('photo-1486406146926-c627a92ad1ab'),
      GALLERY_POOL[1], GALLERY_POOL[0]
    ],
    desc: 'Multi-tenant retail block in Asia\u2019s largest IT hardware market with 100% occupancy history and premium footfall.'
  },
  {
    id: 'p14',
    title: '3 BHK Premium Flat',
    badge: 'BANK AUCTION',
    type: 'residential',
    locality: 'Nungambakkam, Chennai',
    address: 'Nungambakkam High Road, Chennai – 600034',
    bank: 'Canara Bank', branch: 'Nungambakkam, Chennai',
    assetCode: 'C8CHN33509', contact: '044-2822 5170',
    reserve: 13500000, increment: 100000, emdPct: 10,
    area: 1920, landArea: null, beds: 3, baths: 3,
    daysAhead: 4.1, featured: true,
    images: [
      unsplash('photo-1600047509807-ba8f99d2cdde'),
      GALLERY_POOL[4], GALLERY_POOL[2], GALLERY_POOL[3]
    ],
    desc: 'Vaastu-compliant apartment in the CBD with concierge lobby and 2 covered parks. Walkable to premium schools and hospitals.'
  }
];

/* Attach computed auction end timestamps + emd values */
const PROPERTIES = RAW_PROPERTIES.map(function (p) {
  p.auctionEnd = Date.now() + p.daysAhead * 24 * 60 * 60 * 1000;
  p.emd = Math.round((p.reserve * (p.emdPct || 10)) / 100);
  return p;
});

/* ------------------------------------------------------------
   Demo user / notifications / process data
   ------------------------------------------------------------ */
const DEMO_USER = {
  name: 'Udhaya Kumar R',
  email: 'udhaya.kumar@skandx.demo',
  phone: '+91 98407 22110',
  pan: 'ABZPU1234K',
  memberSince: 'Jan 2024',
  initials: 'UK'
};

const NOTIFICATIONS = [
  { icon: 'fa-gavel', title: 'Bid placed successfully', text: 'Your bid of ₹79.50 L was placed on Independent House (3 BHK).', time: '12 min ago', unread: true },
  { icon: 'fa-hourglass-half', title: 'Auction ending soon', text: 'Luxury Villa (4 BHK) auction ends in less than 3 days.', time: '2 hrs ago', unread: true },
  { icon: 'fa-file-shield', title: 'KYC pending', text: 'Upload your bank proof document to complete KYC.', time: 'Yesterday', unread: true },
  { icon: 'fa-trophy', title: 'You won an auction!', text: 'Your bid for Residential Plot, Perungudi has been accepted.', time: '3 days ago', unread: false },
  { icon: 'fa-building-columns', title: 'New listing: SBI', text: 'SBI added 4 new e-auction properties in Chennai.', time: '4 days ago', unread: false }
];

const DASH_STATS_DEMO = { won: 2, inProcess: 1 };

/* ------------------------------------------------------------
   Formatting helpers (shared across modules)
   ------------------------------------------------------------ */

/* ₹78.00 Lakhs / ₹1.45 Cr style formatting */
function formatPrice(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  return '₹' + (n / 100000).toFixed(2) + ' Lakhs';
}

function formatRupees(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function formatSqft(n) {
  return n ? Number(n).toLocaleString('en-IN') + ' sq.ft' : '—';
}

function typeLabel(t) {
  return ({ residential: 'Residential', commercial: 'Commercial', land: 'Land / Plot', industrial: 'Industrial' })[t] || t;
}

/* Remaining time object {d,h,m,s,total} from ms */
function timeRemaining(endTs) {
  var total = endTs - Date.now();
  if (total < 0) total = 0;
  var d = Math.floor(total / 86400000);
  var h = Math.floor((total % 86400000) / 3600000);
  var m = Math.floor((total % 3600000) / 60000);
  var s = Math.floor((total % 60000) / 1000);
  return { d: d, h: h, m: m, s: s, total: total };
}

function auctionEnded(p) {
  return p.auctionEnd <= Date.now();
}

/* Simple image fallback: swap to local SVG placeholder once */
function imgFallback(img) {
  if (img.dataset.fb) { img.style.visibility = 'hidden'; return; }
  img.dataset.fb = '1';
  img.src = 'assets/images/placeholder.svg';
}
