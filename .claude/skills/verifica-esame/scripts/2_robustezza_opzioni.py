"""Passo 2: ripete le domande con le opzioni ruotate. Chi conosce davvero la risposta sceglie sempre
lo stesso testo; se la scelta cambia con l'ordine, il modello tira a indovinare.
Uso: python3 2_robustezza_opzioni.py ESAME.json OUT.json [--model qwen3.5:9b] [--salta-confermate confronto_examtopics.json]
Con --salta-confermate controlla solo le domande che ExamTopics non conferma (molto più veloce: ~20 s a domanda)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import load, letters, ollama, prompt_user
src, out = sys.argv[1], sys.argv[2]
model = sys.argv[sys.argv.index('--model') + 1] if '--model' in sys.argv else 'qwen3.5:9b'
exam, q = load(src)
if '--salta-confermate' in sys.argv:
    ok = {r['id'] for r in json.load(open(sys.argv[sys.argv.index('--salta-confermate') + 1])) if r['votes'] and r['top'] == r['key']}
    q = [x for x in q if x['id'] not in ok]; print("da controllare:", len(q), flush=True)
SYS = (f"You are an expert on the '{exam}' certification exam. Answer the multiple-choice question. "
       'Reply ONLY with JSON: {"answer":"<letter(s)>"}')
L = "ABCDEF"; res = json.load(open(out)) if os.path.exists(out) else {}
for x in q:
    if str(x['id']) in res: continue
    keys = list(x['options']); key = letters(x['answer']); hits = []
    for rot in (1, 2):
        perm = keys[rot:] + keys[:rot]            # nuova lettera i -> lettera originale perm[i]
        opts = {L[i]: x['options'][k] for i, k in enumerate(perm)}
        try:
            a = ollama(model, SYS, prompt_user(x, opts), num_predict=50, timeout=120)["answer"]
            hits.append(letters(''.join(perm[L.index(c)] for c in a if c in L[:len(perm)])) or '?')
        except Exception: hits.append('?')
    res[str(x['id'])] = {"key": key, "rot": hits, "unstable": any(h != key for h in hits)}
    json.dump(res, open(out, "w"), indent=1)
    print(x['id'], key, *hits, flush=True)
print("DONE instabili:", [k for k, v in res.items() if v["unstable"]])
