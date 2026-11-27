// Snippet per NotebookLM / Gemini Notebook (notebook.google.com), da eseguire con javascript_tool
// in Claude in Chrome. Vedi il passo 8 di SKILL.md.

// 1) CARICARE FILE SENZA SELETTORE NATIVO
// Eseguire PRIMA di cliccare (con un clic vero, computer left_click) "Upload files" nella finestra
// "Add sources": l'input file viene trattenuto nel DOM invece di aprire il selettore del Mac.
// Poi: find "hidden file input element" -> file_upload con quel ref e i percorsi locali.
const oc = HTMLInputElement.prototype.click;
HTMLInputElement.prototype.click = function () {
  if (this.type === 'file') {
    if (!this.isConnected) { this.style.display = 'none'; document.body.appendChild(this); }
    return;
  }
  return oc.call(this);
};

// 2) ESTRARRE LE FLASHCARD COME TESTO
// Le flashcard stanno in un iframe cross-origin, ma i dati arrivano in una risposta batchexecute.
// a) Ricaricare il notebook, eseguire questo hook, poi cliccare la voce flashcard nello Studio.
window.__resp = [];
const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; return oo.apply(this, arguments); };
XMLHttpRequest.prototype.send = function () {
  this.addEventListener('load', () => { try { window.__resp.push({ u: String(this.__u).split('?')[0], t: this.responseText }); } catch (e) {} });
  return os.apply(this, arguments);
};
const of = window.fetch;
window.fetch = async function (i) {
  const r = await of.apply(this, arguments);
  try { r.clone().text().then(t => window.__resp.push({ u: String(i && i.url || i).split('?')[0], t })); } catch (e) {}
  return r;
};

// b) Dopo l'apertura: estrarre e preparare il markdown (TITOLO e NOME_FILE da sostituire).
window.__extract = function (raw) {
  const lines = raw.replace(/^\)\]\}'\n/, '').split('\n').filter(l => l.startsWith('[['));
  let html = null;
  function walk(x) {
    if (html) return;
    if (typeof x === 'string') {
      if (x.includes('data-app-data')) {
        const tr = x.trim();
        if (tr.startsWith('[') || tr.startsWith('{')) { try { walk(JSON.parse(x)); return; } catch (e) {} }
        html = x;
      }
    } else if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === 'object') Object.values(x).forEach(walk);
  }
  for (const l of lines) { try { walk(JSON.parse(l)); } catch (e) {} }
  const m = html && html.match(/data-app-data="([^"]*)"/);
  if (!m) return null;
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
};
window.__flashcardLink = function (title, fileName) {
  const r = window.__resp.find(r => r.t.includes('data-app-data'));
  const data = window.__extract(r.t);
  const txt = s => (s && s.flashcardContentBlock || []).filter(b => b.type === 'text').map(b => b.content).join('\n').trim();
  let md = '# ' + title + '\n\nGenerate da NotebookLM (Gemini Notebook) a partire dalle guide di studio e dalle domande verificate. Da ricontrollare: il modello può sbagliare.\n\n';
  data.flashcards.forEach((c, i) => { md += '## ' + (i + 1) + '. ' + txt(c.f).replace(/\n/g, ' ') + '\n\n' + txt(c.b) + '\n\n'; });
  // Chrome blocca i download avviati da script: si crea un link e lo si clicca con un clic vero
  // (find "SCARICA FLASHCARD" -> left_click sul ref), poi lo si rimuove.
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
  a.download = fileName; a.id = 'cc-dl'; a.textContent = 'SCARICA FLASHCARD';
  a.style.cssText = 'position:fixed;top:300px;left:600px;z-index:999999;background:#fff;color:#000;padding:30px;font-size:24px';
  document.body.appendChild(a);
  return data.flashcards.length;
};
