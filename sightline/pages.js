/* ───────── Sightline — pages.js (shared bits for pricing, security, customers, changelog) ───────── */
(function () {
  'use strict';
  var d = document, root = d.documentElement, gsap = window.gsap, ST = window.ScrollTrigger;
  var qs = function (s, c) { return (c || d).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.SLP = { qs: qs, qsa: qsa, RM: RM, d: d, root: root, gsap: gsap, ST: ST };

  /* cursor ink follows dark cards inside light sections */
  d.addEventListener('mouseover', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    if (t.closest('.dk, .dk-sec')) root.dataset.cur = 'dark';
  });

  /* arriving on index.html#how etc. from another page: the engine does not scroll to the hash on load */
  /* (index only — handled in site.js) */

  /* page head intro */
  Core.onReady(function () {
    var ph = qs('.ph'); if (!ph || RM) return;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.ph .hl > span', { yPercent: 118, duration: 1.5, stagger: .1 }, 0)
      .from('.ph__k', { y: 14, autoAlpha: 0, duration: 1 }, .25)
      .from('.ph__side > *, .ph__more > *', { y: 24, autoAlpha: 0, duration: 1.1, stagger: .08 }, .45)
      .from('.hdr', { autoAlpha: 0, duration: 1 }, .3);
  });
})();
