"""Passo 4: incrocia i risultati e produce l'elenco delle domande da rivedere a mano, già con tutto
quello che serve per giudicarle (testo, opzioni, chiave, risposte del modello, voti ExamTopics, link).
Uso: python3 4_sospette.py ESAME.json risultati_modello_locale.json robustezza.json confronto_examtopics.json OUT.md
(i file mancanti si possono passare come '-')."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import load, letters
exam, q = load(sys.argv[1])
rd = lambda p: json.load(open(p)) if p != '-' and os.path.exists(p) else None
mod, rob, et = rd(sys.argv[2]) or {}, rd(sys.argv[3]) or {}, {r['id']: r for r in (rd(sys.argv[4]) or [])}
out = []; stats = {"ET contro": 0, "ET pari": 0, "modello contro": 0, "instabile": 0}
for x in q:
    i, key = x['id'], letters(x['answer']); why = []; e = et.get(i)
    ev = e['votes'] if e else {}; kv = ev.get(key, 0); best = max(ev.values()) if ev else 0
    et_ok = bool(ev) and e['top'] == key and kv > sorted(ev.values())[-2:][0] if len(ev) > 1 else bool(ev) and e['top'] == key
    if ev and best > kv:
        why.append(f"ExamTopics vota {e['top']} ({best}) contro {key} ({kv})"); stats["ET contro"] += 1
    elif ev and len(ev) > 1 and sorted(ev.values())[-1] == sorted(ev.values())[-2]:
        why.append(f"ExamTopics in pareggio {ev}"); stats["ET pari"] += 1
    m = mod.get(str(i))
    if m:
        p1, p2 = m['p1']['answer'], m.get('p2', {}).get('answer')
        if p1 != key and p2 not in (None, key) and not et_ok:
            why.append(f"modello risponde {p1}/{p2}"); stats["modello contro"] += 1
    r = rob.get(str(i))
    if r and r['unstable'] and not et_ok and not why:
        why.append(f"modello instabile con le opzioni ruotate {r['rot']}"); stats["instabile"] += 1
    if not why: continue
    s = [f"## #{i} (topic {x.get('topic')}) — chiave {key}", "**Perché:** " + "; ".join(why), "", x['question'], ""]
    s += [f"- {k}. {v}" for k, v in x['options'].items()]
    if m: s.append(f"\nModello: {m['p1']['answer']} «{m['p1'].get('why','')}»" + (f" → con ragionamento {m['p2']['answer']} «{m['p2'].get('why','')}»" if 'p2' in m else ''))
    if e: s.append(f"ExamTopics {e['et']} voti {ev} — {e['url']}")
    if x.get('url'): s.append(f"Fonte: {x['url']}")
    out.append("\n".join(s))
head = [f"# Domande da rivedere — {exam}", f"{len(out)} su {len(q)}. Conteggi: {stats}",
        "Non segnalate: chiave confermata da ExamTopics, oppure modello d'accordo e stabile.", ""]
open(sys.argv[5], 'w').write("\n".join(head) + "\n\n" + "\n\n".join(out) + "\n")
print(len(out), "sospette", stats, "->", sys.argv[5])
