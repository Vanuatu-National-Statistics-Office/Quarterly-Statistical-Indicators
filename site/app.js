/* VBoS Statistics Dashboard.
 * Reads data/dashboard.json (written by build.py) and renders the overview, one page per
 * table with filters, a Plotly chart and a data table, and the symbols/about pages. */
'use strict';

/* ---------------- Text ---------------- */

const UI = {
  en: {
    skip: 'Skip to content', menu: 'Menu', org: 'Vanuatu Bureau of Statistics', appTitle: 'Statistics Dashboard',
    downloadAll: 'All data', install: 'Install app', loading: 'Loading statistics…',
    loadError: 'The statistics could not be loaded. Check your connection and reload the page.',
    installTitle: 'Install the dashboard app',
    installIntro: 'The dashboard can be installed like an app. It opens in its own window and keeps the latest data you viewed for use offline.',
    installPcTitle: 'Computer (Chrome or Edge):',
    installPc: 'click the install icon at the right of the address bar, or open the browser menu and choose “Install VBoS Statistics”.',
    installAndroidTitle: 'Android:', installAndroid: 'open the browser menu (⋮) and choose “Install app” or “Add to Home screen”.',
    installIosTitle: 'iPhone or iPad (Safari):', installIos: 'tap Share, then “Add to Home Screen”.',
    installed: 'The dashboard app is installed.', close: 'Close',
    overview: 'Overview', overviewTitle: 'Vanuatu at a glance',
    overviewSub: 'Latest key statistics from the Vanuatu Bureau of Statistics.',
    keyIndicators: 'Key indicators', highlights: 'Highlights', browse: 'Browse all tables',
    symbols: 'Symbols and notes', about: 'About', dataUpdated: 'Data updated',
    table: 'Table', tables: 'tables', frequency: 'Frequency', Annual: 'Annual', Quarterly: 'Quarterly',
    from: 'From', to: 'To', unit: 'Unit', series: 'Show', all: 'All', none: 'None',
    chartType: 'Chart type', bar: 'Bar', line: 'Line', filters: 'Filters', chart: 'Chart', dataTable: 'Data table',
    dlPng: 'Chart (PNG)', dlCsv: 'Filtered data (CSV)', dlFull: 'Full table (CSV)',
    noData: 'No data for this selection.', period: 'Period', source: 'Source', note: 'Note',
    vsLastYear: 'on a year earlier', viewTable: 'View table', units: 'Units',
    offline: 'You are offline. Showing the data saved on this device.',
    noCharts: 'Charts could not be loaded. Reload the page to try again; the data table below still works.',
    chartSource: 'Source: Vanuatu Bureau of Statistics', notFound: 'This table was not found.',
    symbolsIntro: 'The symbols below are used throughout the tables.',
    notesTitle: 'Notes', notesText: 'All data are from the Vanuatu Bureau of Statistics unless otherwise stated.',
    notesFlags: 'In the data tables, a small red letter after a value shows its symbol. Hover over it (or tap it) to read the full note.',
    aboutText: 'This dashboard presents the main statistical tables published by the Vanuatu Bureau of Statistics (VBoS) in a form you can filter, chart and download. It is updated whenever VBoS publishes new figures.',
    aboutUse: 'Using the dashboard',
    aboutUse1: 'Choose a table from the menu. Use the filters to pick the frequency, categories and years.',
    aboutUse2: 'Switch between bar and line charts, and click a name in the chart legend to hide or show it.',
    aboutUse3: 'Download the chart as an image, the filtered data or the full table as CSV, or every table at once with “All data”.',
    aboutUse4: 'Use EN / FR at the top to switch between English and French.',
    aboutUse5: 'Use “Install app” to add the dashboard to your computer or phone. It then works offline with the last data you viewed.',
    visit: 'Visit the VBoS website',
  },
  fr: {
    skip: 'Aller au contenu', menu: 'Menu', org: 'Bureau des Statistiques du Vanuatu', appTitle: 'Tableau de bord statistique',
    downloadAll: 'Toutes les données', install: 'Installer l’application', loading: 'Chargement des statistiques…',
    loadError: 'Impossible de charger les statistiques. Vérifiez votre connexion et rechargez la page.',
    installTitle: 'Installer l’application du tableau de bord',
    installIntro: 'Le tableau de bord peut être installé comme une application. Il s’ouvre dans sa propre fenêtre et conserve les dernières données consultées pour une utilisation hors ligne.',
    installPcTitle: 'Ordinateur (Chrome ou Edge) :',
    installPc: 'cliquez sur l’icône d’installation à droite de la barre d’adresse, ou ouvrez le menu du navigateur et choisissez « Installer VBoS Statistics ».',
    installAndroidTitle: 'Android :', installAndroid: 'ouvrez le menu du navigateur (⋮) et choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
    installIosTitle: 'iPhone ou iPad (Safari) :', installIos: 'touchez Partager, puis « Sur l’écran d’accueil ».',
    installed: 'L’application du tableau de bord est installée.', close: 'Fermer',
    overview: 'Panorama', overviewTitle: 'Le Vanuatu en un coup d’œil',
    overviewSub: 'Dernières statistiques clés du Bureau des Statistiques du Vanuatu.',
    keyIndicators: 'Indicateurs clés', highlights: 'Faits marquants', browse: 'Parcourir tous les tableaux',
    symbols: 'Signes conventionnels et notes', about: 'À propos', dataUpdated: 'Données mises à jour',
    table: 'Tableau', tables: 'tableaux', frequency: 'Fréquence', Annual: 'Annuel', Quarterly: 'Trimestriel',
    from: 'De', to: 'À', unit: 'Unité', series: 'Afficher', all: 'Tout', none: 'Aucun',
    chartType: 'Type de graphique', bar: 'Barres', line: 'Courbes', filters: 'Filtres', chart: 'Graphique', dataTable: 'Tableau de données',
    dlPng: 'Graphique (PNG)', dlCsv: 'Données filtrées (CSV)', dlFull: 'Tableau complet (CSV)',
    noData: 'Aucune donnée pour cette sélection.', period: 'Période', source: 'Source', note: 'Note',
    vsLastYear: 'sur un an', viewTable: 'Voir le tableau', units: 'Unités',
    offline: 'Vous êtes hors ligne. Affichage des données enregistrées sur cet appareil.',
    noCharts: 'Les graphiques n’ont pas pu être chargés. Rechargez la page pour réessayer ; le tableau de données ci-dessous fonctionne toujours.',
    chartSource: 'Source : Bureau des Statistiques du Vanuatu', notFound: 'Ce tableau est introuvable.',
    symbolsIntro: 'Les signes ci-dessous sont utilisés dans tous les tableaux.',
    notesTitle: 'Notes', notesText: 'Toutes les données proviennent du Bureau des Statistiques du Vanuatu, sauf indication contraire.',
    notesFlags: 'Dans les tableaux de données, une petite lettre rouge après une valeur indique son signe. Survolez-la (ou touchez-la) pour lire la note complète.',
    aboutText: 'Ce tableau de bord présente les principaux tableaux statistiques publiés par le Bureau des Statistiques du Vanuatu (BSV) sous une forme que vous pouvez filtrer, représenter en graphique et télécharger. Il est mis à jour à chaque publication de nouveaux chiffres.',
    aboutUse: 'Utiliser le tableau de bord',
    aboutUse1: 'Choisissez un tableau dans le menu. Utilisez les filtres pour choisir la fréquence, les catégories et les années.',
    aboutUse2: 'Passez des barres aux courbes, et cliquez sur un nom dans la légende du graphique pour le masquer ou l’afficher.',
    aboutUse3: 'Téléchargez le graphique en image, les données filtrées ou le tableau complet en CSV, ou tous les tableaux avec « Toutes les données ».',
    aboutUse4: 'Utilisez EN / FR en haut de la page pour passer de l’anglais au français.',
    aboutUse5: 'Utilisez « Installer l’application » pour ajouter le tableau de bord à votre ordinateur ou téléphone. Il fonctionne alors hors ligne avec les dernières données consultées.',
    visit: 'Visiter le site du BSV',
  },
};

const SYMBOLS = [
  ['n.a.', {en: 'not available', fr: 'non disponible'}],
  ['r', {en: 'revised', fr: 'révisé'}],
  ['p', {en: 'provisional', fr: 'provisoire'}],
  ['e', {en: 'estimate', fr: 'estimation'}],
  ['-', {en: 'nil', fr: 'néant'}],
  ['0', {en: 'less than half the final unit shown', fr: 'moins de la moitié de l’unité finale indiquée'}],
  ['t', {en: 'metric tonne', fr: 'tonne métrique'}],
  ['N.E.C.', {en: 'not elsewhere classified', fr: 'non classé ailleurs'}],
  ['C.I.F.', {en: 'cost, insurance and freight', fr: 'coût, assurance et fret'}],
  ['F.O.B.', {en: 'free on board', fr: 'franco à bord'}],
  ['Vt', {en: 'vatu', fr: 'vatu'}],
  ['*', {en: 'other note on the value (hover over it in a table to read it)', fr: 'autre note sur la valeur (survolez-la dans un tableau pour la lire)'}],
];

// Flags in the CSV files start with one of these phrases.
const FLAGS = [
  ['nil', '-', {en: 'nil', fr: 'néant'}],
  ['no exports', '-', {en: 'no exports', fr: 'pas d’exportations'}],
  ['not available', 'n.a.', {en: 'not available', fr: 'non disponible'}],
  ['blank in source', 'n.a.', {en: 'blank in source', fr: 'vide dans la source'}],
  ['revised', 'r', {en: 'revised', fr: 'révisé'}],
  ['provisional', 'p', {en: 'provisional', fr: 'provisoire'}],
  ['estimate', 'e', {en: 'estimate', fr: 'estimation'}],
  ['partial year', '*', {en: 'partial year', fr: 'année partielle'}],
  ['suspected error', '*', {en: 'suspected error', fr: 'erreur présumée'}],
];

// Chart colours: the logo colours first, then lighter and darker shades of them.
const PALETTE = ['#265069', '#faaf40', '#3c6f72', '#ef4136', '#7fa7c4', '#b07a1e', '#8cc0b8', '#5f6d79',
                 '#f6cf8a', '#163447', '#f08a6c', '#2b5457', '#c9a227', '#a9c5d9', '#8a3b2e', '#c7d0d7', '#4f8a5b'];

const ICON = {
  download: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="8.5" r="1.5"/>',
  bar: '<path d="M5 20V10m7 10V4m7 16v-7M3 20h18"/>',
  line: '<path d="m3 17 6-6 4 4 8-8M3 21h18"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 0v16"/>',
};

/* ---------------- State ---------------- */

let DB = null;                  // contents of data/dashboard.json
const DS = {};                  // datasets by id
const SECTIONS = {};            // sections by id
const VIEW = {};                // filter choices per dataset, kept while the page is open
const openSections = new Set();
let lang = pickLang();
let installPrompt = null;
const main = document.getElementById('main');

/* ---------------- Helpers ---------------- */

const uniq = arr => [...new Set(arr)];
const t = k => UI[lang][k] ?? UI.en[k] ?? k;
const tx = o => (o ? o[lang] ?? o.en ?? '' : '');
const lbl = raw => { const v = DB.labels.values[raw]; return v ? v[lang] ?? v.en ?? raw : raw; };
const dimName = d => { const v = DB.labels.dimensions[d]; return v ? v[lang] ?? v.en ?? d : d; };
const colon = () => (lang === 'fr' ? ' : ' : ': ');   // French puts a space before a colon
const keyOf = r => r.y * 10 + (r.q || 0);
const periodLabel = (y, q) => (q ? `${y} ${lang === 'fr' ? 'T' : 'Q'}${q}` : String(y));
const periodCode = r => (r.q ? `${r.y}-Q${r.q}` : String(r.y));

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c instanceof Node ? c : String(c));
  return n;
}

function icon(name) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('class', 'ico');
  s.innerHTML = ICON[name];   // fixed markup from ICON above
  return s;
}

function flagInfo(flag) {
  if (!flag) return null;
  const f = flag.toLowerCase();
  for (const [prefix, sym, name] of FLAGS) {
    if (f.startsWith(prefix)) {
      const rest = flag.slice(prefix.length).trim();
      return {sym, text: tx(name) + (rest ? ` ${rest}` : '')};
    }
  }
  return {sym: '*', text: flag};
}

function numberFormat(ds, unit) {
  const d = ds.decimals?.[unit] ?? 2;
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {minimumFractionDigits: d, maximumFractionDigits: d});
}

// The value as the published tables show it: "-" for nil, "n.a." when missing.
function displayValue(ds, r) {
  if (!r || r.v == null) return 'n.a.';
  const fi = flagInfo(r.flag);
  if (fi && fi.sym === '-' && r.v === 0) return '-';
  return numberFormat(ds, r.unit).format(r.v);
}

function colorFor(ds, s) {
  const i = ds.seriesAll.indexOf(s);
  return PALETTE[(i < 0 ? 0 : i) % PALETTE.length];
}

function downloadBlob(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], {type}));
  const a = el('a', {href: url, download: filename});
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function toast(msg, ms = 4000) {
  const box = document.getElementById('toast');
  box.textContent = msg;
  box.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { box.hidden = true; }, ms);
}

function formatDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? iso : new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {dateStyle: 'long'}).format(d);
}

/* ---------------- Data ---------------- */

function prepare() {
  for (const s of DB.sections) SECTIONS[s.id] = s;
  for (const ds of DB.datasets) {
    const n = ds.dims.length;
    ds.rowsObj = ds.rows.map(a => ({
      f: a[0] === 'A' ? 'Annual' : 'Quarterly', y: a[1], q: a[2],
      dims: Object.fromEntries(ds.dims.map((d, i) => [d, a[3 + i]])),
      unit: a[3 + n], v: a[4 + n], flag: a[5 + n] || '',
    }));
    ds.seriesAll = uniq(ds.rowsObj.map(r => r.dims[ds.series]));
    DS[ds.id] = ds;
  }
}

function viewState(ds) {
  if (!VIEW[ds.id]) {
    const hasQ = ds.rowsObj.some(r => r.f === 'Quarterly');
    VIEW[ds.id] = {freq: hasQ ? 'Quarterly' : 'Annual', filters: {...(ds.defaults || {})},
                   unit: null, series: null, from: null, to: null, chart: ds.chart || 'bar'};
  }
  return VIEW[ds.id];
}

// Apply the filters in order. Each filter only offers values that exist under the ones before it.
function compute(ds, st) {
  const freqs = ['Annual', 'Quarterly'].filter(f => ds.rowsObj.some(r => r.f === f));
  if (!freqs.includes(st.freq)) st.freq = freqs[0];
  let rows = ds.rowsObj.filter(r => r.f === st.freq);

  const filterOpts = {};
  for (const d of ds.filters) {
    const opts = uniq(rows.map(r => r.dims[d]));
    filterOpts[d] = opts;
    if (!opts.includes(st.filters[d])) st.filters[d] = opts.includes(ds.defaults?.[d]) ? ds.defaults[d] : opts[0];
    rows = rows.filter(r => r.dims[d] === st.filters[d]);
  }

  // Some tables mix units (e.g. values and shares); chart one unit at a time.
  const units = uniq(rows.map(r => r.unit));
  if (!units.includes(st.unit)) st.unit = units[0];
  if (units.length > 1) rows = rows.filter(r => r.unit === st.unit);

  const seriesOpts = uniq(rows.map(r => r.dims[ds.series]));
  const defaults = (ds.default_series || []).filter(s => seriesOpts.includes(s));
  if (st.series === null || (st.series.length && !st.series.some(s => seriesOpts.includes(s)))) {
    st.series = defaults.length ? defaults : seriesOpts.slice();
  } else {
    st.series = st.series.filter(s => seriesOpts.includes(s));
  }

  const years = uniq(rows.map(r => r.y)).sort((a, b) => a - b);
  if (!years.includes(st.from)) st.from = years[0];
  if (!years.includes(st.to)) st.to = years[years.length - 1];
  if (st.from > st.to) [st.from, st.to] = [st.to, st.from];

  rows = rows.filter(r => r.y >= st.from && r.y <= st.to);
  const periods = uniq(rows.map(keyOf)).sort((a, b) => a - b)
    .map(k => ({k, y: Math.floor(k / 10), q: k % 10 || null}));
  const shown = seriesOpts.filter(s => st.series.includes(s));
  const lookup = new Map(rows.map(r => [`${r.dims[ds.series]}|${keyOf(r)}`, r]));
  return {freqs, filterOpts, units, seriesOpts, years, periods, shown, lookup, rows, unit: st.unit};
}

/* ---------------- Charts ---------------- */

// traces: [{name, color, get(k) -> row}]
function drawChart(div, ds, periods, traces, unit, type, filename) {
  if (typeof window.Plotly === 'undefined') {
    div.replaceChildren(el('div', {class: 'empty'}, t('noCharts')));
    return;
  }
  if (!periods.length || !traces.length) {
    if (div.data) Plotly.purge(div);
    div.replaceChildren(el('div', {class: 'empty'}, t('noData')));
    return;
  }
  if (!div.data) div.replaceChildren();
  const x = periods.map(p => periodLabel(p.y, p.q));
  const data = traces.map(tr => {
    const rows = periods.map(p => tr.get(p.k));
    const base = {
      name: tr.name, x, y: rows.map(r => (r ? r.v : null)),
      customdata: rows.map(r => displayValue(ds, r) + (r && flagInfo(r.flag)?.sym === 'r' ? ' r' : '')),
      hovertemplate: '%{customdata}<extra>%{fullData.name}</extra>',
    };
    return type === 'line'
      ? {...base, type: 'scatter', mode: 'lines+markers', line: {color: tr.color, width: 2.5}, marker: {color: tr.color, size: 6}}
      : {...base, type: 'bar', marker: {color: tr.color}};
  });
  const layout = {
    font: {family: 'Poppins, Segoe UI, system-ui, sans-serif', size: 12, color: '#1d2b36'},
    paper_bgcolor: '#ffffff', plot_bgcolor: '#ffffff',
    margin: {l: 60, r: 16, t: 12, b: 40},
    separators: lang === 'fr' ? ', ' : '.,',
    hovermode: 'x unified', hoverlabel: {font: {family: 'Poppins, sans-serif'}},
    barmode: 'group', bargap: 0.22, bargroupgap: 0.05,
    xaxis: {type: 'category', automargin: true, tickangle: x.length > 14 ? -45 : 0, linecolor: '#dbe3e9', tickfont: {size: 11}},
    yaxis: {title: {text: lbl(unit), font: {size: 12, color: '#5a6a77'}}, automargin: true,
            gridcolor: '#e6ecf0', zerolinecolor: '#aab8c2', rangemode: type === 'bar' ? 'tozero' : 'normal'},
    legend: {orientation: 'h', x: 0, xanchor: 'left', y: 1.02, yanchor: 'bottom', font: {size: 12}},
    showlegend: true,
  };
  Plotly.react(div, data, layout, {
    responsive: true, displaylogo: false,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
    toImageButtonOptions: {format: 'png', filename, scale: 2},
  });
}

async function downloadChartPng(div, title, filename) {
  if (!window.Plotly || !div.data) return;
  const layout = {...div.layout,
    title: {text: `<b>${title}</b><br><span style="font-size:12px;color:#5a6a77">${t('chartSource')}</span>`,
            x: 0.01, xanchor: 'left', y: 0.97, font: {size: 17, color: '#1a3a4d'}},
    margin: {...div.layout.margin, t: 110}};
  const url = await Plotly.toImage({data: div.data, layout}, {format: 'png', width: 1400, height: 720});
  const a = el('a', {href: url, download: `${filename}.png`});
  document.body.append(a);
  a.click();
  a.remove();
}

function csvCell(v) {
  const s = v == null ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCsv(ds, view, filename) {
  const lines = [['frequency', 'period', 'year', 'quarter', ...ds.dims, 'unit', 'value', 'flag']];
  for (const p of view.periods) {
    for (const s of view.shown) {
      const r = view.lookup.get(`${s}|${p.k}`);
      if (r) lines.push([r.f, periodCode(r), r.y, r.q ?? '', ...ds.dims.map(d => r.dims[d]), r.unit, r.v ?? '', r.flag]);
    }
  }
  downloadBlob('﻿' + lines.map(l => l.map(csvCell).join(',')).join('\r\n'), `${filename}.csv`, 'text/csv;charset=utf-8');
}

/* ---------------- Sidebar ---------------- */

function buildSidebar() {
  const nav = document.getElementById('sidebar');
  const hash = location.hash || '#/';
  const current = h => (hash === h ? 'page' : null);
  const activeDs = hash.startsWith('#/t/') ? DS[hash.slice(4)] : null;
  if (activeDs) openSections.add(activeDs.section);

  const sections = DB.sections.map(sec => {
    const items = DB.datasets.filter(d => d.section === sec.id);
    if (!items.length) return null;
    const det = el('details', {class: 'nav-section', open: openSections.has(sec.id)},
      el('summary', {}, el('span', {class: 'nav-no'}, sec.no), tx(sec.title), (() => { const c = icon('chev'); c.classList.add('chev'); return c; })()),
      el('div', {class: 'nav-sub'}, items.map(d =>
        el('a', {class: 'nav-link', href: `#/t/${d.id}`, 'aria-current': current(`#/t/${d.id}`)},
          el('span', {class: 'tbl-no'}, d.table), tx(d.title)))));
    det.addEventListener('toggle', () => (det.open ? openSections.add(sec.id) : openSections.delete(sec.id)));
    return det;
  });

  nav.replaceChildren(
    el('a', {class: 'nav-link', href: '#/', 'aria-current': hash === '#/' || hash === '#' ? 'page' : null}, icon('home'), t('overview')),
    el('div', {class: 'nav-divider'}),
    ...sections,
    el('div', {class: 'nav-divider'}),
    el('a', {class: 'nav-link', href: '#/symbols', 'aria-current': current('#/symbols')}, icon('book'), t('symbols')),
    el('a', {class: 'nav-link', href: '#/about', 'aria-current': current('#/about')}, icon('info'), t('about')),
    el('div', {class: 'nav-foot'}, `${t('dataUpdated')}${colon()}${formatDate(DB.built)}`),
  );
}

/* ---------------- Pages ---------------- */

function seg(options, value, onPick, label) {
  return el('div', {class: 'seg', role: 'group', 'aria-label': label},
    options.map(o => el('button', {type: 'button', 'aria-pressed': String(o.value === value), 'data-fid': `${label}:${o.value}`,
      onclick: () => onPick(o.value)}, o.icon ? icon(o.icon) : null, o.label)));
}

function selectField(id, label, options, value, onChange) {
  return el('div', {class: 'field'},
    el('label', {for: id}, label),
    el('select', {id, 'data-fid': id, onchange: e => onChange(e.target.value)},
      options.map(o => el('option', {value: o.value, selected: o.value === value}, o.label))));
}

function renderTable(id) {
  const ds = DS[id];
  if (!ds) {
    main.replaceChildren(el('p', {class: 'loading'}, t('notFound')));
    return;
  }
  const st = viewState(ds);
  const sec = SECTIONS[ds.section];
  const fileBase = `vbos_table_${ds.table.replace('.', '_')}`;
  const title = `${t('table')} ${ds.table}: ${tx(ds.title)}`;

  const filtersBody = el('div', {class: 'card-body'});
  const chartDiv = el('div', {class: 'chart'});
  const tableBody = el('div', {class: 'table-wrap'});
  const tableFoot = el('div', {class: 'table-foot'});
  let view;

  const btn = (iconName, text, onclick) => el('button', {type: 'button', class: 'btn btn-ghost btn-sm', onclick}, icon(iconName), text);

  main.replaceChildren(
    el('nav', {class: 'crumbs', 'aria-label': 'breadcrumb'}, el('a', {href: '#/'}, t('overview')), ' › ', tx(sec?.title)),
    el('header', {class: 'page-head'},
      el('h1', {}, el('span', {class: 'tbl-badge'}, `${t('table')} ${ds.table}`), tx(ds.title)),
      el('div', {class: 'meta'},
        ds.source ? el('span', {}, `${t('source')}${colon()}${tx(ds.source)}`) : null,
        el('span', {}, `${t('dataUpdated')}${colon()}${formatDate(DB.built)}`)),
      ds.note ? el('div', {class: 'note'}, `${t('note')}${colon()}${tx(ds.note)}`) : null),
    el('section', {class: 'card'}, el('div', {class: 'card-head'}, el('h2', {}, t('filters'))), filtersBody),
    el('section', {class: 'card'},
      el('div', {class: 'card-head'}, el('h2', {}, t('chart')),
        el('div', {class: 'actions'}, btn('image', t('dlPng'), () => downloadChartPng(chartDiv, title, fileBase)))),
      el('div', {class: 'card-body'}, chartDiv)),
    el('section', {class: 'card'},
      el('div', {class: 'card-head'}, el('h2', {}, t('dataTable')),
        el('div', {class: 'actions'},
          btn('download', t('dlCsv'), () => exportCsv(ds, view, `${fileBase}_filtered`)),
          el('a', {class: 'btn btn-ghost btn-sm', href: ds.csv, download: true}, icon('download'), t('dlFull')))),
      tableBody, tableFoot),
  );

  const update = () => {
    const focused = document.activeElement?.dataset?.fid;
    view = compute(ds, st);
    filtersBody.replaceChildren(buildFilters(ds, st, view, update));
    drawChart(chartDiv, ds, view.periods,
      view.shown.map(s => ({name: lbl(s), color: colorFor(ds, s), get: k => view.lookup.get(`${s}|${k}`)})),
      view.unit, st.chart, fileBase);
    buildDataTable(ds, view, tableBody, tableFoot);
    if (focused) main.querySelector(`[data-fid="${CSS.escape(focused)}"]`)?.focus();
  };
  update();
}

function buildFilters(ds, st, view, update) {
  const wrap = el('div', {class: 'filters'});
  const set = fn => v => { fn(v); update(); };

  wrap.append(el('div', {class: 'field'}, el('span', {class: 'label'}, t('frequency')),
    seg(view.freqs.map(f => ({value: f, label: t(f)})), st.freq, set(v => { st.freq = v; }), t('frequency'))));

  for (const d of ds.filters) {
    wrap.append(selectField(`f-${d}`, dimName(d), view.filterOpts[d].map(o => ({value: o, label: lbl(o)})),
      st.filters[d], set(v => { st.filters[d] = v; })));
  }
  if (view.units.length > 1) {
    wrap.append(selectField('f-unit', t('unit'), view.units.map(u => ({value: u, label: lbl(u)})), st.unit, set(v => { st.unit = v; })));
  }
  const yearOpts = view.years.map(y => ({value: String(y), label: String(y)}));
  wrap.append(el('div', {class: 'field'}, el('span', {class: 'label'}, `${t('from')} – ${t('to')}`),
    el('div', {class: 'range'},
      el('select', {'aria-label': t('from'), 'data-fid': 'from', onchange: e => { st.from = +e.target.value; update(); }},
        yearOpts.map(o => el('option', {value: o.value, selected: +o.value === st.from}, o.label))),
      el('select', {'aria-label': t('to'), 'data-fid': 'to', onchange: e => { st.to = +e.target.value; update(); }},
        yearOpts.map(o => el('option', {value: o.value, selected: +o.value === st.to}, o.label))))));
  wrap.append(el('div', {class: 'field'}, el('span', {class: 'label'}, t('chartType')),
    seg([{value: 'bar', label: t('bar'), icon: 'bar'}, {value: 'line', label: t('line'), icon: 'line'}],
      st.chart, set(v => { st.chart = v; }), t('chartType'))));

  const chips = view.seriesOpts.map(s => {
    const on = st.series.includes(s);
    return el('button', {type: 'button', class: 'chip', 'aria-pressed': String(on), 'data-fid': `chip:${s}`,
      onclick: () => { st.series = on ? st.series.filter(x => x !== s) : [...st.series, s]; update(); }},
      el('span', {class: 'dot', style: on ? `background:${colorFor(ds, s)}` : null}), lbl(s));
  });
  wrap.append(el('div', {class: 'field series-field'},
    el('div', {class: 'series-head'}, el('span', {class: 'label'}, `${t('series')}${colon()}${dimName(ds.series)}`),
      el('button', {type: 'button', class: 'link-btn', onclick: () => { st.series = view.seriesOpts.slice(); update(); }}, t('all')),
      el('button', {type: 'button', class: 'link-btn', onclick: () => { st.series = []; update(); }}, t('none'))),
    el('div', {class: 'chips'}, chips)));
  return wrap;
}

function buildDataTable(ds, view, body, foot) {
  if (!view.periods.length || !view.shown.length) {
    body.replaceChildren(el('div', {class: 'empty'}, t('noData')));
    foot.replaceChildren();
    return;
  }
  const used = new Map();
  const cell = r => {
    const fi = r ? flagInfo(r.flag) : null;
    const showMark = fi && fi.sym !== '-' && fi.sym !== 'n.a.';
    if (fi) used.set(fi.sym, fi.sym);
    return el('td', {}, displayValue(ds, r),
      showMark ? el('span', {class: 'flag', title: fi.text, tabindex: '0', onclick: () => toast(`${fi.sym}: ${fi.text}`)}, fi.sym) : null);
  };
  body.replaceChildren(el('table', {class: 'data'},
    el('thead', {}, el('tr', {}, el('th', {scope: 'col'}, t('period')), view.shown.map(s => el('th', {scope: 'col'}, lbl(s))))),
    el('tbody', {}, view.periods.map(p => el('tr', {},
      el('th', {scope: 'row'}, periodLabel(p.y, p.q)),
      view.shown.map(s => cell(view.lookup.get(`${s}|${p.k}`))))))));

  const legend = SYMBOLS.filter(([sym]) => used.has(sym)).map(([sym, name]) => `${sym} ${tx(name)}`);
  foot.replaceChildren(`${t('unit')}${colon()}${lbl(view.unit)}`, legend.length ? `  ·  ${legend.join('  ·  ')}` : '');
}

/* ---------------- Overview ---------------- */

function headlineData(h) {
  const ds = DS[h.dataset];
  if (!ds) return null;
  const rows = ds.rowsObj
    .filter(r => r.f === h.frequency && r.v != null && r.dims[ds.series] === h.series &&
                 Object.entries(h.filters).every(([d, v]) => r.dims[d] === v))
    .sort((a, b) => keyOf(a) - keyOf(b));
  if (!rows.length) return null;
  const last = rows[rows.length - 1];
  const prev = rows.find(r => r.y === last.y - 1 && r.q === last.q);
  return {ds, last, prev};
}

function kpiCard(h) {
  const d = headlineData(h);
  if (!d) return null;
  const {ds, last, prev} = d;
  const nfmt = numberFormat(ds, last.unit);
  let change = null;
  if (prev && h.compare === 'yoy_pct' && prev.v) {
    const pct = (last.v - prev.v) / Math.abs(prev.v) * 100;
    change = {down: pct < 0, text: `${pct < 0 ? '▼' : '▲'} ${new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {maximumFractionDigits: 1}).format(Math.abs(pct))} %`};
  } else if (prev && h.compare === 'yoy_diff') {
    const diff = last.v - prev.v;
    change = {down: diff < 0, text: `${diff < 0 ? '▼' : '▲'} ${nfmt.format(Math.abs(diff))}`};
  }
  return el('button', {type: 'button', class: 'kpi', onclick: () => {
    VIEW[ds.id] = {freq: h.frequency, filters: {...h.filters}, unit: null, series: null, from: null, to: null, chart: ds.chart || 'bar'};
    location.hash = `#/t/${ds.id}`;
  }},
    el('span', {class: 'kpi-label'}, tx(h.label)),
    el('span', {class: 'kpi-value'}, displayValue(ds, last) + (h.suffix ? ` ${h.suffix}` : '')),
    el('span', {class: 'kpi-foot'},
      el('span', {}, `${periodLabel(last.y, last.q)} · ${t('table')} ${ds.table}`),
      change ? el('span', {class: `kpi-change${change.down ? ' down' : ''}`}, `${change.text} ${t('vsLastYear')}`) : null));
}

function overviewChart(cfg) {
  const ds = DS[cfg.dataset];
  if (!ds) return null;
  const specs = cfg.series_from
    ? cfg.series_from.map((s, i) => ({filters: {...cfg.filters, ...s.filters}, series: s.series,
                                     name: lbl(s.filters.item ?? s.series), color: PALETTE[i]}))
    : cfg.series.map(s => ({filters: cfg.filters, series: s, name: lbl(s), color: colorFor(ds, s)}));

  let unit = null;
  const traces = specs.map(spec => {
    const map = new Map();
    for (const r of ds.rowsObj) {
      if (r.f !== cfg.frequency || r.dims[ds.series] !== spec.series) continue;
      if (!Object.entries(spec.filters).every(([d, v]) => r.dims[d] === v)) continue;
      map.set(keyOf(r), r);
      unit = r.unit;
    }
    return {name: spec.name, color: spec.color, get: k => map.get(k), keys: [...map.keys()]};
  });
  let keys = uniq(traces.flatMap(tr => tr.keys)).sort((a, b) => a - b);
  if (cfg.frequency === 'Quarterly') keys = keys.slice(-12);
  const periods = keys.map(k => ({k, y: Math.floor(k / 10), q: k % 10 || null}));

  const div = el('div', {class: 'chart'});
  const card = el('section', {class: 'card'},
    el('div', {class: 'card-head'}, el('h2', {}, tx(cfg.title)),
      el('div', {class: 'actions'}, el('a', {class: 'btn btn-ghost btn-sm', href: `#/t/${ds.id}`}, `${t('viewTable')} ${ds.table}`))),
    el('div', {class: 'card-body'}, div));
  return {card, draw: () => drawChart(div, ds, periods, traces, unit, cfg.chart, `vbos_${ds.id}_overview`)};
}

function renderOverview() {
  const charts = DB.overview_charts.map(overviewChart).filter(Boolean);
  main.replaceChildren(
    el('div', {class: 'hero'},
      el('div', {}, el('h1', {}, t('overviewTitle')), el('p', {}, t('overviewSub'))),
      el('p', {class: 'meta'}, `${t('dataUpdated')}${colon()}${formatDate(DB.built)}`)),
    el('h2', {class: 'section-title'}, t('keyIndicators')),
    el('div', {class: 'kpis'}, DB.headlines.map(kpiCard)),
    el('h2', {class: 'section-title'}, t('highlights')),
    el('div', {class: 'grid-2'}, charts.map(c => c.card)),
    el('h2', {class: 'section-title'}, t('browse')),
    el('div', {class: 'sections-grid'}, DB.sections.map(sec => {
      const items = DB.datasets.filter(d => d.section === sec.id);
      if (!items.length) return null;
      return el('a', {class: 'section-tile', href: `#/t/${items[0].id}`},
        el('span', {class: 'nav-no'}, sec.no),
        el('span', {}, tx(sec.title), el('small', {}, `${items.length} ${t('tables')}`)));
    })),
  );
  charts.forEach(c => c.draw());
}

/* ---------------- Symbols and about ---------------- */

function renderSymbols() {
  main.replaceChildren(el('div', {class: 'prose'},
    el('header', {class: 'page-head'}, el('h1', {}, t('symbols')), el('p', {class: 'meta'}, t('symbolsIntro'))),
    el('section', {class: 'card'}, el('div', {class: 'card-body'},
      el('div', {class: 'symbols'}, SYMBOLS.map(([sym, name]) => el('div', {class: 'symbol-row'}, el('b', {}, sym), el('span', {}, tx(name))))))),
    el('section', {class: 'card'}, el('div', {class: 'card-head'}, el('h2', {}, t('notesTitle'))),
      el('div', {class: 'card-body'}, el('ul', {}, el('li', {}, t('notesText')), el('li', {}, t('notesFlags'))))),
  ));
}

function renderAbout() {
  main.replaceChildren(el('div', {class: 'prose'},
    el('img', {class: 'about-logo', src: 'assets/logo-full.png', alt: t('org')}),
    el('header', {class: 'page-head'}, el('h1', {}, t('about')), el('p', {class: 'meta'}, `${t('dataUpdated')}${colon()}${formatDate(DB.built)}`)),
    el('p', {}, t('aboutText')),
    el('section', {class: 'card'}, el('div', {class: 'card-head'}, el('h2', {}, t('aboutUse'))),
      el('div', {class: 'card-body'}, el('ul', {}, ['aboutUse1', 'aboutUse2', 'aboutUse3', 'aboutUse4', 'aboutUse5'].map(k => el('li', {}, t(k)))))),
    el('p', {}, el('a', {href: DB.site.website, target: '_blank', rel: 'noopener'}, t('visit'))),
  ));
}

/* ---------------- Routing, language, install ---------------- */

function route() {
  if (!DB) return;
  if (window.Plotly) document.querySelectorAll('.js-plotly-plot').forEach(d => Plotly.purge(d));
  document.body.classList.remove('nav-open');
  document.getElementById('scrim').hidden = true;
  document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
  buildSidebar();
  const h = location.hash.replace(/^#\/?/, '');
  if (h.startsWith('t/')) renderTable(decodeURIComponent(h.slice(2)));
  else if (h === 'symbols') renderSymbols();
  else if (h === 'about') renderAbout();
  else renderOverview();
  window.scrollTo(0, 0);
}

function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'fr') return q;
  try {
    const saved = localStorage.getItem('vbos-lang');
    if (saved === 'en' || saved === 'fr') return saved;
  } catch { /* storage unavailable */ }
  return (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function applyStaticText() {
  document.documentElement.lang = lang;
  document.title = `${t('appTitle')} – VBoS`;
  document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}

function setLang(l) {
  if (l === lang) return;
  lang = l;
  try { localStorage.setItem('vbos-lang', l); } catch { /* storage unavailable */ }
  applyStaticText();
  const y = window.scrollY;
  route();
  window.scrollTo(0, y);
}

function bindChrome() {
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  const menuBtn = document.getElementById('menuBtn');
  const scrim = document.getElementById('scrim');
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
  });
  scrim.addEventListener('click', () => menuBtn.click());

  const installBtn = document.getElementById('installBtn');
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  installBtn.hidden = Boolean(standalone);
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
  window.addEventListener('appinstalled', () => { installPrompt = null; installBtn.hidden = true; toast(t('installed')); });
  installBtn.addEventListener('click', async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
    } else {
      document.getElementById('installDialog').showModal();
    }
  });

  window.addEventListener('offline', () => toast(t('offline'), 6000));
  window.addEventListener('hashchange', route);
}

// Retry a few times: connections can drop part-way through on slow or unstable networks.
async function fetchJson(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, {cache: 'no-cache'});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise(r => setTimeout(r, 800 * i));
    }
  }
}

async function ensurePlotly(tries = 3) {
  for (let i = 1; typeof window.Plotly === 'undefined' && i <= tries; i++) {
    await new Promise(resolve => {
      const s = el('script', {src: `vendor/plotly.min.js?retry=${i}`});
      s.onload = s.onerror = resolve;
      document.head.append(s);
    });
  }
}

async function init() {
  applyStaticText();
  bindChrome();
  try {
    [DB] = await Promise.all([fetchJson('data/dashboard.json'), ensurePlotly()]);
  } catch (e) {
    main.replaceChildren(el('p', {class: 'loading'}, t('loadError')));
    return;
  }
  prepare();
  route();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* the site still works without it */ });
  }
}

init();
