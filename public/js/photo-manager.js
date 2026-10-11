/* ==========================================================================
   Arrive Photo Manager — drag & drop photo replacement (edit mode)
   Activate: visit any page with ?edit=1
   Every site photo (/assets/...) becomes a drop zone. Drop a new photo
   (or tap to choose one) to replace that exact file in the repo.
   Server commits to GitHub; Railway redeploys it live (~2 min).
   Requires server env: ADMIN_PASSWORD, GITHUB_TOKEN.
   ========================================================================== */
(function () {
  'use strict';

  var SESSION_KEY = 'arrive_pm_pw';

  /* ---------- injected styles ---------- */
  var css = [
    '#pm-banner{position:fixed;top:0;left:0;right:0;z-index:2147483000;background:#0a3f47;color:#f2fbf8;',
    'font:600 13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:10px 16px;',
    'display:flex;align-items:center;gap:12px;box-shadow:0 2px 12px rgba(0,0,0,.35)}',
    '#pm-banner .pm-dot{width:9px;height:9px;border-radius:50%;background:#ffd972;flex:none;animation:pm-pulse 1.6s infinite}',
    '@keyframes pm-pulse{0%,100%{opacity:1}50%{opacity:.35}}',
    '#pm-banner button{margin-left:auto;background:#f0b429;border:0;color:#04262b;font-weight:700;font-size:12px;',
    'padding:7px 14px;border-radius:999px;cursor:pointer;flex:none}',
    '.pm-zone{position:fixed;z-index:2147482000;border:2px dashed rgba(240,180,41,.0);border-radius:10px;',
    'cursor:pointer;transition:border-color .15s,background .15s;box-sizing:border-box}',
    '.pm-zone:hover{border-color:rgba(240,180,41,.9);background:rgba(240,180,41,.08)}',
    '.pm-zone.pm-over{border-color:#ffd972;background:rgba(240,180,41,.22);border-style:solid}',
    '.pm-zone .pm-tag{position:absolute;top:6px;left:6px;background:rgba(4,38,43,.92);color:#ffd972;',
    'font:700 10px/1 -apple-system,sans-serif;letter-spacing:.08em;text-transform:uppercase;',
    'padding:6px 9px;border-radius:999px;opacity:0;transition:opacity .15s;pointer-events:none;white-space:nowrap}',
    '.pm-zone:hover .pm-tag,.pm-zone.pm-over .pm-tag{opacity:1}',
    '.pm-zone.pm-over .pm-tag{background:#f0b429;color:#04262b}',
    '#pm-modal{position:fixed;inset:0;z-index:2147483001;background:rgba(2,20,23,.78);display:flex;',
    'align-items:center;justify-content:center;padding:20px;box-sizing:border-box}',
    '#pm-modal .pm-card{background:#fff;border-radius:16px;max-width:640px;width:100%;padding:22px;box-sizing:border-box;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#1c1917}',
    '#pm-modal h3{margin:0 0 4px;font-size:18px}',
    '#pm-modal .pm-sub{margin:0 0 14px;font-size:13px;color:#57534e}',
    '#pm-modal .pm-cols{display:flex;gap:12px;margin-bottom:14px}',
    '#pm-modal .pm-col{flex:1;min-width:0}',
    '#pm-modal .pm-col p{margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#78716c}',
    '#pm-modal .pm-col img{width:100%;height:180px;object-fit:cover;border-radius:10px;border:1px solid #e7e5e4;display:block}',
    '#pm-modal .pm-meta{font-size:12px;color:#57534e;margin:0 0 16px;word-break:break-all}',
    '#pm-modal .pm-row{display:flex;gap:10px;justify-content:flex-end}',
    '#pm-modal .pm-row button{font-size:14px;font-weight:700;padding:10px 18px;border-radius:999px;cursor:pointer;border:0}',
    '#pm-modal .pm-cancel{background:#f5f5f4;color:#44403c}',
    '#pm-modal .pm-go{background:#0a3f47;color:#fff}',
    '#pm-modal .pm-go:disabled{opacity:.5;cursor:wait}',
    '#pm-modal .pm-err{color:#b91c1c;font-size:13px;margin:0 0 12px;display:none}',
    '#pm-modal input[type=password]{width:100%;box-sizing:border-box;font-size:16px;padding:11px 14px;margin:0 0 14px;',
    'border:1.5px solid #d6d3d1;border-radius:10px}',
    '#pm-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);z-index:2147483002;',
    'background:#04262b;color:#f2fbf8;font:600 14px -apple-system,sans-serif;padding:13px 22px;border-radius:999px;',
    'box-shadow:0 4px 20px rgba(0,0,0,.4);opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;',
    'max-width:90vw;text-align:center}',
    '#pm-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}',
    '@media(max-width:560px){#pm-modal .pm-cols{flex-direction:column}#pm-modal .pm-col img{height:140px}}',
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var password = sessionStorage.getItem(SESSION_KEY) || '';

  /* ---------- helpers ---------- */
  function toast(msg) {
    var t = document.getElementById('pm-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'pm-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('show'); }, 4200);
  }

  function closeModal() {
    var m = document.getElementById('pm-modal');
    if (m) m.remove();
  }

  function api(path, body) {
    return fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (r) { return r.json(); });
  }

  /* ---------- password gate ---------- */
  function askPassword() {
    closeModal();
    var m = document.createElement('div');
    m.id = 'pm-modal';
    m.innerHTML =
      '<div class="pm-card"><h3>📷 Photo edit mode</h3>' +
      '<p class="pm-sub">Enter the photo-manager password to replace site photos.</p>' +
      '<p class="pm-err" id="pm-pw-err"></p>' +
      '<input type="password" id="pm-pw" placeholder="Password" autocomplete="off" />' +
      '<div class="pm-row"><button class="pm-cancel" id="pm-pw-cancel">Cancel</button>' +
      '<button class="pm-go" id="pm-pw-go">Unlock</button></div></div>';
    document.body.appendChild(m);
    var input = document.getElementById('pm-pw');
    var err = document.getElementById('pm-pw-err');
    input.focus();
    function fail(msg) {
      err.textContent = msg;
      err.style.display = 'block';
    }
    document.getElementById('pm-pw-cancel').onclick = function () {
      closeModal();
      exitEdit();
    };
    function submit() {
      var pw = input.value;
      if (!pw) return fail('Please enter the password.');
      api('/api/admin/verify', { password: pw }).then(function (d) {
        if (!d.configured) return fail('Photo manager is not set up on the server yet (missing ADMIN_PASSWORD).');
        if (!d.ok) return fail('Wrong password. Try again.');
        password = pw;
        sessionStorage.setItem(SESSION_KEY, pw);
        closeModal();
        enterEdit();
      }).catch(function () { fail('Could not reach the server.'); });
    }
    document.getElementById('pm-pw-go').onclick = submit;
    input.onkeydown = function (e) { if (e.key === 'Enter') submit(); };
  }

  function exitEdit() {
    var u = new URL(location.href);
    u.searchParams.delete('edit');
    location.href = u.toString();
  }

  /* ---------- edit mode ---------- */
  var zones = [];

  function sitePath(src) {
    try {
      var u = new URL(src, location.origin);
      return u.pathname;
    } catch (e) { return null; }
  }

  function enterEdit() {
    // top banner
    var b = document.createElement('div');
    b.id = 'pm-banner';
    b.innerHTML = '<span class="pm-dot"></span><span><b>Photo edit mode</b> — drop a photo onto any picture (or tap one) to replace it.</span><button id="pm-exit">Done</button>';
    document.body.appendChild(b);
    document.getElementById('pm-exit').onclick = exitEdit;
    document.body.style.paddingTop = '42px';

    // drop zones over every site photo
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img'));
    imgs.forEach(function (img) {
      var p = sitePath(img.currentSrc || img.src);
      if (!p || p.indexOf('/assets/') !== 0) return;
      if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(p)) return;
      var r = img.getBoundingClientRect();
      if (r.width < 60 || r.height < 60) return; // skip icons
      makeZone(img, p);
    });
    if (!zones.length) toast('No replaceable photos found on this page.');
  }

  function makeZone(img, path) {
    var z = document.createElement('div');
    z.className = 'pm-zone';
    z.innerHTML = '<span class="pm-tag">Drop photo to replace</span>';
    document.body.appendChild(z);

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    fileInput.addEventListener('change', function () {
      if (fileInput.files[0]) previewReplace(img, path, fileInput.files[0]);
      fileInput.value = '';
    });

    function place() {
      var r = img.getBoundingClientRect();
      z.style.left = r.left + 'px';
      z.style.top = r.top + 'px';
      z.style.width = r.width + 'px';
      z.style.height = r.height + 'px';
      z.style.display = (r.width < 60 || r.height < 60) ? 'none' : 'block';
    }
    place();

    z.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); });
    z.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    z.addEventListener('dblclick', function (e) { e.stopPropagation(); e.preventDefault(); fileInput.click(); });
    // single tap also opens picker (mobile); desktop uses drag-drop
    var tapTimer = null;
    z.addEventListener('click', function () {
      clearTimeout(tapTimer);
      tapTimer = setTimeout(function () { fileInput.click(); }, 220);
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      z.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); z.classList.add('pm-over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      z.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); z.classList.remove('pm-over'); });
    });
    z.addEventListener('drop', function (e) {
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) previewReplace(img, path, f);
    });

    zones.push({ zone: z, place: place });
  }

  window.addEventListener('scroll', function () {
    zones.forEach(function (z) { z.place(); });
  }, { passive: true });
  window.addEventListener('resize', function () {
    zones.forEach(function (z) { z.place(); });
  });

  /* ---------- preview + upload ---------- */
  function previewReplace(img, targetPath, file) {
    closeModal();
    var url = URL.createObjectURL(file);
    var m = document.createElement('div');
    m.id = 'pm-modal';
    m.innerHTML =
      '<div class="pm-card"><h3>Replace this photo?</h3>' +
      '<p class="pm-sub">The new photo takes this exact spot everywhere it appears.</p>' +
      '<div class="pm-cols"><div class="pm-col"><p>Current</p><img id="pm-before" /></div>' +
      '<div class="pm-col"><p>New</p><img id="pm-after" /></div></div>' +
      '<p class="pm-meta">' + escapeHtml(file.name) + ' — ' + (file.size / 1048576).toFixed(1) + ' MB</p>' +
      '<p class="pm-err" id="pm-up-err"></p>' +
      '<div class="pm-row"><button class="pm-cancel" id="pm-up-cancel">Cancel</button>' +
      '<button class="pm-go" id="pm-up-go">Replace photo</button></div></div>';
    document.body.appendChild(m);
    document.getElementById('pm-before').src = img.currentSrc || img.src;
    document.getElementById('pm-after').src = url;

    document.getElementById('pm-up-cancel').onclick = function () {
      URL.revokeObjectURL(url);
      closeModal();
    };
    document.getElementById('pm-up-go').onclick = function () {
      var btn = document.getElementById('pm-up-go');
      var err = document.getElementById('pm-up-err');
      btn.disabled = true;
      btn.textContent = 'Uploading…';
      var reader = new FileReader();
      reader.onload = function () {
        api('/api/admin/upload-photo', {
          password: password,
          targetPath: 'public' + targetPath,
          dataUrl: reader.result,
        }).then(function (d) {
          if (!d.ok) throw new Error(d.error || 'Upload failed.');
          URL.revokeObjectURL(url);
          closeModal();
          // show the new photo immediately (cache-busted)
          var fresh = (img.currentSrc || img.src).split('?')[0] + '?v=' + Date.now();
          img.src = fresh;
          if (img.srcset) img.removeAttribute('srcset');
          toast('✅ Photo updated! Live for everyone in ~2 minutes.');
        }).catch(function (e) {
          err.textContent = e.message;
          err.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Replace photo';
        });
      };
      reader.onerror = function () {
        err.textContent = 'Could not read that file.';
        err.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Replace photo';
      };
      reader.readAsDataURL(file);
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- boot ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  function init() {
    if (password) {
      api('/api/admin/verify', { password: password }).then(function (d) {
        if (d.ok) enterEdit();
        else { sessionStorage.removeItem(SESSION_KEY); password = ''; askPassword(); }
      }).catch(askPassword);
    } else {
      askPassword();
    }
  }
})();
