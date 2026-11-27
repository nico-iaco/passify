"""Passo 3: abbina le domande del file a quelle di ExamTopics (testo riformulato: Jaccard sulle parole,
assegnazione univoca) e confronta la risposta del file con quella più votata dalla community.
Uso: python3 3_confronto_examtopics.py ESAME.json examtopics_voti_raw.json OUT.json"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import load, letters
_, ours = load(sys.argv[1]); et = [e for e in json.load(open(sys.argv[2])) if not e.get('err')]
STOP = set('a an the to of and or in on for with is are be it its that this which what should their they by as from at can how use using you your need want'.split())
tok = lambda s: {w for w in re.findall(r'[a-z0-9]+', s.lower()) if w not in STOP}
jac = lambda a, b: len(a & b) / (len(a | b) or 1)
def parse(q):
    q = q.replace('Show Suggested Answer', '').replace('Hide Answer', '').strip()
    p = re.split(r'\s([A-F])\.\s', ' ' + q)
    return p[0].strip(), {p[i]: p[i+1].strip() for i in range(1, len(p)-1, 2)}
P = [(e,) + parse(e['q']) for e in et]
def map_letters(et_opts, our_opts):
    """Lettera ExamTopics -> lettera del file. Assegnazione univoca greedy sulla somiglianza del testo
    (confronto anche dei caratteri, utile per comandi quasi identici); a parità vince la stessa lettera."""
    from difflib import SequenceMatcher
    sim = lambda a, b: 0.5 * jac(tok(a), tok(b)) + 0.5 * SequenceMatcher(None, a.lower(), b.lower()).ratio()
    c = sorted(((sim(t, our_opts[k]) + (0.001 if L == k else 0), L, k) for L, t in et_opts.items() for k in our_opts), reverse=True)
    m, used = {}, set()
    for sc, L, k in c:
        if L in m or k in used: continue
        m[L] = k; used.add(k)
    return m
TO = {o['id']: (tok(o['question']), tok(' '.join(o['options'].values()))) for o in ours}
def score(stem, opts, oid):
    return 0.5 * jac(tok(stem), TO[oid][0]) + 0.5 * jac(tok(' '.join(opts.values())), TO[oid][1])
pairs = sorted(((score(s, op, o['id']), i, o['id']) for i, (e, s, op) in enumerate(P) for o in ours), reverse=True)
used_e, used_o, assign = set(), set(), {}
for sc, i, oid in pairs:
    if sc < 0.25: break                               # sotto soglia: probabilmente domanda diversa
    if i in used_e or oid in used_o: continue
    used_e.add(i); used_o.add(oid); assign[i] = (oid, sc)
O = {o['id']: o for o in ours}; rows = []
for i, (oid, sc) in assign.items():
    e, stem, opts = P[i]; o = O[oid]
    m = map_letters(opts, o['options'])
    votes = {}
    for L, v in e['votes'].items():
        k = letters(''.join(m.get(c, '?') for c in L)) or '?'; votes[k] = votes.get(k, 0) + v
    top = max(votes, key=votes.get) if votes else None
    rows.append(dict(id=oid, et=f"T{e['t']}Q{e['n']}", sc=round(sc, 2), key=letters(o['answer']), top=top,
                     votes=votes, map=m, bijective=len(set(m.values())) == len(m),
                     url='https://www.examtopics.com/' + e['u'] + '/', ets=stem[:90], os=o['question'][:90]))
json.dump(sorted(rows, key=lambda r: r['id']), open(sys.argv[3], 'w'), indent=1)
same = sum(1 for r in rows if r['top'] == r['key'])
print(f"abbinate {len(rows)}/{len(ours)}; concordi {same}; senza voti {sum(1 for r in rows if not r['votes'])}")
print('non su ET:', sorted(set(O) - {r['id'] for r in rows}))
for r in sorted(rows, key=lambda r: r['sc'])[:8]: print('ABBINAMENTO BASSO', r['sc'], r['id'], r['et'], '|', r['ets'], '||', r['os'])
print('mappa lettere non univoca:', [r['id'] for r in rows if not r['bijective']])
for r in sorted(rows, key=lambda r: r['id']):
    if r['votes'] and r['top'] != r['key']: print('DIFF', r['id'], r['et'], 'file', r['key'], 'voti', r['votes'], r['url'])
