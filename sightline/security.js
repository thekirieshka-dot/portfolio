/* ───────── Sightline — security.js ───────── */
(function () {
  'use strict';
  var S = window.SLP, qs = S.qs, qsa = S.qsa, gsap = S.gsap, ST = S.ST, RM = S.RM, d = S.d;
  var NS = 'http://www.w3.org/2000/svg';
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ───── copy link ───── */
  function initCopy() {
    var b = qs('#copyLink'); if (!b) return;
    var label = qs('span', b), orig = label.textContent, t;
    b.addEventListener('click', function () {
      var url = location.href.split('#')[0] + '#controls';
      var done = function () { label.textContent = 'Link copied'; b.classList.add('is-done'); clearTimeout(t); t = setTimeout(function () { label.textContent = orig; b.classList.remove('is-done'); }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done); else done();
    });
  }

  /* ═════════ data-flow diagram ═════════ */
  var FLOW = {
    h: {
      w: 1100, h: 540,
      zones: [
        { id: 'zm', x: 232, y: 10, w: 212, h: 110, label: 'Model provider · zero retention', lx: 246, ly: 28 },
        { id: 'zs', x: 226, y: 156, w: 480, h: 280, label: 'Sightline · Frankfurt or Oregon', lx: 242, ly: 177 },
        { id: 'zy', x: 826, y: 156, w: 274, h: 280, label: 'Your environment', lx: 842, ly: 177, you: 1 }
      ],
      nodes: {
        you: { x: 0, y: 196, w: 130, h: 200, t: 'You', s: 'Browser · Slack', lines: ['SSO session', 'TLS 1.3'] },
        plan: { x: 250, y: 196, w: 176, h: 72, t: 'Planner', s: 'Writes the SQL', hi: 1 },
        ans: { x: 250, y: 324, w: 176, h: 72, t: 'Answer', s: 'Cache · 24 h' },
        con: { x: 506, y: 196, w: 176, h: 72, t: 'Connector', s: 'Read-only' },
        val: { x: 506, y: 324, w: 176, h: 72, t: 'Validator', s: 'Totals · masking' },
        wh: { x: 852, y: 196, w: 222, h: 200, t: 'Your warehouse', s: 'Never copied out', lines: ['Postgres', 'BigQuery', 'ClickHouse', '+ 37 more'] },
        model: { x: 250, y: 44, w: 176, h: 62, t: 'Language model', s: 'Names only' }
      },
      edges: {
        e1: { p: [[130, 232], [250, 232]], k: 'q', n: 1, bx: 190, by: 232, l: { x: 190, y: 254, t: 'question' } },
        e2: { p: [[338, 196], [338, 106]], k: 'q', n: 2, bi: 1, bx: 338, by: 142, l: { x: 354, y: 146, t: 'names + question, no rows', a: 'start' } },
        e3: { p: [[426, 232], [506, 232]], k: 'q', n: 3, bx: 466, by: 232, l: { x: 466, y: 254, t: 'select' } },
        e4: { p: [[682, 232], [852, 232]], k: 'q', n: 4, bx: 767, by: 232, l: { x: 767, y: 254, t: 'read-only' } },
        e5: { p: [[852, 360], [682, 360]], k: 'r', n: 5, bx: 767, by: 360, l: { x: 767, y: 382, t: 'rows stay home' } },
        e6a: { p: [[506, 360], [426, 360]], k: 'r', n: 6, bx: 466, by: 360, l: { x: 466, y: 382, t: 'checked' } },
        e6b: { p: [[250, 360], [130, 360]], k: 'r', l: { x: 190, y: 382, t: 'chart + sql' } }
      },
      audit: { x: 226, y: 474, w: 480, h: 38, t: 'Audit log · who asked, what ran, how many rows', spine: [466, 232, 474], ticks: [[338, 396, 474], [594, 396, 474]] }
    },
    v: {
      w: 360, h: 920,
      zones: [
        { id: 'zm', x: 188, y: 0, w: 172, h: 98, label: 'Model provider', lx: 200, ly: 17 },
        { id: 'zs', x: 0, y: 124, w: 360, h: 218, label: 'Sightline · your region', lx: 14, ly: 143 },
        { id: 'zy', x: 0, y: 388, w: 360, h: 98, label: 'Your environment', lx: 14, ly: 407, you: 1 },
        { id: 'zs2', x: 0, y: 532, w: 360, h: 218, label: 'Sightline · same region', lx: 14, ly: 551 }
      ],
      nodes: {
        you: { x: 0, y: 0, w: 170, h: 66, t: 'You', s: 'Browser · Slack' },
        model: { x: 200, y: 32, w: 148, h: 56, t: 'Language model', s: 'Names only' },
        plan: { x: 14, y: 158, w: 332, h: 64, t: 'Planner', s: 'Writes the SQL', hi: 1 },
        con: { x: 14, y: 262, w: 332, h: 64, t: 'Connector', s: 'Read-only · select only' },
        wh: { x: 14, y: 418, w: 332, h: 56, t: 'Your warehouse', s: 'Never copied out' },
        val: { x: 14, y: 566, w: 332, h: 64, t: 'Validator', s: 'Totals · masking' },
        ans: { x: 14, y: 670, w: 332, h: 64, t: 'Answer', s: 'Cache · 24 h' },
        you2: { x: 0, y: 792, w: 170, h: 52, t: 'Back to you', s: 'Chart · sql' }
      },
      edges: {
        e1: { p: [[60, 66], [60, 158]], k: 'q', n: 1, bx: 60, by: 112, l: { x: 78, y: 116, t: 'question', a: 'start' } },
        e2: { p: [[274, 158], [274, 88]], k: 'q', n: 2, bi: 1, bx: 274, by: 112, l: { x: 258, y: 116, t: 'names + question', a: 'end' } },
        e3: { p: [[60, 222], [60, 262]], k: 'q', n: 3, bx: 60, by: 242, l: { x: 78, y: 246, t: 'select', a: 'start' } },
        e4: { p: [[60, 326], [60, 418]], k: 'q', n: 4, bx: 60, by: 365, l: { x: 78, y: 369, t: 'read-only', a: 'start' } },
        e5: { p: [[60, 474], [60, 566]], k: 'r', n: 5, bx: 60, by: 509, l: { x: 78, y: 513, t: 'rows stay home', a: 'start' } },
        e6a: { p: [[60, 630], [60, 670]], k: 'r', n: 6, bx: 60, by: 650, l: { x: 78, y: 654, t: 'checked', a: 'start' } },
        e6b: { p: [[60, 734], [60, 792]], k: 'r', l: { x: 78, y: 767, t: 'chart + sql', a: 'start' } }
      },
      audit: { x: 0, y: 866, w: 360, h: 38, t: 'Audit log · every hop is written down', ticks: [[300, 750, 866]] }
    }
  };
  var HOPS = [
    { e: ['e1'], n: ['you', 'plan', 'you2'], b: [1] },
    { e: ['e2'], n: ['plan', 'model'], b: [2] },
    { e: ['e3'], n: ['plan', 'con'], b: [3] },
    { e: ['e4'], n: ['con', 'wh'], b: [4] },
    { e: ['e5'], n: ['wh', 'val'], b: [5] },
    { e: ['e6a', 'e6b'], n: ['val', 'ans', 'you', 'you2'], b: [6] }
  ];

  function mk(tag, attrs, parent) {
    var e = d.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, x, y, cls, str, anchor) {
    var t = mk('text', { x: x, y: y, 'class': cls }, parent);
    if (anchor) t.setAttribute('text-anchor', anchor);
    t.textContent = str; return t;
  }

  var flow = { master: null, preview: null, pinned: null, svg: null, els: null, ts: 1, mode: '', width: 0, hover: false };
  function buildFlow() {
    var host = qs('#flowFig'); if (!host) return;
    var W = host.clientWidth, mode = W <= 640 ? 'v' : 'h', L = FLOW[mode];
    var ts = mode === 'h' ? (W >= 1000 ? 1 : Math.min(1.5, 1100 / W * .74)) : 1;
    if (flow.master) { flow.master.kill(); flow.master = null; }
    if (flow.preview) { flow.preview.kill(); flow.preview = null; }
    host.innerHTML = '';
    var svg = mk('svg', { viewBox: '-2 -2 ' + (L.w + 4) + ' ' + (L.h + 4), 'aria-hidden': 'true', focusable: 'false' }, host);
    var gz = mk('g', {}, svg), ge = mk('g', {}, svg), gzl = mk('g', {}, svg), gn = mk('g', {}, svg), gp = mk('g', {}, svg);
    var els = { e: {}, l: {}, b: {}, n: {}, path: {} };
    var fz = function (n) { return (n * ts).toFixed(1); };

    L.zones.forEach(function (z) {
      mk('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 14, 'class': 'fl-zone' + (z.you ? ' fl-zone--you' : '') }, gz);
      var t = txt(gzl, z.lx, z.ly, 'fl-zl' + (z.you ? ' fl-zl--you' : ''), z.label); t.style.fontSize = fz(10.5) + 'px';
    });
    /* audit */
    var A = L.audit, ga = mk('g', { 'class': 'fl-audit' }, gz);
    mk('rect', { x: A.x, y: A.y, width: A.w, height: A.h, rx: 8 }, ga);
    var at = txt(ga, A.x + 14, A.y + A.h / 2 + 4, '', A.t); at.style.fontSize = fz(10.5) + 'px';
    (A.ticks || []).forEach(function (t) { mk('path', { d: 'M' + t[0] + ' ' + t[1] + 'V' + t[2], 'class': 'fl-tick' }, ga); });
    if (A.spine) { mk('path', { d: 'M' + A.spine[0] + ' ' + A.spine[1] + 'V' + A.spine[2], 'class': 'fl-tick' }, ga); mk('circle', { cx: A.spine[0], cy: A.spine[1], r: 2.5, fill: 'rgba(244,244,241,.5)' }, ga); }

    /* edges */
    Object.keys(L.edges).forEach(function (id) {
      var e = L.edges[id], d0 = 'M' + e.p.map(function (q) { return q[0] + ' ' + q[1]; }).join('L');
      var p = mk('path', { d: d0, 'class': 'fl-edge' + (e.k === 'r' ? '' : '') }, ge);
      els.e[id] = p; els.path[id] = p;
      if (e.l) { var lb = txt(ge, e.l.x, e.l.y, 'fl-lbl', e.l.t, e.l.a || 'middle'); lb.style.fontSize = fz(10) + 'px'; els.l[id] = lb; }
      if (e.n) {
        var g = mk('g', { 'class': 'fl-badge' }, ge); mk('circle', { cx: e.bx, cy: e.by, r: 9 }, g);
        var bt = txt(g, e.bx, e.by + 3.4, '', String(e.n)); els.b[e.n] = g;
      }
    });
    /* nodes */
    Object.keys(L.nodes).forEach(function (id) {
      var n = L.nodes[id], g = mk('g', { 'class': 'fl-node' + (n.hi ? ' fl-node--hi' : '') }, gn);
      mk('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: 10 }, g);
      var t = txt(g, n.x + 14, n.y + (n.h < 60 ? 24 : 30) * Math.max(1, ts * .92), 'fl-t', n.t); t.style.fontSize = (n.hi ? fz(18) : fz(16)) + 'px';
      var s = txt(g, n.x + 14, n.y + (n.h < 60 ? 42 : 51) * Math.max(1, ts * .92), 'fl-s', n.s); s.style.fontSize = fz(10) + 'px';
      (n.lines || []).forEach(function (ln, i) {
        var q = txt(g, n.x + 14, n.y + 88 + i * 20 * Math.max(1, ts * .9), 'fl-s', ln); q.style.fontSize = fz(10) + 'px'; q.style.opacity = .85;
      });
      els.n[id] = g;
    });
    flow.svg = svg; flow.els = els; flow.gp = gp; flow.L = L; flow.mode = mode; flow.width = W; flow.ts = ts;
    setActive(flow.pinned != null ? flow.pinned : 0);
    if (!RM) { flow.master = makeMaster(); gateMaster(); }
  }

  function setActive(i) {
    var els = flow.els; if (!els) return;
    var H = HOPS[i];
    Object.keys(els.e).forEach(function (k) { var on = H.e.indexOf(k) > -1; els.e[k].classList.toggle('is-act', on); if (els.l[k]) els.l[k].classList.toggle('is-act', on); });
    Object.keys(els.b).forEach(function (k) { els.b[k].classList.toggle('is-act', H.b.indexOf(+k) > -1); });
    Object.keys(els.n).forEach(function (k) { els.n[k].classList.toggle('is-act', H.n.indexOf(k) > -1); });
    qsa('.hop').forEach(function (b, j) { b.classList.toggle('is-on', j === i); });
  }
  function packets(kind, count) {
    var out = [];
    for (var i = 0; i < count; i++) out.push(mk('circle', { r: kind === 'r' ? 3 : 4.2, 'class': 'fl-pk' + (kind === 'r' ? ' fl-pk--r' : ''), opacity: 0 }, flow.gp));
    return out;
  }
  function playHop(i) {
    var tl = gsap.timeline(), H = HOPS[i];
    tl.call(setActive, [i]);
    H.e.forEach(function (id) {
      var e = flow.L.edges[id]; if (!e) return;
      var p = flow.els.path[id], len = p.getTotalLength(), dur = Math.max(.7, len / 260);
      var pk = packets(e.k, e.k === 'r' ? 4 : 1), o = { t: 0 };
      var place = function (t) { pk.forEach(function (c, j) { var tt = Math.max(0, Math.min(1, t - j * .09)); var pt = p.getPointAtLength(tt * len); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('opacity', (t - j * .09 <= 0 || t - j * .09 >= 1.0) ? 0 : 1); }); };
      tl.fromTo(o, { t: 0 }, { t: e.k === 'r' ? 1.3 : 1, duration: dur, ease: 'power1.inOut', onUpdate: function () { place(o.t); },
        onComplete: function () { pk.forEach(function (c) { c.remove(); }); } });
      if (e.bi) {
        var o2 = { t: 1 }, pk2 = packets('q', 1);
        tl.fromTo(o2, { t: 1 }, { t: 0, duration: dur, ease: 'power1.inOut', onUpdate: function () { var pt = p.getPointAtLength(o2.t * len); pk2[0].setAttribute('cx', pt.x); pk2[0].setAttribute('cy', pt.y); pk2[0].setAttribute('opacity', 1); }, onComplete: function () { pk2[0].remove(); } }, '>.15');
      }
    });
    tl.to({}, { duration: .45 });
    return tl;
  }
  function makeMaster() {
    var m = gsap.timeline({ repeat: -1, repeatDelay: .5, paused: true });
    for (var i = 0; i < HOPS.length; i++) m.add(playHop(i));
    return m;
  }
  var inView = false;
  function gateMaster() {
    var m = flow.master; if (!m) return;
    if (inView && !flow.hover && flow.pinned == null) m.play(); else m.pause();
  }
  function initFlow() {
    var host = qs('#flowFig'); if (!host) return;
    buildFlow();
    var btns = qsa('.hop');
    function loopHop(i) {
      if (flow.preview) { flow.preview.kill(); flow.preview = null; }
      qsa('.fl-pk', flow.svg).forEach(function (c) { c.remove(); });
      if (flow.master) flow.master.pause();
      setActive(i);
      if (!RM) flow.preview = playHop(i).repeat(-1).repeatDelay(.2);
    }
    function release() {
      if (flow.preview) { flow.preview.kill(); flow.preview = null; }
      qsa('.fl-pk', flow.svg).forEach(function (c) { c.remove(); });
      if (flow.pinned != null) loopHop(flow.pinned); else { gateMaster(); }
    }
    btns.forEach(function (b, i) {
      b.addEventListener('mouseenter', function () { flow.hover = true; loopHop(i); });
      b.addEventListener('mouseleave', function () { flow.hover = false; release(); });
      b.addEventListener('focus', function () { if (!flow.hover) loopHop(i); });
      b.addEventListener('blur', function () { if (!flow.hover) release(); });
      b.addEventListener('click', function () {
        flow.pinned = flow.pinned === i ? null : i;
        btns.forEach(function (x, j) { x.setAttribute('aria-pressed', String(flow.pinned === j)); });
        flow.hover = false;
        if (flow.pinned != null) loopHop(i); else release();
      });
    });
    ST.create({ trigger: host, start: 'top 85%', end: 'bottom 5%', onToggle: function (s) { inView = s.isActive; gateMaster(); } });
    var rt;
    addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        var W = host.clientWidth, m = W <= 640 ? 'v' : 'h';
        if (m !== flow.mode || Math.abs(W - flow.width) / flow.width > .1) { buildFlow(); ST.refresh(); }
      }, 220);
    });
  }

  /* ═════════ controls filter (Flip) ═════════ */
  function initControls() {
    var list = qs('#clist'); if (!list) return;
    var groups = qsa('.ctl-g', list), rows = qsa('.ctl', list), chipsBox = qs('#cchips'), inp = qs('#cq'), count = qs('#ccount'), empty = qs('#cempty');
    var state = { g: 'all', q: '' }, total = rows.length, busy = null;
    var defs = [['all', 'All', total]].concat(groups.map(function (g) { return [g.dataset.g, qs('h3', g).textContent, qsa('.ctl', g).length]; }));
    chipsBox.innerHTML = defs.map(function (c, i) { return '<button type="button" class="cchip' + (i === 0 ? ' is-on' : '') + '" data-g="' + c[0] + '" aria-pressed="' + (i === 0) + '"><span>' + esc(c[1]) + '</span><small>' + c[2] + '</small></button>'; }).join('');
    var chips = qsa('.cchip', chipsBox);

    function apply(animate) {
      var heads = qsa('.ctl-gh', list), all = rows.concat(heads), st = (animate && !RM && window.Flip) ? Flip.getState(all) : null;
      var q = state.q.trim().toLowerCase(), shown = 0;
      rows.forEach(function (r) {
        var m = (state.g === 'all' || r.dataset.g === state.g) && (!q || r.textContent.toLowerCase().indexOf(q) > -1);
        r.classList.toggle('is-out', !m); if (m) shown++;
      });
      groups.forEach(function (g) { g.classList.toggle('is-out', !qsa('.ctl:not(.is-out)', g).length); });
      count.textContent = 'Showing ' + shown + ' of ' + total;
      empty.hidden = shown > 0;
      if (st) {
        if (busy) busy.kill();
        busy = Flip.from(st, { duration: .6, ease: 'power3.inOut', absolute: true, simple: true,
          onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out', stagger: .012, delay: .12 }); },
          onLeave: function (els) { return gsap.to(els, { opacity: 0, duration: .22 }); } });
        busy.then && busy.then(function () { ST.refresh(); });
      } else ST.refresh();
    }
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        state.g = b.dataset.g;
        chips.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
        apply(true);
      });
    });
    var tm;
    inp.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { state.q = inp.value; apply(true); }, 140); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Escape') { inp.value = ''; state.q = ''; apply(true); } });
    window.SLP.resetControls = function () { inp.value = ''; state.q = ''; state.g = 'all'; chips[0].click(); };
    var rb = qs('#creset'); if (rb) rb.addEventListener('click', function () { window.SLP.resetControls(); });
    count.textContent = 'Showing ' + total + ' of ' + total;
  }

  /* ═════════ never stored: strike-through ═════════ */
  function initNever() {
    var items = qsa('#neverList .never__t span'); if (!items.length) return;
    if (RM) { items.forEach(function (s) { s.style.setProperty('--s', 1); s.style.color = '#8b8d90'; }); return; }
    items.forEach(function (s) {
      ST.create({ trigger: s, start: 'top 80%', once: true, onEnter: function () {
        gsap.to(s, { '--s': 1, duration: 1.2, ease: 'expo.inOut', delay: .15 });
        gsap.to(s, { color: '#7d7f82', duration: .9, ease: 'power2.out', delay: .55 });
      } });
    });
  }

  /* ═════════ audit log ═════════ */
  var LOG = [
    { t: '09:14:02.118', v: 'ask', a: 'm.ruiz', r: 'asker', ws: 'halden/growth', h: '<b>m.ruiz</b> <i>asker</i> “why did churn spike in march?”', x: { question: 'why did churn spike in march?' } },
    { t: '09:14:02.402', v: 'plan', n: 1, h: 'semantic layer v38 · <b>churn_rate</b>, <b>mrr_net</b> · 3 tables', x: { semantic_layer: 'v38', metrics: ['churn_rate', 'mrr_net'], tables: 3 } },
    { t: '09:14:02.611', v: 'guard', n: 1, h: '<b>sightline_ro</b> verified · single SELECT · est. scan 4.1 GB', x: { role: 'sightline_ro', statement: 'SELECT', est_scan_gb: 4.1 } },
    { t: '09:14:03.874', v: 'run', n: 1, h: 'warehouse.events · <b>48,210</b> rows · 0.61 s · sql 7f3a9c', x: { source: 'warehouse.events', rows: 48210, runtime_s: 0.61, sql_hash: '7f3a9c' } },
    { t: '09:14:03.902', v: 'check', n: 1, h: 'totals match billing.invoices · delta 0.00', x: { compared_with: 'billing.invoices', delta: 0 } },
    { t: '09:14:03.947', v: 'answer', ok: 1, h: 'chart + sql · cache 24 h · eu-central-1', x: { artefacts: ['chart', 'sql'], cache_ttl_h: 24, region: 'eu-central-1' } },
    { t: '09:22:17.340', v: 'ask', gap: 1, a: 'j.okoye', r: 'asker', ws: 'halden/growth', h: '<b>j.okoye</b> <i>asker</i> “refunds over €500 in q3”', x: { question: 'refunds over €500 in q3' } },
    { t: '09:22:17.822', v: 'guard', n: 1, h: 'estimated scan 61 GB over budget of 50 GB · <b>held for admin approval</b>', x: { est_scan_gb: 61, budget_gb: 50, outcome: 'held_for_approval' } },
    { t: '09:31:40.007', v: 'share', gap: 1, h: 'link 7Kq2 · view only · 3 viewers · expires in 30 days', x: { link: '7Kq2', access: 'view', viewers: 3, expires_days: 30 } },
    { t: '09:31:40.220', v: 'export', n: 1, h: 'csv export <b>denied</b> · role asker · policy DH-07', x: { format: 'csv', outcome: 'denied', role: 'asker', policy: 'DH-07' } }
  ];
  function jsonHtml(o) {
    var s = JSON.stringify(o, null, 2);
    return esc(s).replace(/&quot;/g, '"').replace(/("(?:[^"\\]|\\.)*")(\s*:)?|(-?\b\d+(?:\.\d+)?\b)|([{}\[\],:])/g, function (m, str, colon, num, p) {
      if (str) return colon ? '<span class="tk-k">' + str + '</span>' + colon : '<span class="tk-s">' + str + '</span>';
      if (num) return '<span class="tk-n">' + num + '</span>';
      return '<span class="tk-p">' + p + '</span>';
    });
  }
  function initAudit() {
    var body = qs('#alogBody'); if (!body) return;
    var fmt = 'lines', played = false;
    function render() {
      body.innerHTML = LOG.map(function (e) {
        if (fmt === 'json') {
          var o = { ts: e.t, event: e.v, actor: e.a || 'system', workspace: 'halden/growth' };
          for (var k in e.x) o[k] = e.x[k];
          return '<pre class="alj"><code>' + jsonHtml(o) + '</code></pre>';
        }
        return '<div class="al' + (e.gap ? ' al--gap' : '') + '"><span class="al__t">' + e.t + '</span><span class="al__v' + (e.ok ? ' al__v--ok' : e.n ? ' al__v--n' : '') + '">' + e.v + '</span><span class="al__x">' + e.h + '</span></div>';
      }).join('');
      var items = qsa('.al, .alj', body);
      if (RM || played) items.forEach(function (x) { x.classList.add('on'); });
      else items.forEach(function (x, i) { setTimeout(function () { x.classList.add('on'); }, 140 + i * 150); });
    }
    var btns = qsa('.alog__tabs button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        fmt = b.dataset.fmt; played = true; body.scrollTop = 0;
        btns.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
        render();
      });
    });
    qs('#alogN').textContent = LOG.length + ' entries';
    if (RM) { played = true; render(); return; }
    body.innerHTML = '';
    ST.create({ trigger: '#alog', start: 'top 72%', once: true, onEnter: render });
  }

  Core.onReady(function () {
    initCopy(); initFlow(); initControls(); initNever(); initAudit();
    setTimeout(function () { ST.refresh(); }, 500);
  });
})();
