/* site.js — what every page shares: the top menu and the artifact card.
 *
 * Each page identifies itself with two attributes on its <nav>:
 *   data-base   ".." if the page lives in pages/, "." if it lives at the root
 *   data-page   the menu item that gets marked as current
 */

/* The home page is the about page, and the menu calls it that. The bar carries no
   wordmark: it is navigation only, and every item names a page. */
const MENU = [
  { file: 'index.html',           label: 'about',     key: 'home' },
  { file: 'pages/artifacts.html', label: 'artifacts', key: 'artifacts' },
  { file: 'pages/writing.html',   label: 'writing',   key: 'writing' }
];

/* A project carries one or more tags, and three carry two. The old single category could
   be printed straight onto the card; a list has to be joined, and is allowed to wrap.
   TAGS is read inside the function, not at load: index.html and writing.html pull in
   site.js for the menu alone, without projects.js. */
const tagLabels = w => w.tags.map(id => TAGS.find(t => t.id === id).label);
const stateLabel = w => w.active ? 'in progress' : 'paused';

/* ---------------- menu ---------------- */
function buildMenu() {
  const nav = document.querySelector('[data-base]');
  if (!nav) return;
  const base = nav.dataset.base;
  const current = nav.dataset.page || '';

  const list = document.createElement('div');
  list.className = 'menu';

  MENU.forEach(m => {
    const a = document.createElement('a');
    a.href = base + '/' + m.file;
    a.textContent = m.label;
    if (m.key === current) a.setAttribute('aria-current', 'page');
    list.appendChild(a);
  });

  nav.appendChild(list);
}

/* ---------------- card ---------------- */
/* image first, then the small uppercase line, then the title */
function card(w, base) {
  const article = document.createElement('article');
  article.className = 'card';
  article.dataset.tags = w.tags.join(' ');
  article.dataset.active = String(w.active);

  const a = document.createElement('a');
  a.href = base + '/pages/artifact.html?id=' + encodeURIComponent(w.id);

  const img = document.createElement('img');
  img.className = 'card-media';
  img.loading = 'lazy';
  img.src = base + '/images/shots/' + w.id + '.jpg';
  img.alt = 'Screen from ' + w.name;

  const label = document.createElement('div');
  label.className = 'card-label';
  label.textContent = tagLabels(w).concat(stateLabel(w)).join(' · ');

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = w.name;

  const desc = document.createElement('div');
  desc.className = 'card-desc';
  desc.textContent = w.what;

  a.append(img, label, title, desc);
  article.appendChild(a);
  return article;
}

document.addEventListener('DOMContentLoaded', buildMenu);
