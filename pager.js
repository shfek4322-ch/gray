(function () {
  var ids = ['front', 'secret', 'marcus', 'elliot', 'tyler', 'wesley'];
  var pages = ids.map(function (id) { return document.getElementById(id); });
  var tabs = Array.prototype.slice.call(document.querySelectorAll('#tabs a'));
  var count = document.getElementById('count');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var cur = 0;

  function show(i, push) {
    if (i < 0 || i >= ids.length) return;
    cur = i;
    pages.forEach(function (p, k) { p.classList.toggle('on', k === i); });
    tabs.forEach(function (t, k) { t.classList.toggle('cur', k === i); });
    count.textContent = (i + 1) + ' / ' + ids.length;
    prev.disabled = i === 0;
    next.disabled = i === ids.length - 1;
    var tab = tabs[i];
    if (tab && tab.scrollIntoView) tab.scrollIntoView({ block: 'nearest', inline: 'center' });
    window.scrollTo(0, 0);
    if (push) {
      try { history.replaceState(null, '', '#' + ids[i]); } catch (e) { location.hash = ids[i]; }
    }
  }

  function fromHash() {
    var i = ids.indexOf(location.hash.replace('#', ''));
    return i < 0 ? 0 : i;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var i = ids.indexOf(a.getAttribute('href').slice(1));
    if (i >= 0) { e.preventDefault(); show(i, true); }
  });
  prev.addEventListener('click', function () { show(cur - 1, true); });
  next.addEventListener('click', function () { show(cur + 1, true); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(cur - 1, true);
    if (e.key === 'ArrowRight') show(cur + 1, true);
  });
  window.addEventListener('hashchange', function () { show(fromHash(), false); });

  var sx = 0, sy = 0;
  document.addEventListener('touchstart', function (e) {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) show(cur + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  show(fromHash(), false);
})();
