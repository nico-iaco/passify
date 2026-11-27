# Generative AI Leader — Guida ai temi / Topic guide (IT · EN)

L'esame ha 4 sezioni, che nel JSON corrispondono al campo `topic`:

| Topic | Sezione (EN) | Sezione (IT) | Domande nel JSON |
|---|---|---|---|
| 1 | Fundamentals of gen AI | Fondamenti di gen AI | 22 |
| 2 | Google Cloud's gen AI offerings | Offerta gen AI di Google Cloud | 38 |
| 3 | Techniques to improve gen AI model output | Tecniche per migliorare l'output | 17 |
| 4 | Business strategies for a successful gen AI solution | Strategie di business | 22 |

---

## 1. Fondamenti / Fundamentals

### Definizioni chiave / Key definitions

| Termine / Term | EN | IT |
|---|---|---|
| **Artificial Intelligence (AI)** | Systems that perform tasks normally requiring human intelligence. | Sistemi che svolgono compiti che normalmente richiedono intelligenza umana. |
| **Machine Learning (ML)** | Subset of AI: systems learn patterns from data instead of being explicitly programmed. | Sottoinsieme dell'AI: il sistema impara dai dati invece di essere programmato a regole. |
| **Deep Learning** | ML using multi-layer neural networks. | ML con reti neurali a molti strati. |
| **Generative AI** | AI that **creates new content** (text, images, music, code). | AI che **crea contenuti nuovi** (testo, immagini, musica, codice). |
| **Foundation model** | Large model pre-trained on broad data, adaptable to many tasks. | Modello grande, pre-addestrato su dati ampi e adattabile a molti compiti. |
| **LLM** | Foundation model specialised in language. | Foundation model specializzato nel linguaggio. |
| **Multimodal** | Handles several data types (text, image, audio, video, code). | Gestisce più tipi di dato. |
| **Diffusion model** | Generates content by **refining noise** step by step into structured data (images). | Genera contenuti **raffinando il rumore** passo dopo passo (immagini). |
| **Token** | Unit of text the model processes. | Unità di testo elaborata dal modello. |
| **Context window** | How many tokens the model can consider at once. | Quanti token il modello considera in una volta. |
| **Prompt** | The input/instruction given to the model. | L'istruzione data al modello. |

### Tipi di apprendimento / Learning types

| Tipo | EN | IT | Indizio nella domanda |
|---|---|---|---|
| **Supervised** | Learns from **labeled** data to predict or classify. | Impara da dati **etichettati**. | "labeled", "past outcomes", "predict" |
| **Unsupervised** | Finds patterns or groups in **unlabeled** data. | Trova gruppi in dati **senza etichette**. | "natural groupings", "clusters", "anomalies" |
| **Reinforcement** | Learns by **trial and error** with rewards and penalties. | Impara per **tentativi**, con premi e penalità. | "positive/negative score", "reward" |

### Tipi di dato / Data types
- **Structured** — rows and columns, databases / *tabelle, database*.
- **Unstructured** — free text, images, audio, video / *testo libero, immagini, audio*. Le risposte aperte dei sondaggi sono unstructured.
- **Labeled** — data with an assigned answer or category / *dati con la "risposta" già assegnata*.
- **Data quality** — accuracy, completeness, consistency, relevance, **representativeness** / *accuratezza, completezza, coerenza, pertinenza, rappresentatività*.

### Limiti dei modelli / Model limitations

| Limite | EN | IT | Mitigazione |
|---|---|---|---|
| **Hallucination** | Confident but false or fabricated output. | Output falso o inventato, detto con sicurezza. | Grounding, RAG, HITL |
| **Knowledge cutoff** | Knows nothing after its training date. | Non sa nulla dopo la data di training. | RAG, grounding con Google Search |
| **Bias** | Unfair output from unrepresentative data. | Output iniquo per dati non rappresentativi. | Dati diversificati, fairness assessment |
| **Data dependency** | Output quality depends on training-data quality and recency. | La qualità dipende dai dati di training (sbilanciati, vecchi). | Dati migliori e aggiornati |
| **Edge cases** | Rare situations not covered by the data. | Casi rari non coperti dai dati. | HITL, test |

### Il gen AI landscape a layer / Layers

| Layer | EN | IT | Esempi Google |
|---|---|---|---|
| **Infrastructure** | Compute, storage, networking to train and run models. | Potenza di calcolo e storage. | TPU, GPU, AI Hypercomputer |
| **Models** | Pre-trained foundation models. | Modelli pre-addestrati. | Gemini, Gemma, Imagen, Veo, Chirp |
| **Platform** | Tools to access, customise, build and deploy. | Strumenti per costruire e fare il deploy. | Vertex AI (Agent Platform) |
| **Agents** | Reason and act using tools to reach goals. | Ragionano e agiscono con dei tools. | Agent Builder, Agentspace |
| **Applications** | End-user products. | Prodotti per l'utente finale. | Gemini app, Workspace, NotebookLM |

**TPU** — Google's custom AI accelerator, excels at **parallel processing** for ML / *acceleratore AI di Google, eccelle nel calcolo parallelo per l'ML*.

### Agenti / Agents
- **AI agent** — an application that **pursues a goal** by observing, reasoning and using **tools**, with limited human input / *applicazione che persegue un obiettivo osservando, ragionando e usando strumenti*.
- **Reasoning loop** — observe → interpret → plan → act, repeated / *osserva → interpreta → pianifica → agisci, in ciclo*.
- **Tools** — **Extensions** (standard connection to external APIs), **Functions** (function calling), **Data stores** (static or indexed data) / *estensioni, funzioni, data store*.
- **Tipi di agente**: conversational, workflow (processi end-to-end), customer, employee productivity, creative, code, data, security.
- **Multi-agent system** — several specialised agents coordinate on complex tasks / *più agenti specializzati che collaborano su task complessi*.

---

## 2. Offerta Google Cloud / Google Cloud offerings

> Naming 2026: **Gemini Enterprise Agent Platform** = Vertex AI, **Gemini Enterprise** = Agentspace.

### Modelli / Models
| Modello | EN | IT |
|---|---|---|
| **Gemini** | Google's flagship **multimodal** model family, long context, versatile. | Famiglia di punta, multimodale, contesto lungo. |
| **Gemma** | **Open**, lightweight models; run and fine-tune locally. | Modelli **open** e leggeri, girano in locale. |
| **Imagen** | Text-to-image. | Da testo a immagine. |
| **Veo** | Text/image-to-**video**. | Generazione di video. |
| **Chirp** | Speech recognition (speech-to-text). | Riconoscimento vocale. |
| **CodeGemma** | Open model for code. | Modello open per il codice. |

### Piattaforma e strumenti / Platform & tools
| Prodotto | EN | IT |
|---|---|---|
| **Vertex AI** | Unified platform to build, deploy and manage ML/gen AI. | Piattaforma unica per costruire, fare il deploy e gestire ML e gen AI. |
| **Vertex AI Studio** | Console UI to prototype prompts and tune models (enterprise). | Prototipazione prompt e tuning in console. |
| **Google AI Studio** | Free, fast web tool to try Gemini, no setup. | Strumento web rapido per provare Gemini senza setup. |
| **Model Garden** | Catalog to **discover, customise, deploy** Google, partner and open models. | Catalogo di modelli da scoprire, personalizzare e mettere in produzione. |
| **Model Registry** | Central store for **model versions**, metadata, deployment. | Registro delle **versioni** dei modelli. |
| **Vertex AI Pipelines** | Orchestrates ML workflows (MLOps). | Orchestrazione dei workflow ML. |
| **Feature Store** | Manages and serves ML features. | Gestione delle feature ML. |
| **Model Monitoring** | Detects drift or degradation in production. | Rileva drift e degrado in produzione. |
| **AutoML** | Train custom models (e.g. image classification) on **your labeled data** with little code. | Addestra modelli sui tuoi dati etichettati, con poco codice. |
| **Vertex AI Agent Builder** | Build agents and search/chat apps with low code. | Costruire agenti con poco codice. |
| **Vertex AI Search** | Enterprise search + **grounding** on first-party data; RAG out of the box. | Ricerca aziendale + grounding sui propri dati. |
| **RAG APIs / RAG Engine** | Retrieve fresh, relevant info from documents at query time. | Recupera info aggiornate dai documenti al momento della domanda. |
| **Grounding with Google Search** | Ground answers on fresh public web info. | Ancorare le risposte al web pubblico aggiornato. |
| **Document AI** | Extract structured data from documents and scans. | Estrae dati da documenti e scansioni. |
| **Natural Language API / Vision AI** | Classic pre-trained APIs for text and images. | API pre-addestrate per testo e immagini. |

### Prodotti per utenti / End-user products
| Prodotto | EN | IT |
|---|---|---|
| **Gemini app** | General-purpose assistant. | Assistente generico. |
| **Gems** | Custom Gemini with saved instructions, for repeatable tasks. | Gemini personalizzato con istruzioni salvate. |
| **NotebookLM** | Upload your sources and get **source-grounded** answers **with citations**. | Carichi le fonti e ottieni risposte con citazioni. |
| **Gemini for Google Workspace** | Gemini inside Gmail, Docs, Sheets, Meet. | Gemini dentro Gmail, Docs, ecc. |
| **Google Vids** | AI video creation (avatars, voiceover) inside Workspace. | Creazione di video con AI in Workspace. |
| **Agentspace (Gemini Enterprise)** | Unified enterprise search + agents across company systems; breaks knowledge silos. | Ricerca unificata + agenti sui sistemi aziendali; abbatte i silos. |
| **Gemini Code Assist** | AI coding assistant. | Assistente per scrivere codice. |
| **Gemini Cloud Assist** | AI help for managing Google Cloud. | Aiuto AI per gestire Google Cloud. |

### Customer Engagement Suite
| Componente | EN | IT |
|---|---|---|
| **Conversational Agents** | Build virtual agents (rules + gen AI) that answer customers. | Bot virtuali che rispondono ai clienti. |
| **Agent Assist** | Real-time suggestions to **human** agents. | Suggerimenti in tempo reale agli operatori **umani**. |
| **Conversational Insights** | Analytics on conversations: sentiment, topics, performance. | Analisi delle conversazioni. |
| **Contact Center as a Service (CCaaS)** | Full omnichannel contact center. | Contact center completo e omnicanale. |

### Sicurezza / Security
| Termine | EN | IT |
|---|---|---|
| **IAM** | Granular control of who can access what. | Controllo granulare degli accessi. |
| **Security Command Center** | Centralised view of security posture and threats. | Vista centralizzata di sicurezza e minacce. |
| **Secure-by-design infrastructure** | Security built into hardware and network from the ground up. | Sicurezza integrata dalle fondamenta. |
| **SAIF** | Google's Secure AI Framework. | Il framework Google per un'AI sicura. |

### Perché Google Cloud / Why Google Cloud
- **AI-first**, continuous innovation, integrated across the platform / *AI-first, innovazione continua, tutto integrato*.
- **Open approach**: customer choice, no lock-in (Model Garden includes third-party and open models) / *apertura, libertà di scelta, niente lock-in*.
- **AI-optimized infrastructure** (TPU, GPU, AI Hypercomputer) / *infrastruttura ottimizzata per l'AI*.
- **Pre-trained and tunable models** + **low-/no-code tools** for fast time-to-value / *modelli pre-addestrati e personalizzabili, strumenti low-code*.
- **Enterprise-grade security & privacy** / *sicurezza e privacy di livello enterprise*.

---

## 3. Migliorare l'output / Improving model output

### Tecniche di prompting / Prompting techniques
| Tecnica | EN | IT |
|---|---|---|
| **Prompt engineering** | Art and science of designing instructions to get the desired output. | Arte e scienza di scrivere istruzioni per ottenere l'output voluto. |
| **Zero-shot** | Direct instruction, no examples. | Istruzione diretta, senza esempi. |
| **One-shot / Few-shot** | One or a few examples in the prompt. | Uno o pochi esempi nel prompt. |
| **Role prompting** | "Act as…" sets persona, tone, audience. | "Comportati come…": imposta persona, tono, pubblico. |
| **Chain-of-thought** | Ask or show step-by-step reasoning. | Ragionamento passo dopo passo. |
| **Prompt chaining** | Multi-turn: output and history feed the next prompt. | Più turni: la conversazione precedente alimenta il prompt successivo. |
| **Grounding** | Connect output to **verifiable sources** (docs, search). | Ancorare l'output a fonti verificabili. |
| **RAG** | Retrieve relevant docs at query time and add them to the prompt. | Recupera documenti pertinenti e li aggiunge al prompt. |

### Parametri / Parameters
| Parametro | EN | IT |
|---|---|---|
| **Temperature** | Randomness: low = consistent, high = creative. | Casualità: bassa = coerente, alta = creativa. |
| **Top-p / Top-k** | Limit the candidate tokens considered. | Limitano i token candidati. |
| **Output length (max tokens)** | Caps the response length. | Limita la lunghezza della risposta. |
| **Safety settings** | Filter harmful content by threshold. | Filtrano contenuti dannosi secondo una soglia. |

### Personalizzare un modello, dal più economico al più costoso
1. **Prompt engineering** — free, immediate / *gratis e immediato*.
2. **Grounding / RAG** — fresh or private data without retraining / *dati aggiornati o privati senza ri-addestrare*.
3. **Fine-tuning** — changes behaviour/style; costly, data frozen at tuning time / *cambia comportamento e stile; costoso, i dati restano fermi a quel momento*.
4. **Training from scratch** — almost never the answer / *quasi mai la risposta giusta*.

### Human-in-the-loop (HITL)
Humans review or correct AI output where nuance, risk or ethics matter / *l'umano rivede l'output dove contano sfumature, rischio o etica*.

---

## 4. Strategia di business / Business strategy

### Adozione / Adoption
- **Start from the business problem and desired outcomes** / *parti dal problema di business e dai risultati attesi*.
- **Strategy = top-down + bottom-up** (multi-directional): leadership sets the vision, employees surface use cases / *la leadership dà la visione, i dipendenti propongono i casi d'uso*.
- **Mid-level managers** → identify high-impact, feasible use cases in their workflows / *trovano casi d'uso ad alto impatto e fattibili nel proprio lavoro*.
- **Automate** repetitive, rule-based tasks; **augment** critical thinking, creativity, strategy / *automatizza il ripetitivo, potenzia il pensiero strategico e creativo*.
- Measure, iterate, collect feedback / *misura, itera, raccogli feedback*.

### Responsible AI (principi Google)
| Principio | EN | IT |
|---|---|---|
| **Fairness** | Avoid unjust bias; representative data. | Evitare bias ingiusti; dati rappresentativi. |
| **Transparency / Explainability** | Users understand how and why decisions are made. | Capire come e perché si decide. |
| **Accountability** | Clear ownership, human oversight. | Responsabilità chiare, supervisione umana. |
| **Privacy** | Protect PII: anonymization, access controls. | Proteggere i dati personali. |
| **Security** | Protect data and models across the ML lifecycle. | Proteggere dati e modelli in tutto il ciclo di vita. |
| **Safety** | Avoid harmful outputs. | Evitare output dannosi. |

### Sicurezza nel ciclo di vita ML / Security across the ML lifecycle
- **Data gathering / training** → access controls + protect sensitive data (anonymization) / *controlli d'accesso e protezione dei dati sensibili*.
- **Deployment** → IAM, monitoring, Security Command Center.
- **Operations** → monitoring for unexpected outputs and drift / *monitoraggio di output inattesi e drift*.

### Valore di business tipico / Typical business value
- Productivity: drafts, summaries, code completion, unit tests (less manual effort, not zero errors) / *produttività: bozze, riassunti, codice, test (meno lavoro manuale, non zero errori)*.
- Customer experience: multimodal search → engagement, discovery, sales / *ricerca multimodale → engagement e vendite*.
- Knowledge sharing across silos (Agentspace) / *condivisione della conoscenza tra i silos*.
