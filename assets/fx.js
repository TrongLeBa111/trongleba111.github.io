/* ════════════════════════════════════════════════════════════
   fx.js — animation & personal-brand layer for the portfolio.
   Loaded AFTER the inline script in index.html (it wraps setTrack()).
   Tweak the CONFIG block; every effect can be switched off on its own.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CONFIG = {
    boot: true,              // terminal boot screen, once per browser session
    particles: true,         // ambient data-network canvas behind the page
    particleCount: 56,
    particleLinkDist: 130,
    tilt: true,              // 3D tilt of the hero avatar
    spotlight: true,         // cursor glow on cards
    scramble: true,          // "decode" effect on the headline verb
    countUp: true,           // animated numbers
    flip: true,              // project cards glide when the track changes
    hirePill: true,          // floating "open for hire" button
    bootLines: [
      '> boot  <b>trongleba111.portfolio</b>',
      '> mounting dossier ............ <b>OK</b>',
      '> loading 650k+ records ....... <b>OK</b>',
      '> compiling insights .......... <b>OK</b>',
      '> ready. welcome.'
    ]
  };

  // CV that matches each track (Marketing has its own file; E-commerce reuses DA)
  var CV_MAP = {
    DA:  { href: 'image/CV/DA/LeBaTrong_CV_data_intern.pdf',               label: 'DA' },
    DE:  { href: 'image/CV/DE/DATA ENGINEER INTERN - Lê Bá Trọng.pdf',                           label: 'DE' },
    BA:  { href: 'image/CV/BA/LeBaTrong_CV_Business_Analyst_Intern.pdf',      label: 'BA' },
    AI:  { href: 'image/CV/AI/LeBaTrong_CV_AI_intern.pdf',                 label: 'AI' },
    MKT: { href: 'image/CV/MKT/LeBaTrong_Marketing_Growth_Intern.pdf',     label: 'MKT' },
    ECO: { href: 'image/CV/DA/LeBaTrong_CV_data_intern.pdf',               label: 'DA' }
  };

  var root = document.documentElement;
  var fxOn = root.classList.contains('fx');           // false for reduced-motion / no-JS-head-script
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ── ready(): run effects after the boot screen is gone ── */
  var isReady = false, readyQueue = [];
  function whenReady(fn) { isReady ? fn() : readyQueue.push(fn); }
  function fireReady() {
    if (isReady) return;
    isReady = true;
    root.classList.remove('fx-boot');
    readyQueue.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    readyQueue = [];
  }

  /* ── Boot screen ─────────────────────────────────────── */
  function runBoot() {
    var el = $('#fxBoot');
    if (!el || !root.classList.contains('fx-boot') || !CONFIG.boot) { fireReady(); return; }
    var box = $('.fx-boot-box', el), bar = $('.fx-boot-bar i', el);
    CONFIG.bootLines.forEach(function (html, i) {
      var d = document.createElement('div');
      d.className = 'fx-boot-line' + (i === CONFIG.bootLines.length - 1 ? ' last' : '');
      d.innerHTML = html;
      box.insertBefore(d, $('.fx-boot-bar', box));
    });
    var lines = $$('.fx-boot-line', box), timers = [], done = false;
    lines.forEach(function (l, i) { timers.push(setTimeout(function () { l.classList.add('on'); }, 150 + i * 260)); });
    requestAnimationFrame(function () { bar.style.width = '100%'; });
    function finish() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      try { sessionStorage.setItem('fxBoot', '1'); } catch (e) {}
      el.classList.add('out');
      setTimeout(fireReady, 280);
    }
    timers.push(setTimeout(finish, 150 + lines.length * 260 + 350));
    el.addEventListener('click', finish);
    window.addEventListener('keydown', finish, { once: true });
  }

  /* ── Count-up numbers ────────────────────────────────── */
  function countUp(el) {
    var final = el.textContent.trim();
    var m = /^([\d.,]+)(.*)$/.exec(final);
    if (!m) return;
    var raw = m[1].replace(/,/g, ''), target = parseFloat(raw);
    if (isNaN(target)) return;
    var dec = (raw.split('.')[1] || '').length, suffix = m[2], t0 = null, dur = 1400;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = final;
    }
    el.textContent = (0).toFixed(dec) + suffix;
    requestAnimationFrame(step);
  }

  /* ── Text scramble ("decode") ────────────────────────── */
  var GLYPHS = '01<>/_#$%&=+*';
  function scramble(el, text) {
    if (!el) return;
    if (!fxOn || !CONFIG.scramble) { el.textContent = text; return; }
    var t0 = performance.now(), dur = 520;
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1), out = '';
      for (var i = 0; i < text.length; i++) {
        out += (i < text.length * p) ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = text;
    })(t0);
  }

  /* ── Divider typing ──────────────────────────────────── */
  function typeText(el, text) {
    el.textContent = ''; el.classList.add('typing');
    var i = 0;
    (function next() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(next, 22);
      else setTimeout(function () { el.classList.remove('typing'); }, 700);
    })();
  }

  /* ── Scroll-driven stuff: progress bar, nav shadow, hire pill ── */
  function initScroll() {
    var bar = $('#fxProgress'), hire = $('#fxHire'), contact = $('#contact'), ticking = false;
    function update() {
      ticking = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(scrollY / h, 1) : 0) + ')';
      if (hire && CONFIG.hirePill) {
        var cr = contact ? contact.getBoundingClientRect() : null;
        var inContact = cr && cr.top < innerHeight * 0.6;
        hire.classList.toggle('show', scrollY > 700 && !inContact);
      }
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ── Reveal helpers (dividers, stagger groups, counters) ── */
  function initReveals() {
    // dividers
    var dIO = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        dIO.unobserve(e.target);
        e.target.classList.add('fx-in');
        var t = $('.divider-text', e.target);
        if (t && fxOn) typeText(t, t.dataset.full);
      });
    }, { threshold: 0.6 });
    $$('.section-divider').forEach(function (d) {
      var t = $('.divider-text', d); if (t) t.dataset.full = t.textContent;
      dIO.observe(d);
    });

    // stagger groups
    if (fxOn) {
      var groups = ['.stat-cell', '.tech-chip', '.about-skill-card', '.impact-card', '.now-card',
                    '.skill-row', '.contact-link', '.cv-btn', '.edu-card', '.intern-card'];
      var sIO = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (!e.isIntersecting) return;
          sIO.unobserve(e.target);
          var el = e.target;
          whenReady(function () {
            el.classList.add('in');
            var delay = (parseInt(el.style.getPropertyValue('--i')) || 0) * 70 + 700;
            setTimeout(function () { el.classList.remove('stg', 'in'); el.style.removeProperty('--i'); }, delay);
          });
        });
      }, { threshold: 0.15 });
      groups.forEach(function (sel) {
        var items = $$(sel), counters = new Map();
        items.forEach(function (el) {
          var p = el.parentElement, i = counters.get(p) || 0;
          counters.set(p, i + 1);
          el.classList.add('stg'); el.style.setProperty('--i', Math.min(i, 12));
          sIO.observe(el);
        });
      });
    }

    // counters
    if (CONFIG.countUp && fxOn) {
      var cIO = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (!e.isIntersecting) return;
          cIO.unobserve(e.target); (function (t) { whenReady(function () { countUp(t); }); })(e.target);
        });
      }, { threshold: 0.6 });
      $$('.stat-val, .impact-num').forEach(function (el) { cIO.observe(el); });
    }
  }

  /* ── Pointer effects: avatar tilt + card spotlight ───── */
  function initPointer() {
    if (isTouch) return;
    if (CONFIG.tilt && fxOn) {
      var col = $('.hero-avatar-col'), wrap = $('.hero-avatar-wrap');
      if (col && wrap) {
        col.addEventListener('pointermove', function (e) {
          var r = col.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          wrap.style.setProperty('--ry', (x * 14).toFixed(1) + 'deg');
          wrap.style.setProperty('--rx', (-y * 14).toFixed(1) + 'deg');
        });
        col.addEventListener('pointerleave', function () {
          wrap.style.setProperty('--ry', '0deg'); wrap.style.setProperty('--rx', '0deg');
        });
      }
    }
    if (CONFIG.spotlight) {
      document.addEventListener('pointermove', function (e) {
        var card = e.target.closest && e.target.closest('.project-card, .impact-card');
        if (!card) return;
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    }
  }

  /* ── Ambient particle network ────────────────────────── */
  function initParticles() {
    var c = $('#fxBg');
    if (!c || !fxOn || !CONFIG.particles) { if (c) c.style.display = 'none'; return; }
    var ctx = c.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, pts = [], mouse = { x: -9999, y: -9999 }, rgb = [56, 189, 248], last = 0, frame = 0;

    function mk() { return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.3 + .6 }; }
    function resize() {
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(CONFIG.particleCount * Math.min(1, (w * h) / (1440 * 900)));
      if (w < 700) n = Math.min(n, 26);
      while (pts.length < n) pts.push(mk());
      pts.length = n;
    }
    function readColor() {
      var v = getComputedStyle(document.body).getPropertyValue('--tc').trim(), m;
      if ((m = /^#([0-9a-f]{6})$/i.exec(v))) rgb = [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
      else if ((m = /rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(v))) rgb = [+m[1], +m[2], +m[3]];
    }
    function draw(ts) {
      requestAnimationFrame(draw);
      if (document.hidden || ts - last < 25) return;          // ~40 fps cap, pause when tab hidden
      last = ts;
      if (++frame % 20 === 0) readColor();
      ctx.clearRect(0, 0, w, h);
      var L = CONFIG.particleLinkDist, col = rgb[0] + ',' + rgb[1] + ',' + rgb[2];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = 'rgba(' + col + ',.7)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < L) { ctx.strokeStyle = 'rgba(' + col + ',' + ((1 - d / L) * .32).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 160) { ctx.strokeStyle = 'rgba(' + col + ',' + ((1 - md / 160) * .5).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
    }
    resize(); readColor();
    addEventListener('resize', resize);
    if (!isTouch) addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    requestAnimationFrame(draw);
  }

  /* ── Toast + copy email ──────────────────────────────── */
  var toastTimer;
  function toast(msg) {
    var t = $('#fxToast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function initCopyEmail() {
    $$('.contact-link[href^="mailto:"]').forEach(function (a) {
      var wrap = document.createElement('div'); wrap.className = 'fx-mail-wrap';
      a.parentNode.insertBefore(wrap, a); wrap.appendChild(a);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'fx-copy'; b.textContent = 'COPY';
      b.setAttribute('aria-label', 'Copy email address');
      b.addEventListener('click', function () {
        var addr = a.getAttribute('href').replace('mailto:', '');
        var ok = function () { toast('Email copied ✓'); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(ok, function () { toast(addr); });
        else toast(addr);
      });
      wrap.appendChild(b);
    });
  }

  /* ── Track wrapper: FLIP, scramble, smart CV, shareable URL ── */
  var params = new URLSearchParams(location.search);
  var forWho = (params.get('for') || '').replace(/[^\w &.\-]/g, '').slice(0, 28).trim();
  var initialising = true;

  function updateForLink(track) {
    if (initialising) return;
    var q = new URLSearchParams(); q.set('track', track);
    if (forWho) q.set('for', forWho);
    try { history.replaceState(null, '', '?' + q.toString() + location.hash); } catch (e) {}
  }
  function syncSmartBits(track) {
    var cv = $('#heroCv'), m = CV_MAP[track] || CV_MAP.DA;
    if (cv) { cv.setAttribute('href', m.href); var s = $('small', cv); if (s) s.textContent = '· ' + m.label; }
    $$('.impact-card').forEach(function (c) {
      c.classList.toggle('is-lit', (c.dataset.tracks || '').split(',').indexOf(track) > -1);
    });
  }

  var origSetTrack = window.setTrack;
  window.setTrack = function (track, btn) {
    if (!btn) btn = $('.track-pill[data-track="' + track + '"]');
    var list = $('#projectsList'), cards = list ? $$('.project-card', list) : [];
    var first = (!initialising && fxOn && CONFIG.flip) ? cards.map(function (c) { return c.getBoundingClientRect(); }) : null;

    origSetTrack(track, btn);

    syncSmartBits(track);
    updateForLink(track);
    if (!initialising) scramble($('#trackVerb'), trackMeta[track].verb);
    if (first) {
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect(), dx = first[i].left - r.left, dy = first[i].top - r.top;
        if ((dx || dy) && c.animate) c.animate(
          [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }],
          { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    }
  };

  function initFromUrl() {
    var t = (params.get('track') || '').toUpperCase();
    if (typeof trackMeta !== 'undefined' && trackMeta[t]) window.setTrack(t);
    else syncSmartBits(typeof currentTrack !== 'undefined' ? currentTrack : 'DA');
    if (forWho) {
      var tag = $('.hero-tag');
      if (tag) { var s = document.createElement('span'); s.className = 'fx-for'; s.textContent = ' // FOR: ' + forWho.toUpperCase(); tag.appendChild(s); }
    }
    initialising = false;
  }

  /* ── Go ──────────────────────────────────────────────── */
  initFromUrl();
  initScroll();
  initCopyEmail();
  initPointer();
  initReveals();
  whenReady(initParticles);
  runBoot();
})();
