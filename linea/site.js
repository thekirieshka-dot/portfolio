/* ───────── LINEA — site.js ───────── */
(function () {
  'use strict';
  Core.config({
    veilBg: '#e9e6df', veilInk: '#111111', veilCols: 6,
    preloader: { key: 'linea', brand: 'LINEA', top: 'Linea Arkitekter', topRight: 'Copenhagen — Est. 2014', bottom: 'Quiet buildings', duration: 1.6 }
  });

  var gsap = window.gsap, ST = window.ScrollTrigger, qs = Core.qs, qsa = Core.qsa, d = document, root = d.documentElement;
  var RM = Core.RM, isDesk = function () { return innerWidth >= 900; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var smooth = function (a, b, v) { var x = clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
  var ease3 = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var page = d.body.className;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ───────── header state for sticky elements ───────── */
  var hdr = qs('.hdr');
  Core.onTick(function (y) {
    var shown = hdr && !hdr.classList.contains('is-hidden') && y > 60;
    if (shown !== root.classList.contains('hdr-shown')) root.classList.toggle('hdr-shown', shown);
  });

  /* ───────── links to the current page → scroll to top ───────── */
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.pathname === location.pathname && !u.hash) {
      e.preventDefault();
      if (Core.lenis) Core.lenis.scrollTo(0, { duration: 1.6 }); else scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  qsa('.js-top').forEach(function (b) { b.addEventListener('click', function () { if (Core.lenis) Core.lenis.scrollTo(0, { duration: 2.2 }); else scrollTo({ top: 0, behavior: 'smooth' }); }); });

  /* ───────── arrive at #hash behind the veil ───────── */
  if (location.hash.length > 1) {
    Core.hold(new Promise(function (res) {
      var done = false, fin = function () { if (!done) { done = true; res(); } };
      setTimeout(fin, 2500);
      function go() {
        var t; try { t = qs(location.hash); } catch (e) { t = null; }
        if (t) {
          ST.refresh();
          var y = t.getBoundingClientRect().top + window.scrollY;
          var work = qs('#work');
          if (work && isDesk() && !RM && work.compareDocumentPosition(t) & 4) {
            var tr = qs('[data-hscroll-track]', work);
            y += Math.max(0, tr.scrollWidth - work.clientWidth);
          }
          window.scrollTo(0, Math.max(0, y - (t.dataset.offset ? +t.dataset.offset : 0)));
        }
        fin();
      }
      function wait() { (d.fonts ? d.fonts.ready : Promise.resolve()).then(function () { setTimeout(go, 40); }); }
      if (d.readyState === 'loading') addEventListener('DOMContentLoaded', function () { setTimeout(wait, 0); }); else wait();
    }));
  }

  /* ───────── menu overlay ───────── */
  var menu = qs('.menu');
  if (menu) {
    var mtl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    mtl.set(menu, { visibility: 'visible' })
      .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .95, ease: 'expo.inOut' }, 0)
      .fromTo(qsa('.menu__w > span', menu), { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: .07 }, .42)
      .fromTo(qsa('.menu__no, .menu__top, .menu__foot, .menu__side > .lbl, .mt > .lbl', menu), { autoAlpha: 0 }, { autoAlpha: 1, duration: .7, stagger: .025, ease: 'power2.out' }, .62)
      .fromTo(qsa('.mt__img', menu), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, stagger: .07 }, .55)
      .fromTo(qsa('.mt__img img', menu), { scale: 1.3 }, { scale: 1, duration: 1.6, stagger: .07 }, .55);
    Core.onMenu = function (open) {
      menu.setAttribute('aria-hidden', String(!open));
      if (open) mtl.timeScale(1).play(); else mtl.timeScale(1.9).reverse();
    };
    menu.setAttribute('aria-hidden', 'true');
  }

  /* ───────── line drawings ───────── */
  function prep(svg) {
    if (svg.__prep) return svg.__prep;
    var els = qsa('.d', svg);
    els.forEach(function (e) {
      var L = 1; try { L = e.getTotalLength() || 1; } catch (x) {}
      L = Math.ceil(L) + 2; e.__len = L;
      e.style.strokeDasharray = L + ' ' + L;
      e.style.strokeDashoffset = RM ? 0 : L;
    });
    var fades = qsa('[data-fade]', svg);
    if (!RM) gsap.set(fades, { opacity: 0 });
    svg.__prep = { els: els, fades: fades };
    return svg.__prep;
  }
  function drawTl(svg, opts) {
    var p = prep(svg), tl = gsap.timeline(opts || {});
    if (svg.__drawn) return tl;
    svg.__drawn = true;
    tl.to(p.els, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: { each: .05 } }, 0)
      .to(p.fades, { opacity: 1, duration: .9, ease: 'power1.out', stagger: .08 }, .7);
    return tl;
  }
  function initDrawings() {
    qsa('svg[data-draw="once"]').forEach(function (svg) {
      prep(svg);
      if (RM) return;
      ST.create({ trigger: svg, start: 'top 88%', once: true, onEnter: function () { drawTl(svg); } });
    });
    qsa('svg[data-draw="scrub"]').forEach(function (svg) {
      var p = prep(svg);
      if (RM) return;
      var steps = qsa('[data-step]', svg);
      var tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 82%', end: 'bottom 45%', scrub: .8 } });
      if (!steps.length) { tl.to(p.els, { strokeDashoffset: 0, ease: 'none', stagger: .1 }).to(p.fades, { opacity: 1, stagger: .1 }, '>-0.2'); return; }
      steps.forEach(function (g, i) {
        if (g.hasAttribute('data-fade')) tl.to(g, { opacity: 1, duration: .8, ease: 'none' }, i * .55);
        else tl.to(qsa('.d', g), { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut', stagger: .08 }, i * .55);
      });
    });
  }

  /* ═════════ HERO: arch window ═════════ */
  var hero = qs('.hero');
  var heroS = { intro: 0, p: 0 }, A = {}, H = {};
  if (hero) {
    H.media = qs('.hero__media', hero); H.zoom = qs('.hero__zoom', hero); H.img = qs('.hero__img', hero);
    H.lines = qs('.hero__lines', hero); H.ref = qs('.hero__arch-ref', hero); H.head = qs('.hero__head', hero);
    H.word = qs('.hero__word', hero); H.cap = qs('.hero__cap', hero);
    H.fadeOut = qsa('.hero__top, .hero__side, .hero__scroll', hero);

    var heroMeasure = function () {
      var hr = hero.getBoundingClientRect(), r = H.ref.getBoundingClientRect();
      A.W = hr.width; A.H = hr.height; A.l = r.left - hr.left; A.t = r.top - hr.top; A.w = r.width; A.h = A.H - A.t;
      buildHeroLines();
      heroRender();
    };
    var heroRender = function () {
      if (!A.W) return;
      var i = heroS.intro, p = heroS.p, e = ease3(p), cx = A.l + A.w / 2;
      var iw = 2 + (A.w - 2) * ease3(Math.min(1, i * 1.15));
      var T = A.t + A.h * .38 * (1 - smooth(0, .8, i));
      var L = cx - iw / 2, R = A.W - (cx + iw / 2);
      L *= (1 - e); R *= (1 - e); T *= (1 - e);
      var cw = A.W - L - R, rad = (cw / 2) * (1 - smooth(.22, 1, p));
      H.media.style.clipPath = 'inset(' + T.toFixed(1) + 'px ' + R.toFixed(1) + 'px 0px ' + L.toFixed(1) + 'px round ' + rad.toFixed(1) + 'px ' + rad.toFixed(1) + 'px 0px 0px)';
    };
    var mk = function (tag, attrs, parent) { var e = d.createElementNS(SVGNS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); (parent || H.lines).appendChild(e); return e; };
    var buildHeroLines = function () {
      var s = H.lines; while (s.firstChild) s.removeChild(s.firstChild);
      s.setAttribute('viewBox', '0 0 ' + A.W + ' ' + A.H);
      var l = A.l, t = A.t, w = A.w, r = w / 2, o = 12, B = A.H + 2;
      H.outline = mk('path', { d: 'M' + (l - o) + ' ' + B + 'V' + (t + r) + 'A' + (r + o) + ' ' + (r + o) + ' 0 0 1 ' + (l + w + o) + ' ' + (t + r) + 'V' + B, 'class': 'thin' });
      var g = H.dims = mk('g', {});
      if (A.W < 700) return;
      var mm = 4200 / w, rnd = function (v) { return (Math.round(v / 50) * 50).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
      var y = t - 34, x = l - o - 30, flo = A.H - 30;
      var tk = function (x, y) { return 'M' + (x - 4) + ' ' + (y + 4) + 'L' + (x + 4) + ' ' + (y - 4); };
      mk('path', { d: 'M' + l + ' ' + y + 'H' + (l + w) + tk(l, y) + tk(l + w, y) + 'M' + l + ' ' + (t - 10) + 'V' + (y - 8) + 'M' + (l + w) + ' ' + (t - 10) + 'V' + (y - 8), 'class': 'thin' }, g);
      var tx = mk('text', { x: l + w / 2, y: y - 7, 'text-anchor': 'middle' }, g); tx.textContent = '4 200';
      mk('path', { d: 'M' + x + ' ' + t + 'V' + flo + tk(x, t) + tk(x, t + r) + tk(x, flo) + 'M' + (l + w / 2 - 8) + ' ' + t + 'H' + (x - 8) + 'M' + (l - o - 6) + ' ' + (t + r) + 'H' + (x - 8), 'class': 'thin' }, g);
      var t1 = mk('text', { x: x - 10, y: t + r / 2, 'text-anchor': 'middle', transform: 'rotate(-90 ' + (x - 10) + ' ' + (t + r / 2) + ')' }, g); t1.textContent = rnd(r * mm);
      var t2 = mk('text', { x: x - 10, y: (t + r + flo) / 2, 'text-anchor': 'middle', transform: 'rotate(-90 ' + (x - 10) + ' ' + ((t + r + flo) / 2) + ')' }, g); t2.textContent = rnd((flo - t - r) * mm);
      var cx = l + w / 2;
      mk('path', { d: 'M' + cx + ' ' + (t - 62) + 'V' + (t + 22), 'class': 'thin', 'stroke-dasharray': '14 4 2 4' }, g);
      var lv = t + r, lx = l + w + o + 30;
      mk('path', { d: 'M' + (lx - 22) + ' ' + lv + 'H' + (lx + 8) + 'M' + (lx - 13) + ' ' + (lv - 9) + 'H' + (lx - 1) + 'L' + (lx - 7) + ' ' + lv + 'Z', 'class': 'thin' }, g);
      var t3 = mk('text', { x: lx + 14, y: lv + 4 }, g); t3.textContent = 'SPR. +' + ((flo - t - r) * mm / 1000).toFixed(3);
      function cx0() { return l + w / 2 + 8; }
    };

    // initial (pre-intro) state, set before first paint of the page content
    heroMeasure();
    if (!RM) {
      gsap.set(qsa('.hl > span', hero), { yPercent: 115 });
      gsap.set(qsa('.hero__word span', hero), { yPercent: 102 });
      gsap.set(qsa('.hero__top > *, .hero__side li, .hero__scroll, .hero__lead', hero), { autoAlpha: 0 });
      gsap.set(H.zoom, { scale: 1.35 });
      gsap.set(H.dims, { opacity: 0 });
      if (H.outline) { var ol = H.outline.getTotalLength(); H.outline.style.strokeDasharray = ol + ' ' + ol; H.outline.style.strokeDashoffset = ol; }
    } else { heroS.intro = 1; heroRender(); }

    // scroll: the arch opens to a full-bleed rectangle (pinned scrub)
    var htl = gsap.timeline({
      scrollTrigger: {
        trigger: hero, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * (isDesk() ? 1.15 : .95)); },
        pin: true, scrub: .6, invalidateOnRefresh: true, onRefresh: function () { if (!hero.__lock) heroMeasure(); }
      }
    });
    htl.to(heroS, { p: 1, duration: 1, ease: 'none', onUpdate: heroRender }, 0)
      .to(H.lines, { autoAlpha: 0, duration: .16, ease: 'none' }, 0)
      .to(H.fadeOut, { autoAlpha: 0, duration: .18, ease: 'none' }, 0)
      .to(H.head, { y: function () { return -innerHeight * .55; }, duration: 1, ease: 'none' }, 0)
      .to(H.word, { y: function () { return -innerHeight * .1; }, duration: 1, ease: 'none' }, 0)
      .fromTo(H.img, { scale: 1.14 }, { scale: 1, duration: 1, ease: 'none' }, 0)
      .fromTo(H.cap, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .14, ease: 'none' }, .84);
  }

  function heroIntro() {
    if (!hero || RM) return;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(heroS, { intro: 1, duration: 2, ease: 'expo.inOut', onUpdate: function () { if (heroS.p < .001) heroRender(); else heroRender(); } }, 0)
      .to(H.zoom, { scale: 1, duration: 2.6, ease: 'expo.out' }, .25)
      .to(qsa('.hl > span', hero), { yPercent: 0, duration: 1.5, stagger: .1 }, .35)
      .to(qsa('.hero__word span', hero), { yPercent: 0, duration: 1.6, stagger: .06 }, .55)
      .to(qsa('.hero__top > *', hero), { autoAlpha: 1, duration: .9, stagger: .06, ease: 'power2.out' }, .9)
      .to(qsa('.hero__lead, .hero__side li, .hero__scroll', hero), { autoAlpha: 1, duration: .9, stagger: .06, ease: 'power2.out' }, 1.2);
    if (H.outline) tl.to(H.outline, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 1.2);
    tl.to(H.dims, { opacity: 1, duration: 1, ease: 'power1.out' }, 1.7);
  }

  /* ═════════ SELECTED WORK ═════════ */
  var work = qs('#work');
  var workIdx = -1;
  function workSet(i) {
    if (i === workIdx) return; workIdx = i;
    var n = qs('.work__n > span', work), nm = qs('.work__name > span', work);
    gsap.to(n, { yPercent: -100 * i / n.children.length, duration: .9, ease: 'expo.out', overwrite: true });
    gsap.to(nm, { yPercent: -100 * i / nm.children.length, duration: .9, ease: 'expo.out', overwrite: true });
  }
  if (work) {
    var panels = qsa('.wp', work), proj = panels.filter(function (p) { return !p.classList.contains('wp--end'); });
    var prog = qs('.work__prog i', work), view = qs('.work__view', work);
    Core.onHScroll = function (sec, tw) {
      if (sec !== work) return;
      var stt = tw.scrollTrigger;
      proj.forEach(function (p) {
        var img = qs('.wp__img img', p), box = qs('.wp__img', p), dp = +p.dataset.depth || 1;
        gsap.fromTo(img, { xPercent: 6 * dp }, { xPercent: -6 * dp, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
        gsap.fromTo(box, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 104%', end: 'left 62%', scrub: true } });
        gsap.fromTo(qs('.wp__meta', p), { x: 60 * dp }, { x: 0, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'left 40%', scrub: true } });
      });
      Core.onTick(function () {
        if (!isDesk()) return;
        prog.style.transform = 'scaleX(' + stt.progress.toFixed(4) + ')';
        var lim = innerWidth * .58, k = 0;
        proj.forEach(function (p, i) { if (p.getBoundingClientRect().left < lim) k = i; });
        workSet(k);
      });
    };
    // touch / narrow: native swipe track
    view.addEventListener('scroll', function () {
      if (isDesk()) return;
      var max = view.scrollWidth - view.clientWidth, x = view.scrollLeft;
      prog.style.transform = 'scaleX(' + (max > 0 ? x / max : 0).toFixed(4) + ')';
      var k = 0, vl = view.getBoundingClientRect().left + view.clientWidth * .5;
      proj.forEach(function (p, i) { if (p.getBoundingClientRect().left < vl) k = i; });
      workSet(k);
    }, { passive: true });
    workSet(0);
  }

  /* ═════════ PRINCIPLES: plan layers ═════════ */
  var plan = qs('svg[data-plan]');
  var planOn = -1;
  function planSet(n) {
    if (n === planOn) return; planOn = n;
    plan.setAttribute('data-on', n);
    for (var k = 1; k <= 4; k++) {
      var on = k <= n, lay = qs('.l' + k, plan), txt = qs('.l' + k + 't', plan);
      if (!lay) continue;
      var ds = qsa('.d', lay);
      gsap.to(ds, { strokeDashoffset: function (i, e) { return on ? 0 : e.__len; }, duration: on ? 1.4 : .6, ease: 'power2.inOut', stagger: on ? .04 : 0, overwrite: true });
      if (lay.hasAttribute('data-fade')) gsap.to(lay, { opacity: on ? 1 : 0, duration: .8, overwrite: true });
      gsap.to(qsa('.f, .sun', lay), { opacity: on ? 1 : 0, duration: .8, delay: on ? .4 : 0, overwrite: true });
      if (txt) gsap.to(txt, { opacity: on ? 1 : 0, duration: .7, delay: on ? .6 : 0, overwrite: true });
    }
    var names = ['', 'Daylight', 'Materials', 'The arch', 'Rooms'];
    var c = qs('.js-plan-state'); if (c && n > 0) c.textContent = '0' + n + ' / ' + names[n];
    qsa('.pr').forEach(function (p) { p.classList.toggle('is-on', +p.dataset.l === n); });
  }
  function initPlan() {
    if (!plan) return;
    var p = prep(plan);
    var base = qsa('.l0 .d', plan);
    if (!RM) {
      gsap.set(qsa('.lay:not(.l0):not(.l0t)', plan), { opacity: 1 });
      qsa('.lay', plan).forEach(function (l) { if (l.hasAttribute('data-fade')) gsap.set(l, { opacity: 0 }); });
      gsap.set(qsa('.f, .sun', plan), { opacity: 0 });
      ST.create({ trigger: plan, start: 'top 80%', once: true, onEnter: function () {
        gsap.to(base, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: .035 });
        gsap.to(qs('.l0t', plan), { opacity: 1, duration: 1, delay: 1.2 });
        gsap.to(qsa('.l0 .f', plan), { opacity: 1, duration: 1, delay: 1 });
      } });
    } else { gsap.set(p.fades, { opacity: 1 }); }
    qsa('.pr').forEach(function (pr) {
      var n = +pr.dataset.l;
      ST.create({ trigger: pr, start: 'top 62%', end: 'bottom 62%', onToggle: function (self) { if (self.isActive) planSet(n); else if (n === 1 && self.direction < 0) planSet(0); } });
    });
  }

  /* ═════════ PROJECTS: filter, sort, Flip, index preview ═════════ */
  var pgrid = qs('.pgrid');
  var peekSrc = {};
  if (pgrid) {
    // clone drawings for the preview before they are prepared for animation
    qsa('.pc', pgrid).forEach(function (c) {
      var m = qs('.pc__media', c), k = c.dataset.key;
      var img = qs('img', m), svg = qs('svg', m);
      if (img) peekSrc[k] = '<img src="' + img.getAttribute('src') + '" alt="" style="object-position:' + (img.style.objectPosition || '50% 50%') + '">';
      else if (svg) peekSrc[k] = '<div class="dbox">' + svg.outerHTML.replace(/id="([^"]+)"/g, 'id="$1-pk"').replace(/url\(#([^)]+)\)/g, 'url(#$1-pk)').replace('data-draw="once"', '') + '</div>';
    });
  }
  var SPANS = { 1: [7], 2: [7, 5], 3: [4, 4, 4], 4: [7, 5, 5, 7], 5: [7, 5, 4, 4, 4], 6: [7, 5, 4, 4, 4, 12], 7: [7, 5, 4, 4, 4, 6, 6], 8: [7, 5, 4, 4, 4, 5, 7, 12], 9: [7, 5, 4, 4, 4, 5, 7, 6, 6] };
  var MSPANS = { 9: [0, 6, 6, 0, 6, 6, 0, 6, 6], 4: [0, 6, 6, 0], 3: [0, 6, 6], 2: [6, 6], 1: [0] };
  function initProjects() {
    if (!pgrid) return;
    var cards = qsa('.pc', pgrid), list = qs('.idx__list'), rows = qsa('.idx__row', list);
    var cur = { f: 'all', s: 'index' };
    function layout() {
      var vis = cards.filter(function (c) { return !c.classList.contains('is-out'); });
      var sp = SPANS[vis.length] || SPANS[9], ms = MSPANS[vis.length] || [];
      vis.forEach(function (c, i) { c.dataset.span = sp[i] || 4; if (ms[i]) c.dataset.mspan = ms[i]; else c.removeAttribute('data-mspan'); });
    }
    function cmp(a, b) {
      if (cur.s === 'year') return (+b.dataset.year - +a.dataset.year) || (+a.dataset.no - +b.dataset.no);
      if (cur.s === 'name') return a.dataset.name.localeCompare(b.dataset.name);
      return +a.dataset.no - +b.dataset.no;
    }
    function drawVisible() {
      cards.forEach(function (c) { var s = qs('svg[data-draw]', c); if (s && !s.__drawn && !c.classList.contains('is-out') && c.getBoundingClientRect().top < innerHeight) drawTl(s); });
    }
    function apply(anim) {
      var state = anim && !RM && window.Flip ? Flip.getState(cards.concat(rows)) : null;
      cards.forEach(function (c) { c.classList.toggle('is-out', !(cur.f === 'all' || c.dataset.type === cur.f)); });
      rows.forEach(function (r) { r.classList.toggle('is-out', !(cur.f === 'all' || r.dataset.type === cur.f)); });
      cards.slice().sort(cmp).forEach(function (c) { pgrid.appendChild(c); });
      rows.slice().sort(cmp).forEach(function (r) { list.appendChild(r); });
      layout();
      var cnt = qs('.js-count'); if (cnt) cnt.textContent = ('0' + cards.filter(function (c) { return !c.classList.contains('is-out'); }).length).slice(-2);
      if (!state) { ST.refresh(); return; }
      Flip.from(state, {
        duration: 1, ease: 'expo.inOut', absolute: true, stagger: .025, zIndex: 5,
        onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9, delay: .35, ease: 'expo.out' }); },
        onLeave: function (els) { return gsap.to(els, { opacity: 0, scale: .94, duration: .45, ease: 'power2.in' }); },
        onComplete: function () { gsap.set(cards.concat(rows), { clearProps: 'transform,opacity,scale' }); ST.refresh(); drawVisible(); }
      });
    }
    qsa('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (cur.f === b.dataset.filter) return;
        cur.f = b.dataset.filter;
        qsa('[data-filter]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        apply(true);
        var top = qs('#archive');
        if (top && top.getBoundingClientRect().top < -10 && Core.lenis) Core.lenis.scrollTo(top, { duration: 1.2, offset: -10 });
      });
    });
    qsa('[data-sort]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (cur.s === b.dataset.sort) return;
        cur.s = b.dataset.sort;
        qsa('[data-sort]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        apply(true);
      });
    });
    layout();

    // card reveal
    if (!RM) {
      gsap.set(cards, { autoAlpha: 0, y: 60 });
      ST.batch(cards, { start: 'top 92%', once: true, onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .09 }); } });
      ST.create({ trigger: list, start: 'top 85%', once: true, onEnter: function () {
        gsap.fromTo(rows, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .05 });
      } });
      gsap.set(rows, { autoAlpha: 0 });
    }

    // index: preview following the cursor
    var peek = qs('.peek');
    if (peek && Core.FINE && !RM) {
      var items = {};
      rows.forEach(function (r) {
        var k = r.dataset.key; if (!peekSrc[k]) return;
        var w = d.createElement('div'); w.className = 'peek__it'; w.style.cssText = 'position:absolute;inset:0;clip-path:inset(100% 0 0 0)';
        w.innerHTML = peekSrc[k]; peek.insertBefore(w, qs('.lbl', peek)); items[k] = w;
        var s = qs('svg', w); if (s) { s.removeAttribute('data-draw'); }
      });
      var cap = qs('.lbl', peek);
      gsap.set(peek, { xPercent: -50, yPercent: -50, scale: .85 });
      var xT = gsap.quickTo(peek, 'x', { duration: .75, ease: 'power3' }), yT = gsap.quickTo(peek, 'y', { duration: .75, ease: 'power3' }), rT = gsap.quickTo(peek, 'rotation', { duration: 1, ease: 'power3' });
      var lastX = 0, active = null, z = 1;
      list.addEventListener('mousemove', function (e) {
        xT(e.clientX + innerWidth * .07); yT(e.clientY); rT(clamp((e.clientX - lastX) * .35, -7, 7)); lastX = e.clientX;
        clearTimeout(list.__t); list.__t = setTimeout(function () { rT(0); }, 90);
      });
      list.addEventListener('mouseenter', function (e) { gsap.set(peek, { x: e.clientX + innerWidth * .07, y: e.clientY }); gsap.to(peek, { autoAlpha: 1, scale: 1, duration: .7, ease: 'expo.out' }); });
      list.addEventListener('mouseleave', function () { gsap.to(peek, { autoAlpha: 0, scale: .85, duration: .5, ease: 'expo.out' }); active = null; });
      rows.forEach(function (r) {
        r.addEventListener('mouseenter', function () {
          var k = r.dataset.key, it = items[k]; if (!it || active === k) return; active = k;
          it.style.zIndex = ++z;
          gsap.fromTo(it, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .85, ease: 'expo.out', overwrite: true });
          var s = qs('svg', it);
          if (s) { var pp = prep(s); gsap.fromTo(pp.els, { strokeDashoffset: function (i, e) { return e.__len; } }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: .03, overwrite: true }); gsap.fromTo(pp.fades, { opacity: 0 }, { opacity: 1, duration: .6, delay: .5, overwrite: true }); }
          cap.innerHTML = '<span>' + r.dataset.name + '</span><span>' + r.dataset.status + '</span>';
        });
      });
    }
  }

  /* ═════════ CONTACT: form ═════════ */
  var form = qs('form[data-demo]');
  var SCOPE = [
    ['Modest', 'A single room, a kitchen or a bathroom.'],
    ['Measured', 'An apartment or a careful renovation.'],
    ['Considered', 'A new house, or a full interior.'],
    ['Generous', 'A larger house or a small public building.'],
    ['Open', 'We would rather talk it through first.']
  ];
  function initForm() {
    if (!form) return;
    // stepped scope slider
    var rng = qs('.rng__ctl input', form), fill = qs('.rng__fill', form), thumb = qs('.rng__thumb', form), ctl = qs('.rng__ctl', form);
    var val = qs('.rng__val > span', form), desc = qs('.rng__desc', form), labs = qsa('.rng__labels span', form), last = -1;
    function setR(anim) {
      var v = +rng.value, pct = v / 4, w = ctl.clientWidth;
      gsap.to(thumb, { x: pct * w, duration: anim ? .55 : 0, ease: 'expo.out', overwrite: true });
      gsap.to(fill, { width: pct * w, duration: anim ? .55 : 0, ease: 'expo.out', overwrite: true });
      labs.forEach(function (l, i) { l.classList.toggle('is-on', i === v); });
      rng.setAttribute('aria-valuetext', SCOPE[v][0] + '. ' + SCOPE[v][1]);
      if (v !== last) {
        var dir = v > last ? 1 : -1;
        if (anim && !RM) {
          gsap.timeline().to(val, { yPercent: -110 * dir, duration: .25, ease: 'power2.in' }).add(function () { val.textContent = SCOPE[v][0]; desc.textContent = SCOPE[v][1]; }).fromTo(val, { yPercent: 110 * dir }, { yPercent: 0, duration: .6, ease: 'expo.out' });
        } else { val.textContent = SCOPE[v][0]; desc.textContent = SCOPE[v][1]; }
        last = v;
      }
    }
    rng.addEventListener('input', function () { setR(true); });
    rng.addEventListener('pointerdown', function () { ctl.classList.add('is-drag'); });
    addEventListener('pointerup', function () { ctl.classList.remove('is-drag'); });
    addEventListener('resize', function () { setR(false); });
    labs.forEach(function (l, i) { l.style.cursor = 'pointer'; l.addEventListener('click', function () { rng.value = i; setR(true); }); });
    setR(false);

    // message: autosize + count
    var ta = qs('textarea', form), cnt = qs('.fi__count', form);
    function grow() { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; if (cnt) cnt.textContent = ta.value.length + ' / 1200'; }
    ta.addEventListener('input', grow); grow();

    // validation feedback (runs before the core handler)
    var chips = qs('.chips', form);
    function chipCheck() { chips.classList.toggle('is-invalid', !qs('input:checked', chips)); }
    qsa('input', chips).forEach(function (i) { i.addEventListener('change', chipCheck); });
    form.addEventListener('submit', function () { form.classList.add('tried'); chipCheck(); });

    // success
    var ok = qs('.ok');
    form.addEventListener('demo:sent', function () {
      var name = (qs('#f-name', form).value || '').trim().split(/\s+/)[0] || 'there';
      var type = qs('input[name=type]:checked', form);
      qs('.js-ok-name').textContent = name.charAt(0).toUpperCase() + name.slice(1);
      qs('.js-ok-type').textContent = type ? type.value : '—';
      qs('.js-ok-scope').textContent = SCOPE[+rng.value][0];
      qs('.js-ok-time').textContent = cph().wd + ' ' + cph().time;
      ST.refresh();
      requestAnimationFrame(function () {
        var y = Math.max(0, ok.getBoundingClientRect().top + window.scrollY - 120);
        if (Core.lenis) { Core.lenis.resize(); Core.lenis.scrollTo(y, { duration: 1.4, force: true }); } else window.scrollTo(0, y);
      });
      if (RM) return;
      var arcs = qsa('.ok-a', ok);
      arcs.forEach(function (e) { var L = Math.ceil(e.getTotalLength()) + 2; e.__len = L; e.style.strokeDasharray = L + ' ' + L; e.style.strokeDashoffset = L; });
      var tl = gsap.timeline({ delay: .3 });
      tl.fromTo(qsa('.ok__txt > *', ok), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .08 }, .2)
        .to(arcs, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: .12 }, 0)
        .fromTo(qs('.ok-sun', ok), { attr: { cy: 420 } }, { attr: { cy: 238 }, duration: 2.4, ease: 'expo.out' }, .9)
        .fromTo(qs('.ok-sky', ok), { opacity: 0 }, { opacity: 1, duration: 1.2 }, .6)
        .fromTo(qs('.ok-h', ok), { opacity: 0 }, { opacity: .5, duration: 1 }, 1.4);
    });
    var again = qs('.js-again');
    if (again) again.addEventListener('click', function () {
      form.reset(); form.classList.remove('is-sent', 'tried');
      qsa('[data-ok]', form).forEach(function (x) { x.hidden = true; });
      qsa('[data-ok-hide]', form).forEach(function (x) { x.hidden = false; });
      last = -1; rng.value = 2; setR(false); grow();
      ST.refresh();
      if (Core.lenis) Core.lenis.scrollTo(qs('#enquiry'), { duration: 1, offset: -80 });
    });
  }

  /* ═════════ footer wordmark ═════════ */
  function initFooter() {
    var w = qs('.ft__word'); if (!w || RM) return;
    gsap.fromTo(qsa('span', w), { yPercent: 100 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: w, start: 'top 98%', once: true } });
  }

  /* ═════════ page heads (projects / contact) ═════════ */
  var hasHead = !!qs('.js-head');
  if (!RM && hasHead) { gsap.set(qsa('.js-head .hl > span'), { yPercent: 115 }); gsap.set(qsa('.js-head-fade'), { autoAlpha: 0 }); }

  // drawings & projects need measurements before core builds its triggers
  initPlan();
  initProjects();

  Core.onReady(function () {
    initDrawings();
    initForm();
    initFooter();
    heroIntro();
    if (!RM && hasHead) {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to(qsa('.js-head .hl > span'), { yPercent: 0, duration: 1.5, stagger: .1 }, .05)
        .to(qsa('.js-head-fade'), { autoAlpha: 1, y: 0, duration: 1.1, stagger: .07 }, .45);
    }
    addEventListener('resize', function () { clearTimeout(hero && hero.__rt); if (hero) hero.__rt = setTimeout(heroMeasure, 120); });
  });
})();
