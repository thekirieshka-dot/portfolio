/* ───────── Sightline — site.js (index + book-demo) ───────── */
(function () {
  'use strict';
  var d = document, root = d.documentElement, gsap = window.gsap, ST = window.ScrollTrigger;
  var qs = function (s, c) { return (c || d).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ───────── engine config + terminal preloader ───────── */
  var TERM = '<span class="term">' +
    '<span class="term__l"><span class="term__p">ask &gt;</span><span class="term__q"></span><i class="term__c"></i></span>' +
    '<span class="term__meta"></span>' +
    '<span class="term__l"><span class="term__p term__p--a">ans</span><span class="term__ans"></span></span>' +
    '</span>';
  Core.config({
    veilBg: '#f4f4f1', veilInk: '#0b0b0b', veilCols: 5,
    preloader: { key: 'sightline', brand: TERM, top: 'Sightline', topRight: 'Read-only · eu-central-1', bottom: 'Running query', duration: 2.8 }
  });

  /* core bug workaround: links without data-veil* pass `undefined` over the configured
     veil colours (Object.assign keeps undefined keys), so the transition falls back to #0d0d0d. */
  qsa('a[href]').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:|https?:)/i.test(h)) return;
    if (!a.dataset.veil) a.dataset.veil = '#f4f4f1';
    if (!a.dataset.veilInk) a.dataset.veilInk = '#0b0b0b';
    if (!a.dataset.veilLabel) a.dataset.veilLabel = 'Sightline';
  });

  d.addEventListener('DOMContentLoaded', function () {
    var t = qs('.pre .term'); if (!t) return;
    var q = qs('.term__q', t), c = qs('.term__c', t), meta = qs('.term__meta', t), ans = qs('.term__ans', t);
    var Q = 'why did activation drop in march?';
    var A = 'Activation fell 6.8 pts after the Mar 4 checklist change. 41% of new workspaces now stop at “invite a teammate”.';
    var AH = 'Activation fell <b>6.8 pts</b> after the Mar 4 checklist change. <b>41%</b> of new workspaces now stop at “invite a teammate”.';
    var i = 0;
    setTimeout(function type() {
      q.textContent = Q.slice(0, ++i);
      if (i < Q.length) setTimeout(type, 22 + Math.random() * 26);
      else setTimeout(answer, 160);
    }, 360);
    function answer() {
      meta.textContent = 'semantic layer · 4 tables · read-only · 3.9 s';
      c.remove();
      var glyph = '01#%/<>=+-_:', n = A.length, start = performance.now(), dur = 820;
      (function frame(now) {
        var p = Math.min(1, (now - start) / dur), k = Math.floor(p * n), s = A.slice(0, k);
        for (var j = k; j < Math.min(n, k + 14); j++) s += A[j] === ' ' ? ' ' : glyph[(Math.random() * glyph.length) | 0];
        ans.textContent = s;
        if (p < 1) requestAnimationFrame(frame); else ans.innerHTML = AH;
      })(start);
    }
  });

  /* custom cursor colour follows the surface under it */
  d.addEventListener('mouseover', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    root.dataset.cur = t.closest('.app, .panel, .grant, [data-hdr-theme=dark], .book__aside') ? 'dark' : 'light';
  });

  /* ═════════ generative "sightline" field (hero + CTA) ═════════ */
  function Field(cv, o) {
    var ctx = cv.getContext && cv.getContext('2d'); if (!ctx) return;
    var host = cv.parentElement, W = 0, H = 0, dpr = 1, off = 0, cx = -1, tx = 0, hover = false, auto = 0.6, raf = 0, last = 0, vis = false, band = [0, 0];
    var ink = o.dark ? '244,244,241' : '11,11,11', step = o.step || 18, readY = 0, knock = [];
    function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
    function noise(x) { var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; }
    function val(idx, xn) {
      var n = noise(idx * 0.32) * 0.55 + noise(idx * 0.85 + 40) * 0.3 + noise(idx * 2.3 + 90) * 0.15;
      return Math.min(1, Math.max(0.02, o.trend(xn) + (n - 0.5) * 0.62));
    }
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var b = o.band(W, H); band = [b.top, b.bot]; readY = b.read; knock = b.knock || [];
      if (cx < 0) cx = W * 0.62;
    }
    function draw(dt) {
      off += dt * 0.0009;
      if (!hover) { auto += dt * 0.00011; tx = W * (0.56 + 0.3 * Math.sin(auto)); }
      cx += (tx - cx) * Math.min(1, dt * 0.006);
      var top = band[0], bot = band[1], hgt = bot - top;
      ctx.clearRect(0, 0, W, H);
      var n = Math.ceil(W / step) + 3, frac = off % 1, base = Math.floor(off), pts = [];
      for (var k = -1; k < n; k++) { var x = (k - frac) * step; pts.push([x, bot - val(base + k, x / W) * hgt, base + k]); }
      // area wash
      var g = ctx.createLinearGradient(0, top, 0, bot);
      g.addColorStop(0, 'rgba(' + ink + ',' + (o.dark ? .07 : .05) + ')'); g.addColorStop(1, 'rgba(' + ink + ',0)');
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (k = 1; k < pts.length - 1; k++) ctx.quadraticCurveTo(pts[k][0], pts[k][1], (pts[k][0] + pts[k + 1][0]) / 2, (pts[k][1] + pts[k + 1][1]) / 2);
      ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      ctx.strokeStyle = 'rgba(' + ink + ',' + (o.dark ? .34 : .26) + ')'; ctx.lineWidth = 1.25; ctx.stroke();
      ctx.lineTo(W + step, bot); ctx.lineTo(-step, bot); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      // axis + week ticks
      ctx.fillStyle = 'rgba(' + ink + ',.1)'; ctx.fillRect(0, Math.round(bot) + .5, W, 1);
      ctx.font = '10px "Geist Mono", ui-monospace, monospace'; ctx.textBaseline = 'top';
      for (k = 0; k < pts.length; k++) if (pts[k][2] % 4 === 0) {
        ctx.fillStyle = 'rgba(' + ink + ',.22)'; ctx.fillRect(Math.round(pts[k][0]), Math.round(bot) + 1, 1, 5);
        ctx.fillStyle = 'rgba(' + ink + ',.3)'; ctx.fillText('W' + (((pts[k][2] % 52) + 52) % 52 + 1), pts[k][0] + 4, bot + 6);
      }
      // crosshair
      var fi = (cx / step) + frac + 1, i0 = Math.max(0, Math.min(pts.length - 2, Math.floor(fi))), ft = fi - i0;
      var y = pts[i0][1] * (1 - ft) + pts[i0 + 1][1] * ft, idx = pts[i0][2] + (ft > .5 ? 1 : 0);
      ctx.fillStyle = 'rgba(' + ink + ',' + (o.dark ? .3 : .2) + ')'; ctx.fillRect(Math.round(cx), readY, 1, bot - readY);
      ctx.fillRect(Math.round(cx) - 12, Math.round(y), 24, 1);
      ctx.beginPath(); ctx.arc(cx, y, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#c8f34b'; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = '#0b0b0b'; ctx.stroke();
      if (knock.length) {
        ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = '#000'; ctx.shadowColor = '#000'; ctx.shadowBlur = 22;
        knock.forEach(function (r) { ctx.fillRect(r[0] - 14, r[1] - 12, r[2] + 28, r[3] + 24); });
        ctx.restore();
      }
      // readout
      var label = o.fmt((bot - y) / hgt, ((idx % 52) + 52) % 52 + 1);
      ctx.font = '10.5px "Geist Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle';
      var tw = ctx.measureText(label).width + 26, lx = cx + 12, ly = readY;
      if (lx + tw > W - 8) lx = cx - 12 - tw;
      ctx.fillStyle = o.dark ? '#c8f34b' : '#0b0b0b'; roundRect(lx, ly - 11, tw, 22, 4); ctx.fill();
      ctx.fillStyle = o.dark ? '#0b0b0b' : '#c8f34b'; ctx.fillRect(lx + 9, ly - 2.5, 5, 5);
      ctx.fillStyle = o.dark ? '#0b0b0b' : '#f4f4f1'; ctx.fillText(label, lx + 19, ly + .5);
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function loop(t) { raf = requestAnimationFrame(loop); var dt = last ? Math.min(60, t - last) : 16; last = t; draw(dt); }
    function start() { if (raf || RM) return; last = 0; raf = requestAnimationFrame(loop); }
    function stop() { cancelAnimationFrame(raf); raf = 0; }
    host.addEventListener('pointermove', function (e) { var r = host.getBoundingClientRect(); hover = true; tx = e.clientX - r.left; }, { passive: true });
    host.addEventListener('pointerleave', function () { hover = false; });
    size();
    if (RM) { draw(16); }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; vis && !d.hidden ? start() : stop(); }).observe(host);
    d.addEventListener('visibilitychange', function () { d.hidden ? stop() : (vis && start()); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (RM) draw(16); }, 120); });
    return { size: size };
  }

  /* ═════════ hero app: data ═════════ */
  var QS = {
    churn: {
      q: 'Why did churn spike in March?',
      steps: ['Reading semantic layer · logo_churn v12', 'Planning · 2 CTEs, 1 join', 'Running on BigQuery · read-only', 'Checking · totals match billing'],
      time: 3.9, meta: '4 tables · 1.2 M rows',
      text: 'Churn rose from {2.2%} in February to {3.4%} in March. {71%} of the extra cancellations were Starter accounts on annual renewal whose card update failed after the billing migration on Mar 6. Excluding failed payments, March was {2.3%}, in line with the year.',
      chips: [['Failed card updates', '+1.1 pts'], ['Starter, annual renewal', '71% of excess'], ['Excl. failed payments', 'flat']],
      cap: '<span>Monthly logo churn</span><span class="k"><i class="sw"></i>All cancellations</span><span class="k"><i class="sw sw--g"></i>Excl. failed payments</span>',
      chart: 'line',
      data: { x: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], yr: ['2025', '2025', '2025', '2026', '2026', '2026', '2026', '2026', '2026', '2026', '2026', '2026'],
        a: [2.1, 2.0, 2.3, 2.2, 2.2, 3.4, 2.7, 2.3, 2.2, 2.1, 2.0, 1.9], b: [2.1, 2.0, 2.2, 2.2, 2.2, 2.3, 2.3, 2.2, 2.2, 2.1, 2.0, 1.9], hi: 5 },
      sqlMeta: '27 lines · BigQuery · 0.84 s · read-only',
      sql: [
        '-- metric: logo_churn (semantic layer v38)',
        'WITH active AS (',
        '  SELECT DATE_TRUNC(month, MONTH) AS month,',
        '         COUNT(DISTINCT account_id) AS accounts',
        '  FROM analytics.account_months',
        "  WHERE month BETWEEN '2025-10-01' AND '2026-09-30'",
        '  GROUP BY 1',
        '),',
        'churned AS (',
        '  SELECT DATE_TRUNC(DATE(s.cancelled_at), MONTH) AS month,',
        '         COUNT(*) AS churned,',
        "         COUNTIF(p.last_status = 'card_update_failed') AS failed",
        '  FROM billing.subscriptions s',
        '  LEFT JOIN billing.payment_attempts p',
        '    USING (subscription_id)',
        "  WHERE s.cancelled_at >= TIMESTAMP('2025-10-01')",
        '    AND s.plan_type != \'internal\'',
        '  GROUP BY 1',
        ')',
        'SELECT a.month,',
        '       ROUND(100 * c.churned / a.accounts, 1) AS churn_pct,',
        '       ROUND(100 * (c.churned - c.failed)',
        '             / a.accounts, 1) AS churn_excl_failed_pct',
        'FROM active a',
        'JOIN churned c USING (month)',
        'ORDER BY a.month;',
        '-- 12 rows · reconciled with billing.mrr_movements'
      ].join('\n')
    },
    onboarding: {
      q: 'Which onboarding step loses the most users?',
      steps: ['Reading semantic layer · onboarding_funnel v9', 'Planning · 5 ordered steps', 'Running on BigQuery · read-only', 'Checking · cohort sizes add up'],
      time: 4.2, meta: '1 table · 9.8 M events',
      text: 'Inviting a teammate is the leak: {41%} of workspaces that connect a source never invite anyone. It got worse after Mar 4, when the invite moved behind the setup checklist. Workspaces that invite someone on day one activate at {3.2×} the rate.',
      chips: [['Invite step', '–41%'], ['Since the Mar 4 change', '–9 pts'], ['Invite on day one', '3.2× activation']],
      cap: '<span>Workspaces reaching each step · since Mar 1</span>',
      chart: 'funnel',
      data: { steps: [['Sign-up', 'Signed up', 12480], ['Verified', 'Verified email', 10960], ['Connected', 'Connected a source', 7140], ['Invited', 'Invited a teammate', 4210], ['Shared', 'Shared an answer', 3620]] },
      sqlMeta: '22 lines · BigQuery · 1.31 s · read-only',
      sql: [
        '-- metric: onboarding_funnel (semantic layer v38)',
        'WITH firsts AS (',
        '  SELECT workspace_id,',
        "    MIN(IF(event = 'signed_up', ts, NULL))        AS s1,",
        "    MIN(IF(event = 'email_verified', ts, NULL))   AS s2,",
        "    MIN(IF(event = 'source_connected', ts, NULL)) AS s3,",
        "    MIN(IF(event = 'teammate_invited', ts, NULL)) AS s4,",
        "    MIN(IF(event = 'answer_shared', ts, NULL))    AS s5",
        '  FROM events.product',
        "  WHERE ts >= TIMESTAMP('2026-03-01')",
        "    AND workspace_plan != 'internal'",
        '  GROUP BY workspace_id',
        ')',
        'SELECT',
        '  COUNTIF(s1 IS NOT NULL) AS signed_up,',
        '  COUNTIF(s2 > s1)        AS verified,',
        '  COUNTIF(s3 > s2)        AS connected,',
        '  COUNTIF(s4 > s3)        AS invited,',
        '  COUNTIF(s5 > s4)        AS shared',
        'FROM firsts;',
        '-- 1 row · 9,812,340 events scanned'
      ].join('\n')
    },
    region: {
      q: 'Compare EU vs US trial-to-paid',
      steps: ['Reading semantic layer · trial_to_paid v12', 'Planning · rollup by region and plan', 'Running on BigQuery · read-only', 'Checking · EU + US = all trials'],
      time: 3.6, meta: '3 tables · 48,210 trials',
      text: 'EU trials convert better: {19.8%} against {16.4%} over the last 12 weeks. Most of the gap is on the Team plan, and it opened in week 31, when EU pricing switched to VAT-inclusive display. US trials that book an onboarding call convert at {24.1%}.',
      chips: [['Team plan gap', '+4.6 pts EU'], ['Gap opened', 'week 31'], ['US with onboarding call', '24.1%']],
      cap: '<span>Trial-to-paid · last 12 weeks</span><span class="k"><i class="dot"></i>EU</span><span class="k"><i class="dot dot--o"></i>US</span>',
      chart: 'dumbbell',
      data: { rows: [['Starter', 14.2, 12.9], ['Team', 21.6, 17.0], ['Business', 26.3, 24.8], ['All plans', 19.8, 16.4]] },
      sqlMeta: '19 lines · BigQuery · 0.62 s · read-only',
      sql: [
        '-- metric: trial_to_paid (semantic layer v38)',
        'SELECT t.region,',
        '       p.plan_name AS plan,',
        '       COUNT(*) AS trials,',
        '       ROUND(100 * COUNTIF(s.first_paid_at IS NOT NULL)',
        '             / COUNT(*), 1) AS trial_to_paid_pct',
        'FROM billing.trials t',
        'JOIN billing.plans p USING (plan_id)',
        'LEFT JOIN billing.subscriptions s',
        '  ON s.account_id = t.account_id',
        ' AND s.first_paid_at < TIMESTAMP_ADD(t.started_at,',
        '                         INTERVAL 30 DAY)',
        'WHERE t.started_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(),',
        '                         INTERVAL 84 DAY)',
        "  AND t.region IN ('EU', 'US')",
        '  AND t.is_test = FALSE',
        'GROUP BY ROLLUP (t.region, p.plan_name)',
        'ORDER BY region, plan;',
        '-- 10 rows · EU + US = 48,210 trials'
      ].join('\n')
    }
  };
  var MISS = {
    steps: ['Reading semantic layer', 'Matching metrics', 'No metric matches this question'],
    time: 0.6,
    text: 'This window runs on a fixed sample of Halden’s data, so it knows churn, onboarding and trial conversion, and not much else. Connected to your warehouse, it would take this one too. Try one of these:'
  };

  /* SQL highlighter (tiny, regex based) */
  var KW = 'WITH|AS|SELECT|FROM|WHERE|GROUP BY|ORDER BY|LEFT JOIN|JOIN|USING|ON|AND|OR|IN|BETWEEN|IS NOT NULL|IS|NOT|NULL|INTERVAL|DAY|WEEK|MONTH|ROLLUP|DISTINCT|FALSE|TRUE|LIMIT|GRANT|TO';
  var TOK = new RegExp("(--[^\\n]*)|('(?:[^'])*')|\\b(" + KW + ")\\b|\\b([A-Z_]{2,})(?=\\s*\\()|(\\b\\d+(?:\\.\\d+)?\\b)|([(),;=<>!*/+.-])", 'g');
  function hl(sql) {
    return esc(sql).replace(/&gt;/g, '\u0001').replace(/&lt;/g, '\u0002').replace(/&amp;/g, '\u0003')
      .replace(TOK, function (m, c, s, k, f, n, p) {
        if (c) return '<span class="tk-c">' + c + '</span>';
        if (s) return '<span class="tk-s">' + s + '</span>';
        if (k) return '<span class="tk-k">' + k + '</span>';
        if (f) return '<span class="tk-f">' + f + '</span>';
        if (n) return '<span class="tk-n">' + n + '</span>';
        return '<span class="tk-p">' + p + '</span>';
      })
      .replace(/\u0001/g, '<span class="tk-p">&gt;</span>').replace(/\u0002/g, '<span class="tk-p">&lt;</span>').replace(/\u0003/g, '&amp;');
  }

  /* ═════════ hero app: engine ═════════ */
  function initApp() {
    var app = qs('#app'); if (!app) return;
    var form = qs('#askForm'), input = qs('#askInput'), go = qs('.ask__go'), chips = qsa('.sugg .chip');
    var ans = qs('#ans'), ansQ = qs('#ansQ b'), status = qs('#ansStatus span'), timer = qs('#ansStatus em');
    var P = qs('#ansP'), chipList = qs('#ansChips'), cap = qs('#ansCap'), plot = qs('#ansPlot'), tip = qs('#ansTip'), fig = qs('#ansFig');
    var sql = qs('#sql'), sqlBar = qs('#sqlBar'), sqlMeta = qs('#sqlMeta'), sqlCode = qs('#sqlCode'), sqlCopy = qs('#sqlCopy');
    var runId = 0, current = null, tweens = [], hover = null, touched = false;

    function kill() { tweens.forEach(function (t) { t && t.kill && t.kill(); }); tweens = []; }
    function setStatus(txt) { status.textContent = txt; }

    async function typeInto(str, id) {
      input.value = ''; form.classList.add('has-text');
      for (var i = 1; i <= str.length; i++) {
        if (id !== runId) return false;
        input.value = str.slice(0, i);
        await sleep(RM ? 0 : 16 + Math.random() * 30);
      }
      await sleep(RM ? 0 : 220);
      return id === runId;
    }
    function reset() {
      kill();
      ans.classList.remove('is-thinking', 'is-done', 'is-miss');
      P.innerHTML = ''; chipList.innerHTML = ''; cap.innerHTML = ''; plot.innerHTML = ''; hover = null; hideTip();
      sql.classList.remove('is-ready', 'is-open'); sqlBar.setAttribute('aria-expanded', 'false');
    }

    async function ask(key, userText, fromChip) {
      var id = ++runId, Q = key ? QS[key] : MISS;
      touched = touched || !!userText || fromChip === 'user';
      chips.forEach(function (c) { c.classList.toggle('is-on', !!fromChip && c.dataset.q === key); });
      reset();
      if (fromChip) { if (!(await typeInto(Q.q, id))) return; }
      go.classList.add('is-hit'); setTimeout(function () { go.classList.remove('is-hit'); }, 260);
      input.value = ''; form.classList.remove('has-text');
      ansQ.textContent = userText || Q.q;
      current = key;
      ans.classList.add('is-thinking');
      var o = { v: 0 }, dur = RM ? 0 : (key ? 1.6 : 0.8);
      timer.textContent = '0.0 s';
      tweens.push(gsap.to(o, { v: Q.time, duration: dur, ease: 'power1.in', onUpdate: function () { timer.textContent = o.v.toFixed(1) + ' s'; } }));
      for (var i = 0; i < Q.steps.length; i++) {
        setStatus(Q.steps[i]);
        await sleep(dur * 1000 / Q.steps.length);
        if (id !== runId) return;
      }
      ans.classList.remove('is-thinking');
      timer.textContent = Q.time.toFixed(1) + ' s';
      if (!key) {
        ans.classList.add('is-miss');
        setStatus('No match in the sample workspace');
        plot.innerHTML = '<div class="ans__empty mono">No chart.<br>We don’t draw what we can’t check.</div>';
        await stream(MISS.text, id);
        if (id !== runId) return;
        Object.keys(QS).forEach(function (k, j) {
          var li = d.createElement('li'); li.className = 'is-btn';
          li.innerHTML = '<button class="chip" type="button">' + QS[k].q + '</button>';
          li.firstChild.addEventListener('click', function () { ask(k, null, true); });
          chipList.appendChild(li);
          if (!RM) tweens.push(gsap.from(li, { y: 8, autoAlpha: 0, duration: .6, delay: j * .07, ease: 'expo.out' }));
        });
        return;
      }
      ans.classList.add('is-done');
      setStatus('Answered · ' + Q.meta + (userText ? ' · closest sample question' : ''));
      cap.innerHTML = Q.cap;
      drawChart(Q, !RM);
      sqlMeta.textContent = Q.sqlMeta;
      sqlCode.innerHTML = hl(Q.sql).split('\n').map(function (l) { return '<span class="ln">' + (l || ' ') + '</span>'; }).join('');
      await stream(Q.text, id, userText ? 'Closest match: “' + Q.q + '”' : '');
      if (id !== runId) return;
      Q.chips.forEach(function (c, j) {
        var li = d.createElement('li'); li.innerHTML = '<span>' + c[0] + '</span><b>' + c[1] + '</b>';
        chipList.appendChild(li);
        if (!RM) tweens.push(gsap.from(li, { y: 8, autoAlpha: 0, duration: .6, delay: j * .08, ease: 'expo.out' }));
      });
      await sleep(RM ? 0 : 260);
      if (id !== runId) return;
      sql.classList.add('is-ready');
      if (ST) ST.refresh();
    }

    async function stream(text, id, note) {
      var words = text.split(' '), html = note ? '<span class="note">' + esc(note) + '</span>' : '';
      html += words.map(function (w) { return '<span class="w">' + w.replace(/\{([^}]+)\}/g, '<b>$1</b>') + '</span>'; }).join(' ');
      P.innerHTML = html;
      var ws = qsa('.w', P), cur = d.createElement('i'); cur.className = 'cur';
      for (var i = 0; i < ws.length; i++) {
        if (id !== runId) return;
        ws[i].classList.add('on'); ws[i].after(cur);
        if (!RM) await sleep(/[.:]$/.test(words[i]) ? 140 : 26 + Math.random() * 22);
      }
      setTimeout(function () { if (id === runId) cur.remove(); }, 700);
    }

    /* ─── charts ─── */
    function svg(W, H, body) { return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">' + body + '</svg>'; }
    function f1(v) { return v.toFixed(1); }
    function drawChart(Q, anim) {
      var W = Math.max(200, plot.clientWidth), H = Math.max(160, plot.clientHeight);
      if (Q.chart === 'line') lineChart(Q.data, W, H, anim);
      else if (Q.chart === 'funnel') funnelChart(Q.data, W, H, anim);
      else dumbbellChart(Q.data, W, H, anim);
    }

    function lineChart(D, W, H, anim) {
      var m = { l: 34, r: 16, t: 30, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b, n = D.x.length, ymax = 4;
      var X = function (i) { return m.l + i * iw / (n - 1); }, Y = function (v) { return m.t + ih - v / ymax * ih; };
      var s = '', narrow = iw < 330;
      for (var t = 0; t <= ymax; t++) {
        s += '<line class="' + (t ? 'ch-grid' : 'ch-base') + ' an-g" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(t) + '" y2="' + Y(t) + '"/>';
        s += '<text class="ch-t an-g" x="' + (m.l - 9) + '" y="' + (Y(t) + 3.5) + '" text-anchor="end">' + t + '%</text>';
      }
      D.x.forEach(function (lab, i) { if (narrow && i % 2) return; s += '<text class="ch-t an-g" x="' + X(i) + '" y="' + (H - 7) + '" text-anchor="middle">' + lab + '</text>'; });
      var pa = D.a.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
      var pb = D.b.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
      s += '<path class="ch-area an-a" d="' + pa + ' L' + X(n - 1) + ' ' + Y(0) + ' L' + X(0) + ' ' + Y(0) + ' Z"/>';
      s += '<path class="ch-line ch-line--g an-l2" pathLength="1" stroke-dasharray="1" d="' + pb + '"/>';
      s += '<path class="ch-line an-l1" pathLength="1" stroke-dasharray="1" d="' + pa + '"/>';
      var hx = X(D.hi), ya = Y(D.a[D.hi]), yb = Y(D.b[D.hi]);
      s += '<g class="an-n"><line class="ch-rule" x1="' + hx + '" x2="' + hx + '" y1="' + (ya + 7) + '" y2="' + (yb - 6) + '"/>' +
        '<circle class="ch-dot--o" cx="' + hx + '" cy="' + yb + '" r="4"/><circle class="ch-dot" cx="' + hx + '" cy="' + ya + '" r="5"/>' +
        '<text class="ch-t ch-t--b" x="' + (hx - 10) + '" y="' + (ya + 4) + '" text-anchor="end">3.4%</text>' +
        '<text class="ch-t" x="' + (hx + 12) + '" y="' + (ya - 4) + '"><tspan class="ch-t--hi">+1.1 pts</tspan> failed payments</text></g>';
      s += '<g class="xh"><line class="ch-cross" y1="' + m.t + '" y2="' + Y(0) + '"/><circle class="ch-dot ch-cross" r="4.5"/><circle class="ch-dot--o ch-cross" r="3.5"/></g>';
      s += '<rect class="ch-hit" x="' + m.l + '" y="0" width="' + iw + '" height="' + H + '"/>';
      plot.innerHTML = svg(W, H, s);
      var g = qs('.xh', plot), ln = g.children[0], da = g.children[1], db = g.children[2], ann = qs('.an-n', plot);
      hover = function (px, py, on) {
        if (!on) { [ln, da, db].forEach(function (e) { e.style.opacity = 0; }); ann.style.opacity = ''; return hideTip(); }
        var i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / (iw / (n - 1))))), x = X(i);
        ln.setAttribute('x1', x); ln.setAttribute('x2', x); da.setAttribute('cx', x); da.setAttribute('cy', Y(D.a[i])); db.setAttribute('cx', x); db.setAttribute('cy', Y(D.b[i]));
        [ln, da, db].forEach(function (e) { e.style.opacity = 1; }); ann.style.opacity = .25;
        showTip('<b>' + D.x[i] + ' ' + D.yr[i] + '</b><br><i class="l"></i>' + f1(D.a[i]) + '% all<br><i class="o"></i>' + f1(D.b[i]) + '% excl. failed', x, Y(D.a[i]));
      };
      if (anim) {
        var tl = gsap.timeline();
        tl.from(qsa('.an-g', plot), { opacity: 0, duration: .6, stagger: .015 }, 0)
          .fromTo(qs('.an-l2', plot), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, .15)
          .fromTo(qs('.an-l1', plot), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, .25)
          .from(qs('.an-a', plot), { opacity: 0, duration: 1 }, 1.1)
          .from(ann, { opacity: 0, y: 6, duration: .7, ease: 'expo.out' }, 1.3);
        tweens.push(tl);
      } else qsa('.an-l1, .an-l2', plot).forEach(function (p) { p.style.strokeDashoffset = 0; });
    }

    function funnelChart(D, W, H, anim) {
      var st = D.steps, n = st.length, m = { l: 6, r: 6, t: 48, b: 30 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var band = iw / n, bw = Math.min(48, band * .5), max = st[0][2] * 1.04, base = m.t + ih, r = 4;
      var CX = function (i) { return m.l + band * (i + .5); }, Y = function (v) { return base - v / max * ih; };
      var drops = st.map(function (s, i) { return i ? 1 - s[2] / st[i - 1][2] : 0; }), worst = drops.indexOf(Math.max.apply(null, drops));
      var s = '<line class="ch-base an-g" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + base + '" y2="' + base + '"/>';
      st.forEach(function (row, i) {
        var x = CX(i) - bw / 2, y = Y(row[2]), hi = i === worst;
        if (i < n - 1) s += '<line class="ch-link an-g" x1="' + (x + bw) + '" y1="' + y + '" x2="' + (CX(i + 1) - bw / 2) + '" y2="' + Y(st[i + 1][2]) + '"/>';
        s += '<path class="ch-bar' + (hi ? ' ch-bar--hi' : '') + ' an-b" d="M' + x + ' ' + base + ' V' + (y + r) + ' a' + r + ' ' + r + ' 0 0 1 ' + r + ' -' + r + ' H' + (x + bw - r) + ' a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + ' V' + base + ' Z"/>';
        s += '<text class="ch-t ch-t--hi an-v" x="' + CX(i) + '" y="' + (y - 8) + '" text-anchor="middle">' + row[2].toLocaleString('en-US') + '</text>';
        s += '<text class="ch-t an-g" x="' + CX(i) + '" y="' + (base + 17) + '" text-anchor="middle">' + row[0] + '</text>';
        if (i) {
          var px = (CX(i - 1) + CX(i)) / 2, lbl = '–' + Math.round(drops[i] * 100) + '%';
          if (hi) s += '<g class="an-p"><rect class="ch-pill" x="' + (px - 22) + '" y="' + (m.t - 44) + '" width="44" height="19" rx="4"/><text class="ch-t ch-t--ink" x="' + px + '" y="' + (m.t - 31) + '" text-anchor="middle">' + lbl + '</text></g>';
          else s += '<text class="ch-t an-p" x="' + px + '" y="' + (m.t - 31) + '" text-anchor="middle">' + lbl + '</text>';
        }
      });
      for (var i = 0; i < n; i++) s += '<rect class="ch-hit" data-i="' + i + '" x="' + (m.l + band * i) + '" y="0" width="' + band + '" height="' + H + '"/>';
      plot.innerHTML = svg(W, H, s);
      var bars = qsa('.an-b', plot);
      hover = function (px, py, on) {
        bars.forEach(function (b) { b.style.opacity = ''; });
        if (!on) return hideTip();
        var i = Math.max(0, Math.min(n - 1, Math.floor((px - m.l) / band)));
        bars.forEach(function (b, j) { if (j !== i) b.style.opacity = .45; });
        showTip('<b>' + st[i][1] + '</b><br>' + st[i][2].toLocaleString('en-US') + ' workspaces' + (i ? '<br>–' + Math.round(drops[i] * 100) + '% from previous step' : '<br>since Mar 1'), CX(i), Y(st[i][2]));
      };
      if (anim) {
        var tl = gsap.timeline();
        tl.from(qsa('.an-g', plot), { opacity: 0, duration: .6 }, 0)
          .from(bars, { scaleY: 0, transformOrigin: '50% 100%', duration: 1.1, ease: 'expo.out', stagger: .09 }, .1)
          .from(qsa('.an-v', plot), { opacity: 0, y: 6, duration: .5, stagger: .09 }, .5)
          .from(qsa('.an-p', plot), { opacity: 0, y: 4, duration: .5, stagger: .08 }, 1.1);
        tweens.push(tl);
      }
    }

    function dumbbellChart(D, W, H, anim) {
      var rows = D.rows, n = rows.length, m = { l: 72, r: 48, t: 14, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b, rh = ih / n, xmax = 30;
      var X = function (v) { return m.l + v / xmax * iw; }, Y = function (i) { return m.t + rh * (i + .5); };
      var s = '';
      [0, 10, 20, 30].forEach(function (t) {
        s += '<line class="' + (t ? 'ch-grid' : 'ch-base') + ' an-g" x1="' + X(t) + '" x2="' + X(t) + '" y1="' + m.t + '" y2="' + (H - m.b) + '"/>';
        s += '<text class="ch-t an-g" x="' + X(t) + '" y="' + (H - 8) + '" text-anchor="middle">' + t + '%</text>';
      });
      s += '<line class="ch-grid an-g" x1="0" x2="' + (W - m.r + 30) + '" y1="' + (m.t + rh * (n - 1)) + '" y2="' + (m.t + rh * (n - 1)) + '"/>';
      rows.forEach(function (r, i) {
        var y = Y(i);
        s += '<rect class="ch-row-bg" x="0" y="' + (y - rh / 2 + 2) + '" width="' + (W - 4) + '" height="' + (rh - 4) + '" rx="6"/>';
        s += '<text class="ch-t' + (i === n - 1 ? ' ch-t--hi' : '') + ' an-g" x="2" y="' + (y + 3.5) + '">' + r[0] + '</text>';
        s += '<g class="row" data-i="' + i + '"><line class="ch-rule" stroke-width="2" x1="' + X(r[2]) + '" x2="' + X(r[1]) + '" y1="' + y + '" y2="' + y + '"/>' +
          '<circle class="ch-dot--o" cx="' + X(r[2]) + '" cy="' + y + '" r="4.5"/><circle class="ch-dot" cx="' + X(r[1]) + '" cy="' + y + '" r="5.5"/>' +
          '<text class="ch-t lb-u" x="' + (X(r[2]) - 10) + '" y="' + (y + 3.5) + '" text-anchor="end">' + f1(r[2]) + '</text>' +
          '<text class="ch-t ch-t--hi lb-e" x="' + (X(r[1]) + 11) + '" y="' + (y + 3.5) + '">' + f1(r[1]) + '%</text></g>';
        if (r[0] === 'Team') {
          var mx = (X(r[1]) + X(r[2])) / 2;
          s += '<g class="an-p"><rect class="ch-pill" x="' + (mx - 30) + '" y="' + (y - 26) + '" width="60" height="18" rx="4"/><text class="ch-t ch-t--ink" x="' + mx + '" y="' + (y - 13.5) + '" text-anchor="middle">+4.6 pts</text></g>';
        }
      });
      for (var i = 0; i < n; i++) s += '<rect class="ch-hit" x="0" y="' + (m.t + rh * i) + '" width="' + W + '" height="' + rh + '"/>';
      plot.innerHTML = svg(W, H, s);
      var bgs = qsa('.ch-row-bg', plot);
      hover = function (px, py, on) {
        bgs.forEach(function (b) { b.style.opacity = 0; });
        if (!on) return hideTip();
        var i = Math.max(0, Math.min(n - 1, Math.floor((py - m.t) / rh))), r = rows[i];
        bgs[i].style.opacity = 1;
        showTip('<b>' + r[0] + '</b><br><i class="l"></i>EU ' + f1(r[1]) + '%<br><i class="o"></i>US ' + f1(r[2]) + '%<br>Gap +' + f1(r[1] - r[2]) + ' pts', X(r[1]), Y(i));
      };
      if (anim) {
        var tl = gsap.timeline();
        tl.from(qsa('.an-g', plot), { opacity: 0, duration: .6 }, 0);
        qsa('.row', plot).forEach(function (g, i) {
          var r = rows[i], ln = g.children[0], u = g.children[1], e = g.children[2], lu = g.children[3], le = g.children[4], o = { p: 0 };
          tl.to(o, { p: 1, duration: 1.2, ease: 'expo.out', onUpdate: function () {
            var xu = X(r[2] * o.p), xe = X(r[1] * o.p);
            ln.setAttribute('x1', xu); ln.setAttribute('x2', xe); u.setAttribute('cx', xu); e.setAttribute('cx', xe);
            lu.setAttribute('x', xu - 10); le.setAttribute('x', xe + 11);
          } }, .15 + i * .1);
          tl.from([lu, le], { opacity: 0, duration: .5 }, .7 + i * .1);
        });
        tl.from(qsa('.an-p', plot), { opacity: 0, y: 4, duration: .5 }, 1.2);
        tweens.push(tl);
      }
    }

    /* tooltip */
    function showTip(html, x, y) {
      tip.innerHTML = html; tip.classList.add('on');
      var fr = fig.getBoundingClientRect(), pr = plot.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
      var left = pr.left - fr.left + x + 14, top = pr.top - fr.top + y - th - 12;
      if (left + tw > fr.width) left = pr.left - fr.left + x - tw - 14;
      if (top < 0) top = pr.top - fr.top + y + 14;
      tip.style.transform = 'translate(' + Math.max(0, left) + 'px,' + top + 'px)';
    }
    function hideTip() { tip.classList.remove('on'); }
    function pt(e) { var r = plot.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    plot.addEventListener('pointermove', function (e) { if (hover) { var p = pt(e); hover(p[0], p[1], true); } });
    plot.addEventListener('pointerdown', function (e) { if (hover) { var p = pt(e); hover(p[0], p[1], true); } });
    plot.addEventListener('pointerleave', function () { if (hover) hover(0, 0, false); });

    /* events */
    chips.forEach(function (c) { c.addEventListener('click', function () { touched = true; ask(c.dataset.q, null, true); }); });
    input.addEventListener('input', function () { form.classList.toggle('has-text', !!input.value.trim()); touched = true; });
    input.addEventListener('focus', function () { touched = true; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = input.value.trim();
      if (!t) { form.classList.remove('is-shake'); void form.offsetWidth; form.classList.add('is-shake'); input.focus(); return; }
      touched = true; input.blur();
      ask(route(t), t, false);
    });
    function route(t) {
      t = t.toLowerCase();
      if (/churn|cancel|retention|retain|attrition|lost (customers|accounts)/.test(t)) return 'churn';
      if (/onboard|activat|funnel|step|sign ?up|drop|invite|setup|set up/.test(t)) return 'onboarding';
      if (/\beu\b|\bus\b|europe|america|region|trial|convert|conversion|paid|country/.test(t)) return 'region';
      return null;
    }
    sqlBar.addEventListener('click', function () {
      var open = !sql.classList.contains('is-open');
      if (open && innerWidth > 899) sql.style.setProperty('--sqlh', Math.max(160, Math.min(340, ans.clientHeight - 60)) + 'px');
      sql.classList.toggle('is-open', open); sqlBar.setAttribute('aria-expanded', String(open));
      if (innerWidth <= 899 && ST) setTimeout(function () { ST.refresh(); }, 650);
    });
    sqlCopy.addEventListener('click', function () {
      var txt = current && QS[current] ? QS[current].sql : '';
      var done = function () { sqlCopy.textContent = 'Copied'; setTimeout(function () { sqlCopy.textContent = 'Copy'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done); else done();
    });
    var rt, lw = innerWidth;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (current && QS[current] && ans.classList.contains('is-done')) { kill(); drawChart(QS[current], false); } }, 160);
    });

    /* autoplay the first question once the hero is visible */
    var heroVis = true;
    new IntersectionObserver(function (es) { heroVis = es[0].isIntersecting; }, { threshold: .25 }).observe(app);
    Core.onReady(function () {
      setTimeout(function () { if (!touched && heroVis) ask('churn', null, true); }, RM ? 0 : 1100);
    });
    window.__slAsk = ask;
  }

  /* ═════════ walkthrough ═════════ */
  function initHow() {
    var panel = qs('#howPanel'); if (!panel) return;
    var steps = qsa('.step'), scenes = qsa('.scene', panel), count = qs('#howCount'), cur = -1;
    function typeIn(s) {
      var el = qs('[data-type]', s), a = qs('.mini-ans', s); if (!el) return;
      clearTimeout(el._tm); el.textContent = ''; if (a) a.classList.remove('on');
      var str = el.dataset.type, i = 0;
      if (RM) { el.textContent = str; if (a) a.classList.add('on'); return; }
      el._tm = setTimeout(function tick() {
        if (!s.classList.contains('is-on')) return;
        el.textContent = str.slice(0, ++i);
        el._tm = i < str.length ? setTimeout(tick, 18 + Math.random() * 28) : setTimeout(function () { if (a) a.classList.add('on'); }, 380);
      }, 300);
    }
    function on(s) { s.classList.add('is-on'); typeIn(s); }
    function off(s) { s.classList.remove('is-on'); var el = qs('[data-type]', s); if (el) clearTimeout(el._tm); }
    steps.forEach(function (st, i) {
      var c = panel.cloneNode(true);
      c.removeAttribute('id'); c.classList.add('panel--mini'); c.dataset.state = i;
      qsa('[id]', c).forEach(function (e) { e.removeAttribute('id'); });
      qsa('.scene', c).forEach(function (s, j) { if (j !== i) s.remove(); else s.classList.remove('is-on'); });
      qs('.panel__count em', c).textContent = '0' + (i + 1);
      qs('.panel__prog i', c).style.transform = 'scaleX(' + ((i + 1) / 3) + ')';
      st.appendChild(c);
      ST.create({ trigger: c, start: 'top 80%', once: true, onEnter: function () { if (c.offsetParent) on(qs('.scene', c)); } });
    });
    function set(i) {
      if (i === cur) return; cur = i;
      panel.dataset.state = i; count.textContent = '0' + (i + 1);
      scenes.forEach(function (s, j) { j === i ? on(s) : off(s); });
      steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
    }
    steps[0].classList.add('is-active');
    steps.forEach(function (st, i) {
      ST.create({ trigger: st, start: 'top 58%', end: 'bottom 58%', onToggle: function (self) { if (self.isActive && panel.offsetParent) set(i); } });
    });
    gsap.fromTo('#howProg', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.how__steps', start: 'top 58%', end: 'bottom 58%', scrub: true } });
  }

  /* ═════════ receipts ═════════ */
  var RC = [
    { no: '0039-01', metric: 'Trial-to-paid, week 39', value: '18.4%', def: 'Trials that become a paid subscription within 30 days, by trial start week.', sql: "SELECT ROUND(100 * COUNTIF(paid_30d)\n       / COUNT(*), 1)\nFROM billing.trials\nWHERE start_week = '2026-W39';", source: 'billing.trials', rows: '48,210', runtime: '0.61 s', fresh: '6 min', file: 'trial_to_paid.yml v12' },
    { no: '0039-02', metric: 'Net revenue retention', value: '112%', def: 'MRR now from accounts that paid a year ago, divided by what they paid then.', sql: "SELECT ROUND(100 * SUM(mrr_now)\n       / SUM(mrr_then))\nFROM billing.mrr_cohorts\nWHERE cohort_month = '2025-09';", source: 'billing.mrr_movements', rows: '1,204,881', runtime: '1.24 s', fresh: '1 h', file: 'nrr.yml v7' },
    { no: '0039-03', metric: 'Activation, week 39', value: '61.2%', def: 'New workspaces that share an answer within 7 days of signing up.', sql: "SELECT ROUND(100 * AVG(IF(shared_at\n  <= signed_up_at + INTERVAL 7 DAY,\n  1, 0)), 1)\nFROM events.workspace_firsts\nWHERE signup_week = '2026-W39';", source: 'events.product', rows: '9.8 M', runtime: '2.08 s', fresh: '4 min', file: 'activation.yml v21' },
    { no: '0039-04', metric: 'Tickets per account', value: '0.42', def: 'Support tickets opened this week, per active paying account.', sql: "SELECT ROUND(COUNT(t.id)\n  / COUNT(DISTINCT a.id), 2)\nFROM support.tickets t\nJOIN analytics.accounts a\n  USING (account_id)\nWHERE t.week = '2026-W39';", source: 'support.tickets', rows: '31,447', runtime: '0.33 s', fresh: '12 min', file: 'tickets_per_account.yml v3' }
  ];
  function initReceipts() {
    var rc = qs('#receipt'); if (!rc) return;
    var nums = qsa('.num'), printer = qs('.printer'), cur = -1, tw = null, ht;
    function fill(r) {
      qsa('[data-f]', rc).forEach(function (e) { var k = e.dataset.f; if (k === 'sql') e.innerHTML = hl(r.sql); else e.textContent = r[k]; });
    }
    function print(i) {
      if (i === cur) return; cur = i;
      nums.forEach(function (n, j) { n.classList.toggle('is-on', j === i); n.setAttribute('aria-pressed', String(j === i)); });
      if (tw) tw.kill();
      if (RM) { fill(RC[i]); return; }
      printer.classList.add('is-printing');
      tw = gsap.timeline({ onComplete: function () { printer.classList.remove('is-printing'); } })
        .to(rc, { yPercent: -101, duration: .35, ease: 'power2.in' })
        .add(function () { fill(RC[i]); })
        .to(rc, { yPercent: 0, duration: 1.25, ease: 'steps(18)' })
        .fromTo(rc, { rotation: 0 }, { rotation: -1.2, duration: .8, ease: 'elastic.out(1, .5)' });
    }
    nums.forEach(function (n, i) {
      n.setAttribute('aria-controls', 'receipt');
      n.addEventListener('click', function () { print(i); });
      n.addEventListener('mouseenter', function () { if (!Core.FINE) return; clearTimeout(ht); ht = setTimeout(function () { print(i); }, 140); });
      n.addEventListener('mouseleave', function () { clearTimeout(ht); });
    });
    if (!RM) gsap.set(rc, { yPercent: -101 });
    ST.create({ trigger: '.rcpt__right', start: 'top 72%', once: true, onEnter: function () { print(0); } });
  }

  /* ═════════ architecture diagram ═════════ */
  function initArch() {
    var host = qs('#arch'); if (!host) return;
    var lastW = 0, flows = [], vis = false, ticking = false, NS = 'http://www.w3.org/2000/svg';
    var SRC = [['Warehouse', 'sql'], ['Product events', 'events'], ['Billing', 'revenue'], ['CRM', 'accounts'], ['Support desk', 'tickets']];
    var OUT = [['Slack', 'threads'], ['Docs', 'embeds'], ['Dashboards', 'live'], ['API', 'json']];
    var SEM = [['Metrics', '38'], ['Joins', '112'], ['Access rules', '9']];
    var SL = ['01  Plan', '02  Write SQL', '03  Run read-only', '04  Check totals'];
    function node(x, y, w, h, cls, rx) { return '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 10) + '"/>'; }
    function t(x, y, txt, cls, anchor) { return '<text class="' + cls + '" x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + txt + '</text>'; }
    function curveH(x1, y1, x2, y2) { var dx = (x2 - x1) * .5; return 'M' + x1 + ' ' + y1 + ' C' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2; }
    function curveV(x1, y1, x2, y2) { var dy = (y2 - y1) * .5; return 'M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + (y1 + dy) + ' ' + x2 + ' ' + (y2 - dy) + ' ' + x2 + ' ' + y2; }
    function build() {
      var W = Math.round(host.clientWidth); if (!W || Math.abs(W - lastW) < 4) return; lastW = W;
      var s = '', E = [], H;
      if (W >= 960) {
        H = 480;
        var a = Math.min(220, W * .16), b = Math.min(280, W * .21), c = Math.min(280, W * .21), dd = a, g = (W - a - b - c - dd) / 3;
        var x0 = 0, x1 = a + g, x2 = x1 + b + g, x3 = W - dd, top = 52, nh = 48, gap = 14;
        [[x0, '01', 'Sources'], [x1, '02', 'Semantic layer'], [x2, '03', 'Sightline'], [x3, '04', 'Answers go to']].forEach(function (col) {
          s += t(col[0], 14, col[1], 'ar-col ar-col-n') + t(col[0] + 26, 14, col[2], 'ar-col');
        });
        var sTop = top + (H - top - (SRC.length * nh + (SRC.length - 1) * gap)) / 2;
        var bh = 260, bTop = top + (H - top - bh) / 2;
        var oTop = top + (H - top - (OUT.length * nh + (OUT.length - 1) * gap)) / 2;
        SRC.forEach(function (r, i) {
          var y = sTop + i * (nh + gap);
          s += node(x0, y, a, nh, 'ar-node') + t(x0 + 16, y + nh / 2 + 5, r[0], 'ar-t') + (a >= 190 ? t(x0 + a - 14, y + nh / 2 + 4, r[1], 'ar-s', 'end') : '');
          E.push(curveH(x0 + a, y + nh / 2, x1, bTop + 70 + i * 34));
        });
        s += node(x1, bTop, b, bh, 'ar-node', 12) + t(x1 + 18, bTop + 34, 'Semantic layer', 'ar-t ar-t--big');
        SEM.forEach(function (r, i) { var y = bTop + 76 + i * 44; s += '<line class="ar-sub" x1="' + (x1 + 18) + '" x2="' + (x1 + b - 18) + '" y1="' + (y - 22) + '" y2="' + (y - 22) + '"/>' + t(x1 + 18, y + 4, r[0], 'ar-s') + t(x1 + b - 18, y + 5, r[1], 'ar-t', 'end'); });
        s += t(x1 + 18, bTop + bh - 20, 'Reviewed by analysts · in git', 'ar-s');
        [-56, 0, 56].forEach(function (o) { E.push(curveH(x1 + b, bTop + bh / 2 + o, x2, bTop + bh / 2 + o * .6)); });
        s += node(x2, bTop, c, bh, 'ar-node ar-node--hi', 12) + t(x2 + 18, bTop + 38, 'Sightline', 'ar-t ar-t--hi');
        SL.forEach(function (r, i) { var y = bTop + 84 + i * 40; s += '<line class="ar-sub ar-sub--hi" x1="' + (x2 + 18) + '" x2="' + (x2 + c - 18) + '" y1="' + (y - 20) + '" y2="' + (y - 20) + '"/>' + t(x2 + 18, y + 4, r, 'ar-s ar-s--hi'); });
        OUT.forEach(function (r, i) {
          var y = oTop + i * (nh + gap);
          s += node(x3, y, dd, nh, 'ar-node') + t(x3 + 16, y + nh / 2 + 5, r[0], 'ar-t') + (dd >= 190 ? t(x3 + dd - 14, y + nh / 2 + 4, r[1], 'ar-s', 'end') : '');
          E.push(curveH(x2 + c, bTop + 80 + i * 34, x3, y + nh / 2));
        });
      } else {
        var cw = (W - 10) / 2, nh2 = 44, gp = 10, y0 = 30;
        s += t(0, 12, '01', 'ar-col ar-col-n') + t(24, 12, 'Sources', 'ar-col');
        var srcB = [];
        SRC.forEach(function (r, i) {
          var full = i === 4, x = full ? 0 : (i % 2) * (cw + 10), w = full ? W : cw, y = y0 + Math.floor(i / 2) * (nh2 + gp);
          s += node(x, y, w, nh2, 'ar-node', 9) + t(x + 14, y + nh2 / 2 + 5, r[0], 'ar-t') + (full ? t(x + w - 12, y + nh2 / 2 + 4, r[1], 'ar-s', 'end') : '');
          srcB.push([x + w / 2, y + nh2]);
        });
        var semY = y0 + 3 * (nh2 + gp) + 56, semH = 150;
        s += t(0, semY - 14, '02', 'ar-col ar-col-n') + t(24, semY - 14, 'Semantic layer', 'ar-col');
        srcB.forEach(function (p, i) { E.push(curveV(p[0], i === 4 ? p[1] : p[1], W * (.2 + i * .15), semY)); });
        s += node(0, semY, W, semH, 'ar-node', 12) + t(16, semY + 30, 'Semantic layer', 'ar-t ar-t--big');
        SEM.forEach(function (r, i) { var y = semY + 66 + i * 30; s += t(16, y, r[0], 'ar-s') + t(W - 16, y + 1, r[1], 'ar-t', 'end'); });
        var slY = semY + semH + 56, slH = 170;
        s += t(0, slY - 14, '03', 'ar-col ar-col-n') + t(24, slY - 14, 'Sightline', 'ar-col');
        [.3, .5, .7].forEach(function (f) { E.push(curveV(W * f, semY + semH, W * f, slY)); });
        s += node(0, slY, W, slH, 'ar-node ar-node--hi', 12) + t(16, slY + 34, 'Sightline', 'ar-t ar-t--hi');
        SL.forEach(function (r, i) { s += t(16, slY + 68 + i * 26, r, 'ar-s ar-s--hi'); });
        var oY = slY + slH + 56;
        s += t(0, oY - 14, '04', 'ar-col ar-col-n') + t(24, oY - 14, 'Answers go to', 'ar-col');
        OUT.forEach(function (r, i) {
          var x = (i % 2) * (cw + 10), y = oY + Math.floor(i / 2) * (nh2 + gp);
          s += node(x, y, cw, nh2, 'ar-node', 9) + t(x + 14, y + nh2 / 2 + 5, r[0], 'ar-t');
          E.push(curveV(W * (.25 + (i % 2) * .5 + (Math.floor(i / 2) - .5) * .12), slY + slH, x + cw / 2, y));
        });
        H = oY + 2 * nh2 + gp + 4;
      }
      var edges = E.map(function (p) { return '<path class="ar-edge" d="' + p + '"/>'; }).join('');
      host.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">' + edges + '<g class="ar-dots"></g>' + s + '</svg>';
      var dots = qs('.ar-dots', host); flows = [];
      qsa('.ar-edge', host).forEach(function (p, i) {
        var len = p.getTotalLength(), k = len > 200 ? 2 : 1;
        for (var j = 0; j < k; j++) {
          var glow = d.createElementNS(NS, 'circle'), c = d.createElementNS(NS, 'circle');
          glow.setAttribute('r', 7); glow.setAttribute('class', 'ar-dot'); glow.style.opacity = .16;
          c.setAttribute('r', 3); c.setAttribute('class', 'ar-dot');
          dots.appendChild(glow); dots.appendChild(c);
          flows.push({ p: p, len: len, ph: (i * .37 + j / k) % 1, c: c, g: glow, sp: 70 / len });
        }
      });
      tick(0);
    }
    var t0 = 0;
    function tick(time) {
      flows.forEach(function (f) {
        var u = (f.ph + time * f.sp) % 1, pt = f.p.getPointAtLength(u * f.len), a = Math.min(1, u * 8, (1 - u) * 8);
        f.c.setAttribute('cx', pt.x); f.c.setAttribute('cy', pt.y); f.g.setAttribute('cx', pt.x); f.g.setAttribute('cy', pt.y);
        f.c.style.opacity = a; f.g.style.opacity = a * .16;
      });
    }
    function loop() { tick((performance.now() - t0) / 1000); }
    build();
    t0 = performance.now();
    if (!RM) new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
      if (vis && !ticking) { gsap.ticker.add(loop); ticking = true; } else if (!vis && ticking) { gsap.ticker.remove(loop); ticking = false; }
    }).observe(host);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); ST.refresh(); }, 180); });
    if (!RM) gsap.from(host, { autoAlpha: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: host, start: 'top 85%', once: true } });
  }

  /* ═════════ small things ═════════ */
  function initFaq() {
    qsa('.acc__q').forEach(function (b) {
      b.addEventListener('click', function () {
        var it = b.closest('.acc__item'), open = !it.classList.contains('is-open');
        qsa('.acc__item.is-open').forEach(function (x) { if (x !== it) { x.classList.remove('is-open'); qs('.acc__q', x).setAttribute('aria-expanded', 'false'); } });
        it.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
        setTimeout(function () { ST.refresh(); }, 650);
      });
    });
  }
  function initRace() {
    var race = qs('.race'); if (!race || RM) return;
    var slow = qs('.race__bar--slow i'), fast = qs('.race__bar--fast i'), vals = qsa('.race__val');
    gsap.set([slow, fast], { scaleX: 0 });
    ST.create({ trigger: race, start: 'top 80%', once: true, onEnter: function () {
      var o = { v: 0 };
      gsap.to(fast, { scaleX: 1, duration: .3, ease: 'power2.out', delay: .15 });
      gsap.to(slow, { scaleX: 1, duration: 3.2, ease: 'power1.inOut' });
      gsap.to(o, { v: 3.2, duration: 3.2, ease: 'power1.inOut', onUpdate: function () { vals[0].textContent = o.v.toFixed(1) + ' days'; } });
      gsap.from(vals[1], { autoAlpha: 0, duration: .2, delay: .2 });
    } });
  }
  /* ═════════ BOOK PAGE ═════════ */
  function initBook() {
    var f = qs('#bookForm'); if (!f) return;
    var days = qs('#days'), slots = qs('#slots'), tzEl = qs('#tz');
    if (tzEl) tzEl.textContent = 'UTC';
    // next 5 business days
    var dt = new Date(), list = [];
    while (list.length < 5) { dt.setDate(dt.getDate() + 1); if (dt.getDay() % 6) list.push(new Date(dt)); }
    days.innerHTML = list.map(function (x, i) {
      var id = 'day' + i, v = x.toISOString().slice(0, 10);
      return '<label class="dchip" for="' + id + '"><input type="radio" name="day" id="' + id + '" value="' + v + '" required' + (i === 0 ? '' : '') + '>' +
        '<span><em>' + x.toLocaleDateString('en-GB', { weekday: 'short' }) + '</em><b>' + x.getDate() + '</b><i>' + x.toLocaleDateString('en-GB', { month: 'short' }) + '</i></span></label>';
    }).join('');
    var TIMES = ['09:00', '09:30', '11:00', '13:30', '15:00', '16:30'];
    var taken = {};
    function renderSlots(di) {
      slots.innerHTML = TIMES.map(function (t, i) {
        var off = (taken[di] || []).indexOf(t) > -1, id = 'slot' + i;
        return '<label class="tchip' + (off ? ' is-off' : '') + '" for="' + id + '"><input type="radio" name="time" id="' + id + '" value="' + t + '" required' + (off ? ' disabled' : '') + '><span>' + t + (off ? '<i>taken</i>' : '') + '</span></label>';
      }).join('');
      if (!RM) gsap.from(qsa('.tchip', slots), { y: 10, autoAlpha: 0, duration: .5, stagger: .04, ease: 'expo.out' });
    }
    renderSlots(0);
    qs('.slots-wrap').classList.add('is-wait');
    days.addEventListener('change', function (e) {
      var i = qsa('input', days).indexOf(e.target); renderSlots(i);
      qs('.slots-wrap').classList.remove('is-wait');
      clearInvalid(qs('#fsWhen'));
    });
    // measure chips append to the text box
    qsa('.mchip input').forEach(function (c) { c.addEventListener('change', function () { clearInvalid(qs('#fsMeasure')); }); });
    // validation styling
    function clearInvalid(fs) { if (fs) fs.classList.remove('is-invalid'); }
    f.addEventListener('invalid', function (e) {
      var fs = e.target.closest('fieldset, .field'); if (fs) fs.classList.add('is-invalid');
    }, true);
    qsa('input, textarea', f).forEach(function (i) {
      i.addEventListener('input', function () { var fs = i.closest('fieldset, .field'); if (fs && i.checkValidity()) fs.classList.remove('is-invalid'); });
      i.addEventListener('change', function () { var fs = i.closest('fieldset, .field'); if (fs) fs.classList.remove('is-invalid'); });
    });
    // "what to measure": at least one chip or text
    var mText = qs('#measure'), mChips = qsa('.mchip input');
    function syncMeasure() { mText.required = !mChips.some(function (c) { return c.checked; }); }
    mChips.forEach(function (c) { c.addEventListener('change', syncMeasure); }); syncMeasure();
    // capture phase: runs before core's handler, so invalid forms get inline errors instead of the browser bubble
    f.addEventListener('submit', function (e) {
      if (f.checkValidity()) return;
      e.preventDefault(); e.stopImmediatePropagation();
      var bad = qs('.is-invalid', f); if (!bad) return;
      var first = qs('input:invalid, textarea:invalid', bad);
      if (Core.lenis) Core.lenis.scrollTo(bad, { offset: -110, duration: 1 }); else bad.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (first && first.type !== 'radio' && first.type !== 'checkbox') setTimeout(function () { first.focus({ preventScroll: true }); }, 700);
    }, true);
    f.addEventListener('demo:sent', function () {
      var fd = new FormData(f), day = fd.get('day'), time = fd.get('time'), name = (fd.get('name') || '').toString().trim().split(' ')[0];
      var dd = new Date(day + 'T12:00:00');
      qs('#okName').textContent = name || 'there';
      qs('#okMon').textContent = dd.toLocaleDateString('en-GB', { month: 'short' });
      qs('#okDay').textContent = dd.getDate();
      qs('#okWd').textContent = dd.toLocaleDateString('en-GB', { weekday: 'long' });
      qs('#okWhen').textContent = dd.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + time + '–' + addMin(time, 30);
      qs('#okTz').textContent = tz;
      qs('#okEmail').textContent = fd.get('email');
      var topics = mChips.filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
      var txt = (fd.get('measure') || '').toString().trim();
      qs('#okTopics').textContent = topics.length ? topics.join(', ') : (txt.length > 60 ? txt.slice(0, 58) + '…' : txt);
      // .ics
      var start = day.replace(/-/g, '') + 'T' + time.replace(':', '') + '00', end = day.replace(/-/g, '') + 'T' + addMin(time, 30).replace(':', '') + '00';
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sightline//Walkthrough//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@sightline', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART:' + start, 'DTEND:' + end, 'SUMMARY:Sightline walkthrough (30 min)', 'DESCRIPTION:Bring two questions your dashboards cannot answer.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = qs('#okIcs'); a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
      var card = qs('.okcard');
      if (Core.lenis) Core.lenis.scrollTo(innerWidth > 899 ? 0 : qs('.ok'), { offset: -96, duration: 1.1 }); else scrollTo({ top: 0, behavior: 'smooth' });
      if (!RM) {
        gsap.timeline()
          .from(qsa('.ok > *'), { y: 30, autoAlpha: 0, duration: 1, stagger: .08, ease: 'expo.out' }, .1)
          .from(qs('.okcard__date'), { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, .25)
          .from(qsa('.okcard__date > *'), { yPercent: 60, autoAlpha: 0, duration: .9, stagger: .07, ease: 'expo.out' }, .6);
      }
    });
    function addMin(t, m) { var p = t.split(':'), x = +p[0] * 60 + +p[1] + m; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); }
  }

  /* ═════════ ready ═════════ */
  var heroField = null, ctaField = null;
  function fields() {
    var hc = qs('.hero__field');
    if (hc) heroField = Field(hc, {
      band: function (W, H) {
        var ti = qs('.hero__title'), app = qs('#app'), side = qs('.hero__side'), hint = qs('.hero__hint');
        var top = ti.offsetTop + ti.offsetHeight * .1, bot = W >= 1181 ? app.offsetTop - 30 : ti.offsetTop + ti.offsetHeight + 20;
        var k = [[side.offsetLeft, side.offsetTop, side.offsetWidth, side.offsetHeight]];
        if (hint && hint.offsetParent) { var tr = qs('.hero__try'); k.push([tr.offsetLeft, tr.offsetTop + hint.offsetTop - tr.offsetTop, hint.offsetWidth, hint.offsetHeight + 74]); }
        return { top: top, bot: Math.max(top + 90, bot), read: ti.offsetTop - 16, knock: k };
      },
      trend: function (x) { return .12 + .62 * x; },
      fmt: function (v, w) { return 'W' + w + ' · ' + Math.round(1400 + v * 2300).toLocaleString('en-US') + ' active teams'; }
    });
    var cc = qs('.cta__field');
    if (cc) ctaField = Field(cc, {
      dark: true, step: 22,
      band: function (W, H) { return { top: H * .24, bot: H * .52, read: H * .24 - 30 }; },
      trend: function (x) { return .2 + .55 * x; },
      fmt: function (v, w) { return 'W' + w + ' · ' + Math.round(6000 + v * 9000).toLocaleString('en-US') + ' questions answered'; }
    });
  }

  initApp();
  initBook();

  Core.onReady(function () {
    fields();
    if (qs('.hero')) {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero .hl > span', { yPercent: 118, duration: 1.5, stagger: .1 }, 0)
        .from('.hero__meta', { y: 14, autoAlpha: 0, duration: 1 }, .3)
        .from('.hero__side > *', { y: 24, autoAlpha: 0, duration: 1.1, stagger: .08 }, .45)
        .from('#app', { y: 90, autoAlpha: 0, duration: 1.6 }, .5)
        .from('.hero__try > *', { y: 20, autoAlpha: 0, duration: 1, stagger: .08 }, .85)
        .from('.hero__field', { autoAlpha: 0, duration: 2, ease: 'power2.out' }, .7)
        .from('.hdr', { autoAlpha: 0, duration: 1 }, .4);
      if (heroField) setTimeout(heroField.size, 50);
    }
    initHow();
    initReceipts();
    initArch();
    initFaq();
    initRace();
    var fl = qs('.foot__line');
    if (fl && !RM) gsap.fromTo(fl, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.foot__word', start: 'top 92%', once: true } });
    var top = qs('#toTop');
    if (top) top.addEventListener('click', function () { if (Core.lenis) Core.lenis.scrollTo(0, { duration: 2 }); else scrollTo({ top: 0, behavior: 'smooth' }); });
    if (qs('.book')) {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.book__aside .hl > span', { yPercent: 118, duration: 1.4, stagger: .08 }, 0)
        .from('.book__aside [data-in]', { y: 24, autoAlpha: 0, duration: 1, stagger: .07 }, .3)
        .from('.book__main [data-in]', { y: 30, autoAlpha: 0, duration: 1.1, stagger: .06 }, .35)
        .from('.hdr', { autoAlpha: 0, duration: 1 }, .3);
    }
    if (window.ScrollTrigger) setTimeout(function () { ST.refresh(); }, 400);
  });
})();
