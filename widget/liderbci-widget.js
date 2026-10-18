// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: credit-card;

// LiderBCI · widget para la pantalla de inicio del iPhone (app Scriptable)
//
// Muestra el total acumulado del periodo y las tres últimas compras. Lee lo que LiderBCI publica en tu
// repositorio privado de GitHub cada vez que anotas, corriges o borras una compra. No copies este archivo a
// mano: usa el botón «Copiar el script del widget» de LiderBCI, que completa las dos líneas siguientes con tu
// repositorio y tu token.
const REPO = '__REPO__';
const TOKEN = '__TOKEN__';

const API = 'https://api.github.com/repos/' + REPO;
const MS_TITLE = 'LiderBCI · widget';
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/* ---------- Formatos ---------- */
function pad(n) { return (n < 10 ? '0' : '') + n; }
function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function dots(n) { return String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function money(n) { return (n < 0 ? '−' : '') + '$' + dots(n); }
function hm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function dayLabel(k) {
  const t = new Date(), y = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1);
  if (k === dayKey(t)) return 'hoy';
  if (k === dayKey(y)) return 'ayer';
  const p = k.split('-');
  return (+p[2]) + ' ' + MES[+p[1] - 1];
}

/* ---------- Datos ---------- */
async function gh(path) {
  const r = new Request(API + path);
  r.headers = { Authorization: 'Bearer ' + TOKEN, Accept: 'application/vnd.github+json' };
  r.timeoutInterval = 20;
  const data = await r.loadJSON();
  const code = r.response && r.response.statusCode;
  if (code && code >= 400) { const e = new Error('GitHub ' + code); e.status = code; throw e; }
  return data;
}
function cachePath() { const fm = FileManager.local(); return fm.joinPath(fm.documentsDirectory(), 'liderbci-widget.json'); }
function readCache() {
  try { const fm = FileManager.local(), p = cachePath(); return fm.fileExists(p) ? JSON.parse(fm.readString(p)) : null; } catch (e) { return null; }
}
function writeCache(res) { try { FileManager.local().writeString(cachePath(), JSON.stringify(res)); } catch (e) {} }

// El total y las últimas compras, tal como LiderBCI los publicó la última vez que cambió algo
async function load() {
  const list = await gh('/milestones?state=all&per_page=100');
  const ms = (Array.isArray(list) ? list : []).filter(function (x) { return x && x.title === MS_TITLE; })[0];
  let st = null;
  try { st = ms && ms.description ? JSON.parse(ms.description) : null; } catch (e) { st = null; }
  if (!st || st.app !== 'liderbci') return { msg: 'Abre LiderBCI y activa el widget en «Widget en la pantalla de inicio».' };
  const buys = (Array.isArray(st.ult) ? st.ult : [])
    .filter(function (b) { return b && /^\d{4}-\d{2}-\d{2}$/.test(String(b.d)) && b.m > 0; }).slice(0, 3)
    .map(function (b) { return { d: String(b.d), c: String(b.c || 'Compra'), m: +b.m }; });
  return { total: typeof st.total === 'number' ? st.total : 0, n: +st.n > 0 ? Math.round(+st.n) : 0, buys: buys, at: Date.now() };
}

/* ---------- Dibujo ---------- */
const WHITE = new Color('#ffffff'), GOLD = new Color('#BDEBFB');
function label(stack, str, size, color, opacity, bold) {
  const t = stack.addText(str);
  t.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
  t.textColor = color || WHITE;
  if (opacity) t.textOpacity = opacity;
  t.lineLimit = 1;
  return t;
}
function build(res, family) {
  const w = new ListWidget();
  const lock = String(family || '').indexOf('accessory') === 0;
  const small = family === 'small';
  if (lock) {
    // Pantalla bloqueada: total acumulado y última compra
    label(w, 'LiderBCI ' + (res.msg ? '' : money(res.total)), 14, null, 0, true).minimumScaleFactor = 0.6;
    if (res.msg) label(w, res.msg, 11).lineLimit = 2;
    else if (res.buys.length) label(w, res.buys[0].c + ' ' + money(res.buys[0].m), 11).minimumScaleFactor = 0.7;
    return w;
  }
  const g = new LinearGradient();
  g.colors = [new Color('#4D78F3'), new Color('#2141D6')];
  g.locations = [0, 1];
  g.startPoint = new Point(0, 0);
  g.endPoint = new Point(1, 1);
  w.backgroundGradient = g;
  w.setPadding(small ? 12 : 14, small ? 12 : 16, small ? 10 : 12, small ? 12 : 16);

  const head = w.addStack();
  head.layoutHorizontally();
  head.centerAlignContent();
  const count = !small && !res.msg && res.n > 0 ? ' · ' + res.n + (res.n === 1 ? ' COMPRA' : ' COMPRAS') : '';
  label(head, 'TOTAL LIDERBCI' + count, small ? 9 : 10, GOLD, 0, true);
  head.addSpacer();
  if (res.at) label(head, (res.old ? 'sin conexión · ' : '') + hm(new Date(res.at)), 9, WHITE, 0.6);
  w.addSpacer(2);

  if (res.msg) {
    const t = label(w, res.msg, small ? 12 : 14, WHITE, 0.9);
    t.lineLimit = 4;
    w.addSpacer();
    return w;
  }
  const total = label(w, money(res.total), small ? 22 : 28, WHITE, 0, true);
  total.minimumScaleFactor = 0.5;
  w.addSpacer(small ? 4 : 8);

  if (!res.buys.length) label(w, 'Aún no hay compras', 12, WHITE, 0.7);
  res.buys.forEach(function (b, i) {
    if (i) w.addSpacer(small ? 2 : 4);
    const row = w.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();
    if (!small) { label(row, dayLabel(b.d), 10, WHITE, 0.6); row.addSpacer(6); }
    label(row, b.c, small ? 10 : 12, WHITE, 0.95);
    row.addSpacer();
    label(row, money(b.m), small ? 10 : 12, WHITE, 0, true);
  });
  w.addSpacer();
  return w;
}

/* ---------- Ejecución ---------- */
let res;
if (/^__/.test(TOKEN) || /^__/.test(REPO)) {
  res = { msg: 'Copia este script desde LiderBCI, con el botón «Copiar el script del widget».' };
} else {
  try {
    res = await load();
    if (!res.msg) writeCache(res);
  } catch (e) {
    const c = readCache();
    if (c && !c.msg) { res = c; res.old = true; }
    else res = { msg: e && e.status === 401 ? 'El token venció. Copia de nuevo el script desde LiderBCI.' : 'No se pudo leer el repositorio. Revisa la conexión.' };
  }
}
const widget = build(res, config.widgetFamily);
widget.refreshAfterDate = new Date(Date.now() + 10 * 60 * 1000);
if (config.runsInWidget) Script.setWidget(widget);
else await widget.presentMedium();
Script.complete();
