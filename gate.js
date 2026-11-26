/* Trust gate for the teaching site: only lessons done with the teacher are free.
   Content is in a public Pages repo, so this is a convenience gate, not a secret. */
(function () {
  var C = window.BE_STUDENT || {}, G = window.BE_GRANTS || [];
  var path = location.pathname.split('/').pop() || '';
  var slug = path.replace(/\.html$/, '');
  if (!slug || slug === 'index') return;

  function valid(g, sig) {
    return G.some(function (x) { return x.slug === g && x.sig === sig; });
  }
  function remember(g, sig) { try { localStorage.setItem('be-free-' + g, sig); } catch (e) {} }
  function unlocked(g) {
    try { var s = localStorage.getItem('be-free-' + g); return !!s && valid(g, s); }
    catch (e) { return false; }
  }

  var q = new URLSearchParams(location.search);
  var g = q.get('grant'), sig = q.get('sig');
  if (g && sig && g === slug && valid(g, sig)) {
    remember(g, sig);
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    return;
  }
  if (unlocked(slug)) return;
  if (document.getElementById('be-gate')) return;

  var b = C.bankDetails || {};
  var over = document.createElement('div');
  over.id = 'be-gate';
  over.setAttribute('role', 'dialog');
  over.setAttribute('aria-modal', 'true');
  over.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(4,8,20,.97);' +
    'display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto';
  over.innerHTML =
    '<div style="max-width:640px;background:#151d33;border:1px solid #2b3a5c;' +
    'border-radius:16px;padding:28px;color:#e2e8f0;font:400 17px/1.65 system-ui,sans-serif">' +
    '<h2 style="margin-top:0;color:#22d3ee">This lesson is part of the series</h2>' +
    '<p>This lesson belongs to the teacher-led series and is available to you. ' +
    'Other lessons in the series are paid.</p>' +
    '<p><a id="be-paypal" class="btn primary" style="background:#22d3ee;color:#06202a;' +
    'padding:11px 16px;border-radius:9px;font-weight:700;text-decoration:none" ' +
    'href="#" target="_blank" rel="noopener">Pay $24 with PayPal</a></p>' +
    '<p style="font-size:.92rem;opacity:.9">Or bank transfer (Wise EUR):<br>' +
    'IBAN <code>' + (b.iban || '—') + '</code><br>SWIFT <code>' + (b.swift || '—') + '</code><br>' +
    'Reference <code>' + (b.reference || '—') + '</code></p>' +
    '<p style="font-size:.92rem;opacity:.9">Already paid? Paste your lesson access link below.</p>' +
    '<input id="be-link" placeholder="https://…/?grant=lesson-slug&amp;sig=…" ' +
    'style="width:100%;padding:10px;border-radius:8px;border:1px solid #2b3a5c;' +
    'background:#0b1020;color:#e2e8f0">' +
    '<p id="be-msg" style="color:#fbbf24"></p>' +
    '<p style="font-size:.9rem"><a href="index.html" style="color:#22d3ee">← All lessons</a></p>' +
    '</div>';
  document.body.appendChild(over);

  var pp = document.getElementById('be-paypal');
  if (pp) {
    var u = C.paypalUrl && C.paypalLink ? C.paypalLink(24, 'USD') : '';
    if (u) pp.href = u;
    else { pp.hidden = true; }
  }
  document.getElementById('be-link').addEventListener('change', function (e) {
    try {
      var u = new URL(e.target.value.trim(), location.origin);
      var gg = u.searchParams.get('grant'), ss = u.searchParams.get('sig');
      if (gg && ss && gg === slug && valid(gg, ss)) { remember(gg, ss); location.reload(); }
      else document.getElementById('be-msg').textContent = 'That link does not unlock this lesson.';
    } catch (err) {
      document.getElementById('be-msg').textContent = 'Paste a full access link.';
    }
  });
})();
