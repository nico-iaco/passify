"""Passo 5: materiale grezzo per scrivere cheat sheet e guida senza rileggere tutto il JSON.
- estratto compatto: per topic, domanda + SOLO la risposta corretta (molti meno token del file intero);
- parole "trappola": termini frequenti nelle opzioni sbagliate e mai (o quasi) in quelle corrette;
- parole "spia": il contrario.
Uso: python3 5_estratto_studio.py ESAME.json OUT_DIR"""
import json, os, re, sys
from collections import Counter, defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import load, letters
exam, q = load(sys.argv[1]); od = sys.argv[2]; os.makedirs(od, exist_ok=True)
by = defaultdict(list)
for x in q: by[x.get('topic', 0)].append(x)
with open(os.path.join(od, 'estratto_compatto.txt'), 'w') as f:
    for t in sorted(by):
        f.write(f"\n=== TOPIC {t} ({len(by[t])} domande) ===\n")
        for x in by[t]:
            ok = " | ".join(x['options'][k] for k in letters(x['answer']) if k in x['options'])
            f.write(f"#{x['id']} {x['question']}\n  => {ok}\n")
STOP = set(open(__file__).read().split('STOPWORDS:')[-1].split())
def grams(s):
    w = [t for t in re.findall(r"[a-z][a-z0-9'-]+", s.lower())]
    g = {t for t in w if t not in STOP and len(t) > 2}
    g |= {f"{a} {b}" for a, b in zip(w, w[1:]) if not (a in STOP and b in STOP)}
    return g
right, wrong = Counter(), Counter(); nr = nw = 0
for x in q:
    k = letters(x['answer'])
    for L, t in x['options'].items():
        if L in k: right.update(grams(t)); nr += 1
        else: wrong.update(grams(t)); nw += 1
rows = []
for g, w in wrong.items():
    r = right[g]; lift = (w / nw) / ((r + 0.5) / nr)
    if w >= 4: rows.append((lift, g, w, r))
with open(os.path.join(od, 'parole_trappola.txt'), 'w') as f:
    f.write(f"# {exam}: {nw} opzioni sbagliate, {nr} corrette. Colonne: parola, n. volte in sbagliate, in corrette\n")
    f.write("## Quasi mai corrette\n")
    for lift, g, w, r in sorted(rows, reverse=True)[:80]: f.write(f"{g:35s} sbagliate {w:3d}  corrette {r}\n")
    f.write("\n## Più frequenti nelle corrette\n")
    spie = [((r / nr) / ((wrong[g] + 0.5) / nw), g, r, wrong[g]) for g, r in right.items() if r >= 4]
    for lift, g, r, w in sorted(spie, reverse=True)[:60]: f.write(f"{g:35s} corrette {r:3d}  sbagliate {w}\n")
print("scritti estratto_compatto.txt e parole_trappola.txt in", od)
# STOPWORDS: a an the to of and or in on for with is are be it its that this which what should their they by as from at can how use using you your need want all any into not only more most than then them these those will was were has have had do does such each other also via within without across per so if but no yes when where who whom whose why while about over under after before between both same new one two
