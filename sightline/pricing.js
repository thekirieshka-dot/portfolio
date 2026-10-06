/* ───────── Sightline — pricing.js ───────── */
(function () {
  'use strict';
  var S = window.SLP, qs = S.qs, qsa = S.qsa, gsap = S.gsap, ST = S.ST, RM = S.RM;
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var num = function (n) { return Math.round(n).toLocaleString('en-US'); };

  var annual = false;
  var BASE = 890, INC_Q = 5000, INC_S = 10, SEAT = 45, R1 = .12, R2 = .07, T2 = 25000;

  function tweenText(el, from, to, fmt, dur) {
    if (RM) { el.textContent = fmt(to); return; }
    var o = { v: from };
    gsap.to(o, { v: to, duration: dur || .5, ease: 'power3.out', overwrite: 'auto', onUpdate: function () { el.textContent = fmt(o.v); } });
  }

  /* ───── billing toggle + plan price ───── */
  function initBill() {
    var box = qs('.bill'), btns = qsa('.bill__b'), p = qs('#pWork'), note = qs('#pWorkNote');
    if (!box) return;
    box.dataset.bill = 'm';
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.dataset.bill === 'a'; if (a === annual) return;
        annual = a; box.dataset.bill = a ? 'a' : 'm';
        btns.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
        tweenText(p, a ? 890 : 742, a ? 742 : 890, money, .7);
        note.textContent = a ? 'per month, billed annually ($8,900 a year)' : 'per month, billed monthly';
        render(true);
      });
    });
  }

  /* ───── calculator ───── */
  var rq, rs, oq, os, ledger, mix, totEl, tAnn, tPer, tK, cMsg, cFit, prevTot = 890;
  var COL = { base: '#6b6e72', seat: '#a9abae', q1: '#8dbd1e', q2: '#c8f34b', view: '#3a3c40' };
  function qOf(v) {
    var q = 100 * Math.pow(10, 3 * v / 1000);
    return q < 1000 ? Math.round(q / 10) * 10 : q < 10000 ? Math.round(q / 100) * 100 : Math.round(q / 500) * 500;
  }
  function price(q, s) {
    var xs = Math.max(0, s - INC_S), t1 = Math.max(0, Math.min(q, T2) - INC_Q), t2 = Math.max(0, q - T2);
    return { xs: xs, t1: t1, t2: t2, base: BASE, seat: xs * SEAT, c1: t1 * R1, c2: t2 * R2, total: BASE + xs * SEAT + t1 * R1 + t2 * R2 };
  }
  function render(fromToggle) {
    var q = qOf(+rq.value), s = +rs.value, p = price(q, s);
    oq.textContent = num(q); os.textContent = String(s);
    rq.parentNode.style.setProperty('--p', (rq.value / 1000).toFixed(4));
    rs.parentNode.style.setProperty('--p', ((s - 1) / 119).toFixed(4));
    rq.setAttribute('aria-valuetext', num(q) + ' questions a month'); rs.setAttribute('aria-valuetext', s + ' asking seats');

    var rows = [
      ['Workspace fee', COL.base, '10 askers · 5,000 questions', p.base, false],
      ['Extra asking seats', COL.seat, p.xs + ' × $45', p.seat, p.xs === 0],
      ['Questions 5,001 – 25,000', COL.q1, num(p.t1) + ' × $0.12', p.c1, p.t1 === 0],
      ['Questions over 25,000', COL.q2, num(p.t2) + ' × $0.07', p.c2, p.t2 === 0],
      ['Viewers', COL.view, 'unlimited × $0', 0, true]
    ];
    ledger.innerHTML = rows.map(function (r) {
      return '<div class="ledger__r' + (r[4] ? ' is-zero' : '') + '"><span><i style="--c:' + r[1] + '"></i>' + r[0] + '</span><em>' + r[2] + '</em><b>' + money(r[3]) + '</b></div>';
    }).join('');
    mix.innerHTML = [[p.base, COL.base], [p.seat, COL.seat], [p.c1, COL.q1], [p.c2, COL.q2]].map(function (m) {
      return '<i style="--c:' + m[1] + ';flex:' + (m[0] > 0 ? m[0].toFixed(1) : 0) + ' 0 0"></i>';
    }).join('');

    var mon = p.total, ann = p.total * 10 / 12, shown = annual ? ann : mon;
    tweenText(totEl, prevTot, shown, money, .5); prevTot = shown;
    tK.textContent = annual ? 'Estimated, billed annually' : 'Estimated, billed monthly';
    tAnn.parentNode.querySelector('dt').textContent = annual ? 'Billed monthly' : 'Billed annually';
    tAnn.textContent = annual ? money(mon) + ' / month' : money(ann) + ' / month';
    tPer.textContent = '$' + (shown / q).toFixed(shown / q < 1 ? 2 : 2);

    var fit = 'Workspace', msg, warn = false;
    if (q <= 300 && s <= 3) { fit = 'Sandbox'; msg = 'The free Sandbox covers this: up to 3 askers and 300 questions. The figure above is the Workspace price you would pay past that.'; }
    else if (mon > 4500 || q > 50000 || s > 80) { fit = 'Enterprise'; warn = true; msg = 'At this size a committed-volume Enterprise contract usually works out lower. Worth a conversation before you pay list.'; }
    else if (p.xs === 0 && p.t1 === 0) msg = 'Inside the allowance. Nothing extra to pay.';
    else msg = (p.t1 + p.t2 > 0 ? num(p.t1 + p.t2) + ' questions' : '') + (p.t1 + p.t2 > 0 && p.xs > 0 ? ' and ' : '') + (p.xs > 0 ? p.xs + ' seat' + (p.xs > 1 ? 's' : '') : '') + ' past the allowance. Overage is billed monthly, in arrears.';
    qs('b', cFit).textContent = fit; cMsg.textContent = msg; cMsg.classList.toggle('is-warn', warn);
  }
  function initCalc() {
    rq = qs('#rq'); if (!rq) return;
    rs = qs('#rs'); oq = qs('#oq'); os = qs('#os'); ledger = qs('#ledger'); mix = qs('#mix'); totEl = qs('#tot');
    tAnn = qs('#tAnn'); tPer = qs('#tPer'); tK = qs('#tK'); cMsg = qs('#cMsg'); cFit = qs('#cFit');
    rq.value = 566; prevTot = 890;
    ['input', 'change'].forEach(function (ev) { rq.addEventListener(ev, function () { render(); }); rs.addEventListener(ev, function () { render(); }); });
    render();
  }

  /* ───── annual months ───── */
  function initMonths() {
    var m = qs('#months'); if (!m || RM) return;
    var bars = qsa('i', m);
    gsap.set(bars, { scaleY: 0 });
    ST.create({ trigger: m, start: 'top 82%', once: true, onEnter: function () {
      gsap.to(bars, { scaleY: 1, duration: .9, ease: 'expo.out', stagger: .07 });
      gsap.fromTo(qsa('.is-free', m), { opacity: .2 }, { opacity: 1, duration: .5, repeat: 3, yoyo: true, ease: 'power1.inOut', delay: 1.2 });
    } });
  }

  Core.onReady(function () {
    initBill(); initCalc(); initMonths();
    setTimeout(function () { ST.refresh(); }, 400);
  });
})();
