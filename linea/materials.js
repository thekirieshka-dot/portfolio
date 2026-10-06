/* ───────── LINEA — materials.js: index, drawer, matrix ───────── */
(function () {
  'use strict';
  var PROJ = {
    'arcade': ['Arcade at Lindevang', 'Arcade', 'Public · built 2023', 1],
    'pine-house': ['Pine House', 'Pine', 'House · built 2022', 1],
    'curtain-apartment': ['Curtain Apartment', 'Curtain', 'Interior · built 2021', 1],
    'kastrup': ['Kastrup Municipal Hall', 'Kastrup', 'Public · built 2024', 1],
    'stair-house': ['Stair House', 'Stair', 'House · built 2025', 1],
    'lime': ['Helsingør Lime Works', 'Lime Works', 'Public · on site', 0],
    'malmo': ['Malmö Reading Room', 'Reading Rm', 'Public · competition, 2nd', 0],
    'dune': ['Dune House', 'Dune', 'House · in design', 0],
    'chapel': ['Chapel of Rest', 'Chapel', 'Interior · in design', 0]
  };
  var PKEYS = Object.keys(PROJ);
  var TYPES = { surface: 'Surface', structure: 'Structure', floor: 'Floor', joinery: 'Joinery', metal: 'Metal' };
  var M = [
    { n: 'Lime plaster, three coats', t: 'surface', img: 't-plaster', s: 'Hand-floated on brick. Warm sand, never painted.',
      lead: 'A rough scratch coat for grip, a float coat to true the surface, and a thin finish coat rubbed up by hand until the sand shows. It breathes, it can be repaired in an afternoon, and it takes light the way paper does.',
      face: 'Room', back: 'Brick',
      L: [['plaster', 'Finish coat, lime putty and fine sand', 3], ['plaster', 'Float coat, NHL 3.5 and sharp sand', 9], ['plaster', 'Scratch coat, combed', 12], ['brick', 'Brick wall, cut at 120', 120]],
      sp: [['Binder', 'NHL 3.5 hydraulic lime and aged lime putty'], ['Aggregate', 'Washed sand 0–2 mm from a pit near Stevns'], ['Coats', 'A week apart; no work below 5 °C'], ['Colour', 'Sand, warm. No pigment'], ['Repair', 'Patch with the same mix; no sealer, no paint']],
      u: [['stair-house', 'All walls, three floors'], ['pine-house', 'Interior walls'], ['curtain-apartment', 'Hall and bedrooms'], ['dune', 'Specified, all interior walls']] },
    { n: 'Burnished lime', t: 'surface', img: 't-burnish', s: 'Polished with river stones over six weeks.',
      lead: 'Where a wall will be touched every day we burnish the last coat with smooth stones until it takes a sheen like worn leather. It is slow and expensive, and it is the finish clients most often ask us to repeat.',
      face: 'Room', back: 'Brick',
      L: [['plaster2', 'Burnished coat, soap-sealed', 2], ['plaster', 'Base lime coat', 8], ['plaster', 'Float coat', 10], ['brick', 'Brick wall, cut at 120', 120]],
      sp: [['Method', 'Troweled, then rubbed with river stones, daily for six weeks'], ['Sealer', 'Olive-oil soap, worked in warm'], ['Pigment', 'None, or one earth pigment up to 3 %'], ['Care', 'Wipe with a damp cloth; never scrub'], ['Repair', 'A plasterer can re-burnish a patch in a day']],
      u: [['curtain-apartment', 'Both arched niches and the hall'], ['chapel', 'Specified, walls and altar niche']] },
    { n: 'Hydraulic lime render', t: 'surface', img: 't-vault', s: 'Left white and unpainted; weathers to the park path.',
      lead: 'A three-coat render for the outside of brick. It is never painted, so it greys unevenly, and a little greener where the rain runs, and it never flakes.',
      face: 'Outside', back: 'Brick',
      L: [['plaster2', 'Top coat, NHL 5', 6], ['plaster', 'Base coat', 14], ['plaster', 'Spatterdash, thrown wet', 5], ['brick', 'Brick wall, cut at 240', 240]],
      sp: [['Binder', 'NHL 5, natural white'], ['Curing', 'Kept damp under hessian for seven days'], ['Ageing', 'Greys in five to eight years'], ['Lime wash', 'Optional, every fifteen years'], ['Repair', 'Cut out and re-render; the patch fades in']],
      u: [['arcade', 'Vaults, columns and walls'], ['lime', 'Facade, on site']] },
    { n: 'Solid brick wall, 480', t: 'structure', img: 't-brick', s: 'Two leaves of brick, no cavity, lime mortar.',
      lead: 'The wall carries the floor and holds the heat. At 480 millimetres it is deep enough to carve a niche into, and thick enough that a window becomes a small room.',
      face: 'Room', back: 'Outside',
      L: [['plaster', 'Lime plaster', 12], ['brick', 'Brick leaf, 228', 228], ['mortar', 'Collar joint, lime mortar', 12], ['brick', 'Brick leaf, 228', 228]],
      sp: [['Brick', 'Hand-moulded, 228 × 108 × 54'], ['Mortar', 'Lime and sand 1:3; no cement'], ['Bond', 'Flemish, with headers every course'], ['Mass', 'About 860 kg per m² of wall'], ['Life', 'Over one hundred and fifty years']],
      u: [['stair-house', 'Load-bearing walls, all floors'], ['arcade', 'Column cores'], ['dune', 'Ground-floor walls, in design'], ['malmo', 'Reading room walls, competition scheme']] },
    { n: 'Groin vault, brick', t: 'structure', img: 't-lime', s: 'One bay a week, built on timber centring.',
      lead: 'A vault is a skin of brick that stands by its shape. We build it on timber centring and strike the formwork after a week; from then on the shell carries itself and its render.',
      face: 'Soffit', back: 'Haunch',
      L: [['plaster2', 'Lime render, soffit', 20], ['brick', 'Brick, header course', 108], ['mortar', 'Mortar, thick bed', 14], ['brick', 'Brick, stretcher course', 54], ['concrete', 'Haunch fill, lime concrete', 120]],
      sp: [['Span', '4 800 mm between columns'], ['Rise', '1 650 mm'], ['Centring', 'Spruce ribs, struck after seven days'], ['Pace', 'One bay a week; fourteen bays'], ['Mortar', 'Lime and sand 1:3']],
      u: [['arcade', 'Fourteen bays'], ['malmo', 'Reading room vault, competition scheme']] },
    { n: 'Lime-hemp infill', t: 'structure', img: 't-slab', s: 'Insulation that is also a wall: hemp shiv in lime.',
      lead: 'Hemp shiv mixed with a lime binder is cast between formwork and left to harden. It insulates, buffers moisture and stays open to vapour, which suits a building of brick and lime better than foam would.',
      face: 'Room', back: 'Outside',
      L: [['plaster', 'Lime plaster', 15], ['wool', 'Lime-hemp, cast in place', 300], ['brick', 'Brick outer leaf', 108]],
      sp: [['Density', 'About 330 kg/m³'], ['Lambda', '0.075 W/mK'], ['Cure', 'Eight weeks before plastering'], ['Source', 'Hemp grown on Lolland'], ['Membranes', 'None. The wall dries both ways']],
      u: [['dune', 'External walls, in design'], ['lime', 'Offices, on site']] },
    { n: 'Timber infill wall', t: 'structure', img: 't-sky', s: 'Spruce frame, wood-fibre board, lime render.',
      lead: 'Pine House has concrete floors and a light timber skin. A spruce frame at 600 centres is filled with wood wool and boarded in wood fibre, then rendered in lime so it reads as a close cousin of our brick.',
      face: 'Room', back: 'Outside',
      L: [['plaster', 'Lime plaster on lath', 18], ['timber2', 'Wood-fibre board', 22], ['wool', 'Spruce studs with wood wool', 200], ['timber2', 'Wood-fibre sheathing', 40], ['air', 'Ventilated gap, battens', 30], ['plaster2', 'Lime render', 14]],
      sp: [['Frame', 'C24 spruce, 45 × 200 at 600'], ['Boards', 'Wood fibre, 22 and 40'], ['U-value', '0.17 W/m²K'], ['Render', 'Two coats of lime on lath'], ['Fire', 'REI 60']],
      u: [['pine-house', 'Upper volumes and infill walls']] },
    { n: 'Post-tensioned slab', t: 'structure', img: 't-slab', s: 'Thin enough to lift a civic floor over a covered square.',
      lead: 'White-cement concrete with greased strand tendons, poured in two crews over six days. The soffit is board-marked and left bare, so the hall ceiling is simply the underside of the floor above.',
      face: 'Floor', back: 'Soffit',
      L: [['stone', 'Terrazzo, ground flush', 25], ['mortar', 'Screed', 45], ['concrete', 'White-cement concrete, post-tensioned', 320]],
      sp: [['Span', '10.8 m between columns'], ['Tendons', 'Greased strand in ducts at 600'], ['Cement', 'White, with crushed limestone'], ['Soffit', 'Board-marked, left bare'], ['Pour', 'Six days, two crews']],
      u: [['kastrup', 'Hall floor on 36 columns'], ['pine-house', 'Floor slabs']] },
    { n: 'Terrazzo, white cement', t: 'floor', img: 't-floor', s: 'Cast in place, ground flush and waxed.',
      lead: 'Crushed limestone in white cement, laid in bays between brass strips, ground in four passes until the aggregate shows as a quiet speckle.',
      face: 'Floor', back: 'Slab',
      L: [['stone', 'Terrazzo, ground flush', 20], ['mortar', 'Cement bedding', 30], ['concrete', 'Slab, cut at 250', 250]],
      sp: [['Aggregate', 'Crushed limestone, 6–12 mm'], ['Binder', 'White cement'], ['Joints', 'Brass strips on a 2.4 m grid'], ['Grinding', 'Four passes, 120 to 800 grit'], ['Seal', 'Penetrating wax oil']],
      u: [['kastrup', 'Hall floor and the 42 m counter']] },
    { n: 'Oak floor, 22 mm', t: 'floor', img: 't-oak', s: 'Wide boards laid on battens over wood wool.',
      lead: 'Air-dried for two years and kilned to nine per cent, the boards are secret-nailed to battens so there is not a screw to see. Oiled twice and then left alone to mark.',
      face: 'Room', back: 'Slab',
      L: [['timber', 'Oak board, oiled', 22], ['wool', 'Battens and wood wool', 45], ['concrete', 'Slab, cut at 200', 200]],
      sp: [['Board', '22 × 180, random lengths 1.8–3.2 m'], ['Drying', 'Air-dried two years, kilned to 9 %'], ['Fixing', 'Secret-nailed to battens'], ['Finish', 'Linseed oil and beeswax, twice'], ['Wear', 'Plane and re-oil in thirty years']],
      u: [['pine-house', 'Living floors'], ['curtain-apartment', 'The whole flat'], ['stair-house', 'Treads above the lime stair']] },
    { n: 'Cast lime stair', t: 'floor', img: 't-stair', s: 'Treads cast in lime; the handrail is the wall, rounded.',
      lead: 'Each tread is cast on site against the wall, so the stair and the plaster are one continuous thing. A thin stainless mesh sits at mid-depth; the face is lime all the way.',
      face: 'Tread', back: 'Soffit',
      L: [['plaster2', 'Cast lime, wearing face', 40], ['steel', 'Stainless mesh, 6', 6], ['plaster', 'Cast lime, core', 44]],
      sp: [['Mix', 'NHL 5, marble dust, sharp sand'], ['Reinforcement', 'Stainless mesh; no steel in the face'], ['Casting', 'Tread by tread, on site'], ['Finish', 'Rubbed with stone, then waxed'], ['Edge', 'Rounded, R 12']],
      u: [['stair-house', 'The stair, three floors']] },
    { n: 'Granite setts', t: 'floor', img: 't-floor', s: 'Reclaimed setts, hand-laid on a sand bed.',
      lead: 'Old harbour setts, cleaned and laid in a fan by one paver over a sand bed. The joints stay open so the walk drinks the rain it is given.',
      face: 'Surface', back: 'Ground',
      L: [['stone', 'Granite sett', 100], ['mortar', 'Sand bed', 40], ['stone', 'Crushed stone base, cut at 200', 200]],
      sp: [['Stone', 'Reclaimed granite, 100 × 100'], ['Bed', 'Sharp sand, 40 mm'], ['Joints', 'Sand and lime, swept in'], ['Pattern', 'Fan, laid by one paver'], ['Drainage', 'Open joints; no gullies']],
      u: [['arcade', 'The floor of the covered walk']] },
    { n: 'Oak window sill', t: 'joinery', img: 't-oak', s: 'Solid oak, 38 mm, set in lime mortar.',
      lead: 'The sill is the one place in a window the hand lands, so it is solid oak and generously deep. It is bedded in lime mortar and can be lifted out whole in fifty years.',
      face: 'Room', back: 'Outside',
      L: [['timber', 'Oak sill, quarter-sawn', 38], ['mortar', 'Lime mortar bed', 12], ['brick', 'Brick wall, cut at 120', 120]],
      sp: [['Timber', 'Oak, quarter-sawn, air-dried'], ['Overhang', '20 mm, with a drip groove'], ['Fixing', 'Stainless dowels'], ['Finish', 'Linseed oil'], ['Replace', 'Lift out whole; no cutting of the wall']],
      u: [['pine-house', 'All windows'], ['stair-house', 'The roof-window kerb'], ['dune', 'Specified']] },
    { n: 'Oak door leaf, solid core', t: 'joinery', img: 't-oak', s: 'Flush, pivot-hung, without a frame.',
      lead: 'A 44 mm leaf with a spruce core and oak faces, hung on a bronze pivot and closed into a rebate cut in the plaster. We would rather have fewer doors, and each one properly made.',
      face: 'Room A', back: 'Room B',
      L: [['timber', 'Oak face', 12], ['ply', 'Spruce core', 20], ['timber', 'Oak face', 12]],
      sp: [['Leaf', '44 mm; 2 100 × 900'], ['Hinge', 'Bronze pivot, top and bottom'], ['Handle', 'Cast bronze pull, one per door'], ['Seal', 'None; the door closes into a rebate'], ['Finish', 'Linseed oil']],
      u: [['curtain-apartment', 'The two doors we kept, and the bathroom'], ['stair-house', 'Entrance and bathroom']] },
    { n: 'Bronze-framed glazing', t: 'joinery', img: 't-glass', s: 'Slim bronze sections, double glazed with argon.',
      lead: 'Bronze frames with a 40 mm sight line, bare and unlacquered, so they darken at the speed of the weather. Two panes of six millimetres with sixteen of argon between them.',
      face: 'Room', back: 'Outside',
      L: [['glass', 'Glass', 6], ['air', 'Argon gap', 16], ['glass', 'Glass', 6]],
      sp: [['Frame', 'Cast and extruded bronze, 40 mm sight line'], ['Glazing', '6–16–6, argon; U 1.1'], ['Finish', 'Bare; patinates in two years'], ['Largest pane', '2 400 × 1 600'], ['Fixing', 'Set into an oak sill']],
      u: [['pine-house', 'All glazing in the three volumes']] },
    { n: 'Blackened steel column', t: 'metal', img: 't-column', s: 'Hollow steel tube, hot-blackened and waxed.',
      lead: 'A field of thin black columns lifts the hall above a covered square. Each is a hollow tube, blackened in a hot bath and waxed by hand, so a shoulder leaning on it leaves a mark that is polished away by the next.',
      face: 'Outside', back: 'Core',
      L: [['steel', 'Steel wall', 10], ['air', 'Hollow core, 220', 220], ['steel', 'Steel wall', 10]],
      sp: [['Section', 'Tube Ø 240, wall 10'], ['Finish', 'Hot-blackened, beeswax'], ['Count', 'Thirty-six'], ['Height', '4.2 m'], ['Fire', 'Sprinkler-protected; no cladding']],
      u: [['kastrup', 'Thirty-six columns under the hall']] },
    { n: 'Zinc standing seam', t: 'metal', img: 't-sky', s: 'Hand-folded roof skin over a ventilated gap.',
      lead: 'Pre-weathered zinc with seams folded by hand, laid over spruce boards and a ventilated gap. At seven degrees it is nearly flat, and the edge is folded to throw the water clear without a gutter.',
      face: 'Outside', back: 'Room',
      L: [['steel', 'Zinc sheet', 1], ['membrane', 'Separation layer', 2], ['timber2', 'Spruce boards', 25], ['air', 'Ventilated gap', 50], ['wool', 'Wood-fibre insulation', 250]],
      sp: [['Sheet', 'Pre-weathered zinc, 0.8 mm'], ['Seam', '25 mm, hand-folded'], ['Pitch', '7°'], ['Life', 'Sixty years'], ['Drip', 'Folded edge; rain chain, no gutters']],
      u: [['stair-house', 'Roof and the roof-window kerb'], ['chapel', 'Roof, in design']] }
  ];
  M.forEach(function (m, i) { m.no = i + 1; m.id = 'm' + ('0' + (i + 1)).slice(-2); m.tot = m.L.reduce(function (a, l) { return a + l[2]; }, 0); m.cnt = m.u.length; });

  var SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<pattern id="h-brick" width="24" height="12" patternUnits="userSpaceOnUse"><path d="M0 0H24M0 6H24M0 12H24M6 0V6M18 6V12" fill="none" stroke="#111" stroke-width=".6"/></pattern>' +
    '<pattern id="h-plaster" width="9" height="9" patternUnits="userSpaceOnUse"><g fill="#111"><circle cx="1.5" cy="2" r=".6"/><circle cx="6" cy="1" r=".5"/><circle cx="4" cy="5" r=".6"/><circle cx="8" cy="6.5" r=".5"/><circle cx="1" cy="8" r=".5"/></g></pattern>' +
    '<pattern id="h-plaster2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#111" stroke-width=".5"/></pattern>' +
    '<pattern id="h-timber" width="22" height="10" patternUnits="userSpaceOnUse"><path d="M0 2.5Q5.5 0 11 2.5T22 2.5M0 7.5Q5.5 5 11 7.5T22 7.5" fill="none" stroke="#111" stroke-width=".6"/></pattern>' +
    '<pattern id="h-timber2" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4H8M0 0H8" fill="none" stroke="#111" stroke-width=".5"/><path d="M2 0V4M6 4V8" stroke="#111" stroke-width=".4"/></pattern>' +
    '<pattern id="h-ply" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 1.5H6M0 4.5H6" fill="none" stroke="#111" stroke-width=".7"/></pattern>' +
    '<pattern id="h-wool" width="16" height="10" patternUnits="userSpaceOnUse"><path d="M0 8L4 2L8 8L12 2L16 8" fill="none" stroke="#111" stroke-width=".6"/></pattern>' +
    '<pattern id="h-concrete" width="16" height="16" patternUnits="userSpaceOnUse"><g fill="#111"><circle cx="3" cy="3" r=".7"/><circle cx="11" cy="6" r=".6"/><circle cx="6" cy="12" r=".7"/><circle cx="14" cy="14" r=".5"/></g><path d="M9 12l3 -3l2 4Z" fill="none" stroke="#111" stroke-width=".5"/><path d="M1 8l3 1l-1 3Z" fill="none" stroke="#111" stroke-width=".5"/></pattern>' +
    '<pattern id="h-stone" width="26" height="20" patternUnits="userSpaceOnUse"><path d="M2 4L10 1L17 5L14 12L5 11ZM16 13L23 11L25 18L17 19Z M18 1L25 2L24 8L19 6Z" fill="none" stroke="#111" stroke-width=".6"/></pattern>' +
    '<pattern id="h-mortar" width="7" height="7" patternUnits="userSpaceOnUse"><g fill="#111"><circle cx="1.5" cy="1.5" r=".4"/><circle cx="5" cy="4.5" r=".4"/></g></pattern>' +
    '<pattern id="h-glass" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="#2f6bff" stroke-width=".8" opacity=".7"/></pattern>' +
    '<pattern id="h-air" width="8" height="8" patternUnits="userSpaceOnUse"><g fill="#111" opacity=".5"><circle cx="2" cy="2" r=".4"/><circle cx="6" cy="6" r=".4"/></g></pattern>' +
    '</defs></svg>';
  var FILL = { brick: 'brick', plaster: 'plaster', plaster2: 'plaster2', timber: 'timber', timber2: 'timber2', ply: 'ply', wool: 'wool', concrete: 'concrete', stone: 'stone', mortar: 'mortar', glass: 'glass', air: 'air' };

  function section(m) {
    var W = 480, x0 = 100, y0 = 92, H = 200, n = m.L.length, tot = m.tot, MIN = 8;
    var w = m.L.map(function (l) { return l[2] / tot * W; });
    for (var it = 0; it < 3; it++) {
      var fixed = 0, free = 0;
      w.forEach(function (v, i) { if (v < MIN) { fixed += MIN; } else free += v; });
      w = w.map(function (v) { return v < MIN ? MIN : v * (W - fixed) / free; });
    }
    var s = '<svg class="drw drw--sec" viewBox="0 0 680 440" role="img" aria-label="Build-up of ' + m.n + ', scale 1:5, ' + tot + ' mm">';
    var x = x0, xs = [x0], parts = '', fills = '', marks = '', dims = '';
    m.L.forEach(function (l, i) {
      var k = l[0], wi = w[i], f = FILL[k];
      var rectD = 'M' + x.toFixed(1) + ' ' + y0 + 'h' + wi.toFixed(1) + 'v' + H + 'h-' + wi.toFixed(1) + 'Z';
      if (k === 'steel') fills += '<path d="' + rectD + '" fill="#111" stroke="none"/>';
      else fills += '<path d="' + rectD + '" fill="' + (f ? 'url(#h-' + f + ')' : 'none') + '" stroke="none"/>';
      parts += '<path class="d w2" d="' + rectD + '"/>';
      var cx = x + wi / 2;
      marks += '<path class="f w3" d="M' + cx.toFixed(1) + ' ' + (y0 - 6) + 'V' + (y0 - 24) + '"/><circle class="f w3" cx="' + cx.toFixed(1) + '" cy="' + (y0 - 34) + '" r="10" fill="#e9e6df"/><text class="mk" x="' + cx.toFixed(1) + '" y="' + (y0 - 30) + '" text-anchor="middle">' + (i + 1) + '</text>';
      var row = (wi < 34 && i % 2) ? 1 : 0;
      dims += '<text class="tx-s" x="' + cx.toFixed(1) + '" y="' + (y0 + H + 36 + row * 14) + '" text-anchor="middle">' + l[2] + '</text>';
      x += wi; xs.push(x);
    });
    var yd = y0 + H + 18;
    var chain = 'M' + x0 + ' ' + yd + 'H' + (x0 + W), t = '';
    xs.forEach(function (px) { chain += 'M' + (px - 4).toFixed(1) + ' ' + (yd + 4) + 'L' + (px + 4).toFixed(1) + ' ' + (yd - 4); });
    var yo = y0 + H + 74;
    var tx = x0 + (xs[xs.length - 1] - x0) / 2;
    s += '<g>' + fills + '</g>' + parts +
      '<path class="d w3" d="' + chain + '"/>' +
      '<path class="d w3" d="M' + x0 + ' ' + yo + 'H' + xs[xs.length - 1].toFixed(1) + 'M' + (x0 - 4) + ' ' + (yo + 4) + 'L' + (x0 + 4) + ' ' + (yo - 4) + 'M' + (xs[xs.length - 1] - 4).toFixed(1) + ' ' + (yo + 4) + 'L' + (xs[xs.length - 1] + 4).toFixed(1) + ' ' + (yo - 4) + '"/>' +
      '<g data-f>' + marks + dims + '<text x="' + tx.toFixed(1) + '" y="' + (yo + 18) + '" text-anchor="middle">' + tot + ' mm</text>' +
      '<text class="tx-s" x="' + x0 + '" y="22">' + m.face + '</text><text class="tx-s" x="' + xs[xs.length - 1].toFixed(1) + '" y="22" text-anchor="end">' + m.back + '</text>' +
      '</g></svg>';
    return s;
  }

  var ARR = '<svg class="arr" viewBox="0 0 24 24"><path d="M3 12h17M14 6l6 6-6 6"/></svg>';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  window.initMaterials = function () {
    var gsap = window.gsap, ST = window.ScrollTrigger, qs = Core.qs, qsa = Core.qsa, d = document, RM = Core.RM;
    d.body.insertAdjacentHTML('beforeend', SPRITE);
    var list = qs('.mx__list'), cards = [];
    /* ---- rows ---- */
    M.forEach(function (m) {
      var r = d.createElement('button'); r.type = 'button'; r.className = 'mx__row';
      r.dataset.id = m.id; r.dataset.type = m.t; r.dataset.no = m.no; r.dataset.name = m.n; r.dataset.used = m.cnt;
      r.setAttribute('aria-label', 'Open M-' + ('0' + m.no).slice(-2) + ', ' + m.n);
      r.innerHTML = '<span class="mx__no lbl">M-' + ('0' + m.no).slice(-2) + '</span><span class="mx__nm"><b>' + esc(m.n) + '</b><em>' + esc(m.s) + '</em></span><span class="mx__ty lbl">' + TYPES[m.t] + '</span><span class="mx__bu lbl">' + m.tot + ' mm<i>' + m.L.length + ' layers</i></span><span class="mx__us lbl">' + m.cnt + (m.cnt === 1 ? ' project' : ' projects') + '</span><span class="mx__go">' + ARR + '</span>';
      list.appendChild(r);
    });
    var rows = qsa('.mx__row', list);

    /* ---- filter + sort (Flip) ---- */
    var cur = { f: 'all', s: 'no' };
    function cmp(a, b) {
      if (cur.s === 'name') return a.dataset.name.localeCompare(b.dataset.name);
      if (cur.s === 'used') return (+b.dataset.used - +a.dataset.used) || (+a.dataset.no - +b.dataset.no);
      return +a.dataset.no - +b.dataset.no;
    }
    function apply(anim) {
      var state = anim && !RM && window.Flip ? Flip.getState(rows) : null;
      rows.forEach(function (r) { r.classList.toggle('is-out', !(cur.f === 'all' || r.dataset.type === cur.f)); });
      rows.slice().sort(cmp).forEach(function (r) { list.appendChild(r); });
      var c = rows.filter(function (r) { return !r.classList.contains('is-out'); }).length;
      qsa('.js-mcount').forEach(function (e) { e.textContent = ('0' + c).slice(-2); });
      if (!state) { ST.refresh(); return; }
      Flip.from(state, { duration: .9, ease: 'expo.inOut', absolute: true, stagger: .02,
        onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, delay: .3, ease: 'expo.out' }); },
        onLeave: function (els) { return gsap.to(els, { opacity: 0, duration: .35 }); },
        onComplete: function () { gsap.set(rows, { clearProps: 'transform,opacity' }); ST.refresh(); } });
    }
    qsa('[data-filter]').forEach(function (b) { b.addEventListener('click', function () {
      if (cur.f === b.dataset.filter) return; cur.f = b.dataset.filter;
      qsa('[data-filter]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      apply(true);
      var top = qs('#index'); if (top && top.getBoundingClientRect().top < -10 && Core.lenis) Core.lenis.scrollTo(top, { duration: 1.1, offset: -10 });
    }); });
    qsa('[data-sort]').forEach(function (b) { b.addEventListener('click', function () {
      if (cur.s === b.dataset.sort) return; cur.s = b.dataset.sort;
      qsa('[data-sort]').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      apply(true);
    }); });
    if (!RM) {
      gsap.set(rows, { autoAlpha: 0, y: 24 });
      ST.create({ trigger: list, start: 'top 88%', once: true, onEnter: function () { gsap.to(rows, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .045 }); } });
    }

    /* ---- hover preview ---- */
    var peek = qs('.peek');
    if (peek && Core.FINE && !RM) {
      var items = {}, cap = qs('.lbl', peek);
      M.forEach(function (m) {
        var w = d.createElement('div'); w.className = 'peek__it'; w.style.cssText = 'position:absolute;inset:0;clip-path:inset(100% 0 0 0)';
        w.innerHTML = '<img src="img/' + m.img + '.webp" alt="" style="object-fit:cover;width:100%;height:100%">'; peek.insertBefore(w, cap); items[m.id] = w;
      });
      gsap.set(peek, { xPercent: -50, yPercent: -50, scale: .85 });
      var xT = gsap.quickTo(peek, 'x', { duration: .75, ease: 'power3' }), yT = gsap.quickTo(peek, 'y', { duration: .75, ease: 'power3' }), rT = gsap.quickTo(peek, 'rotation', { duration: 1, ease: 'power3' });
      var lastX = 0, active = null, z = 1;
      list.addEventListener('mousemove', function (e) { xT(e.clientX + innerWidth * .07); yT(e.clientY); rT(clamp((e.clientX - lastX) * .35, -7, 7)); lastX = e.clientX; clearTimeout(list.__t); list.__t = setTimeout(function () { rT(0); }, 90); });
      list.addEventListener('mouseenter', function (e) { gsap.set(peek, { x: e.clientX + innerWidth * .07, y: e.clientY }); gsap.to(peek, { autoAlpha: 1, scale: 1, duration: .7, ease: 'expo.out' }); });
      list.addEventListener('mouseleave', function () { gsap.to(peek, { autoAlpha: 0, scale: .85, duration: .5, ease: 'expo.out' }); active = null; });
      rows.forEach(function (r) { r.addEventListener('mouseenter', function () {
        var k = r.dataset.id, it = items[k]; if (!it || active === k) return; active = k; it.style.zIndex = ++z;
        gsap.fromTo(it, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .85, ease: 'expo.out', overwrite: true });
        cap.innerHTML = '<span>' + esc(r.dataset.name) + '</span><span>' + TYPES[r.dataset.type] + '</span>';
      }); });
    }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    /* ---- drawer ---- */
    var dr = qs('#drawer'), panel = qs('.dr__panel', dr), scrim = qs('.dr__scrim', dr), body = qs('.dr__body', dr);
    var open = false, curId = null, lastFocus = null;
    function fill(m) {
      qs('.js-dr-no', dr).textContent = 'M-' + ('0' + m.no).slice(-2) + ' / 17';
      qs('.js-dr-type', dr).textContent = TYPES[m.t];
      qs('.dr__title', dr).textContent = m.n;
      qs('.dr__lead', dr).textContent = m.lead;
      qs('.dr__svg', dr).innerHTML = section(m);
      qs('.js-dr-cap', dr).innerHTML = '<span><b>Build-up</b> ' + m.L.length + ' layers</span><span>Scale 1:5</span><span>Section, mm</span>';
      qs('.dr__layers', dr).innerHTML = m.L.map(function (l, i) { return '<li><span class="lbl">' + (i + 1) + '</span><span>' + esc(l[1]) + '</span><span class="lbl">' + l[2] + ' mm</span></li>'; }).join('');
      qs('.dr__spec', dr).innerHTML = m.sp.map(function (s) { return '<div><dt class="lbl">' + s[0] + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('');
      qs('.dr__use ul', dr).innerHTML = m.u.map(function (u) { var p = PROJ[u[0]]; var href = p[3] ? 'projects.html#' + u[0] : 'projects.html#archive'; return '<li><a href="' + href + '"><span class="dr__pn">' + p[0] + '</span><span class="lbl">' + esc(u[1]) + '</span>' + ARR + '</a></li>'; }).join('');
      var pi = M.indexOf(m);
      qs('.js-dr-prev', dr).dataset.go = M[(pi + M.length - 1) % M.length].id;
      qs('.js-dr-next', dr).dataset.go = M[(pi + 1) % M.length].id;
      qs('.js-dr-prevn', dr).textContent = M[(pi + M.length - 1) % M.length].n;
      qs('.js-dr-nextn', dr).textContent = M[(pi + 1) % M.length].n;
      // draw
      var svg = qs('.dr__svg svg', dr), ds = qsa('.d', svg), fd = qsa('[data-f]', svg);
      if (!RM) {
        ds.forEach(function (e) { var L = Math.ceil(e.getTotalLength()) + 2; e.style.strokeDasharray = L + ' ' + L; e.style.strokeDashoffset = L; });
        qsa('g:first-child path', svg).forEach(function (e) { e.style.opacity = 0; });
        gsap.set(fd, { opacity: 0 });
        gsap.to(ds, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: .06, delay: .35 });
        gsap.to(qsa('g:first-child path', svg), { opacity: 1, duration: .9, stagger: .06, delay: .9 });
        gsap.to(fd, { opacity: 1, duration: .8, delay: 1.2 });
        gsap.fromTo(qsa('.dr__lead, .dr__layers li, .dr__spec > div, .dr__use li', dr), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .035, delay: .35 });
      }
    }
    function show(id, instant) {
      var m = M.filter(function (x) { return x.id === id; })[0]; if (!m) return;
      curId = id; fill(m);
      rows.forEach(function (r) { r.classList.toggle('is-cur', r.dataset.id === id); });
      try { history.replaceState(null, '', '#' + id); } catch (e) {}
      body.scrollTop = 0;
      if (open) return;
      open = true; lastFocus = d.activeElement;
      dr.hidden = false; d.documentElement.classList.add('dr-open');
      if (Core.lenis) Core.lenis.stop();
      if (RM) { gsap.set(panel, { x: 0 }); gsap.set(scrim, { opacity: 1 }); }
      else {
        gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power2.out' });
        gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 1, ease: 'expo.out' });
      }
      setTimeout(function () { var c = qs('.dr__x', dr); if (c) c.focus({ preventScroll: true }); }, 60);
    }
    function hide() {
      if (!open) return; open = false;
      var done = function () { dr.hidden = true; d.documentElement.classList.remove('dr-open'); if (Core.lenis) Core.lenis.start(); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); };
      try { history.replaceState(null, '', location.pathname); } catch (e) {}
      rows.forEach(function (r) { r.classList.remove('is-cur'); });
      if (RM) { done(); return; }
      gsap.to(scrim, { opacity: 0, duration: .5 });
      gsap.to(panel, { xPercent: 100, duration: .7, ease: 'expo.inOut', onComplete: done });
    }
    rows.forEach(function (r) { r.addEventListener('click', function () { show(r.dataset.id); }); });
    dr.addEventListener('click', function (e) {
      var t = e.target.closest('[data-close]'); if (t) { hide(); return; }
      var g = e.target.closest('[data-go]'); if (g) show(g.dataset.go);
    });
    d.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') hide();
      else if (e.key === 'ArrowRight') show(qs('.js-dr-next', dr).dataset.go);
      else if (e.key === 'ArrowLeft') show(qs('.js-dr-prev', dr).dataset.go);
      else if (e.key === 'Tab') { // keep focus inside
        var f = qsa('button, a[href]', panel).filter(function (x) { return x.offsetParent !== null; }); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var hm = /^#(m\d\d)$/.exec(location.hash); if (hm) setTimeout(function () { show(hm[1]); }, 900);

    /* ---- matrix ---- */
    var mx = qs('.mxm');
    if (mx) {
      var h = '<div class="mxm__r mxm__h"><span class="lbl">Material</span>' + PKEYS.map(function (k, i) { return '<span class="mxm__c" data-c="' + i + '"><span>' + PROJ[k][1] + '</span></span>'; }).join('') + '<span class="lbl mxm__t">Total</span></div>';
      M.forEach(function (m) {
        h += '<div class="mxm__r" data-id="' + m.id + '"><span class="mxm__n"><i class="lbl">M-' + ('0' + m.no).slice(-2) + '</i>' + esc(m.n) + '</span>' + PKEYS.map(function (k, i) {
          var u = m.u.filter(function (x) { return x[0] === k; })[0];
          return '<span class="mxm__c" data-c="' + i + '">' + (u ? '<i class="mxm__d ' + (PROJ[k][3] ? 'is-b' : 'is-d') + '" title="' + esc(PROJ[k][0] + ': ' + u[1]) + '"></i>' : '') + '</span>';
        }).join('') + '<span class="lbl mxm__t">' + String(m.cnt).padStart(2, '0') + '</span></div>';
      });
      h += '<div class="mxm__r mxm__f"><span class="lbl">Projects</span>' + PKEYS.map(function (k, i) { var c = M.filter(function (m) { return m.u.some(function (u) { return u[0] === k; }); }).length; return '<span class="mxm__c lbl" data-c="' + i + '">' + String(c).padStart(2, '0') + '</span>'; }).join('') + '<span class="lbl mxm__t"></span></div>';
      mx.innerHTML = h;
      var cells = qsa('.mxm__c', mx);
      mx.addEventListener('mouseover', function (e) { var c = e.target.closest('.mxm__c'); var k = c ? c.dataset.c : null; cells.forEach(function (x) { x.classList.toggle('is-col', k !== null && x.dataset.c === k); }); });
      mx.addEventListener('mouseleave', function () { cells.forEach(function (x) { x.classList.remove('is-col'); }); });
      var mrows = qsa('.mxm__r:not(.mxm__h):not(.mxm__f)', mx);
      mrows.forEach(function (r) { r.addEventListener('click', function () { show(r.dataset.id); }); });
      if (!RM) {
        var dots = qsa('.mxm__d', mx); gsap.set(dots, { scale: 0 });
        ST.create({ trigger: mx, start: 'top 80%', once: true, onEnter: function () { gsap.to(dots, { scale: 1, duration: .7, ease: 'back.out(2)', stagger: { each: .012, from: 'start' } }); } });
      }
    }
  };
})();
