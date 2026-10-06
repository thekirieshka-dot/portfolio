/* SOLA — About, Journal and Ingredients pages. Loaded after site.js on those pages only. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (!window.Core || !gsap) return;
  var Core = window.Core, qs = Core.qs, qsa = Core.qsa, d = document, root = d.documentElement, body = d.body;
  var RM = Core.RM, PAGE = body.getAttribute('data-page');
  var P = Core.products || {};
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var plain = function (s) { var t = d.createElement('textarea'); t.innerHTML = s; return t.value; };
  var money = function (n) { return '$' + Math.round(n); };

  /* ═══════════════════════ ABOUT ═══════════════════════ */
  function initAbout() { loop(); sources(); mani(); }

  /* the refill loop: four steps around a ring, a small sun travels it */
  function loop() {
    var svg = qs('[data-loop]'); if (!svg) return;
    var marker = qs('.lp-marker', svg), prog = qs('.lp-prog', svg), nodes = qsa('.lp-node', svg);
    var items = qsa('[data-loop-steps] > li'), cn = qs('.lp-cn', svg), ct = qs('.lp-ct', svg);
    var TITLES = ['FINISH THE BOTTLE', 'SEND IT HOME', 'WE STERILISE', 'FILLED AGAIN'];
    var C = 2 * Math.PI * 210, cur = -1, turns = 0, timer = null, inView = false, resetT = null;
    prog.style.strokeDasharray = C; prog.style.strokeDashoffset = C;
    gsap.set(marker, { svgOrigin: '300 300', rotation: 0 });

    function show(i, instant) {
      var wrap = cur === 3 && i === 0;
      if (wrap) turns++;
      var jump = cur >= 0 && !wrap && i < cur;     // user went backwards: rewind the long way round
      var target = turns * 360 + i * 90;
      var dur = (RM || instant) ? 0 : (jump ? 1.2 : 1.5);
      gsap.killTweensOf([marker, prog]);
      clearTimeout(resetT);
      gsap.to(marker, { rotation: target, duration: dur, ease: 'expo.inOut' });
      var frac = wrap ? 1 : i / 4;
      gsap.to(prog, { strokeDashoffset: C * (1 - frac), duration: dur, ease: 'expo.inOut' });
      if (wrap) resetT = setTimeout(function () { prog.style.strokeDashoffset = C; gsap.set(marker, { rotation: 0 }); turns = 0; }, (dur + 0.05) * 1000);
      cur = i;
      nodes.forEach(function (n, k) { n.classList.toggle('is-on', k === i); });
      items.forEach(function (li, k) {
        li.classList.toggle('is-on', k === i);
        var b = qs('.lp__b', li); if (b) b.setAttribute('aria-expanded', k === i ? 'true' : 'false');
      });
      if (cn) {
        if (!RM && !instant) gsap.fromTo([cn, ct], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05 });
        cn.textContent = pad2(i + 1); ct.textContent = TITLES[i];
      }
    }
    function arm() {
      clearInterval(timer);
      if (RM) return;
      timer = setInterval(function () { if (inView) show((cur + 1) % 4); }, 3800);
    }
    function pick(i) { if (i !== cur) show(i); arm(); }
    nodes.forEach(function (n, i) {
      n.addEventListener('click', function () { pick(i); });
      n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); } });
    });
    items.forEach(function (li, i) { qs('.lp__b', li).addEventListener('click', function () { pick(i); }); });
    show(0, true);
    if (RM) return;
    ST.create({ trigger: svg, start: 'top 80%', end: 'bottom 10%', onToggle: function (s) { inView = s.isActive; } });
    gsap.from(nodes, { scale: 0.4, autoAlpha: 0, transformOrigin: '50% 50%', duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: svg, start: 'top 80%', once: true } });
    gsap.from(qsa('.lp-base, .lp-inner', svg), { autoAlpha: 0, duration: 1.4, scrollTrigger: { trigger: svg, start: 'top 80%', once: true } });
    arm();
  }

  /* sourcing: rows <-> map */
  function sources() {
    var list = qs('[data-src-list]'); if (!list) return;
    var rows = qsa('.sr', list), mps = qsa('.mp'), lines = qsa('.ml'), hub = qs('.mp-hub');
    var rn = qs('[data-src-n]'), rc = qs('[data-src-co]'), idle = rn.textContent;
    var active = -1;
    function on(i) {
      if (i === active) return; active = i;
      rows.forEach(function (r, k) { r.classList.toggle('is-on', k === i); });
      mps.forEach(function (m) { m.classList.toggle('is-on', +m.dataset.i === i); });
      lines.forEach(function (l) { l.classList.toggle('is-on', +l.dataset.i === i); });
      if (hub) hub.classList.toggle('is-on', i >= 0);
      var r = rows[i];
      if (r) { rn.textContent = qs('.sr__n', r).textContent + ' — ' + r.dataset.place; rc.innerHTML = r.dataset.co; }
      else { rn.textContent = idle; rc.innerHTML = '&nbsp;'; }
    }
    rows.forEach(function (r, i) {
      r.addEventListener('mouseenter', function () { on(i); });
      r.addEventListener('click', function () { on(i); });
      r.addEventListener('focusin', function () { on(i); });
    });
    mps.forEach(function (m) { m.addEventListener('mouseenter', function () { on(+m.dataset.i); }); m.addEventListener('click', function () { on(+m.dataset.i); }); });
    list.addEventListener('mouseleave', function () { on(-1); });
    qs('.src__map').addEventListener('mouseleave', function () { on(-1); });
    if (RM) return;
    gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(mps, { autoAlpha: 0 });
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.src__map', start: 'top 78%', once: true } });
    tl.to(mps, { autoAlpha: 1, duration: 0.8, stagger: 0.07, ease: 'power2.out' }, 0)
      .to(lines, { strokeDashoffset: 0, duration: 2.2, stagger: 0.12, ease: 'expo.inOut', onComplete: function () { lines.forEach(function (l) { l.style.strokeDasharray = ''; l.style.strokeDashoffset = ''; }); } }, 0.2);
    rows.forEach(function (r) {
      gsap.from(r, { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 94%', once: true } });
    });
  }

  function mani() {
    var sun = qs('.mani__sun'), sec = qs('.mani'); if (!sun || RM) return;
    gsap.fromTo(sun, { yPercent: 55 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'center center', scrub: true } });
  }

  /* ═══════════════════════ JOURNAL ═══════════════════════ */
  var A = [
    { id: 'ten-minute-evening', cat: 'Ritual', key: 'ritual', min: 5,
      title: 'The ten-minute <em>evening.</em>',
      ex: 'Oil, serum, cream. Why the order matters, and why ten minutes is plenty.',
      img: { src: 'img/set.webp', w: 1200, h: 1800, pos: '50% 62%' }, wide: { pos: '50% 66%' },
      prods: ['oil', 'serum', 'cream'],
      body: [
        'Most routines fail for one reason: they ask for more time than the end of a day has. Ours asks for ten minutes, and we have timed it. Two on the cleanse, one on the serum, one on the cream, and the rest is standing at the sink doing nothing in particular, which is the part people forget to count.',
        'h:Thinnest to thickest',
        'Water finds its level and so does skin care. Oil sits on the surface, so it goes first and then comes off. Serum is mostly water and small molecules, so it goes onto damp skin. Cream is the lid. Put the lid on first and nothing gets through it.',
        'n:A pea of cream covers a whole face. If it pills, you used too much serum or too little patience.',
        'The cleanse is the longest minute of the evening. Two pumps of Night Oil on dry skin, massaged slowly, around the nose and along the hairline where sunscreen likes to hide. Add warm water and it turns milky. Lift it away with a damp linen cloth and you are done with the day.',
        'q:The day comes off in the cloth, not in your skin.',
        'Serum goes on while skin is still a little wet, three drops, pressed rather than rubbed. Wait the length of a breath. Then a pea of cream, warmed between the palms and pressed over cheekbones and the bridge of the nose first, because that is where the sun lands first.',
        'h:And in the morning',
        'Mornings are shorter. Rinse with water, serum, cream, then SPF. No oil, no extra steps, and nothing to remember. If you only do one thing at night, make it the cleanse. If you only do one thing in the morning, make it the SPF.'
      ] },
    { id: 'sunscreen-beliefs', cat: 'Sun & SPF', key: 'sun', min: 6, block: true,
      title: 'Seven things we believe about sunscreen, <em>and four we do not.</em>',
      ex: 'A short list of what holds up and a shorter one of what does not.',
      img: { src: '../img/s_cover.webp', w: 1400, h: 2100, pos: '50% 36%' }, wide: { pos: '50% 34%' },
      prods: ['serum', 'cream'],
      body: [
        'We do not make a sunscreen, and we say so because it lets us be honest about them. These are the things we believe after three summers working outside, and four years of answering questions about them.',
        'h:What we believe',
        'A sunscreen you will wear beats a perfect one you will not. Two fingers&rsquo; worth for the face is the right amount, which is more than most people use. It needs reapplying every two hours outdoors, and once on a short city day is fine. Hat, shade and a long lunch are also sunscreen. Mineral and chemical filters both work. Water-resistant does not mean waterproof. Skin of every colour burns, and every colour is worth protecting.',
        'n:&ldquo;Two fingers&rdquo; means a line of sunscreen along the length of your index and middle fingers.',
        'h:What we do not',
        'A high SPF does not let you stay out twice as long. Make-up with SPF in it does not count unless you wear a spoonful of it. A base tan is not protection, it is damage you can see. And no amount of serum, ours included, repairs a burn: it only helps skin recover once the sun is gone.',
        'q:The best sunscreen is the one still on your face at five o&rsquo;clock.',
        'What we make is for the hour after. It cleanses the day off, rebuilds a barrier that has been through wind, salt and filters, and leaves skin ready for the next morning&rsquo;s SPF to sit on top of cleanly.'
      ] },
    { id: 'olive-to-bottle', cat: 'Ingredients', key: 'ingredients', min: 4,
      title: 'Squalane, <em>from olive to bottle.</em>',
      ex: 'The quiet backbone of two of our formulas, and why it comes from Alentejo.',
      img: { src: 'img/serum.webp', w: 1600, h: 1067, pos: '50% 60%' }, wide: { pos: '50% 60%' },
      prods: ['serum', 'oil', 'cream'],
      body: [
        'Squalane has a long history of coming from the wrong place. Sharks made it first, and the cosmetics industry took it from them for decades. These days it is made from olives, and it is better in every way that matters: more stable, more consistent, and nobody&rsquo;s liver.',
        'h:How an olive becomes a drop',
        'After the oil harvest in Alentejo the pressings that are too bitter for the table go to a refinery near Setúbal. There the oil is separated into its parts. One of them, squalene, is hydrogenated, which turns it into squalane: the same molecule, but stable, light and clear.',
        'n:Squalene oxidises quickly in air. Squalane does not, which is why it can sit in a bathroom for a year.',
        'Skin makes its own squalene and loses about half of it by the age of thirty. Squalane is what you put back. It does not feel like an oil, which is the surprise, and it never leaves a film. It slips into the gaps in a dry barrier and holds there.',
        'q:It does not feel like an oil, which is the surprise.',
        'We use 6% in Amber Drop and a similar amount in Night Oil and Clay Barrier Cream. Enough that you notice the skin, never enough that you notice the ingredient.'
      ] },
    { id: 'why-oil-turns-milky', cat: 'Ritual', key: 'ritual', min: 3,
      title: 'Why your cleansing oil <em>turns milky.</em>',
      ex: 'Oil and water do not mix, until you ask them nicely.',
      img: { src: 'img/oil.webp', w: 1200, h: 1646, pos: '50% 46%' }, wide: { pos: '50% 40%' },
      prods: ['oil'],
      body: [
        'The first time you add water to Night Oil and watch it turn to milk feels a little like a magic trick. It is chemistry, and it is useful.',
        'h:Like dissolves like',
        'Sunscreen, make-up and sebum are all oil-soluble. Water alone will not budge them. A cleansing oil dissolves them on contact, because oil dissolves oil, which is why you apply it to dry skin and not wet.',
        'Adding water brings in an emulsifier, a molecule with an oil-loving end and a water-loving end. It wraps the oil droplets so they disperse into water as a pale milk, carrying everything they have picked up with them. Then it rinses off.',
        'n:Use warm water, not hot. Hot water takes the oils your skin wants to keep.',
        'q:Oil lifts the day off. Water carries it away.',
        'A full minute of slow massage does more than a quick wipe. Take your time around the nose and the hairline, then rinse with a warm cloth.'
      ] },
    { id: 'after-the-beach', cat: 'Sun & SPF', key: 'sun', min: 4,
      title: 'After the beach, <em>before the cream.</em>',
      ex: 'What skin needs in the evening after a long day outside.',
      img: { src: 'img/m_eye.webp', w: 1000, h: 1250, pos: '50% 38%' }, wide: { pos: '50% 36%' },
      prods: ['oil', 'serum', 'cream'],
      body: [
        'After a day outside, skin is tight, salty and slightly warm. It needs less than you think, and in a particular order.',
        'h:First, take the day off',
        'Salt, sunscreen and wind all sit on the surface. Rinse with cool water, then use an oil to lift what is left. Do not scrub: skin that has been out all day has no patience for it.',
        'h:Then, give it water',
        'A serum on damp skin brings back moisture the sun took. Squalane and niacinamide help the barrier recover, and nothing in it tingles.',
        'n:If your skin stings when you put on a serum, that is a signal to stop, not to push through.',
        'q:Skin that has been out all day has no patience for scrubbing.',
        'h:Last, seal it',
        'A cream is the lid. Press a little more across the cheekbones and the bridge of the nose, where the sun landed first. By morning the tightness has usually gone.'
      ] },
    { id: 'at-the-filling-table', cat: 'Studio', key: 'studio', min: 3,
      title: 'Notes from <em>the filling table.</em>',
      ex: 'How one batch of 120 bottles gets filled, by hand, on a Wednesday.',
      img: { src: 'img/cream.webp', w: 1600, h: 1067, pos: '50% 52%' }, wide: { pos: '50% 54%' },
      prods: ['cream', 'set'],
      body: [
        'We fill on Wednesdays, because Wednesday is the day the glass arrives. The studio smells of warm shea and clean steam, and the radio is tuned to a station that plays fado until noon.',
        'h:A batch is 120 bottles',
        'No more. Small batches mean every bottle is fresh when it leaves, and every bottle can be dated by hand, which we do with a pencil on the underside of the label. Three people work the table: one fills, one caps, one checks.',
        'n:We keep a bottle from every batch, sealed, for twelve months. If anything ever feels off, we can compare.',
        'Returned bottles come in the same way. They go in a crate by the door, wait their turn at the steam table, and come back to the filling table looking new. Droppers and pumps are replaced every second trip.',
        'q:Fado until noon, then silence, then the courier.',
        'At six the courier comes, and the day is over. The table is wiped down and the pencils are sharpened for next Wednesday.'
      ] },
    { id: 'bakuchiol-is-not-retinol', cat: 'Ingredients', key: 'ingredients', min: 5,
      title: 'Bakuchiol is not a retinol, <em>and that is fine.</em>',
      ex: 'What a plant-derived active can and cannot do for skin that lives outdoors.',
      img: { src: 'img/m_cheek.webp', w: 880, h: 1100, pos: '50% 50%' }, wide: { pos: '50% 46%' },
      prods: ['serum'],
      body: [
        'Bakuchiol arrives with a lot of marketing about being &ldquo;nature&rsquo;s retinol&rdquo;. It is not, and the comparison does it no favours. It is a different molecule, from a different plant, that does a similar kind of job in a different way.',
        'h:What it does',
        'In studies, bakuchiol at 0.5 to 1% was found to improve the look of fine lines and uneven tone over twelve weeks, about as well as a low-strength retinol. The difference is what happens along the way. People using bakuchiol report far less dryness and peeling.',
        'n:Twelve weeks is the honest answer to &ldquo;how long will it take?&rdquo;',
        'That matters if you live outdoors. A retinol can make skin more sensitive to the sun, and skin that spends the day in sunshine does not need more of that. Bakuchiol does not have the same effect, so it can be worn in the morning.',
        'h:What it does not do',
        'It will not act like a prescription retinoid, and we would not claim it does. It is a gentle active for texture and tone, and it works best alongside things that look after the barrier.',
        'q:A gentle active that you will actually keep using.',
        'We use 1% in Amber Drop. That is the level used in most studies, and low enough for daily use at any age.'
      ] },
    { id: 'the-wet-hair-rule', cat: 'Ritual', key: 'ritual', min: 2,
      title: 'The wet-hair <em>rule.</em>',
      ex: 'The easiest way to make any serum work harder: apply it on damp skin.',
      img: { src: 'img/m_philo2.webp', w: 640, h: 800, pos: '50% 40%' }, wide: { pos: '50% 36%' },
      prods: ['serum'],
      body: [
        'We have a rule at the studio, and it is not a complicated one: serum goes on while your hair is still wet.',
        'Skin that has just been washed is slightly damp, and a humectant like glycerin or hyaluronic acid has water to hold on to. On dry skin it has to draw that water from somewhere else, which can mean from the skin itself.',
        'n:Count to thirty after you pat your face dry. That is the window.',
        'q:Serum on wet hair, cream on damp skin, nothing on dry.',
        'It costs no extra time. Cleanse, pat, serum, cream, and then go and dry your hair.'
      ] }
  ];
  var LAYOUTS = { 1: [12], 2: [7, 5], 3: [7, 5, 12], 4: [7, 5, 6, 6], 5: [7, 5, 4, 4, 4], 6: [7, 5, 4, 4, 4, 12], 7: [7, 5, 4, 4, 4, 6, 6], 8: [7, 5, 4, 4, 4, 3, 4, 5] };

  function initJournal() {
    var grid = qs('[data-jgrid]'); if (!grid) return;
    grid.innerHTML = A.map(function (a, i) {
      var media = a.block
        ? '<div class="ja__m ja__m--block"><span class="ja__big" aria-hidden="true">7<i></i>4</span><span class="lbl">Believed &middot; Not believed</span></div>'
        : '<div class="ja__m"><img src="' + a.img.src + '" alt="" width="' + a.img.w + '" height="' + a.img.h + '" style="object-position:' + a.img.pos + '" loading="' + (i < 3 ? 'eager' : 'lazy') + '"></div>';
      return '<article class="ja" data-id="' + a.id + '" data-cat="' + a.key + '">' +
        '<a class="ja__a" href="#' + a.id + '" data-read="' + a.id + '" data-cursor="Read" aria-label="' + plain(a.title) + '">' + media + '</a>' +
        '<div class="ja__t"><p class="ja__k lbl"><span>' + pad2(i + 1) + '</span><span>' + a.cat + '</span><span>' + a.min + ' min</span></p>' +
        '<h2 class="ja__h"><a href="#' + a.id + '" data-read="' + a.id + '">' + a.title + '</a></h2><p class="ja__x">' + a.ex + '</p>' +
        '<a class="ja__more ul lbl" href="#' + a.id + '" data-read="' + a.id + '">Read the note</a></div></article>';
    }).join('');
    var cards = qsa('.ja', grid), chips = qsa('[data-jf]'), countEl = qs('[data-jcount]'), filter = 'all', shown = { v: cards.length };
    function layout() {
      var vis = cards.filter(function (c) { return c.style.display !== 'none'; });
      var spans = LAYOUTS[Math.min(8, vis.length)] || [12];
      vis.forEach(function (c, i) {
        c.className = c.className.replace(/\bs\d+\b/g, '').trim() + ' s' + (spans[i] || 4);
      });
      grid.setAttribute('data-n', vis.length);
    }
    function apply(animate) {
      var state = (window.Flip && animate && !RM) ? window.Flip.getState(cards, { props: 'opacity' }) : null;
      var h0 = grid.offsetHeight, n = 0;
      cards.forEach(function (c) {
        var on = filter === 'all' || c.dataset.cat === filter;
        c.style.display = on ? '' : 'none'; if (on) n++;
      });
      layout();
      if (state) {
        var h1 = grid.offsetHeight;
        gsap.killTweensOf(grid);
        gsap.fromTo(grid, { height: h0 }, { height: h1, duration: 0.9, ease: 'expo.inOut', clearProps: 'height' });
        window.Flip.from(state, {
          duration: 0.9, ease: 'expo.inOut', absolute: true, scale: false, stagger: 0.025, nested: true, prune: true,
          onEnter: function (els) { return gsap.fromTo(els, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.3, stagger: 0.05 }); },
          onLeave: function (els) { return gsap.to(els, { autoAlpha: 0, y: -30, duration: 0.45, ease: 'power2.in' }); },
          onComplete: function () { ST.refresh(); }
        });
      } else ST.refresh();
      gsap.to(shown, { v: n, duration: RM ? 0 : 0.8, ease: 'power3.out', onUpdate: function () { if (countEl) countEl.textContent = pad2(Math.round(shown.v)); } });
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        if (c.dataset.jf === filter) return;
        filter = c.dataset.jf;
        chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        apply(true);
      });
    });
    layout();
    if (!RM) {
      cards.forEach(function (c) {
        gsap.fromTo(c, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: c, start: 'top 95%', once: true } });
        var m = qs('.ja__m', c);
        gsap.fromTo(m, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: c, start: 'top 95%', once: true } });
      });
    }
    reader();
  }

  /* reading view: a full-screen overlay with a scroll progress bar */
  function reader() {
    var el = Core.el('div', 'read'), cur = null, isOpen = false, lastFocus = null;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-hidden', 'true'); el.setAttribute('aria-label', 'Journal note');
    el.innerHTML = '<div class="read__panel"><div class="read__bar"><div class="read__prog" aria-hidden="true"><i></i></div>' +
      '<span class="lbl read__cat"></span><span class="lbl read__brand">SOLA Journal</span>' +
      '<button type="button" class="read__x" data-read-close><span>Close</span><i aria-hidden="true"></i></button></div>' +
      '<div class="read__scroll" data-lenis-prevent tabindex="-1"><article class="read__in"></article></div></div>';
    body.appendChild(el);
    var panel = qs('.read__panel', el), scroller = qs('.read__scroll', el), art = qs('.read__in', el), bar = qs('.read__prog i', el), catEl = qs('.read__cat', el);
    gsap.set(el, { autoAlpha: 0 });

    function byId(id) { for (var i = 0; i < A.length; i++) if (A[i].id === id) return A[i]; return null; }
    function bodyHTML(a) {
      var out = [];
      a.body.forEach(function (t, i) {
        if (t.indexOf('h:') === 0) out.push('<h3 class="rd-h">' + t.slice(2) + '</h3>');
        else if (t.indexOf('q:') === 0) out.push('<blockquote class="rd-q"><span aria-hidden="true">&ldquo;</span>' + t.slice(2) + '</blockquote>');
        else if (t.indexOf('n:') === 0) out.push('<aside class="rd-n"><span class="lbl">Side note</span><p>' + t.slice(2) + '</p></aside>');
        else out.push('<p class="rd-p">' + t + '</p>');
      });
      return out.join('');
    }
    function fill(a) {
      ST.getAll().forEach(function (s) { if (s.vars.scroller === scroller) s.kill(); });
      var idx = A.indexOf(a), nx = A[(idx + 1) % A.length];
      var prods = a.prods.map(function (id) {
        var p = P[id]; if (!p) return '';
        return '<li><a href="product.html?id=' + id + '" data-veil-label="' + plain(p.name) + '"><img src="' + p.thumb + '" alt="" loading="lazy"><span class="rp__n"><span>' + p.html + '</span><small>' + p.type + ' &middot; ' + p.size + '</small></span><span class="rp__p">' + money(p.price) + '</span></a></li>';
      }).join('');
      catEl.textContent = a.cat + ' · ' + a.min + ' min read';
      art.innerHTML =
        '<header class="rd-top"><p class="lbl rd-k"><span>Note ' + pad2(idx + 1) + ' of ' + pad2(A.length) + '</span><span>' + a.cat + '</span><span>' + a.min + ' min read</span></p>' +
        '<h2 class="rd-t">' + a.title + '</h2><p class="rd-deck">' + a.ex + '</p></header>' +
        '<figure class="rd-fig"><img src="' + a.img.src + '" alt="" width="' + a.img.w + '" height="' + a.img.h + '" style="object-position:' + (a.wide ? a.wide.pos : a.img.pos) + '"></figure>' +
        '<div class="rd-body">' + bodyHTML(a) + '</div>' +
        (prods ? '<section class="rd-prod"><p class="lbl">Mentioned in this note</p><ul>' + prods + '</ul></section>' : '') +
        '<a class="rd-next" href="#' + nx.id + '" data-read="' + nx.id + '"><span class="lbl">Next note</span><span class="rd-next__t">' + nx.title + '</span><span class="rd-next__go"><svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg></span></a>';
    }
    function setProg() {
      var max = scroller.scrollHeight - scroller.clientHeight;
      gsap.set(bar, { scaleX: max > 0 ? Math.min(1, scroller.scrollTop / max) : 0 });
    }
    scroller.addEventListener('scroll', setProg, { passive: true });

    function anim(a, instant) {
      if (RM || instant) return;
      var top = qsa('.rd-top > *', art), fig = qs('.rd-fig img', art);
      gsap.fromTo(top, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', stagger: 0.07, delay: 0.55 });
      gsap.fromTo(qs('.rd-fig', art), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', delay: 0.5 });
      gsap.fromTo(fig, { scale: 1.25 }, { scale: 1, duration: 2, ease: 'expo.out', delay: 0.5 });
      qsa('.rd-body > *, .rd-prod, .rd-next', art).forEach(function (n) {
        gsap.fromTo(n, { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: n, scroller: scroller, start: 'top 94%', once: true } });
      });
    }
    function open(id, instant) {
      var a = byId(id); if (!a) return;
      if (isOpen) {                                  // swap to another note
        cur = a; fill(a); scroller.scrollTop = 0; setProg();
        gsap.fromTo(art, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' });
        anim(a, true); history.replaceState(null, '', '#' + id); return;
      }
      isOpen = true; cur = a; lastFocus = d.activeElement;
      fill(a); scroller.scrollTop = 0; setProg();
      el.setAttribute('aria-hidden', 'false'); root.classList.add('read-open');
      if (Core.lenis) Core.lenis.stop();
      history.replaceState(null, '', '#' + id);
      gsap.killTweensOf([el, panel]);
      gsap.set(el, { autoAlpha: 1 });
      if (RM || instant) { gsap.set(panel, { clipPath: 'inset(0% 0% 0% 0%)' }); }
      else gsap.fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'expo.inOut' });
      anim(a, instant);
      setTimeout(function () { scroller.focus({ preventScroll: true }); }, instant ? 0 : 700);
    }
    function close() {
      if (!isOpen) return; isOpen = false;
      el.setAttribute('aria-hidden', 'true'); root.classList.remove('read-open');
      if (Core.lenis && !root.classList.contains('menu-open') && !root.classList.contains('bag-open')) Core.lenis.start();
      history.replaceState(null, '', location.pathname + location.search);
      gsap.killTweensOf([el, panel]);
      if (RM) gsap.set(el, { autoAlpha: 0 });
      else gsap.to(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut', onComplete: function () { gsap.set(el, { autoAlpha: 0 }); ST.getAll().forEach(function (s) { if (s.vars.scroller === scroller) s.kill(); }); } });
      if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
    }
    d.addEventListener('click', function (e) {
      var r = e.target.closest && e.target.closest('[data-read]');
      if (r) { e.preventDefault(); open(r.dataset.read); return; }
      if (e.target.closest('[data-read-close]')) close();
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });
    var h = location.hash.slice(1); if (h && byId(h)) open(h, true);
  }

  /* ═══════════════════════ INGREDIENTS ═══════════════════════ */
  function initIngredients() {
    var wrap = qs('.iwrap'); if (!wrap) return;
    var items = qsa('.ig'), groups = qsa('.il'), links = qsa('.iaz [data-l]'), input = qs('[data-isearch]'), countEl = qs('[data-icount]');
    var none = qs('[data-inone]'), chips = qsa('[data-rf]'), role = 'all', term = '';
    function norm(s) { return s.toLowerCase().replace(/[^a-z0-9% ]/g, ' ').replace(/\s+/g, ' ').trim(); }
    function apply() {
      var n = 0, words = norm(term).split(' ').filter(Boolean);
      items.forEach(function (it) {
        var ok = (role === 'all' || it.dataset.role === role) && words.every(function (w) { return it.dataset.hay.indexOf(w) > -1; });
        it.hidden = !ok; if (ok) n++;
      });
      var live = {};
      groups.forEach(function (g) { var any = qsa('.ig:not([hidden])', g).length > 0; g.hidden = !any; if (any) live[g.dataset.letter] = true; });
      links.forEach(function (l) { l.classList.toggle('is-dim', !live[l.dataset.l]); if (l.tagName === 'A') l.setAttribute('aria-disabled', live[l.dataset.l] ? 'false' : 'true'); });
      none.hidden = n > 0;
      countEl.textContent = n;
      ST.refresh();
    }
    input.addEventListener('input', function () { term = input.value; apply(); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; term = ''; apply(); } });
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        role = c.dataset.rf;
        chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        apply();
      });
    });
    var reset = qs('[data-ireset]');
    if (reset) reset.addEventListener('click', function () { input.value = ''; term = ''; role = 'all'; chips.forEach(function (x, i) { x.classList.toggle('is-on', i === 0); x.setAttribute('aria-pressed', i === 0 ? 'true' : 'false'); }); apply(); input.focus(); });
    // slash focuses search
    d.addEventListener('keydown', function (e) { if (e.key === '/' && d.activeElement !== input && !/input|textarea/i.test(d.activeElement.tagName)) { e.preventDefault(); input.focus(); } });

    // scroll spy for the letter nav + header offset for the mobile strip
    var az = qs('.iaz'), hdr = qs('.hdr'), curL = '';
    Core.onTick(function () {
      var best = '';
      groups.forEach(function (g) { if (g.hidden) return; var r = g.getBoundingClientRect(); if (r.top < innerHeight * 0.38 && r.bottom > innerHeight * 0.2) best = g.dataset.letter; });
      if (best !== curL) {
        curL = best;
        links.forEach(function (l) { l.classList.toggle('is-on', l.dataset.l === best); });
        var ol = az && qs('ol', az), on = qs('.iaz a.is-on');
        if (ol && on && ol.scrollWidth > ol.clientWidth + 2) ol.scrollTo({ left: on.offsetLeft - ol.clientWidth / 2 + 18, behavior: 'smooth' });
      }
      if (az && hdr) az.classList.toggle('is-low', !hdr.classList.contains('is-hidden'));
    });

    // entrance
    if (!RM) {
      groups.forEach(function (g) {
        var l = qs('.il__l', g);
        gsap.from(l, { yPercent: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: g, start: 'top 90%', once: true } });
      });
      items.forEach(function (it) {
        gsap.from(it, { y: 26, autoAlpha: 0, duration: 0.9, ease: 'expo.out', clearProps: 'all', scrollTrigger: { trigger: it, start: 'top 96%', once: true } });
      });
    }
    // what we leave out: each word is struck through as it arrives
    qsa('.lo').forEach(function (lo) {
      var line = qs('.lo__w i', lo);
      if (RM) { lo.classList.add('is-struck'); return; }
      gsap.set(line, { scaleX: 0 });
      ST.create({ trigger: lo, start: 'top 72%', once: true, onEnter: function () { gsap.to(line, { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }); lo.classList.add('is-struck'); } });
      gsap.from(lo, { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: lo, start: 'top 95%', once: true } });
    });
  }

  Core.onReady(function () {
    if (PAGE === 'about') initAbout();
    if (PAGE === 'journal') initJournal();
    if (PAGE === 'ingredients') initIngredients();
  });
})();
