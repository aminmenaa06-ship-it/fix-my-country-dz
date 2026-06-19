/* =========================================================================
   Aṣliḥ Bladi — Fix My Country
   A location-verified citizen priority board for Algeria.
   All data lives in the browser (localStorage). No server, no tracking.
   ========================================================================= */

/* ---------- 1. The issues citizens can prioritise ---------- */
const ISSUES = [
  { id: 'water',     icon: '💧', cat: 'Water',        en: 'Reliable drinking water',        ar: 'ماء شروب دائم',        seed: 4120, trend: 38,
    desc: 'End the rationing and dry taps. Clean water in every home, every day of the week.' },
  { id: 'power',     icon: '⚡', cat: 'Energy',       en: 'Stop the power cuts',            ar: 'إيقاف انقطاع الكهرباء', seed: 3380, trend: 25,
    desc: 'Stable electricity through summer peaks — no more blackouts during heatwaves.' },
  { id: 'jobs',      icon: '💼', cat: 'Jobs',         en: 'Jobs for young people',          ar: 'مناصب شغل للشباب',     seed: 5210, trend: 61,
    desc: 'Real opportunities so graduates don\'t have to emigrate to build a future.' },
  { id: 'health',    icon: '🏥', cat: 'Health',       en: 'Hospitals that work',            ar: 'مستشفيات تشتغل',       seed: 3990, trend: 44,
    desc: 'Shorter waits, stocked pharmacies, specialists you don\'t have to travel for.' },
  { id: 'roads',     icon: '🛣️', cat: 'Infrastructure', en: 'Fix the roads',               ar: 'إصلاح الطرقات',        seed: 2870, trend: 19,
    desc: 'Repair potholes and finish stalled road projects that cut towns off.' },
  { id: 'housing',   icon: '🏠', cat: 'Housing',      en: 'Affordable housing',             ar: 'سكن في المتناول',      seed: 4480, trend: 47,
    desc: 'Clear the AADL waiting lists and make a first home reachable for families.' },
  { id: 'internet',  icon: '📶', cat: 'Digital',      en: 'Fast, fair internet',            ar: 'إنترنت سريع وعادل',    seed: 3110, trend: 33,
    desc: 'Real broadband speeds across wilayas, not just the big cities.' },
  { id: 'corruption',icon: '⚖️', cat: 'Governance',   en: 'Tackle corruption',              ar: 'محاربة الفساد',        seed: 4760, trend: 52,
    desc: 'Transparent public spending and consequences for those who steal from the people.' },
  { id: 'transport', icon: '🚌', cat: 'Transport',    en: 'Public transport',               ar: 'النقل العمومي',        seed: 1980, trend: 14,
    desc: 'More buses, trams and trains that run on time and reach the suburbs.' },
  { id: 'schools',   icon: '🎓', cat: 'Education',    en: 'Better schools',                 ar: 'مدارس أفضل',           seed: 2640, trend: 22,
    desc: 'Less overcrowding, modern curricula and teachers who are properly paid.' },
  { id: 'prices',    icon: '🛒', cat: 'Economy',      en: 'Control the cost of living',     ar: 'التحكم في الأسعار',    seed: 5040, trend: 58,
    desc: 'Rein in food and staple prices so a salary covers the basics again.' },
  { id: 'waste',     icon: '🗑️', cat: 'Environment',  en: 'Clean streets & waste',         ar: 'نظافة وتسيير النفايات', seed: 1720, trend: 11,
    desc: 'Regular collection, recycling and an end to illegal dumping sites.' },
  { id: 'bureaucracy',icon: '📑', cat: 'Governance',  en: 'Cut the paperwork',              ar: 'تبسيط الإجراءات',      seed: 3550, trend: 36,
    desc: 'Digitise administration so a simple document doesn\'t take ten trips and three stamps.' },
  { id: 'pollution', icon: '🌫️', cat: 'Environment',  en: 'Clean air & water',             ar: 'هواء وماء نظيف',       seed: 1490, trend: 9,
    desc: 'Protect rivers and coastlines and curb industrial pollution near towns.' },
  { id: 'women',     icon: '🤝', cat: 'Society',      en: 'Safety & women\'s rights',       ar: 'الأمن وحقوق المرأة',  seed: 2310, trend: 29,
    desc: 'Stronger protection against violence and equal opportunity in work and law.' },
  { id: 'farming',   icon: '🌾', cat: 'Economy',      en: 'Support farmers & food security',ar: 'دعم الفلاحة والأمن الغذائي', seed: 2050, trend: 17,
    desc: 'Back local agriculture so the country grows more of what it eats.' },
];

/* ---------- 1b. Government bodies responsible for each issue ----------
   Ministry websites & switchboard numbers (Algiers, area code 021 → +213 21).
   Sourced from the official ministry directory; treat as starting points —
   a department or hotline may route you more precisely. */
const MINISTRIES = {
  interior:    { en: 'Interior & Local Authorities', fr: "Ministère de l'Intérieur et des Collectivités Locales", ar: 'وزارة الداخلية والجماعات المحلية', web: 'interieur.gov.dz', tel: '+213 21 73 23 40' },
  water:       { en: 'Water Resources',              fr: 'Ministère des Ressources en Eau',                       ar: 'وزارة الموارد المائية',            web: 'mre.gov.dz',        tel: '+213 21 74 78 40' },
  energy:      { en: 'Energy & Mines',               fr: "Ministère de l'Énergie et des Mines",                   ar: 'وزارة الطاقة والمناجم',           web: 'energy.gov.dz',     tel: '+213 21 48 85 26' },
  health:      { en: 'Health',                       fr: 'Ministère de la Santé',                                 ar: 'وزارة الصحة',                    web: 'sante.gov.dz',      tel: '+213 21 67 53 15' },
  labor:       { en: 'Labour & Employment',          fr: "Ministère du Travail, de l'Emploi et de la Sécurité Sociale", ar: 'وزارة العمل والتشغيل والضمان الاجتماعي', web: 'mtess.gov.dz', tel: '+213 21 65 99 99' },
  housing:     { en: 'Housing & Urban Planning',     fr: "Ministère de l'Habitat, de l'Urbanisme et de la Ville", ar: 'وزارة السكن والعمران والمدينة',   web: 'mhuv.gov.dz',       tel: '+213 21 74 07 22' },
  publicworks: { en: 'Public Works',                 fr: 'Ministère des Travaux Publics et des Infrastructures',  ar: 'وزارة الأشغال العمومية',          web: 'mtp.gov.dz',        tel: '+213 21 49 25 00' },
  transport:   { en: 'Transport',                    fr: 'Ministère des Transports',                              ar: 'وزارة النقل',                    web: 'mtransports.gov.dz',tel: '+213 21 92 82 82' },
  education:   { en: 'National Education',            fr: "Ministère de l'Éducation Nationale",                    ar: 'وزارة التربية الوطنية',          web: 'education.gov.dz',  tel: '+213 21 60 55 60' },
  commerce:    { en: 'Commerce',                      fr: 'Ministère du Commerce et de la Promotion des Exportations', ar: 'وزارة التجارة وترقية الصادرات', web: 'commerce.gov.dz',  tel: '+213 21 89 00 74' },
  environment: { en: 'Environment',                  fr: "Ministère de l'Environnement et de la Qualité de la Vie", ar: 'وزارة البيئة ونوعية الحياة',   web: 'environnement.gov.dz', tel: '+213 21 73 13 08' },
  agriculture: { en: 'Agriculture & Rural Development', fr: "Ministère de l'Agriculture et du Développement Rural", ar: 'وزارة الفلاحة والتنمية الريفية', web: 'madr.gov.dz',     tel: '+213 21 71 17 12' },
  post:        { en: 'Post & Telecommunications',    fr: 'Ministère de la Poste et des Télécommunications',       ar: 'وزارة البريد والمواصلات',         web: 'mpt.gov.dz',        tel: '+213 21 71 12 20' },
  solidarity:  { en: 'Solidarity, Family & Women',   fr: 'Ministère de la Solidarité Nationale, de la Famille et de la Condition de la Femme', ar: 'وزارة التضامن الوطني والأسرة وقضايا المرأة', web: 'msnfcf.gov.dz', tel: '+213 21 73 24 49' },
  mediator:    { en: 'Ombudsman (Médiateur)',        fr: 'Médiateur de la République',                            ar: 'وسيط الجمهورية',                 web: 'wassit.dz',         tel: '' },
};

/* Which ministry owns each issue */
const ISSUE_GOV = {
  water: 'water', power: 'energy', jobs: 'labor', health: 'health', roads: 'publicworks',
  housing: 'housing', internet: 'post', corruption: 'mediator', transport: 'transport',
  schools: 'education', prices: 'commerce', waste: 'environment', bureaucracy: 'interior',
  pollution: 'environment', women: 'solidarity', farming: 'agriculture',
};

/* National (federal) institutions a citizen can reach directly */
const INSTITUTIONS = [
  { icon: '🏛️', en: 'Presidency of the Republic', ar: 'رئاسة الجمهورية', web: 'el-mouradia.dz', note: 'Head of State.' },
  { icon: '🏢', en: 'Prime Ministry', ar: 'الوزارة الأولى', web: 'premier-ministre.gov.dz', note: 'Head of Government & the cabinet.' },
  { icon: '🗂️', en: 'Ministry of Interior & Local Authorities', ar: 'وزارة الداخلية والجماعات المحلية', web: 'interieur.gov.dz', tel: '+213 21 73 23 40', note: 'Oversees every wilaya and commune — the supervisor of all local government.' },
  { icon: '⚖️', en: 'Ombudsman — Médiateur de la République', ar: 'وسيط الجمهورية', web: 'wassit.dz', note: 'File a formal complaint when a public service fails you. This is the citizen escalation channel.', highlight: true },
  { icon: '💻', en: 'Public Services Portal — Bawabatic', ar: 'البوابة الإلكترونية للخدمات العمومية', web: 'bawabatic.dz', note: 'Online government services and administrative documents.' },
];

/* Emergency lines (toll-free, nationwide) */
const EMERGENCY = [
  { en: 'Police', ar: 'الشرطة', num: '17' },
  { en: 'Gendarmerie Nationale', ar: 'الدرك الوطني', num: '1055' },
  { en: 'Civil Protection (fire/rescue)', ar: 'الحماية المدنية', num: '14' },
  { en: 'Medical emergency (SAMU)', ar: 'الإسعاف الطبي', num: '115' },
];

/* ---------- 2. The 58 wilayas ---------- */
const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida',
  'Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel',
  'Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',
  "M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès',
  'El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila',
  'Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar',
  'Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',"El M'Ghair",'El Meniaa'
];

/* Approximate national bounding box for the GPS sanity check.
   (A prototype-level check — a production system would use a precise border polygon.) */
const ALGERIA_BOUNDS = { north: 37.15, south: 18.90, west: -8.70, east: 12.05 };

/* ---------- 3. State + persistence ---------- */
const LS = {
  tally:   'ab_tally_v1',   // { issueId: extraVotes } added on top of seeds
  mine:    'ab_mine_v1',    // [issueId, ...] issues this device backed
  verify:  'ab_verify_v1',  // { status, label, ts }
};
const load = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let tally  = load(LS.tally, {});           // device-added votes per issue
let mine   = new Set(load(LS.mine, []));   // issues this user backs
let verify = load(LS.verify, null);        // verification record

const totalVotes = (id) => {
  const issue = ISSUES.find(i => i.id === id);
  return (issue ? issue.seed : 0) + (tally[id] || 0);
};

/* ---------- 4. DOM helpers ---------- */
const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function toast(msg) {
  const t = $('#toast');
  t.hidden = false; t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => (t.hidden = true), 250);
  }, 2600);
}

const isUnlocked = () => !!verify;

/* ---------- 5. Build the issue cards ---------- */
function renderIssues() {
  const grid = $('#issueGrid');
  const cat  = $('#categoryFilter').value;
  const sort = $('#sortSelect').value;

  let list = ISSUES.filter(i => cat === 'all' || i.cat === cat);
  if (sort === 'votes')    list.sort((a, b) => totalVotes(b.id) - totalVotes(a.id));
  if (sort === 'trending') list.sort((a, b) => b.trend - a.trend);
  if (sort === 'az')       list.sort((a, b) => a.en.localeCompare(b.en));

  const max = Math.max(...ISSUES.map(i => totalVotes(i.id)), 1);
  const unlocked = isUnlocked();

  grid.innerHTML = list.map(i => {
    const votes  = totalVotes(i.id);
    const voted  = mine.has(i.id);
    const pct    = Math.round((votes / max) * 100);
    const m      = MINISTRIES[ISSUE_GOV[i.id]];
    return `
      <article class="issue-card ${voted ? 'voted' : ''} ${unlocked ? '' : 'locked'}" data-id="${i.id}">
        <div class="issue-top">
          <div class="issue-icon">${i.icon}</div>
          <div class="issue-titles">
            <h3>${i.en}</h3>
            <div class="ar">${i.ar}</div>
          </div>
        </div>
        <span class="issue-cat">${i.cat}</span>
        <p class="issue-desc">${i.desc}</p>
        <div class="issue-meter">
          <div class="meter-bar"><div class="meter-fill" style="width:${pct}%"></div></div>
          <div class="meter-row">
            <span><strong data-count>${votes.toLocaleString()}</strong> votes</span>
            <span>🔥 ${i.trend}% this month</span>
          </div>
        </div>
        <a class="issue-gov" href="https://${m.web}" target="_blank" rel="noopener"
           title="${m.fr}">🏛️ Handled by: <strong>${m.en}</strong> ↗</a>
        <button class="vote-btn ${voted ? 'is-voted' : ''}" data-vote="${i.id}">
          ${voted ? '✓ You backed this' : '▲ Vote to fix this'}
        </button>
      </article>`;
  }).join('');
}

/* ---------- 6. Voting ---------- */
function toggleVote(id) {
  if (!isUnlocked()) { toast('🔒 Verify your location first to vote.'); return; }

  if (mine.has(id)) {
    mine.delete(id);
    tally[id] = (tally[id] || 0) - 1;
  } else {
    mine.add(id);
    tally[id] = (tally[id] || 0) + 1;
    toast('✅ Vote counted — شكراً');
  }
  save(LS.mine, [...mine]);
  save(LS.tally, tally);

  renderIssues();
  renderLeaderboard();
  renderStats();
  renderTopRoute();

  // little pop on the count just changed
  const el = $(`.issue-card[data-id="${id}"] [data-count]`);
  if (el) { el.classList.add('vote-pop'); setTimeout(() => el.classList.remove('vote-pop'), 400); }
}

/* ---------- 7. Leaderboard / mandate ---------- */
function rankedIssues() {
  return [...ISSUES].sort((a, b) => totalVotes(b.id) - totalVotes(a.id));
}

function renderLeaderboard() {
  const lb = $('#leaderboard');
  lb.innerHTML = rankedIssues().map(i => {
    const v = totalVotes(i.id);
    return `
      <li class="lb-item" data-id="${i.id}">
        <span class="lb-rank"></span>
        <span class="lb-name">${i.icon} ${i.en} <small>${i.ar} · ${i.cat}</small></span>
        <span class="lb-votes">${v.toLocaleString()}<small> votes</small></span>
      </li>`;
  }).join('');
  // fill ranks via counter (CSS) — but also set numeric text for clarity
  $$('#leaderboard .lb-rank').forEach((el, idx) => (el.textContent = idx + 1));
}

/* ---------- 8. Stats ---------- */
function renderStats() {
  const totVotes = ISSUES.reduce((s, i) => s + totalVotes(i.id), 0);
  // Simulated participation baseline + this device's contribution
  const baseVoters  = 9430;
  const baseWilayas = 41;
  const myCount = mine.size > 0 ? 1 : 0;
  const myWilaya = (verify && verify.label) ? 1 : 0;

  animateNumber($('#statVoters'),  baseVoters + myCount);
  animateNumber($('#statVotes'),   totVotes);
  animateNumber($('#statWilayas'), Math.min(58, baseWilayas + myWilaya));
}

function animateNumber(el, target) {
  const start = parseInt((el.textContent || '0').replace(/,/g, ''), 10) || 0;
  const dur = 600, t0 = performance.now();
  function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    const val = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)));
    el.textContent = val.toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------- 8b. Government contacts (national → wilaya → commune) ---------- */
const telHref = (tel) => 'tel:' + tel.replace(/[^+\d]/g, '');
const searchLink = (q) => 'https://www.google.com/search?q=' + encodeURIComponent(q);

function contactCard({ icon, title, sub, note, web, tel, highlight, extra }) {
  return `
    <div class="contact-card ${highlight ? 'highlight' : ''}">
      <div class="cc-head">
        <span class="cc-icon">${icon || '🏛️'}</span>
        <div>
          <h4>${title}</h4>
          ${sub ? `<div class="cc-sub">${sub}</div>` : ''}
        </div>
      </div>
      ${note ? `<p class="cc-note">${note}</p>` : ''}
      <div class="cc-links">
        ${web ? `<a class="cc-link web" href="https://${web}" target="_blank" rel="noopener">🌐 ${web} ↗</a>` : ''}
        ${tel ? `<a class="cc-link tel" href="${telHref(tel)}">📞 ${tel}</a>` : ''}
        ${extra || ''}
      </div>
    </div>`;
}

function renderInstitutions() {
  $('#institutions').innerHTML = INSTITUTIONS.map(o => contactCard({
    icon: o.icon, title: o.en, sub: o.ar, note: o.note, web: o.web, tel: o.tel, highlight: o.highlight,
  })).join('');
}

function renderMinistries() {
  // de-duplicate ministries (some serve several issues) and list which issues each covers
  const covers = {};
  ISSUES.forEach(i => {
    const k = ISSUE_GOV[i.id];
    (covers[k] = covers[k] || []).push(i.en);
  });
  $('#ministries').innerHTML = Object.keys(covers).map(k => {
    const m = MINISTRIES[k];
    return contactCard({
      icon: '🏛️', title: m.en, sub: `${m.fr} · ${m.ar}`,
      note: 'Handles: ' + covers[k].join(', ') + '.',
      web: m.web, tel: m.tel,
    });
  }).join('');
}

function renderEmergency() {
  $('#emergency').innerHTML = EMERGENCY.map(e =>
    `<a class="emg-pill" href="${telHref(e.num)}"><strong>${e.num}</strong><span>${e.en} · ${e.ar}</span></a>`
  ).join('');
}

function renderTopRoute() {
  const box = $('#topRoute');
  const top = rankedIssues()[0];
  const m = MINISTRIES[ISSUE_GOV[top.id]];
  const myTop = mine.size ? rankedIssues().find(i => mine.has(i.id)) : null;
  const lead = myTop || top;
  const lm = MINISTRIES[ISSUE_GOV[lead.id]];
  box.innerHTML = `
    <span class="tr-icon">${lead.icon}</span>
    <div>
      <strong>${myTop ? 'Your top-backed priority' : 'The nation\'s #1 priority'} — ${lead.en}</strong>
      is the responsibility of the <em>${lm.fr}</em>.
    </div>
    <a class="btn btn-primary" href="https://${lm.web}" target="_blank" rel="noopener">Contact them ↗</a>`;
}

function renderLocalContacts() {
  const sel = ($('#localWilaya') && $('#localWilaya').value)
    || (verify && verify.label) || '';
  const box = $('#localCards');
  if (!sel) {
    box.innerHTML = `<div class="contact-card muted-card">
      <p class="cc-note">📍 Choose your wilaya above (or verify your location) to load your provincial governor's office and your commune's town hall.</p>
    </div>`;
    return;
  }
  box.innerHTML = [
    contactCard({
      icon: '🏛️', title: `Wilaya of ${sel}`, sub: `ولاية ${sel} · Provincial level`,
      note: `The Wali (governor) and the Wilaya People's Assembly (APW) handle province-wide services and are where you escalate above your commune. The Ministry of Interior supervises every wilaya.`,
      web: 'interieur.gov.dz',
      extra: `<a class="cc-link web" href="${searchLink('Wilaya de ' + sel + ' site officiel contact wali')}" target="_blank" rel="noopener">🔎 Find the Wilaya of ${sel} ↗</a>`,
    }),
    contactCard({
      icon: '🏤', title: `Your commune (APC / البلدية)`, sub: `Municipal level · ${sel}`,
      note: `Your town hall and elected mayor (P/APC) are the first stop for local issues — local roads, water hookups, waste, civil records and permits. Algeria has 1,541 communes; find yours below.`,
      extra: `<a class="cc-link web" href="${searchLink('APC commune ' + sel + ' contact mairie baladiya')}" target="_blank" rel="noopener">🔎 Find your commune (APC) ↗</a>
        <a class="cc-link web" href="https://bawabatic.dz" target="_blank" rel="noopener">🌐 bawabatic.dz (services) ↗</a>`,
    }),
  ].join('');
}

function renderContacts() {
  renderInstitutions();
  renderMinistries();
  renderEmergency();
  renderTopRoute();
  renderLocalContacts();
}

/* ---------- 9. Location verification ---------- */
function setVerified(status, label) {
  verify = { status, label, ts: Date.now() };
  save(LS.verify, verify);
  reflectVerification();
  renderIssues();
  renderStats();
  // sync the local-contacts wilaya picker, then refresh contact routing
  const lsel = $('#localWilaya');
  if (lsel && label) lsel.value = label;
  renderContacts();
  // smooth-scroll to issues so the unlocked board is obvious
  $('#issues').scrollIntoView({ behavior: 'smooth' });
}

function reflectVerification() {
  const badge = $('#verifyBadge');
  const txt   = $('#verifyBadgeText');
  const notice = $('#lockNotice');

  badge.classList.remove('locked', 'verified', 'declared');

  if (!verify) {
    badge.classList.add('locked');
    txt.textContent = 'Not verified';
    notice.classList.remove('hidden');
    return;
  }
  if (verify.status === 'verified') {
    badge.classList.add('verified');
    txt.textContent = `GPS verified${verify.label ? ' · ' + verify.label : ' · Algeria'}`;
  } else {
    badge.classList.add('declared');
    txt.textContent = `Self-declared · ${verify.label}`;
  }
  notice.classList.add('hidden');
}

function checkGeo() {
  const status = $('#geoStatus');
  if (!('geolocation' in navigator)) {
    status.className = 'geo-status err';
    status.textContent = 'Your browser does not support location. Use the wilaya option instead.';
    return;
  }
  status.className = 'geo-status pending';
  status.textContent = 'Requesting your location…';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const b = ALGERIA_BOUNDS;
      const inside = lat >= b.south && lat <= b.north && lng >= b.west && lng <= b.east;
      if (inside) {
        status.className = 'geo-status ok';
        status.textContent = `✅ Confirmed inside Algeria (${lat.toFixed(2)}, ${lng.toFixed(2)}). Voting unlocked.`;
        setVerified('verified', null);
      } else {
        status.className = 'geo-status err';
        status.textContent = `📍 Your location (${lat.toFixed(2)}, ${lng.toFixed(2)}) appears outside Algeria. Voting is reserved for citizens on the ground.`;
      }
    },
    (err) => {
      status.className = 'geo-status err';
      const msg = err.code === 1
        ? 'Permission denied. You can pick your wilaya instead.'
        : 'Could not get your location. Try again or pick your wilaya.';
      status.textContent = msg;
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

/* ---------- 10. Mandate report ---------- */
function buildReport() {
  const ranked = rankedIssues();
  const totVotes = ISSUES.reduce((s, i) => s + totalVotes(i.id), 0);
  const date = new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
  const loc = verify
    ? (verify.status === 'verified' ? 'GPS-verified inside Algeria' : `self-declared: ${verify.label}`)
    : 'not verified';

  const lines = [];
  lines.push('NATIONAL PRIORITY MANDATE — أولويات المواطنين');
  lines.push('Aṣliḥ Bladi · Fix My Country');
  lines.push('='.repeat(52));
  lines.push(`Generated: ${date}`);
  lines.push(`Submitted by: a citizen (${loc})`);
  lines.push(`Issues backed by this citizen: ${mine.size}`);
  lines.push(`Total recorded votes: ${totVotes.toLocaleString()}`);
  lines.push('');
  lines.push('THE PEOPLE ASK THE GOVERNMENT TO FIX, IN ORDER:');
  lines.push('-'.repeat(52));
  ranked.forEach((i, idx) => {
    const v = totalVotes(i.id);
    const share = ((v / totVotes) * 100).toFixed(1);
    const mark = mine.has(i.id) ? ' ★' : '';
    lines.push(`${String(idx + 1).padStart(2, ' ')}. ${i.en} (${i.ar})${mark}`);
    lines.push(`    ${v.toLocaleString()} votes · ${share}% of the vote · category: ${i.cat}`);
  });
  lines.push('-'.repeat(52));
  lines.push('★ = personally backed by the submitting citizen.');
  lines.push('');
  lines.push('WHERE TO SEND THIS — responsible authorities:');
  lines.push('-'.repeat(52));
  ranked.slice(0, 5).forEach((i, idx) => {
    const m = MINISTRIES[ISSUE_GOV[i.id]];
    lines.push(`${idx + 1}. ${i.en}`);
    lines.push(`   → ${m.fr}`);
    lines.push(`     ${m.web}${m.tel ? ' · ' + m.tel : ''}`);
  });
  lines.push('');
  const wil = verify && verify.label ? verify.label : (document.getElementById('localWilaya') ? document.getElementById('localWilaya').value : '');
  if (wil) {
    lines.push(`LOCAL LEVEL — escalate in your area:`);
    lines.push(`   • Wilaya of ${wil} (Wali / APW) — provincial services`);
    lines.push(`   • Your commune (APC / town hall) — first stop for local issues`);
    lines.push('');
  }
  lines.push('Public-service failure? File a complaint with the');
  lines.push('Ombudsman (Médiateur de la République): wassit.dz');
  lines.push('');
  lines.push('This mandate reflects the freely expressed priorities of');
  lines.push('Algerian citizens. الشعب يريد — the people decide the order.');
  return lines.join('\n');
}

function openModal() {
  const report = buildReport();
  $('#modalMeta').textContent = verify
    ? (verify.status === 'verified' ? 'Submitted as a GPS-verified citizen.' : `Submitted from ${verify.label} (self-declared).`)
    : 'Verify your location to submit as a citizen.';
  $('#modalBody').textContent = report;
  $('#modal').hidden = false;
  openModal._report = report;
}

/* ---------- 11. Wire everything up ---------- */
function init() {
  // populate both wilaya dropdowns (gate + local contacts)
  const wsel = $('#wilayaSelect');
  const lsel = $('#localWilaya');
  WILAYAS.forEach((w, i) => {
    const label = `${String(i + 1).padStart(2, '0')} — ${w}`;
    [wsel, lsel].forEach(sel => {
      const o = document.createElement('option');
      o.value = w; o.textContent = label;
      sel.appendChild(o);
    });
  });
  if (verify && verify.label) lsel.value = verify.label;

  // populate category filter
  const cats = [...new Set(ISSUES.map(i => i.cat))].sort();
  const cf = $('#categoryFilter');
  cats.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    cf.appendChild(o);
  });

  // initial paint
  reflectVerification();
  renderIssues();
  renderLeaderboard();
  renderStats();
  renderContacts();

  lsel.addEventListener('change', renderLocalContacts);

  // hero + gate verification buttons
  $('#heroVerifyBtn').addEventListener('click', () => {
    $('#gate').scrollIntoView({ behavior: 'smooth' });
    setTimeout(checkGeo, 450);
  });
  $('#geoBtn').addEventListener('click', checkGeo);

  wsel.addEventListener('change', () => { $('#wilayaBtn').disabled = !wsel.value; });
  $('#wilayaBtn').addEventListener('click', () => {
    if (!wsel.value) return;
    setVerified('declared', wsel.value);
    toast(`📍 ${wsel.value} confirmed — voting unlocked.`);
  });

  // voting (event delegation)
  $('#issueGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-vote]');
    if (btn) toggleVote(btn.dataset.vote);
  });

  // filters
  cf.addEventListener('change', renderIssues);
  $('#sortSelect').addEventListener('change', renderIssues);

  initFx();

  // mandate
  $('#submitBtn').addEventListener('click', openModal);
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Remove all the votes you cast on this device?')) return;
    mine.forEach(id => { tally[id] = (tally[id] || 0) - 1; });
    mine.clear();
    save(LS.mine, []); save(LS.tally, tally);
    renderIssues(); renderLeaderboard(); renderStats();
    toast('Your votes were cleared.');
  });

  // modal controls
  $('#modalClose').addEventListener('click', () => ($('#modal').hidden = true));
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').hidden = true; });
  $('#copyBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(openModal._report); toast('📋 Report copied.'); }
    catch { toast('Copy not available — use Download.'); }
  });
  $('#downloadBtn').addEventListener('click', () => {
    const blob = new Blob([openModal._report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'algeria-priority-mandate.txt';
    a.click(); URL.revokeObjectURL(url);
    toast('⬇️ Mandate downloaded.');
  });
}

/* ---------- 12. Futuristic flourishes (particles + reveal) ---------- */
function initFx() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal-on-scroll for the main blocks
  const targets = ['.hero-inner', '.gate-card', '.section-head', '.top-route', '.tier-label', '.local-panel', '.emergency-wrap'];
  const els = targets.flatMap(sel => [...document.querySelectorAll(sel)]);
  els.forEach(el => el.classList.add('reveal'));
  if (reduce) {
    els.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  // particle network backdrop
  const c = document.getElementById('bgCanvas');
  if (!c || reduce) return;
  const ctx = c.getContext('2d');
  let w, h, pts;
  function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    const n = Math.min(80, Math.floor((w * h) / 20000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
    }));
  }
  resize();
  window.addEventListener('resize', resize);
  const LINK = 150 * 150;
  (function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(31, 255, 163, 0.6)'; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < LINK) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(31, 255, 163, ' + (0.13 * (1 - d / LINK)) + ')';
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  })();
}

document.addEventListener('DOMContentLoaded', init);
