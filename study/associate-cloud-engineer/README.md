# Studio — Google Cloud Associate Cloud Engineer

| File | A cosa serve |
|---|---|
| [01-cheat-sheet.md](01-cheat-sheet.md) | Da tenere aperto durante i quiz: regole d'oro, parole trappola, tabelle "scenario → risposta", coppie trabocchetto |
| [02-guida-temi.md](02-guida-temi.md) | Guida ai 4 topic dell'esame con le definizioni in italiano e in inglese |
| [`public/samples/google-associateCloudEngineer-examcademy.json`](../../public/samples/google-associateCloudEngineer-examcademy.json) | Le 354 domande di examcademy, da caricare in Passify |
| [verifica/](verifica/) | Risultati del controllo delle risposte (`sospette.md` è l'elenco rivisto a mano) |

Verifica fatta con la skill [`verifica-esame`](../../.claude/skills/verifica-esame/SKILL.md).

## Come sono state verificate le risposte

1. **Modello locale** (`qwen3.5:9b` via Ollama): d'accordo con il file su 298 domande su 354.
2. **ExamTopics**: 334 discussioni raccolte, 314 domande abbinate per testo, **302 concordi** con il file.
   40 domande non sono su ExamTopics (#7, #39, #83, #123, #135, #166, #183, #202, #234, #267, #309, #317,
   #330, #335, #338, #343, #350–#354, #356, #357, #359–#375).
3. **Robustezza** (opzioni ruotate) sulle 52 domande non confermate da ExamTopics.
4. **Revisione manuale** delle 21 domande segnalate, con i commenti più votati su ExamTopics per le più dubbie.

**Esito: nessuna risposta da correggere.**

### Domande discutibili (chiave tenuta, ma la community è divisa)
| # | Chiave | Alternativa | Note |
|---|---|---|---|
| 142 | A — Storage Transfer Service | B — Transfer Appliance | 150 TB, "control bandwidth": STS ha i limiti di banda; voti 6–7 |
| 209 | B — risorse insufficienti | D — nodo Spot prelazionato | voti 59–62, ma il commento più votato (60 upvote) dice B |
| 337 | B — VM custom 6 vCPU / 32 GB | A — Memorystore | Memorystore non è un reverse proxy; custom VM = costo minimo |
| 340 | C — max istanze Cloud Run | A — min istanze | quota Admin API di Cloud SQL; la community preferisce A (cold start) |
| 344 | B — client RDP + credenziali | D — pulsante RDP in console | voti 64–80 |

### Falsi allarmi
Su #26, #139, #196, #216, #326 i voti di ExamTopics non vanno contro la chiave: o sono pochissimi
(2 voti), o i commenti più votati danno ragione al file, o si riferiscono a una versione vecchia delle
opzioni (es. "HTTPS load balancer" diventato "external Application Load Balancer").
