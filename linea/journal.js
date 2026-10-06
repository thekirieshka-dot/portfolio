/* ───────── LINEA — journal.js: notes accordion + sun-path read ───────── */
(function () {
  'use strict';
  var LAT = 55.7 * Math.PI / 180, RAD = Math.PI / 180;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function smooth(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function sunPos(declDeg, hour) {
    var dl = declDeg * RAD, H = (hour - 12) * 15 * RAD;
    var sa = Math.sin(LAT) * Math.sin(dl) + Math.cos(LAT) * Math.cos(dl) * Math.cos(H);
    var alt = Math.asin(clamp(sa, -1, 1));
    var ca = (Math.sin(dl) - Math.sin(alt) * Math.sin(LAT)) / (Math.cos(alt) * Math.cos(LAT));
    var az = Math.acos(clamp(ca, -1, 1));
    if (H > 0) az = 2 * Math.PI - az;
    return { alt: alt, az: az };
  }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function hhmm(h) { var m = Math.round(h * 60), hh = Math.floor(m / 60) % 24, mm = m % 60; return ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2); }

  window.initJournal = function () {
    var gsap = window.gsap, ST = window.ScrollTrigger, qs = Core.qs, qsa = Core.qsa, d = document, RM = Core.RM;

    /* ---------- notes accordion ---------- */
    var its = qsa('.jn__it'), cur = null;
    function setOpen(it, on, instant) {
      var p = qs('.jn__p', it), b = qs('.jn__b', it);
      it.classList.toggle('is-open', on); b.setAttribute('aria-expanded', String(on));
      if (on) {
        p.hidden = false;
        if (instant || RM) { p.style.height = 'auto'; return; }
        gsap.fromTo(p, { height: 0 }, { height: 'auto', duration: .95, ease: 'expo.out', onComplete: function () { p.style.height = 'auto'; ST.refresh(); } });
        gsap.fromTo(qsa('.jn__txt > *, .jn__meta div', p), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .06, delay: .15 });
      } else {
        if (instant || RM) { p.hidden = true; p.style.height = '0'; return; }
        gsap.to(p, { height: 0, duration: .7, ease: 'expo.inOut', onComplete: function () { p.hidden = true; ST.refresh(); } });
      }
    }
    its.forEach(function (it) {
      qs('.jn__b', it).addEventListener('click', function () {
        if (cur === it) { setOpen(it, false); cur = null; return; }
        if (cur) setOpen(cur, false);
        setOpen(it, true); cur = it;
      });
    });
    if (its[0]) { setOpen(its[0], true, true); cur = its[0]; }
    if (!RM) {
      gsap.set(its, { autoAlpha: 0, y: 30 });
      ST.batch(its, { start: 'top 94%', once: true, onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08 }); } });
    }
    var rd = qs('.js-read');
    if (rd) rd.addEventListener('click', function (e) { e.preventDefault(); var t = qs('#read'); if (Core.lenis) Core.lenis.scrollTo(t, { duration: 1.6, offset: -10 }); else t.scrollIntoView({ behavior: 'smooth' }); });

    /* ---------- sun path + plan ---------- */
    var svg = qs('svg[data-sun]'); if (!svg) return;
    var chart = qs('.sun-chart', svg), plan = qs('.sun-plan', svg);
    var CX0 = 40, CW = 520, CY0 = 232, CH = 190, AZ0 = 30, AZW = 300;
    function cx(az) { return CX0 + (az - AZ0) / AZW * CW; }
    function cy(alt) { return CY0 - alt / 60 * CH; }
    var h = '';
    [0, 20, 40, 60].forEach(function (a) {
      h += '<path class="grid" d="M' + CX0 + ' ' + cy(a) + 'H' + (CX0 + CW) + '"' + (a ? ' stroke-dasharray="3 5"' : '') + '/>';
      h += '<text class="tx-s" x="' + (CX0 - 8) + '" y="' + (cy(a) + 3) + '" text-anchor="end">' + a + '°</text>';
    });
    [[90, 'E'], [180, 'S'], [270, 'W']].forEach(function (a) {
      h += '<path class="grid" d="M' + cx(a[0]) + ' ' + CY0 + 'V' + (CY0 + 6) + '"/><text class="tx-s" x="' + cx(a[0]) + '" y="' + (CY0 + 20) + '" text-anchor="middle">' + a[1] + ' ' + a[0] + '°</text>';
    });
    var CURVES = [[23.44, 'curve', 'Midsummer'], [0, 'curve curve--eq', 'Equinox'], [-23.44, 'curve curve--mid', 'Midwinter']];
    CURVES.forEach(function (c) {
      var p = '', dots = '', first = true;
      for (var t = 0; t <= 24.001; t += .1) {
        var s = sunPos(c[0], t); if (s.alt < 0) { first = true; continue; }
        var X = cx(s.az / RAD), Y = cy(s.alt / RAD);
        p += (first ? 'M' : 'L') + X.toFixed(1) + ' ' + Y.toFixed(1); first = false;
      }
      h += '<path class="' + c[1] + '" d="' + p + '"/>';
      for (var k = 4; k <= 20; k += 2) { var q = sunPos(c[0], k); if (q.alt > 0) dots += '<circle cx="' + cx(q.az / RAD).toFixed(1) + '" cy="' + cy(q.alt / RAD).toFixed(1) + '" r="1.8" fill="#111"/>'; }
      h += dots;
      var pk = sunPos(c[0], 12);
      h += '<text class="tx-s" x="' + (cx(180) + 12) + '" y="' + (cy(pk.alt / RAD) - 8) + '">' + c[2] + ' ' + Math.round(pk.alt / RAD) + '°</text>';
    });
    h += '<g class="sun-g"><path class="sun-drop" d="" stroke="#2f6bff" stroke-width=".8" stroke-dasharray="2 3" fill="none"/><circle class="sun-ring" r="13"/><circle class="sun-dot" r="6"/></g>';
    h += '<text class="tx-s tx-b js-below" x="' + (CX0 + CW / 2) + '" y="' + (CY0 - 12) + '" text-anchor="middle" opacity="0">Sun below the horizon</text>';
    h += '<text class="tx-s mm" x="' + CX0 + '" y="14">Altitude by azimuth, 55.7° N</text><text class="tx-s mm" x="' + (CX0 + CW) + '" y="14" text-anchor="end">Dots mark every two hours</text>';
    chart.innerHTML = h;
    var sunG = qs('.sun-g', chart), drop = qs('.sun-drop', chart), below = qs('.js-below', chart);

    /* plan */
    var PX = 62, RW = 5.6, RD = 4.2, X0 = 90, YS = 260;
    function X(m) { return X0 + m * PX; } function Y(m) { return YS - m * PX; }
    var WIN = { s: { x1: 1.6, x2: 4.0, z1: .9, z2: 2.4 }, e: { y1: 1.4, y2: 2.6, z1: .9, z2: 2.1 }, w: { y1: .8, y2: 1.2, z1: 1.2, z2: 1.6 } };
    var STATIC = '<g clip-path="url(#s-room)" class="pl-dyn"></g>';
    var walls = '<path fill="url(#s-poche)" fill-rule="evenodd" d="M' + (X0 - 12) + ' -12H' + (X(RW) + 12) + 'V' + (YS + 12) + 'H' + (X0 - 12) + 'ZM' + X0 + ' 0V' + YS + 'H' + X(RW) + 'V0Z"/>' +
      '<path class="d w2" d="M' + (X0 - 12) + ' -12H' + (X(RW) + 12) + 'V' + (YS + 12) + 'H' + (X0 - 12) + 'ZM' + X0 + ' 0V' + YS + 'H' + X(RW) + 'V0Z" fill="none" stroke="#111" stroke-width="1.3"/>';
    function gap(x, y, w, hh) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" fill="#e9e6df"/>'; }
    var wins = gap(X(WIN.s.x1), YS - 1, (WIN.s.x2 - WIN.s.x1) * PX, 14) + '<path d="M' + X(WIN.s.x1) + ' ' + (YS + 4) + 'H' + X(WIN.s.x2) + 'M' + X(WIN.s.x1) + ' ' + (YS + 8) + 'H' + X(WIN.s.x2) + '" stroke="#111" stroke-width=".7" fill="none"/>' +
      gap(X(RW) - 1, Y(WIN.e.y2), 14, (WIN.e.y2 - WIN.e.y1) * PX) + '<path d="M' + (X(RW) + 4) + ' ' + Y(WIN.e.y2) + 'V' + Y(WIN.e.y1) + 'M' + (X(RW) + 8) + ' ' + Y(WIN.e.y2) + 'V' + Y(WIN.e.y1) + '" stroke="#111" stroke-width=".7" fill="none"/>' +
      gap(X0 - 13, Y(WIN.w.y2), 14, (WIN.w.y2 - WIN.w.y1) * PX) + '<path d="M' + (X0 - 4) + ' ' + Y(WIN.w.y2) + 'V' + Y(WIN.w.y1) + 'M' + (X0 - 8) + ' ' + Y(WIN.w.y2) + 'V' + Y(WIN.w.y1) + '" stroke="#111" stroke-width=".7" fill="none"/>';
    var furn = '<path d="M' + X(1.2) + ' ' + Y(2.4) + 'H' + X(4.4) + 'V' + Y(1.5) + 'H' + X(1.2) + 'Z" fill="none" stroke="#111" stroke-width="1.05"/>' +
      '<path d="M' + X(2.8) + ' 0H' + X(5.4) + 'V' + (0.65 * PX) + 'H' + X(2.8) + 'Z" fill="none" stroke="#111" stroke-width="1.05"/>';
    var lab = '<text class="tx-s" x="' + X(2.8) + '" y="' + (YS + 36) + '" text-anchor="middle">South window 2 400</text>' +
      '<text class="tx-s mm" x="' + X(2.8) + '" y="' + Y(1.95) + '" text-anchor="middle" dy="3">Long table</text>' +
      '<text class="tx-s mm" x="' + X(4.1) + '" y="' + (0.65 * PX + 14) + '" text-anchor="middle">Kitchen</text>' +
      '<text class="tx-s" x="' + (X(RW) + 20) + '" y="' + (Y(2.0) + 3) + '">East 1 200</text>' +
      '<text class="tx-s mm" x="' + (X0 - 12) + '" y="' + (YS + 36) + '" text-anchor="start">West 400</text>' +
      '<text class="tx-s mm" x="' + X0 + '" y="-22">01 Living, 5 600 × 4 200</text>';
    var comp = '<g transform="translate(520 52)"><circle cx="0" cy="0" r="26" fill="none" stroke="#111" stroke-width=".7"/><path d="M0 -26V-34M-4 -30L0 -34L4 -30" fill="none" stroke="#111" stroke-width=".9"/><text class="tx-s" x="0" y="-40" text-anchor="middle">N</text><line class="js-ray" x1="0" y1="0" x2="0" y2="-26" stroke="#2f6bff" stroke-width="1.2"/><circle class="js-cd sun-dot" r="4" cx="0" cy="-26"/></g>';
    plan.innerHTML = '<g class="pl-room" clip-path="url(#s-room)"><rect x="' + X0 + '" y="0" width="' + RW * PX + '" height="' + RD * PX + '" class="night" fill="none"/></g>' + STATIC.replace('class="pl-dyn"', 'class="pl-dyn"') + walls + wins + furn + lab + comp;
    var dyn = qs('.pl-dyn', plan), nightR = qs('.night', plan), ray = qs('.js-ray', plan), cdot = qs('.js-cd', plan);

    function poly(pts, cls) { return '<polygon class="' + cls + '" points="' + pts.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(' ') + '"/>'; }
    var ro = { s: qs('.js-ro-s'), t: qs('.js-ro-t'), a: qs('.js-ro-a'), l: qs('.js-ro-l') };
    var seasonName = '';
    function render(S) {
      var p = sunPos(S.d, S.h), alt = p.alt / RAD, azd = p.az / RAD, up = alt > .4;
      var X1 = cx(clamp(azd, AZ0, AZ0 + AZW)), Y1 = cy(clamp(alt, 0, 60));
      sunG.setAttribute('transform', 'translate(' + X1.toFixed(1) + ' ' + Y1.toFixed(1) + ')');
      sunG.style.opacity = up ? 1 : .25;
      drop.setAttribute('d', 'M0 0V' + (CY0 - Y1).toFixed(1));
      below.setAttribute('opacity', up ? 0 : 1);
      // compass
      var sx = Math.sin(p.az) * 26, sy = -Math.cos(p.az) * 26;
      ray.setAttribute('x2', sx.toFixed(1)); ray.setAttribute('y2', sy.toFixed(1)); cdot.setAttribute('cx', sx.toFixed(1)); cdot.setAttribute('cy', sy.toFixed(1));
      cdot.style.opacity = ray.style.opacity = up ? 1 : .2;
      // light on the floor
      var out = '', depth = 0;
      if (up) {
        var ta = Math.tan(p.alt), dx = -Math.sin(p.az), dy = -Math.cos(p.az);
        var wn = WIN;
        if (dy > .02) { // sun in the south: south window
          var s1 = wn.s.z1 / ta, s2 = wn.s.z2 / ta, xa = wn.s.x1, xb = wn.s.x2;
          var A = function (s) { return [[xa + dx * s, dy * s], [xb + dx * s, dy * s]]; };
          out += poly([A(0)[0], A(0)[1], A(s2)[1], A(s2)[0]], 'beam');
          out += poly([A(s1)[0], A(s1)[1], A(s2)[1], A(s2)[0]], 'patch');
          depth = Math.max(depth, Math.min(RD, s2 * dy));
        }
        if (dx < -.02) { // sun in the east: east window
          var e1 = wn.e.z1 / ta, e2 = wn.e.z2 / ta, ya = wn.e.y1, yb = wn.e.y2;
          var E = function (s) { return [[RW + dx * s, ya + dy * s], [RW + dx * s, yb + dy * s]]; };
          out += poly([E(0)[0], E(0)[1], E(e2)[1], E(e2)[0]], 'beam');
          out += poly([E(e1)[0], E(e1)[1], E(e2)[1], E(e2)[0]], 'patch');
          depth = Math.max(depth, Math.min(RW, e2 * -dx));
        }
        if (dx > .02) { // sun in the west: west window
          var w1 = wn.w.z1 / ta, w2 = wn.w.z2 / ta, wa = wn.w.y1, wb = wn.w.y2;
          var W = function (s) { return [[0 + dx * s, wa + dy * s], [0 + dx * s, wb + dy * s]]; };
          out += poly([W(0)[0], W(0)[1], W(w2)[1], W(w2)[0]], 'beam');
          out += poly([W(w1)[0], W(w1)[1], W(w2)[1], W(w2)[0]], 'patch');
          depth = Math.max(depth, Math.min(RW, w2 * dx));
        }
      }
      dyn.innerHTML = out;
      nightR.setAttribute('fill-opacity', up ? 0 : .06); nightR.style.fill = up ? 'none' : '#111';
      ro.t.textContent = hhmm(S.h);
      ro.a.textContent = up ? Math.round(alt) + '°' : 'Below';
      ro.l.textContent = up && depth > .05 ? f1(depth) + ' m' : '—';
      var nm = S.d > 12 ? 'Midsummer' : S.d < -12 ? 'Midwinter' : 'Equinox';
      if (nm !== seasonName) { seasonName = nm; ro.s.textContent = nm; }
    }

    /* anchors from the text */
    var secs = qsa('.rd__s'), A = [];
    function measure() {
      A = secs.map(function (s) {
        var r = s.getBoundingClientRect();
        return { y: r.top + window.scrollY + Math.min(r.height * .38, innerHeight * .34), t: +s.dataset.t, d: +s.dataset.d };
      });
    }
    var target = { d: 0, h: 5.5 }, state = { d: 0, h: 5.5 };
    function aim() {
      if (!A.length) return;
      var y = window.scrollY + innerHeight * .5, i = 0;
      if (y <= A[0].y) { target.d = A[0].d; target.h = A[0].t; return; }
      if (y >= A[A.length - 1].y) { var L = A[A.length - 1]; target.d = L.d; target.h = L.t; return; }
      while (i < A.length - 2 && y > A[i + 1].y) i++;
      var a = A[i], b = A[i + 1], u = smooth((y - a.y) / (b.y - a.y));
      target.d = a.d + (b.d - a.d) * u; target.h = a.t + (b.t - a.t) * u;
    }
    measure(); aim(); state.d = target.d; state.h = target.h; render(state);
    ST.addEventListener('refresh', function () { measure(); aim(); });
    if (RM) { render({ d: 0, h: 7.5 }); return; }
    Core.onTick(function () {
      aim();
      var dd = target.d - state.d, dh = target.h - state.h;
      if (Math.abs(dd) < .005 && Math.abs(dh) < .002) return;
      state.d += dd * .14; state.h += dh * .14; render(state);
    });
  };
})();
