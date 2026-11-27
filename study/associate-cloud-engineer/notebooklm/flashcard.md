# Flashcard — Associate Cloud Engineer

Generate da NotebookLM (Gemini Notebook) a partire dalle guide di studio e dalle domande verificate. Da ricontrollare: il modello può sbagliare.

## 1. Tutti i team di sviluppo hanno un proprio progetto Google Cloud. Vuoi limitare la creazione di risorse solo alle region degli Stati Uniti (US) per tutti i progetti dei team dev.

• Soluzione: Crea una cartella (folder) per contenere i progetti dev e applica una Organization Policy con il vincolo resourceLocations limitato a US.
• Motivo: Le policy organizzative applicate a livello di cartella vengono ereditate da tutti i progetti sottostanti.
• Alternativa errata: Applicare la policy manualmente progetto per progetto oppure utilizzare label (le label non limitano le region).

## 2. Un audit ha rilevato utenti con indirizzi email esterni al dominio Google Workspace aziendale con accessi IAM. Vuoi bloccare la condivisione esterna e rimuovere gli utenti non corrispondenti.

• Soluzione: Configura il vincolo di Organization Policy (Domain Restricted Sharing) per limitare le identità al tuo dominio ed elimina retroattivamente gli utenti esterni.
• Motivo: La policy impedisce la condivisione esterna e la pulizia retroattiva rimuove gli accessi errati esistenti.
• Alternativa errata: Usare Cloud Scheduler per scansionare ed eliminare periodicamente gli utenti tramite script custom.

## 3. La tua azienda gestisce le identità degli utenti in Active Directory (AD) come fonte unica di verità e vuole sincronizzarle in Cloud Identity per accedere a Google Cloud.

• Soluzione: Utilizza Google Cloud Directory Sync (GCDS).
• Motivo: GCDS esegue la sincronizzazione monodirezionale da AD/LDAP verso Cloud Identity mantenendo AD autorevole.
• Alternativa errata: Creare o importare manualmente gli utenti tramite file CSV o script personalizzati.

## 4. L'azienda opera nell'Area Economica Europea (EEA) e deve assicurarsi che tutte le risorse distribuite in tutti i progetti utilizzino solo location dell'EEA.

• Soluzione: Configura il vincolo resourceLocations dell'Organization Policy a livello di organizzazione includendo le location EEA consentite.
• Motivo: L'impostazione a livello d'organizzazione applica la regola centralmente su tutte le cartelle e i progetti.
• Alternativa errata: Configurare la policy separatamente su ogni singola cartella o progetto.

## 5. Vuoi impedire agli sviluppatori di collegare progetti al Billing Account aziendale e concedere tale permesso solo al team Finance, senza che Finance possa modificare i progetti.

• Soluzione: Assegna a Finance il ruolo Billing Account User sul conto di fatturazione e Project Billing Manager a livello di organizzazione.
• Motivo: Questa combinazione permette l'associazione del conto senza concedere permessi sulle risorse dei progetti.
• Alternativa errata: Assegnare il ruolo Project Owner o Editor al team Finance (troppo ampio).

## 6. Devi analizzare i costi di Google Cloud per più progetti legati a un unico billing account e visualizzarli con metriche dinamiche aziendali tramite dashboard automatizzata.

• Soluzione: Configura l'esportazione dei dati di Cloud Billing verso BigQuery e crea una dashboard su Looker Studio (Data Studio).
• Motivo: L'export su BigQuery consente query SQL granulari e si integra nativamente con Looker Studio.
• Alternativa errata: Esportare manualmente i dati in file CSV o Google Sheets per analisi manuali.

## 7. Vuoi ricevere un avviso via email se la spesa mensile di un progetto sandbox o di una cartella supera $500.

• Soluzione: Crea un budget impostato sul progetto/folder e configura i Budget Alerts alla soglia desiderata.
• Motivo: I budget alert inviano notifiche automatiche via email quando il consumo supera l'importo o la percentuale specificata.
• Alternativa errata: Ritenere che l'impostazione di un budget blocchi automaticamente le risorse (un budget alert invia solo notifiche).

## 8. Lanci un comando per creare una risorsa (es. cluster GKE o istanza Spanner) ma ricevi un errore 403 che indica che l'API del servizio è disabilitata.

• Soluzione: Esegui `gcloud services enable <service-api-name>` (es. `container.googleapis.com`) e poi riprova il comando di creazione.
• Motivo: In Google Cloud le API di ogni servizio devono essere esplicitamente abilitate prima di poter creare risorse.
• Alternativa errata: Assegnare il ruolo Project Owner pensando a un problema di permessi IAM.

## 9. Hai bisogno di un database relazionale globale per un'applicazione di trading/gaming distribuita in più region che richiede consistenza transazionale ACID e massima scalabilità.

• Soluzione: Cloud Spanner
• Motivo: Spanner è il database relazionale gestito globale ad altissima disponibilità con consistenza forte e supporto SQL.
• Alternativa errata: Cloud SQL (è limitato a una singola region) o Bigtable (non è un DB relazionale ACID).

## 10. Devi migrare un database PostgreSQL aziendale ad alte prestazioni che richiede scalabilità, replicazione sincrona e ottimizzazione del layer di storage con carichi OLTP ed analitici.

• Soluzione: AlloyDB per PostgreSQL (utilizzando Database Migration Service).
• Motivo: AlloyDB offre piena compatibilità PostgreSQL con prestazioni elevate ed elaborazione analitica/OLTP accelerata.
• Alternativa errata: Migrare su BigQuery (BigQuery è un data warehouse, non un DB OLTP).

## 11. Un'applicazione IoT acquisisce costantemente dati da milioni di sensori ad alta frequenza di scrittura e richiede latenza inferiore al millisecondo per operazioni di lettura/scrittura.

• Soluzione: Cloud Bigtable
• Motivo: Bigtable è un DB NoSQL a colonne larghe ottimizzato per dati time-series con scrittura massiva e latenza sub-ms.
• Alternativa errata: Cloud SQL (soffrirebbe sotto volumi di scrittura IoT massivi) o Firestore.

## 12. Devi creare una connessione VPN ad alta disponibilità (HA VPN) tra la rete locale aziendale e un VPC Google Cloud senza sovradimensionare i tunnel in caso di failover.

• Soluzione: Utilizza un VPC in modalità custom, imposta Cloud Router con BGP e utilizza il routing active/passive.
• Motivo: Cloud Router e BGP permettono il failover dinamico mantenendo l'instradamento active/passive raccomandato.
• Alternativa errata: Utilizzare rotte statiche create manualmente senza Cloud Router.

## 13. I server bare-metal nel data center locale non hanno accessi a internet né IP pubblici. Devono salvare file su Cloud Storage tramite tunnel VPN/Interconnect.

• Soluzione: Configura Cloud Router per pubblicizzare l'intervallo 199.36.153.4/30 e imposta il DNS locale con CNAME `*.googleapis.com` verso `restricted.googleapis.com`.
• Motivo: Permette il routing del traffico verso le API Google tramite la rete privata senza uscire su Internet.
• Alternativa errata: Assegnare un IP pubblico ai server on-premises.

## 14. Hai un'applicazione web o un'API impacchettata in un container Docker stateless e vuoi eseguirla in modalità serverless scalando fino a zero quando non ci sono richieste.

• Soluzione: Cloud Run (caricando le immagini su Artifact Registry).
• Motivo: Cloud Run è la piattaforma serverless gestita per container HTTP/gRPC che scala automaticamente a zero.
• Alternativa errata: Compute Engine MIG (richiede la gestione delle VM) o GKE Standard.

## 15. Devi distribuire un'applicazione su Kubernetes garantendo un'elevata affidabilità e applicazione tempestiva delle patch di sicurezza, pagando solo per le risorse dei Pod senza gestire le VM.

• Soluzione: GKE Autopilot (iscritto al release channel stable).
• Motivo: In Autopilot Google gestisce e ottimizza i nodi e l'utente paga solo le risorse allocate dai Pod.
• Alternativa errata: GKE Standard gestito manualmente (richiede l'amministrazione diretta dei nodi).

## 16. Un carico di lavoro batch elabora grandi quantità di dati ogni notte su Compute Engine. Il job è tollerante ai guasti e può ripartire se la VM viene terminata. Vuoi ridurre al minimo i costi.

• Soluzione: Utilizza istanze Spot VM su Compute Engine.
• Motivo: Le Spot VM offrono sconti notevoli e sono ideali per workload tolleranti alle interruzioni.
• Alternativa errata: Usare istanze VM standard a prezzo pieno.

## 17. Un processo batch mensile su una VM richiede circa 30 ore di esecuzione continua non interrompibile (non supporta checkpointing) al minor costo possibile.

• Soluzione: Utilizza una VM Compute Engine standard ed esegui lo start/stop dell'istanza in base alle necessità (o con instance schedule).
• Motivo: Le Spot VM possono essere interrotte entro 24 ore e farebbero fallire un job non checkpointabile.
• Alternativa errata: Usare Spot VM o Preemptible VM per un job di 30 ore continuo.

## 18. Vuoi eseguire automaticamente del codice Python in risposta all'evento di caricamento di un nuovo file in un bucket Cloud Storage, con il minimo overhead di gestione.

• Soluzione: Utilizza Cloud Run functions con trigger di evento impostato sul bucket Cloud Storage.
• Motivo: Le Cloud Run functions gestiscono gli eventi asincroni generati dalle risorse cloud in modalità serverless.
• Alternativa errata: Eseguire un cron job su una VM Compute Engine che fa polling sul bucket.

## 19. Vuoi ricevere una notifica email se i costi di traffico di rete in uscita (egress) di un server web Apache su Compute Engine superano $100 nel mese in corso.

• Soluzione: Esporta la fatturazione su BigQuery. Crea una Cloud Run function schedulata tramite Cloud Scheduler per calcolare i costi di egress dell'istanza ed inviare l'email.
• Motivo: L'export BigQuery permette query SQL granulari sui costi per specifica risorsa o servizio.
• Alternativa errata: Usare un semplice Budget Alert a livello di progetto (non distingue il solo egress Apache).

## 20. Hai una serie di istanze Linux su Compute Engine prive di IP pubblico e vuoi consentire agli ingegneri di connettersi via SSH da remoto in modo sicuro.

• Soluzione: Configura Identity-Aware Proxy (IAP) per SSH e consenti l'ingress dall'intervallo IP 35.235.240.0/20 sulla porta 22.
• Motivo: IAP permette il tunneling SSH sicuro verso IP privati senza esporre le VM su Internet.
• Alternativa errata: Assegnare IP pubblici statici a tutte le VM.

## 21. Devi creare un ambiente di produzione per un'applicazione esistente su Compute Engine e Cloud SQL. Il team di sicurezza richiede l'assenza assoluta di route di rete tra Dev e Prod.

• Soluzione: Crea un nuovo progetto Google Cloud dedicato all'ambiente di produzione e replica la configurazione.
• Motivo: Il progetto è l'unità fondamentale di isolamento di rete e sicurezza raccomandata da Google.
• Alternativa errata: Creare i due ambienti in region diverse all'interno dello stesso VPC del medesimo progetto.

## 22. Hai un'applicazione frontend nel VPC-A (Progetto A) e il backend nel VPC-B (Progetto B). Devi abilitare la comunicazione privata ad alta velocità senza costi eccessivi.

• Soluzione: Configura un VPC Network Peering tra vpc-a e vpc-b.
• Motivo: Il VPC Peering permette lo scambio interno di traffico con IP privati tra VPC differenti a bassa latenza.
• Alternativa errata: Configurare i due servizi con IP pubblici o creare una VPN Cloud-to-Cloud.

## 23. L'organizzazione necessita che le VM appartenenti a vari progetti di servizio comunichino direttamente tra loro tramite IP interni sicuri all'interno di un'infrastruttura centrale.

• Soluzione: Configura un Host Project con una Shared VPC e associa i singoli progetti aziendali come Service Projects.
• Motivo: La Shared VPC centralizza la gestione della rete e consente la comunicazione privata tra progetti della stessa org.
• Alternativa errata: Configurare un VPC Peering separato per ogni singola combinazione di progetti.

## 24. Vuoi distribuire il traffico web HTTPS pubblico distribuito a livello globale verso un MIG, terminando la sessione SSL sul load balancer.

• Soluzione: Configura un External Application Load Balancer globale con certificato SSL gestito da Google.
• Motivo: L'External Application LB gestisce il livello 7 (HTTP/HTTPS), la terminazione SSL e il routing globale.
• Alternativa errata: Utilizzare un External Passthrough Network Load Balancer (lavora al layer 4 e non termina SSL).

## 25. Il backend di un videogioco multiplayer invia e riceve pacchetti UDP da dispositivi mobili. Le VM Compute Engine devono essere esposte dietro un unico IP.

• Soluzione: Configura un External Passthrough Network Load Balancer.
• Motivo: I Passthrough Load Balancer operano a livello 4 e supportano protocolli non-TCP come UDP preservando l'IP client.
• Alternativa errata: External Application Load Balancer (supporta solo traffico HTTP/HTTPS).

## 26. I file di audit aziendali devono essere conservati per 3 anni per obblighi di legge. I dati vengono acceduti circa una volta all'anno.

• Soluzione: Utilizza Cloud Storage con classe di archiviazione Coldline (o Archive per retention lunghe/accesso rarissimo).
• Motivo: Coldline garantisce costi di storage per GB estremamente bassi per accessi a frequenza trimestrale/annuale.
• Alternativa errata: Utilizzare la classe Standard (molto più costosa per la conservazione nel tempo).

## 27. Vuoi che gli oggetti caricati in un bucket Cloud Storage Standard passino automaticamente alla classe Archive dopo 90 giorni di inattività.

• Soluzione: Configura una regola di Object Lifecycle Management con condizione Age di 90 giorni e azione SetStorageClass su Archive.
• Motivo: Lifecycle Management gestisce automaticamente e senza codice la transizione delle classi di storage.
• Alternativa errata: Scrivere uno script Python personalizzato lanciato da un cron job su una VM.

## 28. Milioni di sensori IoT inviano continuamente eventi in streaming a Google Cloud. Devi acquisire ed elaborare i dati in modo scalabile verso Cloud Storage/BigQuery.

• Soluzione: Pub/Sub per l'ingestione e Dataflow per l'elaborazione della pipeline verso Cloud Storage o BigQuery.
• Motivo: La combinazione Pub/Sub + Dataflow è l'architettura di riferimento serverless per lo streaming ad alto throughput.
• Alternativa errata: Salvare direttamente i dati da ciascun sensore tramite query SQL su Cloud SQL MySQL.

## 29. L'azienda vuole standardizzare la creazione delle risorse Google Cloud e multi-cloud utilizzando un framework Infrastructure as Code dichiarativo e riciclabile tramite moduli.

• Soluzione: Utilizza Terraform e sviluppa moduli riutilizzabili salvati in un repository di codice.
• Motivo: Terraform è lo standard industriale aperto per la gestione multi-cloud dichiarativa e la composizione a moduli.
• Alternativa errata: Utilizzare script bash nativi con il comando gcloud.

## 30. Il team DevOps vuole gestire l'infrastruttura Google Cloud (bucket, database Cloud SQL) con lo stesso approccio dichiarativo YAML e strumenti usati in Kubernetes.

• Soluzione: Installa Config Connector nel cluster GKE.
• Motivo: Config Connector permette di dichiarare e gestire risorse Google Cloud nativamente come risorse custom in Kubernetes.
• Alternativa errata: Usare helm chart per simulare chiamate REST esterne o script manuali.

## 31. Un'istanza Compute Engine ospita un database con requisiti urgenti di lettura/scrittura che superano 200.000 IOPS su un block storage persistente che sopravvive ai riavvii della VM.

• Soluzione: Configura dischi Hyperdisk Extreme per la VM.
• Motivo: Hyperdisk Extreme garantisce le massime prestazioni di IOPS e throughput per block storage persistente su Compute Engine.
• Alternativa errata: Local SSD (i Local SSD sono temporanei e vengono persi all'arresto dell'istanza).

## 32. Un'istanza Compute Engine fondamentale condivide il progetto con diversi team ed è a rischio di eliminazione errata da parte degli utenti.

• Soluzione: Abilita il flag di Deletion Protection (Protezione da eliminazione) sull'istanza.
• Motivo: Il flag impedisce la cancellazione dell'istanza tramite console o CLI finché non viene disattivato.
• Alternativa errata: Modificare le regole di firewall.

## 33. Vuoi testare una nuova versione di un servizio Cloud Run inviando solo il 5% del traffico reale alla nuova revisione e il 95% alla precedente.

• Soluzione: Distribuisci la nuova revisione e usa la funzionalità di Traffic Splitting per dividere la percentuale del traffico.
• Motivo: Cloud Run supporta il traffic splitting nativo tra le revisioni senza bisogno di load balancer esterni.
• Alternativa errata: Creare un intero nuovo cluster GKE per gestire il 5% del traffico.

## 34. Gli utenti segnalano che la prima richiesta verso una pagina Cloud Run subisce una latenza elevata dovuta all'avvio dell'istanza (cold start).

• Soluzione: Imposta il parametro minimum instances (istanze minime) del servizio Cloud Run a un valore $> 0$ (es. 2 o 3).
• Motivo: Mantenere istanze minime sempre pronte elimina l'overhead dell'avvio a freddo per le prime richieste.
• Alternativa errata: Aumentare il limite massimo di istanze (max instances).

## 35. In un Managed Instance Group (MIG), se un'istanza diventa non responsiva dopo 3 tentativi da 10 secondi, la VM deve essere automaticamente ricreata.

• Soluzione: Configura un Autohealing Health Check (HTTP/HTTPS/TCP) sul MIG con le soglie di check specificate.
• Motivo: Gli health check di autohealing monitorano lo stato dell'applicazione e forzano la ricreazione della VM fallita.
• Alternativa errata: Usare uno script crontab locale per riavviare manualmente la VM.

## 36. Devi configurare il backup automatico dell'intero disco di una VM Compute Engine ogni giorno, mantenendo i backup per 7 giorni con il minimo overhead di gestione.

• Soluzione: Crea uno Snapshot Schedule (pianificazione snapshot) applicato al disco con retention impostata a 7 giorni.
• Motivo: Gli snapshot schedule gestiscono automaticamente la creazione e l'eliminazione dei vecchi snapshot.
• Alternativa errata: Scrivere uno script Bash personalizzato per lanciare snapshot manuali ogni giorno.

## 37. Un auditor richiede di verificare tutte le identità che hanno letto o scaricato file contenuti in specifici bucket Cloud Storage.

• Soluzione: Abilita i Data Access Audit Logs per Cloud Storage e usa Logs Explorer per filtrare le operazioni di lettura.
• Motivo: I Data Access log (disabilitati di default) tracciano le letture dei dati effettuati sulle risorse.
• Alternativa errata: Consultare gli Admin Activity Logs (tracciano solo le modifiche di configurazione/IAM, non la lettura dati).

## 38. Un container di test in GKE genera un volume immenso di log che sta facendo salire i costi. Vuoi disattivare questi log con il minor numero di passaggi.

• Soluzione: Vai su Logs Router in Cloud Logging e aggiungi un Exclusion Filter per la risorsa del container GKE.
• Motivo: Gli exclusion filter scartano i log all'ingresso impedendone l'archiviazione e l'addebito dei costi.
• Alternativa errata: Distruggere l'intero cluster Kubernetes.

## 39. Vuoi che il team di Operations riceva una notifica se la CPU media delle VM di un MIG supera il 75% continuamente per 5 minuti.

• Soluzione: Crea una Cloud Monitoring Alerting Policy sulla metrica `compute.googleapis.com/instance/cpu/utilization` con soglia 75% e durata 5 minuti.
• Motivo: Cloud Monitoring valuta le metriche ed invia notifiche sugli appositi canali al superamento della soglia.
• Alternativa errata: Scrivere uno script Python che controlla le VM via SSH ogni 5 minuti.

## 40. Vuoi analizzare i log applicativi raccolti tramite Ops Agent su Compute Engine utilizzando query SQL ed eseguire grafici sull'andamento.

• Soluzione: Abilita Log Analytics sul bucket di log in Cloud Logging e crea un dataset collegato in BigQuery.
• Motivo: Log Analytics converte i bucket di log in tabelle interrogabili tramite la sintassi SQL nativa di BigQuery.
• Alternativa errata: Esportare manualmente i file di log in formato testo locale per elaborarli in Excel.

## 41. Distribuisci un Deployment su GKE ma noti che uno dei Pod rimane bloccato nello stato PENDING. Vuoi capire la causa.

• Soluzione: Esegui `kubectl describe pod <pod-name>` e controlla i warning/eventi in fondo all'output.
• Motivo: `kubectl describe` mostra le decisioni dello scheduler e gli errori (es. risorse insufficienti o taints).
• Alternativa errata: Eliminare il cluster GKE e ricrearlo da capo.

## 42. I Pod dei microservizi su GKE hanno limiti di CPU e memoria configurati in modo errato o inefficiente. Vuoi adeguare automaticamente le risorse ai consumi reali.

• Soluzione: Configura un Vertical Pod Autoscaler (VPA) per ciascun microservizio.
• Motivo: Il VPA analizza l'uso effettivo delle risorse e aggiorna automaticamente i valori di CPU e memoria del Pod.
• Alternativa errata: Horizontal Pod Autoscaler (HPA aumenta il numero di Pod, non la dimensione dei singoli Pod).

## 43. Devi lanciare una query complessa su una tabella di grandi dimensioni in BigQuery in modalità On-Demand e vuoi stimare il costo in dollari prima di avviarla.

• Soluzione: Esegui una dry-run query da CLI (`bq query --dry_run`) per ottenere i byte stimati e convertili in costi con il Pricing Calculator.
• Motivo: La dry-run scansiona lo schema senza eseguire la query e restituisce i byte che verranno letti.
• Alternativa errata: Lanciare la query e annullarla dopo pochi secondi.

## 44. Vuoi che le VM di un progetto di sviluppo vengano spente automaticamente quando il progetto supera il 100% del budget mensile impostato.

• Soluzione: Collega il Budget Alert a un argomento Pub/Sub e crea una Cloud Run function abbonata che esegua lo shutdown delle VM.
• Motivo: I budget alert inviano solo notifiche; per azioni correttive automatizzate serve Pub/Sub + Function.
• Alternativa errata: Ritenere che l'impostazione di un budget in console blocchi automaticamente l'erogazione dei servizi.

## 45. Hai creato un'istanza Windows Server su Compute Engine e devi accedere in RDP per la prima volta per la configurazione.

• Soluzione: Genera le credenziali iniziali con `gcloud compute reset-windows-password` o da console ed entra tramite client RDP.
• Motivo: In Windows le credenziali dell'utente amministratore vengono generate in modo sicuro tramite questa API.
• Alternativa errata: Tentare la connessione via SSH (SSH è il protocollo di default per Linux).

## 46. Devi inviare un documento riservato in un bucket a un consulente esterno che non possiede un account Google. L'accesso deve scadere automaticamente dopo 4 ore.

• Soluzione: Genera una Signed URL (URL firmata) con scadenza a 4 ore e inviala al consulente.
• Motivo: La Signed URL garantisce un accesso temporaneo ad oggetti specifici senza richiedere un account Google.
• Alternativa errata: Rendere pubblico il bucket a `allUsers`.

## 47. Gestisci le risorse distribuite su 3 progetti Google Cloud distinti e vuoi visualizzare le metriche di tutti in un unico dashboard di Cloud Monitoring.

• Soluzione: Configura un unico Cloud Monitoring Metrics Scope nel progetto principale ed aggiungi gli altri progetti allo scope.
• Motivo: Il Metrics Scope consente di aggregare metriche, dashboard ed alert relativi a più progetti in una sola interfaccia.
• Alternativa errata: Creare 3 dashboard identiche in ciascun progetto separatamente.

## 48. Stai analizzando un guasto complesso su Cloud Logging e riscontri messaggi di errore criptici mai visti prima. Vuoi comprenderne subito il significato ed i rimedi.

• Soluzione: Utilizza l'opzione Investigate Log in Logs Explorer con Gemini Cloud Assist.
• Motivo: Gemini Cloud Assist analizza il contesto della riga di log e genera una sintesi intelligente del problema.
• Alternativa errata: Ricreare completamente l'ambiente di produzione per vedere se l'errore scompare.

## 49. Hai appena aggiornato un Deployment su GKE ma riscontri un bug critico nella nuova versione. Devi ripristinare immediatamente la versione precedente.

• Soluzione: Esegui il comando `kubectl rollout undo deployment/<deployment-name>`.
• Motivo: `kubectl rollout undo` ripristina all'istante la revisione precedente dello stato del deployment senza downtime.
• Alternativa errata: Eliminare manualmente i singoli pod uno alla volta.

## 50. Un team di Operations ha bisogno di avviare, arrestare e riavviare le istanze VM di un progetto per troubleshooting, senza poterle eliminare o modificare la rete.

• Soluzione: Crea un Custom IAM Role che includa solo i permessi `compute.instances.start`, `stop` e `reset` ed assegnalo al team.
• Motivo: Creare un ruolo personalizzato impedisce l'assegnazione di permessi distruttivi ed applica il least privilege.
• Alternativa errata: Assegnare il ruolo `roles/compute.admin` o `roles/editor` (concederebbero la cancellazione delle risorse).

## 51. Devi gestire le autorizzazioni per 50 sviluppatori che lavorano allo stesso progetto Google Cloud. I membri del team cambiano frequentemente.

• Soluzione: Crea un Google Group in Cloud Identity, assegna i ruoli IAM necessari al Gruppo ed aggiungi/rimuovi gli utenti dal gruppo.
• Motivo: La gestione basata su gruppi evita la modifica continua delle policy IAM sui singoli progetti quando il personale cambia.
• Alternativa errata: Assegnare direttamente i ruoli IAM all'indirizzo email personale di ciascun singolo sviluppatore.

## 52. I Pod in esecuzione su GKE devono leggere dati da un bucket Cloud Storage. La policy aziendale vieta tassativamente l'uso delle chiavi private JSON dei Service Account.

• Soluzione: Abilita Workload Identity Federation sul cluster GKE e collega il Kubernetes ServiceAccount al Google Service Account.
• Motivo: Workload Identity Federation elimina la necessità di scaricare ed archiviare chiavi JSON statiche per i workload Kubernetes.
• Alternativa errata: Creare ed archiviare una chiave JSON di service account nei Kubernetes Secrets.

## 53. Vuoi testare le autorizzazioni di un Service Account dal tuo laptop aziendale tramite `gcloud CLI` in modo sicuro senza scaricare chiavi private.

• Soluzione: Configura la gcloud CLI per usare la Service Account Impersonation (`--impersonate-service-account`).
• Motivo: L'impersonificazione genera token temporanei a breve durata garantendo massima sicurezza senza gestire file di chiavi.
• Alternativa errata: Creare e scaricare un file di chiave JSON privata sul disco rigido locale dello sviluppatore.

## 54. Un Service Account gestito nel progetto `proj-sa` deve creare snapshot delle VM situate nel progetto `proj-vm`.

• Soluzione: Assegna al Service Account di `proj-sa` il ruolo IAM `Compute Storage Admin` direttamente sul progetto `proj-vm`.
• Motivo: I Service Account possono ricevere ruoli IAM in qualsiasi progetto dell'organizzazione a prescindere da dove risiedono.
• Alternativa errata: Creare un duplicato del Service Account o assegnare il ruolo Project Owner.

## 55. Un consulente esterno ha bisogno di leggere gli oggetti memorizzati esclusivamente nel bucket `marketing-docs`, senza vedere altre risorse nel progetto.

• Soluzione: Assegna al consulente il ruolo `Storage Object Viewer` applicato direttamente sul bucket specifico.
• Motivo: L'assegnazione del ruolo a livello di risorsa (bucket) limita la visibilità dell'utente solo a quel bucket.
• Alternativa errata: Assegnare `Storage Object Viewer` a livello di progetto (concederebbe l'accesso a tutti i bucket).

## 56. Alcuni utenti devono unicamente esplorare l'albero delle risorse (Organizzazione, Cartelle, Progetti) nella console Google Cloud senza leggere né modificare dati.

• Soluzione: Assegna al gruppo di utenti il ruolo `roles/browser`.
• Motivo: Il ruolo Browser consente di scorrere la gerarchia delle risorse senza accedere al contenuto o ai dati interni.
• Alternativa errata: Assegnare il ruolo `Organization Admin` o `Project Editor`.

## 57. Un amministratore della sicurezza si occupa unicamente di creare e gestire i Service Account ed i relativi permessi per l'intera organizzazione.

• Soluzione: Assegna l'utente al ruolo `roles/iam.serviceAccountAdmin`.
• Motivo: Il ruolo Service Account Admin concede tutti i diritti di gestione del lifecycle delle identità dei service account.
• Alternativa errata: Assegnare il ruolo `roles/resourcemanager.organizationAdmin` o `roles/owner`.

## 58. Devi identificare tutte le chiavi private dei Service Account create più di 90 giorni fa in tutta l'organizzazione.

• Soluzione: Esegui il comando `gcloud asset search-all-resources` con query sul tipo `iam.googleapis.com/ServiceAccountKey` e filtro sulla data.
• Motivo: Cloud Asset Inventory consente ricerche ed elenchi rapidi di metadati delle risorse su scala organizzativa.
• Alternativa errata: Aprire manualmente la pagina IAM della console per ciascuno dei progetti dell'azienda.

## 59. La sicurezza aziendale richiede che le chiavi dei Service Account eventualmente create abbiano una durata massima di validità non superiore a 24 ore.

• Soluzione: Applica un vincolo di Organization Policy per limitare il lifetime delle chiavi di service account a 24 ore.
• Motivo: Le policy organizzative permettono di applicare limiti e guardrail di sicurezza centralizzati in modo perentorio.
• Alternativa errata: Scrivere uno script in Python che cancella ogni sera le chiavi sui progetti.

## 60. Un ingegnere gestisce frequentemente 5 progetti Google Cloud differenti dal proprio terminale e vuole passare rapidamente da una configurazione all'altra.

• Soluzione: Crea configurazioni separate con `gcloud config configurations create <name>` ed attivale con `gcloud config configurations activate <name>`.
• Motivo: Le named configuration di gcloud memorizzano credenziali, progetti e zone di default separati e switchabili.
• Alternativa errata: Rieseguire `gcloud auth login` ed inserire il codice ogni volta che si cambia progetto.

## 61. Il team di contabilità ha bisogno di accedere ai report e ai grafici di costo del Billing Account aziendale, ma non deve poter vedere o modificare le risorse dei progetti.

• Soluzione: Assegna al gruppo contabile il ruolo `roles/billing.viewer` direttamente sul Billing Account.
• Motivo: Billing Account Viewer fornisce l'accesso ai report finanziari senza concedere alcun ruolo IAM sui progetti collegati.
• Alternativa errata: Assegnare il ruolo `Viewer` a livello di organizzazione o di cartella.

## 62. Un'applicazione software legacy in esecuzione nel data center locale deve autenticarsi ed invocare le API di Gemini Enterprise / Vertex AI su Google Cloud.

• Soluzione: Crea una chiave di Service Account (JSON file) con i ruoli richiesti ed impostala tramite le Application Default Credentials (ADC).
• Motivo: Per carichi di lavoro residenti completamente fuori dal cloud Google, la chiave privata del SA è lo strumento standard.
• Alternativa errata: Inserire le credenziali dell'account utente personale dell'amministratore nel codice dell'app.

## 63. Vuoi auditare un progetto Google Cloud esistente tramite la CLI per scoprire quali utenti e principali possiedono attualmente il ruolo di Project Owner.

• Soluzione: Esegui il comando `gcloud projects get-iam-policy <project-id>`.
• Motivo: `get-iam-policy` restituisce l'elenco completo dei ruoli IAM definiti sul progetto ed i relativi principali associati.
• Alternativa errata: Usare `gcloud compute instances list` o `gcloud config list`.

## 64. Lavori quasi sempre nella zona `europe-west1-d` del progetto `my-prod-app` e vuoi evitare di dover specificare `--zone` e `--project` a ogni comando `gcloud`.

• Soluzione: Esegui `gcloud config set compute/zone europe-west1-d` e `gcloud config set project my-prod-app`.
• Motivo: La gcloud config memorizza i valori di default locali per zona, regione e progetto usati dai comandi CLI.
• Alternativa errata: Inserire i flag esplicitamente in ogni singolo comando o creare alias Bash non portabili.

## 65. Devi aggiornare una risorsa esistente definita tramite Google Cloud Deployment Manager senza provocare downtime alle risorse esistenti.

• Soluzione: Esegui il comando `gcloud deployment-manager deployments update --config <config-path>`.
• Motivo: Il comando `deployments update` calcola il diff ed applica gli aggiornamenti in-place in modo atomico.
• Alternativa errata: Eliminare il deployment con `deployments delete` e ricrearlo (causerebbe downtime).

## 66. Hai modificato un template complesso di Deployment Manager e vuoi verificare se le dipendenze tra le risorse sono corrette prima di applicare effettivamente i cambiamenti.

• Soluzione: Esegui la distribuzione con la gcloud CLI includendo il flag `--preview`.
• Motivo: L'opzione `--preview` genera il piano di esecuzione e mostra lo stato delle dipendenze senza creare risorse reali.
• Alternativa errata: Eseguire subito l'update in produzione e monitorare gli errori nei log.

## 67. Hai creato vari progetti usando la carta di credito personale per dei test. L'azienda decide di addebitare tutti i costi sul nuovo conto mensile con fattura aziendale.

• Soluzione: Cambia il Billing Account associato ai progetti selezionando il Billing Account aziendale dalla sezione Billing della console.
• Motivo: La riassociazione del conto di fatturazione sposta la responsabilità di pagamento senza toccare le risorse del progetto.
• Alternativa errata: Ricreare tutti i progetti da zero ed effettuare la migrazione dei dati.

## 68. Devi assegnare i permessi a un auditor esterno affinché possa esaminare sia i log di Audit di configurazione che i Data Access logs dell'organizzazione.

• Soluzione: Assegna all'auditor il ruolo IAM `roles/logging.privateLogViewer`.
• Motivo: Il ruolo Private Log Viewer concede la visibilità sui log ad alta sensibilità compresi i Data Access Audit logs.
• Alternativa errata: Assegnare il ruolo `roles/logging.viewer` (non permette la lettura dei log di accesso ai dati privati).

## 69. I file PDF ospitati nel tuo bucket di un sito web statico vengono scaricati dal browser degli utenti anziché aprirsi direttamente nella finestra di visualizzazione.

• Soluzione: Imposta i metadati `Content-Type` degli oggetti PDF su `application/pdf`.
• Motivo: Il metadato HTTP `Content-Type` indica al browser client come interpretare e visualizzare il file.
• Alternativa errata: Cambiare la classe di archiviazione del bucket da Standard a Nearline.

## 70. Vuoi gestire l'accesso SSH alle VM Compute Engine in modo centralizzato usando le identità Google Cloud, eliminando la gestione manuale delle chiavi SSH.

• Soluzione: Abilita OS Login a livello di progetto o tramite Organization Policy ed assegna il ruolo `roles/compute.osLogin` o `osAdminLogin` agli utenti.
• Motivo: OS Login mappa le identità IAM sugli account POSIX delle VM e garantisce l'audit completo degli accessi SSH.
• Alternativa errata: Distribuire manualmente le chiavi SSH pubbliche nei metadati di ciascuna istanza.

## 71. Un'applicazione deve scrivere i propri file di log all'interno del bucket `project-logs`, ma non deve poter leggere, modificare o eliminare i log esistenti.

• Soluzione: Assegna al Service Account dell'app il ruolo `roles/storage.objectCreator` direttamente sul bucket `project-logs`.
• Motivo: Il ruolo Object Creator concede esclusivamente il permesso di scrittura/creazione di nuovi oggetti.
• Alternativa errata: Assegnare `roles/storage.objectAdmin` (concederebbe la cancellazione e modifica dei file esistenti).

## 72. Vuoi impedire in modo assoluto che qualsiasi risorsa o progetto all'interno della gerarchia aziendale sia condivisa con email esterne al tuo dominio Google Workspace.

• Soluzione: Configura il vincolo di Organization Policy `Domain Restricted Sharing` specificando l'ID del tuo dominio Cloud Identity/Workspace.
• Motivo: Il vincolo blocca centralmente qualsiasi tentativo di aggiunta di principali IAM appartenenti a domini esterni.
• Alternativa errata: Rimuovere manualmente gli utenti esterni una volta al mese tramite script.

## 73. Hai abilitato il versioning su un bucket Cloud Storage per proteggere i documenti. Vuoi che le versioni non correnti vengano archiviate a Nearline dopo 30 giorni.

• Soluzione: Aggiungi una regola di Object Lifecycle Management basata su `Noncurrent version age` a 30 giorni con azione `SetStorageClass` su Nearline.
• Motivo: Le regole di ciclo di vita supportano condizioni specifiche sulle versioni precedenti degli oggetti.
• Alternativa errata: Scrivere una Cloud Function scatenata da Cloud Scheduler per eliminare la storia delle versioni.

## 74. Hai installato la Google Cloud CLI su un nuovo computer. Quali comandi devi eseguire per autenticarti ed impostare il progetto di lavoro prima di operare?

• Soluzione: Esegui `gcloud auth login` per autenticarti nel browser e poi `gcloud config set project <project-id>` per definire il progetto.
• Motivo: `gcloud auth login` ottiene i token OAuth2 utente, mentre `config set project` fissa il contesto di lavoro.
• Alternativa errata: Scaricare una chiave privata JSON di un Service Account amministrativo.

## 75. Una pipeline Dataflow in produzione rischia di bloccarsi a causa di errori nel codice. Vuoi ricevere un alert tempestivo prima che impatti i sistemi a valle.

• Soluzione: Configura un alert in Cloud Monitoring sulla metrica `data_watermark_lag` o `data freshness` per Dataflow.
• Motivo: La metrica di data freshness segnala immediatamente se l'elaborazione dei dati della pipeline è in stallo.
• Alternativa errata: Impostare un budget alert sul costo del servizio Dataflow.

