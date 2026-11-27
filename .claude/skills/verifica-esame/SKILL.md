---
name: verifica-esame
description: Verifica le risposte di un file di domande d'esame (JSON in formato Passify, es. esportato da examcademy) e prepara il materiale di studio. USARE quando l'utente allega o indica un JSON di domande di certificazione (Google Cloud, AWS, Azure…) e chiede di "controllare le risposte", "verificare l'esame", "trovare le risposte sbagliate", "preparare cheat sheet / guida di studio", o di "fare lo stesso lavoro" su un nuovo esame, o di aggiungerlo agli esami di Passify.
---

# Verifica di un esame e materiale di studio

Obiettivo: trovare le risposte sbagliate di un file d'esame **spendendo pochi token**. Il lavoro di massa
lo fanno un modello locale (Ollama) e i voti della community di ExamTopics; Claude legge solo le domande
che risultano sospette. Poi si preparano cheat sheet e guida bilingue e si aggiunge l'esame a Passify.

Gli script sono in `scripts/` (accanto a questo file). Lanciarli dalla root della repo passify,
con `S=.claude/skills/verifica-esame/scripts`.

## Regole

- **Il JSON dell'utente non si modifica** finché l'utente non approva il report delle correzioni.
- **Niente commit/push** se l'utente non lo chiede.
- Mai leggere tutto il JSON nel contesto: per i controlli bastano gli output degli script; per il
  materiale di studio c'è l'estratto compatto (passo 5).
- Il modello locale d'accordo con la chiave **non** conferma nulla (un 9B sbaglia spesso nello stesso
  modo del file). La conferma vera viene da ExamTopics: per questo il confronto si fa su **tutte** le domande.

## Formato del file

```json
{"exam": "Associate Cloud Engineer",
 "questions": [{"id": 1, "topic": 3, "question": "...", "options": {"A": "...", "B": "..."},
                "answer": "A", "url": "https://examcademy.com/..."}]}
```
`answer` può essere multipla (`"C, D"`): gli script la normalizzano in `CD`.

## Passi

### 0. Preparazione
1. Nome file: `public/samples/<vendor>-<esameCamelCase>-examcademy.json` (es. `google-associateCloudEngineer-examcademy.json`).
   Copiarlo lì **senza modifiche**. Se esiste già un file con lo stesso esame da un'altra fonte, non toccarlo.
2. Cartella di lavoro: `study/<slug-esame>/verifica/` (slug come negli URL, es. `associate-cloud-engineer`).
3. Controllare Ollama: `curl -s localhost:11434/api/tags`. Modello predefinito `qwen3.5:9b` (`--model` per cambiarlo).

Ordine: **passo 1 e passo 3 in parallelo**; il passo 2 dopo il 3, solo sulle domande non confermate.

### 1. Modello locale (in background)
```bash
E=public/samples/<file>.json; V=study/<slug>/verifica
python3 $S/1_modello_locale.py $E $V/risultati_modello_locale.json >> $V/log_modello.txt 2>&1
```
Lanciare con `run_in_background` e **non** fare polling: si viene avvisati alla fine.
Salva a ogni domanda e riprende da dove era rimasto se rilanciato.
Tempi su M3 Pro: ~3–4 s a domanda, ~10 s sui disaccordi (secondo passaggio con breve analisi per
opzione nel JSON). Il "thinking" di qwen3.5 è stato scartato: ~200 s a domanda e spesso nessuna risposta.
Riferimento: Associate Cloud Engineer, 354 domande in ~25 min, d'accordo su 298.

### 2. Robustezza (dopo il passo 3)
```bash
python3 $S/2_robustezza_opzioni.py $E $V/robustezza.json --salta-confermate $V/confronto_examtopics.json >> $V/log_robustezza.txt 2>&1
```
Ripete le domande con le opzioni ruotate (~20 s a domanda). Su tutto l'esame sarebbero ore: con
`--salta-confermate` controlla solo quelle che ExamTopics non conferma.

### 3. Voti ExamTopics (in parallelo al passo 1)
Con **Claude in Chrome** (il browser dell'utente: ExamTopics è dietro Cloudflare e il browser integrato
viene bloccato):
1. Avviare il ricevitore in background: `python3 $S/ricevitore.py $V/examtopics_voti_raw.json`.
2. Aprire `https://www.examtopics.com/discussions/<vendor>/` e, se c'è il controllo "Just a moment",
   aspettare che passi (mai risolvere captcha: se serve, chiedere all'utente).
3. Leggere `$S/examtopics_scrape.js`, sostituire `__VENDOR__` e `__SLUG__` (lo slug è quello degli URL
   delle discussioni: `…-exam-<slug>-topic-1-question-5-discussion`; verificarlo prima cercando il nome
   dell'esame in una pagina dell'elenco) ed eseguirlo con `javascript_tool`.
4. Subito dopo l'avvio, un solo controllo con la riga in fondo allo script: `pages` deve essere > 1
   (es. 182 per google) e `n` deve crescere. Poi **non fare polling**: il ricevitore in background si
   chiude quando arrivano i dati e la notifica arriva da sola. Le attese dentro `javascript_tool`
   oltre ~40 s vanno in timeout (il codice però resta in esecuzione nella pagina).
   Lo script rispetta ~1 richiesta/s: elenco 182 pagine ≈ 4 min, poi ~1,5 s a discussione.
5. A fine raccolta lo script fa POST al ricevitore, che salva il file e si chiude.
   Se `S.post` inizia con `ERR`, leggere il messaggio (slug sbagliato, pagine non trovate); i dati
   parziali sono in `localStorage.etRes`. Non ricaricare la scheda mentre gira: si perde lo stato.

Note: le pagine delle domande dell'esame su ExamTopics sono a pagamento dopo le prime 20, le
**discussioni** invece sono pubbliche: per questo si passa dall'elenco discussioni.

```bash
python3 $S/3_confronto_examtopics.py $E $V/examtopics_voti_raw.json $V/confronto_examtopics.json
```
Le domande sono riformulate tra i due siti: l'abbinamento usa la sovrapposizione delle parole con
assegnazione univoca, anche per le lettere delle opzioni (che su ExamTopics possono essere in ordine
diverso). Controllare le righe `ABBINAMENTO BASSO` (se le domande non sono la stessa, ignorare quel
confronto). Riferimento: Associate Cloud Engineer, 314 domande abbinate su 354, 302 concordi.

**Attenzione ai falsi allarmi**: sulle domande vecchie di ExamTopics (numero basso, migliaia di voti
storici) le opzioni sono spesso cambiate nel tempo (es. "HTTPS load balancer" → "external Application
Load Balancer"), quindi i voti possono riferirsi a un'altra versione. Prima di dar ragione ai voti,
leggere i 3 commenti più votati (snippet JS sotto) e verificare che parlino delle stesse opzioni.

```js
// commenti più votati di una discussione (u = parte dell'URL dopo /view/)
const t=await (await fetch('/discussions/google/view/'+u+'/')).text(); const d=new DOMParser().parseFromString(t,'text/html');
[...d.querySelectorAll('.comment-container')].filter(c=>!c.parentElement.closest('.comment-container'))
 .map(c=>({up:parseInt(c.querySelector('.upvote-count')?.textContent)||0, t:(c.querySelector('.comment-content')?.textContent||'').trim().replace(/\s+/g,' ').slice(0,260)}))
 .sort((a,b)=>b.up-a.up).slice(0,3)
```

### 4. Elenco delle sospette
```bash
python3 $S/4_sospette.py $E $V/risultati_modello_locale.json $V/robustezza.json $V/confronto_examtopics.json $V/sospette.md
```
Segnala: ExamTopics vota contro la chiave; ExamTopics in pareggio; modello contrario (anche con
ragionamento) e nessuna conferma ExamTopics; modello instabile senza conferma ExamTopics.
Leggere **solo** `sospette.md`. Per ognuna, decidere con le proprie conoscenze; se resta dubbia,
aprire la discussione ExamTopics (link nel file) e/o la pagina examcademy (`url`) e leggere i commenti
più votati, tenendo conto che la community a volte sbaglia e che i prodotti cambiano nome.
Se le sospette sono tantissime (>40), procedere per priorità: prima "ExamTopics contro", poi il resto.

### 5. Report all'utente
Tabella: `#id | chiave attuale | proposta | motivo (1 riga) | fonti`. Chiudere con le domande
confermate e quelle non verificabili (non su ExamTopics e modello incerto). Chiedere l'ok, poi
applicare **solo** le correzioni approvate al JSON (modifica mirata del campo `answer`).

### 6. Materiale di studio
```bash
python3 $S/5_estratto_studio.py $E study/<slug>/verifica
```
Produce `estratto_compatto.txt` (per topic: domanda + sola risposta corretta) e `parole_trappola.txt`
(termini frequenti nelle opzioni sbagliate e mai nelle corrette, e viceversa: grezzi, da filtrare a
buon senso). L'estratto è grande (~150 KB per 350 domande): affidare la scrittura a un sottoagente
in background con `model: sonnet`, passandogli i percorsi dei due file, quello del JSON (solo per
consultazioni mirate) e l'esempio di riferimento sotto. Il sottoagente legge l'estratto un topic alla
volta e scrive in `study/<slug>/`:
- `01-cheat-sheet.md` — da consultare durante i quiz: regole d'oro; tabella **parole/frasi che indicano
  un'opzione MAI corretta** (con esempio `#id`); parole che indicano la risposta giusta; tabelle
  "scenario → risposta" per area con riferimenti `#id`; coppie trabocchetto (servizi che si confondono).
- `02-guida-temi.md` — guida per topic con definizioni **in italiano e in inglese** (termine EN, spiegazione
  IT, frase EN come la usa l'esame), conteggio domande per topic.
- `README.md` — indice dei file e come sono state verificate le risposte (numeri di ogni passo, domande
  non presenti su ExamTopics, esito, comandi per rilanciare).
Esempio di riferimento già fatto: `study/generative-ai-leader/`.

### 7. Aggiungere l'esame a Passify
- `src/components/UploadScreen.tsx`: nuova voce nell'array `SAMPLES` (`file`, `label`, `count`, `icon` emoji).
- `README.md` della repo: riga nella tabella "Esami inclusi".
- Verifica: `npx tsc --noEmit` e `npm run build`; poi `vite preview` (o dev server) e caricare l'esame
  dalla schermata iniziale per vedere che parta con il numero giusto di domande e di topic.
