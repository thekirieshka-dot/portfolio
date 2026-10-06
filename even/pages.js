/* ───────── EVEN — team · first visit · results ───────── */
(function () {
  'use strict';
  var d = document, gsap = window.gsap, ST = window.ScrollTrigger;
  if (!window.Core || !gsap) return;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var RM = Core.RM, FINE = Core.FINE;
  var page = d.body.className.replace(/.*\bpg-(\w+).*/, '$1');

  /* ═════════ TEAM ═════════ */
  function team() {
    // bio reveal: hover on desktop, tap / Enter everywhere
    $$('.mate').forEach(function (m) {
      var btn = $('.mate__more', m), ph = $('.mate__ph', m);
      function set(open) { m.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); }
      btn.addEventListener('click', function (e) { e.stopPropagation(); set(!m.classList.contains('is-open')); });
      ph.addEventListener('click', function () { if (!FINE) set(!m.classList.contains('is-open')); });
      if (FINE) { ph.addEventListener('mouseenter', function () { set(true); }); ph.addEventListener('mouseleave', function () { set(false); }); }
      m.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    });
    // training strip: progress bar follows the pinned scroll
    var sec = $('.train'), bar = $('.train__bar i');
    if (sec && bar) Core.onReady(function () {
      var tw = sec.__hs;
      if (tw) tw.eventCallback('onUpdate', function () { bar.style.transform = 'scaleX(' + (0.06 + 0.94 * tw.progress()).toFixed(4) + ')'; });
      var vp = $('.train__vp', sec);
      vp.addEventListener('scroll', function () { var m = vp.scrollWidth - vp.clientWidth; if (m > 0) bar.style.transform = 'scaleX(' + (0.06 + 0.94 * vp.scrollLeft / m).toFixed(4) + ')'; });
    });
  }

  /* ═════════ FIRST VISIT ═════════ */
  function firstVisit() {
    var list = $('.fvs__list'); if (!list) return;
    var fill = $('.fvs__fill', list), head = $('.fvs__head', list), items = $$('.fvs__item', list);
    Core.onReady(function () {
      if (RM) { gsap.set(fill, { scaleY: 1 }); items.forEach(function (s) { s.classList.add('is-on'); }); return; }
      gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 55%', end: 'bottom 55%', scrub: true,
        onUpdate: function (self) { head.style.transform = 'translate3d(0,' + (self.progress * ($('.fvs__track', list).offsetHeight)).toFixed(1) + 'px,0)'; } } });
      items.forEach(function (s) {
        ST.create({ trigger: s, start: 'top 55%', end: 'max', onToggle: function (self) { s.classList.toggle('is-on', self.isActive || self.progress > 0); } });
        var b = $$('.fvs__b > *', s);
        gsap.from(b, { y: 36, autoAlpha: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 72%', once: true } });
      });
    });
  }

  /* ═════════ RESULTS ═════════ */
  var HEX = { '0M1': '#f5f2ea', '0M3': '#f0e9da', B1: '#ece3cf', A1: '#e9dbc2', B2: '#e6d6b8', A2: '#e2cfae', C1: '#dbd0bb', A3: '#dbc5a0', B3: '#d8bf91', 'A3.5': '#d1b68e', C3: '#c6b597', A4: '#c4a67e' };
  function mix(a, b, t) {
    var p = function (h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); };
    var A = p(a), B = p(b);
    return '#' + A.map(function (v, i) { return ('0' + Math.round(v + (B[i] - v) * t).toString(16)).slice(-2); }).join('');
  }
  // eight upper teeth, left to right: premolar, canine, lateral, central | central, lateral, canine, premolar
  var BASE = [
    { w: 48, h: 80, top: 104, cx: 320 - 190 }, { w: 54, h: 98, top: 94, cx: 320 - 139 }, { w: 50, h: 88, top: 98, cx: 320 - 87 }, { w: 62, h: 100, top: 92, cx: 320 - 31 },
    { w: 62, h: 100, top: 92, cx: 320 + 31 }, { w: 50, h: 88, top: 98, cx: 320 + 87 }, { w: 54, h: 98, top: 94, cx: 320 + 139 }, { w: 48, h: 80, top: 104, cx: 320 + 190 }
  ];
  var OPEN = 'M58 150C58 82 188 52 320 52C452 52 582 82 582 150C582 232 452 270 320 270C188 270 58 232 58 150Z';
  var uid = 0;
  function toothPath(cx, top, w, h, dl, dr) {
    var bl = top + h + dl, br = top + h + dr, f = function (n) { return +n.toFixed(1); };
    return 'M' + f(cx - .44 * w) + ' ' + top +
      'C' + f(cx - .2 * w) + ' ' + (top - 5) + ' ' + f(cx + .2 * w) + ' ' + (top - 5) + ' ' + f(cx + .44 * w) + ' ' + top +
      'C' + f(cx + .52 * w) + ' ' + f(top + .3 * h) + ' ' + f(cx + .51 * w) + ' ' + f(top + .75 * h) + ' ' + f(cx + .48 * w) + ' ' + f(br - 8) +
      'Q' + f(cx + .46 * w) + ' ' + f(br) + ' ' + f(cx + .34 * w) + ' ' + f(br) +
      'C' + f(cx + .12 * w) + ' ' + f((br + bl) / 2 + 3) + ' ' + f(cx - .12 * w) + ' ' + f((br + bl) / 2 + 3) + ' ' + f(cx - .34 * w) + ' ' + f(bl) +
      'Q' + f(cx - .46 * w) + ' ' + f(bl) + ' ' + f(cx - .48 * w) + ' ' + f(bl - 8) +
      'C' + f(cx - .51 * w) + ' ' + f(top + .75 * h) + ' ' + f(cx - .52 * w) + ' ' + f(top + .3 * h) + ' ' + f(cx - .44 * w) + ' ' + top + 'Z';
  }
  // state: { shade:'A3' | [8 shades], t:{ index: {dx,dw,dh,dt,dl,dr,rot,z} } }
  function smile(st) {
    var id = 'sm' + (++uid), defs = '', gradFor = {}, out = '', i;
    function grad(code) {
      if (gradFor[code]) return gradFor[code];
      var hx = HEX[code], g = id + 'g' + Object.keys(gradFor).length;
      defs += '<linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + mix(hx, '#a07a40', .24) + '"/><stop offset=".36" stop-color="' + hx + '"/><stop offset=".74" stop-color="' + mix(hx, '#ffffff', .16) + '"/><stop offset="1" stop-color="' + mix(hx, '#9aaeb8', .5) + '"/></linearGradient>';
      return (gradFor[code] = g);
    }
    var sh = function (k) { return Array.isArray(st.shade) ? st.shade[k] : st.shade; };
    // lower teeth, in shadow
    var low = '';
    [-106, -64, -22, 22, 64, 106].forEach(function (x, k) {
      var hx = mix(HEX[Array.isArray(st.shade) ? st.shade[3] : st.shade], '#4a2e2b', .3);
      low += '<rect x="' + (320 + x - 20) + '" y="226" width="40" height="70" rx="15" fill="' + hx + '"/>';
    });
    var teeth = BASE.map(function (b, k) {
      var o = (st.t && st.t[k]) || {};
      return { k: k, cx: b.cx + (o.dx || 0), w: b.w + (o.dw || 0) + 3, top: b.top + (o.dt || 0), h: b.h + (o.dh || 0), dl: o.dl || 0, dr: o.dr || 0, rot: o.rot || 0, z: o.z || 0 };
    });
    teeth.sort(function (a, b) { return a.z - b.z; });
    teeth.forEach(function (t) {
      var g = grad(sh(t.k)), cy = t.top + t.h / 2;
      out += '<g' + (t.rot ? ' transform="rotate(' + t.rot + ' ' + t.cx + ' ' + cy + ')"' : '') + '>' +
        '<path d="' + toothPath(t.cx, t.top, t.w, t.h, t.dl, t.dr) + '" fill="url(#' + g + ')" stroke="rgba(10,24,22,.35)" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<ellipse cx="' + (t.cx - .15 * t.w) + '" cy="' + (t.top + .42 * t.h) + '" rx="' + (.09 * t.w) + '" ry="' + (.3 * t.h) + '" fill="#fff" opacity=".34" transform="rotate(-4 ' + t.cx + ' ' + cy + ')"/></g>';
    });
    return '<svg class="smile" viewBox="0 0 640 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<defs>' + defs + '<radialGradient id="' + id + 'b" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="#244640"/><stop offset="1" stop-color="#112623"/></radialGradient>' +
      '<filter id="' + id + 's" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#000" flood-opacity=".38"/></filter></defs>' +
      '<rect width="640" height="330" fill="url(#' + id + 'b)"/>' +
      '<path d="M96 262H544" stroke="rgba(255,255,255,.07)" stroke-width="1"/>' +
      '<g transform="translate(0 28)" filter="url(#' + id + 's)">' + out + '</g></svg>';
  }

  var CASES = [
    { f: 'whitening', lbl: 'Case 01 · Whitening · 2 visits', h: 'Tea-and-coffee yellowing, <em>three shades</em> lighter.',
      a: 'A3', b: 'B2', note: 'Custom trays and a low-strength gel worn at home for two weeks. Fillings and crowns, which don’t whiten, were checked before we began.',
      spec: [['Shade', 'A3 → B2'], ['Treatment', '45 min fit, 2 weeks at home'], ['Dentist', 'Associate dentist'], ['Review', 'At four weeks, free']],
      before: { shade: 'A3' }, after: { shade: 'B2' } },
    { f: 'bonding', lbl: 'Case 02 · Bonding · 1 visit', h: 'A chipped front tooth, rebuilt <em>in one afternoon.</em>',
      a: 'A2', b: 'A2', note: 'Resin built up in thin layers and matched to the neighbouring tooth. No drilling, and no injection was needed.',
      spec: [['Shade', 'A2, matched'], ['Treatment', '90 minutes, one visit'], ['Dentist', 'Principal dentist'], ['Aftercare', 'Re-gloss yearly']],
      before: { shade: 'A2', t: { 3: { dl: -30, dr: -4 } } }, after: { shade: 'A2' } },
    { f: 'aligners', lbl: 'Case 03 · Clear aligners · 8 months', h: 'Crowded laterals and a turned canine, <em>straightened</em> without wires.',
      a: 'A2', b: 'A2', note: 'Sixteen sets of trays, checked every six to eight weeks by the same dentist. Retainers fitted on the day the last tray came out.',
      spec: [['Trays', '16 sets'], ['Check-ins', 'Every 6–8 weeks'], ['Dentist', 'Associate dentist'], ['Afterwards', 'Retainers, nightly']],
      before: { shade: 'A2', t: { 2: { dx: 13, rot: 15, dh: -4, z: 3 }, 5: { dx: -4, rot: -9, dh: -8, z: -3 }, 6: { dx: -7, rot: 13, dw: 2, z: 2 }, 3: { rot: -3 }, 1: { dx: 3, rot: -5 } } }, after: { shade: 'A2' } },
    { f: 'veneers', lbl: 'Case 04 · Porcelain veneers · 3 visits', h: 'Worn, uneven edges, rebuilt with <em>eight thin veneers.</em>',
      a: 'A3.5', b: '0M3', note: 'Tried on first as a temporary mock-up, then changed once — the lateral incisors came down by half a millimetre. Preparation was kept to a fraction of a millimetre.',
      spec: [['Shade', 'A3.5 → 0M3'], ['Treatment', 'Three visits, seven weeks'], ['Dentist', 'Principal dentist'], ['Mock-up', 'Lived with for a day']],
      before: { shade: ['A3.5', 'C3', 'A3.5', 'A3.5', 'A3.5', 'A3.5', 'C3', 'A3.5'], t: { 3: { dh: -17, dw: -4, dx: 1, dl: 6 }, 4: { dh: -9, dw: -2, dr: 8 }, 2: { dh: -7, dt: 2 }, 5: { dh: -15, dl: 7 }, 1: { dh: -10, dr: 8 }, 6: { dh: -12 }, 0: { dh: -5 }, 7: { dh: -8 } } }, after: { shade: '0M3' } },
    { f: 'whitening', lbl: 'Case 05 · Whitening · 2 visits', h: 'A harder start, a gentler gain: <em>A4 to B3.</em>',
      a: 'A4', b: 'B3', note: 'Deeper shades move more slowly. After three weeks we stopped here on purpose; going lighter would have looked flat against the eyes.',
      spec: [['Shade', 'A4 → B3'], ['Treatment', '45 min fit, 3 weeks at home'], ['Dentist', 'Associate dentist'], ['Review', 'At six weeks, free']],
      before: { shade: 'A4' }, after: { shade: 'B3' } },
    { f: 'bonding', lbl: 'Case 06 · Bonding · 1 visit', h: 'A gap between the front teeth, <em>closed</em> with resin.',
      a: 'A2', b: 'A2', note: 'Each front tooth widened by a little under a millimetre. A reversible option, and a good trial before anything more permanent.',
      spec: [['Shade', 'A2, matched'], ['Treatment', '60 minutes, one visit'], ['Dentist', 'Principal dentist'], ['Aftercare', 'Polish at hygiene visits']],
      before: { shade: 'A2', t: { 3: { dx: -9, dw: -5 }, 4: { dx: 9, dw: -5 } } }, after: { shade: 'A2' } }
  ];

  function chip(code) { return '<span class="sc"><i style="background:' + mix(HEX[code], '#ffffff', .0) + '"></i>' + code + '</span>'; }
  function caseHTML(c, i) {
    var same = c.a === c.b;
    return '<article class="case" data-f="' + c.f + '">' +
      '<div class="cmp" data-cursor="Drag" style="--p:50%">' +
        '<div class="cmp__l cmp__l--b">' + smile(c.before) + '</div>' +
        '<div class="cmp__l cmp__l--a">' + smile(c.after) + '</div>' +
        '<span class="cmp__tag cmp__tag--b">Before</span><span class="cmp__tag cmp__tag--a">After</span>' +
        '<span class="cmp__bar" aria-hidden="true"><i class="cmp__knob"><svg viewBox="0 0 24 24"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg></i></span>' +
        '<input class="cmp__range" type="range" min="0" max="100" value="50" aria-label="Compare before and after, case ' + (i < 9 ? '0' : '') + (i + 1) + '">' +
      '</div>' +
      '<div class="case__meta"><p class="lbl">' + c.lbl + '</p>' +
        '<h3 class="case__t">' + c.h + '</h3>' +
        '<div class="case__sh"><span class="sc-l">Shade</span>' + chip(c.a) + '<span class="sc-ar' + (same ? ' is-same' : '') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18M15 6l6 6-6 6"/></svg></span>' + chip(c.b) + (same ? '<span class="sc-n">unchanged</span>' : '') + '</div>' +
        '<p class="case__n">' + c.note + '</p>' +
        '<dl class="case__spec">' + c.spec.map(function (s) { return '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>'; }).join('') + '</dl>' +
      '</div></article>';
  }

  function results() {
    var grid = $('[data-cases]'); if (!grid) return;
    grid.innerHTML = CASES.map(caseHTML).join('');
    var cards = $$('.case', grid), cntEl = $('[data-count-n]'), chips = $$('.fchip');

    // sliders
    cards.forEach(function (card) {
      var cmp = $('.cmp', card), rng = $('.cmp__range', cmp), pos = { p: 50 }, drag = false, intro = null;
      function set(p) { p = Math.max(0, Math.min(100, p)); pos.p = p; cmp.style.setProperty('--p', p.toFixed(2) + '%'); rng.value = Math.round(p); }
      function fromEvent(e) { var r = cmp.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); }
      cmp.addEventListener('pointerdown', function (e) {
        if (e.button) return; drag = true; if (intro) intro.kill(); cmp.classList.add('is-drag'); cmp.setPointerCapture(e.pointerId); fromEvent(e);
      });
      cmp.addEventListener('pointermove', function (e) { if (drag) fromEvent(e); });
      var up = function () { drag = false; cmp.classList.remove('is-drag'); };
      cmp.addEventListener('pointerup', up); cmp.addEventListener('pointercancel', up);
      rng.addEventListener('input', function () { if (intro) intro.kill(); set(+rng.value); });
      if (!RM) {
        set(50);
        ST.create({ trigger: cmp, start: 'top 78%', once: true, onEnter: function () {
          if (drag) return;
          intro = gsap.timeline({ onUpdate: function () { set(pos.p); } })
            .to(pos, { p: 18, duration: 0.9, ease: 'power3.inOut' })
            .to(pos, { p: 82, duration: 1.3, ease: 'power3.inOut' })
            .to(pos, { p: 50, duration: 0.9, ease: 'power3.inOut' });
        } });
      }
    });

    // filter + reflow
    var spans = [7, 5, 5, 7, 7, 5];
    function layout() {
      var vis = cards.filter(function (c) { return !c.hidden; });
      vis.forEach(function (c, i) { c.style.setProperty('--span', vis.length === 1 ? 7 : spans[i % spans.length]); c.classList.toggle('is-wide', (vis.length === 1 ? 7 : spans[i % spans.length]) === 7); });
      return vis.length;
    }
    layout();
    function apply(f) {
      var state = (window.Flip && !RM) ? Flip.getState(cards) : null;
      cards.forEach(function (c) { c.hidden = !(f === 'all' || c.dataset.f === f); });
      var n = layout(); cntEl.textContent = n;
      if (state) {
        Flip.from(state, { duration: 0.8, ease: 'expo.inOut', absolute: false, nested: false,
          onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.25, ease: 'expo.out' }); },
          onLeave: function (els) { return gsap.to(els, { opacity: 0, duration: 0.25 }); } });
      }
      ST.refresh();
    }
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('is-on')) return;
        chips.forEach(function (o) { var on = o === b; o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', String(on)); });
        apply(b.dataset.f);
      });
    });
    var q = (location.hash || '').replace('#', '');
    var qb = chips.filter(function (b) { return b.dataset.f === q; })[0];
    if (qb) qb.click();

    // hero ladder
    Core.onReady(function () {
      var ch = $$('.rs-chip'); if (RM || !ch.length) return;
      gsap.from(ch, { yPercent: 70, autoAlpha: 0, duration: 1.2, stagger: 0.05, ease: 'expo.out', delay: 0.9 });
      gsap.from('.rs-ladder__l', { autoAlpha: 0, duration: 1, delay: 1.5 });
      gsap.from(cards, { y: 50, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: grid, start: 'top 85%', once: true } });
    });
    // stats count-in
    $$('.rs-led__list li').forEach(function (li) { if (!RM) gsap.from(li, { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 88%', once: true } }); });
    $$('.rs-tbl__r').forEach(function (r) { if (!RM) gsap.from(r, { y: 20, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 92%', once: true } }); });
    $$('.rs__bar > *').forEach(function (r) { if (!RM) gsap.from(r, { y: 18, autoAlpha: 0, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 92%', once: true } }); });
  }

  if (page === 'tm') team();
  if (page === 'fv') firstVisit();
  if (page === 'rs') results();
})();
