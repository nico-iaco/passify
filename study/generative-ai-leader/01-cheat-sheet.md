# Generative AI Leader — Cheat sheet per i test

Da tenere aperto mentre fai i quiz. Ricavato dalle 99 domande di examcademy (risposte verificate
con un modello locale e con i voti della community di ExamTopics). Il numero tra parentesi `#n`
è l'`id` della domanda nel JSON.

> **Nomi nuovi, stessi prodotti.** Alcune domande usano il nuovo naming Google:
> **Gemini Enterprise Agent Platform** = Vertex AI · **Agent Studio** = Vertex AI Studio ·
> **Agent Search** = Vertex AI Search · **Gemini Enterprise** = Google Agentspace.
> Ragiona sul prodotto, non sul nome.

---

## 1. Le 8 regole d'oro

1. **La risposta giusta è quasi sempre la più "Google-ufficiale" e la più bilanciata.**
   Non è la più tecnica né la più estrema: è quella che userebbe un manager con il manuale Google in mano.
2. **Prima il problema di business, poi la tecnologia** (#48). Si parte da obiettivi e risultati attesi,
   non da modelli, piattaforme o numero di persone formate.
3. **La soluzione più semplice/economica che risolve il problema** batte quella custom.
   Prodotto preconfezionato > RAG > prompt engineering > fine-tuning > addestrare da zero (#26, #92, #95).
4. **Dati aggiornati o aziendali → RAG / grounding**, mai fine-tuning e mai "più dati di training" (#4, #40, #43, #45, #46, #95).
5. **L'umano resta nel giro.** Le opzioni che eliminano la supervisione umana sono sbagliate (#38, #42, #76).
6. **Responsible AI = trasparenza, spiegabilità, equità, privacy, accountability.**
   Se il problema è "decisioni senza motivo" o "reclami/bias" → **explainability** (#3, #72).
7. **Gen AI aumenta le persone, non le sostituisce.** Libera tempo per relazioni e strategia (#15, #63).
8. **Google = aperto, AI-first, scelta del cliente.** Le opzioni "proprietario/chiuso", "zero configurazione",
   "sostituire i lavoratori" sono sempre sbagliate (#13, #56).

---

## 2. Parole che indicano che l'opzione è (quasi) MAI corretta

| Parola / frase nell'opzione | Perché è sbagliata | Esempi |
|---|---|---|
| **guarantee / guaranteeing / errorless / zero** | La gen AI non garantisce nulla | "Guaranteeing errorless code" (#76) |
| **eliminate / replace / without human review / no human intervention** | Contro human-in-the-loop | "rank all candidates without requiring human review" (#38), "Eliminating the need for human intervention" (#76), "replace human jobs" (#56) |
| **completely / fully autonomous / zero configuration** | Assoluti irrealistici | "fully autonomous AI agents that require zero configuration" (#13) |
| **proprietary / closed-source / strict adherence to proprietary** | Google si presenta come *open* | #13, #56 |
| **unlimited / free / factor of ten / quantum** | Affermazioni assurde | #81 |
| **increase the temperature** (per correggere errori/allucinazioni) | La temperatura alta aumenta la casualità, non l'accuratezza | #4, #42 |
| **train / fine-tune on a larger dataset** come cura per allucinazioni o info aggiornate | Costoso e non risolve dati che cambiano | #4, #46, #95 |
| **stricter safety settings** (per problemi di accuratezza o sarcasmo) | Le safety settings filtrano contenuti dannosi, non migliorano l'accuratezza | #4, #42 |
| **build a custom API / train from scratch / custom model** quando esiste un prodotto | Non è la scelta più economica né la più rapida | #26, #63, #92 |
| **only / strict keyword matching / limit training data** | Rende il sistema rigido | #28 |
| **speed / processing time / volume** come priorità in scenari di fairness | La priorità è equità e trasparenza | #38, #72 |
| **pre-packaged… eliminating the need for customization** | Google punta su modelli personalizzabili | #56 |

---

## 3. Parole che indicano la risposta giusta

| Se nell'opzione leggi… | …di solito è giusta quando la domanda parla di |
|---|---|
| **grounding / ground … on source / official documentation** | allucinazioni, "usare solo i nostri documenti" |
| **RAG / retrieve up-to-date / external knowledge sources** | knowledge cutoff, info nuove, documenti aggiornati, "cost-effective" |
| **explainable / transparency / accountability** | reclami per decisioni, rifiuti senza motivo, bias nei prestiti o nelle assunzioni |
| **human-in-the-loop (HITL) / human review** | sarcasmo, sfumature, contenuti sensibili |
| **anonymization / de-identify** | PII nei dati di training |
| **access controls + protecting sensitive data** | sicurezza nella fase di raccolta dati / training (#36) |
| **open approach / customer choice** | vendor lock-in |
| **pre-trained models + low-/no-code** | team con poca esperienza che deve partire in fretta |
| **business problem + desired outcomes** | da cosa partire per scegliere un caso d'uso |
| **identify high-impact, feasible solutions in their workflows** | ruolo dei mid-level manager (#5) |
| **combine top-down and bottom-up / multi-directional** | strategia gen AI (#47) |

---

## 4. Tabella "lo scenario dice X → rispondi Y"

### Modelli Google
| Scenario | Risposta |
|---|---|
| Testo + immagini + codice, versatile, multimodale, contesto lungo | **Gemini** (#2, #8, #78) |
| Open, leggero, gira in locale / su hardware limitato, fine-tuning locale | **Gemma** (#14) |
| Bozze, riassunti, testi (task di linguaggio leggeri) | **Gemma** (#16) |
| Immagini da testo | **Imagen** |
| Video da testo o immagini | **Veo** (#98) |
| Speech-to-text | **Chirp** |
| Codice (modello open) | **CodeGemma** |
| Decisioni deterministiche con regole rigide | **NON gen AI**: Gemini è fatto per generare e fare inferenza, non per regole fisse (#67) |

### Strumenti e prodotti
| Scenario | Risposta |
|---|---|
| Sperimentare in fretta con Gemini, senza setup | **Google AI Studio** (#9) |
| Piattaforma completa per costruire, fare il deploy e gestire ML/gen AI | **Vertex AI** (Agent Platform) (#10, #68) |
| Scoprire, personalizzare e fare il deploy di modelli Google, di partner e open | **Model Garden** (#53) |
| Versioni dei modelli, metadati, lifecycle | **Model Registry** (#65, #89) |
| Search aziendale, grounding su dati first-party | **Vertex AI Search** / Agent Search (#52, #74) |
| Catalogo grande, ricerca per clienti e agenti | **Pre-built RAG con Vertex AI Search** (#59) |
| Retail: ricerca in linguaggio naturale + raccomandazioni | **AI Commerce Search** (Gemini Enterprise for CX) (#93) |
| Agente custom su documenti, senza molto codice | **Vertex AI Agent Builder** (#60) |
| Agente che chiama API esterne (voli, hotel) | **Extensions** (#83) |
| Agente con dati live interni, al costo più basso | **Database Google Cloud + Vertex AI** (#26, #92) |
| Classificare immagini già etichettate, addestrare un modello | **AutoML** (#80) |
| Estrarre dati da PDF e scansioni con layout diversi | **Document AI** (#19) |
| Riassumere notizie fresche dal web | **Grounding with Google Search** (#50) |
| Analizzare PDF lunghi con citazioni alle fonti | **NotebookLM** (#66, #79) |
| Report ripetitivo senza rispiegare ogni volta il contesto | **Gems** personalizzati in Gemini Advanced (#77) |
| Video di formazione con avatar e voce, a costo zero | **Google Vids** (#70) |
| Search aziendale + agenti per i dipendenti, abbattere i silos | **Agentspace** (Gemini Enterprise) (#23, #63, #71) |
| Raccolta dati (streaming, strutturati) | **Pub/Sub, Cloud Storage, Cloud SQL** (#39) |

### Customer Engagement Suite
| Scenario | Risposta |
|---|---|
| Aiuto **in tempo reale agli operatori umani** | **Agent Assist** (#18, #29) |
| Bot automatico (regole + gen AI) per le FAQ | **Conversational Agents** (#85) |
| Analizzare conversazioni passate: sentiment, trend, insight | **Conversational Insights** (#32) |
| Contact center completo, omnicanale | **Contact Center as a Service (CCaaS)** (#55) |

### Sicurezza
| Scenario | Risposta |
|---|---|
| Chi può accedere a modelli e risorse, in modo granulare | **IAM** (#49) |
| Vista centralizzata della salute di sicurezza e delle minacce | **Security Command Center** (#54) |
| Protezioni integrate nell'hardware e nella rete "dalle fondamenta" | **Secure-by-design infrastructure** (#88, #99) |

### Prompting e parametri
| Scenario | Risposta |
|---|---|
| Tono adatto al pubblico / persona | **Role prompting** (#12, #34) |
| Ricordare le parti precedenti della conversazione | **Prompt chaining** (#35) |
| Dare esempi di interazioni riuscite | **Few-shot** (#28) |
| Il prompt elenca i passi del ragionamento | **Chain-of-thought** (#57) |
| Istruzione diretta, senza esempi | **Zero-shot** |
| Output generico e piatto | **Aggiungi dettagli al prompt** (pubblico, tono, parole chiave) (#21) |
| Usare solo la documentazione ufficiale | **Grounding** (#43) |
| Riassunti più corti | **Output length** (#41) |
| Filtrare contenuti dannosi | **Safety settings** (#20) |
| Più o meno creatività / casualità | **Temperature** (top-p, top-k) |

### Tipi di ML
| Indizio | Risposta |
|---|---|
| Dati **etichettati**, prevedere o classificare | **Supervised** (#73, #90) |
| Nessuna etichetta, gruppi naturali, anomalie, cluster | **Unsupervised** (#31, #61) |
| Premi e penalità, trial and error | **Reinforcement** (#58) |
| Testo libero, risposte aperte | **Unstructured data** (#44) |

### Limiti dei modelli
| Sintomo | Nome |
|---|---|
| Inventa fatti con sicurezza | **Hallucination** (#17) |
| Non conosce eventi recenti | **Knowledge cutoff** → si risolve con RAG |
| Dati di training sbilanciati o vecchi → output distorto | **Data dependency** (#64) |
| Dati non rappresentativi di un gruppo | **Bias** (#82) |

### Agenti
| Scenario | Risposta |
|---|---|
| Definizione di agente | App che **raggiunge un obiettivo usando input e tools**, con decisioni autonome (#7, #37) |
| Osservare → interpretare → pianificare → agire | **Reasoning loop** (#91) |
| Ordini, inventario, notifiche (processi end-to-end) | **Workflow agent** (#62) |
| Rilevamento minacce, regole di detection (CISO) | **Security agent** (#11) |
| Personalizzazione dell'apprendimento | **Customized learning agent** (#6) |
| Vantaggio del multi-agente | **Task complessi che richiedono funzioni coordinate** (#22) |

### I layer del gen AI landscape
| Layer | Cosa fa |
|---|---|
| **Infrastructure** | Compute (TPU/GPU) e storage per addestrare e far girare i modelli (#27, #97) |
| **Model** | I modelli pre-addestrati (foundation models) |
| **Platform** | Tools per usare i modelli e costruire / fare il deploy di soluzioni (Vertex AI) (#84) |
| **Agents** | Ragionano e agiscono con dei tools |
| **Applications** | Dove l'utente usa l'AI (Gemini app, Workspace) |

### Strategia e adozione
| Domanda | Risposta |
|---|---|
| Quando **automatizzare** con gen AI | Task **ripetitivi e basati su regole** (#25) |
| Quando usarla per **potenziare il pensiero strategico** | Task di **pensiero critico, creatività, decisioni strategiche** (#87) — attento alla coppia #25/#87! |
| Per programmare più in fretta | **Suggerire snippet e completare funzioni** (#24) |
| Unit test generati dall'AI | **Meno validazione manuale**, non "zero errori" (#76) |
| Sales più efficienti | **Bozze di email + insight in tempo reale** (#15) |
| Ricerca multimodale nel retail | **Più engagement e scoperta dei prodotti → vendite** (#75) |

---

## 5. Coppie trabocchetto (domande quasi uguali, risposte opposte)

- **#25 vs #87** — *automate tasks* → ripetitivi/rule-based · *enhance strategic thinking* → critical thinking/creatività.
- **#18/#29 vs #85 vs #32** — operatore umano aiutato → Agent Assist · bot automatico → Conversational Agents · analisi a posteriori → Conversational Insights.
- **#84 vs #97 vs #27** — platform = tools per costruire · infrastructure = compute + storage · hardware dell'infrastructure = TPU/GPU.
- **#49 vs #54 vs #88/#99** — chi accede = IAM · vista centralizzata = SCC · protezione intrinseca = secure-by-design.
- **#66/#79 vs #77** — analizzare documenti caricati → NotebookLM · report ricorrente con istruzioni salvate → Gems.
- **#14 vs #2/#78** — leggero/open/locale → Gemma · versatile/multimodale → Gemini.
- **#12/#34 vs #28 vs #35** — tono/pubblico → role · esempi di interazioni → few-shot · memoria della conversazione → chaining.
