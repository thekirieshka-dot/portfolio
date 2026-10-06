/* ───────── LINEA — more.js: studio, materials, journal ───────── */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, qs = Core.qs, qsa = Core.qsa, d = document, root = d.documentElement;
  var RM = Core.RM, FINE = Core.FINE, cls = d.body.className;
  var isDesk = function () { return innerWidth >= 900; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var SVGNS = 'http://www.w3.org/2000/svg';
  function pad2(n) { return ('0' + n).slice(-2); }

  /* ═════════════════════ STUDIO ═════════════════════ */
  function initStudio() {
    /* people rows */
    var rows = qsa('.pp__row');
    if (!RM) {
      gsap.set(rows, { autoAlpha: 0, y: 26 });
      ST.batch(rows, { start: 'top 95%', once: true, onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .05 }); } });
    }

    /* method: pinned drawing */
    var sec = qs('#method'), pin = qs('.mth__pin', sec), svg = qs('svg[data-method]', sec);
    if (svg) {
      var groups = qsa('.ms', svg);
      var ds = groups.map(function (g) { return qsa('.d', g); });
      var fd = groups.map(function (g) { return qsa('[data-f],[data-call]', g); });
      var bk = qs('.bk', svg);
      var steps = qsa('.mst', sec), nEl = qs('.mth__n > span', sec), prog = qsa('.mth__prog i', sec), state = qs('.js-mth-state', sec);
      var names = ['Site', 'Daylight', 'Walls', 'Table', 'Joint'];
      ds.forEach(function (arr) { arr.forEach(function (e) { var L = 1; try { L = e.getTotalLength() || 1; } catch (x) {} e.__len = Math.ceil(L) + 2; }); });
      var active = -1;
      var setActive = function (i) {
        if (i === active) return; active = i;
        steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
        gsap.to(nEl, { yPercent: -100 * i / steps.length, duration: .8, ease: 'expo.out', overwrite: true });
        if (state) state.textContent = pad2(i + 1) + ' / ' + names[i];
      };
      if (RM) {
        if (bk) bk.setAttribute('opacity', '0');
        qsa('.ms[data-s="5"]', svg).forEach(function (g) { g.style.display = 'none'; });
        steps.forEach(function (s) { s.style.position = 'static'; s.style.opacity = 1; s.style.transform = 'none'; s.style.marginBottom = '40px'; s.style.gridArea = 'auto'; });
        pin.style.height = 'auto';
      } else {
        ds.forEach(function (arr) { arr.forEach(function (e) { e.style.strokeDasharray = e.__len + ' ' + e.__len; e.style.strokeDashoffset = e.__len; }); });
        gsap.set(fd.reduce(function (a, b) { return a.concat(b); }, []), { opacity: 0 });
        var tl = gsap.timeline({ defaults: { ease: 'none' } });
        for (var i = 0; i < 4; i++) {
          tl.to(ds[i], { strokeDashoffset: 0, duration: .7, ease: 'power1.inOut', stagger: { each: .025 } }, i);
          tl.to(fd[i], { opacity: 1, duration: .35, stagger: .05 }, i + .55);
        }
        // step 5: callout, zoom sheet, detail
        tl.to(qsa('[data-call]', groups[4]), { opacity: 1, duration: .25 }, 4);
        tl.to(bk, { opacity: 1, duration: .25 }, 4.25);
        tl.to(ds[4], { strokeDashoffset: 0, duration: .55, ease: 'power1.inOut', stagger: { each: .03 } }, 4.35);
        tl.to(qsa('[data-f]', groups[4]), { opacity: 1, duration: .3, stagger: .05 }, 4.7);
        tl.to(qsa('[data-call]', groups[4]), { opacity: 0, duration: .2 }, 4.3);
        tl.set({}, {}, 5);
        ST.create({
          trigger: pin, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * (isDesk() ? 4.6 : 3.8)); },
          pin: true, scrub: .7, anticipatePin: 1, invalidateOnRefresh: true, animation: tl,
          onUpdate: function (self) {
            var p = self.progress;
            setActive(clamp(Math.floor(p * 5 + .1), 0, 4));
            prog.forEach(function (el, k) { el.style.setProperty('--p', clamp(p * 5 - k, 0, 1).toFixed(3)); });
          }
        });
      }
      setActive(0);
    }

    /* materials board */
    var chips = qsa('.mc__chip');
    if (!RM) {
      gsap.set(chips, { clipPath: 'inset(100% 0% 0% 0%)' });
      ST.batch(chips, { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', stagger: .12 }); } });
    }

    /* how a project runs */
    initRun();
  }

  /* timeline */
  var PH = [
    ['Site visit and brief', 'We walk the plot, or the flat, with the people who will use it.'],
    ['Daylight study', 'Sun paths, the hours to keep, a first plan of windows.'],
    ['Concept', 'Plan, section and one model at 1:50.'],
    ['Developed design', 'Walls, materials, the table. Priced with a mason and a joiner.'],
    ['Permit and tender', 'Drawings to the municipality; builders price the same set.'],
    ['Details at 1:5', 'Every junction drawn until the builder can read it alone.'],
    ['On site', 'A partner on site every week; one meeting at the table.'],
    ['Handover and first winter', 'We come back after the first winter to see where the light fell.']
  ];
  var RUN = {
    house: { sum: 'House of about 200 m², load-bearing brick', total: 108, ph: [[0, 2], [2, 8], [8, 16], [16, 28], [28, 42], [36, 52], [52, 96], [96, 108]] },
    interior: { sum: 'Apartment of about 120 m², existing building', total: 38, ph: [[0, 1], [1, 3], [3, 7], [7, 12], [12, 16], [14, 20], [20, 34], [34, 38]] },
    public: { sum: 'Municipal building of about 2 800 m²', total: 200, ph: [[0, 4], [4, 12], [12, 26], [26, 52], [52, 78], [66, 96], [96, 176], [176, 200]] }
  };
  function initRun() {
    var rowsEl = qs('.js-tl-rows'), ticksEl = qs('.js-tl-ticks'), totEl = qs('.js-tl-total'), sumEl = qs('.js-tl-sum');
    if (!rowsEl) return;
    var cur = 'house', first = true;
    PH.forEach(function (p, i) {
      var li = d.createElement('li'); li.className = 'tl__row'; li.setAttribute('data-p', i + 1);
      li.innerHTML = '<span class="lbl tl__no">' + pad2(i + 1) + '</span><span><span class="tl__nm">' + p[0] + '</span><span class="tl__nt">' + p[1] + '</span></span><div class="tl__track"><span class="tl__tk"></span><div class="tl__b"></div></div><span class="lbl tl__wk"></span>';
      rowsEl.appendChild(li);
    });
    var rows = qsa('.tl__row', rowsEl), bars = qsa('.tl__b', rowsEl), wks = qsa('.tl__wk', rowsEl), tracks = qsa('.tl__track', rowsEl);
    function ticks(total) {
      var step = total <= 60 ? 10 : total <= 120 ? 20 : 50, html = '', tk = '';
      for (var w = 0; w <= total; w += step) { html += '<span style="left:' + (w / total * 100) + '%">' + w + '</span>'; tk += '<i style="left:' + (w / total * 100) + '%"></i>'; }
      ticksEl.innerHTML = html;
      tracks.forEach(function (t) { qsa('i', t).forEach(function (x) { x.remove(); }); t.insertAdjacentHTML('afterbegin', tk); });
    }
    function labels(r) {
      r.ph.forEach(function (p, i) { wks[i].innerHTML = 'Wk ' + p[0] + '–' + p[1] + '<em>' + (p[1] - p[0]) + ' wk</em>'; });
    }
    function set(key, anim) {
      var r = RUN[key]; cur = key; sumEl.textContent = r.sum; labels(r); ticks(r.total);
      bars.forEach(function (b, i) {
        var p = r.ph[i], l = p[0] / r.total * 100, w = (p[1] - p[0]) / r.total * 100;
        if (anim && !RM) gsap.to(b, { left: l + '%', width: w + '%', duration: 1.1, ease: 'expo.inOut', overwrite: 'auto' }); else gsap.set(b, { left: l + '%', width: w + '%' });
      });
      var o = { v: +totEl.textContent || 0 };
      if (anim && !RM) gsap.to(o, { v: r.total, duration: 1.1, ease: 'expo.inOut', onUpdate: function () { totEl.textContent = Math.round(o.v); } }); else totEl.textContent = r.total;
    }
    set('house', false);
    if (!RM) {
      gsap.set(rows, { autoAlpha: 0, y: 20 });
      gsap.set(bars, { scaleX: 0 });
      ST.create({ trigger: rowsEl, start: 'top 85%', once: true, onEnter: function () {
        gsap.to(rows, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .06 });
        gsap.to(bars, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', stagger: .08, delay: .2 });
      } });
    }
    qsa('[data-run]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.run === cur) return;
        qsa('[data-run]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        set(b.dataset.run, true);
      });
    });
  }

  /* ═════════════════════ boot ═════════════════════ */
  Core.onReady(function () {
    if (/p-studio/.test(cls)) initStudio();
    if (/p-materials/.test(cls) && window.initMaterials) window.initMaterials();
    if (/p-journal/.test(cls) && window.initJournal) window.initJournal();
    ST.refresh();
  });
})();
