# Associate Cloud Engineer — Cheat sheet per i test

Da tenere aperto mentre fai i quiz. Ricavato dalle 354 domande di examcademy (risposte verificate
con un modello locale e con i voti della community di ExamTopics). Il numero `#n` è l'`id` della
domanda nel JSON `public/samples/google-associateCloudEngineer-examcademy.json`.

> **Nomi vecchi / nuovi, stessi prodotti.** Data Studio = **Looker Studio** (#92, #101, #123, #89) ·
> Cloud Functions = **Cloud Run functions** (#30, #106, #274) · HTTP(S) Load Balancer = **Application
> Load Balancer** · TCP/SSL proxy LB = **proxy Network Load Balancer** · Network LB = **passthrough
> Network Load Balancer** (#133, #139, #177) · Stackdriver = Cloud Logging / Cloud Monitoring (compare solo
> nelle opzioni sbagliate: #23, #237, #254, #273) · Container Registry = **Artifact Registry** (#119 vs #8) ·
> Workload Identity = **Workload Identity Federation** (#100, #371) · Vertex AI = **Gemini Enterprise
> Agent Platform** (#327, #374) · `gsutil` = **`gcloud storage`** (#29, #48, #236) · GCP = Google Cloud.

---

## 1. Le regole d'oro

1. **Least privilege: il ruolo più piccolo che basta.** Se serve solo start/stop/reset di VM → custom role con
   quei 3 permessi (#104); solo creare oggetti in un bucket → `roles/storage.objectCreator` sul bucket (#365, #115, #345);
   solo creare/gestire service account → `roles/iam.serviceAccountAdmin` (#303, #194); solo vedere la gerarchia → `roles/browser` (#282).
2. **Ruolo predefinito se calza; custom solo se i predefiniti danno troppo.** Predefiniti: Storage Admin (#25),
   `spanner.databaseUser` (#31), BigQuery Job User (#120), BigQuery User (#158), Viewer (#52).
   Custom: due ruoli predefiniti con troppi permessi (#69), "query senza cancellare" (#96), "solo list dischi e immagini" (#17),
   permessi che non devono crescere nel tempo (#315), stessi permessi per tutti gli sviluppatori su ogni progetto (#294).
3. **Gruppi, mai utenti singoli, nelle policy IAM** (#31, #96, #120, #158, #109, #366, #4, #105, #310). Entra/esce una persona → cambi solo il gruppo.
4. **Niente chiavi di service account se esiste l'alternativa.** Workload Identity Federation per i Pod GKE (#100, #371),
   impersonation per test in locale (#180, #238, #375), service account **collegato** alla VM/Cloud Run (#56, #67, #293, #321, #261).
   Chiave JSON solo quando il carico gira fuori da Google Cloud (#327) o ti hanno già dato il file (#230). Se proprio serve, org policy sulla durata (#97).
5. **Managed/serverless > self-managed.** Cloud Run per un container (#10, #275, #286, #338, #369), GKE **Autopilot** per Kubernetes
   (#40, #54, #151, #165, #255, #305), Filestore per NFS (#283), Cloud Asset Inventory per cercare risorse (#202), Data Catalog per cercare colonne (#80).
6. **"Fewest steps" / "minimal effort" → la soluzione nativa.** Shut down del progetto (#9), exclusion filter nel Logs Router (#254),
   Marketplace per Jenkins/CMS/Cassandra (#263, #211, #156, #332), `gcloud iam roles copy` (#242, #152), `gcloud config configurations describe` (#77).
7. **Cartelle + Organization Policy per far valere una regola su tanti progetti** (#2, #20, #94, #359). Le policy si ereditano: configurale dove serve (folder/org), non progetto per progetto.
8. **Costi: Billing export → BigQuery → Looker Studio** (#92, #101, #123, #217, #270, #336, #357). Budget con alert per progetto/cartella (#190, #208, #330).
9. **Prima abilita l'API, poi usi il servizio.** `gcloud services enable ...` (#87, #116, #187, #205, #232, #354: errore 403 "API has not been used" → enable).
10. **Ambienti isolati = progetti separati** (#172, #24, #323), non una region diversa nello stesso progetto. La region di App Engine non si cambia: nuovo progetto (#247).
11. **Privato per default.** Niente IP pubblico (#28), Private Google Access (#178), Cloud NAT per uscire (#353, #112), IAP per SSH (#72, #84), Private Service Connect (#251).
12. **Costi di calcolo.** Carico tollerante alle interruzioni → **Spot VM** (#45, #220, #325, #311). Carico NON interrompibile o non checkpointabile → VM normale con start/stop (#73, #246). Archivio → lifecycle verso Coldline/Archive (#174, #206, #243, #269, #322, #358).
13. **Alta disponibilità = più zone/region + health check + MIG.** MIG con autohealing (#44, #195), LB su due zone (#341), PD regionale (#314), Autopilot (#165, #305).
14. **Infrastructure as Code: Terraform (moduli) o Deployment Manager** (#47, #171, #234, #352, #143; #91, #107, #114, #277). Per GKE-first: Config Connector (#356, #169).

---

## 2. Parole/frasi che indicano un'opzione MAI (o quasi mai) corretta

Verificate sulle opzioni sbagliate nel JSON (compaiono nelle opzioni errate, quasi mai nelle corrette; le eccezioni sono segnate).

| Parola / frase nell'opzione | Perché è sbagliata | Esempi (opzione sbagliata) |
|---|---|---|
| **Project Editor / Owner / basic role `roles/editor`** per dare un accesso mirato | Troppo ampio: viola least privilege | #25 (Project Editor), #47, #172, #182 (`roles/editor` al gruppo), #315, #173 (Project Owner al SA) |
| **download the (service account) key / JSON private key / key file** | Le chiavi sono l'ultima spiaggia; si usano attach/impersonation/WIF | #161, #180, #216, #261, #288, #362. *Eccezione:* carico on-prem (#327), file già ricevuto (#230) |
| **instead of** (swap di un parametro con uno simile ma sbagliato) | Variante-trabocchetto della risposta giusta | #45 (N1 instead of N2), #128 (TCP instead of HTTP), #138 (HTTP/2), #195 (Multi-Zone instead of Single-Zone), #236 (console instead of gcloud storage) |
| **Firestore** per dati relazionali/transazionali/SQL | Non è relazionale: la risposta è Spanner/Cloud SQL | #43, #50, #85, #157, #167, #106 |
| **label** per raggruppare/dare permessi | Le label non portano IAM; si usano le **folder** | #86 (labels), #164 (creator label), #169, #195 |
| **Stackdriver** (nome vecchio) | Nome superato, compare solo nelle opzioni errate | #23, #237, #254, #273 |
| **manually / periodically / regularly / scan / script custom** al posto di un servizio gestito | Non è la soluzione nativa né a basso overhead | #15 (Scheduler che scansiona), #30, #143, #201, #276, #309, #105, #106 |
| **GPUs / Add GPUs** quando non richieste | Aggiungono costo senza motivo | #11, #90, #198, #215 |
| **public IP / static public IP / bastion con IP pubblico / internet** in scenari "privati" | Contro il requisito di sicurezza | #5, #6, #32, #84, #88, #112 |
| **allUsers / Grant all / all company users Folder Admin** | Apre a tutti | #373 (allUsers), #105, #182, #245, #315 |
| **CSV / file locale / Google Sheets / desktop tool** per analisi costi o utenti | Non automatizzato, non scalabile | #19, #92, #336 |
| **Delete and recreate / recreate all the nodes / migrate everything to X** | Downtime o lavoro inutile | #90, #254, #309 |
| **third-party tools / consumer Gmail script / Hadoop cluster** quando c'è un prodotto Google | Non è "Google-recommended" | #22, #144, #167 |
| **project-wide SSH keys / SA che aggiunge chiavi SSH** per gestire accessi di molti utenti | Non scala, niente audit: si usa **OS Login** | #26, #153 (project-wide), #335 |
| **Single-Zone / un solo nodo / autoscaler off** in richieste di HA | Nessuna resilienza | #195, #112 |
| **Cloud Scheduler che "scansiona"**, **Kubernetes job che fa polling** | Over-engineering rispetto a policy/trigger nativo | #15, #30 |

Pattern utile: la risposta giusta di solito è la più "pulita", con un solo servizio nativo; le sbagliate sono lunghe, con script, chiavi, copie manuali.

---

## 3. Parole che indicano la risposta giusta

| Se nell'opzione leggi… | …di solito è giusta quando la domanda parla di |
|---|---|
| **Google Group / group** | accessi di più persone (#31, #109, #120, #158, #366) |
| **OS Login** (+ `roles/compute.osLogin` / `osAdminLogin`) | SSH a molte VM, audit, joiner/leaver (#26, #109, #153, #239, #335) |
| **organization policy / constraint** | vincoli su location, domini, servizi, chiavi SA (#2, #15, #20, #97, #359, #367) |
| **folder** | policy/budget/log sink comuni a più progetti (#2, #94, #330, #86) |
| **service account (attached / dedicated / single-purpose)** | identità di VM/app (#56, #115, #261, #321, #365, #38) |
| **Workload Identity Federation / impersonation** | Pod GKE, test in locale, org che vieta le chiavi (#100, #371, #180, #238, #375) |
| **Cloud Billing export to BigQuery** | analisi costi (#92, #101, #123, #270, #357) |
| **alerting policy / log-based metric** | notifiche su CPU, latenza, errori (#22, #162, #173, #235, #363) |
| **Autopilot** | GKE gestito, meno ops (#40, #54, #151, #165, #255, #305) |
| **Cloud Run (revision, traffic split, min instances)** | serverless, canary, cold start (#103, #138, #179, #193, #225) |
| **lifecycle (age + SetStorageClass / Delete)** | transizione classi, scadenza dati (#174, #206, #243, #358) |
| **Private Google Access / Cloud NAT / IAP / Cloud VPN** | accessi senza IP pubblico (#178, #353, #72, #88) |
| **gcloud config (set / configurations)** | default zona/progetto/cluster, più progetti (#189, #259, #349, #268, #77, #113) |
| **Marketplace** | installare software terzo in fretta (#156, #211, #212, #263, #332) |
| **dry run** | stimare costo query BigQuery (#35) |
| **signed URL** | accesso temporaneo senza account Google (#214, #222) |
| **snapshot schedule** | backup disco con retention (#62, #320) |
| **Spot** | batch fault-tolerant (#45, #220, #325) |

---

## 4. Scenario → risposta, per area

### 4.1 IAM, service account, resource hierarchy
| Scenario | Risposta |
|---|---|
| Limitare le region di tutti i progetti dev | Folder + org policy `resourceLocations` (#2, #20, #367: `in:australia-locations`) |
| Solo identità del tuo dominio | Org policy "limit identities by domain" + rimuovi i vecchi (#15); auditor esterno → utente temporaneo in Cloud Identity + Viewer (#240) |
| AD come fonte autorevole | Google Cloud Directory Sync verso Cloud Identity (#19, #135) |
| SSO con IdP SAML aziendale | Cloud Identity → SSO con IdP di terze parti, Google come service provider (#287) |
| Utenti con account Google già esistenti | Invitare a "transfer" l'account (#204) |
| Utenti Workspace → accesso a Google Cloud | Ruoli IAM sulla loro email (#227) |
| Vedere chi è Project Owner / chi ha accesso | `gcloud projects get-iam-policy` (#98), pagina IAM (#99, #164), ruoli con accesso ai dati (#154) |
| Auditor sola lettura sul progetto | Viewer (#52, #240) |
| Auditor sui log (Audit + Data Access) | `roles/logging.privateLogViewer` (#226); log BigQuery → `logging.viewer` + `bigquery.dataViewer` (#308) |
| Controllare le chiavi SA più vecchie di 90 giorni | `gcloud asset search-all-resources ... ServiceAccountKey` (#175) |
| Chiavi SA valide 24h | Org policy sulla durata + deny creazione con eccezione sul progetto `pj-sa` (#97) |
| Pod GKE legge un bucket, chiavi vietate | Workload Identity Federation (#100, #371) |
| App on-prem verso API Google | Crea key file del SA (#327) |
| Test locale dei permessi di un SA | Impersonation; ti serve `roles/iam.serviceAccountTokenCreator` (#238, #375, #180) |
| Più VM, un SA diverso per ciascuna | SA specifico alla creazione (#321, #261, #56) |
| VM scrive in un bucket | SA + `objectCreator` sul bucket (#115, #345, #365) |
| GKE di un progetto legge immagini di un altro | `Storage Object Viewer` al SA dei nodi (#119); con Artifact Registry: nodi con quel SA (#362) |
| App legge dataset BigQuery di un altro progetto | Dare al SA il `bigquery.dataViewer` sul dataset/progetto (#244, #248, #241) |
| SA in `proj-sa` fa snapshot in `proj-vm` | `Compute Storage Admin` su `proj-vm` (#161) |
| Gestire cluster GKE e Cloud SQL con permessi extra indesiderati | Custom role con soli permessi richiesti (#69) |
| Solo deploy di app su GKE | `container.developer` tramite gruppo (#370) |
| Full control su Compute, nient'altro | `roles/viewer` + `roles/compute.admin` (#182) |
| Gestire bucket e file | Storage Admin (#25) |
| Solo lettura su un bucket per un vendor esterno | `Storage Object Viewer` sul bucket (#267); con prefisso → IAM condition (#350) |
| Tutti i dipendenti leggono un dataset | `bigquery.dataViewer` al principal `domain:` (#373) |
| Team monitora Spanner senza vedere i dati | `roles/monitoring.viewer` (#273) |
| Approvare richieste del supporto Google | `roles/accessapproval.approver` a un gruppo (#4) |
| Copiare custom role su altro progetto/org | `gcloud iam roles copy` (#242, #152) |
| Partner esterno su Google Cloud | Il partner crea un SA nel suo progetto, tu gli dai accesso (#241) |
| Trovare perché un utente non accede a Cloud SQL | Prima leggi il messaggio di errore (#196) |
| Spostare un progetto in un'altra org | `projects.move` + cambio billing (#301) |
| Chiudere i costi di un progetto | Project Owner → Shut down (#9) |

### 4.2 Compute Engine e Managed Instance Group
| Scenario | Risposta |
|---|---|
| MIG con ricreazione VM non sane | Autohealing health check (#44, #195) |
| Ricreare subito una VM del MIG | `gcloud compute instance-groups managed recreate-instances` (#55) |
| Rolling update senza ridurre capacità | `rolling-action start-update` `maxSurge 1`, `maxUnavailable 0` (#74) |
| Autoscaler crea troppe VM (boot lento) | Aumenta l'initial delay dell'health check (#128) |
| Esattamente 1 istanza, sempre in vita | MIG autoscaling min=1 max=1 (#141) |
| Stateless su VM con scalabilità | MIG + instance template + autoscaling (#144, #199, #219) |
| HA durante manutenzione | Automatic restart on + migrate VM (#147) |
| Batch tollerante alle interruzioni | Spot VM (#45, #220, #325) |
| Job non checkpointabile (30 h) o notturno 45 min | VM con start/stop o instance schedule (#73, #246) |
| Upgrade memoria 4→8 GB | Stop VM, modifica, start (#223) |
| DB in memoria (ERP) | Famiglia M1 (#198) |
| 96 vCPU equivalenti | `n1-standard-96` (#59) |
| 30 GB di cache + 2 GB, poche CPU | Custom machine type 6 vCPU/32 GB (#337) |
| Disco più veloce, letture di file grandi | Local SSD (#233) |
| Massimi IOPS + recovery (SAP HANA, DB interno) | Hyperdisk Extreme (#351, #66) |
| Resistere al guasto di una zona (disco) | PD regionale (#314) |
| Resistere al guasto di una zona (VM) | Risorse in due zone + LB (#341) |
| Backup disco con retention | Snapshot schedule (#62, #320) |
| Clonare una VM | Immagine da snapshot, istanze dall'immagine (#185) |
| Evitare cancellazioni accidentali da altri team | Deletion protection (#253) |
| SSH senza IP pubblico | IAP (`gcloud compute ssh --tunnel-through-iap`, range 35.235.240.0/20, porta 22) (#72, #84) |
| SSH gestito a livello di org | OS Login via org policy (#26), con gruppo (#109), `compute.osLogin` (#239) |
| SSH per partner senza account Google | Chiave pubblica sul VM (#258, #278) |
| Windows RDP | `gcloud compute reset-windows-password` (#288); SQL Server di test: utente/password dalla console (#344) |
| IP interno fisso | Riserva/promuovi IP statico interno (#6, #108, #309) |
| Installare sw e vulnerabilità | OS Config agent + `osconfig.vulnerabilityReportViewer` (#137) |
| Log da disco della VM | Ops Agent → Cloud Logging (#329) |
| MIG non riesce a creare istanze | Template valido + elimina i dischi con lo stesso nome (#295) |

### 4.3 GKE
| Scenario | Risposta |
|---|---|
| Cluster gestito, privato, meno ops | Private Autopilot (#40) |
| Produzione affidabile | Autopilot + release channel stable (#54, #305) |
| Pagare solo ciò che usa, senza gestire nodi | Autopilot (#165, #151, #255) |
| Fixed node count / service mesh | Standard + node pool fisso + Cloud Service Mesh (#260) |
| Deploy immagine | Artifact Registry + Deployment (#8); un Deployment per microservizio (#218) |
| Esporre in HTTPS | Service NodePort + Ingress (#197) |
| Un agent su ogni nodo | DaemonSet (#213) |
| DB che non deve perdere dati | StatefulSet + cluster autoscaling (#302) |
| Limiti CPU/memoria sbagliati | Vertical Pod Autoscaler (#51, #317); HPA + VPA recommendations se incerti (#290) |
| Più nodi con crescita futura | Autoscaling del node pool min/max (#184) |
| Spot per parti fault-tolerant | Node pool Spot + pool standard (#311) |
| Pod su GPU | Nuovo node pool GPU + `nodeSelector` (#90); job lunghi non riavviabili → node auto-provisioning (#215) |
| Nodi diversi per carico CPU-bound | Node pool compute-optimized (#262), nuovo pool `n2-highmem-16` (#342) |
| Isolare codice arbitrario dei clienti | Sandbox gVisor (#188) |
| Pod Pending | `describe pod`, leggi i warning (#16); spesso mancano risorse (#209) |
| Rollback di un rolling update | `kubectl rollout undo` (#276) |
| Password non in chiaro | Secret (#291) |
| Versione stabile nel tempo | Node auto-upgrades (#70) |
| `kubectl` non vede il cluster Autopilot | `gcloud container clusters get-credentials` (#333) |
| IP in uscita fissi | Nodi privati + Cloud NAT con IP statici (#112) |
| Nodi senza IP, subnet esaurita | Espandi la CIDR della subnet (#122) |
| Cluster default per gcloud | `gcloud config set container/cluster dev` (#259) |
| Risorse Google Cloud con YAML Kubernetes | Config Connector (#356); cancellare con `kubectl delete` (#169) |
| Fine-tuning LLM | GKE + acceleratori (#281) |
| Servizio GKE raggiunto da Cloud Run | Internal ALB + Cloud DNS + Direct VPC egress (#32); da altra VPC → Service internal LB + peering (#296) |

### 4.4 Cloud Run, App Engine, Cloud Run functions
| Scenario | Risposta |
|---|---|
| Container, pochissime richieste, minimo costo | Cloud Run (#275, #338, #286) |
| Scale to zero, subito in produzione | Cloud Run (#369, #83) |
| Microservizi Docker on-prem → serverless | Cloud Run, aggiorna endpoint e config (#10) |
| Batch giornaliero con retry | Cloud Run job + Cloud Scheduler (#166) |
| Elaborare messaggi Pub/Sub | Push subscription con SA + Cloud Run Invoker (#110); async (#149, #106) |
| Eventi di servizi Google, endpoint pubblico | Cloud Run + Eventarc (#140) |
| Codice su upload di file | Cloud Run functions con trigger bucket (#274, #30) |
| Web app + API + job lungo | App Engine + Cloud Run + Cloud Tasks (#76) |
| Interno (IP privato) con update frequenti | Cloud Run + Private Service Connect (#251) |
| Canary | Nuova revision + traffic split (#103, #193, #225) |
| Prima pagina lenta (cold start) | Min instances (#138); due istanze idle pronte → min 2 (#179) |
| Picco mattutino che esaurisce la quota API di Cloud SQL | Modifica (riduci) le max instances di Cloud Run (#340) |
| App Engine: rollback | Versions → 100% al precedente (#63) |
| App Engine: 1% di traffico | Split dei versioni (`--splits`) (#145, #339, #347) |
| App Engine: istanze idle | Automatic scaling + `min_idle_instances` (#231) |
| App Engine in altra region | Nuovo progetto (#247) |

### 4.5 Networking e load balancer
| Scenario | Risposta |
|---|---|
| Due VPC in due progetti | VPC Peering (#34); Shared VPC (stessa org) (#93, #256) |
| Più region nello stesso VPC | Un'altra subnet nello stesso VPC (#36, #81) |
| Sub-net il più grande possibile | `10.0.0.0/8` (#60) |
| 3 tier, 1000+ IP | Un VPC /16, 3 subnet + firewall (#95) |
| DMZ + LAN | Un VPC con due subnet + firewall (#27) |
| Subnet senza IP liberi | Espandi il range con gcloud (#79, #134, #207, #343) |
| Firewall tra tier | Con service account come source/target (#170, #284); tag di rete (#272) |
| Minimo egress consentito | Regola 65534 blocca tutto + 1000 apre le porte (#129) |
| VM senza IP pubblico: accesso a Cloud Storage | Private Google Access (#178) |
| VM senza IP pubblico: scarica aggiornamenti | Cloud NAT (#353) |
| On-prem senza IP pubblico → Cloud Storage | VPN/Interconnect + `restricted.googleapis.com` 199.36.153.4/30 (#5) |
| Burst con IP privati | Cloud VPN (#88); HA VPN con BGP e active/passive (#21) |
| DNS verso DB on-prem | Zona privata Cloud DNS (#131), con nome interno (#306) |
| Apex + www + home | A su apex, CNAME per gli altri (#224) |
| Premium vs Standard Tier | Premium produzione, Standard sviluppo (#111) |
| Web globale su MIG | External Application LB globale + A record in zona pubblica (#53, #183, #203) |
| SSL terminato sull'LB | External Application LB (#326) |
| TCP+SSL globale | Global external proxy NLB (SSL proxy) (#133) |
| TCP con IP del client preservato | External passthrough NLB (#139) |
| UDP, un solo IP | External passthrough NLB (#177) |
| Calcolo costi | Pricing Calculator (#37, #146, #11) |

### 4.6 Storage e database
| Scenario | Risposta |
|---|---|
| Relazionale, globale, forte consistenza | Spanner (#3, #85, #176, #292, #334, #168, #136, #157) |
| PostgreSQL, ACID, poche modifiche, singola sede | Cloud SQL (#43) |
| PostgreSQL, transazioni + analisi, gestito | AlloyDB + Database Migration Service (#18) |
| Sub-millisecondo, time series, IoT | Bigtable (#7, #57, #250) |
| Quale per cosa | Cloud SQL clienti, Cloud Storage Archive per log, Bigtable per sensori (#50) |
| Ingest IoT | Pub/Sub → Dataflow → Cloud Storage (#49); pipeline: Pub/Sub, Dataflow, Bigtable, BigQuery (#250) |
| Dati per Dataflow ETL | Carica su Cloud Storage con `gcloud storage` (#48) |
| SQL su file Avro in Cloud Storage | Tabelle esterne BigQuery (#167, #361, #252) |
| Cloud SQL sicuro con IAM | IAM database authentication + Cloud SQL Auth Proxy (#42) |
| Point-in-time recovery | Cloud SQL con PITR attivo (#304) |
| Copia mensile per 3 anni | Export su bucket Archive (#130) |
| NFS gestito | Filestore (#283) |
| MongoDB / Cassandra / Jenkins | Marketplace (#212, #332, #211) |
| Scaling Spanner con traffico prevedibile | Alert Monitoring + Cloud Run function che ridimensiona (#200); performance → alert su CPU ~65% e aggiungi nodi (#210) |
| Spanner lento su una tabella | Chiave primaria non monotona (#264) |
| Caching di costi BigQuery | Quote per utente/progetto + capacity pricing con slot (#159) |
| Costo di una query | Dry run + Pricing Calculator (#35) |
| Trovare colonne `employee_ssn` | Data Catalog (#80) |
| Accesso temporaneo a un oggetto | Signed URL (#222, #214) |
| PDF si scarica invece di aprirsi | Content-Type `application/pdf` (#271) |
| Notifica per modifiche agli oggetti | Pub/Sub notifications sul bucket (#125) |
| Upload veloce 32 GB su Nearline | `gcloud storage` con parallel composite uploads (#236) |
| Upload automatico di immagini on-prem | Script con `gcloud storage` + cron (#29) |
| 150 TB on-prem, banda controllata | Storage Transfer Service (#142) |
| 200 TB SAN + Redshift + S3 | Transfer Appliance + BigQuery DTS + Storage Transfer Service (#313) |
| Archiviare dopo N giorni | Object Lifecycle (#174, #206, #243, #269, #322, #358) |
| Versioni vecchie | Lifecycle sulle versioni non correnti a Nearline (#126); versioning + max versioni (#186) |
| Accesso 1 volta a trimestre | Coldline (#221, #319) |
| Dati usati continuamente, utenti in una città | Standard regional (#312) |
| Log di 3 anni a basso costo | Aggregated sink → Cloud Storage Coldline (#299) |

### 4.7 Billing e budget
| Scenario | Risposta |
|---|---|
| Nuovo billing account e link | Project Billing Manager sul progetto, poi crea e collega (#58) |
| Fatture aziendali invece di carta personale | Cambia il billing account del progetto (#64, #249) |
| Consolidare costi di due org | Collega i progetti al billing account (#289), `projects.move` + billing (#301) |
| Fatture separate per startup | Una folder + un billing account per startup (#229) |
| Chi può collegare progetti al billing | Billing Account User + Project Billing Manager sull'org (#124); Billing Account Administrator (#160) |
| Ingegneri creano progetti senza carta | Billing account con metodo di pagamento, permessi di link (#245) |
| Solo report | `roles/billing.viewer` (#192) |
| Budget per progetto | Budget alert per progetto (#190, #208); sandbox con folder (#330) |
| Stop automatico alla soglia | Budget → Pub/Sub → Cloud Run function che ferma la VM (#372) |
| Alert di costo di egress | Export → funzione + Scheduler (#279) |
| Notifica su Slack | Pub/Sub + Cloud Run function (#360) |
| Dashboard di costo, dati dettagliati | Export a BigQuery + Looker Studio (#92, #101, #123, #217) |
| Export all'apertura | Abilita l'export quando crei il billing account (#270) |
| Export giornaliero a livello risorsa | Standard + detailed usage cost export (#357) |
| Analisi con SQL e proiezione | Export + query SQL a finestre temporali (#336) |

### 4.8 Logging e Monitoring
| Scenario | Risposta |
|---|---|
| Chi ha letto i dati nei bucket | Data Access audit logs attivi + Logs Explorer (#1, #13, #300) |
| Quando è stato creato un SA | Activity log, categoria Configuration (#78) |
| Quando sono stati dati ruoli IAM | Admin Activity logs (#307) |
| Log SQL con grafici | Ops Agent + Log Analytics (#68); bucket + dataset collegato in BigQuery (#75) |
| Log di più progetti per 60 giorni | Sink verso BigQuery con scadenza tabella (#266) |
| Log verso BigQuery | Sink con filtro Compute Engine (#163) |
| Log verso SaaS esterno | Sink verso Pub/Sub (#155, #150 con SIEM) |
| Spegnere log troppo costosi | Exclusion filter nel Logs Router (#254) |
| Alert CPU/latenza | Alerting policy (#22, #162, #363) |
| Alert su errore specifico | Log-based metric + alerting policy (#173, #235) |
| Dataflow job bloccati | Alert sulla metrica data freshness (#41) |
| Più progetti, una vista | Un metrics scope che include gli altri (#237, #318) |
| Dati e HA dei DB | Database Center (#364) |
| Metriche di connessioni DB | Log + metrica custom + dashboard (#368) |
| Accesso a log filtrati | Log view + `logging.viewAccessor` (#65) |
| Errore criptico nei log | Investigate con Gemini Cloud Assist (#201) |

### 4.9 Comandi ricorrenti (gcloud / kubectl / bq)
| Comando | Uso | Esempio |
|---|---|---|
| `gcloud services enable <api>` / `gcloud services list --project` | Abilita/lista API | #187, #331, #354 |
| `gcloud config set project|compute/zone|container/cluster` | Default | #189, #259, #216 |
| `gcloud config configurations create/activate/describe/list` | Più progetti | #349, #268, #77, #113 |
| `gcloud auth login` / `gcloud auth activate-service-account` | Autenticazione utente / SA | #216, #230 |
| `gcloud projects get-iam-policy` | Chi ha cosa | #98 |
| `gcloud iam roles copy` / `describe roles/...` | Custom role / vedere permessi | #242, #152, #31 |
| `gcloud container clusters get-credentials` / `create-auto` | Accesso kubectl / Autopilot | #333, #305 |
| `kubectl rollout undo` / `describe pod` | Rollback / diagnosi | #276, #16 |
| `gcloud compute instance-groups managed recreate-instances` | Ricrea VM del MIG | #55 |
| `gcloud compute reset-windows-password` | Windows | #288 |
| `gcloud compute ssh --tunnel-through-iap` | SSH senza IP pubblico | #84 |
| `gcloud pubsub subscriptions pull <sub> --auto-ack` | Leggi e ack | #39 |
| `gcloud storage` (sostituisce `gsutil`) | Upload/sync | #29, #48, #236 |
| `gcloud asset search-all-resources` | Cerca risorse/chiavi | #175, #202 |
| `gcloud deployment-manager deployments update --config` (e `--preview`) | DM senza downtime / anteprima | #277, #23 |
| `bq` / dry run | Stima byte letti | #35 |
| `apt-get install google-cloud-sdk-datastore-emulator` | Emulatore locale | #181 |
| `CLOUDSDK_PROXY_USERNAME/PASSWORD` | Proxy senza log delle credenziali | #14 |

---

## 5. Coppie trabocchetto

| Coppia | Come si distinguono | Esempi |
|---|---|---|
| **Passthrough NLB vs proxy NLB vs Application LB** | Preserva IP del client / UDP → **passthrough**; SSL/TCP globale → **proxy**; HTTP(S) con terminazione SSL e URL map → **Application LB** | #139, #177, #133, #203, #326 |
| **Storage Object Viewer vs Creator vs User/Admin** | Leggere = Viewer (#267, #119); creare = Creator (#115, #345, #365); gestire bucket+file = Storage Admin (#25) | #25, #115, #267, #365 |
| **Spanner vs Cloud SQL vs AlloyDB vs Bigtable vs Firestore** | Spanner = relazionale globale/scale; Cloud SQL = regionale, PostgreSQL/MySQL "lift & shift"; AlloyDB = PostgreSQL pesante (OLTP+analitica); Bigtable = NoSQL wide-column sub-ms; Firestore = mai la risposta qui | #3, #43, #18, #7, #157, #85 |
| **Transfer Appliance vs Storage Transfer Service vs `gcloud storage` vs BigQuery DTS** | Appliance = centinaia di TB offline; STS = on-prem o S3, banda controllabile; `gcloud storage` = script/cron; DTS = warehouse (Redshift) | #142, #313, #29, #236 |
| **Classi di storage** | Standard (frequente) → Nearline (mensile) → Coldline (trimestrale) → Archive (annuale+) | #126, #221, #269, #319, #358 |
| **Folder vs label vs project** | IAM/policy → folder; label non danno permessi; isolare = progetti | #86, #172 |
| **VPC Peering vs Shared VPC vs Cloud VPN** | Peering = due VPC; Shared VPC = host/service project nella stessa org; VPN = on-prem | #34, #93, #256, #88 |
| **Private Google Access vs Cloud NAT** | PGA = API Google senza IP pubblico; NAT = Internet in uscita | #178, #353 |
| **Autopilot vs Standard** | Autopilot = paghi i pod, zero nodi; Standard = node pool tuoi (serve per numero fisso di nodi, GPU pool, ecc.) | #165, #260, #90 |
| **HPA vs VPA vs cluster autoscaler** | HPA = repliche; VPA = limiti CPU/mem (anche con 1 replica); cluster autoscaler = nodi | #51, #290, #317, #184 |
| **Cloud Run service vs job vs functions** | Service = HTTP; job = batch con retry; functions = evento da bucket | #275, #166, #274 |
| **Cloud Run min vs max instances** | Min = cold start/idle pronte (#138, #179); max = limitare chiamate al DB (#340) | #138, #340 |
| **Workload Identity vs chiave SA vs attached SA** | Pod GKE → WIF; fuori Google → key; VM/Cloud Run → attached | #100, #327, #56 |
| **OS Login vs chiavi SSH** | OS Login = utenti Google/IAM; chiavi SSH = partner senza account | #26, #258, #278 |
| **Budget alert vs stop automatico** | Alert = solo notifica; stop = Pub/Sub + funzione | #190, #372 |
| **Admin Activity vs Data Access logs** | Config/IAM = Admin Activity (#307); letture dati = Data Access, da attivare (#1, #13) | #1, #13, #307 |
| **Log sink vs exclusion** | Sink = esporta; exclusion = scarta | #163, #254 |
| **Snapshot vs immagine** | Snapshot = backup disco; immagine = clonare VM | #62, #185 |
| **On-demand vs capacity (slot) in BigQuery** | Costi alti → quote custom + editions con slot reservations | #159 |
| **`gcloud config set` vs `configurations`** | Un default vs più set di progetti | #189, #349 |
| **Deployment Manager vs Terraform** | Entrambi IaC; per multi-cloud o moduli → Terraform | #234, #47, #91 |
| **Region vs zona** | Singola zona = SPOF; più zone + LB per HA | #195, #341 |
