/* ───────── core.js — shared motion engine ─────────
   GSAP + ScrollTrigger + SplitText + Lenis (all vendored in /assets/vendor).
   Declarative hooks (add attributes in HTML):
     data-split="lines|words|chars"   masked text reveal on scroll
     data-reveal / data-stagger       fade-up for an element / for its children
     data-img                         clip + scale reveal, built-in parallax (data-parallax="0.1")
     data-scrub                       words light up while scrolling
     data-marquee="1"                 infinite marquee, reacts to scroll velocity (negative = reverse)
     data-magnetic="0.35"             element follows the cursor
     data-cursor="View"               custom cursor turns into a labelled bubble
     data-skew                        skews with scroll velocity
     data-speed="0.2"                 free parallax (y shift while scrolling)
     data-line                        a rule that draws itself
     data-count="1200"                number counter
     data-hscroll + data-hscroll-track  pinned horizontal scroll (desktop)
     data-hdr / data-hdr-theme        header hide-on-scroll + theme switching
     data-menu / data-menu-panel      menu toggle (html.menu-open)
     data-veil / data-veil-ink / data-veil-label   page-transition colours on a link
*/
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var el = function (tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  var Core = window.Core = {
    RM: RM, FINE: FINE, lenis: null, velocity: 0, dir: 1, isReady: false,
    opts: { smooth: true, lerp: 0.085, cursor: true, preloader: null, veilBg: '#0d0d0d', veilInk: '#ffffff', veilCols: 5 },
    _holds: [], _ready: [], _tick: [],
    config: function (o) { Object.assign(Core.opts, o); return Core; },
    hold: function (p) { Core._holds.push(Promise.resolve(p)); },
    onReady: function (fn) { Core.isReady ? fn() : Core._ready.push(fn); },
    onTick: function (fn) { Core._tick.push(fn); },
    qs: $, qsa: $$, el: el
  };

  if (!window.gsap || !window.ScrollTrigger) { console.warn('core: GSAP missing'); return; }
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);
  if (window.Flip) gsap.registerPlugin(window.Flip);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ───────── site config (name / email / links) ───────── */
  function applySite() {
    var S = window.SITE || {};
    $$('[data-site]').forEach(function (e) { var v = S[e.dataset.site]; if (v) e.textContent = v; });
    $$('[data-site-link]').forEach(function (a) {
      var k = a.dataset.siteLink, v = S[k];
      if (!v) { a.hidden = true; return; }
      a.href = k === 'email' ? 'mailto:' + v : v;
      if (k !== 'email') { a.target = '_blank'; a.rel = 'noopener'; }
      a.setAttribute('data-no-transition', '');
    });
    $$('[data-site-show]').forEach(function (e) { if (!S[e.dataset.siteShow]) e.hidden = true; });
    $$('[data-site-hide]').forEach(function (e) { if (S[e.dataset.siteHide]) e.hidden = true; });
  }

  /* ───────── smooth scroll ───────── */
  function initScroll() {
    if (!RM && Core.opts.smooth && window.Lenis) {
      var l = Core.lenis = window.__lenis = new window.Lenis({ lerp: Core.opts.lerp, wheelMultiplier: 0.95, smoothWheel: true });
      l.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { l.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    d.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault();
      if (Core.lenis) Core.lenis.scrollTo(t, { offset: +(a.dataset.offset || 0), duration: 1.5 });
      else t.scrollIntoView({ behavior: 'smooth' });
    });
    var last = window.scrollY;
    gsap.ticker.add(function (t, dt) {
      var y = window.scrollY, v = (y - last) / (dt || 16.7) * 16.7;
      last = y;
      Core.velocity += (v - Core.velocity) * 0.18;
      if (Math.abs(v) > 0.5) Core.dir = v > 0 ? 1 : -1;
      for (var i = 0; i < Core._tick.length; i++) Core._tick[i](y, Core.velocity, dt);
    });
  }

  /* ───────── header ───────── */
  function initHeader() {
    var h = $('[data-hdr]'); if (!h) return;
    var last = 0;
    Core.onTick(function (y) {
      h.classList.toggle('is-solid', y > 60);
      if (root.classList.contains('menu-open')) return;
      if (y > 140 && y > last + 3) h.classList.add('is-hidden');
      else if (y < last - 3 || y < 100) h.classList.remove('is-hidden');
      last = y;
    });
    $$('[data-hdr-theme]').forEach(function (s) {
      ScrollTrigger.create({
        trigger: s, start: 'top 56px', end: 'bottom 56px',
        onToggle: function (self) { if (self.isActive) h.dataset.theme = s.dataset.hdrTheme; }
      });
    });
  }

  /* ───────── menu ───────── */
  function initMenu() {
    var btns = $$('[data-menu]'), panel = $('[data-menu-panel]');
    if (!btns.length || !panel) return;
    function toggle(v) {
      var open = v === undefined ? !root.classList.contains('menu-open') : v;
      root.classList.toggle('menu-open', open);
      btns.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
      if (Core.lenis) open ? Core.lenis.stop() : Core.lenis.start();
      if (Core.onMenu) Core.onMenu(open);
    }
    Core.menu = toggle;
    btns.forEach(function (b) { b.addEventListener('click', function () { toggle(); }); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) toggle(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
  }

  /* ───────── cursor ───────── */
  function initCursor() {
    if (!Core.opts.cursor || !FINE || RM) return;
    root.classList.add('has-cursor');
    var dot = el('div', 'cursor-dot'), ring = el('div', 'cursor-ring', '<span></span>');
    d.body.append(dot, ring);
    var label = ring.firstChild, first = true;
    var dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
    addEventListener('mousemove', function (e) {
      if (first) { gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); first = false; }
      root.classList.add('cursor-on'); root.classList.remove('cursor-out');
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });
    d.addEventListener('mouseleave', function () { root.classList.add('cursor-out'); });
    d.addEventListener('mouseover', function (e) {
      var t = e.target.closest && e.target.closest('[data-cursor]');
      var a = e.target.closest && e.target.closest('a,button,summary,label,input,textarea,select,[role=button]');
      if (t && t.dataset.cursor) { label.textContent = t.dataset.cursor; root.classList.add('cursor-label'); root.classList.remove('cursor-link'); }
      else { root.classList.remove('cursor-label'); root.classList.toggle('cursor-link', !!a); }
    });
    d.addEventListener('mousedown', function () { root.classList.add('cursor-down'); });
    d.addEventListener('mouseup', function () { root.classList.remove('cursor-down'); });
  }

  /* ───────── page transition ───────── */
  var veil = null, busy = false;
  function buildVeil(covered) {
    veil = el('div', 'veil');
    var cols = el('div', 'veil__cols');
    for (var i = 0; i < Core.opts.veilCols; i++) cols.appendChild(el('i', 'veil__col'));
    var label = el('div', 'veil__label', '<span></span>');
    veil.append(cols, label);
    d.body.append(veil);
    if (covered) {
      var info = {}; try { info = JSON.parse(sessionStorage.getItem('core:t') || '{}'); } catch (e) {}
      $('span', label).textContent = info.label || '';
      veil.style.display = 'block';
      gsap.set($$('.veil__col', veil), { yPercent: 0 });
      root.classList.remove('veil-on');
    }
    return veil;
  }
  function veilCover(info) {
    var cols = $$('.veil__col', veil), span = $('.veil__label span', veil);
    veil.style.setProperty('--veil', info.bg); veil.style.setProperty('--veil-ink', info.ink);
    span.textContent = info.label || '';
    veil.style.display = 'block';
    var tl = gsap.timeline();
    tl.fromTo(cols, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'power4.inOut', stagger: { each: 0.06, from: 'start' } }, 0);
    if (info.label) tl.fromTo(span, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }, 0.45);
    return new Promise(function (res) { tl.eventCallback('onComplete', res); });
  }
  function veilOpen(mid) {
    var cols = $$('.veil__col', veil), span = $('.veil__label span', veil);
    var tl = gsap.timeline({ delay: 0.15, onComplete: function () { veil.style.display = 'none'; try { sessionStorage.removeItem('core:t'); } catch (e) {} } });
    tl.to(span, { yPercent: -110, duration: 0.6, ease: 'expo.in' }, 0)
      .to(cols, { yPercent: -100, duration: 0.9, ease: 'power4.inOut', stagger: { each: 0.06, from: 'start' } }, 0.25)
      .add(mid, 0.55);
    return tl;
  }
  Core.go = function (url, info) {
    if (busy) return; busy = true;
    info = info || {};
    info = { bg: info.bg || Core.opts.veilBg, ink: info.ink || Core.opts.veilInk, label: info.label || '' };
    try { sessionStorage.setItem('core:t', JSON.stringify({ bg: info.bg, ink: info.ink, label: info.label, at: Date.now() })); } catch (e) {}
    if (RM) { location.href = url; return; }
    if (Core.lenis) Core.lenis.stop();
    veilCover(info).then(function () { location.href = url; });
  };
  function initLinks() {
    d.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
      if (u.protocol !== location.protocol || u.host !== location.host) return;
      if (u.pathname === location.pathname && u.search === location.search) { if (u.hash) return; e.preventDefault(); return; }
      e.preventDefault();
      Core.go(u.href, { bg: a.dataset.veil, ink: a.dataset.veilInk, label: a.dataset.veilLabel });
    });
    addEventListener('pageshow', function (e) {
      if (e.persisted) { busy = false; if (veil) veil.style.display = 'none'; if (Core.lenis) Core.lenis.start(); }
    });
  }

  /* ───────── preloader ───────── */
  function buildPreloader(cfg) {
    var key = 'core:pre:' + (cfg.key || location.pathname.replace(/[^\w]+/g, '_'));
    try { if (sessionStorage.getItem(key)) return null; sessionStorage.setItem(key, '1'); } catch (e) {}
    var p = el('div', 'pre',
      '<div class="pre__top"><span>' + (cfg.top || '') + '</span><span>' + (cfg.topRight || '') + '</span></div>' +
      '<div class="pre__brand">' + (cfg.brand ? '<span>' + cfg.brand + '</span>' : '') + '</div>' +
      '<div class="pre__bottom"><span>' + (cfg.bottom || '') + '</span><div class="pre__count"><span class="pre__n">0</span>%</div></div>' +
      '<div class="pre__bar"></div>');
    d.body.append(p);
    var n = $('.pre__n', p), bar = $('.pre__bar', p), brand = $('.pre__brand span', p), obj = { v: 0 }, dur = cfg.duration || 1.7;
    var counter = new Promise(function (res) {
      var tl = gsap.timeline({ onComplete: res });
      if (brand) tl.from(brand, { yPercent: 110, duration: 1.1, ease: 'expo.out' }, 0);
      tl.to(obj, { v: 100, duration: dur, ease: 'power2.inOut', onUpdate: function () { n.textContent = Math.round(obj.v); } }, 0)
        .to(bar, { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0);
    });
    return {
      counter: counter,
      out: function (mid) {
        var tl = gsap.timeline({ onComplete: function () { p.remove(); } });
        if (brand) tl.to(brand, { yPercent: -110, duration: 0.7, ease: 'expo.in' }, 0);
        tl.to([$('.pre__top', p), $('.pre__bottom', p)], { opacity: 0, duration: 0.35 }, 0)
          .to(p, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 0.5)
          .add(mid, 0.95);
        return tl;
      }
    };
  }

  /* ───────── reveals & effects ───────── */
  function initEffects() {
    var mm = gsap.matchMedia();

    // text
    $$('[data-split]').forEach(function (e) {
      var by = e.dataset.split || 'lines', delay = +e.dataset.delay || 0;
      if (!window.SplitText || RM) { gsap.set(e, { visibility: 'visible' }); return; }
      var type = by === 'chars' ? 'lines,words,chars' : by === 'words' ? 'lines,words' : 'lines';
      window.SplitText.create(e, {
        type: type, mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: function (self) {
          var tg = self[by] || self.lines;
          gsap.set(e, { visibility: 'visible' });
          return gsap.from(tg, {
            yPercent: 115, duration: by === 'chars' ? 0.9 : 1.2, ease: 'expo.out',
            stagger: +e.dataset.stagger || (by === 'chars' ? 0.018 : by === 'words' ? 0.045 : 0.1), delay: delay,
            scrollTrigger: { trigger: e, start: e.dataset.start || 'top 90%', once: true }
          });
        }
      });
    });

    // scrubbed paragraph
    $$('[data-scrub]').forEach(function (e) {
      if (!window.SplitText || RM) return;
      window.SplitText.create(e, {
        type: 'words', autoSplit: true,
        onSplit: function (self) {
          return gsap.fromTo(self.words, { opacity: 0.16 }, {
            opacity: 1, ease: 'none', stagger: 0.12,
            scrollTrigger: { trigger: e, start: 'top 82%', end: 'bottom 52%', scrub: true }
          });
        }
      });
    });

    // fades
    $$('[data-reveal]').forEach(function (e) {
      var y = e.dataset.reveal === '' ? 40 : +e.dataset.reveal;
      gsap.fromTo(e, { y: isNaN(y) ? 40 : y, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', delay: +e.dataset.delay || 0,
        scrollTrigger: { trigger: e, start: 'top 93%', once: true }
      });
    });
    $$('[data-fade]').forEach(function (e) {
      gsap.fromTo(e, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, ease: 'power2.out', delay: +e.dataset.delay || 0, scrollTrigger: { trigger: e, start: 'top 93%', once: true } });
    });
    $$('[data-stagger]').forEach(function (g) {
      var kids = Array.prototype.slice.call(g.children);
      gsap.set(kids, { autoAlpha: 0 });
      gsap.fromTo(kids, { y: 50, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: +g.dataset.stagger || 0.09,
        scrollTrigger: { trigger: g, start: 'top 88%', once: true }
      });
    });

    // lines
    $$('[data-line]').forEach(function (e) {
      gsap.fromTo(e, { scaleX: 0 }, { scaleX: 1, transformOrigin: e.dataset.line === 'right' ? 'right' : 'left', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: e, start: 'top 95%', once: true } });
    });

    // images
    $$('[data-img]').forEach(function (m) {
      var img = $('img', m); if (!img) return;
      var p = $('.media__p', m);
      if (!p) { p = el('span', 'media__p'); img.replaceWith(p); p.appendChild(img); }
      var mode = m.dataset.img, par = m.dataset.parallax === undefined ? 0.08 : +m.dataset.parallax;
      if (RM) return;
      if (mode !== 'parallax') {
        gsap.fromTo(m, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: m, start: 'top 92%', once: true } });
        gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: m, start: 'top 92%', once: true } });
      }
      if (par && mode !== 'reveal') {
        gsap.set(p, { scale: 1 + par * 2.1 });
        gsap.fromTo(p, { yPercent: -par * 100 }, { yPercent: par * 100, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    });

    // free parallax
    $$('[data-speed]').forEach(function (e) {
      var s = +e.dataset.speed || 0.1;
      gsap.fromTo(e, { y: function () { return -s * innerHeight * 0.5; } }, { y: function () { return s * innerHeight * 0.5; }, ease: 'none', scrollTrigger: { trigger: e.parentElement || e, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });

    // counters
    $$('[data-count]').forEach(function (e) {
      var to = +e.dataset.count, dec = (String(e.dataset.count).split('.')[1] || '').length, o = { v: 0 }, pre = e.dataset.pre || '', suf = e.dataset.suf || '';
      ScrollTrigger.create({ trigger: e, start: 'top 90%', once: true, onEnter: function () {
        gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: function () { e.textContent = pre + o.v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suf; } });
      } });
    });

    // skew on velocity
    var sk = $$('[data-skew]');
    if (sk.length && !RM) {
      var setters = sk.map(function (e) { return gsap.quickTo(e, 'skewY', { duration: 0.5, ease: 'power3' }); });
      Core.onTick(function (y, v) { var s = Math.max(-5, Math.min(5, v * -0.12)); setters.forEach(function (f) { f(s); }); });
    }

    // marquee
    $$('[data-marquee]').forEach(function (m) {
      var inner = m.firstElementChild; if (!inner) return;
      var base = parseFloat(m.dataset.marquee) || 1, unit = inner.innerHTML, n = 0;
      inner.setAttribute('aria-hidden', 'false');
      while (inner.scrollWidth < innerWidth * 2.6 && n < 10) { inner.insertAdjacentHTML('beforeend', unit); n++; }
      var uw = inner.scrollWidth / (n + 1), x = base < 0 ? -uw : 0, speed = Math.abs(base) * (m.dataset.speed2 ? +m.dataset.speed2 : 60);
      if (RM) return;
      Core.onTick(function (y, v, dt) {
        x -= (Math.sign(base) * speed + v * 1.4 * Math.sign(base)) * (dt || 16.7) / 1000;
        if (x <= -uw) x += uw; if (x > 0) x -= uw;
        inner.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      });
    });

    // magnetic
    if (FINE && !RM) $$('[data-magnetic]').forEach(function (e) {
      var s = +e.dataset.magnetic || 0.35;
      var xt = gsap.quickTo(e, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' }), yt = gsap.quickTo(e, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      e.addEventListener('mousemove', function (ev) { var r = e.getBoundingClientRect(); xt((ev.clientX - r.left - r.width / 2) * s); yt((ev.clientY - r.top - r.height / 2) * s); });
      e.addEventListener('mouseleave', function () { xt(0); yt(0); });
    });

    // demo forms: validate, then show the success state (nothing is sent anywhere)
    $$('form[data-demo]').forEach(function (f) {
      f.setAttribute('novalidate', '');
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!f.checkValidity()) { f.reportValidity(); return; }
        f.classList.add('is-sent');
        $$('[data-ok]', f).forEach(function (x) { x.hidden = false; });
        $$('[data-ok-hide]', f).forEach(function (x) { x.hidden = true; });
        f.dispatchEvent(new CustomEvent('demo:sent', { bubbles: true }));
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });

    // pinned horizontal scroll
    $$('[data-hscroll]').forEach(function (sec) {
      var track = $('[data-hscroll-track]', sec); if (!track) return;
      mm.add('(min-width: 900px)', function () {
        var dist = function () { return Math.max(0, track.scrollWidth - sec.clientWidth + (+sec.dataset.hscrollPad || 0)); };
        var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: sec, pin: true, scrub: true, start: 'top top', end: function () { return '+=' + dist(); }, invalidateOnRefresh: true, anticipatePin: 1 } });
        sec.__hs = tw;
        if (Core.onHScroll) Core.onHScroll(sec, tw);
      });
    });
  }

  /* ───────── boot ───────── */
  function boot() {
    applySite();
    initScroll();
    initHeader();
    initMenu();
    initCursor();
    initLinks();

    var entering = root.classList.contains('veil-on');
    buildVeil(entering);
    var pre = (!entering && !RM && Core.opts.preloader) ? buildPreloader(Core.opts.preloader) : null;
    if ((entering || pre) && Core.lenis) Core.lenis.stop();
    window.scrollTo(0, 0);

    var fonts = (d.fonts && d.fonts.ready) ? Promise.race([d.fonts.ready, wait(2000)]) : Promise.resolve();
    var finish = function () {
      initEffects();
      Core.isReady = true; root.classList.add('is-ready'); root.classList.remove('reveal-fallback');
      Core._ready.forEach(function (f) { f(); });
      ScrollTrigger.refresh();
      if (Core.lenis) Core.lenis.start();
    };
    Promise.all([fonts, pre ? pre.counter : 0].concat(Core._holds)).then(function () {
      if (RM) { root.classList.remove('veil-on'); finish(); return; }
      if (pre) pre.out(finish);
      else if (entering) veilOpen(finish);
      else finish();
    });
    addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
