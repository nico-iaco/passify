import json, re, sys
ours = json.load(open(sys.argv[1]))['questions']; et = [e for e in json.load(open(sys.argv[2])) if not e.get('err')]
STOP = set('a an the to of and or in on for with is are be it its that this which what should their they its by as from at can how use using'.split())
tok = lambda s: {w for w in re.findall(r'[a-z0-9]+', s.lower()) if w not in STOP}
jac = lambda a, b: len(a & b) / (len(a | b) or 1)
def parse(q):
    q = q.replace('Show Suggested Answer', '').strip(); p = re.split(r'\s([A-F])\.\s', ' ' + q)
    return p[0].strip(), {p[i]: p[i+1].strip() for i in range(1, len(p)-1, 2)}
P = [(e,) + parse(e['q']) for e in et]
def score(stem, opts, o):
    return 0.5 * jac(tok(stem), tok(o['question'])) + 0.5 * jac(tok(' '.join(opts.values())), tok(' '.join(o['options'].values())))
pairs = sorted(((score(s, op, o), i, o['id']) for i, (e, s, op) in enumerate(P) for o in ours), reverse=True)
used_e, used_o, assign = set(), set(), {}
for sc, i, oid in pairs:
    if i in used_e or oid in used_o: continue
    used_e.add(i); used_o.add(oid); assign[i] = (oid, sc)
O = {o['id']: o for o in ours}; rows = []
for i, (oid, sc) in assign.items():
    e, stem, opts = P[i]; o = O[oid]
    m = {L: max(o['options'], key=lambda k: jac(tok(t), tok(o['options'][k]))) for L, t in opts.items()}
    votes = {}
    for L, v in e['votes'].items():
        k = ''.join(sorted(m.get(c, '?') for c in L)); votes[k] = votes.get(k, 0) + v
    rows.append(dict(id=oid, et=f"T{e['t']}Q{e['n']}", sc=round(sc, 2), key=o['answer'], top=max(votes, key=votes.get) if votes else None,
                     votes=votes, map=m, url='https://www.examtopics.com/' + e['u'] + '/', ets=stem[:90], os=o['question'][:90]))
json.dump(rows, open(sys.argv[3], 'w'), indent=1)
print('not on ET', sorted(set(O) - {r['id'] for r in rows}))
for r in sorted(rows, key=lambda r: r['sc'])[:12]: print('LOW', r['sc'], r['id'], r['et'], '|', r['ets'], '||', r['os'])
print('bijective maps fail:', [r['id'] for r in rows if len(set(r['map'].values())) != len(r['map'])])
for r in sorted(rows, key=lambda r: r['id']):
    if r['top'] != r['key']: print('DIFF', r['id'], r['et'], 'key', r['key'], 'votes', r['votes'], r['url'])
