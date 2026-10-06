/* Runs in <head> before first paint: marks JS, and pre-covers the page when arriving through a page transition. */
(function (d) {
  var r = d.documentElement;
  r.classList.add('js');
  try {
    var t = sessionStorage.getItem('core:t');
    if (t) {
      t = JSON.parse(t);
      if (Date.now() - t.at < 8000) {
        r.classList.add('veil-on');
        r.style.setProperty('--veil', t.bg || '#0d0d0d');
        r.style.setProperty('--veil-ink', t.ink || '#fff');
      } else sessionStorage.removeItem('core:t');
    }
  } catch (e) {}
  setTimeout(function () { r.classList.add('reveal-fallback'); }, 7000);
})(document);
