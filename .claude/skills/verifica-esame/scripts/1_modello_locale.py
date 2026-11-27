"""Passo 1: il modello locale risponde a tutte le domande; sui disaccordi riprova chiedendo prima una breve analisi.
(Il "thinking" di qwen3.5 è stato scartato: ~200 s a domanda e spesso esaurisce i token senza rispondere.)
Uso: python3 1_modello_locale.py ESAME.json OUT.json [--model qwen3.5:9b]
Riprende da dove si era fermato (salvataggio a ogni domanda)."""
import json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import load, letters, ollama, prompt_user
src, out = sys.argv[1], sys.argv[2]
model = sys.argv[sys.argv.index('--model') + 1] if '--model' in sys.argv else 'qwen3.5:9b'
exam, q = load(src)
SYS = (f"You are an expert on the '{exam}' certification exam and on the vendor's products. "
       "Answer the multiple-choice question. If asked to select several answers, give all their letters. "
       'Reply ONLY with JSON: {"answer":"<letter(s), e.g. B or BD>","confidence":<1-5>,"why":"<max 25 words>"}')
SYS2 = SYS.replace('Reply ONLY with JSON: {"answer"', 'Reply ONLY with JSON: {"analysis":"<evaluate each option in max 15 words each>","answer"')
res = json.load(open(out)) if os.path.exists(out) else {}
for x in q:
    if str(x["id"]) in res: continue
    t = time.time(); key = letters(x["answer"])
    try: a = ollama(model, SYS, prompt_user(x))
    except Exception as e: a = {"answer": "?", "err": str(e)}
    rec = {"id": x["id"], "key": key, "p1": a}
    if a["answer"] != key:
        try: rec["p2"] = ollama(model, SYS2, prompt_user(x), num_predict=700, timeout=180)
        except Exception as e: rec["p2"] = {"answer": "?", "err": str(e)}
    res[str(x["id"])] = rec
    json.dump(res, open(out, "w"), indent=1, ensure_ascii=False)
    print(x["id"], key, a["answer"], rec.get("p2", {}).get("answer", ""), f"{time.time()-t:.0f}s", flush=True)
agree = sum(1 for r in res.values() if r["p1"]["answer"] == r["key"] or r.get("p2", {}).get("answer") == r["key"])
print(f"DONE d'accordo {agree}/{len(res)}")
