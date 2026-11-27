"""Funzioni condivise: lettura esame, normalizzazione risposte, chiamata a Ollama."""
import json, re, urllib.request

def load(path):
    d = json.load(open(path))
    return d.get('exam', ''), d['questions']

def letters(s):
    """'C, D' -> 'CD'; 'b' -> 'B'."""
    return ''.join(sorted(set(re.findall(r'[A-F]', str(s).upper()))))

def ollama(model, system, user, think=False, num_predict=300, timeout=400):
    body = {"model": model, "stream": False, "think": think, "format": "json",
            "options": {"temperature": 0, "num_ctx": 8192, "num_predict": num_predict},
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]}
    r = urllib.request.urlopen(urllib.request.Request("http://localhost:11434/api/chat",
        data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}), timeout=timeout)
    c = json.loads(r.read())["message"]["content"]
    try:
        a = json.loads(c)
    except Exception:
        m = re.search(r'"answer"\s*:\s*"([^"]+)"', c)
        a = {"answer": m.group(1) if m else "?", "raw": c[:200]}
    a["answer"] = letters(a.get("answer", "")) or "?"
    return a

def prompt_user(x, opts=None):
    opts = opts or x['options']
    n = len(letters(x['answer']))
    head = f"(Select exactly {n} answers.)\n" if n > 1 else ""
    return head + x['question'] + "\n\n" + "\n".join(f"{k}. {v}" for k, v in opts.items())
