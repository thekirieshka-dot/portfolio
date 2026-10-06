/* ───────── Sightline — changelog.js ───────── */
(function () {
  'use strict';
  var S = window.SLP, qs = S.qs, qsa = S.qsa, gsap = S.gsap, ST = S.ST, RM = S.RM;

  function init() {
    var list = qs('#clogList'); if (!list) return;
    var ents = qsa('.ent', list), rels = qsa('.rel', list), brk = qs('[data-brk]', list), empty = qs('#clogEmpty'), chipsBox = qs('#clogChips'), allBtn = qs('#clogAll');
    var state = 'all', busy = null, allOpen = false;
    var cnt = { all: ents.length, new: 0, improved: 0, fixed: 0 };
    ents.forEach(function (e) { cnt[e.dataset.t]++; });
    chipsBox.innerHTML = [['all', 'All'], ['new', 'New'], ['improved', 'Improved'], ['fixed', 'Fixed']].map(function (c, i) {
      return '<button type="button" class="fchip' + (i === 0 ? ' is-on' : '') + '" data-f="' + c[0] + '" aria-pressed="' + (i === 0) + '">' + c[1] + ' <small>' + cnt[c[0]] + '</small></button>';
    }).join('');
    var chips = qsa('.fchip', chipsBox);

    /* expand / collapse */
    function setOpen(e, v) { e.classList.toggle('is-open', v); qs('.ent__h', e).setAttribute('aria-expanded', String(v)); }
    ents.forEach(function (e) {
      qs('.ent__h', e).addEventListener('click', function () { setOpen(e, !e.classList.contains('is-open')); setTimeout(function () { ST.refresh(); }, 650); });
    });
    allBtn.addEventListener('click', function () {
      allOpen = !allOpen;
      ents.forEach(function (e) { if (!e.classList.contains('is-out')) setOpen(e, allOpen); });
      allBtn.textContent = allOpen ? 'Collapse all' : 'Expand all'; allBtn.setAttribute('aria-pressed', String(allOpen));
      setTimeout(function () { ST.refresh(); }, 700);
    });

    /* filter with Flip */
    function apply() {
      var targets = ents.concat(rels), st = (!RM && window.Flip) ? Flip.getState(targets) : null, shown = 0;
      ents.forEach(function (e) { var m = state === 'all' || e.dataset.t === state; e.classList.toggle('is-out', !m); if (m) shown++; });
      rels.forEach(function (r) { r.classList.toggle('is-out', !qsa('.ent:not(.is-out)', r).length); });
      if (brk) brk.classList.toggle('is-out', state !== 'all');
      empty.hidden = shown > 0;
      if (st) {
        if (busy) busy.kill();
        busy = Flip.from(st, { duration: .6, ease: 'power3.inOut', absolute: true, simple: true,
          onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out', stagger: .02, delay: .1 }); },
          onLeave: function (els) { return gsap.to(els, { opacity: 0, duration: .22 }); } });
      }
      setTimeout(function () { ST.refresh(); }, st ? 900 : 50);
    }
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        if (state === b.dataset.f) return; state = b.dataset.f;
        chips.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
        apply();
      });
    });

    /* deep link: changelog.html#v35 */
    var h = location.hash && qs(location.hash);
    if (h && h.classList && h.classList.contains('rel')) {
      qsa('.ent', h).forEach(function (e, i) { setOpen(e, i === 0); });
      setTimeout(function () { if (Core.lenis) Core.lenis.scrollTo(h, { offset: -150, duration: 1.4 }); else h.scrollIntoView(); }, 400);
    }
  }

  Core.onReady(function () { init(); setTimeout(function () { ST.refresh(); }, 500); });
})();
