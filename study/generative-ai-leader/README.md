# Studio — Google Cloud Generative AI Leader

| File | A cosa serve |
|---|---|
| [01-cheat-sheet.md](01-cheat-sheet.md) | Da tenere aperto durante i quiz: regole d'oro, parole trappola, tabella "scenario → risposta", coppie trabocchetto |
| [02-guida-temi.md](02-guida-temi.md) | Guida ai 4 topic dell'esame con le definizioni in italiano e in inglese |
| [`public/samples/google-generativeAiLeader-examcademy.json`](../../public/samples/google-generativeAiLeader-examcademy.json) | Le 99 domande di examcademy, da caricare in Passify |
| [verifica/](verifica/) | Script e risultati del controllo delle risposte |
| [notebooklm/](notebooklm/) | Materiale generato con NotebookLM: infografica, slide PDF, flashcard, podcast audio (solo in locale) |

> Nella repo c'era già `public/samples/google-generativeAiLeader.json`, con 71 domande di un'altra fonte:
> non è stato toccato.

## Come sono state verificate le risposte

1. **Modello locale** (`verifica/1_modello_locale.py`): `qwen3.5:9b` via Ollama ha risposto alle 99 domande;
   dove non era d'accordo con la risposta del file, ha riprovato con il ragionamento attivo.
   Risultato: d'accordo su 97 domande su 99.
2. **Robustezza** (`verifica/2_robustezza_opzioni.py`): stesse domande con le opzioni in ordine diverso,
   per capire se il modello conosce davvero la risposta o tira a indovinare. 6 domande segnalate come dubbie.
3. **Revisione manuale** delle domande segnalate (#6, #25, #47, #63, #80, #83, #84) e controllo su examcademy
   delle due più dubbie (#47, #83): tutte corrette.
4. **Confronto con ExamTopics** (`verifica/3_confronto_examtopics.py`): 77 domande abbinate per testo
   alle discussioni pubbliche di ExamTopics, confrontando la risposta più votata dalla community.
   - 76 su 77 coincidono con la risposta del file.
   - Lo script segnala anche #42 e #57 con voto `?`: il testo estratto era troncato e le lettere
     non si abbinano in automatico, ma controllandole a mano i voti (C=7, B=3) coincidono con il file.
   - #12: pareggio 2–2 tra A (role prompting) e B (few-shot); il file tiene A.
   - 22 domande non sono su ExamTopics: #5, #76, #77, #79–#83, #85–#89, #91–#99.

**Esito: nessuna risposta da correggere.**

### Rilanciare i controlli
Servono Ollama con `qwen3.5:9b` per i passi 1 e 2. Il passo 4 usa `examtopics_voti_raw.json`,
estratto dal browser.

```bash
cd study/generative-ai-leader/verifica
python3 1_modello_locale.py ../../../public/samples/google-generativeAiLeader-examcademy.json risultati_modello_locale.json
python3 2_robustezza_opzioni.py ../../../public/samples/google-generativeAiLeader-examcademy.json robustezza.json
python3 3_confronto_examtopics.py ../../../public/samples/google-generativeAiLeader-examcademy.json examtopics_voti_raw.json confronto_examtopics.json
```
