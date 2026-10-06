/* ───────── Sightline — customers.js ───────── */
(function () {
  'use strict';
  var S = window.SLP, qs = S.qs, qsa = S.qsa, gsap = S.gsap, ST = S.ST, RM = S.RM, d = S.d;
  var NS = 'http://www.w3.org/2000/svg';
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var eo = function (t) { return 1 - Math.pow(1 - t, 3); };
  var eio = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  function mk(tag, attrs, parent) { var e = d.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function tx(parent, x, y, cls, str, anchor) { var t = mk('text', { x: x, y: y, 'class': cls }, parent); if (anchor) t.setAttribute('text-anchor', anchor); t.textContent = str; return t; }
  function svgIn(host) { return mk('svg', { viewBox: '0 0 560 300', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' }, host); }

  /* ───── 1. bars: analyst tickets per week ───── */
  function chartBars(host) {
    var svg = svgIn(host), W = 560, L = 30, R = 6, T = 14, B = 30, pw = W - L - R, ph = 300 - T - B, n = 16, step = pw / n, bw = 20, mx = 50;
    var data = [38, 41, 44, 39, 43, 40, 42, 41, 31, 18, 12, 9, 8, 7, 6, 6];
    [0, 10, 20, 30, 40, 50].forEach(function (v) {
      var y = T + ph - v / mx * ph; mk('line', { x1: L, x2: W - R, y1: y, y2: y, 'class': v ? 'ch-grid' : 'ch-base' }, svg);
      if (v % 20 === 0) tx(svg, L - 8, y + 3.5, 'ch-t', v, 'end');
    });
    [0, 4, 8, 12, 15].forEach(function (i) { tx(svg, L + i * step + step / 2, 300 - 10, 'ch-t', 'W' + (23 + i), 'middle'); });
    var bars = data.map(function (v, i) {
      var r = mk('rect', { x: L + i * step + (step - bw) / 2, y: T + ph, width: bw, height: 0, rx: 2, 'class': i < 8 ? 'ch-bar' : 'ch-bar--hi' }, svg); return r;
    });
    var mxl = L + 8 * step;
    var mark = mk('g', { opacity: 0 }, svg);
    mk('line', { x1: mxl, x2: mxl, y1: T, y2: T + ph, 'class': 'ch-rule', 'stroke-dasharray': '3 4' }, mark);
    tx(mark, mxl + 8, T + 10, 'ch-t ch-t--hi', 'SIGHTLINE CONNECTED');
    var vl = tx(svg, 0, 0, 'ch-t ch-t--b', '6', 'middle'); vl.setAttribute('opacity', 0);
    var avg = mk('line', { x1: L, x2: mxl - 6, y1: T + ph - 41 / mx * ph, y2: T + ph - 41 / mx * ph, 'class': 'ch-rule', 'stroke-dasharray': '2 4', opacity: 0 }, svg);
    var avgT = tx(svg, L + 4, T + ph - 41 / mx * ph - 7, 'ch-t', 'AVG 41', 'start'); avgT.setAttribute('opacity', 0);
    return { update: function (p) {
      data.forEach(function (v, i) {
        var t = eo(clamp((p * 17.2 - i) / 1.6, 0, 1)), h = v / mx * ph * t;
        bars[i].setAttribute('height', h.toFixed(2)); bars[i].setAttribute('y', (T + ph - h).toFixed(2));
      });
      mark.setAttribute('opacity', p > .49 ? 1 : 0);
      var a = p > .46 ? 1 : 0; avg.setAttribute('opacity', a); avgT.setAttribute('opacity', a * .8);
      var lt = clamp((p * 17.2 - 15) / 1.6, 0, 1);
      vl.setAttribute('x', L + 15 * step + step / 2); vl.setAttribute('y', T + ph - 6 / mx * ph - 8); vl.setAttribute('opacity', lt > .95 ? 1 : 0);
    }, head: ['41', '6', 'tickets a week'] };
  }

  /* ───── 2. dots on a log axis ───── */
  function chartDots(host) {
    var svg = svgIn(host), W = 560, L = 54, R = 8, T = 16, B = 40, pw = W - L - R, ph = 300 - T - B, lo = Math.log10(.01), hi = Math.log10(400);
    var Y = function (v) { return T + (1 - (Math.log10(v) - lo) / (hi - lo)) * ph; };
    [[1 / 60, '1 min'], [1, '1 hour'], [24, '1 day'], [168, '1 week']].forEach(function (g) {
      var y = Y(g[0]); mk('line', { x1: L, x2: W - R, y1: y, y2: y, 'class': 'ch-grid' }, svg); tx(svg, L - 8, y + 3.5, 'ch-t', g[1], 'end');
    });
    mk('line', { x1: L, x2: W - R, y1: T + ph, y2: T + ph, 'class': 'ch-base' }, svg);
    var mid = L + pw * .5;
    var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var B0 = [22, 31, 38, 47, 52, 60, 66, 71, 80, 92, 105, 118, 140, 36], A0 = [.03, .05, .06, .07, .08, .09, .1, .11, .13, .15, .19, .24, .33, .45];
    function mkDots(arr, x0, x1, cls) { return arr.map(function (v) { return { v: v, x: x0 + rnd() * (x1 - x0), c: mk('circle', { cx: 0, cy: 0, r: 0, 'class': cls }, svg) }; }); }
    var before = mkDots(B0, L + 36, mid - 36, 'ch-dot--o'), after = mkDots(A0, mid + 36, W - R - 36, 'ch-dot');
    before.forEach(function (o) { o.c.setAttribute('cx', o.x); o.c.setAttribute('cy', Y(o.v)); }); after.forEach(function (o) { o.c.setAttribute('cx', o.x); o.c.setAttribute('cy', Y(o.v)); });
    var div = mk('g', { opacity: 0 }, svg); mk('line', { x1: mid, x2: mid, y1: T, y2: T + ph, 'class': 'ch-rule', 'stroke-dasharray': '3 4' }, div); tx(div, mid + 8, T + 10, 'ch-t ch-t--hi', 'SIGHTLINE CONNECTED');
    tx(svg, (L + mid) / 2, 300 - 12, 'ch-t', 'BEFORE', 'middle'); tx(svg, (mid + W - R) / 2, 300 - 12, 'ch-t ch-t--hi', 'AFTER', 'middle');
    var m1 = mk('line', { x1: L + 14, x2: mid - 14, y1: Y(68), y2: Y(68), 'class': 'ch-rule', opacity: 0 }, svg), m1t = tx(svg, L + 16, Y(68) - 8, 'ch-t ch-t--hi', 'MEDIAN 2.8 DAYS', 'start'); m1t.setAttribute('opacity', 0);
    var m2 = mk('line', { x1: mid + 14, x2: W - R - 14, y1: Y(.1), y2: Y(.1), 'class': 'ch-rule', opacity: 0 }, svg), m2t = tx(svg, W - R - 16, Y(.1) - 8, 'ch-t ch-t--hi', 'MEDIAN 6 MIN', 'end'); m2t.setAttribute('opacity', 0);
    return { update: function (p) {
      before.forEach(function (o, i) { var t = eo(clamp((p / .46 * (before.length + 3) - i) / 3, 0, 1)); o.c.setAttribute('r', (5 * t).toFixed(2)); });
      after.forEach(function (o, i) { var t = eo(clamp(((p - .5) / .46 * (after.length + 3) - i) / 3, 0, 1)); o.c.setAttribute('r', (5.2 * t).toFixed(2)); });
      div.setAttribute('opacity', p > .49 ? 1 : 0);
      var a = p > .44 ? 1 : 0; m1.setAttribute('opacity', a); m1t.setAttribute('opacity', a);
      var b = p > .97 ? 1 : 0; m2.setAttribute('opacity', b); m2t.setAttribute('opacity', b);
    }, head: ['2.8 d', '6 min', 'median time to an answer'] };
  }

  /* ───── 3. dumbbell: days to notice a spike ───── */
  function chartDumb(host) {
    var svg = svgIn(host), L = 132, R = 14, T = 34, rows = [['Starter boxes', 21, 2], ['Annual plans', 18, 1], ['Gift orders', 26, 3], ['Hamburg slots', 15, 2], ['Reactivated', 23, 1]], rh = 48, pw = 560 - L - R;
    var X = function (v) { return L + v / 30 * pw; };
    [0, 10, 20, 30].forEach(function (v) { mk('line', { x1: X(v), x2: X(v), y1: T - 12, y2: T + rows.length * rh - 8, 'class': 'ch-grid' }, svg); tx(svg, X(v), T - 18, 'ch-t', v ? v + ' d' : '0', 'middle'); });
    var items = rows.map(function (r, i) {
      var y = T + i * rh + 14;
      mk('line', { x1: L, x2: 560 - R, y1: y, y2: y, 'class': 'ch-grid' }, svg);
      tx(svg, 0, y + 3.5, 'ch-t ch-t--hi', r[0].toUpperCase(), 'start');
      var link = mk('line', { x1: X(r[1]), x2: X(r[1]), y1: y, y2: y, stroke: '#c8f34b', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
      var b = mk('circle', { cx: X(r[1]), cy: y, r: 6.5, 'class': 'ch-dot--o' }, svg);
      var a = mk('circle', { cx: X(r[1]), cy: y, r: 6.5, 'class': 'ch-dot' }, svg);
      var bt = tx(svg, X(r[1]), y - 12, 'ch-t', r[1] + ' d', 'middle');
      var at = tx(svg, X(r[2]) + 14, y + 3.5, 'ch-t ch-t--b', r[2] + ' d', 'start'); at.setAttribute('opacity', 0);
      return { r: r, y: y, link: link, a: a, at: at, bt: bt };
    });
    return { update: function (p) {
      items.forEach(function (o, i) {
        var t = eio(clamp((p - .12 - i * .09) / .42, 0, 1)), x = X(o.r[1]) + (X(o.r[2]) - X(o.r[1])) * t;
        o.a.setAttribute('cx', x.toFixed(2)); o.link.setAttribute('x2', x.toFixed(2));
        o.at.setAttribute('opacity', t > .99 ? 1 : 0); o.bt.setAttribute('opacity', t > .02 ? .55 : 1);
      });
    }, head: ['21', '2', 'days to notice a spike'] };
  }

  /* ───── 4. stacked bars: weeks to production ───── */
  function chartStack(host) {
    var svg = svgIn(host), L = 16, R = 16, pw = 560 - L - R, X = function (w) { return L + w / 12 * pw; };
    [0, 4, 8, 12].forEach(function (w) { mk('line', { x1: X(w), x2: X(w), y1: 40, y2: 262, 'class': 'ch-grid' }, svg); tx(svg, X(w), 284, 'ch-t', w ? w + ' wk' : '0', w === 12 ? 'end' : w ? 'middle' : 'start'); });
    var rowA = [['Questionnaire', 3], ['Pen-test review', 4], ['Legal + DPA', 2.5], ['Sign-off', 1.5]], rowB = [['Grants', .2], ['Questionnaire', .6], ['DPA', .3], ['Sign-off', .2]];
    function row(def, y, cls, label, total, hiCls) {
      tx(svg, L, y - 12, 'ch-t ch-t--hi', label, 'start');
      var acc = 0, segs = def.map(function (s, i) {
        var x0 = X(acc), w = X(acc + s[1]) - X(acc); acc += s[1];
        var r = mk('rect', { x: x0, y: y, width: 0, height: 44, 'class': cls[i % cls.length] }, svg);
        var t = tx(svg, x0 + 8, y + 62, 'ch-t', s[0].toUpperCase(), 'start'); t.setAttribute('opacity', 0);
        var t2 = tx(svg, x0 + 8, y + 76, 'ch-t ch-t--hi', s[1] + ' WEEKS', 'start'); t2.setAttribute('opacity', 0);
        return { r: r, x0: x0, w: w, t: t, t2: t2, end: acc };
      });
      var tt = tx(svg, X(acc) + 10, y + 27, 'ch-t ch-t--b' + (hiCls ? ' sc-lime' : ''), total, 'start'); tt.setAttribute('opacity', 0);
      return { segs: segs, tt: tt, W: X(acc) - L };
    }
    var A = row(rowA, 66, ['sc-g1', 'sc-g2', 'sc-g3', 'sc-g4'], 'PREVIOUS TOOL', '11 weeks', 0);
    var Bw = row(rowB, 190, ['sc-l1', 'sc-l2', 'sc-l1', 'sc-l2'], 'WITH SIGHTLINE', '9 days', 1);
    Bw.segs.forEach(function (s) { s.t.textContent = ''; s.t2.textContent = ''; });
    var cap = tx(svg, L, 190 + 62, 'ch-t', 'GRANTS · QUESTIONNAIRE · DPA · SIGN-OFF', 'start'); cap.setAttribute('opacity', 0);
    function paint(R, a) {
      var cur = a * R.W;
      R.segs.forEach(function (s) { var w = clamp(cur - (s.x0 - L), 0, s.w); s.r.setAttribute('width', w.toFixed(2)); var on = w >= s.w - .5 ? 1 : 0; s.t.setAttribute('opacity', on); s.t2.setAttribute('opacity', on); });
      R.tt.setAttribute('opacity', a > .98 ? 1 : 0);
    }
    return { update: function (p) {
      var a = eio(clamp(p / .48, 0, 1)), b = eio(clamp((p - .52) / .3, 0, 1));
      paint(A, a); paint(Bw, b); cap.setAttribute('opacity', b > .98 ? 1 : 0);
    }, head: ['11 w', '9 d', 'from first call to production'] };
  }
  var CH = { bars: chartBars, dots: chartDots, dumbbell: chartDumb, stack: chartStack };

  function initStory(sec) {
    var plot = qs('[data-plot]', sec), ch = CH[sec.dataset.chart](plot), prog = qs('[data-prog]', sec), fr = qs('[data-from]', sec), to = qs('[data-to]', sec), unit = qs('[data-unit]', sec), ba = qsa('[data-ba]', sec), tel = qs('.story__text', sec), card = qs('[data-card]', sec);
    fr.textContent = ch.head[0]; to.textContent = ch.head[1]; unit.textContent = ch.head[2];
    var last = -1;
    function set(p) {
      ch.update(p);
      prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var t = clamp((p - .46) / .18, 0, 1);
      to.style.opacity = (.12 + .88 * t).toFixed(3); to.style.transform = 'translateY(' + ((1 - t) * 10).toFixed(1) + 'px)'; fr.style.opacity = (1 - .62 * t).toFixed(3);
      var st = p >= .5 ? 1 : 0;
      if (st !== last) { last = st; ba.forEach(function (e) { e.classList.toggle('is-on', +e.dataset.ba === st); }); }
    }
    set(0);
    if (RM) { set(1); return; }
    var mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', function () {
      var tr = ST.create({ trigger: tel, start: 'top 62%', end: 'bottom 80%', scrub: .6, onUpdate: function (s) { set(s.progress); } });
      set(tr.progress);
      return function () { tr.kill(); };
    });
    mm.add('(max-width: 899px)', function () {
      var o = { p: 0 }, tw, tr = ST.create({ trigger: card, start: 'top 72%', once: true, onEnter: function () { tw = gsap.to(o, { p: 1, duration: 3.2, ease: 'power1.inOut', onUpdate: function () { set(o.p); } }); } });
      return function () { tr.kill(); if (tw) tw.kill(); };
    });
  }

  Core.onReady(function () {
    qsa('.story').forEach(initStory);
    setTimeout(function () { ST.refresh(); }, 500);
  });
})();
