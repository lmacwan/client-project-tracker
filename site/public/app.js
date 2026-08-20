// Runtime: prompts for a password, derives an AES-256-GCM key from it via
// PBKDF2 (same params build.js used to encrypt), decrypts window.__TRACKER_DATA__,
// then renders the resulting manifest as a small client-side-routed app.
// No network requests — everything needed is already in data.js.

(function () {
  let manifest = null; // set once successfully decrypted

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function tryDecrypt(password) {
    const d = window.__TRACKER_DATA__;
    const salt = b64ToBytes(d.salt);
    const iv = b64ToBytes(d.iv);
    const payload = b64ToBytes(d.payload);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: d.iterations, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    // payload is ciphertext + 16-byte GCM auth tag appended, which is what
    // SubtleCrypto's AES-GCM decrypt expects as a single buffer.
    const plaintextBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, payload);
    return JSON.parse(new TextDecoder().decode(plaintextBuf));
  }

  function navItems() {
    const items = [{ href: '#/', label: manifest.readme.title || 'Dashboard' }];
    items.push({ href: '#/runner', label: manifest.runner.title || 'Runner' });
    return items;
  }

  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    const current = location.hash || '#/';
    let html = '<h2>Overview</h2>';
    for (const item of navItems()) {
      html += `<a href="${item.href}" class="${current === item.href ? 'active' : ''}">${item.label}</a>`;
    }
    html += '<h2>Projects</h2>';
    for (const p of manifest.projects) {
      const href = `#/project/${p.slug}`;
      html += `<a href="${href}" class="${current === href ? 'active' : ''}">${p.title}</a>`;
    }
    sidebar.innerHTML = html;
    sidebar.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    });
  }

  function renderContent() {
    const content = document.getElementById('content');
    const hash = location.hash || '#/';
    let html;

    if (hash === '#/runner') {
      html = manifest.runner.html;
    } else if (hash.startsWith('#/project/')) {
      const slug = hash.slice('#/project/'.length);
      const project = manifest.projects.find((p) => p.slug === slug);
      html = project ? project.html : '<p>Not found.</p>';
    } else {
      html = manifest.readme.html;
    }

    const generated = new Date(manifest.generatedAt).toLocaleString();
    content.innerHTML = html + `<p class="generated-at">Built from the tracker repo at ${generated}.</p>`;
    window.scrollTo(0, 0);
  }

  function render() {
    renderSidebar();
    renderContent();
  }

  function showApp() {
    document.getElementById('gate').remove();
    document.getElementById('app').hidden = false;
    render();
    window.addEventListener('hashchange', render);
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  document.getElementById('gate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('gate-password').value;
    const errorEl = document.getElementById('gate-error');
    errorEl.hidden = true;
    try {
      manifest = await tryDecrypt(password);
      showApp();
    } catch (err) {
      errorEl.hidden = false;
    }
  });
})();
