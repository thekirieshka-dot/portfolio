/* ───────── MERIDIAN — site.js ───────── */
(function () {
  'use strict';
  var d = document, root = d.documentElement, gsap = window.gsap, ST = window.ScrollTrigger;
  var qs = Core.qs, qsa = Core.qsa, RM = Core.RM;
  var PAGE = d.body.dataset.page || 'home';
  var BG = '#0b0a09', GOLD = '#d8c79f', PRE_DUR = 2.4;

  Core.config({
    veilBg: BG, veilInk: GOLD, veilCols: 5, lerp: 0.08,
    preloader: { key: 'meridian', brand: '', top: 'Manufacture Meridian', topRight: 'Le Locle — Jura', bottom: 'Regulating the balance', duration: PRE_DUR }
  });

  /* Core bug workaround: links without data-veil* pass `undefined` colours into Core.go
     (Object.assign copies undefined over the defaults). Fill them in. */
  qsa('a[href]').forEach(function (a) {
    if (!a.dataset.veil) a.dataset.veil = BG;
    if (!a.dataset.veilInk) a.dataset.veilInk = GOLD;
    if (!a.dataset.veilLabel) a.dataset.veilLabel = 'Meridian';
  });

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function polar(r, deg, c) { var a = (deg - 90) * Math.PI / 180; c = c || 200; return [r2(c + r * Math.cos(a)), r2(c + r * Math.sin(a))]; }

  /* ───────── dial pose: every watch is shown at ten past ten; only the seconds hand runs ───────── */
  var POSE = (10 * 60 + 9) * 6e4;

  /* ───────── SVG dial ───────── */
  var dials = [], seq = 0;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { var o = e.target.__dial; if (o) o.vis = e.isIntersecting; });
  }, { rootMargin: '100px' }) : null;

  function dialMarkup(id) {
    var s = [], i, p, q;
    s.push('<defs>',
      '<radialGradient id="', id, 'f" cx="44%" cy="36%" r="68%"><stop offset="0" class="s1"/><stop offset=".55" class="s2"/><stop offset="1" class="s3"/></radialGradient>',
      '<linearGradient id="', id, 'c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe5cc"/><stop offset=".24" stop-color="#5a5244"/><stop offset=".5" stop-color="#d3c7a6"/><stop offset=".76" stop-color="#3a342b"/><stop offset="1" stop-color="#b8ab89"/></linearGradient>',
      '<linearGradient id="', id, 'i" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="i1"/><stop offset=".5" class="i2"/><stop offset="1" class="i3"/></linearGradient>',
      '<radialGradient id="', id, 'v" cx="50%" cy="50%" r="50%"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>',
      '<linearGradient id="', id, 'g" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".11"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>',
      '<filter id="', id, 's" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="2" dy="3.5" stdDeviation="2.4" flood-color="#000" flood-opacity=".5"/></filter>',
      '</defs>');
    s.push('<circle cx="200" cy="200" r="199" fill="url(#', id, 'c)"/>');
    s.push('<circle cx="200" cy="200" r="191" fill="#080706"/>');
    s.push('<circle cx="200" cy="200" r="188.5" fill="url(#', id, 'f)"/>');
    var ray = '';
    for (i = 0; i < 180; i++) { p = polar(16, i * 2); q = polar(187, i * 2); ray += 'M' + p[0] + ' ' + p[1] + 'L' + q[0] + ' ' + q[1]; }
    s.push('<path class="d-ray" d="', ray, '"/>');
    s.push('<circle cx="200" cy="200" r="188.5" fill="url(#', id, 'v)"/>');
    var tk = '', tk5 = '';
    for (i = 0; i < 60; i++) {
      p = polar(i % 5 ? 179 : 177, i * 6); q = polar(185, i * 6);
      if (i % 5) tk += 'M' + p[0] + ' ' + p[1] + 'L' + q[0] + ' ' + q[1]; else tk5 += 'M' + p[0] + ' ' + p[1] + 'L' + q[0] + ' ' + q[1];
    }
    s.push('<circle class="d-rail" cx="200" cy="200" r="179"/><path class="d-tk" d="', tk, '"/><path class="d-tk5" d="', tk5, '"/>');
    for (i = 0; i < 12; i++) {
      if (i === 0) s.push('<rect x="191.2" y="26" width="5.6" height="36" rx="1" fill="url(#', id, 'i)"/><rect x="203.2" y="26" width="5.6" height="36" rx="1" fill="url(#', id, 'i)"/>');
      else s.push('<rect x="197.2" y="29" width="5.6" height="32" rx="1" fill="url(#', id, 'i)" transform="rotate(', i * 30, ' 200 200)"/>');
    }
    s.push('<g class="d-mark" transform="translate(190.5 80) scale(.475)"><circle cx="20" cy="20" r="18.4"/><path d="M20 2.5v35M12.2 26.5v-12l7.8 9.2 7.8-9.2v12"/></g>');
    s.push('<text class="d-name" x="202.2" y="121" text-anchor="middle">MERIDIAN</text>');
    s.push('<text class="d-sub" x="200.8" y="272" text-anchor="middle">CALIBRE M1</text>');
    s.push('<text class="d-sub" x="200.8" y="283" text-anchor="middle">LE LOCLE</text>');
    s.push('<g filter="url(#', id, 's)">',
      '<g class="d-hh"><path class="hl" d="M200 92 L196 104 L195.4 216 L200 216Z"/><path class="hr" d="M200 92 L204 104 L204.6 216 L200 216Z"/></g>',
      '<g class="d-hm"><path class="hl" d="M200 34 L197.1 46 L196.6 220 L200 220Z"/><path class="hr" d="M200 34 L202.9 46 L203.4 220 L200 220Z"/></g>',
      '<g class="d-hs"><path d="M199.3 246 L199.65 26 L200.35 26 L200.7 246Z"/><rect x="198" y="224" width="4" height="24" rx="2"/><circle cx="200" cy="200" r="4.4"/></g>',
      '</g>');
    s.push('<circle class="d-cap" cx="200" cy="200" r="2.6"/><circle cx="200" cy="200" r="1" fill="#0b0a09"/>');
    s.push('<path d="M14 200 A186 186 0 0 1 372 118 Q210 150 14 200Z" fill="url(#', id, 'g)"/>');
    return s.join('');
  }

  function setHands(o, ms) {
    var beat = Math.floor(ms / 1000 * 6) / 6;            // 21,600 vph = six beats a second
    if (beat === o.last) return; o.last = beat;
    var h = (POSE / 36e5) % 12, m = (POSE / 6e4) % 60;
    o.hh.setAttribute('transform', 'rotate(' + (h * 30).toFixed(3) + ' 200 200)');
    o.hm.setAttribute('transform', 'rotate(' + (m * 6).toFixed(3) + ' 200 200)');
    if (!o.manual) o.hs.setAttribute('transform', 'rotate(' + ((beat % 60) * 6).toFixed(2) + ' 200 200)');
  }
  function makeDial(host, opt) {
    opt = opt || {};
    var id = 'md' + (++seq);
    host.innerHTML = '<svg class="dial" viewBox="0 0 400 400" aria-hidden="true" focusable="false">' + dialMarkup(id) + '</svg>';
    var svg = host.firstChild;
    var o = { host: host, svg: svg, hh: qs('.d-hh', svg), hm: qs('.d-hm', svg), hs: qs('.d-hs', svg), manual: false, vis: true, last: -1 };
    o.tone = function (t) { svg.setAttribute('data-tone', t); };
    o.tone(opt.tone || host.dataset.dial || 'midnight');
    host.__dial = o; dials.push(o); if (io) io.observe(host);
    setHands(o, Date.now());
    return o;
  }
  gsap.ticker.add(function () {
    var now = Date.now();
    for (var i = 0; i < dials.length; i++) if (dials[i].vis) setHands(dials[i], now);
  });

  /* build every [data-dial] host */
  qsa('[data-dial]').forEach(function (h) { makeDial(h); });

  /* ───────── preloader: a dial whose seconds hand sweeps with the count, then opens like an iris ───────── */
  function augmentPre() {
    var p = qs('.pre'); if (!p) return;
    p.classList.add('pre--m');
    var tgt = qs('[data-pre-target]'), tone = (tgt && tgt.dataset.tone) || 'midnight';
    var r = tgt ? tgt.getBoundingClientRect() : null;
    var size = r && r.width ? r.width : Math.min(innerWidth * 0.6, innerHeight * 0.5);
    var cx = r && r.width ? r.left + r.width / 2 : innerWidth / 2, cy = r && r.width ? r.top + r.height / 2 : innerHeight / 2;
    var geo = 'width:' + size + 'px;height:' + size + 'px;left:' + (cx - size / 2) + 'px;top:' + (cy - size / 2) + 'px';
    var axis = Core.el('i', 'pre__axis'); axis.style.left = cx + 'px';
    var ring = Core.el('div', 'pre__ring'); ring.style.cssText = geo;
    var box = Core.el('div', 'pre__dial'); box.style.cssText = geo;
    p.append(axis, ring, box);
    var dl = makeDial(box, { tone: tone }); dl.manual = true;
    var endBeat = (Math.floor((Date.now() + PRE_DUR * 1000 + 60) / 1000 * 6) / 6) % 60;
    var o = { a: 0 };
    dl.hs.setAttribute('transform', 'rotate(0 200 200)');
    gsap.to(o, { a: 360 + endBeat * 6, duration: PRE_DUR, ease: 'power2.inOut', onUpdate: function () { dl.hs.setAttribute('transform', 'rotate(' + o.a.toFixed(2) + ' 200 200)'); }, onComplete: function () { dl.manual = false; } });
    gsap.from(box, { autoAlpha: 0, scale: 0.94, duration: 1.4, ease: 'expo.out' });
    gsap.from(ring, { scale: 0.8, autoAlpha: 0, duration: 1.6, ease: 'expo.out', delay: 0.15 });
    gsap.from(axis, { scaleY: 0, duration: 1.6, ease: 'expo.inOut' });
    var top = qs('.pre__top', p);
    var mo = new MutationObserver(function () { mo.disconnect(); exit(); });
    mo.observe(top, { attributes: true, attributeFilter: ['style'] });
    function exit() {
      var R0 = size / 2 * 0.955, R1 = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 30, s = { r: R0 };
      var set = function () { var m = 'radial-gradient(circle at ' + cx + 'px ' + cy + 'px, transparent ' + s.r.toFixed(1) + 'px, #000 ' + (s.r + 1.5).toFixed(1) + 'px)'; p.style.webkitMaskImage = m; p.style.maskImage = m; };
      set();
      gsap.timeline()
        .to(s, { r: R1, duration: 1.3, ease: 'expo.inOut', onUpdate: set }, 0.08)
        .to(ring, { scale: R1 / (size / 2), duration: 1.3, ease: 'expo.inOut' }, 0.08)
        .to(ring, { opacity: 0, duration: 0.5 }, 0.8)
        .to([axis, qs('.pre__bar', p)], { opacity: 0, duration: 0.4 }, 0);
    }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', augmentPre); else augmentPre();

  /* ───────── shared ───────── */
  qsa('[data-top]').forEach(function (b) { b.addEventListener('click', function () { if (Core.lenis) Core.lenis.scrollTo(0, { duration: 2.2 }); else scrollTo({ top: 0, behavior: 'smooth' }); }); });

  function numeralSweep() {
    if (RM) return;
    qsa('.num').forEach(function (n) {
      gsap.fromTo(n, { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', ease: 'none', scrollTrigger: { trigger: n, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });
  }
  function hashJump() {
    var h = location.hash; if (!h || h.length < 2) return;
    var t = null; try { t = qs(h); } catch (e) {}
    if (!t || t.closest('.cfg')) return;
    setTimeout(function () { ST.refresh(); var y = t.getBoundingClientRect().top + scrollY - (h === '#reserve' ? 20 : 0); if (Core.lenis) Core.lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y); }, 120);
  }

  /* ═════════════════════ HOME ═════════════════════ */
  if (PAGE === 'home') {
    var chars = qsa('.hero__word b');
    var heroFade = qsa('.hero__meta p, .hero__foot > *');
    if (!RM) { gsap.set(chars, { yPercent: 108 }); gsap.set(heroFade, { autoAlpha: 0, y: 18 }); }

    /* gold dust */
    (function dust() {
      var cv = qs('.hero__dust'); if (!cv || RM) return;
      var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), P = [], on = true;
      var N = innerWidth < 700 ? 30 : 70;
      var sp = d.createElement('canvas'); sp.width = sp.height = 32;
      var sc = sp.getContext('2d'), g = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(246,234,204,1)'); g.addColorStop(0.22, 'rgba(216,199,159,.6)'); g.addColorStop(1, 'rgba(216,199,159,0)');
      sc.fillStyle = g; sc.fillRect(0, 0, 32, 32);
      function size() { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
      function spawn(q, init) { q.x = Math.random() * W; q.y = init ? Math.random() * H : H + 12; q.r = 0.5 + Math.random() * Math.random() * 2.4; q.vx = (Math.random() - 0.5) * 0.1; q.vy = -(0.04 + Math.random() * 0.2); q.ph = Math.random() * 6.28; q.a = 0.25 + Math.random() * 0.65; }
      size(); for (var i = 0; i < N; i++) { var q = {}; spawn(q, true); P.push(q); }
      addEventListener('resize', size);
      if (io) new IntersectionObserver(function (es) { on = es[0].isIntersecting; }).observe(cv);
      Core.onTick(function (y, v) {
        if (!on) return;
        ctx.clearRect(0, 0, W, H);
        var t = performance.now() / 1000, cx = W / 2, cy = H / 2, md = Math.max(W, H) * 0.62;
        for (var i = 0; i < P.length; i++) {
          var q = P[i];
          q.x += q.vx + Math.sin(t * 0.3 + q.ph) * 0.06; q.y += q.vy - v * 0.015;
          if (q.y < -12 || q.y > H + 14) spawn(q, false);
          var dist = Math.hypot(q.x - cx, q.y - cy), near = Math.max(0, 1 - dist / md);
          ctx.globalAlpha = q.a * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.4 + q.ph * 3))) * (0.25 + 0.75 * near);
          var s = q.r * 7; ctx.drawImage(sp, q.x - s / 2, q.y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
      });
    })();

    /* going-train drawing */
    (function train() {
      var svg = qs('.train'); if (!svg) return;
      function gear(cx, cy, r, n, dep) {
        var dd = '', st = Math.PI * 2 / n, ri = r - dep;
        for (var i = 0; i < n; i++) {
          var a = i * st, pts = [[ri, a], [ri, a + st * 0.12], [r, a + st * 0.3], [r, a + st * 0.58], [ri, a + st * 0.76]];
          pts.forEach(function (p, j) { dd += (i === 0 && j === 0 ? 'M' : 'L') + r2(cx + p[0] * Math.cos(p[1])) + ' ' + r2(cy + p[0] * Math.sin(p[1])); });
        }
        return dd + 'Z';
      }
      function wheel(cx, cy, r, n, pr, t, rev, spokes) {
        var s = '<g class="spin' + (rev ? ' rev' : '') + '" style="--t:' + t + 's;transform-origin:' + cx + 'px ' + cy + 'px">';
        s += '<path class="g" d="' + gear(cx, cy, r, n, Math.max(2.4, r * 0.05)) + '"/>';
        s += '<circle class="g-s" cx="' + cx + '" cy="' + cy + '" r="' + r2(r * 0.84) + '"/>';
        var k = spokes || 5;
        for (var i = 0; i < k; i++) { var a = i * Math.PI * 2 / k; s += '<path class="g-s" d="M' + r2(cx + r * 0.2 * Math.cos(a)) + ' ' + r2(cy + r * 0.2 * Math.sin(a)) + 'L' + r2(cx + r * 0.84 * Math.cos(a)) + ' ' + r2(cy + r * 0.84 * Math.sin(a)) + '"/>'; }
        s += '<circle class="g-s" cx="' + cx + '" cy="' + cy + '" r="' + r2(r * 0.2) + '"/>';
        if (pr) s += '<path class="g-f" d="' + gear(cx, cy, pr, 8, pr * 0.32) + '"/>';
        s += '<circle class="jw" cx="' + cx + '" cy="' + cy + '" r="2.6"/></g>';
        return s;
      }
      var s = '<circle class="plate" cx="320" cy="262" r="252"/>';
      s += '<text class="lbl-s" x="320" y="526" text-anchor="middle">Ø 30.0 MM · 13¼ LIGNES</text>';
      // A barrel (with spring hint)
      s += '<g class="spin" style="--t:900s;transform-origin:170px 330px"><path class="g" d="' + gear(170, 330, 112, 96, 4) + '"/><circle class="g-s" cx="170" cy="330" r="104"/>';
      var sp = ''; for (var i = 0; i <= 260; i++) { var a = i / 260 * Math.PI * 12, rr = 22 + i / 260 * 74; sp += (i ? 'L' : 'M') + r2(170 + rr * Math.cos(a)) + ' ' + r2(330 + rr * Math.sin(a)); }
      s += '<path class="g-s" d="' + sp + '" style="opacity:.5"/><rect class="g-f" x="160" y="320" width="20" height="20"/></g>';
      s += wheel(270, 250, 78, 72, 16, 240, true);
      s += wheel(342, 196, 62, 64, 12, 120, false);
      s += wheel(408, 225, 56, 60, 10, 60, true, 4);
      // E escape wheel (15 club teeth), ticks
      var ew = '', ex = 466, ey = 252;
      for (i = 0; i < 15; i++) { var b = i * Math.PI * 2 / 15; [[22, 0], [34, 0.1], [33, 0.2], [22, 0.3]].forEach(function (p, j) { ew += (j === 0 ? (i ? 'L' : 'M') : 'L') + r2(ex + p[0] * Math.cos(b + p[1])) + ' ' + r2(ey + p[0] * Math.sin(b + p[1])); }); }
      s += '<g class="tick" style="transform-origin:' + ex + 'px ' + ey + 'px"><path class="g" d="' + ew + 'Z"/><circle class="g-s" cx="' + ex + '" cy="' + ey + '" r="12"/><path class="g-f" d="' + gear(ex, ey, 8, 7, 2.6) + '"/><circle class="jw" cx="' + ex + '" cy="' + ey + '" r="2.4"/></g>';
      // pallet fork
      s += '<path class="g-f" d="M490 238 L520 262 L560 292 L556 298 L516 270 L486 248 Z"/><circle class="jw" cx="497" cy="248" r="3"/>';
      // F balance with hairspring
      var bx = 556, by = 328, hs = '';
      for (i = 0; i <= 200; i++) { var c = i / 200 * Math.PI * 14, rq = 5 + i / 200 * 34; hs += (i ? 'L' : 'M') + r2(bx + rq * Math.cos(c)) + ' ' + r2(by + rq * Math.sin(c)); }
      s += '<path class="g-s" d="' + hs + '"/>';
      s += '<g class="osc" style="transform-origin:' + bx + 'px ' + by + 'px"><circle class="g" cx="' + bx + '" cy="' + by + '" r="62" stroke-width="2.4"/><circle class="g-s" cx="' + bx + '" cy="' + by + '" r="57"/>';
      for (i = 0; i < 3; i++) { var e = i * Math.PI * 2 / 3 - Math.PI / 2; s += '<path class="g" d="M' + bx + ' ' + by + 'L' + r2(bx + 58 * Math.cos(e)) + ' ' + r2(by + 58 * Math.sin(e)) + '"/>'; }
      for (i = 0; i < 8; i++) { var f = i * Math.PI / 4; s += '<circle class="g-f" cx="' + r2(bx + 62 * Math.cos(f)) + '" cy="' + r2(by + 62 * Math.sin(f)) + '" r="2.6"/>'; }
      s += '<circle class="jw" cx="' + bx + '" cy="' + by + '" r="3"/></g>';
      // labels
      [['A', 170, 330, 60, 470], ['B', 270, 250, 230, 120], ['C', 342, 196, 330, 92], ['D', 408, 225, 440, 120], ['E', 466, 252, 520, 190], ['F', 556, 328, 600, 430]].forEach(function (L) {
        s += '<path class="lead" d="M' + L[1] + ' ' + L[2] + 'L' + L[3] + ' ' + L[4] + '"/><circle cx="' + L[3] + '" cy="' + L[4] + '" r="9" fill="#14110e" stroke="rgba(216,199,159,.6)" stroke-width=".7"/><text class="lbl" x="' + L[3] + '" y="' + (L[4] + 3.2) + '" text-anchor="middle">' + L[0] + '</text>';
      });
      svg.innerHTML = s;
      if (io) new IntersectionObserver(function (es) { svg.classList.toggle('is-on', es[0].isIntersecting); }).observe(svg);
      else svg.classList.add('is-on');
    })();

    /* ring around chapter III photo */
    (function ring() {
      var svg = qs('.dialfig__ring'); if (!svg) return;
      var s = '<circle class="rg" cx="50" cy="50" r="49.6"/><circle class="rg" cx="50" cy="50" r="45.4"/>';
      for (var i = 0; i < 60; i++) { var p = polar(i % 5 ? 47.6 : 46.6, i * 6, 50), q = polar(49, i * 6, 50); s += '<path class="' + (i % 5 ? 'rt' : 'rt5') + '" d="M' + p[0] + ' ' + p[1] + 'L' + q[0] + ' ' + q[1] + '"/>'; }
      [0, 15, 30, 45].forEach(function (m) { var t = polar(43.4, m * 6, 50); s += '<text x="' + t[0] + '" y="' + (t[1] + 1.1) + '" text-anchor="middle">' + pad(m) + '</text>'; });
      svg.innerHTML = '<g class="rgr" style="transform-origin:50px 50px">' + s + '</g>';
    })();

    /* barrel bridge with engraved initials */
    (function bridge() {
      var svg = qs('.bridge'); if (!svg) return;
      var outline = 'M58 196 C54 116 128 62 222 60 L404 70 C474 74 516 120 510 178 C504 238 456 264 404 270 L334 278 C304 332 244 356 180 344 C108 330 62 272 58 196 Z';
      var s = '<defs><pattern id="perl" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#191510"/><circle cx="8" cy="8" r="7.6" fill="none" stroke="rgba(216,199,159,.17)" stroke-width=".6"/><circle cx="0" cy="0" r="7.6" fill="none" stroke="rgba(216,199,159,.12)" stroke-width=".6"/><circle cx="16" cy="16" r="7.6" fill="none" stroke="rgba(216,199,159,.12)" stroke-width=".6"/><circle cx="16" cy="0" r="7.6" fill="none" stroke="rgba(216,199,159,.12)" stroke-width=".6"/><circle cx="0" cy="16" r="7.6" fill="none" stroke="rgba(216,199,159,.12)" stroke-width=".6"/></pattern></defs>';
      s += '<path class="bo" d="' + outline + '"/>';
      s += '<path class="bi" d="' + outline + '" transform="translate(284 205) scale(.94) translate(-284 -205)"/>';
      s += '<circle class="bi" cx="178" cy="206" r="58"/><circle class="sc" cx="178" cy="206" r="30"/><circle class="jw" cx="178" cy="206" r="7"/>';
      [[110, 140, 20], [318, 98, -30], [470, 196, 60], [250, 308, 10]].forEach(function (c) {
        s += '<circle class="sc" cx="' + c[0] + '" cy="' + c[1] + '" r="11"/><path class="sl" d="M' + (c[0] - 7) + ' ' + c[1] + 'h14" transform="rotate(' + c[2] + ' ' + c[0] + ' ' + c[1] + ')"/>';
      });
      s += '<circle class="jw" cx="420" cy="132" r="5"/><circle class="bi" cx="420" cy="132" r="10"/>';
      s += '<text class="ini" x="356" y="232" text-anchor="middle" data-ini-t>A.V.</text>';
      s += '<text class="ser" x="356" y="260" text-anchor="middle" data-ser-t>M1 · 0611</text>';
      s += '<path class="dim" d="M58 372 H510 M58 366 v12 M510 366 v12"/>';
      svg.innerHTML = s;
    })();

    Core.onReady(function () {
      /* hero intro + scroll */
      if (!RM) {
        gsap.to(chars, { yPercent: 0, duration: 1.7, ease: 'expo.out', stagger: { each: 0.07, from: 'center' }, delay: 0.05 });
        gsap.to(heroFade, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, delay: 0.45 });
        var htl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });
        chars.forEach(function (c, i) { htl.to(c, { x: function () { return (i - 3.5) * innerWidth * 0.085; }, ease: 'none' }, 0); });
        htl.to('.hero__word', { opacity: 0.25, ease: 'none' }, 0)
          .to('.hero__dialIn', { yPercent: 22, scale: 0.84, ease: 'none' }, 0)
          .to('.hero__meta, .hero__foot', { autoAlpha: 0, y: -40, ease: 'none', duration: 0.5 }, 0)
          .to('.hero__axis', { scaleY: 0.4, opacity: 0, ease: 'none' }, 0);
      }

      turntable();
      numeralSweep();

      /* chapter III — circular reveal */
      var df = qs('.dialfig');
      if (df && !RM) {
        var clip = qs('.dialfig__clip', df), img = qs('img', clip);
        var tl3 = gsap.timeline({ scrollTrigger: { trigger: df, start: 'top 88%', end: 'center 45%', scrub: 0.8 } });
        tl3.fromTo(clip, { clipPath: 'circle(16% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', ease: 'none' }, 0)
          .fromTo(img, { scale: 1.45, rotation: -14 }, { scale: 1, rotation: 0, ease: 'none' }, 0);
        gsap.fromTo('.rgr', { rotation: -40 }, { rotation: 20, ease: 'none', scrollTrigger: { trigger: df, start: 'top bottom', end: 'bottom top', scrub: true } });
      }

      /* chapter IV — opening frame */
      var st4 = qs('.chap4__stage');
      if (st4 && !RM) {
        var mob = innerWidth < 900;
        var tl4 = gsap.timeline({ scrollTrigger: { trigger: st4, start: 'top 95%', end: 'top 5%', scrub: 0.6 } });
        tl4.fromTo('.chap4__fig', { clipPath: mob ? 'inset(8% 8% 8% 8%)' : 'inset(16% 26% 16% 26%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
          .fromTo('.chap4__fig img', { scale: 1.32 }, { scale: 1.06, ease: 'none' }, 0);
        gsap.to('.chap4__fig img', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: st4, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.from('.chap4__over > *', { y: 60, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: st4, start: 'top 30%', once: true } });
      }

      /* atelier — engrave initials */
      (function sig() {
        var rows = qsa('.sig__row'), txt = qs('[data-ini-t]'), ser = qs('[data-ser-t]'), cur = qs('[data-sig-cur]');
        if (!rows.length || !txt) return;
        var idx = 0, hover = false, vis = false;
        function engrave(i) {
          idx = i;
          rows.forEach(function (r, j) { r.classList.toggle('is-on', j === i); });
          var r = rows[i];
          txt.textContent = r.dataset.ini; ser.textContent = r.dataset.ser; cur.textContent = r.dataset.ini;
          if (RM) return;
          gsap.killTweensOf(txt);
          gsap.fromTo(txt, { strokeDasharray: 420, strokeDashoffset: 420, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' });
          gsap.to(txt, { fillOpacity: 1, duration: 0.8, delay: 0.9, ease: 'power1.out' });
        }
        rows.forEach(function (r, i) {
          r.addEventListener('mouseenter', function () { hover = true; if (i !== idx) engrave(i); });
          r.addEventListener('mouseleave', function () { hover = false; });
          r.addEventListener('focus', function () { if (i !== idx) engrave(i); });
          r.addEventListener('click', function () { if (i !== idx) engrave(i); });
        });
        ST.create({ trigger: '.sig', start: 'top 70%', end: 'bottom 30%', onToggle: function (s) { vis = s.isActive; }, onEnter: function () { engrave(idx); } });
        setInterval(function () { if (vis && !hover && !d.hidden) engrave((idx + 1) % rows.length); }, 4200);
      })();

      hashJump();
    });
  }

  /* chapter II — extras on the horizontal track (desktop only; called by core inside matchMedia) */
  Core.onHScroll = function (sec, tw) {
    var st = tw.scrollTrigger; if (st) st.refreshPriority = 1;
    var bar = qs('.mv__bar i b', sec), cnt = qs('.mv__count b', sec), panels = qsa('.mv__panel', sec);
    Core.onTick(function () {
      if (!st) return;
      bar.style.transform = 'scaleX(' + st.progress.toFixed(4) + ')';
      var n = Math.min(panels.length, Math.floor(st.progress * (panels.length - 0.0001)) + 1);
      cnt.textContent = pad(n);
    });
    qsa('.mv__img', sec).forEach(function (m) {
      var img = qs('img', m);
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: m, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      var early = m.getBoundingClientRect().left - sec.getBoundingClientRect().left < innerWidth * 0.9;
      gsap.fromTo(m, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: early ? { trigger: sec, start: 'top 55%' } : { trigger: m, containerAnimation: tw, start: 'left 88%', toggleActions: 'play none none none' } });
    });
    if (qs('.train__key', sec)) gsap.from(qsa('.train__key li', sec), { autoAlpha: 0, x: 30, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: qs('.mv__train', sec), containerAnimation: tw, start: 'left 70%' } });
    if (qs('.mv__nums', sec)) gsap.from(qsa('.mv__nums div', sec), { autoAlpha: 0, y: 40, duration: 1.1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: qs('.mv__nums', sec), containerAnimation: tw, start: 'left 80%' } });
  };

  /* ───────── turntable ───────── */
  function turntable() {
    var sec = qs('.tt'); if (!sec) return;
    var stage = qs('.tt__stage', sec), cv = qs('.tt__cv', sec), ctx = cv.getContext('2d');
    var calls = qsa('.tt__call', sec), items = qsa('.tt__index li', sec), deg = qs('.tt__deg', sec), fr = qs('.tt__fr b', sec), ruler = qs('.tt__ruler', sec);
    var N = 24, imgs = [], loaded = 0, cur = 12, target = 12, shown = -1, ticks = [];
    for (var i = 0; i < N; i++) { var t = d.createElement('i'); ruler.appendChild(t); ticks.push(t); }
    if (RM) { update(12); return; }
    for (i = 0; i < N; i++) {
      var im = new Image(); im.decoding = 'async';
      im.onload = function () { if (++loaded === N) { sec.classList.add('is-live'); size(); } };
      im.src = 'frames/w' + pad(i) + '.webp'; imgs.push(im);
    }
    function size() {
      var r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      draw(cur);
    }
    function draw(f) {
      if (loaded < N || !cv.width) return;
      var W = cv.width, a = Math.floor(f), b = Math.min(N - 1, a + 1), k = f - a;
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, W);
      ctx.drawImage(imgs[a], 0, 0, W, W);
      if (k > 0.01) { ctx.globalAlpha = k; ctx.drawImage(imgs[b], 0, 0, W, W); ctx.globalAlpha = 1; }
      ctx.globalCompositeOperation = 'screen';
      var g = ctx.createRadialGradient(W * 0.4, W * 0.28, 0, W * 0.4, W * 0.28, W * 0.62);
      g.addColorStop(0, 'rgba(216,199,159,.16)'); g.addColorStop(1, 'rgba(216,199,159,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, W);
      ctx.globalCompositeOperation = 'destination-in';
      var m = ctx.createRadialGradient(W / 2, W / 2, W * 0.34, W / 2, W / 2, W * 0.5);
      m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = m; ctx.fillRect(0, 0, W, W);
      ctx.globalCompositeOperation = 'source-over';
    }
    function update(f) {
      var n = Math.round(f); if (n === shown) return; shown = n;
      calls.forEach(function (c) { c.classList.toggle('is-on', n >= +c.dataset.from && n <= +c.dataset.to); });
      var act = -1; calls.forEach(function (c) { if (c.classList.contains('is-on')) act = +c.dataset.k; });
      items.forEach(function (li) { li.classList.toggle('is-on', +li.dataset.k === act); });
      ticks.forEach(function (t, j) { t.classList.toggle('is-on', j === n); });
      var dg = (n - 12) * 6; deg.textContent = (dg < 0 ? '–' : dg > 0 ? '+' : '') + Math.abs(dg) + '°';
      fr.textContent = pad(n + 1);
    }
    update(12);
    var mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', function () {
      ST.create({ trigger: sec, pin: true, start: 'top top', end: '+=240%', refreshPriority: 2, anticipatePin: 1, onUpdate: function (s) { target = s.progress * (N - 1); } });
    });
    mm.add('(max-width: 899px)', function () {
      ST.create({ trigger: stage, start: 'top 80%', end: 'bottom 25%', onUpdate: function (s) { target = s.progress * (N - 1); } });
    });
    ST.sort();
    Core.onTick(function () {
      if (Math.abs(target - cur) < 0.002) return;
      cur += (target - cur) * 0.16;
      draw(cur); update(cur);
    });
    addEventListener('resize', function () { if (loaded === N) size(); });
  }

  /* ═════════════════════ COLLECTION ═════════════════════ */
  if (PAGE === 'collection') {
    var T = {
      midnight: { ref: 'M1-01', name: 'Midnight', alloc: 120, sub: 'Blue-black lacquer over a sunray-brushed brass blank, with applied gold indices. It reads black indoors and blue at the window.', dial: 'Blue-black lacquer, sunray-brushed, applied gold indices', hands: 'Gold-plated batons, diamond-cut', strap: 'Black calfskin, steel pin buckle' },
      graphite: { ref: 'M1-02', name: 'Graphite', alloc: 100, sub: 'A cool grey lacquer with rhodium indices and a gold seconds hand. The quietest of the three, and the easiest to read at a glance.', dial: 'Grey lacquer, sunray-brushed, applied rhodium indices', hands: 'Rhodium-plated batons, diamond-cut', strap: 'Grey suede, steel pin buckle' },
      salmon: { ref: 'M1-03', name: 'Salmon', alloc: 80, sub: 'A warm copper-pink lacquer mixed to a recipe from the 1940s, with dark ruthenium indices. Made in the smallest numbers of the three.', dial: 'Salmon lacquer, sunray-brushed, applied ruthenium indices', hands: 'Ruthenium-plated batons, diamond-cut', strap: 'Tobacco calfskin, steel pin buckle' }
    };
    var h0 = (location.hash || '').slice(1), curT = T[h0] ? h0 : 'midnight', busy = false;
    var layers = qsa('.cfg__layer'), sws = qsa('.sw__b'), nameIn = qs('.cfg__nameIn'), preT = qs('.cfg__layer[data-tone="' + curT + '"] .cfg__dialW');
    if (preT) { preT.setAttribute('data-pre-target', ''); preT.dataset.tone = curT; }
    layers.forEach(function (l) { l.classList.toggle('is-on', l.dataset.tone === curT); });

    function fill(t, anim) {
      var o = T[t];
      qsa('[data-f]').forEach(function (e) {
        var k = e.dataset.f, v = k === 'btn' ? 'Reserve ' + o.ref + ' ' + o.name : k === 'alloc' ? String(o.alloc) : o[k];
        if (v == null || e === nameIn) return;
        if (!anim || RM) { e.textContent = v; return; }
        gsap.to(e, { autoAlpha: 0, y: -8, duration: 0.25, ease: 'power2.in', onComplete: function () { e.textContent = v; gsap.fromTo(e, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' }); } });
      });
      qsa('[data-v]').forEach(function (e) { var v = o[e.dataset.v]; if (!anim || RM) { e.textContent = v; return; } gsap.to(e, { autoAlpha: 0, duration: 0.25, onComplete: function () { e.textContent = v; gsap.to(e, { autoAlpha: 1, duration: 0.6 }); } }); });
      var bar = qs('.cfg__bar b'); if (bar) bar.style.width = (o.alloc / 3) + '%';
      sws.forEach(function (b) { var on = b.dataset.tone === t; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
      var radio = qs('.rref input[value="' + t + '"]'); if (radio) radio.checked = true;
      if (anim && !RM) gsap.fromTo('.spec__row', { '--sx': 0 }, { '--sx': 1, duration: 1.1, ease: 'expo.inOut', stagger: 0.035 });
    }
    function select(t, focusBtn) {
      if (t === curT || busy || !T[t]) return;
      var from = qs('.cfg__layer[data-tone="' + curT + '"]'), to = qs('.cfg__layer[data-tone="' + t + '"]');
      curT = t; fill(t, true);
      try { history.replaceState(null, '', '#' + t); } catch (e) {}
      if (RM) { layers.forEach(function (l) { l.classList.toggle('is-on', l === to); }); return; }
      busy = true;
      var st = qs('.cfg__stage'), w = qs('.cfg__dialW', to), sr = st.getBoundingClientRect(), wr = w.getBoundingClientRect();
      var cx = wr.left - sr.left + wr.width / 2, cy = wr.top - sr.top + wr.height / 2, R = Math.hypot(Math.max(cx, sr.width - cx), Math.max(cy, sr.height - cy)) + 10;
      to.classList.add('is-in');
      gsap.fromTo(to, { clipPath: 'circle(0px at ' + cx + 'px ' + cy + 'px)' }, { clipPath: 'circle(' + R + 'px at ' + cx + 'px ' + cy + 'px)', duration: 1.25, ease: 'expo.inOut', onComplete: function () {
        to.classList.add('is-on'); to.classList.remove('is-in'); from.classList.remove('is-on'); gsap.set(to, { clearProps: 'clipPath' }); busy = false;
      } });
      gsap.fromTo(qs('.cfg__dial', to), { rotation: -22, scale: 0.9 }, { rotation: 0, scale: 1, duration: 1.5, ease: 'expo.out' });
      gsap.to(nameIn, { yPercent: -110, duration: 0.45, ease: 'expo.in', onComplete: function () { nameIn.textContent = T[t].name; gsap.fromTo(nameIn, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }); } });
    }
    nameIn.textContent = T[curT].name;
    fill(curT, false);
    sws.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b.dataset.tone); });
      b.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!k) return; e.preventDefault(); var n = sws[(i + k + sws.length) % sws.length]; n.focus(); select(n.dataset.tone);
      });
    });
    qsa('.rref input').forEach(function (r) { r.addEventListener('change', function () { if (r.checked) select(r.value); }); });

    /* form success */
    var form = qs('.rsv__form');
    if (form) {
      form.addEventListener('demo:sent', function () {
        var o = T[curT], fd = new FormData(form);
        qs('[data-sum=ref]').textContent = o.ref + ' · ' + o.name;
        qs('[data-sum=name]').textContent = (fd.get('name') || '').toString().trim();
        qs('[data-sum=country]').textContent = (fd.get('country') || '').toString();
        var ini = (fd.get('initials') || '').toString().trim().toUpperCase();
        qs('[data-sum=ini]').textContent = ini || 'None';
        if (!RM) {
          gsap.fromTo('.rsv__seal circle, .rsv__seal path', { strokeDasharray: 300, strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.25 });
          gsap.from('.rsv__ok > *:not(.rsv__seal)', { y: 24, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.2 });
        }
      });
      var again = qs('.rsv__again');
      if (again) again.addEventListener('click', function () {
        form.reset(); form.classList.remove('is-sent'); fill(curT, false);
        qsa('[data-ok]', form).forEach(function (x) { x.hidden = true; }); qsa('[data-ok-hide]', form).forEach(function (x) { x.hidden = false; });
        ST.refresh();
      });
    }

    /* faq */
    qsa('.faq__q').forEach(function (b) {
      b.addEventListener('click', function () {
        var it = b.closest('.faq__it'), open = !it.classList.contains('is-open');
        it.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
        setTimeout(function () { ST.refresh(); }, 750);
      });
    });

    if (!RM) {
      var info = qsa('.cfg__info > *');
      gsap.set(info, { autoAlpha: 0, y: 22 });
      gsap.set(nameIn, { yPercent: 110 });
    }
    Core.onReady(function () {
      if (!RM) {
        gsap.to(info, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07, delay: 0.2 });
        gsap.to(nameIn, { yPercent: 0, duration: 1.4, ease: 'expo.out', delay: 0.35 });
        gsap.from('.cfg__lab, .cfg__size', { autoAlpha: 0, duration: 1.2, delay: 0.6 });
        ST.create({ trigger: '.spec__grid', start: 'top 85%', once: true, onEnter: function () { gsap.fromTo('.spec__row', { '--sx': 0 }, { '--sx': 1, duration: 1.4, ease: 'expo.inOut', stagger: 0.04 }); } });
        gsap.set('.spec__row', { '--sx': 0 });
      }
      numeralSweep();
      hashJump();
    });
  }
  /* ═════════════════════ EXPANSION: shared helpers ═════════════════════ */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeIO(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function introFade(sel, delay) {
    var els = qsa(sel); if (!els.length || RM) return;
    gsap.set(els, { autoAlpha: 0, y: 14 });
    Core.onReady(function () { gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: delay == null ? 0.5 : delay }); });
  }
  function faqInit() {
    qsa('.faq__q').forEach(function (b) {
      b.addEventListener('click', function () {
        var it = b.closest('.faq__it'), open = !it.classList.contains('is-open');
        it.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
        setTimeout(function () { ST.refresh(); }, 750);
      });
    });
  }

  /* ═════════════════════ ATELIER ═════════════════════ */
  if (PAGE === 'atelier') {
    introFade('.ah__meta p');

    /* the clock that follows the day */
    (function clock() {
      var svg = qs('.day__face'); if (!svg) return;
      var s = '<circle class="ring" cx="200" cy="200" r="198"/><circle class="ring" cx="200" cy="200" r="170"/><circle class="prog" cx="200" cy="200" r="198" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>';
      for (var i = 0; i < 60; i++) { var a = polar(i % 5 ? 156 : 148, i * 6), b = polar(162, i * 6); s += '<path class="' + (i % 5 ? 'tk' : 'tk5') + '" d="M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1] + '"/>'; }
      [[0, '12'], [90, '3'], [180, '6'], [270, '9']].forEach(function (n) { var p = polar(120, n[0]); s += '<text class="nm" x="' + p[0] + '" y="' + (p[1] + 8) + '">' + n[1] + '</text>'; });
      s += '<g class="hh"><path d="M196.4 216 L200 104 L203.6 216Z"/></g><g class="hm"><path d="M197.6 220 L200 44 L202.4 220Z"/></g><circle class="cap" cx="200" cy="200" r="4.4"/>';
      svg.innerHTML = s;
      var items = qsa('.dy'), T = items.map(function (n) { return +n.dataset.t; });
      var out = qs('[data-clock]'), hh = qs('.hh', svg), hm = qs('.hm', svg), pr = qs('.prog', svg);
      var cur = T[0], tgt = T[0], act = -1, lastTxt = '', lastY = -1, vis = false;
      ST.create({ trigger: '.day', start: 'top bottom', end: 'bottom top', onToggle: function (st) { vis = st.isActive; } });
      function put(t) {
        var m = Math.round(t), txt = pad(Math.floor(m / 60)) + ':' + pad(m % 60);
        if (txt !== lastTxt) { lastTxt = txt; out.textContent = txt; }
        hh.setAttribute('transform', 'rotate(' + (((t / 60) % 12) * 30).toFixed(2) + ' 200 200)');
        hm.setAttribute('transform', 'rotate(' + ((t % 60) * 6).toFixed(2) + ' 200 200)');
        pr.setAttribute('stroke-dashoffset', (1 - clamp((t - T[0]) / (T[T.length - 1] - T[0]), 0, 1)).toFixed(4));
      }
      put(cur);
      Core.onTick(function (y) {
        if (!vis) return;
        var mid = innerHeight * 0.5, cs = items.map(function (n) { var r = n.getBoundingClientRect(); return r.top + r.height / 2; }), i = 0, best = 0, bd = 1e9;
        while (i < cs.length - 1 && cs[i + 1] <= mid) i++;
        if (mid <= cs[0]) tgt = T[0]; else if (i >= cs.length - 1) tgt = T[T.length - 1]; else tgt = T[i] + (T[i + 1] - T[i]) * clamp((mid - cs[i]) / (cs[i + 1] - cs[i]), 0, 1);
        cs.forEach(function (c, j) { var dd = Math.abs(c - mid); if (dd < bd) { bd = dd; best = j; } });
        if (best !== act) { act = best; items.forEach(function (n, j) { n.classList.toggle('is-on', j === act); }); }
        if (Math.abs(tgt - cur) > 0.01) { cur += (tgt - cur) * 0.12; put(cur); }
      });
    })();

    /* materials filter */
    (function filter() {
      var chips = qsa('.chip'), rows = qsa('.tr:not(.tr--h)');
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          var f = c.dataset.f, vis = [];
          chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
          rows.forEach(function (r) { var show = f === 'all' || r.dataset.g === f; r.hidden = !show; if (show) vis.push(r); });
          if (!RM) gsap.fromTo(vis, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.03, overwrite: true });
          ST.refresh();
        });
      });
    })();

    Core.onReady(function () { numeralSweep(); hashJump(); });
  }

  /* ═════════════════════ SERVICE ═════════════════════ */
  if (PAGE === 'service') {
    introFade('.sv0__top p, .sv0__foot > *', 0.7);
    var sax = qs('.sv0__axis'); if (sax && !RM) gsap.from(sax, { scaleY: 0, duration: 2.4, ease: 'expo.inOut', delay: 0.4 });
    faqInit();

    (function stages() {
      var svg = qs('.svs'); if (!svg) return;
      var sec = qs('.svd'), nEl = qs('[data-n]'), hEl = qs('[data-h]'), pEl = qs('[data-p]'), xEl = qs('[data-x]'), wEl = qs('[data-w]');
      var rail = qsa('.svd__rail li'), barB = qs('.svd__bar b'), read = qs('.svd__read'), rl = qs('[data-rl]'), rv = qs('[data-rv]');
      var S = [
        { h: 'Reception', w: 'Week 1', p: 'Before anything is opened, the watch is photographed and its rate recorded in five positions. What it does on arrival tells us more than anything you could write on the form.', x: '' },
        { h: 'Disassembly', w: 'Weeks 1 – 2', p: 'Strap and case come away first, then the movement is taken apart to its 142 components. Each goes into its own compartment of a numbered tray, so that every screw returns to the hole it came from.', x: '' },
        { h: 'Cleaning', w: 'Week 3', p: 'A wash, two rinses and a warm-air dry in the machine. Then each pivot is cleaned by hand, and each jewel with a stick of pegwood whittled that morning.', x: '' },
        { h: 'Inspection', w: 'Weeks 3 – 4', p: 'Under 10× every pivot, tooth and pallet stone is measured against the drawing. The mainspring is replaced as a matter of course; anything else only if it is worn past tolerance.', x: '<ol><li><span>1</span>Mainspring, replaced</li><li><span>2</span>Fourth-wheel pivot, polished by 0.01 mm</li><li><span>3</span>Pallet stones, within tolerance</li></ol>' },
        { h: 'Reassembly', w: 'Weeks 5 – 7', p: 'The movement goes back together on the same bench, in the reverse order. Oil goes on last: a drop of about 0.2 mm at each of the seventeen jewels, at the pallet stones and in the barrel.', x: '' },
        { h: 'Regulation', w: 'Weeks 8 – 10', p: 'Seven days on the timing bench in five positions, until the rate is back within −2 / +4 seconds a day. The watchmaker engraves a service mark beside their initials, and the watch goes home with the parts we replaced.', x: '' }
      ];
      var C = [300, 300];
      var P = { barrel: [190, 340, 96], center: [318, 250, 60], third: [422, 232, 46], fourth: [483, 293, 40], esc: [460, 355, 26], bal: [350, 448, 70] };
      var EX = { barrel: [-70, 50], center: [-30, -80], third: [20, -100], fourth: [80, -50], esc: [95, 35], pallet: [60, 80], bal: [10, 80], b1: [-95, -95], b2: [70, -125], b3: [-85, 100] };
      function gearD(cx, cy, r, n, dep) {
        var dd = '', st = Math.PI * 2 / n, ri = r - dep;
        for (var i = 0; i < n; i++) {
          var a = i * st, pts = [[ri, a], [ri, a + st * 0.12], [r, a + st * 0.3], [r, a + st * 0.58], [ri, a + st * 0.76]];
          pts.forEach(function (p, j) { dd += (i === 0 && j === 0 ? 'M' : 'L') + r2(cx + p[0] * Math.cos(p[1])) + ' ' + r2(cy + p[0] * Math.sin(p[1])); });
        }
        return dd + 'Z';
      }
      function circ(cx, cy, r, cls) { return '<circle class="dr ' + cls + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
      function wheel(k, n, spokes, pr) {
        var p = P[k], x = p[0], y = p[1], r = p[2];
        var s = '<g class="part" data-k="' + k + '"><path class="dr g" d="' + gearD(x, y, r, n, Math.max(2.4, r * 0.06)) + '"/>' + circ(x, y, r2(r * 0.84), 'gs');
        for (var i = 0; i < spokes; i++) { var a = i * Math.PI * 2 / spokes + 0.3; s += '<path class="dr gs" d="M' + r2(x + r * 0.2 * Math.cos(a)) + ' ' + r2(y + r * 0.2 * Math.sin(a)) + 'L' + r2(x + r * 0.84 * Math.cos(a)) + ' ' + r2(y + r * 0.84 * Math.sin(a)) + '"/>'; }
        s += circ(x, y, r2(r * 0.2), 'gs') + '<path class="dr gf" d="' + gearD(x, y, r2(r * 0.17), 8, r2(r * 0.05)) + '"/>' + circ(x, y, 2.6, 'jw') + '</g>';
        return s;
      }
      function cap(x1, y1, x2, y2, r) {
        var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l * r, ny = dx / l * r;
        return 'M' + r2(x1 + nx) + ' ' + r2(y1 + ny) + 'L' + r2(x2 + nx) + ' ' + r2(y2 + ny) + 'A' + r + ' ' + r + ' 0 0 0 ' + r2(x2 - nx) + ' ' + r2(y2 - ny) + 'L' + r2(x1 - nx) + ' ' + r2(y1 - ny) + 'A' + r + ' ' + r + ' 0 0 0 ' + r2(x1 + nx) + ' ' + r2(y1 + ny) + 'Z';
      }
      function screw(x, y, a) { return circ(x, y, 7, 'sc') + '<path class="dr gs" d="M' + r2(x - 4.6 * Math.cos(a)) + ' ' + r2(y - 4.6 * Math.sin(a)) + 'L' + r2(x + 4.6 * Math.cos(a)) + ' ' + r2(y + 4.6 * Math.sin(a)) + '"/>'; }
      var s = '';
      /* case */
      s += '<g class="case-g">' + circ(C[0], C[1], 288, 'case') + circ(C[0], C[1], 272, 'case') + '<path class="dr case" d="M588 286h22v28h-22M594 286v28M600 286v28M606 286v28"/>';
      s += circ(C[0], C[1], 240, 'plate') + '</g>';
      /* barrel */
      var bp = P.barrel, sp = '';
      for (var i = 0; i <= 240; i++) { var a = i / 240 * Math.PI * 11, rr = 20 + i / 240 * 66; sp += (i ? 'L' : 'M') + r2(bp[0] + rr * Math.cos(a)) + ' ' + r2(bp[1] + rr * Math.sin(a)); }
      s += '<g class="part" data-k="barrel"><path class="dr g" d="' + gearD(bp[0], bp[1], bp[2], 72, 4) + '"/>' + circ(bp[0], bp[1], 90, 'gs') + '<path class="dr gs" d="' + sp + '"/><rect class="dr gf" x="' + (bp[0] - 9) + '" y="' + (bp[1] - 9) + '" width="18" height="18"/></g>';
      s += wheel('center', 60, 5, 1) + wheel('third', 48, 4, 1) + wheel('fourth', 42, 4, 1);
      /* escape wheel + pallet */
      var ep = P.esc, ew = '';
      for (i = 0; i < 15; i++) { var b = i * Math.PI * 2 / 15; [[16, 0], [27, 0.1], [26, 0.2], [16, 0.3]].forEach(function (p, j) { ew += (j === 0 ? (i ? 'L' : 'M') : 'L') + r2(ep[0] + p[0] * Math.cos(b + p[1])) + ' ' + r2(ep[1] + p[0] * Math.sin(b + p[1])); }); }
      s += '<g class="part" data-k="esc"><path class="dr g" d="' + ew + 'Z"/>' + circ(ep[0], ep[1], 9, 'gs') + circ(ep[0], ep[1], 2.4, 'jw') + '</g>';
      s += '<g class="part" data-k="pallet"><path class="dr gf" d="M452 376 L462 380 L446 410 L442 424 L364 452 L352 441 L420 412 L436 394Z"/>' + circ(436, 414, 3.4, 'jw') + '</g>';
      /* balance */
      var bl = P.bal, hs = '';
      for (i = 0; i <= 200; i++) { var c = i / 200 * Math.PI * 14, rq = 6 + i / 200 * 36; hs += (i ? 'L' : 'M') + r2(bl[0] + rq * Math.cos(c)) + ' ' + r2(bl[1] + rq * Math.sin(c)); }
      s += '<g class="part" data-k="bal"><path class="dr gs" d="' + hs + '"/><g class="osc">' + circ(bl[0], bl[1], 70, 'g') + circ(bl[0], bl[1], 64, 'gs');
      for (i = 0; i < 3; i++) { var e = i * Math.PI * 2 / 3 - Math.PI / 2; s += '<path class="dr g" d="M' + bl[0] + ' ' + bl[1] + 'L' + r2(bl[0] + 65 * Math.cos(e)) + ' ' + r2(bl[1] + 65 * Math.sin(e)) + '"/>'; }
      for (i = 0; i < 8; i++) { var f = i * Math.PI / 4 + 0.2; s += circ(r2(bl[0] + 70 * Math.cos(f)), r2(bl[1] + 70 * Math.sin(f)), 2.8, 'gf'); }
      s += '</g>' + circ(bl[0], bl[1], 3, 'jw') + '</g>';
      /* bridges */
      var b1 = P.barrel, b1c = P.center;
      s += '<g class="part" data-k="b1"><path class="dr br" d="' + cap(b1[0], b1[1], b1c[0], b1c[1], 30) + '"/>' + circ(b1[0], b1[1], 78, 'br') + circ(b1[0], b1[1], 4, 'jw') + circ(b1c[0], b1c[1], 4, 'jw') + screw(b1c[0] + 6, b1c[1] - 6, 0.5) + screw(b1[0] - 52, b1[1] - 52, 2.2) + screw(b1[0] + 30, b1[1] + 70, 1.1);
      s += '<text class="ini" x="' + (b1[0] - 2) + '" y="' + (b1[1] + 30) + '" text-anchor="middle" data-ini>A.V.</text><text class="lbl" x="' + (b1[0] - 2) + '" y="' + (b1[1] + 48) + '" text-anchor="middle" data-ini2>M1 · 0611 · S1</text></g>';
      s += '<g class="part" data-k="b2"><path class="dr br" d="' + cap(P.third[0], P.third[1], P.fourth[0], P.fourth[1], 24) + '"/><path class="dr br" d="' + cap(P.fourth[0], P.fourth[1], P.esc[0], P.esc[1], 19) + '"/>' + circ(P.third[0], P.third[1], 3.6, 'jw') + circ(P.fourth[0], P.fourth[1], 3.6, 'jw') + circ(P.esc[0], P.esc[1], 3, 'jw') + screw(P.third[0] - 10, P.third[1] - 14, 0.9) + screw(P.fourth[0] + 14, P.fourth[1] - 12, 2) + '</g>';
      s += '<g class="part" data-k="b3"><path class="dr br" d="' + cap(P.bal[0], P.bal[1], 278, 510, 24) + '"/>' + circ(P.bal[0], P.bal[1], 4, 'jw') + screw(284, 506, 0.4) + screw(P.bal[0] + 26, P.bal[1] - 24, 1.3) + '</g>';
      /* dynamic layers */
      var oilPts = [[190, 340], [318, 250], [422, 232], [483, 293], [460, 355], [350, 448], [436, 414], [190, 300], [318, 290], [422, 270], [483, 330], [350, 420]];
      s += '<g class="oils">';
      oilPts.forEach(function (p, i) { s += '<circle class="oil" cx="' + p[0] + '" cy="' + p[1] + '" r="2.2" data-i="' + i + '"/>'; });
      s += '</g><g class="bubs">';
      var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      for (i = 0; i < 18; i++) { var q = rnd(), ang = rnd() * 6.283, rad = 40 + rnd() * 190; s += '<circle class="bub" cx="' + r2(300 + Math.cos(ang) * rad) + '" cy="' + r2(300 + Math.sin(ang) * rad * .9) + '" r="' + r2(2 + q * 6) + '" data-s="' + r2(0.5 + rnd()) + '"/>'; }
      s += '</g><g class="marks">';
      [[1, 'barrel'], [2, 'fourth'], [3, 'pallet']].forEach(function (m) { s += '<g class="mk" data-m="' + m[1] + '"><circle r="11"/><text y="3.2">' + m[0] + '</text></g>'; });
      s += '</g><g class="lens"><circle class="lp" r="38"/><path class="lp" d="M-38 0h24M14 0h24M0 -38v24M0 14v24"/><path class="lp" d="M27 27l30 30" stroke-width="3"/></g>';
      svg.innerHTML = s;
      svg.dataset.stage = '0';

      var drs = qsa('.dr', svg), parts = {}; qsa('.part', svg).forEach(function (g) { parts[g.dataset.k] = g; });
      drs.forEach(function (e) { e.setAttribute('pathLength', '1'); e.style.strokeDasharray = '1'; e.style.strokeDashoffset = '1'; });
      var fills = drs.filter(function (e) { return /(gf|br|jw|sc)/.test(e.getAttribute('class')); });
      var oils = qsa('.oil', svg), bubs = qsa('.bub', svg), marks = qsa('.mk', svg), lens = qs('.lens', svg), ini = qs('[data-ini]', svg), ini2 = qs('[data-ini2]', svg);
      var pivots = { barrel: [P.barrel[0] + EX.barrel[0], P.barrel[1] + EX.barrel[1]], fourth: [P.fourth[0] + EX.fourth[0], P.fourth[1] + EX.fourth[1]], pallet: [436 + EX.pallet[0], 414 + EX.pallet[1]] };
      var N = drs.length;

      var cur = -1, p = 0, target = 0;
      function fillText(i) {
        var o = S[i];
        nEl.textContent = pad(i + 1); hEl.textContent = o.h; pEl.textContent = o.p; wEl.textContent = o.w; xEl.innerHTML = o.x;
        read.classList.toggle('is-off', !(i === 0 || i === 5));
        rl.textContent = i === 5 ? 'Rate on departure' : 'Rate on arrival';
      }
      var tweenEls = [nEl, hEl, pEl, xEl, wEl];
      function setStage(i) {
        if (i === cur) return;
        var first = cur < 0; cur = i;
        svg.dataset.stage = String(i);
        rail.forEach(function (li, j) { li.classList.toggle('is-on', j === i); li.classList.toggle('is-done', j < i); });
        if (first || RM) { fillText(i); return; }
        gsap.killTweensOf(tweenEls);
        gsap.to(tweenEls, { autoAlpha: 0, y: -8, duration: 0.18, ease: 'power2.in', onComplete: function () { fillText(cur); gsap.fromTo(tweenEls, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 }); } });
      }
      function render(v) {
        var f = clamp(v, 0, 0.9999) * 6, st = Math.floor(f), loc = f - st;
        setStage(st);
        barB.style.transform = 'scaleX(' + v.toFixed(4) + ')';
        /* draw-in during stage 0 */
        var dr = st === 0 ? clamp(loc / 0.8, 0, 1) : 1;
        drs.forEach(function (el, i) { var s0 = (i / N) * 0.6, l = clamp((dr - s0) / 0.4, 0, 1); el.style.strokeDashoffset = (1 - l).toFixed(3); });
        fills.forEach(function (el, i) { el.style.fillOpacity = dr >= 1 ? '' : String(clamp((dr - 0.55) / 0.45, 0, 1)); });
        /* explode factor */
        var e = st === 1 ? easeIO(loc) : st === 2 || st === 3 ? 1 : st === 4 ? 1 - easeIO(clamp(loc / 0.62, 0, 1)) : 0;
        for (var k in parts) { var o = EX[k]; if (!o) continue; var ee = k.charAt(0) === 'b' && k.length === 2 ? e : e; parts[k].setAttribute('transform', e ? 'translate(' + (o[0] * ee).toFixed(2) + ' ' + (o[1] * ee).toFixed(2) + ')' : ''); }
        /* bubbles (cleaning) */
        var bo = st === 2 ? Math.sin(Math.PI * clamp(loc, 0, 1)) : 0;
        bubs.forEach(function (b, i) { var sp = +b.dataset.s; b.style.opacity = (bo * (0.35 + 0.65 * ((i % 3) / 2))).toFixed(3); b.setAttribute('transform', 'translate(0 ' + (-loc * 120 * sp).toFixed(1) + ')'); });
        /* inspection: loupe travels between three marks */
        var lo = st === 3;
        if (lo) {
          var pts = [[300, 300], pivots.barrel, pivots.fourth, pivots.pallet], t = loc * 3, sg = Math.min(2, Math.floor(t)), q = easeIO(clamp((t - sg) / 0.7, 0, 1));
          lens.setAttribute('transform', 'translate(' + lerp(pts[sg][0], pts[sg + 1][0], q).toFixed(1) + ' ' + lerp(pts[sg][1], pts[sg + 1][1], q).toFixed(1) + ')');
        }
        lens.style.opacity = lo ? '1' : '0';
        marks.forEach(function (m, i) { var pv = pivots[m.dataset.m], show = st === 3 && loc * 3 >= i + 0.65; m.setAttribute('transform', 'translate(' + pv[0] + ' ' + (pv[1] - 26) + ')'); m.style.opacity = show ? '1' : '0'; });
        /* oiling */
        var oo = st === 4 ? clamp((loc - 0.62) / 0.3, 0, 1) : st > 4 ? 1 : 0;
        oils.forEach(function (o, i) { o.style.opacity = oo ? String(clamp(oo * 2 - i * 0.05, 0, 1)) : '0'; o.setAttribute('r', (2.2 * oo + 0.001).toFixed(2)); });
        /* regulation */
        var rg = st === 5 ? loc : 0, rate = st === 5 ? lerp(-11, 1.6, easeIO(clamp(loc / 0.72, 0, 1))) : -11;
        rv.textContent = (rate < 0 ? '−' : '+') + Math.abs(rate).toFixed(1);
        var ig = st === 5 ? clamp((loc - 0.2) / 0.55, 0, 1) : 0;
        ini.style.strokeDasharray = '240'; ini.style.strokeDashoffset = String(240 * (1 - ig)); ini.style.fillOpacity = String(clamp((ig - 0.6) / 0.4, 0, 1)); ini2.style.opacity = String(clamp((ig - 0.7) / 0.3, 0, 1));
        if (st < 5) { ini.style.opacity = '0'; ini2.style.opacity = '0'; } else ini.style.opacity = '1';
      }
      render(0);
      if (RM) { render(0.999); return; }
      ST.create({ trigger: sec, pin: true, start: 'top top', end: '+=480%', anticipatePin: 1, onUpdate: function (s) { target = s.progress; } });
      Core.onTick(function () {
        var dd = target - p;
        if (Math.abs(dd) < 0.0003) { if (p !== target) { p = target; render(p); } return; }
        p += dd * 0.16; render(p);
      });
    })();
  }

  /* ═════════════════════ JOURNAL ═════════════════════ */
  if (PAGE === 'journal') {
    introFade('.jh__k span', 0.6);
    var jlist = qs('.jx__list'), jits = qsa('.jx__it'), pv = qs('.jx__pv'), pimgs = qsa('img', pv);
    jits.forEach(function (it, i) {
      var btn = qs('button.jx__row', it);
      if (btn) btn.addEventListener('click', function () {
        var open = !it.classList.contains('is-open');
        it.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open));
        if (pv) pv.classList.toggle('is-on', !open && it.matches(':hover'));
        setTimeout(function () { ST.refresh(); }, 850);
      });
    });
    if (pv && Core.FINE) {
      var W = pv.offsetWidth, H = pv.offsetHeight, lx = 0;
      var xt = gsap.quickTo(pv, 'x', { duration: 0.8, ease: 'power3' }), yt = gsap.quickTo(pv, 'y', { duration: 0.8, ease: 'power3' }), rt = gsap.quickTo(pv, 'rotation', { duration: 0.9, ease: 'power3' });
      gsap.set(pv, { x: -400, y: -400 });
      jlist.addEventListener('mousemove', function (e) {
        var x = e.clientX + 40; if (x + W > innerWidth - 12) x = e.clientX - W - 40;
        xt(x); yt(clamp(e.clientY - H / 2, 12, innerHeight - H - 12)); rt(clamp((e.clientX - lx) * 0.35, -7, 7)); lx = e.clientX;
      });
      jits.forEach(function (it, i) {
        it.addEventListener('mouseenter', function () {
          pimgs.forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
          pv.classList.toggle('is-on', !it.classList.contains('is-open'));
          jlist.classList.add('is-hov'); jits.forEach(function (n) { n.classList.toggle('is-hot', n === it); });
        });
        it.addEventListener('mouseleave', function () { pv.classList.remove('is-on'); jlist.classList.remove('is-hov'); jits.forEach(function (n) { n.classList.remove('is-hot'); }); });
      });
      addEventListener('resize', function () { W = pv.offsetWidth; H = pv.offsetHeight; });
    }
    /* reading progress */
    var rbar = qs('.rd__prog i b'), rpct = qs('[data-pct]');
    if (rbar) ST.create({ trigger: '.rd__body', start: 'top 65%', end: 'bottom 55%', onUpdate: function (s) { rbar.style.transform = 'scaleX(' + s.progress.toFixed(4) + ')'; rpct.textContent = Math.round(s.progress * 100); } });
    Core.onReady(function () { hashJump(); });
  }
})();
