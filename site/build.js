#!/usr/bin/env node
// Static site builder for the project tracker.
//
// Reads README.md, RUNNER.md, and projects/*.md from the repo root,
// converts each to HTML, bundles them into one JSON manifest, and
// encrypts that manifest (AES-256-GCM, key derived via PBKDF2 from
// TRACKER_PASSWORD) into site/dist/data.js. The rest of site/public/
// is copied into site/dist/ as-is.
//
// No npm dependencies — everything here is Node's standard library,
// so `npm run build` needs no `npm install` step first.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(__dirname, 'public');
const DIST_DIR = join(__dirname, 'dist');
const ITERATIONS = 250000; // must match site/public/app.js

// ---------------------------------------------------------------------------
// Minimal Markdown -> HTML converter, covering exactly the subset used by
// this repo's docs: headings, bold/italic, inline code, links, ordered and
// unordered lists (incl. `- [ ]` checkboxes), tables, and paragraphs.

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return html;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let out = '';
  let i = 0;
  let title = null;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // Heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      if (level === 1 && !title) title = text.replace(/`/g, '');
      out += `<h${level}>${inline(text)}</h${level}>\n`;
      i++;
      continue;
    }

    // Table
    if (/^\|/.test(line.trim())) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        rows.push(lines[i].trim());
        i++;
      }
      const cellsOf = (row) => row.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const header = cellsOf(rows[0]);
      const bodyRows = rows.slice(2); // skip header + separator row
      out += '<div class="table-wrap"><table><thead><tr>';
      out += header.map((c) => `<th>${inline(c)}</th>`).join('');
      out += '</tr></thead><tbody>';
      for (const r of bodyRows) {
        out += '<tr>' + cellsOf(r).map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>';
      }
      out += '</tbody></table></div>\n';
      continue;
    }

    // List (ordered or unordered, incl. checkboxes)
    const ulItem = /^-\s+(.*)$/;
    const olItem = /^\d+\.\s+(.*)$/;
    if (ulItem.test(line) || olItem.test(line)) {
      const ordered = olItem.test(line);
      const itemRe = ordered ? olItem : ulItem;
      const items = [];
      while (i < lines.length && itemRe.test(lines[i])) {
        items.push(itemRe.exec(lines[i])[1]);
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out += `<${tag}>\n`;
      for (const item of items) {
        const cb = /^\[( |x|X)\]\s+(.*)$/.exec(item);
        if (cb) {
          const checked = cb[1].toLowerCase() === 'x';
          out += `<li class="task"><input type="checkbox" disabled ${checked ? 'checked' : ''}/> ${inline(cb[2])}</li>\n`;
        } else {
          out += `<li>${inline(item)}</li>\n`;
        }
      }
      out += `</${tag}>\n`;
      continue;
    }

    // Blockquote-style "> " not used in this repo's docs — skip handling.

    // Paragraph: consume until blank line or next block marker
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^\|/.test(lines[i].trim()) &&
      !ulItem.test(lines[i]) &&
      !olItem.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out += `<p>${inline(para.join(' '))}</p>\n`;
  }

  return { html: out, title: title || 'Untitled' };
}

// ---------------------------------------------------------------------------

function loadDoc(path) {
  const raw = readFileSync(path, 'utf8');
  return mdToHtml(raw);
}

// Cross-references between these docs use relative markdown paths (e.g.
// "acf-ldev.md" from inside projects/ana-borges.md, or "projects/acf-ldev.md"
// from README.md/RUNNER.md). Those paths don't exist on the deployed site,
// so rewrite them to the app's hash routes. External (http/https) links and
// anything that doesn't match a known doc are left untouched.
function rewriteLocalLinks(html, fromDir) {
  return html.replace(/href="([^"]+)"/g, (match, href) => {
    if (/^https?:\/\//.test(href) || href.startsWith('#')) return match;

    // Resolve to a repo-root-relative path.
    let resolved = href;
    if (fromDir === 'projects' && !href.includes('/')) {
      resolved = `projects/${href}`;
    }

    if (resolved === 'README.md') return 'href="#/"';
    if (resolved === 'RUNNER.md') return 'href="#/runner"';
    const m = /^projects\/([\w-]+)\.md$/.exec(resolved);
    if (m) return `href="#/project/${m[1]}"`;

    return match;
  });
}

function buildManifest() {
  const readme = loadDoc(join(REPO_ROOT, 'README.md'));
  const runner = loadDoc(join(REPO_ROOT, 'RUNNER.md'));

  const projectsDir = join(REPO_ROOT, 'projects');
  const projectFiles = readdirSync(projectsDir).filter((f) => f.endsWith('.md')).sort();
  const projects = projectFiles.map((f) => {
    const slug = basename(f, '.md');
    const { html, title } = loadDoc(join(projectsDir, f));
    return { slug, title, html: rewriteLocalLinks(html, 'projects') };
  });

  return {
    readme: { title: readme.title, html: rewriteLocalLinks(readme.html, 'root') },
    runner: { title: runner.title, html: rewriteLocalLinks(runner.html, 'root') },
    projects,
    generatedAt: new Date().toISOString(),
  };
}

function encrypt(json, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([encrypted, authTag]);
  return {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    payload: payload.toString('base64'),
    iterations: ITERATIONS,
  };
}

function copyPublicDir() {
  for (const entry of readdirSync(PUBLIC_DIR)) {
    copyFileSync(join(PUBLIC_DIR, entry), join(DIST_DIR, entry));
  }
}

function main() {
  const password = process.env.TRACKER_PASSWORD;
  if (!password || password.length < 8) {
    console.error(
      'ERROR: set TRACKER_PASSWORD (8+ chars) as an environment variable before building.\n' +
      'This is the password visitors will need to view the deployed site.\n' +
      'See site/README.md for how to set it on your host.'
    );
    process.exit(1);
  }

  if (existsSync(DIST_DIR)) rmSync(DIST_DIR, { recursive: true, force: true });
  mkdirSync(DIST_DIR, { recursive: true });

  const manifest = buildManifest();
  const encrypted = encrypt(JSON.stringify(manifest), password);

  writeFileSync(
    join(DIST_DIR, 'data.js'),
    `window.__TRACKER_DATA__ = ${JSON.stringify(encrypted, null, 2)};\n`
  );

  copyPublicDir();

  console.log(`Built ${1 + 1 + manifest.projects.length} docs into ${DIST_DIR}`);
}

main();
