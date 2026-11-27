# Associate Cloud Engineer — Guida ai temi / Topic guide (IT · EN)

Il JSON ha 4 topic (campo `topic`). I titoli sotto sono dedotti dal contenuto delle domande di ciascun topic.
Conteggi contati dall'estratto `verifica/estratto_compatto.txt` (totale 354):

| Topic | Contenuto prevalente (EN) | Contenuto (IT) | Domande nel JSON |
|---|---|---|---|
| 1 | Setting up a cloud solution environment | Progetti, gerarchia, org policy, identità, billing | 43 |
| 2 | Planning and implementing a cloud solution | Compute, GKE, serverless, rete, storage, database, IaC | 149 |
| 3 | Ensuring successful operation | Logging, monitoring, backup, lifecycle, scaling, troubleshooting | 94 |
| 4 | Configuring access and security | IAM, service account, gcloud, ruoli, audit degli accessi | 68 |

> **Nomi cambiati dei prodotti (le domande usano entrambi).**
> **Data Studio → Looker Studio** (#92, #101, #123, #89) · **Cloud Functions → Cloud Run functions** (#30, #106, #274) ·
> **HTTP(S) Load Balancer → Application Load Balancer** (#53, #203, #326) · **SSL/TCP Proxy LB → proxy Network Load Balancer** (#133) ·
> **Network Load Balancer → passthrough Network Load Balancer** (#139, #177) · **Stackdriver → Cloud Logging / Cloud Monitoring** (nelle opzioni sbagliate: #23, #237, #273) ·
> **Container Registry → Artifact Registry** (#119 vs #8, #286, #362) · **Workload Identity → Workload Identity Federation** (#100, #371) ·
> **Vertex AI → Gemini Enterprise Agent Platform** (#327, #374) · **`gsutil` → `gcloud storage`** (#29, #48, #236) ·
> **GCP → Google Cloud** (#63, #247) · **Cloud Source Repositories** compare ancora in #107.

---

## 1. Topic 1 — Ambiente / Setting up the environment (43 domande)

### Gerarchia e policy / Resource hierarchy
| Termine / Term | EN | IT | Frase d'esame / Exam phrase |
|---|---|---|---|
| **Organization → Folder → Project** | Resource hierarchy: policies and IAM are inherited downward. | Gerarchia: IAM e policy si ereditano verso il basso. | "Organize projects under folders for each department" (#94) |
| **Folder** | Groups projects that share IAM policies or org policies. | Raggruppa progetti con IAM/policy comuni. | "Use folders to group resources that share common IAM policies" (#86) |
| **Organization Policy** | Constraint set on org/folder/project (locations, domains, services, key lifetime). | Vincolo applicato a org/folder/progetto. | "Create an organization policy to limit resources in US locations" (#2) |
| **resourceLocations constraint** | Restricts where resources can be created. | Limita le region. | "Configure the policy at the organization level, and add all allowed locations" (#20); `gcp.resourceLocations` con `in:australia-locations` (#367) |
| **Domain restricted sharing** | Only identities from your domain can get access. | Solo identità del tuo dominio. | "limit identities by domain, and then retroactively remove the existing mismatched users" (#15) |
| **Project** | Unit for APIs, billing and isolation; `projects.move` to change org. | Unità di isolamento, API e fatturazione. | "Create a new project, enable the APIs, and replicate the setup" (#172); `projects.move` (#301) |
| **Shut down** | Project owner can stop all services of a project. | Spegnere un progetto. | "Locate the project in the console, click Shut down and then enter the project ID" (#9) |
| **Enable API** | Each service needs its API enabled first. | Ogni servizio richiede la sua API. | "Run `gcloud services enable container.googleapis.com`" (#354); "Enable the Cloud Spanner API" (#116) |

### Identità / Identity
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Cloud Identity** | Identity service for users and groups, even without Workspace. | Servizio di identità utenti e gruppi. | "Organize the users in Cloud Identity into groups. Enforce multi-factor authentication" (#310) |
| **Google Cloud Directory Sync (GCDS)** | Syncs users from AD/LDAP to Cloud Identity, one-way. | Sincronizza utenti da AD/LDAP verso Cloud Identity. | "Use GCDS to synchronize users into Cloud Identity" (#19, #135) |
| **SSO / SAML** | Third-party IdP authenticates users; Google is the service provider. | L'IdP aziendale autentica; Google è service provider. | "set up SSO with a third-party identity provider with Google as a service provider" (#287) |
| **Transfer account** | Existing consumer accounts are invited to transfer. | Gli account personali esistenti vengono trasferiti. | "Invite the user to transfer their existing account" (#204) |

### Billing / Fatturazione
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Billing account** | Pays for linked projects; one account can serve many projects. | Account che paga i progetti collegati. | "Change the billing account of your projects to the billing account of your company" (#64) |
| **Project Billing Manager** | Can link/unlink a project to a billing account. | Può collegare un progetto a un billing account. | "Verify that you are Project Billing Manager for the project" (#58) |
| **Billing Account User** | Can link projects to the account. | Può associare progetti all'account. | "Billing Account User role on the billing account and Project Billing Manager on the organization" (#124) |
| **Billing Account Viewer** | View reports, no project permissions. | Vede i report, nulla sul progetto. | "roles/billing.viewer on the billing account" (#192) |
| **Budget and alert** | Threshold notifications per project or folder; they do not stop spending. | Soglie di notifica per progetto/folder; non bloccano la spesa. | "Create a budget per project and configure budget alerts" (#208); "Create a Budget Alert for $1,000 and scope it to the Folder" (#330) |
| **Billing export to BigQuery** | Detailed cost data to BigQuery for SQL and dashboards. | Export dei costi in BigQuery. | "Configure Cloud Billing data export to BigQuery... Create a Data Studio dashboard" (#92, #101, #123) |
| **Budget → Pub/Sub → function** | Programmatic automation (Slack, stop VM). | Automazione programmatica. | "Create a Pub/Sub topic, and connect it to the budget. Create a Cloud Run function" (#372, #360) |
| **Cloud Asset Inventory** | Managed search over resources. | Ricerca gestita delle risorse. | "Use Cloud Asset Inventory to query for all Compute Engine instances with a public IP address" (#202) |

### Strumenti / Tools
- `gcloud config` / **configurations**: `gcloud config set container/cluster dev` (#259), configurazione per progetto (#349, #268).
- **Metrics scope**: "add projects B and C to the metrics scope of project A" (#318).
- Emulatore locale: "Install the google-cloud-sdk-datastore-emulator component using apt get" (#181).

### Mini-quiz mentale / Quick check
1. Più progetti dev limitati agli US → folder + org policy (#2).
2. Due org da fondere su una fattura → link dei progetti al nostro billing account (#289).
3. Creare VM in progetto nuovo → crea progetto, abilita Compute Engine API, poi istanza (#87).
4. Una fattura per startup → folder + billing account ciascuna (#229).

---

## 2. Topic 2 — Pianificare e implementare / Planning and implementing (149 domande)

### Compute Engine e MIG
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Managed Instance Group (MIG)** | Identical VMs from a template, with autoscaling and autohealing. | VM identiche da un template, con autoscaling e autohealing. | "Create an instance template, and use the template in a managed instance group with autoscaling configured" (#144) |
| **Autohealing health check** | Recreates unhealthy VMs. | Ricrea VM non sane. | "Create a health check on port 443 and use that when creating the MIG" (#195); "initial delay of the health check to 200 seconds" (#128) |
| **Rolling update** | `maxSurge` and `maxUnavailable` control capacity. | Aggiornamento graduale. | "maxSurge set to 1 and maxUnavailable set to 0" (#74) |
| **Spot VM** | Cheap, can be preempted; for fault-tolerant batch. | VM economica, interrompibile. | "Use Spot VMs on Compute Engine" (#220, #325, #45) |
| **Instance schedule** | Start/stop VMs on schedule. | Avvio/arresto pianificato. | "Lift and shift to a VM... Use an instance schedule" (#246, #73) |
| **Machine type** | Predefined or custom; M1 for in-memory. | Tipo di macchina. | "Provision Compute Engine instances with M1 machine type" (#198); custom 6 vCPU/32 GB (#337) |
| **Hyperdisk Extreme** | Highest IOPS block storage. | Disco a massimi IOPS. | "Use Hyperdisk Extreme disks for the application data" (#351, #66) |
| **Local SSD** | Highest throughput, tied to the VM. | Massimo throughput, legato alla VM. | "Migrate to use a Local SSD on the instance" (#233) |
| **Regional persistent disk** | Replicated across two zones. | Replicato su due zone. | "Store the application data on a regional persistent disk" (#314) |
| **Deletion protection** | Prevents accidental deletion. | Protegge dalla cancellazione. | "Enable deletion protection on the instance" (#253) |
| **OS Login** | IAM-based SSH access, audited. | SSH tramite IAM, con audit. | "Enable OS Login by using an organization policy" (#26); "OS Login for this group" (#109) |
| **Cloud Marketplace** | Ready-made third-party solutions. | Soluzioni pronte di terzi. | "Deploy Jenkins through the Google Cloud Marketplace" (#211, #263, #156) |

### GKE
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **GKE Autopilot** | Google manages nodes; you pay for pods. | Nodi gestiti da Google. | "Deploy a private Autopilot cluster" (#40); "Provision a GKE Autopilot cluster" (#151) |
| **GKE Standard** | You manage node pools. | Gestisci i node pool. | "GKE Standard cluster with a node pool that has a fixed number of nodes. Enable Cloud Service Mesh" (#260) |
| **Release channel** | Controls upgrades; stable for production. | Canale di rilascio. | "Enroll the cluster in the stable release channel" (#54) |
| **Deployment** | One per microservice for independent scaling. | Uno per microservizio. | "Create and deploy a Deployment per microservice" (#218) |
| **Ingress / NodePort** | Exposes the Service through a Cloud Load Balancer. | Espone via LB. | "Kubernetes Service of type NodePort... and a Kubernetes Ingress" (#197) |
| **Config Connector** | Manages Google Cloud resources as Kubernetes objects. | Risorse Google Cloud come oggetti Kubernetes. | "Install Config Connector in a GKE cluster" (#356, #169) |
| **Node pool with Spot** | Cost optimisation for tolerant workloads. | Pool Spot per parti tolleranti. | "cluster with both a Spot VM node pool and a standard node pool" (#311) |
| **Service account for nodes** | Nodes pull images with their service account. | I nodi scaricano immagini con il loro SA. | "Deploy the cluster nodes with the specified service account" (#362) |

### Serverless e eventi
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Cloud Run** | Serverless containers, scales to zero. | Container serverless. | "Deploy the container on Cloud Run" (#275, #338, #369) |
| **Cloud Run job** | Batch tasks with retries, triggered by Scheduler. | Job batch con retry. | "deploy the application as a Cloud Run job. Use Cloud Scheduler" (#166) |
| **Cloud Run functions** | Event-triggered code. | Codice a evento. | "Use Cloud Run functions and configure the bucket as a trigger resource" (#274) |
| **Eventarc** | Event delivery for Cloud Run. | Consegna eventi. | "Deploy your code to Cloud Run. Use Eventarc" (#140) |
| **Pub/Sub push** | Subscription pushes with a service account to Cloud Run. | Push con service account. | "Give the Cloud Run Invoker role to that service account" (#110) |
| **Cloud Tasks** | Queue for background work. | Coda per job in background. | "Use Cloud Tasks to run your background job on Cloud Run" (#76) |
| **App Engine traffic splitting** | `--splits` between versions. | Divisione del traffico tra versioni. | "use the --splits option to give a weight of 99... and 1" (#145, #339, #347) |

### Rete / Networking
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Custom mode VPC / subnet** | Subnets are regional; a VPC is global. | Subnet regionali; VPC globale. | "Create a subnetwork in the same VPC, in europe-west1" (#36); "10.0.0.0/8" (#60) |
| **VPC Network Peering** | Private connectivity between two VPCs. | Connessione privata tra VPC. | "Create VPC Network Peering between vpc-a and vpc-b" (#34) |
| **Shared VPC** | Host project shares subnets with service projects (same org). | Host project condivide con service project. | "Create a host VPC project with each production project as its service project" (#256, #93) |
| **Hierarchical firewall policy** | Firewall rules at org/folder level. | Firewall a livello org. | "Apply hierarchical firewall policies on the organization level" (#256) |
| **Firewall by service account / tag** | Source and target by identity. | Sorgente/destinazione per service account. | "Targets: all instances with tier #2 service account" (#170, #284); network tag (#272) |
| **Cloud NAT / Private Google Access** | Egress / Google APIs without public IP. | Uscita / API Google senza IP pubblico. | "Enable Private Google Access on the subnet" (#178) |
| **Cloud VPN / Cloud Router (BGP)** | Encrypted tunnel with dynamic routing. | Tunnel cifrato con routing dinamico. | "custom mode VPC network, use Cloud Router BGP routes, and use active/passive routing" (#21) |
| **Network Service Tiers** | Premium vs Standard. | Premium vs Standard. | "Premium Tier for production... Standard Tier for development" (#111) |
| **Cloud DNS private zone** | Names for internal resources. | Nomi interni. | "Create a private zone on Cloud DNS" (#131, #306) |

### Load balancer
| Tipo (EN) | IT | Frase d'esame |
|---|---|---|
| **External Application Load Balancer** | HTTP(S) layer 7, global, SSL termination, URL map. | "global external Application Load Balancer with a Google-managed SSL certificate... a URL map" (#203, #326, #53) |
| **Global external proxy NLB (SSL proxy)** | TCP over SSL, global. | "Global external proxy Network Load Balancer with an SSL proxy" (#133) |
| **External passthrough NLB** | Preserves client IP, TCP/UDP, regional. | "external passthrough Network Load Balancer" (#139, #177) |
| **Internal Application LB** | Private HTTP(S). | "Deploy an internal Application Load Balancer" (#32) |

### Storage e database
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Spanner** | Globally distributed relational DB, strong consistency. | Relazionale globale. | "Use Spanner for data storage" (#85, #3, #176, #334) |
| **Cloud SQL** | Managed MySQL/PostgreSQL, regional. | MySQL/PostgreSQL gestito. | "Cloud SQL" (#43); "IAM database authentication... Cloud SQL Auth Proxy" (#42) |
| **AlloyDB** | PostgreSQL-compatible for transactional and analytical. | PostgreSQL per transazionale + analitico. | "Migrate the database to AlloyDB by using Database Migration Service" (#18) |
| **Bigtable** | Wide-column NoSQL, sub-millisecond, time series. | NoSQL a bassa latenza. | "Store the IoT data in Bigtable" (#7); "row key based on the event timestamp" (#57) |
| **BigQuery external table** | SQL on files in Cloud Storage without loading. | SQL su file senza caricarli. | "Create external tables in BigQuery that point to Cloud Storage" (#167, #361) |
| **Filestore** | Managed NFS. | NFS gestito. | "Deploy a Filestore instance" (#283) |
| **Storage classes** | Standard, Nearline, Coldline, Archive. | Classi per frequenza d'accesso. | "Coldline Storage" (#221); "Archive storage" (#358) |
| **Object Lifecycle Management** | Age-based `SetStorageClass`/`Delete`. | Regole su età. | "age condition of 90 days and uses the SetStorageClass action" (#358, #243) |
| **Transfer Appliance / Storage Transfer Service** | Offline hardware vs managed online transfer. | Hardware offline vs trasferimento online. | "Use Transfer Appliance for the videos, BigQuery Data Transfer Service... Storage Transfer Service" (#313, #142) |
| **Pub/Sub + Dataflow** | Streaming ingest and processing. | Ingest e elaborazione in streaming. | "Stream data to Pub/Sub, and use Dataflow to send data to Cloud Storage" (#49, #250) |

### IaC
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Terraform modules** | Reusable, compliant building blocks. | Moduli riusabili conformi. | "Write Terraform modules for each component that are compliant" (#47, #171) |
| **Terraform backend** | Shared remote state. | State condiviso. | "Configure a Cloud Storage backend in Terraform" (#143) |
| **Deployment Manager** | Google IaC; `--preview`; `update --config`. | IaC di Google. | "gcloud deployment-manager deployments update --config" (#277); `--preview` (#23) |

### Mini-quiz mentale
1. Relazionale globale + stesso stato ovunque → Spanner (#85).
2. UDP su più VM con un solo IP → external passthrough NLB (#177).
3. Notturno tollerante agli stop → Spot (#325).
4. Container con poco traffico → Cloud Run (#275).

---

## 3. Topic 3 — Operazioni / Ensuring successful operation (94 domande)

### Logging
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Data Access audit logs** | Record reads of user data; must be enabled. | Registrano le letture dei dati; vanno attivati. | "Turn on Data Access audit logs for Cloud Storage" (#1, #13, #150) |
| **Admin Activity logs** | Record config and IAM changes. | Modifiche di configurazione/IAM. | "review admin activity logs" (#307); Activity log category Configuration (#78) |
| **Log sink** | Exports logs to BigQuery, Pub/Sub, Cloud Storage. | Esporta i log. | "Create a Cloud Logging sink and configure Pub/Sub as the destination" (#155, #163) |
| **Aggregated sink** | One sink across projects. | Un sink per più progetti. | "aggregated log sink that routes Cloud Audit Logs to a Cloud Storage bucket that uses the Coldline storage class" (#299) |
| **Exclusion filter** | Drops logs before storage to save cost. | Scarta log per risparmiare. | "add an exclusion filter for the GKE container resource" (#254) |
| **Log Analytics** | SQL on logs, with a linked BigQuery dataset. | SQL sui log. | "Ingest your application logs to Cloud Logging by using Ops Agent, and explore with Log Analytics" (#68, #75) |
| **Log view** | Restricts what a team can see. | Limita la vista dei log. | "log view... logging.viewAccessor" (#65) |
| **Ops Agent** | Collects logs/metrics from a VM. | Raccoglie log/metriche dalla VM. | "Install and configure the Ops Agent" (#329) |

### Monitoring
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Alerting policy** | Notification when a metric crosses a threshold. | Notifica a soglia. | "Create a Cloud Monitoring Alerting Policy... notification channel" (#22, #162, #363) |
| **Log-based metric** | Metric from a log pattern. | Metrica da un pattern di log. | "custom log-based metric... Alerting Policy" (#173, #235) |
| **Metrics scope** | One scope, many projects. | Un ambito per più progetti. | "Configure a single Cloud Monitoring metrics scope" (#237, #318) |
| **Database Center** | Fleet view of database health. | Vista unica dei database. | "navigate to Database Center" (#364) |
| **Gemini Cloud Assist** | AI explanation of log entries. | Spiega un log con l'AI. | "Investigate log option in Logs Explorer... Gemini Cloud Assist" (#201) |

### Backup, storage, scaling
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Snapshot schedule** | Automatic disk backups with retention. | Snapshot pianificati. | "Configure daily scheduled persistent disk snapshots with a retention period of 7 days" (#320, #62) |
| **Object versioning + lifecycle** | Keep N versions, move to colder class. | Versioni e classi. | "Enable object versioning... set the number of versions" (#186, #126) |
| **Signed URL** | Time-limited access without a Google account. | Accesso a tempo senza account. | "Create a signed URL with a four-hour expiration" (#222, #214) |
| **Pub/Sub notifications** | Bucket change events. | Eventi sul bucket. | "Configure Pub/Sub notifications on the Cloud Storage buckets" (#125) |
| **Vertical Pod Autoscaler** | Right-sizes CPU/memory. | Dimensiona CPU/memoria. | "Configure a Vertical Pod Autoscaler" (#51, #317) |
| **Cluster autoscaler / node auto-provisioning** | Scales nodes. | Scala i nodi. | "autoscaling enabled on the node pool" (#184); "node auto-provisioning" (#215) |
| **DaemonSet / StatefulSet** | One pod per node / stable storage. | Un pod per nodo / stato stabile. | "Deploy the monitoring pod in a DaemonSet" (#213); "StatefulSet" (#302) |
| **Subnet expansion** | A range can only grow, with no downtime. | Il range può solo allargarsi. | "expand the primary IP range of your subnet" (#343, #134, #207, #79) |
| **Cloud NAT static IPs** | Stable egress addresses. | IP in uscita stabili. | "Cloud NAT gateway with static IP addresses" (#112) |
| **IAP for SSH** | No public IP needed. | SSH senza IP pubblico. | "Configure Identity-Aware Proxy (IAP) for SSH and TCP resources" (#72, #84) |
| **BigQuery cost** | Dry run, quotas, editions. | Stima costi e controlli. | "dry run query" (#35); "capacity-based pricing with BigQuery editions" (#159) |

### Mini-quiz mentale
1. Chi ha letto i dati? → Data Access logs (#1, #300).
2. Troppi log GKE costosi → exclusion filter (#254).
3. Errore specifico da monitorare → log-based metric + alert (#173).
4. Pod Pending → `describe`, leggi gli eventi (#16).

---

## 4. Topic 4 — Accesso e sicurezza / Access and security (68 domande)

### IAM
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Principle of least privilege** | Grant only the permissions needed. | Solo i permessi necessari. | "Following the principle of least privilege" (#365, #370, #194) |
| **Basic roles** | Owner/Editor/Viewer: broad. | Ruoli ampi. | "Select the built-in IAM project Viewer role" (#52); Editor sbagliato (#182, #315) |
| **Predefined role** | Google-managed role for a service. | Ruolo gestito da Google. | "Storage Admin" (#25); "roles/spanner.databaseUser" (#31) |
| **Custom role** | Chosen permissions; `includedPermissions`; stage ALPHA while testing. | Permessi scelti da te. | "Create a custom role... compute.instances.start, stop, reset" (#104); stage ALPHA (#46) |
| **Group-based access** | Grant to groups, not users. | Accessi ai gruppi. | "Add the users to a group, and add this group to roles/browser" (#282, #366) |
| **IAM condition** | Limit by resource prefix. | Limita per prefisso. | "IAM condition for objects with the site1-data/ prefix" (#350) |
| **Storage Object roles** | Viewer reads, Creator creates, Admin manages. | Viewer/Creator/Admin. | "Storage Object Viewer on the bucket" (#267); "storage.objectCreator" (#115, #365) |
| **Browser role** | See hierarchy only. | Solo vedere la gerarchia. | "roles/browser" (#282) |
| **Access Approval** | Approve Google support access. | Approva accessi del supporto. | "roles/accessapproval.approver" (#4) |
| **privateLogViewer** | See Audit and Data Access logs. | Log privati. | "roles/logging.privateLogViewer" (#226) |

### Service account
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **Service account** | Identity of workloads. | Identità dei carichi. | "Create a new service account and assign this service account to the new instance" (#56) |
| **Single-purpose service accounts** | One per purpose. | Uno per scopo. | "Create single-purpose service accounts. Manage service accounts as resources" (#38) |
| **Attached service account** | VM uses it through ADC without keys. | Usato dalla VM senza chiavi. | "Attach a custom service account to the instance" (#67, #293) |
| **Service account key** | Last resort, e.g. on-premises. | Ultima risorsa. | "Use gcloud to create a key file" (#327); `gcloud auth activate-service-account` (#230) |
| **Impersonation** | Act as the SA without keys. | Agire come SA senza chiavi. | "service account impersonation" (#180, #238); `serviceAccountTokenCreator` (#375) |
| **Workload Identity Federation** | Pods authenticate without keys. | Pod senza chiavi. | "Create the GKE cluster with Workload Identity Federation" (#100, #371) |
| **Key lifetime org policy** | Keys valid 24 hours. | Chiavi a 24 ore. | "org policy constraint allowing the lifetime of service account keys to be 24 hours" (#97) |
| **Secret manager for keys** | If keys are needed, keep them in a secret manager. | Chiavi in un secret manager. | "Use a secret manager service to store the key files" (#102) |
| **serviceAccountAdmin** | Manage SA and its IAM policy. | Gestisce SA e relativa policy. | "roles/iam.serviceAccountAdmin" (#194, #303) |

### Audit e gcloud
| Termine | EN | IT | Frase d'esame |
|---|---|---|---|
| **View who has access** | `gcloud projects get-iam-policy`, IAM page. | Chi ha accesso. | "gcloud projects get-iam-policy" (#98, #99) |
| **Copy custom roles** | `gcloud iam roles copy`. | Copia ruoli. | "gcloud iam roles copy... destination" (#242, #152) |
| **Authenticate gcloud** | `gcloud auth login` + `config set project`. | Login e progetto. | "Run gcloud auth login... gcloud config set project" (#216) |
| **Proxy credentials** | Use env variables. | Variabili d'ambiente. | "CLOUDSDK_PROXY_USERNAME and CLOUDSDK_PROXY_PASSWORD" (#14) |
| **Multiple configurations** | One per project. | Una per progetto. | "Create a configuration for each project" (#349, #77) |
| **Folder-level Owner with org policies** | Sandbox with limited services. | Sandbox con servizi limitati. | "organization policy with constraints to restrict resource locations and allowed services... Owner at the folder level" (#359) |
| **Domain principal** | Everyone in the domain. | Tutti nel dominio. | "roles/bigquery.dataViewer role to the domain:terramearth.com principal" (#373) |

### Mini-quiz mentale
1. Pod GKE, chiavi vietate → WIF (#100).
2. Vendor sola lettura su un bucket → Storage Object Viewer sul bucket (#267).
3. Team cambia spesso → gruppo (#120).
4. Test permessi di un SA → impersonation (#375).
