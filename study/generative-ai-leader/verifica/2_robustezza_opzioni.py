# Robustness check: re-ask with options rotated; a model that really knows keeps choosing the same option text.
import json, sys, urllib.request
src, out = sys.argv[1], sys.argv[2]
q = json.load(open(src))['questions']
SYS = ("You are an expert on Google Cloud and the Google Cloud Generative AI Leader certification exam. "
       'Answer with exactly one letter. Reply ONLY with JSON: {"answer":"<A|B|C|D>"}')
L = "ABCD"; bad = []
for x in q:
    keys = list(x['options']); hits = []
    for rot in (1, 2):
        perm = keys[rot:] + keys[:rot]           # new letter i -> original letter perm[i]
        opts = "\n".join(f"{L[i]}. {x['options'][k]}" for i, k in enumerate(perm))
        body = {"model": "qwen3.5:9b", "stream": False, "think": False, "format": "json",
                "options": {"temperature": 0, "num_predict": 50},
                "messages": [{"role": "system", "content": SYS}, {"role": "user", "content": f"{x['question']}\n\n{opts}"}]}
        c = json.loads(urllib.request.urlopen(urllib.request.Request("http://localhost:11434/api/chat",
              data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}), timeout=120).read())["message"]["content"]
        try: a = json.loads(c)["answer"]; hits.append(perm[L.index(a)])
        except Exception: hits.append("?")
    print(x['id'], x['answer'], *hits, flush=True)
    if any(h != x['answer'] for h in hits): bad.append((x['id'], x['answer'], hits))
json.dump(bad, open(out, "w")); print("DONE", bad)
