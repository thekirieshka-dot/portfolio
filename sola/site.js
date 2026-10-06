/* SOLA — sun-warmed skincare. Store logic, bag, page scripts. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (!window.Core || !gsap) return;
  var qs = Core.qs, qsa = Core.qsa, d = document, root = d.documentElement, body = d.body;
  var PAGE = body.getAttribute('data-page');
  var RM = Core.RM;

  Core.config({
    veilBg: '#b4694a', veilInk: '#fbf3ea', veilCols: 5,
    preloader: { key: 'sola', brand: 'SOLA', top: 'Sun-warmed skincare', topRight: 'Lisbon', bottom: 'Batch 07 &mdash; Autumn 2026', duration: 1.7 }
  });

  /* core workaround: links without data-veil pass `undefined` colours to Core.go, which blanks the veil */
  var coreGo = Core.go;
  Core.go = function (url, info) {
    info = info || {};
    if (!info.bg) info.bg = '#b4694a';
    if (!info.ink) info.ink = '#fbf3ea';
    if (!info.label) info.label = 'SOLA';
    return coreGo(url, info);
  };
  /* core workaround: boot.js adds .reveal-fallback after 7 s unconditionally, which freezes reveals
     that have not played yet. Once the engine is running the fallback is not needed. */
  if (window.MutationObserver) {
    new MutationObserver(function () {
      if (Core.isReady && root.classList.contains('reveal-fallback')) root.classList.remove('reveal-fallback');
    }).observe(root, { attributes: true, attributeFilter: ['class'] });
  }

  /* ───────── products ───────── */
  var DELIVERY = '<p>Free shipping on orders over $75; otherwise a flat $8. Orders leave our Lisbon studio within two working days, packed in recycled card with no plastic.</p><p>Unopened products can be returned within 30 days. Every box carries a prepaid label: send your empties back and refills cost 15% less.</p>';
  var P = {
    serum: {
      id: 'serum', no: '01', name: 'Amber Drop', html: 'Amber <em>Drop</em>', type: 'Barrier serum', size: '30 ml', price: 58,
      tags: ['face', 'day', 'night'], badge: 'Most loved', order: 1,
      img: 'img/serum.webp', w: 1600, h: 1067, pos: '50% 62%',
      alt: 'Amber glass dropper bottle of SOLA Amber Drop serum on a stone block',
      hover: 'img/m_eye.webp', thumb: 'img/serum_d.webp',
      gallery: [
        { src: 'img/serum.webp', w: 1600, h: 1067, pos: '50% 60%', alt: 'Amber Drop on a stone block' },
        { src: 'img/serum_d.webp', w: 640, h: 800, pos: '50% 50%', alt: 'Close view of the Amber Drop label and dropper' },
        { src: 'img/m_eye.webp', w: 1000, h: 1250, pos: '50% 40%', alt: 'A stripe of late sunlight across an eye and cheek' }
      ],
      tagline: 'A daily serum for skin that has spent the summer outside.',
      desc: 'A light, slip-free serum that settles in under a minute. Squalane and niacinamide support a tired barrier; bakuchiol works gently on texture, without the sting. No added fragrance: it smells, faintly, of jojoba.',
      benefits: ['Supports a barrier stretched thin by sun, salt and wind.', 'Smooths the look of texture with 1% bakuchiol, gentle enough for every morning.', 'Absorbs in about forty seconds. No film, no shine.'],
      key: [
        { n: 'Squalane', p: '6%', d: 'Plant-derived, from olives. Light and close to the oils skin makes itself, so it slips into the gaps a dry barrier leaves.' },
        { n: 'Niacinamide', p: '4%', d: 'Vitamin B3 at a level skin tolerates daily. Helps skin hold on to its own moisture and look more even.' },
        { n: 'Bakuchiol', p: '1%', d: 'From the babchi seed. Works on the look of texture over weeks, gently enough to wear in daylight.' }
      ],
      inci: 'Aqua, <b>Squalane</b>, Glycerin, <b>Niacinamide</b>, Propanediol, Simmondsia Chinensis (Jojoba) Seed Oil, <b>Bakuchiol</b>, Tocopherol, Panthenol, Sodium Hyaluronate, Xanthan Gum, Citric Acid.',
      how: '<p>Morning and night, on clean, slightly damp skin. Three drops, warmed between the fingertips, pressed &mdash; not rubbed &mdash; into face and neck.</p><p>Follow with Clay Barrier Cream. In the morning, finish with SPF.</p>',
      skin: 'All skin types, sensitive included',
      mood: { src: '../img/s_cover.webp', w: 1400, h: 2100, pos: '50% 34%', line: 'Three drops, forty seconds, <em>then nothing</em>: no film, no shine, no scent.' },
      pairs: ['cream', 'oil', 'balm', 'set']
    },
    cream: {
      id: 'cream', no: '02', name: 'Clay Barrier Cream', html: 'Clay <em>Barrier</em> Cream', type: 'Face cream', size: '50 ml', price: 64,
      tags: ['face', 'day'], badge: '', order: 2,
      img: 'img/cream.webp', w: 1600, h: 1067, pos: '50% 55%',
      alt: 'Amber glass jar of SOLA Clay Barrier Cream on a kitchen counter',
      hover: 'img/m_philo.webp', thumb: 'img/cream_d.webp',
      gallery: [
        { src: 'img/cream.webp', w: 1600, h: 1067, pos: '50% 55%', alt: 'Clay Barrier Cream on a counter' },
        { src: 'img/cream_d.webp', w: 600, h: 750, pos: '50% 50%', alt: 'Close view of the Clay Barrier Cream jar' },
        { src: 'img/m_philo.webp', w: 854, h: 1067, pos: '50% 35%', alt: 'A woman with closed eyes in warm sunlight' }
      ],
      tagline: 'A soft, dense cream that seals in what the serum started.',
      desc: 'Shea butter and ceramides in a whipped base the colour of wet clay. It melts on contact and leaves skin supple, not slick. Built for long days and longer evenings.',
      benefits: ['Keeps skin comfortable all day with shea butter and ceramide NP.', 'Calms the look of redness after a day outdoors.', 'A satin finish that sits well under SPF and make-up.'],
      key: [
        { n: 'Shea butter', p: '10%', d: 'Unrefined, from a women&rsquo;s cooperative in northern Ghana. Rich in fatty acids; it softens, then stays.' },
        { n: 'Kaolin', p: '2%', d: 'The clay in the name. White kaolin takes the shine off a rich cream, so it reads satin, never greasy.' },
        { n: 'Vitamin E', p: '1%', d: 'Tocopherol, an antioxidant that also keeps the shea fresh to the last scoop.' }
      ],
      inci: 'Aqua, <b>Butyrospermum Parkii (Shea) Butter</b>, Caprylic/Capric Triglyceride, Glycerin, Cetearyl Alcohol, Squalane, <b>Kaolin</b>, Ceramide NP, <b>Tocopherol</b>, Allantoin, Sodium Stearoyl Glutamate, Xanthan Gum.',
      how: '<p>After serum, morning and night. Warm a pea-sized amount between your palms and press it over face and neck.</p><p>Use a little more across cheekbones and the bridge of the nose, where the sun lands first.</p>',
      skin: 'Normal to dry skin; combination skin in the evening',
      mood: { src: '../img/s_philo.webp', w: 1600, h: 1067, pos: '50% 40%', line: 'Rich enough for a January in Porto. <em>Light enough</em> to wear under SPF by nine.' },
      pairs: ['serum', 'oil', 'set', 'balm']
    },
    oil: {
      id: 'oil', no: '03', name: 'Night Oil', html: 'Night <em>Oil</em>', type: 'Cleanse &amp; night oil', size: '30 ml', price: 52,
      tags: ['face', 'night'], badge: 'Two jobs', order: 3,
      img: 'img/oil.webp', w: 1200, h: 1646, pos: '50% 50%',
      alt: 'Black glass pump bottle of SOLA Night Oil balanced on terracotta blocks',
      hover: 'img/m_cheek.webp', thumb: 'img/oil_d.webp',
      gallery: [
        { src: 'img/oil.webp', w: 1200, h: 1646, pos: '50% 50%', alt: 'Night Oil on terracotta blocks' },
        { src: 'img/oil_d.webp', w: 800, h: 1000, pos: '50% 50%', alt: 'Close view of the Night Oil label and pump' },
        { src: 'img/m_cheek.webp', w: 880, h: 1100, pos: '50% 50%', alt: 'Sunlight on a cheek and a gold hoop earring' }
      ],
      tagline: 'Two jobs, one bottle: an evening cleanse and a slow overnight oil.',
      desc: 'Jojoba and squalane with cold-pressed rosehip and a trace of vitamin E. Massage it into dry skin to lift sunscreen and the day, or press three drops over cream and let it work while you sleep.',
      benefits: ['Dissolves sunscreen and make-up without stripping.', 'Leaves skin soft and comfortable by morning.', 'Black glass keeps the cold-pressed oils fresh for twelve months after opening.'],
      key: [
        { n: 'Jojoba', p: '40%', d: 'Technically a liquid wax, not an oil. It loosens sunscreen and sebum, then rinses clean.' },
        { n: 'Rosehip', p: '20%', d: 'Cold-pressed in Chile. Light, amber-coloured and rich in the fatty acids that keep skin soft overnight.' },
        { n: 'Vitamin E', p: '1%', d: 'Keeps the oils from turning. The black glass does the rest.' }
      ],
      inci: '<b>Simmondsia Chinensis (Jojoba) Seed Oil</b>, Squalane, <b>Rosa Canina (Rosehip) Fruit Oil</b>, Helianthus Annuus (Sunflower) Seed Oil, Calendula Officinalis Flower Extract, <b>Tocopherol</b>.',
      how: '<p><b>To cleanse:</b> two pumps onto dry skin, massage for a full minute, add warm water until it turns milky, then lift it off with a warm cloth.</p><p><b>As a night oil:</b> three drops pressed over Clay Barrier Cream.</p>',
      skin: 'All skin types; dry and mature skin like it most',
      mood: { src: '../img/s_cover.webp', w: 1400, h: 2100, pos: '50% 70%', line: 'Two pumps, one minute, warm water. <em>The day comes off</em> in the cloth.' },
      pairs: ['serum', 'cream', 'set', 'balm']
    },
    balm: {
      id: 'balm', no: '04', name: 'Cheek &amp; Lip Balm', html: 'Cheek &amp; <em>Lip</em> Balm', type: 'Tinted balm', size: '15 g', price: 28,
      tags: ['lips'], badge: 'Vegan', order: 4,
      img: 'img/balm.webp', w: 1400, h: 1277, pos: '50% 58%',
      alt: 'Amber glass jar of SOLA Cheek and Lip Balm with a bamboo lid',
      hover: 'img/m_lips.webp', thumb: 'img/balm_d.webp',
      gallery: [
        { src: 'img/balm.webp', w: 1400, h: 1277, pos: '50% 55%', alt: 'Cheek & Lip Balm on white' },
        { src: 'img/balm_d.webp', w: 650, h: 812, pos: '50% 50%', alt: 'Close view of the balm jar and bamboo lid' },
        { src: 'img/m_lips.webp', w: 800, h: 1000, pos: '40% 50%', alt: 'Lips and cheek in warm late light' }
      ],
      tagline: 'A sheer apricot tint for lips and the tops of cheekbones.',
      desc: 'Shea, jojoba and plant-based candelilla wax, with a whisper of iron oxide that reads as warmth, not colour. It travels well. It does not melt in a pocket on a hot day &mdash; we tested that in August.',
      benefits: ['Softens dry lips and catches the light on cheekbones.', 'A sheer apricot tint that suits most skin tones.', 'Plastic-free: amber glass and a bamboo lid.'],
      key: [
        { n: 'Shea butter', p: '30%', d: 'The base. It melts at skin temperature, which is why a fingertip is the only tool you need.' },
        { n: 'Candelilla', p: '12%', d: 'A plant wax that holds the balm together in August heat. No beeswax, so it is vegan.' },
        { n: 'Iron oxides', p: '0.8%', d: 'Mineral pigment. Enough for a sheer apricot warmth, never enough to look like make-up.' }
      ],
      inci: '<b>Butyrospermum Parkii (Shea) Butter</b>, Simmondsia Chinensis (Jojoba) Seed Oil, <b>Euphorbia Cerifera (Candelilla) Wax</b>, Ricinus Communis (Castor) Seed Oil, Tocopherol, <b>CI 77491 (Iron Oxides)</b>.',
      how: '<p>Warm a little with a fingertip and tap it onto lips, the tops of cheekbones and the bridge of the nose.</p><p>Build it in thin layers. It looks best when you can barely tell it is there.</p>',
      skin: 'All skin types &middot; vegan',
      mood: { src: '../img/s_cover.webp', w: 1400, h: 2100, pos: '20% 72%', line: 'It travels in a pocket. <em>It does not melt</em> in one.' },
      pairs: ['serum', 'oil', 'cream', 'set']
    },
    set: {
      id: 'set', no: '05', name: 'The Ritual', html: 'The <em>Ritual</em>', type: 'Set of three', size: '30 + 30 + 50 ml', price: 152,
      tags: ['face', 'day', 'night', 'sets'], badge: 'Save $22', order: 5,
      img: 'img/set.webp', w: 1200, h: 1800, pos: '50% 62%',
      alt: 'Four small amber SOLA bottles on stacked tins under a fern',
      hover: 'img/m_philo2.webp', thumb: 'img/set_d.webp',
      gallery: [
        { src: 'img/set.webp', w: 1200, h: 1800, pos: '50% 60%', alt: 'The Ritual set under a fern' },
        { src: 'img/set_d.webp', w: 600, h: 740, pos: '50% 50%', alt: 'Close view of Amber Drop and Night Oil bottles' },
        { src: 'img/m_philo2.webp', w: 640, h: 800, pos: '50% 40%', alt: 'Sunlit skin and a bare shoulder' }
      ],
      tagline: 'The whole evening in amber glass: cleanse, treat, restore.',
      desc: 'Night Oil, Amber Drop and Clay Barrier Cream, full size, in a recycled card box with a linen cloth for the oil cleanse. Twenty-two dollars less than buying the three apart.',
      benefits: ['Three full-size formulas: about ten weeks of evenings.', 'Includes a washable linen cloth for the oil cleanse.', 'Arrives plastic-free, in a box you can send the empties back in.'],
      key: [
        { n: 'Squalane', p: '6%', d: 'In the serum and the oil. Light, skin-identical, the backbone of the ritual.' },
        { n: 'Niacinamide', p: '4%', d: 'In Amber Drop: the step that does the most quiet work.' },
        { n: 'Shea butter', p: '10%', d: 'In Clay Barrier Cream: the step that seals the rest in.' }
      ],
      inci: '<b>Night Oil</b> &mdash; Jojoba Seed Oil, Squalane, Rosehip Fruit Oil, Sunflower Seed Oil, Calendula Flower Extract, Tocopherol.<br><b>Amber Drop</b> &mdash; Aqua, Squalane, Glycerin, Niacinamide, Propanediol, Jojoba Seed Oil, Bakuchiol, Tocopherol, Panthenol, Sodium Hyaluronate.<br><b>Clay Barrier Cream</b> &mdash; Aqua, Shea Butter, Caprylic/Capric Triglyceride, Glycerin, Squalane, Kaolin, Ceramide NP, Tocopherol.',
      how: '<p><b>Evening:</b> Night Oil to cleanse. Three drops of Amber Drop. A pea of Clay Barrier Cream.</p><p><b>Morning:</b> serum and cream only, then SPF.</p>',
      skin: 'All skin types',
      mood: { src: '../img/s_philo.webp', w: 1600, h: 1067, pos: '50% 30%', line: 'Oil, serum, cream. <em>Ten minutes</em> every evening, for about ten weeks.' },
      pairs: ['balm', 'serum', 'cream', 'oil']
    }
  };
  var ORDER = ['serum', 'cream', 'oil', 'balm', 'set'];
  Core.products = P;

  var money = function (n) { return '$' + Math.round(n); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var plain = function (s) { var t = d.createElement('textarea'); t.innerHTML = s; return t.value; };
  var ARROW = '<svg class="ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg>';
  var PLUS = '<svg class="pl" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12"/></svg>';
  var MINUS = '<svg class="pl" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12"/></svg>';
  var CHECK = '<svg class="ck" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8.5l3.5 3.5 7.5-8"/></svg>';
  Core.icons = { ARROW: ARROW, PLUS: PLUS };

  /* ───────── shared card markup ───────── */
  function qaHTML(p, cls) {
    return '<button type="button" class="qa ' + (cls || '') + '" data-add="' + p.id + '" aria-label="Add ' + plain(p.name) + ' to bag">' +
      '<span class="qa__t"><span>Add to bag</span><span>Added</span></span><span class="qa__i">' + PLUS + CHECK + '</span></button>';
  }
  function cardHTML(p, opt) {
    opt = opt || {};
    var href = 'product.html?id=' + p.id;
    return '<article class="card" data-card data-id="' + p.id + '" data-tags="' + p.tags.join(' ') + '">' +
      '<div class="card__fig"><a class="card__media" href="' + href + '" data-veil-label="' + plain(p.name) + '" data-cursor="View" aria-label="' + plain(p.name) + '">' +
        '<img class="card__a" src="' + p.img + '" alt="' + p.alt + '" width="' + p.w + '" height="' + p.h + '" style="object-position:' + p.pos + '" loading="' + (opt.eager ? 'eager' : 'lazy') + '">' +
        '<img class="card__b" src="' + p.hover + '" alt="" loading="lazy">' +
        '<span class="card__no">N&deg; ' + p.no + '</span>' +
        (p.badge ? '<span class="card__tag">' + p.badge + '</span>' : '') +
      '</a>' + qaHTML(p, 'qa--card') + '</div>' +
      '<div class="card__info"><h3 class="card__name"><a href="' + href + '" data-veil-label="' + plain(p.name) + '">' + p.html + '</a></h3>' +
        '<span class="card__price">' + money(p.price) + '</span>' +
        '<p class="card__meta">' + p.type + ' &middot; ' + p.size + '</p></div>' +
    '</article>';
  }
  Core.cardHTML = cardHTML;

  /* ───────── bag ───────── */
  var KEY = 'sola:bag', FREE = 75, SHIP = 8, MAXQ = 9;
  var bag = (function () {
    try { var v = JSON.parse(sessionStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(function (i) { return P[i.id] && i.qty > 0; }) : []; }
    catch (e) { return []; }
  })();
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) {} }
  function count() { return bag.reduce(function (s, i) { return s + i.qty; }, 0); }
  function subtotal() { return bag.reduce(function (s, i) { return s + i.qty * P[i.id].price; }, 0); }
  function find(id) { for (var i = 0; i < bag.length; i++) if (bag[i].id === id) return bag[i]; return null; }

  var B = {}; // drawer refs
  function buildBag() {
    var el = Core.el('div', 'bag');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<div class="bag__scrim" data-bag-close></div>' +
      '<aside class="bag__panel" role="dialog" aria-modal="true" aria-labelledby="bag-title" tabindex="-1">' +
        '<header class="bag__head"><h2 id="bag-title">Your bag <sup class="bag__n" data-bag-num>0</sup></h2>' +
          '<button type="button" class="bag__x" data-bag-close><span>Close</span><i aria-hidden="true"></i></button></header>' +
        '<div class="bag__ship"><p class="bag__msg" data-ship-msg></p><div class="bag__bar"><i data-ship-bar></i><span class="bag__sun" aria-hidden="true"></span></div></div>' +
        '<div class="bag__body" data-lenis-prevent>' +
          '<ul class="bag__list" aria-live="polite"></ul>' +
          '<div class="bag__empty" hidden>' +
            '<p class="bag__et">Your bag is empty, <em>for now.</em></p>' +
            '<p class="bag__es">Most people begin with Amber Drop: three drops, morning and night.</p>' +
            '<div class="bag__sugg"></div>' +
            '<a class="lnk" href="shop.html"><span>Browse the shop</span>' + ARROW + '</a>' +
          '</div>' +
          '<div class="bag__up" hidden></div>' +
        '</div>' +
        '<footer class="bag__foot">' +
          '<div class="bag__row"><span>Subtotal</span><b data-subtotal>$0</b></div>' +
          '<div class="bag__row bag__row--s"><span>Shipping</span><span data-shipping>&mdash;</span></div>' +
          '<button type="button" class="btn btn--full btn--clay" data-checkout><span class="btn__t"><span>Checkout</span><span>Checkout</span></span><b data-total>$0</b></button>' +
          '<p class="bag__note">Ships from Lisbon in two working days &middot; plastic-free</p>' +
        '</footer>' +
      '</aside>';
    body.appendChild(el);
    B.el = el; B.panel = qs('.bag__panel', el); B.scrim = qs('.bag__scrim', el);
    B.list = qs('.bag__list', el); B.empty = qs('.bag__empty', el); B.up = qs('.bag__up', el);
    B.msg = qs('[data-ship-msg]', el); B.bar = qs('[data-ship-bar]', el); B.sun = qs('.bag__sun', el);
    B.sub = qs('[data-subtotal]', el); B.ship = qs('[data-shipping]', el); B.total = qs('[data-total]', el);
    B.checkout = qs('[data-checkout]', el); B.foot = qs('.bag__foot', el); B.num = qs('[data-bag-num]', el);
    qs('.bag__sugg', el).innerHTML = miniHTML(P.serum);
    gsap.set(el, { autoAlpha: 0 });
  }
  function miniHTML(p) {
    return '<div class="mini" data-card><a class="mini__img" href="product.html?id=' + p.id + '" data-veil-label="' + plain(p.name) + '"><img src="' + p.thumb + '" alt="" loading="lazy"></a>' +
      '<div class="mini__t"><a href="product.html?id=' + p.id + '" data-veil-label="' + plain(p.name) + '">' + p.html + '</a><span>' + p.type + ' &middot; ' + money(p.price) + '</span></div>' +
      '<button type="button" class="mini__add" data-add="' + p.id + '" data-add-open aria-label="Add ' + plain(p.name) + ' to bag">' + PLUS + '</button></div>';
  }
  function liHTML(it) {
    var p = P[it.id];
    return '<li class="li" data-id="' + p.id + '"><div class="li__in">' +
      '<a class="li__img" href="product.html?id=' + p.id + '" data-veil-label="' + plain(p.name) + '"><img src="' + p.thumb + '" alt="" loading="lazy"></a>' +
      '<div class="li__info">' +
        '<div class="li__top"><a class="li__name" href="product.html?id=' + p.id + '" data-veil-label="' + plain(p.name) + '">' + p.html + '</a><span class="li__price" data-line-price>' + money(p.price * it.qty) + '</span></div>' +
        '<p class="li__meta">N&deg; ' + p.no + ' &middot; ' + p.type + ' &middot; ' + p.size + '</p>' +
        '<div class="li__bot"><div class="step" role="group" aria-label="Quantity">' +
          '<button type="button" data-dec aria-label="One fewer">' + MINUS + '</button><span class="step__n" data-qty>' + it.qty + '</span>' +
          '<button type="button" data-inc aria-label="One more">' + PLUS + '</button></div>' +
          '<button type="button" class="li__rm" data-rm>Remove</button></div>' +
      '</div></div></li>';
  }
  function setCounts() {
    var n = count();
    qsa('[data-bag-count]').forEach(function (e) { e.textContent = n; e.classList.toggle('is-zero', !n); });
    if (B.num) B.num.textContent = n;
  }
  function renderBag(o) {
    o = o || {};
    if (!B.el) return;
    var open = B.el.classList.contains('is-open');
    // remove stale
    qsa('.li', B.list).forEach(function (li) { if (!find(li.dataset.id) && !li.__leaving) li.remove(); });
    bag.forEach(function (it) {
      var li = qs('.li[data-id="' + it.id + '"]', B.list);
      if (!li) {
        B.list.insertAdjacentHTML('beforeend', liHTML(it));
        li = B.list.lastElementChild;
        if (open && !RM) gsap.from(li, { height: 0, autoAlpha: 0, duration: 0.7, ease: 'expo.out', clearProps: 'height' });
      } else {
        var q = qs('[data-qty]', li);
        if (+q.textContent !== it.qty) {
          if (!RM && open) gsap.fromTo(q, { yPercent: o.dir === -1 ? -60 : 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out' });
          q.textContent = it.qty;
        }
        qs('[data-line-price]', li).textContent = money(P[it.id].price * it.qty);
      }
    });
    var sub = subtotal(), empty = !bag.length;
    B.empty.hidden = !empty;
    B.foot.classList.toggle('is-off', empty);
    B.checkout.disabled = empty;
    var ship = empty ? 0 : (sub >= FREE ? 0 : SHIP);
    B.sub.textContent = money(sub);
    B.ship.textContent = empty ? '—' : (ship ? money(ship) : 'Free');
    B.total.textContent = money(sub + ship);
    var left = FREE - sub;
    B.msg.innerHTML = empty ? 'Free shipping on orders over <b>$75</b>.' : (left > 0 ? 'You are <b>' + money(left) + '</b> away from free shipping.' : '<b>Shipping is on us.</b> Your order travels free.');
    var prog = Math.min(1, sub / FREE);
    if (RM || !open) gsap.set(B.bar, { scaleX: prog }); else gsap.to(B.bar, { scaleX: prog, duration: 1, ease: 'expo.out' });
    B.sun.classList.toggle('is-full', prog >= 1);
    // upsell: first product not in bag, preferring the balm
    var cand = ['balm', 'serum', 'oil', 'cream'].filter(function (id) { return !find(id); })[0];
    if (!empty && cand && !find('set')) {
      var p = P[cand], gap = FREE - sub, freeNote = gap > 0 && p.price >= gap;
      B.up.hidden = false;
      B.up.innerHTML = '<p class="lbl">' + (freeNote ? 'Add this and shipping is free' : 'Pairs well with your bag') + '</p>' + miniHTML(p);
    } else B.up.hidden = true;
    if (!o.deferCount) setCounts();
  }

  var bagOpen = false, lastFocus = null;
  function openBag() {
    if (bagOpen || !B.el) return;
    bagOpen = true; lastFocus = d.activeElement;
    B.el.classList.add('is-open'); B.el.setAttribute('aria-hidden', 'false'); root.classList.add('bag-open');
    qsa('[data-bag-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    if (Core.lenis) Core.lenis.stop();
    renderBag();
    gsap.killTweensOf([B.el, B.panel, B.scrim]);
    gsap.set(B.el, { autoAlpha: 1 });
    if (RM) { gsap.set(B.scrim, { autoAlpha: 1 }); gsap.set(B.panel, { xPercent: 0 }); }
    else {
      gsap.fromTo(B.scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
      gsap.fromTo(B.panel, { xPercent: 104 }, { xPercent: 0, duration: 0.95, ease: 'expo.out' });
      var kids = qsa('.bag__head, .bag__ship, .li, .bag__empty > *, .bag__up, .bag__foot > *', B.panel).filter(function (e) { return !e.closest('[hidden]'); });
      gsap.fromTo(kids, { x: 36, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.035, delay: 0.12, clearProps: 'transform,opacity,visibility' });
      gsap.fromTo(B.bar, { scaleX: 0 }, { scaleX: Math.min(1, subtotal() / FREE), duration: 1.3, ease: 'expo.out', delay: 0.35 });
    }
    setTimeout(function () { var x = qs('.bag__x', B.el); if (x) x.focus({ preventScroll: true }); }, 60);
  }
  function closeBag(instant) {
    if (!bagOpen) return;
    bagOpen = false;
    B.el.classList.remove('is-open'); B.el.setAttribute('aria-hidden', 'true'); root.classList.remove('bag-open');
    qsa('[data-bag-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (Core.lenis && !root.classList.contains('menu-open')) Core.lenis.start();
    gsap.killTweensOf([B.el, B.panel, B.scrim]);
    if (instant || RM) { gsap.set(B.el, { autoAlpha: 0 }); }
    else {
      gsap.to(B.panel, { xPercent: 104, duration: 0.7, ease: 'expo.inOut' });
      gsap.to(B.scrim, { autoAlpha: 0, duration: 0.5, delay: 0.15 });
      gsap.set(B.el, { autoAlpha: 0, delay: 0.72 });
    }
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }
  Core.bag = { open: openBag, close: closeBag, add: add, items: function () { return bag.slice(); } };

  function bump() {
    setCounts();
    if (RM) return;
    qsa('.hdr__bag .bag-count').forEach(function (b) {
      gsap.fromTo(b, { scale: 1.9 }, { scale: 1, duration: 1.1, ease: 'elastic.out(1, 0.32)' });
    });
    qsa('.hdr__bag').forEach(function (b) {
      gsap.fromTo(b, { rotation: -7 }, { rotation: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
    });
  }
  function fly(src, id, cb) {
    var target = qsa('.hdr__bag').filter(function (b) { return b.offsetParent !== null; })[0];
    var hdr = qs('.hdr');
    if (!src || !target || RM) { cb(); return; }
    if (hdr) hdr.classList.remove('is-hidden');
    var r = src.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight) { cb(); return; }
    var t = target.getBoundingClientRect();
    var size = Math.round(Math.max(64, Math.min(150, r.width * 0.42)));
    var f = Core.el('div', 'fly', '<img src="' + P[id].thumb + '" alt="">');
    body.appendChild(f);
    var sx = r.left + r.width / 2 - size / 2, sy = r.top + r.height / 2 - size / 2;
    var tx = t.left + t.width / 2 - size / 2, ty = t.top + t.height / 2 - size / 2;
    gsap.set(f, { width: size, height: size, x: sx, y: sy, scale: 0.4, autoAlpha: 0 });
    var tl = gsap.timeline({ onComplete: function () { f.remove(); cb(); } });
    tl.to(f, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' })
      .to(f, { x: tx, duration: 0.9, ease: 'power2.inOut' }, 0.25)
      .to(f, { y: ty, duration: 0.9, ease: 'back.in(1.6)' }, 0.25)
      .to(f, { scale: 0.18, duration: 0.9, ease: 'power3.in' }, 0.25)
      .to(f, { autoAlpha: 0, duration: 0.15 }, 1.0);
  }
  function add(id, qty, src, openAfter) {
    if (!P[id]) return;
    qty = qty || 1;
    var it = find(id);
    if (it) it.qty = Math.min(MAXQ, it.qty + qty); else bag.push({ id: id, qty: Math.min(MAXQ, qty) });
    save();
    renderBag({ deferCount: true });
    fly(src, id, function () { bump(); if (openAfter) setTimeout(openBag, 120); });
  }
  function setQty(id, q, dir) {
    var it = find(id); if (!it) return;
    if (q <= 0) { removeItem(id); return; }
    it.qty = Math.min(MAXQ, q); save(); renderBag({ dir: dir });
  }
  function removeItem(id) {
    bag = bag.filter(function (i) { return i.id !== id; }); save();
    var li = B.list && qs('.li[data-id="' + id + '"]', B.list);
    if (li && !RM) {
      li.__leaving = true;
      gsap.timeline({ onComplete: function () { li.remove(); } })
        .to(li, { x: 40, autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
        .to(li, { height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, duration: 0.5, ease: 'expo.inOut' }, 0.2);
    } else if (li) li.remove();
    renderBag();
  }

  /* order confirmation (nothing is sent) */
  var D = {};
  function buildDone() {
    var el = Core.el('div', 'done');
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'done-t'); el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="done__bg"></div><div class="done__sky" aria-hidden="true"><div class="done__sun"></div></div>' +
      '<div class="done__in" data-lenis-prevent><div class="done__grid">' +
        '<div class="done__l"><p class="lbl" data-done-no></p><h2 id="done-t" class="done__t"><span class="done__line"><span>Thank you.</span></span><span class="done__line"><span><em>It&rsquo;s on its way.</em></span></span></h2>' +
        '<p class="done__p">We pack every order by hand in our Lisbon studio. Yours leaves within two working days, in a box you can send the empties back in.</p></div>' +
        '<div class="done__r"><ul class="done__items"></ul>' +
          '<div class="done__row"><span>Shipping</span><span data-done-ship></span></div>' +
          '<div class="done__row done__row--t"><span>Total</span><b data-done-total></b></div>' +
          '<button type="button" class="btn btn--paper" data-done-close><span class="btn__t"><span>Continue browsing</span><span>Continue browsing</span></span>' + ARROW + '</button></div>' +
      '</div></div>';
    body.appendChild(el);
    D.el = el;
    gsap.set(el, { autoAlpha: 0 });
  }
  function checkout() {
    if (!bag.length) return;
    var sub = subtotal(), ship = sub >= FREE ? 0 : SHIP;
    qs('[data-done-no]', D.el).textContent = 'Order SL-' + (24100 + Math.floor(Math.random() * 8800)) + ' · Confirmed';
    qs('.done__items', D.el).innerHTML = bag.map(function (i) {
      var p = P[i.id];
      return '<li><img src="' + p.thumb + '" alt=""><span class="done__n">' + p.html + '<small>' + p.type + ' &middot; ' + p.size + '</small></span><span class="done__q">&times; ' + i.qty + '</span><span>' + money(p.price * i.qty) + '</span></li>';
    }).join('');
    qs('[data-done-ship]', D.el).textContent = ship ? money(ship) : 'Free';
    qs('[data-done-total]', D.el).textContent = money(sub + ship);
    D.el.setAttribute('aria-hidden', 'false'); D.el.classList.add('is-open');
    if (Core.lenis) Core.lenis.stop();
    var bg = qs('.done__bg', D.el), sun = qs('.done__sun', D.el), lines = qsa('.done__line > span', D.el), rest = qsa('.done__l > .lbl, .done__p, .done__r > *', D.el);
    gsap.set(D.el, { autoAlpha: 1 });
    if (RM) { closeBag(true); return; }
    var tl = gsap.timeline();
    tl.fromTo(bg, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' }, 0)
      .add(function () { closeBag(true); }, 1.0)
      .fromTo(sun, { yPercent: 100 }, { yPercent: 8, duration: 2.6, ease: 'power2.out' }, 0.55)
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 }, 0.8)
      .fromTo(rest, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.06 }, 1.0);
    setTimeout(function () { var b = qs('[data-done-close]', D.el); if (b) b.focus({ preventScroll: true }); }, 1200);
  }
  function closeDone() {
    if (!D.el || !D.el.classList.contains('is-open')) return;
    bag = []; save(); renderBag();
    D.el.classList.remove('is-open'); D.el.setAttribute('aria-hidden', 'true');
    if (Core.lenis) Core.lenis.start();
    if (RM) { gsap.set(D.el, { autoAlpha: 0 }); return; }
    gsap.timeline()
      .to(qsa('.done__in, .done__sky', D.el), { autoAlpha: 0, duration: 0.4 }, 0)
      .to(qs('.done__bg', D.el), { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, 0.1)
      .set(D.el, { autoAlpha: 0 })
      .set(qsa('.done__in, .done__sky', D.el), { autoAlpha: 1 });
  }

  /* delegated UI events */
  d.addEventListener('click', function (e) {
    var t = e.target;
    var addB = t.closest('[data-add]');
    if (addB) {
      e.preventDefault();
      var card = addB.closest('[data-card]');
      var src = (card && qs('img', card)) || addB;
      add(addB.dataset.add, 1, src, addB.hasAttribute('data-add-open'));
      if (addB.classList.contains('qa')) {
        addB.classList.add('is-added');
        clearTimeout(addB.__t); addB.__t = setTimeout(function () { addB.classList.remove('is-added'); }, 1800);
      }
      return;
    }
    if (t.closest('[data-bag-open]')) { e.preventDefault(); bagOpen ? closeBag() : openBag(); return; }
    if (t.closest('[data-bag-close]')) { closeBag(); return; }
    if (t.closest('[data-checkout]')) { checkout(); return; }
    if (t.closest('[data-done-close]')) { closeDone(); return; }
    var li = t.closest('.li');
    if (li) {
      var id = li.dataset.id, it = find(id);
      if (t.closest('[data-inc]') && it) setQty(id, it.qty + 1, 1);
      else if (t.closest('[data-dec]') && it) setQty(id, it.qty - 1, -1);
      else if (t.closest('[data-rm]')) removeItem(id);
    }
    if (t.closest('[data-top]')) { if (Core.lenis) Core.lenis.scrollTo(0, { duration: 2 }); else scrollTo({ top: 0, behavior: 'smooth' }); }
  });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (D.el && D.el.classList.contains('is-open')) closeDone();
    else if (bagOpen) closeBag();
  });
  // trap focus inside the open drawer
  d.addEventListener('focusin', function (e) {
    if (bagOpen && B.panel && !B.panel.contains(e.target) && !(D.el && D.el.contains(e.target))) { var x = qs('.bag__x', B.el); if (x) x.focus({ preventScroll: true }); }
  });

  /* same-page anchors written as index.html#x */
  var norm = function (p) { return p.replace(/index\.html$/, ''); };
  function scrollToEl(t, immediate) {
    var y = t.getBoundingClientRect().top + scrollY;
    if (Core.lenis) Core.lenis.scrollTo(y, { duration: 1.6, immediate: !!immediate, force: true });
    else scrollTo(0, y);
  }
  d.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey) return;
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.getAttribute('href').charAt(0) === '#') return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (norm(u.pathname) !== norm(location.pathname) || !u.hash) return;
    var t = qs(u.hash); if (!t) return;
    e.preventDefault();
    if (root.classList.contains('menu-open') && Core.menu) Core.menu(false);
    setTimeout(function () { scrollToEl(t); }, 30);
  });

  /* build shared UI right away so counts are correct before reveal */
  buildBag(); buildDone(); renderBag();

  /* ───────── page templates (rendered before the engine reads the DOM) ───────── */
  if (PAGE === 'home') renderHome();
  if (PAGE === 'shop') renderShop();
  if (PAGE === 'product') renderProduct();

  function renderHome() {
    var list = qs('[data-four]');
    if (list) list.innerHTML = ORDER.map(function (id, i) {
      var p = P[id], words = p.html.split(' '), first = words.shift();
      return '<li class="row" data-card data-id="' + id + '">' +
        '<span class="row__no">' + p.no + '</span>' +
        '<a class="row__name" href="product.html?id=' + id + '" data-veil-label="' + plain(p.name) + '" data-cursor="View">' +
          '<span class="row__w">' + first + '</span><span class="row__pill" aria-hidden="true"><img src="' + p.thumb + '" alt="" loading="lazy"></span> <span class="row__w">' + words.join(' ') + '</span></a>' +
        '<span class="row__meta">' + p.type + '<br>' + p.size + '</span>' +
        '<span class="row__price">' + money(p.price) + '</span>' + qaHTML(p, 'qa--row') +
      '</li>';
    }).join('');
  }

  function renderShop() {
    var grid = qs('[data-grid]');
    if (!grid) return;
    var mood = '<article class="card card--mood" data-tags="mood" data-id="mood"><figure class="card__mood"><img src="../img/s_philo.webp" alt="A woman with closed eyes in the sun, wet hair" width="1600" height="1067" loading="lazy"></figure>' +
      '<div class="card__mtext"><p class="lbl">A note on order</p><p class="card__mq">Oil first, then serum, then cream. <em>Thinnest to thickest,</em> the way water finds its level.</p><a class="lnk" href="index.html#ritual"><span>The evening ritual</span>' + ARROW + '</a></div></article>';
    var html = ORDER.map(function (id, i) { return cardHTML(P[id], { eager: i < 3 }); });
    html.splice(3, 0, mood);
    grid.innerHTML = html.join('');
  }

  function renderProduct() {
    var id = (new URLSearchParams(location.search).get('id') || 'serum').toLowerCase();
    if (!P[id]) id = 'serum';
    var p = P[id];
    body.setAttribute('data-product', id);
    d.title = plain(p.name) + ' — ' + plain(p.type) + ' | SOLA';
    var meta = qs('meta[name=description]'); if (meta) meta.setAttribute('content', plain(p.tagline) + ' ' + p.size + ', ' + money(p.price) + '.');
    var set = function (sel, html) { qsa(sel).forEach(function (e) { e.innerHTML = html; }); };
    set('[data-p=crumb]', plain(p.name));
    set('[data-p=type]', p.type);
    set('[data-p=no]', 'N&deg; ' + p.no);
    set('[data-p=name]', p.html);
    set('[data-p=tagline]', p.tagline);
    set('[data-p=desc]', p.desc);
    set('[data-p=price]', money(p.price));
    set('[data-p=size]', p.size);
    set('[data-p=skin]', p.skin);
    set('[data-p=inci]', '<p>' + p.inci + '</p>');
    set('[data-p=how]', p.how);
    set('[data-p=delivery]', DELIVERY);
    set('[data-p=benefits]', p.benefits.map(function (b, i) { return '<li><span>' + ['i', 'ii', 'iii'][i] + '</span><p>' + b + '</p></li>'; }).join(''));
    set('[data-p=key]', p.key.map(function (k, i) {
      return '<li class="key__row"><i class="key__rule" data-line></i><span class="key__i">0' + (i + 1) + '</span><h3 class="key__n">' + k.n + '</h3><p class="key__d">' + k.d + '</p><span class="key__p">' + k.p + '</span></li>';
    }).join(''));
    set('[data-p=mood]', p.mood.line);
    qsa('[data-p=add]').forEach(function (b) { b.setAttribute('data-id', id); });
    var pbi = qs('[data-pbar-img]'); if (pbi) pbi.src = p.thumb;
    var mi = qs('[data-p=moodimg]');
    if (mi) { mi.src = p.mood.src; mi.width = p.mood.w; mi.height = p.mood.h; mi.style.objectPosition = p.mood.pos; }
    // gallery
    var main = qs('[data-gal-main]'), th = qs('[data-gal-thumbs]');
    if (main) main.innerHTML = p.gallery.map(function (g, i) {
      return '<img class="gal__img' + (i ? '' : ' is-on') + '" src="' + g.src + '" alt="' + g.alt + '" width="' + g.w + '" height="' + g.h + '" style="object-position:' + g.pos + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '>';
    }).join('');
    if (th) th.innerHTML = p.gallery.map(function (g, i) {
      return '<button type="button" class="gal__th' + (i ? '' : ' is-on') + '" role="tab" aria-selected="' + (i ? 'false' : 'true') + '" aria-label="Image ' + (i + 1) + ' of ' + p.gallery.length + '"><img src="' + g.src + '" alt="" style="object-position:' + g.pos + '"><span>0' + (i + 1) + '</span></button>';
    }).join('');
    set('[data-gal-total]', pad2(p.gallery.length));
    // pairs
    var rail = qs('[data-rail]');
    if (rail) rail.innerHTML = p.pairs.map(function (pid) { return cardHTML(P[pid]); }).join('');
    // next product
    var nx = P[ORDER[(ORDER.indexOf(id) + 1) % ORDER.length]];
    var nl = qs('[data-next]');
    if (nl) {
      nl.href = 'product.html?id=' + nx.id;
      nl.setAttribute('data-veil-label', plain(nx.name));
      set('[data-next-no]', 'N&deg; ' + nx.no + ' &middot; ' + nx.type);
      set('[data-next-name]', nx.html);
      var ni = qs('[data-next-img]'); if (ni) { ni.src = nx.thumb; }
    }
  }

  /* ───────── shared behaviours ───────── */
  // header: wordmark docks once the hero has scrolled away (home)
  var hdr = qs('.hdr');
  if (hdr && PAGE === 'home') {
    Core.onTick(function (y) { hdr.classList.toggle('show-logo', y > innerHeight * 0.55); });
  }

  // generic custom reveals (kept separate from core reveals)
  function reveals() {
    qsa('[data-r]').forEach(function (e) {
      var y = +e.dataset.r || 36;
      gsap.fromTo(e, { y: y, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', delay: +e.dataset.delay || 0, scrollTrigger: { trigger: e, start: 'top 92%', once: true } });
    });
    qsa('[data-rs]').forEach(function (g) {
      var kids = Array.prototype.slice.call(g.children);
      gsap.fromTo(kids, { y: 46, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: +g.dataset.rs || 0.08, scrollTrigger: { trigger: g, start: 'top 88%', once: true } });
    });
  }

  // footer sun rises as the footer arrives; the newsletter success
  function footer() {
    var sun = qs('.foot__sun');
    if (sun && !RM) gsap.fromTo(sun, { yPercent: 60 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.foot__mark', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    qsa('form[data-demo]').forEach(function (f) {
      f.addEventListener('demo:sent', function () {
        var ok = qs('[data-ok]', f); if (!ok || RM) return;
        gsap.fromTo(ok.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08 });
      });
    });
  }

  function hashArrival() {
    if (!location.hash) return;
    var t; try { t = qs(location.hash); } catch (e) { return; }
    if (!t) return;
    setTimeout(function () { ST.refresh(); scrollToEl(t, true); }, 80);
  }

  Core.onReady(function () {
    reveals(); footer();
    if (PAGE === 'home') initHome();
    if (PAGE === 'shop') initShop();
    if (PAGE === 'product') initProduct();
    hashArrival();
  });

  /* ═════════ HOME ═════════ */
  function initHome() {
    var hero = qs('.hero');
    if (hero) heroIntro(hero);
    ritual();
    press();
    var ring = qs('.badge__ring');
    if (ring && !RM) {
      var rot = 0;
      Core.onTick(function (y, v, dt) { rot += (0.12 + Math.min(4, Math.abs(v) * 0.09)) * (dt || 16.7) / 16.7; ring.style.transform = 'rotate(' + rot.toFixed(2) + 'deg)'; });
    }
  }

  function heroIntro(hero) {
    var pic = qs('.hero__pic', hero), front = qs('.hero__front', hero), backW = qs('.hero__back .word', hero), frontW = qs('.hero__front .word', hero);
    var sunIn = qs('.sun__in', hero), sunOut = qs('.sun', hero), horizon = qs('.hero__horizon', hero), img = qs('.hero__img img', hero);
    var title = qs('.hero__title', hero);
    var state = { clip: RM ? 0 : 1 };
    gsap.set(qsa('[data-h]', hero), { visibility: 'visible' });
    function clipFront() {
      if (!front || !pic) return;
      var r = pic.getBoundingClientRect(), w = front.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight) return;
      var top = Math.max(0, r.top + r.height * state.clip - w.top);
      var right = Math.max(0, w.right - r.right), bottom = Math.max(0, w.bottom - r.bottom), left = Math.max(0, r.left - w.left);
      front.style.clipPath = 'inset(' + top.toFixed(1) + 'px ' + right.toFixed(1) + 'px ' + bottom.toFixed(1) + 'px ' + left.toFixed(1) + 'px)';
      pic.style.clipPath = state.clip > 0.001 ? 'inset(' + (state.clip * 100).toFixed(2) + '% 0% 0% 0%)' : '';
    }
    Core.onTick(clipFront);
    clipFront();
    if (RM) return;
    var split = window.SplitText ? window.SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' }) : null;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(state, { clip: 0, duration: 1.7, ease: 'expo.inOut', onUpdate: clipFront }, 0)
      .fromTo(img, { scale: 1.32 }, { scale: 1, duration: 2.4 }, 0.1)
      .fromTo(horizon, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'expo.inOut' }, 0)
      .from(qsa('span', backW), { yPercent: 102, duration: 1.7, stagger: 0.075 }, 0.35)
      .from(qsa('span', frontW), { yPercent: 102, duration: 1.7, stagger: 0.075 }, 0.35)
      .fromTo(sunIn, { yPercent: 100 }, { yPercent: 0, duration: 4.2, ease: 'power2.out' }, 0.2)
      .from(split ? split.lines : title, { yPercent: 110, duration: 1.4, stagger: 0.1 }, 0.75)
      .from(qsa('.hero__meta > *, .hero__side > *, .hero__pic figcaption, .hero__scroll', hero), { y: 22, autoAlpha: 0, duration: 1.2, stagger: 0.06 }, 0.95)
      .from(qsa('.hdr__nav, .hdr__menu, .hdr__right'), { y: -16, autoAlpha: 0, duration: 1.2, stagger: 0.06, clearProps: 'all' }, 0.9);
    // scroll parallax
    gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      .to(pic, { yPercent: -16, ease: 'none' }, 0)
      .to([qs('.hero__back', hero), front], { y: function () { return innerHeight * 0.14; }, ease: 'none' }, 0)
      .to(sunOut, { yPercent: 46, ease: 'none' }, 0)
      .to(qs('.hero__foot', hero), { y: function () { return -innerHeight * 0.06; }, ease: 'none' }, 0);
  }

  function ritual() {
    var sec = qs('.ritual'); if (!sec) return;
    var pin = qs('.ritual__pin', sec), figs = qsa('.rf', sec), steps = qsa('.rs', sec), nums = qsa('.ritual__num span', sec);
    var ghosts = qsa('.ritual__ghost span', sec), dots = qsa('.ritual__steps li', sec), bar = qs('.ritual__bar i', sec);
    var COLORS = ['#F4EBE0', '#E3CDB4', '#B4694A'];
    function setActive(i) {
      dots.forEach(function (li, k) { li.classList.toggle('is-on', k === i); });
      steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      sec.setAttribute('data-step', i);
    }
    setActive(0);
    if (RM) return;
    gsap.set(figs.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(qsa('img', figs[1]).concat(qsa('img', figs[2])), { scale: 1.3 });
    gsap.set(steps.slice(1), { autoAlpha: 0, y: 60 });
    gsap.set(ghosts.slice(1), { autoAlpha: 0, yPercent: 30 });
    gsap.set(nums, { yPercent: function (i) { return i * 100; } });
    var tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    [1, 2].forEach(function (i) {
      var at = i === 1 ? 0.8 : 2.1;
      tl.to(sec, { backgroundColor: COLORS[i], duration: 0.9, ease: 'none' }, at)
        .to(figs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 }, at)
        .to(qs('img', figs[i]), { scale: 1, duration: 1.1 }, at)
        .to(qs('img', figs[i - 1]), { scale: 1.12, duration: 0.9 }, at)
        .to(steps[i - 1], { autoAlpha: 0, y: -50, duration: 0.5, ease: 'power2.in' }, at)
        .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, at + 0.4)
        .to(ghosts[i - 1], { autoAlpha: 0, yPercent: -30, duration: 0.6 }, at)
        .to(ghosts[i], { autoAlpha: 1, yPercent: 0, duration: 0.7 }, at + 0.25)
        .to(nums, { yPercent: function (k) { return (k - i) * 100; }, duration: 0.8, ease: 'expo.inOut' }, at);
    });
    tl.to({}, { duration: 0.6 });
    if (bar) tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: tl.duration() }, 0);
    var hdr = qs('.hdr');
    ST.create({
      trigger: sec, pin: pin, start: 'top top', end: function () { return '+=' + innerHeight * 2.6; },
      scrub: 0.6, animation: tl, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (self) {
        var t = tl.time(), i = t < 1.25 ? 0 : t < 2.55 ? 1 : 2;
        if (+sec.getAttribute('data-step') !== i) setActive(i);
        if (hdr) hdr.style.setProperty('--hdr-bg', getComputedStyle(sec).backgroundColor);
      },
      onToggle: function (self) { if (hdr) { if (self.isActive) hdr.classList.add('on-ritual'); else { hdr.classList.remove('on-ritual'); hdr.style.removeProperty('--hdr-bg'); } } }
    });
    // step list is clickable
    dots.forEach(function (li, i) {
      li.addEventListener('click', function () {
        var st = ST.getAll().filter(function (s) { return s.pin === pin; })[0]; if (!st) return;
        var pos = [0.2, 1.6, 2.9][i] / tl.duration();
        var y = st.start + (st.end - st.start) * pos;
        if (Core.lenis) Core.lenis.scrollTo(y, { duration: 1.4 }); else scrollTo(0, y);
      });
    });
  }

  function press() {
    var sec = qs('.press'); if (!sec) return;
    var tabs = qsa('.press__tab', sec), quotes = qsa('.press__q', sec), cur = 0, timer = null, busy = false, DUR = 7;
    var count = qs('[data-press-n]', sec), src = qs('[data-press-src]', sec);
    var splits = quotes.map(function (q) { return window.SplitText ? window.SplitText.create(q, { type: 'lines', mask: 'lines', linesClass: 'split-line' }) : null; });
    function go(n, dir) {
      if (n === cur || busy) return;
      busy = true; dir = dir || (n > cur ? 1 : -1);
      var out = quotes[cur], inn = quotes[n], so = splits[cur], si = splits[n];
      tabs[cur].classList.remove('is-on'); tabs[cur].setAttribute('aria-selected', 'false');
      tabs[n].classList.add('is-on'); tabs[n].setAttribute('aria-selected', 'true');
      gsap.killTweensOf(qsa('.press__tab i'));
      gsap.set(qsa('.press__tab i'), { scaleX: 0 });
      if (count) count.textContent = pad2(n + 1);
      if (src) gsap.to(src, { autoAlpha: 0, duration: 0.25, onComplete: function () { src.textContent = inn.dataset.src; gsap.to(src, { autoAlpha: 1, duration: 0.5 }); } });
      var tl = gsap.timeline({ onComplete: function () { busy = false; } });
      if (RM) { out.classList.remove('is-on'); inn.classList.add('is-on'); busy = false; arm(n); cur = n; return; }
      tl.to(so ? so.lines : out, { yPercent: -110 * dir, duration: 0.6, ease: 'power3.in', stagger: 0.04 }, 0)
        .add(function () { out.classList.remove('is-on'); inn.classList.add('is-on'); }, 0.62)
        .fromTo(si ? si.lines : inn, { yPercent: 110 * dir }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06 }, 0.62);
      cur = n; arm(n);
    }
    function arm(n) {
      if (timer) timer.kill();
      var bar = qs('i', tabs[n]);
      timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: 'none', paused: !inView, onComplete: function () { go((cur + 1) % quotes.length, 1); } });
    }
    var inView = false;
    ST.create({ trigger: sec, start: 'top 80%', end: 'bottom 20%', onToggle: function (s) { inView = s.isActive; if (timer) inView ? timer.play() : timer.pause(); } });
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });
    var prev = qs('[data-press-prev]', sec), next = qs('[data-press-next]', sec);
    if (prev) prev.addEventListener('click', function () { go((cur - 1 + quotes.length) % quotes.length, -1); });
    if (next) next.addEventListener('click', function () { go((cur + 1) % quotes.length, 1); });
    arm(0);
  }

  /* ═════════ SHOP ═════════ */
  function initShop() {
    var grid = qs('[data-grid]'); if (!grid) return;
    var cards = qsa('.card', grid), chips = qsa('[data-filter]'), countEl = qs('[data-count-shown]');
    var sortBtn = qs('[data-sort-btn]'), sortList = qs('[data-sort-list]'), sortLabel = qs('[data-sort-label]');
    var filter = 'all', sort = 'featured', shown = { v: cards.length - 1 };
    function layout() {
      var vis = cards.filter(function (c) { return c.style.display !== 'none'; });
      vis.forEach(function (c, i) { c.classList.toggle('is-mid', i % 3 === 1); c.classList.toggle('is-wide', false); });
    }
    function apply(animate) {
      var state = (window.Flip && animate && !RM) ? window.Flip.getState(cards, { props: 'opacity' }) : null;
      var h0 = grid.offsetHeight;
      var order = cards.slice().sort(function (a, b) {
        var pa = P[a.dataset.id], pb = P[b.dataset.id];
        if (!pa || !pb) {
          // the mood tile stays in fourth position in the featured view
          var ia = pa ? pa.order : 3.5, ib = pb ? pb.order : 3.5;
          if (sort === 'featured') return ia - ib;
          return pa ? -1 : 1;
        }
        if (sort === 'low') return pa.price - pb.price;
        if (sort === 'high') return pb.price - pa.price;
        if (sort === 'name') return plain(pa.name).localeCompare(plain(pb.name));
        return pa.order - pb.order;
      });
      order.forEach(function (c) { grid.appendChild(c); });
      var n = 0;
      cards.forEach(function (c) {
        var tags = c.dataset.tags.split(' ');
        var on = c.dataset.id === 'mood' ? (filter === 'all' && sort === 'featured') : (filter === 'all' || tags.indexOf(filter) > -1);
        c.style.display = on ? '' : 'none';
        if (on && c.dataset.id !== 'mood') n++;
      });
      layout();
      grid.classList.toggle('is-few', n < 3);
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
      gsap.to(shown, { v: n, duration: RM ? 0 : 0.9, ease: 'power3.out', onUpdate: function () { if (countEl) countEl.textContent = pad2(Math.round(shown.v)); } });
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        if (c.dataset.filter === filter) return;
        filter = c.dataset.filter;
        chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        apply(true);
      });
    });
    function closeSort() { if (!sortList) return; sortList.parentElement.classList.remove('is-open'); sortBtn.setAttribute('aria-expanded', 'false'); }
    if (sortBtn) {
      sortBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var o = !sortList.parentElement.classList.contains('is-open');
        sortList.parentElement.classList.toggle('is-open', o); sortBtn.setAttribute('aria-expanded', o ? 'true' : 'false');
        if (o && !RM) gsap.fromTo(qsa('li', sortList), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', stagger: 0.04 });
      });
      qsa('[data-sort]', sortList).forEach(function (b) {
        b.addEventListener('click', function () {
          sort = b.dataset.sort;
          qsa('[data-sort]', sortList).forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
          sortLabel.textContent = b.textContent;
          closeSort(); apply(true);
        });
      });
      d.addEventListener('click', function (e) { if (!e.target.closest('.sort')) closeSort(); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSort(); });
    }
    apply(false);
    if (countEl) countEl.textContent = pad2(5);
    // entrance
    if (!RM) {
      var vis = cards.filter(function (c) { return c.style.display !== 'none'; });
      vis.forEach(function (c) {
        gsap.fromTo(c, { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: c, start: 'top 95%', once: true } });
        var m = qs('.card__media, .card__mood', c);
        if (m) gsap.fromTo(m, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: c, start: 'top 95%', once: true } });
      });
    }
  }

  /* ═════════ PRODUCT ═════════ */
  function initProduct() {
    var id = body.getAttribute('data-product'), p = P[id];
    // gallery
    var main = qs('[data-gal-main]'), imgs = qsa('.gal__img', main), ths = qsa('.gal__th'), cur = 0, nEl = qs('[data-gal-n]');
    var frame = qs('.gal__main');
    function show(n) {
      if (n === cur || !imgs[n]) return;
      var prev = imgs[cur]; cur = n;
      ths.forEach(function (t, i) { t.classList.toggle('is-on', i === n); t.setAttribute('aria-selected', i === n ? 'true' : 'false'); });
      if (nEl) nEl.textContent = pad2(n + 1);
      imgs.forEach(function (im) { im.style.zIndex = im === imgs[n] ? 2 : im === prev ? 1 : 0; });
      imgs[n].classList.add('is-on');
      if (RM) { prev.classList.remove('is-on'); return; }
      gsap.killTweensOf(imgs[n]);
      gsap.fromTo(imgs[n], { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.15, ease: 'expo.inOut', onComplete: function () { prev.classList.remove('is-on'); } });
      gsap.fromTo(prev, { scale: 1 }, { scale: 1.06, duration: 1.15, ease: 'expo.inOut', clearProps: 'transform' });
    }
    ths.forEach(function (t, i) { t.addEventListener('click', function () { show(i); }); });
    var prevB = qs('[data-gal-prev]'), nextB = qs('[data-gal-next]');
    if (prevB) prevB.addEventListener('click', function () { show((cur - 1 + imgs.length) % imgs.length); });
    if (nextB) nextB.addEventListener('click', function () { show((cur + 1) % imgs.length); });
    // swipe on touch
    if (frame) {
      var sx = null, sy = 0;
      frame.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      frame.addEventListener('touchend', function (e) {
        if (sx === null) return;
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show((cur + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length);
      });
    }
    // zoom on hover
    var zoom = qs('.gal__zoom');
    if (zoom && Core.FINE && !RM) {
      frame.addEventListener('mouseenter', function () { frame.classList.add('is-zoom'); });
      frame.addEventListener('mouseleave', function () { frame.classList.remove('is-zoom'); zoom.style.transformOrigin = '50% 50%'; });
      frame.addEventListener('mousemove', function (e) {
        var r = frame.getBoundingClientRect();
        zoom.style.transformOrigin = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '% ' + ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
      });
    }
    // quantity + add
    var qty = 1, qEl = qs('[data-pq]'), addBtns = qsa('[data-p=add]'), totals = qsa('[data-p=addprice]');
    function setQ(n, dir) {
      qty = Math.max(1, Math.min(MAXQ, n));
      if (qEl) {
        if (!RM && +qEl.textContent !== qty) gsap.fromTo(qEl, { yPercent: dir * 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out' });
        qEl.textContent = qty;
      }
      totals.forEach(function (t) { t.textContent = money(p.price * qty); });
    }
    setQ(1, 1);
    var inc = qs('[data-pinc]'), dec = qs('[data-pdec]');
    if (inc) inc.addEventListener('click', function () { setQ(qty + 1, 1); });
    if (dec) dec.addEventListener('click', function () { setQ(qty - 1, -1); });
    addBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        add(id, qty, imgs[cur] || b, true);
        b.classList.add('is-added'); clearTimeout(b.__t); b.__t = setTimeout(function () { b.classList.remove('is-added'); }, 1800);
        setQ(1, -1);
      });
    });
    // accordions
    qsa('.acc').forEach(function (a) {
      var btn = qs('.acc__b', a), panel = qs('.acc__p', a);
      btn.addEventListener('click', function () {
        var open = !a.classList.contains('is-open');
        qsa('.acc.is-open').forEach(function (o) {
          if (o !== a) { o.classList.remove('is-open'); qs('.acc__b', o).setAttribute('aria-expanded', 'false'); gsap.to(qs('.acc__p', o), { height: 0, duration: RM ? 0 : 0.6, ease: 'expo.inOut' }); }
        });
        a.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        gsap.to(panel, { height: open ? 'auto' : 0, duration: RM ? 0 : 0.7, ease: 'expo.inOut', onComplete: function () { ST.refresh(); stickyBuy(); } });
        if (open && !RM) gsap.fromTo(panel.children, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', delay: 0.15, stagger: 0.05 });
      });
    });
    // buy box: sticky that also scrolls when taller than the viewport
    var buy = qs('.buy');
    function stickyBuy() {
      if (!buy) return;
      var h = buy.offsetHeight, top = Math.min(104, innerHeight - h - 28);
      buy.style.top = top + 'px';
    }
    stickyBuy(); addEventListener('resize', stickyBuy);
    // mobile add bar appears once the main add button is out of view
    var bar = qs('.pbar'), mainAdd = qs('.buy__add');
    if (bar && mainAdd) {
      ST.create({
        trigger: mainAdd, start: 'bottom top+=60', endTrigger: '.foot', end: 'top bottom',
        onToggle: function (s) { bar.classList.toggle('is-on', s.isActive); }
      });
    }
    // gallery intro
    if (!RM) {
      gsap.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: 0.05 });
      gsap.fromTo(imgs[0], { scale: 1.3 }, { scale: 1, duration: 2.2, ease: 'expo.out', delay: 0.15, clearProps: 'transform' });
      gsap.fromTo(ths, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.6 });
    }
  }
})();
