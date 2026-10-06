/* ───────── EVEN — site script (all pages) ───────── */
(function () {
  'use strict';
  var d = document, root = d.documentElement, gsap = window.gsap, ST = window.ScrollTrigger;
  if (!window.Core || !gsap) return;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var RM = Core.RM, FINE = Core.FINE;
  var VEIL = { bg: '#eef2f1', ink: '#14302c', label: 'Even' };
  var mobile = function () { return innerWidth < 900; };

  Core.config({
    veilBg: VEIL.bg, veilInk: VEIL.ink, veilCols: 5,
    preloader: { key: 'even', brand: 'Even', top: 'Even — dental studio', topRight: 'Marylebone, London', bottom: 'Quietly better teeth', duration: 1.6 }
  });
  ST.config({ ignoreMobileResize: true });

  /* Core passes undefined veil colours for links without data-veil*: give every internal link the brand veil */
  $$('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:|data:|blob:|https?:)/i.test(h)) return;
    if (!a.dataset.veil) a.dataset.veil = VEIL.bg;
    if (!a.dataset.veilInk) a.dataset.veilInk = VEIL.ink;
    if (!a.dataset.veilLabel) a.dataset.veilLabel = VEIL.label;
  });

  /* ───────── preloader: soft expanding pill instead of a bar ───────── */
  function preOrb() {
    var p = $('.pre'); if (!p) return;
    var orb = Core.el('div', 'pre__orb'), ring = Core.el('div', 'pre__ring');
    p.appendChild(orb); p.appendChild(ring);
    var W = Math.min(innerWidth * 0.62, 620);
    gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0.6 });
    gsap.timeline()
      .to(orb, { width: W * 0.42, height: W * 0.42, duration: 0.8, ease: 'expo.out' }, 0.05)
      .to(orb, { width: W, height: W * 0.42, duration: 0.95, ease: 'power3.inOut' }, 0.7)
      .to(ring, { opacity: 1, scale: 1, duration: 0.3 }, 1.45)
      .to(ring, { scale: 1.25, opacity: 0, duration: 0.9, ease: 'power2.out' }, 1.6);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', preOrb); else preOrb();

  /* ───────── common UI ───────── */
  Core.onMenu = function (open) { var m = $('#menu'); if (m) m.setAttribute('aria-hidden', String(!open)); };
  var menuPanel = $('#menu'); if (menuPanel) menuPanel.setAttribute('aria-hidden', 'true');

  d.addEventListener('mouseover', function (e) { root.classList.toggle('cur-dark', !!(e.target.closest && e.target.closest('.is-dark'))); });

  $$('[data-top]').forEach(function (b) { b.addEventListener('click', function () { Core.lenis ? Core.lenis.scrollTo(0, { duration: 2 }) : scrollTo({ top: 0, behavior: 'smooth' }); }); });

  // floating "Book a visit"
  var fab = $('[data-fab]');
  Core.onReady(function () {
    if (fab) {
      var first = $('main > section'), foot = $('.foot'), past = false, atFoot = false;
      var upd = function () { fab.classList.toggle('is-on', past && !atFoot); };
      ST.create({ trigger: first, start: 'bottom 70%', onEnter: function () { past = true; upd(); }, onLeaveBack: function () { past = false; upd(); } });
      if (foot) ST.create({ trigger: foot, start: 'top 88%', onEnter: function () { atFoot = true; upd(); }, onLeaveBack: function () { atFoot = false; upd(); } });
      $$('[data-fab-off]').forEach(function (s) { ST.create({ trigger: s, start: 'top 60%', end: 'bottom 70%', onToggle: function (self) { fab.classList.toggle('is-off', self.isActive && innerWidth >= 1024); } }); });
      $$('.is-dark').forEach(function (s) { ST.create({ trigger: s, start: 'top bottom-=60', end: 'bottom bottom-=60', onToggle: function (self) { fab.classList.toggle('on-dark', self.isActive); } }); });
    }
    // arriving with a hash (e.g. index.html#shade)
    if (location.hash && location.hash.length > 1) {
      var t = null; try { t = $(location.hash); } catch (e) {}
      if (t) setTimeout(function () { ST.refresh(); Core.lenis ? Core.lenis.scrollTo(t, { duration: 1.6, offset: -10 }) : t.scrollIntoView(); }, 450);
    }
  });

  /* ───────── HERO: pill → card ───────── */
  function hero() {
    var h = $('.hero'); if (!h) return;
    var pill = $('.hero__pill', h), inner = $('.hero__pill-in', h), img = $('img', pill), slot = $('.hero__slot', h), card = $('.hero__cardslot', h);
    var spans = $$('.hl > span', h), lines = $$('.hl', h), chips = $$('.chip', h), mids = $$('.chip__mid', h), ins = $$('.chip__in', h);
    var foot = $$('.hero__foot > *', h), meta = $$('.hero__meta > *', h), cap = $$('.hero__cap .cl > span', h), scrim = $('.hero__scrim', h);
    var R = function (el) { return { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight }; };
    if (RM) return;
    gsap.set(cap, { yPercent: 110 });
    Core.onReady(function () {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(spans, { yPercent: 140, duration: 1.6, stagger: 0.12 }, 0)
        .fromTo(inner, { clipPath: 'inset(44% 0% 44% 0% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px)', duration: 1.9, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
        .from(img, { scale: 1.45, duration: 2.6 }, 0.1)
        .from(ins, { scale: 0.5, autoAlpha: 0, duration: 1.2, stagger: 0.13, ease: 'back.out(1.7)' }, 1.0)
        .from(meta.concat(foot), { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.07 }, 0.55);
      ins.forEach(function (c, i) { gsap.to(c, { y: [-7, 8, -6][i] || 6, duration: 2.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 }); });
      if (FINE) {
        var qs = mids.map(function (m) { return [gsap.quickTo(m, 'x', { duration: 1.2, ease: 'power3' }), gsap.quickTo(m, 'y', { duration: 1.2, ease: 'power3' })]; });
        h.addEventListener('mousemove', function (e) {
          var nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
          qs.forEach(function (q, i) { var k = [26, -34, 18][i]; q[0](nx * k); q[1](ny * k); });
        });
      }

      var s = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: h, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * (mobile() ? 0.95 : 1.2)); }, pin: true, scrub: 0.6, invalidateOnRefresh: true, refreshPriority: 10, anticipatePin: 1 }
      });
      s.fromTo(pill, {
        left: function () { return R(slot).left; }, top: function () { return R(slot).top; },
        width: function () { return R(slot).width; }, height: function () { return R(slot).height; },
        borderRadius: function () { return R(slot).width / 2; }
      }, {
        left: function () { return R(card).left; }, top: function () { return R(card).top; },
        width: function () { return R(card).width; }, height: function () { return R(card).height; },
        borderRadius: function () { return mobile() ? 28 : 40; }, ease: 'power2.inOut', duration: 0.74
      }, 0)
        .fromTo(img, { objectPosition: '60% 40%' }, { objectPosition: function () { return mobile() ? '58% 34%' : '60% 27%'; }, ease: 'power2.inOut', duration: 0.74 }, 0)
        .to(lines[0], { y: -70, duration: 0.6 }, 0).to(lines[1], { y: -40, duration: 0.6 }, 0).to(lines[2], { y: -16, duration: 0.6 }, 0)
        .to(foot, { y: 40, autoAlpha: 0, duration: 0.25, stagger: 0.03 }, 0)
        .to(chips[0], { x: -150, y: -170, rotation: -7, autoAlpha: 0, duration: 0.5 }, 0.04)
        .to(chips[1], { x: 170, y: -50, rotation: 6, autoAlpha: 0, duration: 0.5 }, 0.02)
        .to(chips[2], { x: -110, y: 150, rotation: -5, autoAlpha: 0, duration: 0.5 }, 0.06)
        .to(scrim, { opacity: 1, duration: 0.3 }, 0.6)
        .to(cap, { yPercent: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out' }, 0.64)
        .to({}, { duration: 0.12 });
    });
  }

  /* ───────── SHADE GUIDE ───────── */
  var SH = [
    { c: '0M1', hex: '#f5f2ea', n: 'Bleach white', w: 1, note: 'The brightest shade we’ll take anyone to, and only when the enamel is thick enough to carry it. Striking in daylight.' },
    { c: '0M3', hex: '#f0e9da', n: 'Soft white', w: 1, note: 'Our most requested whitening result. Clearly brighter, and it still reads as natural next to skin and lips.' },
    { c: 'B1', hex: '#ece3cf', n: 'Light natural', w: 0, note: 'The lightest natural shade. Common in your twenties, and where many whitening patients happily stop.' },
    { c: 'A1', hex: '#e9dbc2', n: 'Fresh natural', w: 0, note: 'Light with a little warmth. Often seen in people who don’t drink much tea, coffee or red wine.' },
    { c: 'B2', hex: '#e6d6b8', n: 'Even natural', w: 0, note: 'A clean, slightly yellow shade that reads as bright from across a room.' },
    { c: 'A2', hex: '#e2cfae', n: 'Classic natural', w: 0, note: 'The most common shade we see in adults. Healthy and warm, and the usual starting point for whitening.' },
    { c: 'C1', hex: '#dbd0bb', n: 'Cool natural', w: 0, note: 'Lighter in colour but slightly grey. Whitening helps, though more slowly than with yellow shades.' },
    { c: 'A3', hex: '#dbc5a0', n: 'Warm natural', w: 0, note: 'Typical of tea and coffee drinkers over forty. Healthy, warm, and very responsive to whitening.' },
    { c: 'B3', hex: '#d8bf91', n: 'Honey natural', w: 0, note: 'A deeper yellow shade. Whitening tends to work well here — expect a clear change within two weeks.' },
    { c: 'A3.5', hex: '#d1b68e', n: 'Deep natural', w: 0, note: 'Common with age, as enamel thins and the warmer dentine underneath starts to show through.' },
    { c: 'C3', hex: '#c6b597', n: 'Grey natural', w: 0, note: 'Grey-brown shades lighten less with gel alone. Bonding or veneers may suit better — we’ll talk it through.' },
    { c: 'A4', hex: '#c4a67e', n: 'Darkest common', w: 0, note: 'The deepest shade on a classic guide. Usually a mix of age, diet and wear, and still perfectly healthy.' }
  ];
  var CROWN = 'M118 236C106 300 84 380 80 448C77 495 80 524 96 534C130 546 175 548 206 546C245 544 282 540 304 528C324 516 330 490 326 452C320 380 300 300 284 236C250 206 152 206 118 236Z';
  function mix(a, b, t) {
    var p = function (h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); };
    var A = p(a), B = p(b);
    return '#' + A.map(function (v, i) { return ('0' + Math.round(v + (B[i] - v) * t).toString(16)).slice(-2); }).join('');
  }
  function shade() {
    var sec = $('.shade'); if (!sec) return;
    var strip = $('.shade__strip', sec), code = $('.shade__code-in', sec), tog = $('[data-whiten]', sec), tooth = $('.tooth', sec);
    var out = { status: $('[data-sh=status]', sec), code: $('[data-sh=code]', sec), name: $('[data-sh=name]', sec), note: $('[data-sh=note]', sec) };
    var sel = 7, white = false, shown = -1;
    SH.forEach(function (s, i) {
      var b = d.createElement('button');
      b.type = 'button'; b.className = 'sw'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', s.c + ', ' + s.n); b.dataset.i = i;
      b.innerHTML = '<span class="sw__after">After</span><i class="sw__stem"></i><span class="sw__tab"><svg viewBox="70 200 266 356" aria-hidden="true"><defs><linearGradient id="swg' + i + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + mix(s.hex, '#a07a40', 0.26) + '"/><stop offset=".38" stop-color="' + s.hex + '"/><stop offset=".74" stop-color="' + mix(s.hex, '#ffffff', 0.16) + '"/><stop offset="1" stop-color="' + mix(s.hex, '#9aaeb8', 0.55) + '"/></linearGradient></defs>' +
        '<path d="' + CROWN + '" fill="url(#swg' + i + ')" stroke="rgba(20,48,44,.42)" stroke-width="5"/><ellipse cx="152" cy="372" rx="16" ry="100" fill="#fff" opacity=".45" transform="rotate(-6 152 372)"/></svg></span><span class="sw__code">' + s.c + '</span>';
      strip.appendChild(b);
    });
    var sws = $$('.sw', strip);
    function jump(i) { return /^C/.test(SH[i].c) ? 2 : 3; }
    function render(i, w, preview) {
      var t = w ? Math.max(0, i - jump(i)) : i, s = SH[t], diff = i - t;
      sec.style.setProperty('--shade', s.hex);
      sec.classList.toggle('is-white', !!(w || s.w));
      if (t !== shown && shown !== -1 && !RM) {
        gsap.fromTo(code, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out' });
        gsap.fromTo(tooth, { scale: 0.975 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1,0.6)', transformOrigin: '50% 70%' });
      }
      shown = t; code.textContent = s.c;
      if (w) {
        out.status.textContent = diff ? 'After professional whitening — ' + diff + (diff > 1 ? ' shades' : ' shade') + ' lighter' : 'Already at the light end';
        out.code.textContent = s.c; out.name.textContent = diff ? 'from ' + SH[i].c + ', two weeks on' : 'no change advised';
        out.note.textContent = diff ? 'Custom trays and a gentle gel at home for about two weeks. Results usually hold for years with a top-up every year or so.' : 'You’re already at the light end of the guide. Going brighter tends to look flat — we’d suggest leaving it.';
      } else {
        out.status.textContent = s.w ? 'After professional whitening' : 'Natural enamel';
        out.code.textContent = s.c; out.name.textContent = s.n; out.note.textContent = s.note;
      }
      sws.forEach(function (b, k) { b.classList.toggle('is-target', !!w && k === t && diff > 0); });
      if (!preview) sws.forEach(function (b, k) { b.setAttribute('aria-checked', String(k === sel)); b.tabIndex = k === sel ? 0 : -1; });
    }
    function choose(i, focus) { sel = i; white = false; tog.setAttribute('aria-pressed', 'false'); render(sel, false); if (focus) sws[i].focus(); }
    sws.forEach(function (b, i) {
      b.addEventListener('click', function () { choose(i); });
      if (FINE) b.addEventListener('mouseenter', function () { render(i, false, true); });
    });
    if (FINE) strip.addEventListener('mouseleave', function () { render(sel, white); });
    strip.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (e.key === 'Home') { e.preventDefault(); choose(0, true); }
      else if (e.key === 'End') { e.preventDefault(); choose(SH.length - 1, true); }
      else if (k) { e.preventDefault(); choose((sel + k + SH.length) % SH.length, true); }
    });
    tog.addEventListener('click', function () { white = !white; tog.setAttribute('aria-pressed', String(white)); render(sel, white); });
    render(sel, false);
  }

  /* ───────── treatment words: cursor-following pill preview ───────── */
  function tindex() {
    var w = $('.tindex__words'), peek = $('.tindex .peek'); if (!w || !peek || !FINE || RM) return;
    var imgs = $$('img', peek), act = -1, lx = 0;
    gsap.set(peek, { xPercent: -50, yPercent: -50, scale: 0.7 });
    var xT = gsap.quickTo(peek, 'x', { duration: 0.7, ease: 'power3' }), yT = gsap.quickTo(peek, 'y', { duration: 0.7, ease: 'power3' }), rT = gsap.quickTo(peek, 'rotation', { duration: 0.9, ease: 'power3' });
    w.addEventListener('mousemove', function (e) { xT(e.clientX + 30); yT(e.clientY); rT(Math.max(-10, Math.min(10, (e.clientX - lx) * 0.5))); lx = e.clientX; clearTimeout(w.__t); w.__t = setTimeout(function () { rT(0); }, 90); });
    $$('a[data-peek]', w).forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        var i = +a.dataset.peek;
        gsap.to(peek, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
        if (i === act) return;
        imgs.forEach(function (im) { im.style.zIndex = 0; }); imgs[i].style.zIndex = 2;
        gsap.fromTo(imgs[i], { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.2 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.9, ease: 'expo.out', overwrite: true });
        act = i;
      });
      a.addEventListener('mouseleave', function () { gsap.to(peek, { autoAlpha: 0, scale: 0.7, duration: 0.5, ease: 'expo.out' }); });
    });
  }

  /* ───────── testimonials: drag slider with inertia ───────── */
  function slider() {
    var sec = $('.voices'); if (!sec) return;
    var vp = $('.voices__vp', sec), track = $('.voices__track', sec), cards = $$('.vcard', track), bar = $('.voices__bar i', sec), cnt = $('.voices__count b', sec);
    var x = 0, v = 0, min = 0, drag = false, sx = 0, sp = 0, lx = 0, lt = 0, glide = null, moved = 0, cur = -1;
    function bounds() { min = Math.min(0, vp.clientWidth - parseFloat(getComputedStyle(vp).paddingLeft) * 2 - track.scrollWidth); }
    bounds(); addEventListener('resize', bounds);
    function stops() { return cards.map(function (c) { return Math.max(min, -(c.offsetLeft - cards[0].offsetLeft)); }); }
    function nearest() { var s = stops(), b = 0; s.forEach(function (p, i) { if (Math.abs(p - x) < Math.abs(s[b] - x)) b = i; }); return x <= min + 2 ? cards.length - 1 : b; }
    function go(i) { i = Math.max(0, Math.min(cards.length - 1, i)); glide = stops()[i]; v = 0; }
    vp.addEventListener('pointerdown', function (e) {
      if (e.button) return; drag = true; glide = null; moved = 0; sx = lx = e.clientX; sp = x; lt = performance.now(); v = 0;
      vp.setPointerCapture(e.pointerId); vp.classList.add('is-drag');
    });
    vp.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var nx = sp + (e.clientX - sx), now = performance.now();
      if (nx > 0) nx *= 0.35; else if (nx < min) nx = min + (nx - min) * 0.35;
      v = (e.clientX - lx) / Math.max(1, now - lt) * 16; lx = e.clientX; lt = now; moved = Math.max(moved, Math.abs(e.clientX - sx)); x = nx;
    });
    var up = function () { if (!drag) return; drag = false; vp.classList.remove('is-drag'); if (Math.abs(v) < 0.6) go(nearest()); };
    vp.addEventListener('pointerup', up); vp.addEventListener('pointercancel', up); vp.addEventListener('lostpointercapture', up);
    vp.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); glide = null; x = Math.max(min, Math.min(0, x - e.deltaX)); v = 0; } }, { passive: false });
    vp.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(nearest() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(nearest() - 1); } });
    $('[data-prev]', sec).addEventListener('click', function () { go(nearest() - 1); });
    $('[data-next]', sec).addEventListener('click', function () { go(nearest() + 1); });
    var tilt = 0;
    gsap.ticker.add(function () {
      if (!drag) {
        if (glide !== null) { x += (glide - x) * 0.12; if (Math.abs(glide - x) < 0.3) { x = glide; glide = null; } v = 0; }
        else {
          x += v; v *= 0.93;
          if (x > 0) { x += (0 - x) * 0.18; v *= 0.5; } else if (x < min) { x += (min - x) * 0.18; v *= 0.5; }
          if (Math.abs(v) < 0.6 && Math.abs(v) > 0.05) { v = 0; go(nearest()); }
        }
      }
      var tv = drag ? v : (glide !== null ? 0 : v);
      tilt += (Math.max(-4, Math.min(4, tv * 0.25)) - tilt) * 0.15;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      if (!RM) cards.forEach(function (c) { c.style.transform = 'rotate(' + (-tilt).toFixed(3) + 'deg)'; });
      var p = min ? x / min : 0; bar.style.transform = 'scaleX(' + (0.2 + 0.8 * Math.max(0, Math.min(1, p))).toFixed(4) + ')';
      var n = nearest(); if (n !== cur) { cur = n; cnt.textContent = ('0' + (n + 1)).slice(-2); }
    });
    if (!RM) gsap.from(cards, { x: 120, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: vp, start: 'top 85%', once: true } });
  }

  /* ───────── accordion (FAQ + treatments on mobile) ───────── */
  function toggleQA(item, btn, panel, open, after) {
    item.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open));
    gsap.killTweensOf(panel);
    if (open) {
      panel.hidden = false;
      if (RM) { panel.style.height = 'auto'; return after && after(); }
      gsap.fromTo(panel, { height: panel.offsetHeight && panel.style.height ? panel.offsetHeight : 0 }, { height: 'auto', duration: 0.75, ease: 'expo.out', onComplete: function () { ST.refresh(); after && after(); } });
      gsap.fromTo(panel.firstElementChild, { y: -12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, delay: 0.08, ease: 'expo.out' });
    } else {
      if (RM) { panel.hidden = true; return; }
      gsap.to(panel, { height: 0, duration: 0.55, ease: 'expo.out', onComplete: function () { panel.hidden = true; ST.refresh(); } });
    }
  }
  function faq() {
    var items = $$('.qa'); if (!items.length) return;
    items.forEach(function (qa) {
      var b = $('.qa__q', qa), a = $('.qa__a', qa);
      b.addEventListener('click', function () {
        var open = !qa.classList.contains('is-open');
        items.forEach(function (o) { if (o !== qa && o.classList.contains('is-open')) toggleQA(o, $('.qa__q', o), $('.qa__a', o), false); });
        toggleQA(qa, b, a, open);
      });
    });
  }

  /* ───────── TREATMENTS: list + sticky stage / accordion ───────── */
  function treatments() {
    var tx = $('[data-tx]'); if (!tx) return;
    var items = $$('.tx__item', tx), stage = $('.tx__stage', tx), imgsW = $('.tx__imgs', tx), detail = $('.tx__detail', tx), tagNo = $('.tx__stage-no', tx), tagName = $('.tx__stage-name', tx);
    var act = -1, mq = matchMedia('(min-width: 1024px)');
    var imgs = items.map(function (it, i) {
      var src = $('.tx__img img', it), im = d.createElement('img');
      im.src = src.getAttribute('src'); im.alt = ''; im.style.objectPosition = src.style.objectPosition || '';
      im.style.zIndex = i === 0 ? 2 : 0; if (i) im.style.clipPath = 'inset(100% 0% 0% 0%)';
      imgsW.appendChild(im); return im;
    });
    function fill(i) {
      var src = $('.tx__panel-in', items[i]), c = src.cloneNode(true);
      var m = $('.tx__img', c); if (m) m.remove();
      detail.innerHTML = ''; detail.appendChild(c);
      tagNo.textContent = $('.tx__no', items[i]).textContent; tagName.textContent = $('.tx__name', items[i]).textContent;
    }
    function setActive(i, instant) {
      if (i === act) return;
      var dir = i > act ? 1 : -1, prev = act; act = i;
      items.forEach(function (it, k) { it.classList.toggle('is-active', k === i); $('.tx__row', it).setAttribute('aria-pressed', String(k === i)); });
      imgs.forEach(function (im, k) { im.style.zIndex = k === i ? 2 : (k === prev ? 1 : 0); });
      fill(i);
      if (instant || RM) { gsap.set(imgs[i], { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }); return; }
      gsap.fromTo(imgs[i], { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', scale: 1.18 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.05, ease: 'expo.out', overwrite: true });
      gsap.from($$('.tx__what, .tx__spec > div, .tx__cta', detail), { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' });
      gsap.fromTo([tagNo, tagName], { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
    }
    var hov;
    items.forEach(function (it, i) {
      var row = $('.tx__row', it), panel = $('.tx__panel', it);
      row.addEventListener('mouseenter', function () { if (!mq.matches) return; clearTimeout(hov); hov = setTimeout(function () { setActive(i); }, 70); });
      row.addEventListener('focus', function () { if (mq.matches) setActive(i); });
      row.addEventListener('click', function () {
        if (mq.matches) { setActive(i); return; }
        var open = !it.classList.contains('is-open');
        items.forEach(function (o) { if (o !== it && o.classList.contains('is-open')) toggleQA(o, $('.tx__row', o), $('.tx__panel', o), false); });
        toggleQA(it, row, panel, open, function () {
          if (open && Core.lenis) { var top = it.getBoundingClientRect().top; if (top < 70 || top > innerHeight * 0.5) Core.lenis.scrollTo(it, { offset: -84, duration: 1 }); }
        });
      });
    });
    var start = 0, key = location.hash.slice(1);
    items.forEach(function (it, i) { if (it.id === key) start = i; });
    setActive(start, true);
    if (key && !mq.matches) items.forEach(function (it, i) { if (i === start) { var p = $('.tx__panel', it); p.hidden = false; p.style.height = 'auto'; it.classList.add('is-open'); $('.tx__row', it).setAttribute('aria-expanded', 'true'); } });
  }

  function timeline() {
    var how = $('.how'); if (!how) return;
    var list = $('.how__steps', how), fill = $('.how__fill', how), head = $('.how__head', how);
    Core.onReady(function () {
      if (RM) { gsap.set(fill, { scaleY: 1 }); $$('.hs', how).forEach(function (s) { s.classList.add('is-on'); }); return; }
      gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: true,
        onUpdate: function (self) { head.style.transform = 'translate3d(0,' + (self.progress * list.offsetHeight).toFixed(1) + 'px,0)'; } } });
      $$('.hs', how).forEach(function (s) { ST.create({ trigger: s, start: 'top 62%', onToggle: function (self) { s.classList.toggle('is-on', self.isActive || self.progress > 0); }, end: 'max' }); });
    });
  }

  /* ───────── BOOKING: 4-step flow ───────── */
  var TX = {
    consultation: { n: 'First consultation', len: 45, who: 'Principal dentist' },
    checkup: { n: 'Check-up', len: 40, who: 'Associate dentist' },
    hygiene: { n: 'Hygiene visit', len: 60, who: 'Hygienist' },
    whitening: { n: 'Whitening fit', len: 45, who: 'Associate dentist' },
    bonding: { n: 'Composite bonding', len: 90, who: 'Principal dentist' },
    veneers: { n: 'Veneer consultation', len: 60, who: 'Principal dentist' },
    aligners: { n: 'Aligner scan', len: 45, who: 'Associate dentist' }
  };
  function booking() {
    var f = $('.bk__form'); if (!f) return;
    var steps = $$('.step', f), wrap = $('.bk__steps', f), cur = 1, N = steps.length;
    var back = $('[data-back]', f), next = $('[data-next]', f), submit = $('[data-submit]', f), hint = $('.bk__hint', f);
    var prog = $$('.prog__step', f), fillBar = $('.prog__bar i', f), sum = $('.sum'), calGrid = $('.cal__grid', f), slotsW = $('.slots', f), monthL = $('.cal__month', f);
    var pad = function (n) { return ('0' + n).slice(-2); };
    var iso = function (dt) { return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate()); };
    var hash = function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); };
    var SL = {
      wk: ['08:00', '08:45', '09:30', '10:15', '11:00', '11:45', '13:30', '14:15', '15:00', '15:45', '16:30', '17:15', '18:00'],
      fri: ['08:00', '08:45', '09:30', '10:15', '11:00', '11:45', '13:30', '14:15', '15:00'],
      sat: ['09:00', '09:45', '10:30', '11:15', '12:00', '12:45']
    };
    function weekNo(dt) { var t = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())); var dn = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dn); var y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y) / 864e5 + 1) / 7); }
    function slotsFor(dt) {
      var wd = dt.getDay(); if (wd === 0) return null;
      if (wd === 6 && weekNo(dt) % 2) return null;
      var list = wd === 6 ? SL.sat : wd === 5 ? SL.fri : SL.wk, k = iso(dt);
      return list.map(function (t) { return { t: t, ok: true }; });
    }
    // calendar: two weeks from the Monday of the first bookable day
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var first = new Date(today); first.setDate(first.getDate() + 1); if (first.getDay() === 0) first.setDate(first.getDate() + 1);
    var gs = new Date(first); gs.setDate(gs.getDate() - ((gs.getDay() + 6) % 7));
    var days = [];
    for (var i = 0; i < 14; i++) { var dt = new Date(gs); dt.setDate(gs.getDate() + i); days.push(dt); }
    var mn = function (dt) { return dt.toLocaleDateString('en-GB', { month: 'long' }); };
    monthL.textContent = mn(days[0]) === mn(days[13]) ? mn(days[0]) + ' ' + days[0].getFullYear() : mn(days[0]) + ' – ' + mn(days[13]) + ' ' + days[13].getFullYear();
    days.forEach(function (dt) {
      var s = dt < first ? 'past' : slotsFor(dt), free = s && s !== 'past' ? s.filter(function (x) { return x.ok; }).length : 0;
      var st = s === 'past' ? '' : !s ? 'Closed' : '';
      var lab = d.createElement('label'); lab.className = 'day' + (dt.getTime() === today.getTime() ? ' is-today' : '');
      lab.innerHTML = '<input type="radio" name="day" value="' + iso(dt) + '" required' + (free ? '' : ' disabled') + '><span class="day__box"><span class="day__dow">' + dt.toLocaleDateString('en-GB', { weekday: 'short' }) + '</span><span class="day__n">' + dt.getDate() + '</span><span class="day__st">' + st + '</span></span>';
      lab.title = dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + (st ? ' — ' + st : '');
      calGrid.appendChild(lab);
    });
    var dayInputs = $$('input[name=day]', calGrid);
    calGrid.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      var i0 = dayInputs.indexOf(d.activeElement); if (i0 < 0) return;
      e.preventDefault();
      var step = e.key === 'ArrowDown' ? 7 : -7, j = i0 + step;
      while (j >= 0 && j < dayInputs.length && dayInputs[j].disabled) j += step > 0 ? 1 : -1;
      if (j >= 0 && j < dayInputs.length && !dayInputs[j].disabled) { dayInputs[j].checked = true; dayInputs[j].focus(); dayInputs[j].dispatchEvent(new Event('change', { bubbles: true })); }
    });
    function renderSlots(dt) {
      var s = slotsFor(dt), groups = [['Morning', function (t) { return t < '12:00'; }], ['Afternoon', function (t) { return t >= '12:00' && t < '17:00'; }], ['Evening', function (t) { return t >= '17:00'; }]];
      var html = '<p class="slots__day">' + dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '</p>';
      groups.forEach(function (g) {
        var l = s.filter(function (x) { return g[1](x.t); }); if (!l.length) return;
        html += '<div class="slots__g"><p class="slots__h">' + g[0] + '</p><div class="slots__row" role="radiogroup" aria-label="' + g[0] + ' times">' + l.map(function (x) {
          return '<label class="slot"><input type="radio" name="time" value="' + x.t + '" required' + (x.ok ? '' : ' disabled') + '><span>' + x.t.replace(/^0/, '') + '</span></label>';
        }).join('') + '</div></div>';
      });
      slotsW.innerHTML = html;
      if (!RM) gsap.from($$('.slots__day, .slots__h, .slot', slotsW), { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.015, ease: 'expo.out' });
    }
    // prefill from ?t=
    var q = (location.search.match(/[?&]t=([a-z]+)/) || [])[1];
    var map = { checkups: 'checkup', veneer: 'veneers' }; q = map[q] || q;
    if (q && TX[q]) { var r = $('input[name=treatment][value=' + q + ']', f); if (r) { r.checked = true; var note = $('.step__pre', f); if (note) note.hidden = false; } }

    // summary
    function val(n) { var e = f.elements[n]; return e ? e.value : ''; }
    function dayObj() { var v = val('day'); if (!v) return null; var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function setSum(k, v) {
      var e = $('[data-sum=' + k + ']', sum); if (!e || e.textContent === v) return;
      e.textContent = v; e.classList.toggle('is-empty', v === '—');
      if (!RM) gsap.fromTo(e, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' });
    }
    function update() {
      var t = TX[val('treatment')], dy = dayObj(), tm = val('time'), nm = (val('first') + ' ' + val('last')).trim();
      setSum('treatment', t ? t.n : 'Choose a treatment');
      setSum('who', t ? t.who : '—'); setSum('len', t ? t.len + ' minutes' : '—');
      setSum('day', dy ? dy.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '—');
      setSum('time', tm ? tm.replace(/^0/, '') : '—'); setSum('name', nm || '—');
      $$('[data-dur]', f).forEach(function (e) { e.textContent = t ? t.len + '-minute ' + t.n.toLowerCase() : 'visit'; });
    }
    f.addEventListener('change', function (e) {
      if (e.target.name === 'day') { renderSlots(dayObj()); }
      if (e.target.name === 'treatment' || e.target.name === 'day' || e.target.name === 'time') clearErr(cur);
      update();
    });
    f.addEventListener('input', function (e) { if (e.target.name === 'first' || e.target.name === 'last') update(); var fl = e.target.closest('.field'); if (fl && fl.classList.contains('is-invalid')) checkField(e.target); });
    f.addEventListener('focusout', function (e) { var fl = e.target.closest && e.target.closest('.field'); if (fl && e.target.value) checkField(e.target); });

    // validation
    var tel = f.elements.tel;
    function telOk(v) { var s = v.replace(/[\s()-]/g, ''); return /^(\+447\d{9}|07\d{9})$/.test(s); }
    function checkField(inp) {
      var fl = inp.closest('.field, .check'); if (!fl) return true;
      if (inp === tel) inp.setCustomValidity(inp.value && !telOk(inp.value) ? 'Please enter a UK mobile number.' : '');
      var ok = inp.checkValidity(); fl.classList.toggle('is-invalid', !ok); inp.setAttribute('aria-invalid', String(!ok)); return ok;
    }
    function showErr(n, msg) {
      var e = $('.step__err', steps[n - 1]); if (e) { e.textContent = msg; e.hidden = false; }
      if (!RM) gsap.fromTo(steps[n - 1], { x: 0 }, { keyframes: { x: [-10, 9, -6, 4, 0] }, duration: 0.5, ease: 'none' });
    }
    function clearErr(n) { var e = $('.step__err', steps[n - 1]); if (e) e.hidden = true; }
    function validate(n) {
      if (n === 1 && !val('treatment')) { showErr(1, 'Choose a treatment to continue.'); return false; }
      if (n === 2) {
        if (!val('day')) { showErr(2, 'Pick a day first — the ones with free times are in white.'); return false; }
        if (!val('time')) { showErr(2, 'Now pick a time on ' + dayObj().toLocaleDateString('en-GB', { weekday: 'long' }) + '.'); return false; }
      }
      if (n === 3) {
        var bad = null;
        $$('input, textarea', steps[2]).forEach(function (inp) { if (inp.type === 'radio') return; if (!checkField(inp) && !bad) bad = inp; });
        if (bad) { showErr(3, 'A couple of details need another look.'); bad.focus(); return false; }
      }
      clearErr(n); return true;
    }

    function review() {
      var t = TX[val('treatment')], dy = dayObj();
      var rows = [['Treatment', t.n + ' · ' + t.len + ' min', 1], ['With', t.who, 1], ['When', dy.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + val('time').replace(/^0/, ''), 2],
        ['Name', val('first') + ' ' + val('last'), 3], ['Mobile', val('tel'), 3], ['Email', val('email'), 3], ['Visit', f.elements['new'].value === 'new' ? 'First time at Even' : 'Returning patient', 3]];
      if (val('notes').trim()) rows.push(['Notes', val('notes').trim(), 3]);
      var rv = $('.review', f); rv.innerHTML = '';
      rows.forEach(function (r) {
        var div = d.createElement('div'); div.className = 'review__row';
        div.innerHTML = '<dt></dt><dd></dd><button type="button" class="review__edit">Edit</button>';
        div.children[0].textContent = r[0]; div.children[1].textContent = r[1];
        div.children[2].addEventListener('click', function () { go(r[2]); });
        div.children[2].setAttribute('aria-label', 'Edit ' + r[0].toLowerCase());
        rv.appendChild(div);
      });
    }

    function paint(n) {
      prog.forEach(function (p, i) { p.classList.toggle('is-done', i < n - 1); p.classList.toggle('is-current', i === n - 1); if (i === n - 1) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current'); });
      var pct = n > N ? 1 : (n - 0.5) / N;
      RM ? gsap.set(fillBar, { scaleX: pct }) : gsap.to(fillBar, { scaleX: pct, duration: 1, ease: 'expo.inOut' });
      back.hidden = n === 1 || n > N; next.hidden = n >= N; submit.hidden = n !== N;
      if (hint) hint.textContent = n === N ? 'Nothing to pay today' : 'Step ' + n + ' of ' + N + ' · Enter to continue';
    }
    function go(n) {
      if (n === cur || n < 1 || n > N) return;
      if (n > cur) for (var k = cur; k < n; k++) if (!validate(k)) { if (k !== cur) go(k); return; }
      if (n === N) review();
      var from = steps[cur - 1], to = steps[n - 1], dir = n > cur ? 1 : -1;
      var h0 = wrap.offsetHeight; cur = n; paint(n);
      var swap = function () {
        from.hidden = true; gsap.set(from, { clearProps: 'all' }); to.hidden = false;
        var h1 = wrap.offsetHeight;
        var ttl = $('.step__title', to); if (ttl) { ttl.setAttribute('tabindex', '-1'); ttl.focus({ preventScroll: true }); }
        if (!RM) {
          gsap.fromTo(wrap, { height: h0 }, { height: h1, duration: 0.6, ease: 'expo.out', clearProps: 'height', onComplete: function () { ST.refresh(); } });
          gsap.fromTo(to, { x: 50 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' });
          gsap.from($$('.step__title, .tcard, .cal, .slots, .field, .check, .review', to).slice(0, 12), { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.035, ease: 'expo.out', delay: 0.05 });
        }
        var top = f.getBoundingClientRect().top;
        if (top < 0) Core.lenis ? Core.lenis.scrollTo(f, { offset: -96, duration: 1 }) : f.scrollIntoView();
      };
      if (RM) swap(); else gsap.to(from, { x: -40 * dir, autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: swap });
    }
    next.addEventListener('click', function () { go(cur + 1); });
    back.addEventListener('click', function () { go(cur - 1); });
    f.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.shiftKey) return;
      var t = e.target; if (t.tagName === 'TEXTAREA' || t.tagName === 'BUTTON' || t.tagName === 'A') return;
      e.preventDefault();
      if (t.type === 'radio' && !t.checked) { t.checked = true; t.dispatchEvent(new Event('change', { bubbles: true })); }
      if (t.type === 'checkbox') { t.checked = !t.checked; t.dispatchEvent(new Event('change', { bubbles: true })); return; }
      if (cur < N) go(cur + 1); else f.requestSubmit(submit);
    });
    // intercept early submits before core's demo handler sees them
    d.addEventListener('submit', function (e) {
      if (e.target !== f) return;
      if (cur < N) { e.preventDefault(); e.stopPropagation(); go(cur + 1); return; }
      for (var k = 1; k < N; k++) if (!validate(k)) { e.preventDefault(); e.stopPropagation(); go(k); return; }
      prepDone();
    }, true);
    function prepDone() {
      var t = TX[val('treatment')], dy = dayObj(), tm = val('time');
      $('[data-done=first]', f).textContent = val('first').trim();
      $('[data-done=line]', f).textContent = t.n + ' with our ' + t.who.toLowerCase() + ', ' + dy.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + tm.replace(/^0/, '') + '. A confirmation text is on its way to ' + val('tel').trim() + '.';
      var st = new Date(dy); st.setHours(+tm.slice(0, 2), +tm.slice(3, 5)); var en = new Date(st.getTime() + t.len * 60000);
      var fmt = function (x) { return x.getFullYear() + pad(x.getMonth() + 1) + pad(x.getDate()) + 'T' + pad(x.getHours()) + pad(x.getMinutes()) + '00'; };
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Even Dental Studio//Booking//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@even-studio', 'DTSTAMP:' + fmt(new Date()), 'DTSTART;TZID=Europe/London:' + fmt(st), 'DTEND;TZID=Europe/London:' + fmt(en),
        'SUMMARY:Even — ' + t.n, 'LOCATION:Even Dental Studio\\, Marylebone\\, London W1', 'DESCRIPTION:No waiting room — ring the bell and we’ll meet you at the door.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = $('[data-ics]', f); a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    }
    f.addEventListener('demo:sent', function () {
      paint(N + 1); prog.forEach(function (p) { p.classList.add('is-done'); p.classList.remove('is-current'); });
      if (sum) sum.classList.add('is-confirmed');
      var done = $('.done', f);
      if (!RM) {
        var tl = gsap.timeline();
        tl.from(done, { autoAlpha: 0, y: 30, duration: 0.8, ease: 'expo.out' })
          .fromTo('.done__pulse', { scale: 0.2, opacity: 0.7 }, { scale: 2.4, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.2)
          .fromTo('.done__ring', { strokeDashoffset: 340 }, { strokeDashoffset: 0, duration: 1.1, ease: 'expo.inOut' }, 0.1)
          .fromTo('.done__tick', { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.7, ease: 'expo.out' }, 0.8)
          .from($$('.done > *:not(.done__mark)', f), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.5);
      }
      var top = f.getBoundingClientRect().top; if (top < 0 && Core.lenis) Core.lenis.scrollTo(f, { offset: -100, duration: 1 });
    });
    paint(1); update();
  }

  hero(); shade(); tindex(); slider(); faq(); treatments(); timeline(); booking();

  // page heads (treatments/booking) intro
  Core.onReady(function () {
    var ph = $('.phero'); if (!ph || RM) return;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from($$('.hl > span', ph), { yPercent: 140, duration: 1.5, stagger: 0.1 }, 0)
      .from($$('.phero__meta > *, .phero__lead, .phero__aside', ph), { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.07 }, 0.4);
    var pm = $('.phero__pill', ph);
    if (pm) tl.fromTo(pm, { clipPath: 'inset(45% 0% 45% 0% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px)', duration: 1.8, ease: 'expo.inOut' }, 0.1)
      .from($('img', pm), { scale: 1.4, duration: 2.4 }, 0.1);
  });
})();
