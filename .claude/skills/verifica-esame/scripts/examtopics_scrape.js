// Da eseguire con javascript_tool in una scheda su https://www.examtopics.com (già aperta e senza captcha).
// Sostituire __VENDOR__ (es. google) e __SLUG__ (es. associate-cloud-engineer, come compare negli URL
// "…/view/123-exam-__SLUG__-topic-1-question-5-discussion/"). Gira in background: lo stato è in window.S,
// i risultati anche in localStorage ('etRes'); alla fine li invia a ricevitore.py (127.0.0.1:8765).
window.S = {pages: 0, prog: 0, urls: [], res: [], eprog: 0, done: false, post: null};
(async () => {
  const V = '__VENDOR__', SLUG = '__SLUG__';
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // ExamTopics è dietro Cloudflare: oltre ~1 richiesta/s risponde 429 o "Just a moment". Ritardo + retry.
  async function get(u) { for (let i = 0; i < 5; i++) { try { const r = await fetch(u); const t = await r.text();
    if (r.status === 200 && !t.includes('Just a moment')) return t; } catch (e) {} await sleep(15000); } return null; }
  const first = await get(`/discussions/${V}/`);
  // Il paginatore mostra solo "Next": il totale è nell'indicatore "3624 Discussions Page 1 of 182".
  S.pages = +(((first || '').replace(/<[^>]+>/g, '')).match(/Page\s+1\s+of\s+(\d+)/) || [0, 0])[1];
  if (!S.pages) { S.done = true; S.post = 'ERR numero di pagine non trovato'; return; }
  const re = new RegExp(`discussions/${V}/view/\\d+-exam-${SLUG}-topic-\\d+-question-\\d+-discussion`, 'g');
  const set = new Set();
  for (let p = 1; p <= S.pages; p++) {
    const t = p === 1 ? first : await get(`/discussions/${V}/${p}/`);
    (t?.match(re) || []).forEach(x => set.add(x)); S.prog = p; S.urls = [...set]; await sleep(1200);
  }
  for (const u of S.urls) {
    const t = await get('/' + u + '/'); S.eprog++;
    if (!t) { S.res.push({u, err: 1}); continue; }
    const d = new DOMParser().parseFromString(t, 'text/html'); const qb = d.querySelector('.question-body');
    // Voti: ogni commento principale con "Selected Answer: X" vale 1 + i suoi upvote (risposte ai commenti escluse).
    const votes = {};
    d.querySelectorAll('.comment-container').forEach(c => { if (c.parentElement.closest('.comment-container')) return;
      const m = c.textContent.match(/Selected Answer:\s*([A-F]+)/); if (m) {
        const up = parseInt(c.querySelector('.upvote-count')?.textContent) || 0; votes[m[1]] = (votes[m[1]] || 0) + 1 + up; } });
    const tn = u.match(/topic-(\d+)-question-(\d+)/);
    S.res.push({u, t: +tn[1], n: +tn[2], q: (qb?.innerText || qb?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 1500), votes});
    try { localStorage.setItem('etRes', JSON.stringify(S.res)); } catch (e) {}
    await sleep(1200);
  }
  S.done = true;
  if (!S.res.length) { S.post = 'ERR nessuna discussione trovata: controllare lo slug'; return; }
  try { S.post = await (await fetch('http://127.0.0.1:8765/', {method: 'POST',
    headers: {'Content-Type': 'application/json'}, body: JSON.stringify(S.res)})).text(); } catch (e) { S.post = 'ERR ' + e; }
})();
'started'
// Controllo avanzamento: ({pages:S.pages, prog:S.prog, n:S.urls.length, e:S.eprog, done:S.done, post:S.post})
