import json, sys, urllib.request, re, time
src, out = sys.argv[1], sys.argv[2]
q = json.load(open(src))['questions']
SYS = ("You are an expert on Google Cloud and the Google Cloud Generative AI Leader certification exam "
       "(Gemini, Vertex AI, Agentspace, Model Garden, responsible AI, prompting, grounding, RAG, TPUs). "
       "Answer the multiple-choice question with exactly one letter. "
       'Reply ONLY with JSON: {"answer":"<A|B|C|D>","confidence":<1-5>,"why":"<max 25 words>"}')
def ask(x, think):
    opts = "\n".join(f"{k}. {v}" for k, v in x['options'].items())
    body = {"model": "qwen3.5:9b", "stream": False, "think": think, "format": "json",
            "options": {"temperature": 0, "num_ctx": 8192, "num_predict": 3000 if think else 300},
            "messages": [{"role": "system", "content": SYS},
                         {"role": "user", "content": f"{x['question']}\n\n{opts}"}]}
    r = urllib.request.urlopen(urllib.request.Request("http://localhost:11434/api/chat",
        data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}), timeout=400)
    c = json.loads(r.read())["message"]["content"]
    try: return json.loads(c)
    except Exception:
        m = re.search(r'"answer"\s*:\s*"([ABCD])"', c); return {"answer": m.group(1) if m else "?", "raw": c[:200]}
import os
res = json.load(open(out)) if os.path.exists(out) else {}
for x in q:
    if str(x["id"]) in res: continue
    t = time.time(); a = ask(x, False)
    rec = {"id": x["id"], "key": x["answer"], "p1": a}
    if a.get("answer") != x["answer"]:
        try: rec["p2"] = ask(x, True)
        except Exception as e: rec["p2"] = {"answer": "?", "err": str(e)}  # second opinion with reasoning on disagreement
    res[str(x["id"])] = rec
    json.dump(res, open(out, "w"), indent=1, ensure_ascii=False)
    print(x["id"], x["answer"], a.get("answer"), rec.get("p2", {}).get("answer", ""), f"{time.time()-t:.0f}s", flush=True)
json.dump(res, open(out, "w"), indent=1, ensure_ascii=False)
print("DONE")
