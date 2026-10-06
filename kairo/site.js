/* ───────── KAIRO — site script ───────── */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, d = document, root = d.documentElement;
  if (!window.Core || !gsap) return;
  var qs = Core.qs, qsa = Core.qsa, RM = Core.RM, FINE = Core.FINE;

  Core.config({
    veilBg: '#050505', veilInk: '#ffffff', veilCols: 1,
    preloader: { key: 'kairo', brand: '', top: 'KAIRO Filmproduktion', topRight: 'Reel 2026 — Leader', bottom: 'Berlin-Kreuzberg · Est. 2016', duration: 2.4 }
  });

  /* ───────── data ───────── */
  var FILMS = [
    { id: 'white-hours', t: 'White Hours', client: 'Atelier Voss', kind: 'Fashion film', role: 'Direction, production, grade', y: '2026', fmt: '16 mm', format: '16 mm, B&W negative', rt: '02:48', dir: 'Mira Lenz', dp: 'Jonas Ekdahl', img: '../img/k_w1.webp', pos: '50% 30%', alt: 'Woman in a white suit walking through a grey studio', roll: 'A-07', scene: '14', take: '3',
      syn: 'Atelier Voss, spring/summer 2026. One model, one white suit, one corridor and three 400 ft rolls. We walked her through it eleven times and kept the take where she stopped looking for the lens.', ed: 'Yusuf Demir', gr: 'Felix Moreau', snd: 'Lio Brandau' },
    { id: 'low-tide', t: 'Low Tide', client: 'Ferro Vahl — Nord Records', kind: 'Music video', role: 'Direction, production, edit', y: '2025', fmt: 'Super 16', format: 'Super 16, B&W negative', rt: '04:12', dir: 'Noor Saleh', dp: 'Jonas Ekdahl', img: '../img/k_w3.webp', pos: '50% 30%', alt: 'Two men in profile by the sea', roll: 'C-11', scene: '3', take: '6',
      syn: 'Two brothers, the Baltic in October, wind at forty kilometres an hour. No playback on set, no dialogue, no drone. The song arrives in the edit, and it arrives late on purpose.', ed: 'Yusuf Demir', gr: 'Felix Moreau', snd: 'Lio Brandau' },
    { id: 'cold-light', t: 'Cold Light', client: 'Halden', kind: 'Commercial', role: 'Production, direction, post', y: '2025', fmt: 'Digital LF', format: 'Digital, large format', rt: '00:45', dir: 'Tobias Achterberg', dp: 'Ilka Brandt', img: '../img/k_w5.webp', pos: '50% 25%', alt: 'Woman in a black coat in hard side light', roll: 'D-02', scene: '7', take: '12',
      syn: 'Halden’s winter coat, lit by a single hard source and nothing else. One 45-second spot and six cut-downs, from treatment to delivery in nine days.', ed: 'Yusuf Demir', gr: 'Felix Moreau', snd: 'Lio Brandau' },
    { id: 'block-9', t: 'Block 9', client: 'Self-produced', kind: 'Documentary', role: 'Production, direction, post', y: '2024', fmt: '16 mm + digital', format: '16 mm and digital', rt: '61:00', dir: 'Tobias Achterberg', dp: 'Ilka Brandt', img: '../img/k_w2.webp', pos: '50% 50%', alt: 'A dark concrete hallway with a wedge of light', roll: 'D-04', scene: '41', take: '1',
      syn: 'A year inside a 1970s housing block on the edge of the city: before the renovation, during it, and after half the tenants left. Our documentary for 2024. Screened at four festivals and still our favourite thing we have made.', ed: 'Yusuf Demir', gr: 'Felix Moreau', snd: 'Lio Brandau' },
    { id: 'arcade', t: 'Arcade', client: 'Verre', kind: 'Commercial', role: 'Direction, production', y: '2024', fmt: 'Anamorphic', format: 'Digital, anamorphic', rt: '01:30', dir: 'Mira Lenz', dp: 'Ilka Brandt', img: '../img/k_w4.webp', pos: '50% 55%', alt: 'A long arcade with stripes of shadow across the floor', roll: 'B-02', scene: '1', take: '9',
      syn: 'Verre makes architectural glass. We made a film about the light that comes through it: ninety seconds, one arcade, shot between 7:40 and 7:52 on three consecutive mornings.', ed: 'Yusuf Demir', gr: 'Felix Moreau', snd: 'Lio Brandau' },
    { id: 'nachtschicht', t: 'Nachtschicht', client: 'Lune Halvorsen — Nord Records', kind: 'Music video', role: 'Direction, production, edit', y: '2023', fmt: 'Digital', format: 'Digital, handheld', rt: '03:56', dir: 'Noor Saleh', dp: 'Jonas Ekdahl', img: '../img/k_w6.webp', pos: '40% 50%', alt: 'Two camera operators at a monitor during a night shoot', roll: 'E-01', scene: '22', take: '4',
      syn: 'Three nights in a car park in Neukölln with two operators, sodium lamps and one LED panel. Every shot handheld, every take run to the end of the song.', ed: 'Yusuf Demir', gr: 'Felix Moreau', snd: 'Lio Brandau' }
  ];

  /* ───────── helpers ───────── */
  function pad(n, l) { n = String(Math.floor(n)); while (n.length < (l || 2)) n = '0' + n; return n; }
  function tc(sec) { var f = Math.floor(sec * 24 + 1e-6); return pad(f / 86400) + ':' + pad(f / 1440 % 60) + ':' + pad(f / 24 % 60) + ':' + pad(f % 24); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function textW(e) { var r = d.createRange(); r.selectNodeContents(e); return r.getBoundingClientRect().width; }
  var page = d.body.className.replace('p-', '');

  /* grain texture (generated once) */
  (function () {
    try {
      var c = d.createElement('canvas'); c.width = c.height = 160;
      var x = c.getContext('2d'), im = x.createImageData(160, 160), a = im.data;
      for (var i = 0; i < a.length; i += 4) { var v = Math.random() < .5 ? 0 : 255; a[i] = a[i + 1] = a[i + 2] = v; a[i + 3] = Math.random() * 120 | 0; }
      x.putImageData(im, 0, 0);
      root.style.setProperty('--grain', 'url(' + c.toDataURL() + ')');
    } catch (e) {}
  })();

  /* ───────── film.html: case-study template, driven by ?id= ───────── */
  var IMGSZ = { 'k_w1': [1200, 1482], 'k_w2': [1200, 1600], 'k_w3': [1200, 1800], 'k_w4': [1200, 1701], 'k_w5': [1200, 1812], 'k_w6': [1800, 1200], 'k_reel': [1800, 764], 'd1': [600, 459], 'd2': [696, 533], 'd3': [426, 900], 'd4': [900, 848], 'd5': [900, 503], 'd6': [744, 743], 'd7': [612, 552], 'd8': [576, 650], 'd9': [544, 900], 'd10': [642, 900] };
  function S(name, pos, ar, cap, wide) { var local = /^d\d/.test(name); return { s: (local ? 'img/' : '../img/') + name + '.webp', sz: IMGSZ[name], p: pos, a: ar, c: cap, w: wide }; }
  var FX = {
    'white-hours': {
      loc: 'A disused corridor in a textile works, Lichtenberg', shoot: '2 days', cam: '16 mm, four-perf, 1990s', lens: '1970s spherical primes, 25 and 50 mm', stock: 'B&W negative, 400 ASA', ratio: 'Academy', rn: 1.37, proc: 'Developed in Berlin, scanned at 4K', grade: 'Black and white, printed down two stops', shot: 33,
      quote: 'On the ninth walk she stopped looking for the lens.',
      note: ['Atelier Voss asked for a collection film and we asked for a corridor. The suit is white and the walls are not, and that was the whole idea: a figure walking out of a picture by the only light that is left. We spent the first morning with an empty camera, teaching the lens how little there was to see.', 'I told her it was a rehearsal for the light. On the ninth walk she stopped checking where we were and looked at the end of the corridor instead. That is the film. The other ten walks are in the archive and I look at them more than I should.'],
      facts: [['Runtime', '02:48'], ['Rolls', '3', '× 400 ft'], ['Walks', '11'], ['Shoot days', '2'], ['Negative', '1,200', 'ft']],
      crew: [['First assistant camera', ['Pia Wendt']], ['Gaffer', ['Jarek Nowak']], ['Styling', ['Mette Lorenz']], ['Model', ['Anouk Reiter']]],
      stills: [S('k_w1', '50% 30%', '4/5', 'Corridor, walk 09'), S('d2', '50% 50%', '1/1', 'Sleeve, wardrobe test'), S('d1', '50% 40%', '4/3', 'Test frame, 11:20'), S('k_w1', '50% 88%', '3/2', 'Walk 04, from the floor'), S('k_w1', '50% 6%', '1/1', 'Walk 09, a close one')]
    },
    'low-tide': {
      loc: 'Baltic coast, Mecklenburg, October 2025', shoot: '3 days', cam: 'Super 16, 1980s body', lens: '1970s primes, 18 and 25 mm; 10–100 zoom', stock: 'B&W negative, 400 ASA', ratio: 'Super 16', rn: 1.66, proc: 'Developed in Berlin, scanned at 4K', grade: 'Black and white, lifted blacks, grain kept', shot: 55,
      quote: 'The song arrives late, on purpose.',
      note: ['Ferro Vahl sent a demo and one sentence: two brothers, the sea, no performance. We went to the Baltic in October because the sea is the only thing that stays in the frame when everything else gets cold. We brought no speaker. No playback, no dialogue, no drone: only wind at forty kilometres an hour, which did most of the directing.', 'The song comes in the edit. Yusuf found the first beat on day three, under a shot we had written off as a lens test, and after that the film cut itself. I am proud that the band had to wait until the second minute for the first chorus.'],
      facts: [['Runtime', '04:12'], ['Shoot days', '3'], ['Wind', '40', 'km/h'], ['Rolls', '5'], ['Playback', 'None']],
      crew: [['Artist', ['Ferro Vahl']], ['Cast', ['Emil Raths', 'Jakob Raths']], ['First assistant camera', ['Pia Wendt']], ['Production assistant', ['Kaspar Linde']]],
      stills: [S('k_w3', '50% 30%', '4/5', 'The pier, third morning'), S('k_reel', '50% 46%', '21/9', 'On set, Baltic coast, Oct 2025', true), S('d4', '50% 40%', '1/1', 'Brothers, wind side'), S('d8', '50% 40%', '1/1', 'Camera, between takes'), S('d10', '50% 30%', '3/4', 'Collar, test frame'), S('k_w3', '50% 78%', '3/2', 'Two coats, shingle')]
    },
    'cold-light': {
      loc: 'The hall, KAIRO studio, Kreuzberg', shoot: '1 day', cam: 'Large-format digital, open gate', lens: 'Adapted 1970s primes, 50 and 85 mm', stock: 'Digital, 4.5K open gate', ratio: 'Widescreen', rn: 1.78, proc: 'Rushes graded the same night', grade: 'Monochrome, one hard shoulder, no fill', shot: 220,
      quote: 'One lamp, hard from the left. Nothing else.',
      note: ['Halden wanted warmth. I wanted to prove that cold is warmer. A winter coat is a wall, so we lit it like architecture: one hard source from camera left, no fill, no bounce, and a model who was allowed to be cold for exactly as long as it took.', 'Nine days from treatment to delivery is a bad idea we would do again. The shoot took a day, the grade two evenings, and six cut-downs took the rest. The 45-second version is still the one I trust.'],
      facts: [['Runtime', '00:45'], ['Cut-downs', '6'], ['Lamps', '1'], ['Shoot days', '1'], ['To delivery', '9', 'days']],
      crew: [['Model', ['Sasha Ruud']], ['Gaffer', ['Jarek Nowak']], ['Wardrobe', ['Halden atelier']], ['Producer', ['Hanne Stolz']]],
      stills: [S('k_w5', '50% 25%', '4/5', 'The coat, take 12'), S('d6', '50% 45%', '1/1', 'Profile, hard from the left'), S('k_w5', '50% 72%', '3/2', 'Sleeve and shadow'), S('k_w5', '50% 8%', '1/1', 'Eyes, take 07'), S('d10', '50% 40%', '3/4', 'Lapel, test frame')]
    },
    'block-9': {
      loc: 'A 1970s housing block on the eastern edge of Berlin', shoot: '61 days over 13 months', cam: '16 mm and digital', lens: '1970s primes; 16 mm zoom, 10–100', stock: 'B&W and colour negative, 50 ASA daylight', ratio: 'Academy', rn: 1.37, proc: 'Developed in Berlin; digital rushes graded nightly', grade: 'Black and white for the tenants, colour for the building', shot: 580,
      quote: 'Half the tenants left. We stayed.',
      note: ['We asked permission to film one flat. A year later it had become twenty-three people and a building, which is a different film, and we made that one. I was there for the scaffolding and for the afternoon the lift was switched off for the last time.', 'There is no narration. If someone was in the corridor with us, they are in the film. If they left, the film follows the empty flat, which is what a building does with its tenants.'],
      facts: [['Runtime', '61:00'], ['Tenants', '23'], ['Months', '13'], ['Festivals', '4'], ['Rolls', '11', 'colour']],
      crew: [['Archive research', ['Marit Ohl']], ['Camera assistant', ['Pia Wendt']], ['Production assistant', ['Kaspar Linde']], ['With thanks to', ['The residents of Block 9']]],
      stills: [S('k_w2', '50% 50%', '3/4', 'Hallway, third floor'), S('d3', '50% 60%', '9/19', 'Stairwell, before the works'), S('k_w2', '50% 90%', '3/2', 'Grates, ground level'), S('k_w2', '50% 25%', '1/1', 'The wedge of light, 16:40')]
    },
    'arcade': {
      loc: 'An arcade in a Berlin side street, 07:40 to 07:52', shoot: '3 mornings', cam: 'Digital cinema camera, Super 35', lens: 'Anamorphic 2×, 35, 50, 75 and 100 mm', stock: 'Digital, 4K', ratio: 'Anamorphic', rn: 2.39, proc: 'Rushes graded the same morning', grade: 'Black and white, one look for all three mornings', shot: 71,
      quote: 'Twelve minutes of sun, three mornings, no lamps.',
      note: ['Verre make glass for buildings. We wanted a film in which the building does the work. We found the arcade in January and went back every morning for a week to learn when the sun would clear the block opposite. In March it did, at 7:40.', 'We rehearsed with an empty camera on day one and shot on day two. On day three the light came in nine degrees further south than the day before, and Ilka said, without looking up, that we should keep that one. The film is the third morning.'],
      facts: [['Runtime', '01:30'], ['Mornings', '3'], ['Window', '12', 'min'], ['Lamps', '0'], ['Squeeze', '2×']],
      crew: [['Focus puller', ['Pia Wendt']], ['Grip', ['Dario Fehr']], ['Product', ['Architectural glass']], ['Producer', ['Hanne Stolz']]],
      stills: [S('k_w4', '50% 55%', '4/5', 'Morning two, 07:44'), S('d5', '50% 50%', '9/5', 'Shadow, floor level'), S('d9', '50% 50%', '3/5', 'The arches, test frame'), S('k_w4', '50% 90%', '3/2', 'Stripes on the paving'), S('k_w4', '50% 20%', '1/1', 'The gap in the roof')]
    },
    'nachtschicht': {
      loc: 'A multi-storey car park, Neukölln, three nights', shoot: '3 nights', cam: 'Handheld digital body', lens: 'Spherical primes, 35 and 50 mm', stock: 'Digital, 4K, high base ISO', ratio: 'Flat', rn: 1.85, proc: 'Rushes graded the same night', grade: 'Sodium orange pushed to grey, skin left alone', shot: 158,
      quote: 'Every take run to the end of the song.',
      note: ['Lune Halvorsen’s song is three minutes fifty-six long and she had never been filmed. We took a car park in Neukölln, fourteen sodium lamps that were already there and one LED panel we kept in the van until three in the morning.', 'We played the song through from start to finish every time, handheld, with the two operators swapping places between takes. By the third night there was a frame in which one of them is reflected in the other’s lens. That frame is the cover.'],
      facts: [['Runtime', '03:56'], ['Nights', '3'], ['Operators', '2'], ['Street lamps', '14'], ['Panels', '1']],
      crew: [['Artist', ['Lune Halvorsen']], ['Second operator', ['Ida Kamp']], ['Gaffer', ['Jarek Nowak']], ['Production assistant', ['Kaspar Linde']]],
      stills: [S('k_w6', '40% 50%', '3/2', 'Operators at the monitor, night two'), S('d7', '50% 40%', '4/3', 'Reflection, take 19'), S('d10', '50% 40%', '3/4', 'Collar, level 3'), S('k_w6', '88% 50%', '4/5', 'The monitor, 03:41'), S('k_w6', '8% 50%', '1/1', 'Ramp, sodium light')]
    }
  };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function rtMin(rt) { var p = rt.split(':'); return +p[0] + (+p[1]) / 60; }
  function fmtShot(m) { return m >= 60 ? Math.floor(m / 60) + ' h ' + pad(m % 60) + ' min' : m + ' min'; }
  var FILM_IX = -1;
  (function renderFilm() {
    var rootEl = qs('#filmRoot'); if (!rootEl) return;
    var id = ''; try { id = new URLSearchParams(location.search).get('id') || ''; } catch (e) {}
    var i = FILMS.map(function (f) { return f.id; }).indexOf(id); if (i < 0) i = 0;
    FILM_IX = i;
    var f = FILMS[i], x = FX[f.id], n = FILMS.length, nx = FILMS[(i + 1) % n], pv = FILMS[(i + n - 1) % n];
    var set = function (sel, html) { var e = qs(sel); if (e) e.innerHTML = html; return e; };
    document.title = f.t + ' — ' + f.client + ' — KAIRO';
    var md = qs('meta[name=description]'); if (md) md.setAttribute('content', f.t + ' for ' + f.client + ' (' + f.y + '): ' + f.kind.toLowerCase() + ', ' + f.format + '. Director’s note, technical sheet, stills and credits.');
    history.replaceState(null, '', location.pathname + '?id=' + f.id);
    /* hero */
    var hi = qs('#fHero'); hi.src = f.img; hi.alt = f.alt; hi.style.objectPosition = f.pos; if (IMGSZ[f.img.split('/').pop().replace('.webp', '')]) { var sz = IMGSZ[f.img.split('/').pop().replace('.webp', '')]; hi.width = sz[0]; hi.height = sz[1]; }
    set('#fMetaL', 'Film ' + pad(i + 1) + ' / ' + pad(n) + '<br>Roll ' + f.roll + ' · Sc ' + f.scene + ' / Tk ' + f.take);
    set('#fMetaR', esc(f.client) + '<br>' + f.y);
    var t = qs('#fTitle'); t.textContent = f.t; t.setAttribute('aria-label', f.t);
    set('#fBase', '<span class="lab">' + esc(f.kind) + '</span><span class="lab">' + esc(f.client) + '</span><span class="lab">' + esc(f.fmt) + '</span><span class="lab">Scroll <i class="scrl"></i></span>');
    /* brief */
    set('#fKind', esc(f.kind) + ' · ' + esc(f.role)); set('#fYear', f.y);
    set('#fSyn', esc(f.syn));
    set('#fClient', [['Commissioned by', f.client === 'Self-produced' ? 'KAIRO, self-produced' : f.client], ['Discipline', f.kind], ['KAIRO did', f.role], ['Released', f.y]].map(function (r) { return '<div><dt class="mono">' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join(''));
    set('#fFacts', x.facts.map(function (r) { return '<div><span class="mono dim">' + r[0] + '</span><b>' + esc(r[1]) + (r[2] ? '<em>' + esc(r[2]) + '</em>' : '') + '</b></div>'; }).join(''));
    /* note */
    set('#fQuote', '“' + esc(x.quote) + '”');
    set('#fNoteBy', 'By ' + esc(f.dir)); set('#fNoteName', esc(f.dir)); set('#fNoteRole', 'Director — ' + f.t);
    set('#fNote', x.note.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '<span class="mono dim">— ' + esc(f.dir) + ', Kreuzberg</span>');
    /* spec */
    set('#fRoll', 'Roll ' + f.roll + ' · Sc ' + f.scene + ' · Tk ' + f.take);
    set('#fSpec', [['Format', f.format], ['Stock', x.stock], ['Camera', x.cam], ['Lenses', x.lens], ['Ratio', x.ratio + ' · ' + x.rn.toFixed(2) + ' : 1'], ['Runtime', f.rt + ' (mm:ss)'], ['Shot over', x.shoot], ['Location', x.loc], ['Processing', x.proc], ['Grade', x.grade]].map(function (r) { return '<div><dt class="mono">' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join(''));
    var w = 320, h = w / x.rn; if (h > 230) { h = 230; w = h * x.rn; }
    var fx = 200 - w / 2, fy = 150 - h / 2, fr = qs('#fFrame'); fr.setAttribute('x', fx.toFixed(1)); fr.setAttribute('y', fy.toFixed(1)); fr.setAttribute('width', w.toFixed(1)); fr.setAttribute('height', h.toFixed(1));
    var sx = fx + w * 0.05, sy = fy + h * 0.05, sw = w * 0.9, sh = h * 0.9;
    qs('#fSafe').setAttribute('d', 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + 'h' + sw.toFixed(1) + 'v' + sh.toFixed(1) + 'h-' + sw.toFixed(1) + 'z');
    set('#fRatio', x.rn.toFixed(2) + ' : 1'); set('#fGateL', 'Frame guide · 90% safe');
    var kept = rtMin(f.rt), keptPct = Math.max(1.2, kept / x.shot * 100);
    set('#fExp', '<div class="exp__r"><span class="mono">Shot</span><i class="exp__t"><i class="exp__bar" data-w="100"></i></i><b class="mono">' + fmtShot(x.shot) + '</b></div><div class="exp__r"><span class="mono">In the film</span><i class="exp__t"><i class="exp__bar k" data-w="' + keptPct.toFixed(2) + '"></i></i><b class="mono">' + f.rt + '</b></div><div class="exp__sum mono"><span>Shooting ratio</span><b>' + Math.round(x.shot / kept) + ' : 1</b></div>');
    /* stills */
    set('#fStillsN', x.stills.length + ' frames');
    set('#fGal', x.stills.map(function (s, k) {
      return '<figure' + (s.w ? ' class="wide"' : '') + '><div class="media" data-img data-parallax="0.05" style="aspect-ratio:' + s.a + '"><img src="' + s.s + '" alt="' + esc(f.t + ', ' + s.c) + '" width="' + (s.sz ? s.sz[0] : 1200) + '" height="' + (s.sz ? s.sz[1] : 1200) + '" loading="lazy" style="object-position:' + s.p + '"></div><figcaption class="mono"><span>' + esc(s.c) + '</span><span>Frame ' + pad(k + 1) + '</span></figcaption></figure>';
    }).join(''));
    /* credits */
    var nm = function (c) { return c.split(' — '); };
    var cr = [[f.client === 'Self-produced' ? 'Production' : 'Commissioned by', f.client === 'Self-produced' ? ['KAIRO Filmproduktion'] : nm(f.client)], ['Directed by', [f.dir]], ['Director of photography', [f.dp]], ['Executive producer', ['Hanne Stolz']]].concat(x.crew).concat([['Editor', [f.ed]], ['Colourist', [f.gr]], ['Sound & conform', [f.snd]]]);
    set('#fCredits', cr.map(function (r) { return '<div class="cr"><span class="cr__role lab">' + esc(r[0]) + '</span><span class="cr__n">' + r[1].map(function (q) { return '<span>' + esc(q) + '</span>'; }).join('') + '</span></div>'; }).join('') + '<div class="cr cr--end"><span class="d">Cut.</span><span class="mono dim">KAIRO Filmproduktion — Kreuzberg, Berlin<br>Shot and finished under one roof</span></div>');
    set('#fRollT', esc(f.t) + ' — ' + f.y);
    var ri = qs('#fRollImg'); ri.src = x.stills[x.stills.length > 2 ? 2 : 0].s; ri.style.objectPosition = x.stills[x.stills.length > 2 ? 2 : 0].p; set('#fRollCap', 'Frame grab · ' + f.roll);
    /* next */
    set('#fNextIdx', 'Film ' + pad(((i + 1) % n) + 1) + ' / ' + pad(n));
    qs('#fNextA').href = 'film.html?id=' + nx.id; set('#fNextT', esc(nx.t)); set('#fNextC', esc(nx.client) + ' · ' + nx.y); set('#fNextF', esc(nx.kind) + ' · ' + esc(nx.fmt));
    var ni = qs('#fNextImg'); ni.src = nx.img; ni.style.objectPosition = nx.pos; ni.alt = '';
    qs('#fPrevA').href = 'film.html?id=' + pv.id; set('#fPrevT', esc(pv.t));
  })();

  /* page-transition defaults on every internal link (core copies undefined values otherwise) */
  qsa('a[href]').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|https?:|javascript:)/i.test(h)) return;
    if (!a.dataset.veil) a.dataset.veil = '#050505';
    if (!a.dataset.veilInk) a.dataset.veilInk = '#ffffff';
    if (!a.dataset.veilLabel) a.dataset.veilLabel = 'KAIRO';
  });
  qsa('.nl').forEach(function (a) { var key = page === 'film' ? 'work' : page; if (new RegExp('^' + key + '\\.html').test(a.getAttribute('href'))) a.setAttribute('aria-current', 'page'); });

  /* ───────── preloader: academy leader 3-2-1, white pop, hard wipe ───────── */
  d.addEventListener('DOMContentLoaded', function () {
    var pre = qs('.pre'); if (!pre) return;
    var L = Core.el('div', 'lead', '<i class="lead__x"></i><i class="lead__y"></i><div class="lead__sweep"></div><div class="lead__ring"></div><div class="lead__n">3</div>');
    var tcEl = Core.el('div', 'lead__tc', '00:00:00:00'), scr = Core.el('i', 'lead__scr');
    pre.append(L, scr, tcEl);
    var n = qs('.lead__n', L), sw = qs('.lead__sweep', L), o = { t: 0 }, top = qs('.pre__top', pre), out = false;
    var tl = gsap.timeline();
    [3, 2, 1].forEach(function (k, i) {
      tl.call(function () { n.textContent = k; }, null, i * 0.8);
      tl.fromTo(sw, { '--a': '0deg' }, { '--a': '360deg', duration: 0.8, ease: 'none' }, i * 0.8);
    });
    tl.to(o, { t: 2.4, duration: 2.4, ease: 'none', onUpdate: function () { tcEl.textContent = tc(o.t + 3600 * 0); } }, 0);
    function watch() {
      if (!pre.isConnected) { gsap.ticker.remove(watch); return; }
      if (!out && parseFloat(getComputedStyle(top).opacity) < 0.98) {
        out = true; L.style.visibility = 'hidden'; scr.style.visibility = 'hidden';
        gsap.delayedCall(0.4, function () { pre.classList.add('is-flash'); });
        gsap.delayedCall(0.48, function () { pre.classList.remove('is-flash'); });
      }
    }
    gsap.ticker.add(watch);
    Core.onReady(function () {
      gsap.ticker.remove(watch);
      gsap.fromTo(pre, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut' });
    });
  });

  /* ───────── wordmark: fitted edge-to-edge, variable-width ripple ───────── */
  function Wordmark(el) {
    var text = el.dataset.text || el.textContent.trim();
    var base = +el.dataset.base || 92, baseW = 800;
    el.textContent = '';
    var w = Core.el('span', 'wm__w'); w.setAttribute('aria-hidden', 'true');
    var cs = text.split('').map(function (ch) {
      var s = Core.el('span', 'wm__c' + (ch === ' ' ? ' sp' : ''));
      var inn = Core.el('span', 'wm__in'); inn.textContent = ch === ' ' ? ' ' : ch;
      s.appendChild(inn); w.appendChild(s); return s;
    });
    el.appendChild(w);
    if (!/^H\d$/.test(el.tagName)) { var vh = Core.el('span', 'u-vh'); vh.textContent = text; el.appendChild(vh); }
    w.style.position = 'absolute'; w.style.left = '0'; w.style.bottom = '0';
    var n = cs.length, S = [], W = [], cx = [], wt = [];
    for (var i = 0; i < n; i++) { S[i] = base; W[i] = baseW; wt[i] = cs[i].classList.contains('sp') ? 0.3 : (text[i] === 'I' ? 0.55 : 1); }
    var fs = 100, live = true, act = 0, mx = 0, hover = false, avail = 1;
    var intro = { p: -1, a: 0 }, zone = el.closest('[data-wm-zone]') || el.parentElement;
    var isHero = !!el.closest('.hero');

    function apply() { for (var i = 0; i < n; i++) { cs[i].style.fontStretch = S[i].toFixed(2) + '%'; cs[i].style.fontWeight = W[i].toFixed(0); } }
    function measure(scale) {
      var r0 = el.getBoundingClientRect().left;
      for (var i = 0; i < n; i++) { var r = cs[i].getBoundingClientRect(); cx[i] = (r.left - r0 + r.width / 2) * scale; }
    }
    function fit(setBase) {
      avail = el.clientWidth || innerWidth;
      w.style.fontSize = fs + 'px';
      var ww = w.getBoundingClientRect().width; if (!ww) return;
      var k = avail / ww; measure(k);
      fs = fs * k; w.style.fontSize = fs + 'px';
      if (setBase) el.style.setProperty('--wm-fs', fs + 'px');
    }
    function refit() {
      var sS = S.slice(), sW = W.slice();
      for (var i = 0; i < n; i++) { S[i] = base; W[i] = baseW; }
      apply(); fit(true);
      S = sS; W = sW; apply(); fit(false);
    }
    refit();
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(refit);
    addEventListener('resize', function () { clearTimeout(el.__rt); el.__rt = setTimeout(refit, 80); });

    if (FINE) {
      zone.addEventListener('mousemove', function (e) { hover = true; mx = e.clientX - el.getBoundingClientRect().left; });
      zone.addEventListener('mouseleave', function () { hover = false; });
    } else {
      zone.addEventListener('touchmove', function (e) { var t = e.touches[0]; if (!t) return; hover = true; mx = t.clientX - el.getBoundingClientRect().left; clearTimeout(el.__tt); el.__tt = setTimeout(function () { hover = false; }, 900); }, { passive: true });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { live = es[0].isIntersecting; }).observe(el);

    el.__intro = function (delay) {
      if (RM) return;
      gsap.fromTo(intro, { p: -0.15, a: 1 }, { p: 1.15, a: 0, duration: 2.4, ease: 'power2.inOut', delay: delay || 0 });
    };

    var sig, still = 0;
    gsap.ticker.add(function (time, dt) {
      if (!live || RM) return;
      var settle = isHero ? clamp(1 - scrollY / (innerHeight * 0.55), 0, 1) : 1;
      var tAct, tmx;
      if (hover) { tAct = 1; tmx = mx; }
      else if (intro.a > 0.001) { tAct = intro.a; tmx = intro.p * avail; }
      else if (!FINE) { tAct = 0.55; tmx = (0.5 + 0.5 * Math.sin(time * 0.6)) * avail; }
      else { tAct = 0; tmx = mx; }
      var kk = 1 - Math.pow(1 - 0.09, (dt || 16.7) / 16.7);
      act += (tAct * settle - act) * kk;
      mx = hover ? mx : tmx;
      sig = avail * 0.16;
      var g = [], gm = 0, ws = 0, i;
      for (i = 0; i < n; i++) { g[i] = Math.exp(-Math.pow((cx[i] - tmx) / sig, 2)); gm += g[i] * wt[i]; ws += wt[i]; }
      gm /= ws;
      var k2 = 1 - Math.pow(1 - 0.16, (dt || 16.7) / 16.7), moved = 0;
      for (i = 0; i < n; i++) {
        var ts = clamp(base + act * 86 * (g[i] - gm), 62, 125);
        var tw = clamp(baseW + act * ((240 + 660 * g[i]) - baseW), 100, 900);
        var ds = (ts - S[i]) * k2, dw = (tw - W[i]) * k2;
        S[i] += ds; W[i] += dw; moved += Math.abs(ds) + Math.abs(dw) * 0.05;
      }
      if (moved < 0.004) { if (++still > 2) return; } else still = 0;
      apply(); fit(false);
    });
    return el;
  }
  var WMS = qsa('[data-wm]').map(Wordmark);

  /* ───────── fitted lines whose width axis is scrubbed by scroll ───────── */
  function FitLine(el) {
    var fin = +el.dataset.fit || 100, finW = +el.dataset.fitw || 900, from = +el.dataset.from || 62, fromW = +el.dataset.fromw || 220;
    function fit() {
      var cs = el.style.fontStretch, cw = el.style.fontWeight;
      el.style.fontStretch = fin + '%'; el.style.fontWeight = finW; el.style.fontSize = '100px';
      var avail = el.clientWidth, tw = textW(el);
      el.style.fontSize = ''; el.style.setProperty('--fs', (100 * avail / tw * 0.995) + 'px');
      el.style.fontStretch = cs; el.style.fontWeight = cw;
    }
    fit();
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(fit);
    addEventListener('resize', function () { clearTimeout(el.__rt); el.__rt = setTimeout(function () { fit(); }, 80); });
    el.__fit = fit;
    if (el.hasAttribute('data-scrubw') && !RM) {
      var o = { s: from, w: fromW };
      var set = function () { el.style.fontStretch = o.s.toFixed(2) + '%'; el.style.fontWeight = o.w.toFixed(0); };
      set();
      Core.onReady(function () {
        gsap.to(o, { s: fin, w: finW, ease: 'none', onUpdate: set, scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 42%', scrub: 0.9 } });
      });
    }
    return el;
  }
  qsa('[data-fit]').forEach(FitLine);

  /* ───────── rows: inversion + cursor-following still + hover stretch ───────── */
  function fitHover(rows, sel, nextSel, varName, view) {
    rows.forEach(function (r) {
      var t = qs(sel, r); if (!t || !t.offsetParent) return;
      var nx = nextSel ? qs(nextSel, r) : null;
      t.style.transition = 'none';
      var w0 = t.getBoundingClientRect().width;
      t.style.fontStretch = '125%';
      var w1 = t.getBoundingClientRect().width;
      t.style.fontStretch = '';
      var left = t.getBoundingClientRect().left;
      var lim = nx && nx.offsetParent ? nx.getBoundingClientRect().left - 18 : (r.getBoundingClientRect().right - 18);
      if (view === 'grid') lim = r.getBoundingClientRect().right - 4;
      var avail = lim - left;
      var s = w1 > w0 ? 62 + 63 * clamp((avail - w0) / (w1 - w0), 0, 1) : 62;
      r.style.setProperty(varName, s.toFixed(1) + '%');
      void t.offsetWidth; t.style.transition = '';
    });
  }
  function Peek(list, peek, rowSel, getInfo, enabled) {
    if (!list || !peek || !FINE || RM) return;
    var imgs = qsa('.peek__f img', peek), rows = qsa(rowSel, list), active = -1, lastX = 0, shown = false;
    var tcE = qs('[data-peek-tc]', peek), fE = qs('[data-peek-f]', peek);
    gsap.set(peek, { xPercent: -50, yPercent: -50, scale: 0.86 });
    var xT = gsap.quickTo(peek, 'x', { duration: 0.65, ease: 'power3' }), yT = gsap.quickTo(peek, 'y', { duration: 0.65, ease: 'power3' }), rT = gsap.quickTo(peek, 'rotation', { duration: 0.8, ease: 'power3' });
    function show(v) { if (v === shown) return; shown = v; gsap.to(peek, { autoAlpha: v ? 1 : 0, scale: v ? 1 : 0.86, duration: v ? 0.6 : 0.4, ease: 'expo.out', overwrite: 'auto' }); if (!v) active = -1; }
    list.addEventListener('mousemove', function (e) {
      if (enabled && !enabled()) { show(false); return; }
      xT(e.clientX + innerWidth * 0.07); yT(e.clientY);
      rT(clamp((e.clientX - lastX) * 0.35, -7, 7)); lastX = e.clientX;
      clearTimeout(list.__pt); list.__pt = setTimeout(function () { rT(0); }, 90);
    });
    list.addEventListener('mouseleave', function () { show(false); });
    rows.forEach(function (row, i) {
      row.addEventListener('mouseenter', function (e) {
        if (enabled && !enabled()) return;
        if (!shown) { gsap.set(peek, { x: e.clientX + innerWidth * 0.07, y: e.clientY }); show(true); }
        if (i === active) return;
        imgs.forEach(function (im, j) { im.style.zIndex = j === i ? 3 : (j === active ? 2 : 0); });
        gsap.fromTo(imgs[i], { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.25 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.85, ease: 'expo.out', overwrite: true });
        var inf = getInfo(i); if (tcE) tcE.textContent = inf[0]; if (fE) fE.textContent = inf[1];
        active = i;
      });
    });
  }
  function runtimeTC(rt) { var p = rt.split(':'); return 'TC 00:' + p[0] + ':' + p[1] + ':00'; }

  var rowsWrap = qs('[data-rows]');
  if (rowsWrap) {
    var rws = qsa('.row', rowsWrap);
    var fh = function () { fitHover(rws, '.row__t', '.row__c', '--hs'); };
    Core.onReady(fh); addEventListener('resize', function () { clearTimeout(fh.t); fh.t = setTimeout(fh, 120); });
    Peek(rowsWrap, qs('.sel .peek'), '.row', function (i) { return [runtimeTC(FILMS[i].rt), FILMS[i].fmt]; });
  }

  /* ───────── showreel overlay (built from stills) ───────── */
  var REEL = [
    { card: '<span class="mono">KAIRO Filmproduktion</span><span class="d">Reel 2026</span><span class="mono dim">Stills · 24 fps · Kreuzberg</span>', dur: 2.0 },
    { img: '../img/k_reel.webp', pos: '50% 46%', dur: 2.4, tr: 'slit', cap: 'On set — Low Tide — Baltic coast' },
    { img: '../img/k_w1.webp', pos: '50% 2%', dur: 1.7, tr: 'wipeL', cap: 'White Hours — Atelier Voss — dir. Mira Lenz' },
    { img: 'img/d1.webp', pos: '50% 40%', dur: 0.55 },
    { img: 'img/d2.webp', pos: '50% 50%', dur: 0.55, flash: 1 },
    { img: '../img/k_w4.webp', pos: '50% 66%', dur: 2.0, tr: 'iris', cap: 'Arcade — Verre — dir. Mira Lenz' },
    { img: 'img/d5.webp', pos: '50% 50%', dur: 0.6 },
    { img: '../img/k_w5.webp', pos: '50% 8%', dur: 1.8, tr: 'wipeU', cap: 'Cold Light — Halden — dir. Tobias Achterberg' },
    { img: 'img/d6.webp', pos: '50% 45%', dur: 0.5 },
    { img: '../img/k_w3.webp', pos: '50% 14%', dur: 2.1, tr: 'split', cap: 'Low Tide — Ferro Vahl — dir. Noor Saleh' },
    { img: 'img/d4.webp', pos: '50% 35%', dur: 0.6, flash: 1 },
    { img: '../img/k_w2.webp', pos: '50% 55%', dur: 1.8, tr: 'wipeR', cap: 'Block 9 — Documentary — dir. Tobias Achterberg' },
    { img: '../img/k_w6.webp', pos: '50% 40%', dur: 1.6, cap: 'Nachtschicht — Lune Halvorsen — dir. Noor Saleh' },
    { img: 'img/d7.webp', pos: '50% 40%', dur: 0.5 },
    { img: 'img/d8.webp', pos: '50% 40%', dur: 0.5 },
    { card: '<span class="d">KAIRO</span><span class="mono">Kreuzberg, Berlin — since 2016</span><span class="mono dim">Fashion film · Music video · Commercial · Documentary</span>', dur: 2.8, cap: 'KAIRO — End card' }
  ];
  var CLIP = {
    cut: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)', 0.001, 'none'],
    slit: ['inset(50% 0% 50% 0%)', 'inset(0% 0% 0% 0%)', 0.8, 'expo.inOut'],
    wipeL: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)', 0.5, 'power4.inOut'],
    wipeR: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)', 0.5, 'power4.inOut'],
    wipeU: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 0.55, 'power4.inOut'],
    split: ['inset(0% 50% 0% 50%)', 'inset(0% 0% 0% 0%)', 0.6, 'expo.inOut'],
    iris: ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)', 0.8, 'expo.inOut']
  };
  function Reel() {
    var openers = qsa('[data-reel-open]'); if (!openers.length) return;
    var reel = Core.el('div', 'reel');
    reel.setAttribute('role', 'dialog'); reel.setAttribute('aria-modal', 'true'); reel.setAttribute('aria-label', 'KAIRO reel 2026, a sequence of stills'); reel.tabIndex = -1;
    var shots = '', capLast = '';
    REEL.forEach(function (s, i) {
      if (s.cap) capLast = s.cap; s._cap = capLast;
      shots += s.card ? '<div class="reel__shot reel__card">' + s.card + '</div>'
        : '<div class="reel__shot"><img src="' + s.img + '" alt="" style="object-position:' + s.pos + '"></div>';
    });
    reel.innerHTML =
      '<div class="reel__stage" data-cursor="Pause">' + shots + '<div class="reel__flash"></div><div class="reel__fx"></div></div>' +
      '<div class="reel__bar reel__bar--t"><span class="lab">KAIRO — Reel 2026 <span class="dim">· stills</span></span><span class="mono dim reel__sn">Shot 01 / ' + pad(REEL.length) + '</span>' +
      '<button class="reel__close" type="button"><span>Close</span><kbd>Esc</kbd><i class="reel__x"></i></button></div>' +
      '<div class="reel__bar reel__bar--b"><div class="reel__prog" role="slider" tabindex="0" aria-label="Reel position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="reel__ticks"></div><i></i></div>' +
      '<div class="reel__row"><button class="reel__pp" type="button" aria-label="Pause"><span class="tri"></span><span class="ps"></span></button>' +
      '<span class="mono reel__tc">00:00:00:00</span><span class="mono dim reel__fr">FR 000000</span><span></span><span class="mono reel__cap"><span></span></span></div></div>';
    d.body.appendChild(reel);
    var stage = qs('.reel__stage', reel), els = qsa('.reel__shot', reel), flash = qs('.reel__flash', reel);
    var tcE = qs('.reel__tc', reel), frE = qs('.reel__fr', reel), capE = qs('.reel__cap span', reel), snE = qs('.reel__sn', reel);
    var prog = qs('.reel__prog', reel), bar = qs('.reel__prog i', reel), pp = qs('.reel__pp', reel), closeB = qs('.reel__close', reel);
    var tl = gsap.timeline({ paused: true, repeat: -1, onUpdate: upd }), t = 0, starts = [], cur = -1, playing = false, isOpen = false, lastFocus = null;
    REEL.forEach(function (s, i) {
      var el = els[i], c = CLIP[s.tr || 'cut'], img = qs('img', el);
      starts.push(t);
      if (i === 0) gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' });
      else tl.fromTo(el, { clipPath: c[0] }, { clipPath: c[1], duration: c[2], ease: c[3], immediateRender: true }, t);
      if (img) tl.fromTo(img, { scale: 1.16, xPercent: (i % 2 ? -2 : 2) }, { scale: 1.02, xPercent: 0, duration: s.dur, ease: 'none', immediateRender: true }, t);
      else tl.fromTo(qs('.d', el), { scale: 1.06 }, { scale: 1, duration: s.dur, ease: 'power1.out', immediateRender: true }, t);
      if (s.flash) tl.fromTo(flash, { opacity: 0.85 }, { opacity: 0, duration: 0.1, ease: 'none', immediateRender: false }, t);
      t += s.dur;
    });
    var total = t;
    var ticks = qs('.reel__ticks', reel);
    starts.forEach(function (s, i) { if (i) { var b = d.createElement('b'); b.style.left = (s / total * 100) + '%'; ticks.appendChild(b); } });
    function upd() {
      var time = tl.time(), i = 0;
      while (i < starts.length - 1 && starts[i + 1] <= time + 1e-4) i++;
      tcE.textContent = tc(time); frE.textContent = 'FR ' + pad(time * 24, 6);
      bar.style.transform = 'scaleX(' + (time / total).toFixed(4) + ')';
      prog.setAttribute('aria-valuenow', Math.round(time / total * 100));
      if (i !== cur) {
        cur = i; snE.textContent = 'Shot ' + pad(i + 1) + ' / ' + pad(REEL.length);
        if (capE.textContent !== REEL[i]._cap) {
          capE.textContent = REEL[i]._cap;
          gsap.fromTo(capE, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'expo.out' });
        }
      }
    }
    function setBars() {
      var ar = innerWidth >= innerHeight * 1.05 ? 2.39 : 0.8;
      var picH = Math.min(innerHeight - 150, innerWidth / ar);
      reel.style.setProperty('--bar', Math.max(75, (innerHeight - picH) / 2) + 'px');
    }
    function play(v) {
      playing = v; reel.classList.toggle('is-playing', v); reel.classList.toggle('is-paused', !v);
      pp.setAttribute('aria-label', v ? 'Pause' : 'Play'); stage.dataset.cursor = v ? 'Pause' : 'Play';
      var ring = qs('.cursor-ring span'); if (ring && root.classList.contains('cursor-label')) ring.textContent = stage.dataset.cursor;
      v ? tl.play() : tl.pause();
    }
    function open(src) {
      if (isOpen) return; isOpen = true; lastFocus = d.activeElement;
      setBars(); reel.classList.add('is-open');
      if (Core.lenis) Core.lenis.stop();
      var r = src.getBoundingClientRect();
      tl.pause(0); cur = -1; upd();
      gsap.fromTo(reel, { clipPath: 'inset(' + Math.max(0, r.top) + 'px ' + Math.max(0, innerWidth - r.right) + 'px ' + Math.max(0, innerHeight - r.bottom) + 'px ' + Math.max(0, r.left) + 'px)' },
        { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.95, ease: 'expo.inOut' });
      gsap.fromTo(qsa('.reel__bar > *, .reel__row > *', reel), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.03, delay: 0.6 });
      gsap.delayedCall(0.35, function () { if (isOpen) play(true); });
      setTimeout(function () { closeB.focus({ preventScroll: true }); }, 50);
    }
    function close() {
      if (!isOpen) return; isOpen = false; play(false);
      gsap.to(reel, { clipPath: 'inset(50% 0px 50% 0px)', duration: 0.6, ease: 'expo.inOut', onComplete: function () {
        reel.classList.remove('is-open'); gsap.set(reel, { clearProps: 'clipPath' });
        if (Core.lenis) Core.lenis.start();
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      } });
    }
    openers.forEach(function (o) {
      o.addEventListener('click', function () { open(o); });
      o.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(o); } });
    });
    closeB.addEventListener('click', close);
    pp.addEventListener('click', function () { play(!playing); });
    stage.addEventListener('click', function () { play(!playing); });
    function seekTo(p) { tl.time(clamp(p, 0, 0.999) * total); cur = -1; upd(); }
    prog.addEventListener('click', function (e) { var r = prog.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width); });
    d.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); play(!playing); }
      else if (e.key === 'ArrowRight') seekTo((tl.time() + 2) / total);
      else if (e.key === 'ArrowLeft') seekTo((tl.time() - 2) / total);
      else if (e.key === 'Tab') {
        var f = [closeB, prog, pp], ix = f.indexOf(d.activeElement);
        e.preventDefault(); f[(ix + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    });
    addEventListener('resize', function () { if (isOpen) setBars(); });
  }
  Reel();

  /* ───────── roll HUD (pinned contact strip) ───────── */
  var roll = qs('.roll');
  if (roll) {
    var frE = qs('[data-fr]', roll), rtcE = qs('[data-rtc]', roll), rbar = qs('[data-rbar]', roll), lastP = -1;
    Core.onTick(function () {
      var tw = roll.__hs; if (!tw || !tw.scrollTrigger) return;
      var p = tw.scrollTrigger.progress; if (Math.abs(p - lastP) < 1e-4) return; lastP = p;
      var fr = Math.round(p * 1000);
      frE.textContent = pad(fr, 4); rtcE.textContent = tc(fr / 24); rbar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    });
  }

  /* ───────── still strips drifting with scroll (skew comes from data-skew) ───────── */
  qsa('.skr').forEach(function (row) {
    if (RM) return;
    var dir = +row.dataset.drift || 1, sec = row.closest('section') || row;
    Core.onReady(function () {
      gsap.fromTo(row, { x: function () { var tr = Math.max(0, row.scrollWidth - innerWidth); return dir < 0 ? -tr * 0.08 : -tr * 0.92; } },
        { x: function () { var tr = Math.max(0, row.scrollWidth - innerWidth); return dir < 0 ? -tr * 0.92 : -tr * 0.08; }, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: function () { return '+=' + (innerHeight + row.offsetHeight + innerHeight * 0.6); }, scrub: 0.6, invalidateOnRefresh: true } });
    });
  });

  /* ───────── work: list ↔ grid (Flip), slate sheet ───────── */
  var films = qs('[data-films]');
  if (films) {
    var items = qsa('.film', films), vt = qs('.vt'), vbtns = qsa('.vt button'), view = 'list', busy = false;
    var fhw = function () {
      if (view === 'list') fitHover(qsa('.film__a', films), '.film__t', '.film__c', '--hs', 'list');
      else fitHover(qsa('.film__a', films), '.film__t', null, '--hsg', 'grid');
    };
    Core.onReady(fhw); addEventListener('resize', function () { clearTimeout(fhw.t); fhw.t = setTimeout(fhw, 120); });
    Peek(films, qs('.works .peek'), '.film', function (i) { return [runtimeTC(FILMS[i].rt), FILMS[i].fmt]; }, function () { return view === 'list'; });
    function setView(v, instant) {
      if (v === view || busy) return;
      vt.dataset.v = v; vbtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === v)); });
      try { localStorage.setItem('kairo:view', v); } catch (e) {}
      var media = qsa('.film__media', films), extra = qsa('.film__bar, .film__x', films);
      if (instant || RM || !window.Flip) {
        films.classList.toggle('is-grid', v === 'grid'); films.classList.toggle('is-list', v === 'list'); view = v;
        gsap.set(media, { clearProps: 'clipPath' }); gsap.set(extra, { clearProps: 'opacity,visibility' });
        ST.refresh(); fhw(); return;
      }
      busy = true;
      var go = function () {
        var parts = qsa('.film__no, .film__t, .film__c, .film__y, .film__f', films);
        var st = Flip.getState(parts);
        films.classList.toggle('is-grid', v === 'grid'); films.classList.toggle('is-list', v === 'list'); films.classList.add('is-flipping');
        view = v;
        Flip.from(st, { duration: 1, ease: 'expo.inOut', scale: true, stagger: 0.008, onComplete: function () {
          films.classList.remove('is-flipping'); busy = false; ST.refresh(); fhw();
        } });
        if (v === 'grid') {
          gsap.fromTo(media, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', stagger: 0.07, delay: 0.25 });
          gsap.fromTo(qsa('.film__media img', films), { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.07, delay: 0.35, clearProps: 'transform' });
          gsap.fromTo(extra, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: 0.75, stagger: 0.03 });
        }
      };
      if (view === 'grid') {
        gsap.to(extra, { autoAlpha: 0, duration: 0.25 });
        gsap.to(media, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'power3.in', stagger: 0.03, onComplete: go });
      } else go();
    }
    vbtns.forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.v); }); });
    try { if (localStorage.getItem('kairo:view') === 'grid') setView('grid', true); } catch (e) {}
    Sheet(items);
  }

  function Sheet(items) {
    var sh = qs('#sheet'); if (!sh) return;
    var img = qs('.sheet__img img', sh), cur = 0, isOpen = false, lastFocus = null;
    var F = function (k) { return qs('[data-s=' + k + ']', sh); };
    var stick = qs('.slate__stick', sh), board = qs('.slate__board', sh), body = qs('.sheet__body', sh), xB = qs('[data-sheet-close]', sh);
    function fill(i) {
      var f = FILMS[i]; cur = i;
      img.src = f.img; img.alt = f.alt; img.style.objectPosition = f.pos;
      F('idx').textContent = 'Film ' + pad(i + 1) + ' / ' + pad(FILMS.length);
      F('cap').textContent = 'TC 00:' + f.rt + ':00 · ' + f.format;
      F('t').textContent = f.t; F('roll').textContent = f.roll; F('scene').textContent = f.scene; F('take').textContent = f.take;
      F('dir').textContent = f.dir; F('dp').textContent = f.dp; F('format').textContent = f.format; F('rt').textContent = f.rt;
      F('client').textContent = f.client; F('y').textContent = f.y; F('kind').textContent = f.kind;
      F('syn').textContent = f.syn; F('role').textContent = f.role; F('ed').textContent = f.ed; F('gr').textContent = f.gr; F('snd').textContent = f.snd;
      var p = FILMS[(i + FILMS.length - 1) % FILMS.length], n = FILMS[(i + 1) % FILMS.length];
      F('prev').textContent = p.t; F('next').textContent = n.t;
      var fl = qs('[data-s-link]', sh); if (fl) fl.href = 'film.html?id=' + f.id;
    }
    function clap(delay) {
      var tl = gsap.timeline({ delay: delay || 0 });
      tl.fromTo(stick, { rotation: -24 }, { rotation: -24, duration: 0.25 })
        .to(stick, { rotation: 0, duration: 0.22, ease: 'power4.in' })
        .fromTo(board, { y: 0 }, { y: 3, duration: 0.05, yoyo: true, repeat: 1, ease: 'none' })
        .fromTo(qsa('.slate__row > div, .slate__row > span', sh), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: 0.035 }, '<');
      return tl;
    }
    function open(i, from) {
      fill(i);
      history.replaceState(null, '', '#' + FILMS[i].id);
      if (isOpen) {
        gsap.fromTo(img, { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.2 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.9, ease: 'expo.inOut' });
        gsap.fromTo(qsa('.sheet__syn, .sheet__cred', sh), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.3 });
        body.scrollTop = 0; clap(0.1); return;
      }
      isOpen = true; lastFocus = from || d.activeElement;
      sh.classList.add('is-open'); body.scrollTop = 0;
      if (Core.lenis) Core.lenis.stop();
      gsap.fromTo(sh, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' });
      gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out', delay: 0.2 });
      gsap.fromTo(qsa('.sheet__top, .sheet__syn, .sheet__cred, .sheet__nav', sh), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.55 });
      clap(0.55);
      setTimeout(function () { xB.focus({ preventScroll: true }); }, 60);
    }
    function close() {
      if (!isOpen) return; isOpen = false;
      history.replaceState(null, '', location.pathname + location.search);
      gsap.to(sh, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: function () {
        sh.classList.remove('is-open'); gsap.set(sh, { clearProps: 'clipPath' });
        if (Core.lenis) Core.lenis.start();
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      } });
    }
    items.forEach(function (it, i) {
      var a = qs('.film__a', it);
      a.addEventListener('click', function (e) { e.preventDefault(); open(i, a); });
    });
    xB.addEventListener('click', close);
    qs('[data-sheet-prev]', sh).addEventListener('click', function () { open((cur + FILMS.length - 1) % FILMS.length); });
    qs('[data-sheet-next]', sh).addEventListener('click', function () { open((cur + 1) % FILMS.length); });
    d.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') open((cur + 1) % FILMS.length);
      else if (e.key === 'ArrowLeft') open((cur + FILMS.length - 1) % FILMS.length);
      else if (e.key === 'Tab') {
        var f = qsa('button, a.sheet__full', sh), ix = f.indexOf(d.activeElement);
        e.preventDefault(); f[(ix + (e.shiftKey ? f.length - 1 : 1) + f.length) % f.length].focus();
      }
    });
    var h = location.hash.slice(1), hi = FILMS.map(function (f) { return f.id; }).indexOf(h);
    if (hi > -1) Core.onReady(function () { setTimeout(function () { open(hi, qs('.film__a', items[hi])); }, 350); });
  }

  /* ───────── contact: brief form + slate success ───────── */
  var form = qs('form[data-demo]');
  if (form) {
    var take = 1;
    form.addEventListener('invalid', function (e) { var f = e.target.closest('.fld'); if (f) f.classList.add('is-bad'); }, true);
    form.addEventListener('input', function (e) { var f = e.target.closest('.fld'); if (f && e.target.checkValidity && e.target.checkValidity()) f.classList.remove('is-bad'); });
    form.addEventListener('demo:sent', function () {
      var v = function (n) { var e = form.elements[n]; return e ? (e.value || '').trim() : ''; };
      var now = new Date();
      var set = function (k, val) { var e = qs('[data-ok-v=' + k + ']', form); if (e) e.textContent = val; };
      set('prod', v('company') || v('name').split(' ').slice(-1)[0] + ' film');
      set('dir', v('name')); set('scene', v('kind') || 'Open'); set('stock', v('stock') || 'You decide');
      set('take', pad(take)); set('date', pad(now.getDate()) + '.' + pad(now.getMonth() + 1) + '.' + String(now.getFullYear()).slice(2));
      set('when', v('when') || 'No date yet'); set('take2', pad(take));
      var ok = qs('.ok', form), stick = qs('.slate__stick', ok);
      var y = ok.getBoundingClientRect().top + scrollY - 120;
      if (Core.lenis) Core.lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: 'smooth' });
      if (!RM) {
        var tl = gsap.timeline();
        tl.fromTo(ok, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
          .fromTo(stick, { rotation: -26 }, { rotation: -26, duration: 0.3 })
          .to(stick, { rotation: 0, duration: 0.2, ease: 'power4.in' })
          .fromTo(qs('.slate__board', ok), { y: 0 }, { y: 4, duration: 0.05, yoyo: true, repeat: 1 })
          .fromTo(qsa('.ok__msg > *', ok), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, '-=0.1');
      }
    });
    var again = qs('.ok__again', form);
    if (again) again.addEventListener('click', function () {
      take++;
      form.classList.remove('is-sent');
      qsa('[data-ok]', form).forEach(function (x) { x.hidden = true; });
      qsa('[data-ok-hide]', form).forEach(function (x) { x.hidden = false; });
      var t = qs('textarea', form); if (t) t.value = '';
      qs('[data-take]', form) && (qs('[data-take]', form).textContent = 'Take ' + pad(take));
      ST.refresh();
      if (t) t.focus();
    });
  }

  /* ═════════ expansion: studio ═════════ */
  var teamList = qs('.team [data-rows]');
  if (teamList) {
    var PI = [['Frame — White Hours', 'Mira Lenz'], ['Frame — Block 9', 'Tobias Achterberg'], ['Frame — Low Tide', 'Noor Saleh'], ['Frame — On set', 'Jonas Ekdahl'], ['Frame — Cold Light', 'Ilka Brandt'], ['Frame — Arcade', 'Hanne Stolz'], ['Frame — The monitor', 'Yusuf Demir'], ['Frame — Night portrait', 'Felix Moreau'], ['Frame — The stairwell', 'Lio Brandau']];
    Peek(teamList, qs('.team .peek'), '.row', function (i) { return PI[i]; });
  }

  var band = qs('.band__img img');
  if (band && !RM) Core.onReady(function () { gsap.fromTo(band, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.band__img', start: 'top bottom', end: 'bottom top', scrub: true } }); });

  /* floor plans */
  var plan = qs('#plan'); if (plan) plan.setAttribute('viewBox', '40 8 508 402');
  if (plan) (function () {
    var NS = 'http://www.w3.org/2000/svg';
    var ROOMS = [
      { f: 'g', id: 'g1', s: 'Hall', x: 60, y: 120, w: 168, h: 132, n: 'The hall', a: '154 m²', d: 'The old press hall: north light off the canal, a floor painted matt black twice a year, a ceiling six metres up.' },
      { f: 'g', id: 'g2', s: 'Kitchen', x: 228, y: 120, w: 108, h: 132, n: 'Kitchen & long table', a: '99 m²', d: 'Fourteen chairs and one table. Lunch is hot and seated, shoot day or not.' },
      { f: 'g', id: 'g3', s: 'Door', x: 336, y: 120, w: 60, h: 132, n: 'Front door', a: '55 m²', d: 'A bell, a coat rail, a staircase. No reception desk; whoever is nearest answers.' },
      { f: 'g', id: 'g4', s: 'Fridge', x: 396, y: 120, w: 96, h: 60, n: 'Stock fridge', a: '40 m²', d: '4 °C. Unexposed 16 mm waits here until the morning of the shoot. One key.' },
      { f: 'g', id: 'g5', s: 'Prep', x: 396, y: 180, w: 96, h: 72, n: 'Camera prep', a: '48 m²', d: 'Loading table, changing bag, two cameras always open on the bench.' },
      { f: 'g', id: 'g6', s: 'Workshop', x: 60, y: 252, w: 168, h: 84, n: 'Workshop', a: '98 m²', d: 'Stands, flags, black cloth and a lamp-repair bench older than the studio.' },
      { f: 'g', id: 'g7', s: 'Wardrobe', x: 228, y: 252, w: 120, h: 84, n: 'Wardrobe & make-up', a: '70 m²', d: 'Two rails, one mirror ringed in bulbs, a kettle that is always on.' },
      { f: 'g', id: 'g8', s: 'Loading', x: 348, y: 252, w: 144, h: 84, n: 'Loading bay', a: '84 m²', d: 'A roller door to the courtyard. Vans back in; film goes out.' },
      { f: 'u', id: 'u1', s: 'Writing', x: 228, y: 120, w: 108, h: 84, n: 'Writing room', a: '63 m²', d: 'Treatments are written here, by one person, on paper first. The only room with a canal view and a door that closes.' },
      { f: 'u', id: 'u2', s: 'Edit 1', x: 336, y: 120, w: 78, h: 84, n: 'Edit 1', a: '45 m²', d: 'Yusuf’s room. Curtains, a daybed for the director, a bin for the coffee.' },
      { f: 'u', id: 'u3', s: 'Edit 2', x: 414, y: 120, w: 78, h: 84, n: 'Edit 2', a: '45 m²', d: 'The second cut, the cut-downs, and the room nobody books on Fridays.' },
      { f: 'u', id: 'u4', s: 'Grade', x: 228, y: 204, w: 84, h: 78, n: 'Grade', a: '42 m²', d: 'Blackout, grey walls, a calibrated display. Felix lets nobody bring coffee in.' },
      { f: 'u', id: 'u5', s: 'Sound', x: 312, y: 204, w: 84, h: 78, n: 'Sound & conform', a: '42 m²', d: 'Mineral wool on every wall. The room tone of forty-one locations is filed by the door.' },
      { f: 'u', id: 'u6', s: 'Office', x: 396, y: 204, w: 96, h: 132, n: 'Production office', a: '88 m²', d: 'Hanne’s budgets, the call-sheet printer and the only radiator that works.' },
      { f: 'u', id: 'u7', s: 'Screening', x: 228, y: 282, w: 168, h: 54, n: 'Screening corner', a: '63 m²', d: 'A four-metre wall, nine chairs, and the 1971 flatbed under a cloth.' }
    ];
    function E(n, at, par, txt) { var e = d.createElementNS(NS, n); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; if (par) par.appendChild(e); return e; }
    var defs = E('defs', {}, plan);
    var pat = E('pattern', { id: 'hatch', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs); E('line', { x1: 0, y1: 0, x2: 0, y2: 8, stroke: '#F2F2EF', 'stroke-width': .7, opacity: .35 }, pat);
    var st = E('g', { 'class': 'pl-static' }, plan);
    [30, 42, 54].forEach(function (y, k) { E('path', { 'class': 'ln dim', d: 'M0 ' + y + ' C 90 ' + (y - 7) + ', 170 ' + (y + 7) + ', 300 ' + y + ' S 520 ' + (y - 6) + ', 600 ' + (y + 2) }, st); });
    E('text', { 'class': 'tx', x: 48, y: 20, 'letter-spacing': '2.4' }, st, 'Landwehr Canal');
    E('path', { 'class': 'ln dim', d: 'M0 68H600' }, st); E('path', { 'class': 'ln dim dash', d: 'M0 86H600' }, st);
    E('text', { 'class': 'tx', x: 48, y: 80 }, st, 'Quay & towpath');
    E('path', { 'class': 'ln dim', d: 'M60 100v8M492 100v8M60 104H492' }, st); E('text', { 'class': 'tx c', x: 276, y: 98, 'text-anchor': 'middle' }, st, '36 m');
    E('path', { 'class': 'ln dim', d: 'M508 120h8M508 336h8M512 120V336' }, st); E('text', { 'class': 'tx c', x: 524, y: 232, transform: 'rotate(90 524 232)', 'text-anchor': 'middle' }, st, '18 m');
    var na = E('g', { transform: 'translate(522 34)' }, st); E('circle', { cx: 0, cy: 0, r: 14, 'class': 'ln dim' }, na); E('path', { 'class': 'ln', d: 'M0 -11L4 4L0 1L-4 4Z', fill: '#F2F2EF' }, na); E('text', { 'class': 'tx c', x: 0, y: 28, 'text-anchor': 'middle' }, na, 'N');
    E('path', { 'class': 'ln', d: 'M60 394H180M60 389v10M120 391v6M180 389v10' }, st); E('text', { 'class': 'tx', x: 190, y: 398 }, st, '0 — 5 — 10 m');
    var G = { g: E('g', { 'data-fl': 'g' }, plan), u: E('g', { 'data-fl': 'u' }, plan) };
    /* ground */
    E('rect', { 'class': 'ln w draw', x: 60, y: 120, width: 432, height: 216 }, G.g);
    E('rect', { 'class': 'ln dim dash', x: 348, y: 336, width: 144, height: 46 }, G.g); E('text', { 'class': 'tx', x: 420, y: 363, 'text-anchor': 'middle' }, G.g, 'Courtyard');
    E('path', { 'class': 'ln w', d: 'M372 336H468', 'stroke-dasharray': '5 3', stroke: '#8A8A86' }, G.g); E('text', { 'class': 'tx', x: 420, y: 330, 'text-anchor': 'middle' }, G.g, '');
    E('path', { 'class': 'ln dim', d: 'M84 120h36M148 120h40M252 120h60M420 120h44', 'stroke-width': 4, stroke: '#8A8A86' }, G.g);
    for (var k = 0; k < 6; k++) E('path', { 'class': 'ln dim', d: 'M342 ' + (214 + k * 6.4) + 'H390' }, G.g);
    E('polygon', { points: '361,125 371,125 366,133', fill: '#F2F2EF' }, G.g);
    /* upper */
    E('rect', { 'class': 'ln w draw', x: 228, y: 120, width: 264, height: 216 }, G.u);
    E('rect', { x: 60, y: 120, width: 168, height: 132, fill: 'url(#hatch)', stroke: 'none' }, G.u); E('rect', { 'class': 'ln dim dash', x: 60, y: 120, width: 168, height: 132 }, G.u);
    E('text', { 'class': 'tx c', x: 144, y: 190, 'text-anchor': 'middle' }, G.u, 'Void over the hall');
    E('rect', { 'class': 'ln dim dash', x: 60, y: 252, width: 168, height: 84 }, G.u); E('text', { 'class': 'tx', x: 144, y: 298, 'text-anchor': 'middle' }, G.u, 'Roof, workshop below');
    ROOMS.forEach(function (r, i) {
      r.no = i + 1;
      E('rect', { 'class': 'ln draw', x: r.x, y: r.y, width: r.w, height: r.h }, G[r.f]);
    });
    ROOMS.forEach(function (r) {
      var g = E('g', { 'class': 'rm', 'data-room': r.id }, G[r.f]), cx = r.x + r.w / 2, cy = r.y + r.h / 2 - 5;
      E('rect', { 'class': 'rm__f', x: r.x, y: r.y, width: r.w, height: r.h }, g);
      E('circle', { 'class': 'rm__c', cx: cx, cy: cy }, g); E('text', { 'class': 'rm__n', x: cx, y: cy + .5 }, g, String(r.no));
      E('text', { 'class': 'rm__nm', x: cx, y: cy + 24 }, g, r.s.toUpperCase());
    });
    /* draw-in */
    var floor = 'g', drawn = { g: false, u: false };
    function lens(fl) { return Array.prototype.slice.call(G[fl].querySelectorAll('.draw')); }
    ['g', 'u'].forEach(function (fl) { lens(fl).forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = RM ? 0 : L; p.__L = L; }); });
    gsap.set(G.u, { autoAlpha: 0 });
    function drawFloor(fl) {
      if (drawn[fl]) return; drawn[fl] = true;
      var els = lens(fl), rm = qsa('.rm', G[fl]), stat = G[fl].querySelectorAll('.ln:not(.draw), .tx');
      if (RM) return;
      gsap.to(els, { strokeDashoffset: 0, duration: 1.8, ease: 'expo.inOut', stagger: 0.045 });
      gsap.fromTo(rm, { autoAlpha: 0 }, { autoAlpha: 1, duration: .6, stagger: .05, delay: .6 });
      gsap.fromTo(stat, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: .5, stagger: .01 });
    }
    if (!RM) { gsap.set(qsa('.rm', plan), { autoAlpha: 0 }); gsap.set(G.g.querySelectorAll('.ln:not(.draw), .tx'), { autoAlpha: 0 }); }
    Core.onReady(function () { ST.create({ trigger: plan, start: 'top 80%', once: true, onEnter: function () { drawFloor('g'); } }); });
    /* legend */
    var list = qs('#planList');
    function buildList(fl, anim) {
      list.innerHTML = ROOMS.filter(function (r) { return r.f === fl; }).map(function (r) {
        return '<li class="bl" data-room="' + r.id + '" tabindex="0"><span class="bl__n mono">' + pad(r.no) + '</span><span class="bl__t">' + r.n.replace('&', '&amp;') + '</span><span class="bl__a mono">' + r.a + '</span><p class="bl__d">' + r.d + '</p></li>';
      }).join('');
      if (anim && !RM) gsap.from(list.children, { y: 20, autoAlpha: 0, duration: .8, ease: 'expo.out', stagger: .05 });
      bindList();
    }
    function hl(id) {
      qsa('.rm.is-on, .bl.is-on', d).forEach(function (e) { e.classList.remove('is-on'); });
      if (!id) return;
      qsa('[data-room="' + id + '"]', d).forEach(function (e) { e.classList.add('is-on'); });
    }
    function bindList() {
      qsa('.bl', list).forEach(function (li) {
        var id = li.dataset.room;
        li.addEventListener('mouseenter', function () { hl(id); }); li.addEventListener('mouseleave', function () { hl(null); });
        li.addEventListener('focus', function () { hl(id); }); li.addEventListener('blur', function () { hl(null); });
      });
    }
    qsa('.rm', plan).forEach(function (g) {
      var id = g.dataset.room;
      g.addEventListener('mouseenter', function () { hl(id); }); g.addEventListener('mouseleave', function () { hl(null); });
      g.addEventListener('click', function () { var on = g.classList.contains('is-on') && g.__lock; hl(on ? null : id); g.__lock = !on; });
    });
    buildList('g', false);
    var ft = qs('.bld .vt'), fb = qsa('.bld .vt button');
    function setFloor(fl) {
      if (fl === floor) return; hl(null);
      var prev = floor; floor = fl; ft.dataset.v = fl;
      fb.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.fl === fl)); });
      gsap.to(G[prev], { autoAlpha: 0, duration: RM ? 0 : .35 });
      gsap.set(G[fl], { autoAlpha: 1 });
      if (!RM) { gsap.fromTo(G[fl], { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 }); }
      if (!drawn[fl]) drawFloor(fl);
      else if (!RM) { var els = lens(fl); gsap.fromTo(els, { strokeDashoffset: function (i, t) { return t.__L; } }, { strokeDashoffset: 0, duration: 1.2, ease: 'expo.inOut', stagger: .03 }); gsap.fromTo(qsa('.rm', G[fl]), { autoAlpha: 0 }, { autoAlpha: 1, duration: .5, stagger: .04, delay: .4 }); }
      buildList(fl, true);
    }
    fb.forEach(function (b) { b.addEventListener('click', function () { setFloor(b.dataset.fl); }); });
  })();

  /* kit filter */
  var kitList = qs('#kitList');
  if (kitList) {
    var kitems = qsa('.kt', kitList), kch = qsa('.kchip'), kc = qs('[data-kcount]');
    kch.forEach(function (c) {
      c.addEventListener('click', function () {
        var k = c.dataset.k; kch.forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
        var vis = [];
        kitems.forEach(function (li) { var out = k !== 'all' && li.dataset.k !== k; li.classList.toggle('is-out', out); if (!out) vis.push(li); });
        kc.textContent = 'Showing ' + vis.length + ' of ' + kitems.length;
        if (!RM) gsap.fromTo(vis, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, ease: 'expo.out', stagger: .035, overwrite: true, clearProps: 'transform,opacity,visibility' });
        ST.refresh();
      });
    });
    var kh = qs('.kit__head'); 
  }

  /* rules of the house */
  var rulesList = qs('#rulesList');
  if (rulesList) {
    var rl = qsa('li', rulesList), rcur = qs('[data-rcur]');
    Core.onReady(function () {
      rl.forEach(function (li, i) {
        ST.create({ trigger: li, start: 'top 56%', end: 'bottom 44%', onToggle: function (s) { li.classList.toggle('is-on', s.isActive); if (s.isActive && rcur) rcur.textContent = pad(i + 1); } });
      });
    });
    if (RM) rl.forEach(function (li) { li.classList.add('is-on'); });
  }

  /* ═════════ expansion: film ═════════ */
  var fgate = qs('#fFrame');
  if (fgate) {
    Core.onReady(function () {
      if (RM) { qsa('.exp__bar').forEach(function (b) { b.style.width = b.dataset.w + '%'; }); return; }
      gsap.fromTo('#fFrame', { scale: .72, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#fGate', start: 'top 85%', once: true } });
      qsa('.exp__bar').forEach(function (b) {
        b.style.width = b.dataset.w + '%';
        gsap.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut', transformOrigin: '0 50%', scrollTrigger: { trigger: '#fExp', start: 'top 88%', once: true } });
      });
    });
    var fx = FX[FILMS[FILM_IX].id];
    var rollSec = qs('#fRollSec'), rIn = qs('#fCredits'), rtcE = qs('#fRollTC'), rbarE = qs('#fRollBar');
    var dur = rtMin(FILMS[FILM_IX].rt) * 60;
    if (RM) { rollSec.classList.add('is-static'); }
    else Core.onReady(function () {
      var y0 = function () { return innerHeight * 0.74; };
      var y1 = function () { return -(rIn.offsetHeight) + innerHeight * 0.66; };
      gsap.fromTo(rIn, { y: y0 }, { y: y1, ease: 'none', scrollTrigger: { trigger: rollSec, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true,
        onUpdate: function (s) { rtcE.textContent = tc(s.progress * dur); rbarE.style.transform = 'scaleX(' + s.progress.toFixed(4) + ')'; } } });
    });
    var nextA = qs('#fNextA');
    if (nextA) { var fhn = function () { fitHover([nextA], '.fnext__t', '.fnext__m', '--hs'); }; Core.onReady(fhn); addEventListener('resize', function () { clearTimeout(fhn.t); fhn.t = setTimeout(fhn, 120); }); }
  }

  /* ═════════ expansion: journal ═════════ */
  var jn = qs('#jn');
  if (jn) {
    var jitems = qsa('.jn__i', jn);
    var jopen = function (it, instant) {
      var b = qs('.jn__b', it), p = qs('.jn__p', it), ps = qsa('.jn__pin p', it);
      b.setAttribute('aria-expanded', 'true'); it.classList.add('is-open'); p.hidden = false;
      if (RM || instant) { p.style.height = 'auto'; ST.refresh(); return; }
      gsap.fromTo(p, { height: 0 }, { height: 'auto', duration: 1, ease: 'expo.inOut', onComplete: function () { p.style.height = 'auto'; ST.refresh(); } });
      gsap.fromTo(ps, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: .1, delay: .3 });
    };
    var jclose = function (it) {
      var b = qs('.jn__b', it), p = qs('.jn__p', it);
      b.setAttribute('aria-expanded', 'false'); it.classList.remove('is-open');
      if (RM) { p.hidden = true; ST.refresh(); return; }
      gsap.to(p, { height: 0, duration: .75, ease: 'expo.inOut', onComplete: function () { p.hidden = true; p.style.height = ''; ST.refresh(); } });
    };
    jitems.forEach(function (it, idx) {
      qs('.jn__b', it).addEventListener('click', function () {
        if (it.classList.contains('is-open')) { jclose(it); return; }
        var shift = 0;
        jitems.forEach(function (o, j) { if (o !== it && o.classList.contains('is-open')) { if (j < idx) shift = qs('.jn__p', o).offsetHeight; jclose(o); } });
        jopen(it);
        var top = it.getBoundingClientRect().top - shift - 64;
        if (top < 0 || top > innerHeight * 0.4 || shift) { var y = scrollY + top; if (Core.lenis) Core.lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: 'smooth' }); }
      });
    });
    var jh = location.hash.slice(1), jt = jitems.filter(function (i) { return i.id === jh; })[0];
    if (jt) Core.onReady(function () { setTimeout(function () { jopen(jt, true); if (Core.lenis) Core.lenis.scrollTo(jt, { duration: 1.4, offset: -64 }); }, 450); });
    Core.onReady(function () {
      if (RM) return;
      gsap.from('.jhead__top > *', { y: 14, autoAlpha: 0, duration: 1, stagger: .06, ease: 'expo.out', delay: .1 });
      gsap.from(jitems, { y: 60, autoAlpha: 0, duration: 1.3, stagger: .09, ease: 'expo.out', delay: .25 });
    });
  }

  /* ───────── misc ───────── */
  qsa('[data-top]').forEach(function (b) { b.addEventListener('click', function () { if (Core.lenis) Core.lenis.scrollTo(0, { duration: 2 }); else scrollTo({ top: 0, behavior: 'smooth' }); }); });

  /* ───────── intros ───────── */
  Core.onReady(function () {
    var hero = qs('.hero');
    if (hero && !RM) {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero__frame', { clipPath: 'inset(50% 0% 50% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, 0)
        .fromTo('.hero__img', { scale: 1.3 }, { scale: 1, duration: 2.2 }, 0.1)
        .from('.hero .wm__in', { yPercent: 104, duration: 1.3, stagger: 0.06 }, 0.35)
        .from('.vf, .hero__meta, .hero__play', { autoAlpha: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out' }, 1.0)
        .from('.hero__base > *', { y: 16, autoAlpha: 0, duration: 1, stagger: 0.07 }, 0.9)
        .from('.hdr', { autoAlpha: 0, duration: 1 }, 0.8);
      var wm = qs('.hero .wm'); if (wm && wm.__intro) wm.__intro(0.5);
      gsap.to('.hero__img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero .wm', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }
    var ph = qs('.phead');
    if (ph && !RM) {
      var t2 = gsap.timeline({ defaults: { ease: 'expo.out' } });
      t2.from('.phead .wm__in', { yPercent: 104, duration: 1.3, stagger: 0.06 }, 0.1)
        .from('.phead__top > *, .phead__bar > *', { y: 14, autoAlpha: 0, duration: 1, stagger: 0.06 }, 0.5)
        ;
      if (qs('.films .film')) t2.from('.films .film', { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.06 }, 0.6);
      var pw = qs('.phead .wm'); if (pw && pw.__intro) pw.__intro(0.35);
    }
    var ch = qs('.chead');
    if (ch && !RM) {
      var fls = qsa('.chead .fl'), o = { s: 62, w: 200 };
      fls.forEach(function (f) { f.style.fontStretch = '62%'; f.style.fontWeight = 200; });
      var t3 = gsap.timeline({ defaults: { ease: 'expo.out' } });
      t3.from(fls, { yPercent: 40, autoAlpha: 0, duration: 1.2, stagger: 0.09 }, 0.05);
      fls.forEach(function (f, i) {
        var oo = { s: 62, w: 200 }, fin = +f.dataset.fit || 100, fw = +f.dataset.fitw || 900;
        t3.to(oo, { s: fin, w: fw, duration: 1.8, ease: 'expo.inOut', onUpdate: function () { f.style.fontStretch = oo.s + '%'; f.style.fontWeight = oo.w; } }, 0.15 + i * 0.12);
      });
      t3.from('.chead__top > *, .chead__info > *', { y: 16, autoAlpha: 0, duration: 1, stagger: 0.06 }, 0.7);
    }
    /* arriving with a hash (e.g. index.html#studio) */
    var h = location.hash;
    if (h && h.length > 1 && !films) {
      var tgt = null; try { tgt = qs(h); } catch (e) {}
      if (tgt) setTimeout(function () { ST.refresh(); if (Core.lenis) Core.lenis.scrollTo(tgt, { duration: 1.6 }); else tgt.scrollIntoView(); }, 450);
    }
  });
})();
