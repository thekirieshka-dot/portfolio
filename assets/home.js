(function () {
  var S = window.SITE || {};
  Core.config({
    veilBg: '#0b0b0b', veilInk: '#ebe9e3', veilCols: 6,
    preloader: { brand: S.name || 'Selected work', top: 'Web design & development', topRight: 'Selected work', bottom: 'Loading' }
  });

  var gsap = window.gsap, qs = Core.qs, qsa = Core.qsa;

  Core.onReady(function () {
    /* hero intro */
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hl > span', { yPercent: 112, duration: 1.5, stagger: 0.12 }, 0)
      .from('.hero__top, .hero__foot > *', { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.5)
      .from('.hero__foot', { borderTopColor: 'transparent', duration: 0.1 }, 0.5)
      .from('.badge', { scale: 0, rotation: -90, duration: 1.4, ease: 'expo.out' }, 0.7)
      .from('.hdr', { autoAlpha: 0, duration: 1.2 }, 0.6);

    /* badge reacts to scroll */
    var ring = qs('.badge__ring');
    if (ring) Core.onTick(function (y, v) { ring.style.animationDuration = Math.max(3, 18 - Math.abs(v) * 0.9) + 's'; });

    /* hover preview that follows the cursor */
    var list = qs('#list'), peek = qs('.peek');
    if (list && peek && Core.FINE && !Core.RM) {
      var imgs = qsa('img', peek), rows = qsa('.row', list), active = -1, lastX = 0, rot = 0;
      gsap.set(peek, { xPercent: -50, yPercent: -50, scale: 0.8 });
      var xT = gsap.quickTo(peek, 'x', { duration: 0.7, ease: 'power3' });
      var yT = gsap.quickTo(peek, 'y', { duration: 0.7, ease: 'power3' });
      var rT = gsap.quickTo(peek, 'rotation', { duration: 0.9, ease: 'power3' });
      list.addEventListener('mousemove', function (e) {
        xT(e.clientX + 0); yT(e.clientY);
        rot = Math.max(-9, Math.min(9, (e.clientX - lastX) * 0.4)); lastX = e.clientX; rT(rot);
        clearTimeout(list.__t); list.__t = setTimeout(function () { rT(0); }, 80);
      });
      list.addEventListener('mouseenter', function () { gsap.to(peek, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out' }); });
      list.addEventListener('mouseleave', function () { gsap.to(peek, { autoAlpha: 0, scale: 0.8, duration: 0.5, ease: 'expo.out' }); active = -1; });
      rows.forEach(function (row, i) {
        row.addEventListener('mouseenter', function () {
          if (i === active) return;
          imgs.forEach(function (im) { im.style.zIndex = 0; });
          imgs[i].style.zIndex = 2;
          gsap.fromTo(imgs[i], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out', overwrite: true });
          active = i;
        });
      });
    }

    /* back to top */
    var top = qs('#toTop');
    if (top) top.addEventListener('click', function () { if (Core.lenis) Core.lenis.scrollTo(0, { duration: 2 }); else scrollTo({ top: 0, behavior: 'smooth' }); });
  });
})();
