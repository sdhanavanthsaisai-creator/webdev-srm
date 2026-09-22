/* ═══════════════════════════════════════════════════════════════════════════
   ClubCraft UI layer — data, auth, floor, detail, money moment
   Runs on the deployed app (Express API + Supabase) AND standalone (demo mode)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const pad2 = (n) => String(n).padStart(2, '0');

  /* ═════════════════ 1. DATA — Express API first, demo fallback ═══════════ */
  const DEMO_WORKSHOPS = [
    { id: 'w1', title: 'Shipping the Golden Path', speaker: 'Maya Okafor', role: 'Core · API', location: 'Forge Hall — Stage A', dur: '45 min', starts_at: at(2, 17, 30), desc: 'How we froze the stack on day one, drew the state matrix before the screens, and built in demo order — login, gate, grid, button. The unglamorous decisions that make a demo boring, in the best possible way.' },
    { id: 'w2', title: 'The Optimistic Interface', speaker: 'Dev Ramanan', role: 'Surface · Frontend', location: 'Forge Hall — Stage A', dur: '40 min', starts_at: at(4, 18, 0), desc: 'Flip the button first, reconcile later. A field guide to optimistic UI: instant flips, 409s that are not errors, and reverting with grace when the network disagrees with your confidence.' },
    { id: 'w3', title: 'Auth Without Tears', speaker: 'Lena Vogt', role: 'Core · Auth', location: 'Workshop Bay 2', dur: '50 min', starts_at: at(6, 17, 30), desc: 'Sessions without ceremony. Email and password done properly, inline validation that respects the person typing, and the tiny ?next= trick that makes redirects feel like magic instead of punishment.' },
    { id: 'w4', title: 'Designing at 375 Pixels', speaker: 'Sofia Marchetti', role: 'Surface · Design', location: 'Workshop Bay 2', dur: '40 min', starts_at: at(9, 16, 0), desc: 'One primary action per screen, contrast you can read in a bright hall, focus rings you can see in the dark. Mobile-first is not a constraint — it is the floor everything else stands on.' },
    { id: 'w5', title: 'States Are the Product', speaker: 'Jonas Feld', role: 'Surface · Frontend', location: 'Forge Hall — Stage B', dur: '45 min', starts_at: at(12, 17, 30), desc: 'Loading, empty, error, success — four states per view, no exceptions. Why the empty state deserves real copy, the error state deserves an apology, and the success state deserves a stamp.' },
    { id: 'w6', title: 'Demo Day Rehearsal', speaker: 'The ClubCraft Crew', role: 'All lanes', location: 'Main Floor', dur: '90 min', starts_at: at(15, 18, 30), desc: 'The full run: no typing live, no fresh signups, console clean from load to logout. We click the golden path until it clicks back. Bring your demo hat and your most pessimistic teammate.' }
  ];
  function at(d, h, m) { const t = new Date(Date.now() + d * 864e5); t.setHours(h, m, 0, 0); return t.toISOString(); }

  let WORKSHOPS = DEMO_WORKSHOPS;
  let apiMode = false;
  let demoMode = false;
  let session = null;          // Supabase session object (live) or demo user stub

  const norm = (it, i) => ({
    id: String(it.id != null ? it.id : 'w' + (i + 1)),
    n: pad2(i + 1),
    title: it.title || 'Untitled session',
    speaker: it.speaker || 'TBA',
    role: it.role || 'SESSION',
    location: it.location || 'TBA',
    dur: it.dur || it.duration || '—',
    starts_at: it.starts_at || it.date_time || new Date().toISOString(),
    desc: it.description || it.desc || '',
    registered: it.registered === true
  });

  async function loadWorkshops() {
    try {
      const res = await fetch('/api/workshops', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const list = await res.json();
      if (!Array.isArray(list) || !list.length) throw new Error('empty');
      apiMode = true;
      return list.slice(0, 12).map(norm);
    } catch (e) { return DEMO_WORKSHOPS; }
  }

  /* ═════════════════ 2. AUTH — Supabase live or demo stub ═════════════════ */
  let supabase = null;
  async function initSupabase() {
    try {
      const cfg = await fetch('/api/config').then((r) => (r.ok ? r.json() : null));
      if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
      const mod = await import('https://esm.sh/@supabase/supabase-js@2');
      supabase = mod.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    } catch (e) { /* no Supabase configured → auth stays in demo mode */ }
  }

  async function restoreSession() {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) { session = data.session; return; }
    }
    try { const raw = localStorage.getItem('cc.demo.user'); if (raw) session = JSON.parse(raw); } catch (e) {}
  }

  const isDemoUser = () => session && session.demo === true;
  const userEmail = () => (session ? session.user && session.user.email : null);
  const userName = () => {
    if (!session) return null;
    if (isDemoUser()) return session.name;
    const m = session.user && session.user.user_metadata;
    return (m && (m.full_name || m.name)) || (session.user && session.user.email) || 'Member';
  };

  /* auth modal */
  let mode = 'in';
  let authBusy = false;
  const authEl = $('#auth'), authScrim = $('#authScrim');

  function setMode(m) {
    mode = m;
    $('#tabIn').classList.toggle('on', m === 'in');
    $('#tabUp').classList.toggle('on', m === 'up');
    $('#nameField').hidden = m !== 'up';
    $('#authName').tabIndex = m === 'up' ? 0 : -1;
    $('#authTitle').textContent = m === 'in' ? 'Welcome to the room.' : 'Join the club.';
    $('#authSub').textContent = m === 'in' ? 'Sign in to claim seats — your list follows you to any device.' : 'Name, email, password — and the floor is yours.';
    $('#authSubmit').textContent = m === 'in' ? 'Sign in' : 'Create my account';
    showErr('');
  }
  function showErr(msg) { const el = $('#authErr'); el.textContent = msg; el.classList.toggle('on', !!msg); }
  function openAuth(up) { setMode(up ? 'up' : 'in'); if (DEMO_EMAIL) $('#demoPill').hidden = false; authEl.classList.add('open'); authScrim.classList.add('on'); document.body.classList.add('locked'); $('#authEmail').focus(); }
  function closeAuth() { if (!authEl.classList.contains('open')) return; authEl.classList.remove('open'); authScrim.classList.remove('on'); document.body.classList.remove('locked'); showErr(''); }
  $('#authClose').addEventListener('click', closeAuth);
  authScrim.addEventListener('click', closeAuth);
  $('#tabIn').addEventListener('click', () => setMode('in'));
  $('#tabUp').addEventListener('click', () => setMode('up'));

  const DEMO_EMAIL = 'demo@clubcraft.test';
  $('#demoFill').addEventListener('click', () => {
    $('#authEmail').value = DEMO_EMAIL;
    $('#authPass').value = 'demo12345';
    showErr('');
  });

  $('#authSubmit').addEventListener('click', async () => {
    if (authBusy) return;
    const email = $('#authEmail').value.trim();
    const pass = $('#authPass').value;
    const name = $('#authName').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showErr('That email doesn\u2019t look right.');
    if (pass.length < 8) return showErr('Password needs at least 8 characters.');
    if (mode === 'up' && !name) return showErr('Tell us your name — it goes on the seat.');
    authBusy = true;
    const btn = $('#authSubmit');
    btn.disabled = true; btn.textContent = mode === 'in' ? 'Signing in…' : 'Creating…';
    try {
      if (supabase) {
        if (mode === 'up') {
          const { error } = await supabase.auth.signUp({ email, password: pass, options: { data: { full_name: name } } });
          if (error) throw error;
          session = (await supabase.auth.getSession()).data.session;
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
          if (error) throw error;
          session = (await supabase.auth.getSession()).data.session;
        }
        if (!session) throw new Error('Signed in but no session came back.');
        toast('Welcome, ' + userName(), 'SEATS NOW SYNC TO EVERY DEVICE.');
      } else {
        session = { demo: true, name: name || email.split('@')[0], user: { email } };
        localStorage.setItem('cc.demo.user', JSON.stringify(session));
        toast('Demo sign-in', 'SUPABASE NOT WIRED YET — SEATS STAY ON THIS DEVICE.');
      }
      closeAuth(); renderWho(); if (apiMode) reloadSeats();
    } catch (e) {
      showErr((e && e.message) || 'Something went wrong. Try again.');
    } finally {
      authBusy = false; btn.disabled = false; btn.textContent = mode === 'in' ? 'Sign in' : 'Create my account';
    }
  });

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    session = null; localStorage.removeItem('cc.demo.user');
    seats.clear(); store.set(seats);
    renderWho(); updateSeatUI(); if (filter === 'mine') renderRows();
  }

  function renderWho() {
    const host = $('#navAuth');
    if (!session) {
      host.innerHTML = '<button class="btn-p sm" id="navSignIn">Sign in / Join</button>' +
        '<button class="seats" id="seatsChip">SEATS <b id="seatsN">00</b>/<span id="seatsTotal">' + pad2(WORKSHOPS.length) + '</span></button>';
      $('#navSignIn').addEventListener('click', () => openAuth(false));
      $('#seatsChip').addEventListener('click', jumpToSeats);
    } else {
      host.innerHTML = '<span class="who">HI, <b>' + escapeHtml(userName() || 'Member') + '</b>' +
        '<button class="x" id="signOut" aria-label="Sign out">✕</button></span>' +
        '<button class="seats" id="seatsChip">SEATS <b id="seatsN">00</b>/<span id="seatsTotal">' + pad2(WORKSHOPS.length) + '</span></button>';
      $('#signOut').addEventListener('click', signOut);
      $('#seatsChip').addEventListener('click', jumpToSeats);
    }
    updateSeatUI();
  }
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function requireAuthThen(fn) {
    if (session) return fn();
    closeDetail();
    openAuth(false);
    toast('One second', 'SIGN IN FIRST — IT TAKES FIVE SECONDS.');
  }

  /* ═════════════════ 3. SEAT STORE + FORMATTING ═══════════════════════════ */
  const store = {
    get() { try { return new Set(JSON.parse(localStorage.getItem('cc.seats') || '[]')); } catch (e) { return new Set(); } },
    set(s) { try { localStorage.setItem('cc.seats', JSON.stringify([...s])); } catch (e) {} }
  };
  const seats = store.get();
  const seatNo = (id) => 4 + ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 15);

  const fmtWhen = (iso) => { const d = new Date(iso); return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }); };
  const fmtDay = (iso) => new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  const daysTo = (iso) => Math.max(0, Math.ceil((new Date(iso) - Date.now()) / 864e5));

  const IC = {
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  window.CC = {
    get WORKSHOPS() { return WORKSHOPS; },
    get ready() { return ready; },
    seats,
    isReg: (id) => seats.has(id),
    isLive: () => apiMode,
    openAuth: (up) => openAuth(!!up)
  };
  const hover3D = (i) => window.dispatchEvent(new CustomEvent('cc:hover', { detail: i }));

  /* ═════════════════ 4. FLOOR ROWS ════════════════════════════════════════ */
  const rowsEl = $('#rows');
  let filter = 'all';

  function rowHTML(w, i) {
    const reg = seats.has(w.id);
    return '<button class="wrow" data-i="' + i + '" aria-label="' + escapeHtml(w.title) + ' — open details">' +
      '<span class="idx mono" aria-hidden="true">' + w.n + '</span>' +
      '<span class="wr-main"><span class="wr-t">' + escapeHtml(w.title) + (reg ? ' <span class="claimed mono">SEAT CLAIMED</span>' : '') + '</span>' +
      '<span class="wr-s mono">' + fmtDay(w.starts_at) + ' · ' + escapeHtml(w.location).toUpperCase() + '</span></span>' +
      '<span class="wr-meta"><b>' + escapeHtml(w.speaker) + '</b><i>' + escapeHtml(w.role).toUpperCase() + '</i></span>' +
      '<span class="wr-a" aria-hidden="true">' + IC.up + '</span></button>';
  }
  function renderSkeleton() {
    rowsEl.innerHTML = Array.from({ length: 4 }, (_, i) =>
      '<div class="wrow sk-row" aria-hidden="true"><span class="idx mono">' + pad2(i + 1) + '</span>' +
      '<span class="wr-main"><span class="sk"><i></i><i style="width:74%"></i><i style="width:46%"></i></span></span>' +
      '<span class="wr-meta"><b>&nbsp;</b><i>&nbsp;</i></span><span class="wr-a"></span></div>').join('');
    rowsEl.setAttribute('aria-busy', 'true');
    rowsEl.style.display = '';
    $('#mineEmpty').hidden = true;
  }
  function renderRows() {
    const list = WORKSHOPS.map((w, i) => ({ w, i })).filter(({ w }) => filter === 'all' || seats.has(w.id));
    rowsEl.innerHTML = list.map(({ w, i }) => rowHTML(w, i)).join('');
    const showEmpty = filter === 'mine' && seats.size === 0;
    $('#mineEmpty').hidden = !showEmpty;
    rowsEl.style.display = showEmpty ? 'none' : '';
    rowsEl.removeAttribute('aria-busy');
    $$('#rows .wrow').forEach((r) => {
      const i = +r.dataset.i;
      r.addEventListener('click', () => openDetail(i));
      r.addEventListener('mouseenter', () => hover3D(i));
      r.addEventListener('mouseleave', () => hover3D(null));
    });
  }

  $$('.seg button').forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('on')) return;
    $$('.seg button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    filter = b.dataset.f; renderRows();
  }));
  function jumpToSeats() {
    const mine = document.querySelector('.seg [data-f="mine"]');
    if (!mine.classList.contains('on')) mine.click();
    document.getElementById('floor').scrollIntoView({ behavior: 'smooth' });
  }

  function updateSeatUI() {
    $('#seatsN').textContent = pad2(seats.size);
    $('#seatsTotal').textContent = pad2(WORKSHOPS.length);
    $('#segCount').textContent = seats.size;
    $('#srcNote').textContent =
      (apiMode ? (supabase ? 'LIVE · SUPABASE' : 'LIVE · API') : 'DEMO DATA') +
      ' · TAP A ROW — OR A PLATE ON THE RING';
  }

  /* ═════════════════ 5. TOASTS ════════════════════════════════════════════ */
  function toast(title, sub) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<b>' + escapeHtml(title) + '</b><span>' + escapeHtml(sub) + '</span>';
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), 2900);
    setTimeout(() => el.remove(), 3350);
  }
  const retrySpec = $('#specRetry');
  if (retrySpec) retrySpec.addEventListener('click', () => toast('Specimen only', 'THE REAL RETRY LIVES ON THE FLOOR.'));

  /* ═════════════════ 6. DETAIL OVERLAY + THE MONEY MOMENT ═════════════════ */
  const detail = $('#detail'), scrim = $('#scrim');
  let lastFocus = null;

  function claimSeat(w) {
    seats.add(w.id); store.set(seats);                                  // flip first — never wait on the network
    window.dispatchEvent(new CustomEvent('cc:seats', { detail: { index: WORKSHOPS.indexOf(w) } }));
    updateSeatUI();
    if (filter === 'mine') renderRows();
    renderReg(w, true);
    toast('Seat claimed', w.title + ' — ' + fmtDay(w.starts_at));

    if (!apiMode) return;                                               // demo: local state is the truth
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workshop_id: w.id })
    }).then((res) => {
      if (res.ok || res.status === 409) return;                         // 409 = already registered, not an error
      throw new Error('HTTP ' + res.status);
    }).catch(() => {
      seats.delete(w.id); store.set(seats);                             // revert with grace
      window.dispatchEvent(new CustomEvent('cc:seats', { detail: { index: WORKSHOPS.indexOf(w) } }));
      updateSeatUI();
      if (filter === 'mine') renderRows();
      renderReg(w, false);
      toast('Couldn\u2019t save that seat', 'CHECK YOUR CONNECTION — TAP TO RETRY.');
    });
  }

  function renderReg(w, fresh) {
    const z = $('#regZone');
    if (seats.has(w.id)) {
      const seat = (apiMode ? 'SYNCED' : 'LOCAL') + ' · SEAT ' + pad2(seatNo(w.id));
      z.innerHTML = '<div class="reg-badge' + (fresh ? ' stamp' : '') + '">' + IC.check + 'Registered</div><p class="sync mono">' + (fresh ? 'SYNCING…' : seat) + '</p>';
      if (fresh) setTimeout(() => { const s = z.querySelector('.sync'); if (s) s.textContent = seat; }, 800);
    } else {
      z.innerHTML = '<button class="btn-p big" id="regBtn">Claim my seat ' + IC.arrow + '</button>';
      $('#regBtn').addEventListener('click', () => requireAuthThen(() => claimSeat(w)));
    }
  }

  function openDetail(i) {
    const w = WORKSHOPS[i];
    if (!w) return;
    $('#dNum').textContent = 'SESSION ' + w.n + ' / ' + pad2(WORKSHOPS.length) + ' · IN ' + daysTo(w.starts_at) + 'D';
    $('#dTitle').textContent = w.title;
    $('#dSpeaker').textContent = w.speaker + ' — ' + w.role;
    $('#dWhen').textContent = fmtWhen(w.starts_at);
    $('#dLen').textContent = w.dur;
    $('#dWhere').textContent = w.location;
    $('#dDesc').textContent = w.desc;
    renderReg(w, false);
    lastFocus = document.activeElement;
    detail.classList.add('open'); scrim.classList.add('on');
    document.body.classList.add('locked');
    window.dispatchEvent(new CustomEvent('cc:detail', { detail: { i } }));
    $('#dClose').focus();
  }
  function closeDetail() {
    if (!detail.classList.contains('open')) return;
    detail.classList.remove('open'); scrim.classList.remove('on');
    document.body.classList.remove('locked');
    window.dispatchEvent(new CustomEvent('cc:detail', { detail: { i: -1 } }));
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.addEventListener('cc:open', (e) => openDetail(e.detail.i));
  $('#dClose').addEventListener('click', closeDetail);
  scrim.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDetail(); closeAuth(); } });

  /* ═════════════════ 7. PAGE CHROME ═══════════════════════════════════════ */
  const finishIntro = () => { $('#intro').classList.add('off'); document.body.classList.add('ready'); };
  Promise.all([
    (document.fonts && document.fonts.ready) || Promise.resolve(),
    new Promise((r) => setTimeout(r, 950))
  ]).then(finishIntro);
  $('#intro').addEventListener('pointerdown', finishIntro);

  const hd = $('#top');
  addEventListener('scroll', () => hd.classList.toggle('sc', scrollY > 30), { passive: true });
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .16 });
  $$('.rv').forEach((el) => io.observe(el));

  const q = $('#quote');
  q.innerHTML = q.textContent.trim().split(/\s+/)
    .map((w, i) => '<span class="wq" style="--d:' + (i * 0.05).toFixed(2) + 's">' + escapeHtml(w) + '</span>').join(' ');
  const io2 = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.closest('section').classList.add('in'); io2.disconnect(); }
  }), { threshold: .4 });
  io2.observe(q);

  if (matchMedia('(pointer:fine)').matches) {
    const cur = $('#cursor'), dot = cur.querySelector('.c-dot'), ring = cur.querySelector('.c-ring'), lab = cur.querySelector('.c-lab');
    let tx = innerWidth / 2, ty = innerHeight / 2, dx = tx, dy = ty, rx = tx, ry = ty;
    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; cur.classList.add('vis'); });
    document.addEventListener('mouseover', (e) => {
      cur.classList.toggle('grow', !!(e.target.closest && e.target.closest('a,button,.wrow')));
    });
    window.addEventListener('cc:cursor', (e) => {
      lab.textContent = e.detail || '';
      cur.classList.toggle('lab', !!e.detail);
    });
    (function loop() {
      dx += (tx - dx) * .6; dy += (ty - dy) * .6;
      rx += (tx - rx) * .16; ry += (ty - ry) * .16;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  $('#navSignIn').addEventListener('click', () => openAuth(false));
  $('#enterCta').addEventListener('click', () => requireAuthThen(() => openDetail(0)));

  /* ═════════════════ 8. BOOT ══════════════════════════════════════════════ */
  function reloadSeats() {
    // re-pull workshops so `registered` flags reflect the server's truth
    loadWorkshops().then((list) => { WORKSHOPS = list; updateSeatUI(); renderRows(); });
  }

  updateSeatUI();
  renderSkeleton();
  renderWho();

  let ready;
  window.CC.ready = ready = (async () => {
    await initSupabase();
    await restoreSession();
    renderWho();
    WORKSHOPS = await loadWorkshops();
    if (apiMode) WORKSHOPS.filter((w) => w.registered).forEach((w) => seats.add(w.id));   // FR-11: correct on first paint
    store.set(seats);
    updateSeatUI();
    renderRows();
    return WORKSHOPS;
  })();
})();
