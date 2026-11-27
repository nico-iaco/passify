# Domande da rivedere — Associate Cloud Engineer
21 su 354. Conteggi: {'ET contro': 11, 'ET pari': 0, 'modello contro': 10, 'instabile': 4}
Non segnalate: chiave confermata da ExamTopics, oppure modello d'accordo e stabile.


## #26 (topic 2) — chiave C
**Perché:** ExamTopics vota D (2) contro C (0)

You are implementing a company-wide standard to control SSH access for your Google Cloud projects. You want to simplify SSH access management to your Compute Engine instances while maintaining audit compliance and eliminating as many manual steps as possible. What should you do?

- A. Configure a service account to add SSH keys for all VMs.
- B. Configure metadata SSH keys to manage sudo access to instances.
- C. Enable OS Login by using an organization policy for each Google Cloud project.
- D. Enable OS Login with two-factor authentication for the domain.

Modello: C «OS Login automates SSH key management and enforces audit compliance via organization policies.»
ExamTopics T1Q323 voti {'D': 2} — https://www.examtopics.com/discussions/google/view/332603-exam-associate-cloud-engineer-topic-1-question-323-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/26-planning-and-implementing-a-cloud-solution

## #139 (topic 2) — chiave A
**Perché:** ExamTopics vota B (36) contro A (7)

You deployed an application on a managed instance group in Compute Engine. The application accepts Transmission Control Protocol (TCP) traffic on port 389 and requires you to preserve the IP address of the client who is making a request. You want to expose the application to the internet by using a load balancer. What should you do?

- A. Expose the application by using an external passthrough Network Load Balancer.
- B. Expose the application by using an external proxy Network Load Balancer (TCP proxy).
- C. Expose the application by using an external proxy Network Load Balancer (SSL proxy).
- D. Expose the application by using an internal passthrough Network Load Balancer.

Modello: A «External passthrough NLB preserves client IP for TCP traffic.»
ExamTopics T1Q198 voti {'B': 36, 'A': 7} — https://www.examtopics.com/discussions/google/view/113199-exam-associate-cloud-engineer-topic-1-question-198-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/139-planning-and-implementing-a-cloud-solution

## #142 (topic 2) — chiave A
**Perché:** ExamTopics vota B (7) contro A (6); modello risponde B/AB

Your digital media company stores a large number of video files on-premises. Each video file ranges from 100 MB to 100 GB. You are currently storing 150 TB of video data in your on-premises network, with no room for expansion. You need to migrate all infrequently accessed video files older than one year to Cloud Storage to ensure that on-premises storage remains available for new files. You must also minimize costs and control bandwidth usage. What should you do?

- A. Use Storage Transfer Service to move the data from the selected on-premises file storage systems to a Cloud Storage bucket.
- B. Use Transfer Appliance to request an appliance. Load the data locally, and ship the appliance back to Google for ingestion into Cloud Storage.
- C. Set up a Cloud Interconnect connection between the on-premises network and Google Cloud. Establish a private endpoint for Filestore access. Transfer the data from the existing Network File System (NFS) to Filestore.
- D. Create a Cloud Storage bucket. Establish an Identity and Access Management (IAM) role with write permissions to the bucket. Use the gcloud storage cp command to directly copy files over the network to Cloud Storage.

Modello: B «Transfer Appliance handles large, infrequent data with minimal bandwidth impact and low cost.» → con ragionamento AB «Transfer Service and Transfer Appliance are best for large, infrequent data with bandwidth limits. Filestore is wrong for cold data. Direct copy is inefficient.»
ExamTopics T1Q322 voti {'B': 7, 'A': 6} — https://www.examtopics.com/discussions/google/view/312511-exam-associate-cloud-engineer-topic-1-question-322-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/142-planning-and-implementing-a-cloud-solution

## #157 (topic 2) — chiave B
**Perché:** ExamTopics vota A (10) contro B (8); modello risponde A/A

You need to migrate multiple PostgreSQL databases from your on-premises data center to Google Cloud. You want to significantly improve the performance of your databases while minimizing changes to your data schema and application code. You expect your largest database to exceed 150 TB of data per geographical region. You want to follow Google-recommended practices and minimize your operational costs. What should you do?

- A. Migrate your data to AlloyDB.
- B. Migrate your data to Spanner.
- C. Migrate your data to Firestore.
- D. Migrate your data to Bigtable.

Modello: A «AlloyDB offers PostgreSQL compatibility, high performance, and cost efficiency for large datasets, fitting all requirements.» → con ragionamento A «AlloyDB is the recommended managed PostgreSQL service on GCP, offering high performance and compatibility without schema changes.»
ExamTopics T1Q311 voti {'A': 10, 'B': 8} — https://www.examtopics.com/discussions/google/view/305693-exam-associate-cloud-engineer-topic-1-question-311-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/157-planning-and-implementing-a-cloud-solution

## #196 (topic 4) — chiave D
**Perché:** ExamTopics vota C (2) contro D (0)

You are the Google Cloud systems administrator for your organization. User A reports receiving an error while trying to access the Cloud SQL database in their Google Cloud project, whereas User B can access the database. You need to troubleshoot User A’s issue while following Google-recommended practices. What should you do first?

- A. Confirm that network firewall rules are not blocking traffic for User A.
- B. Verify that User A has the Identity and Access Management (IAM) Project Owner role assigned.
- C. Review recent configuration changes that may have caused unintended modifications to permissions.
- D. Review the error message that User A received.

Modello: D «Always analyze the specific error message first to determine the root cause before checking other potential issues.»
ExamTopics T1Q328 voti {'C': 2} — https://www.examtopics.com/discussions/google/view/382800-exam-associate-cloud-engineer-topic-1-question-328-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/196-configuring-access-and-security

## #209 (topic 3) — chiave B
**Perché:** ExamTopics vota D (62) contro B (59); modello risponde D/D

You create a Deployment with 2 replicas in a Google Kubernetes Engine cluster that has a single Spot VM node pool. After a few minutes, you use `kubectl` to check the status of your Pods and notice that one of them is still showing a Pending status:  
  
![Question Image](https://cdn.examcademy.com/images/questions/1783718295874-0wmei56q.jpg)  
  
What is the most likely cause?

- A. The pending Pod's resource requests are too large to fit on a single node of the cluster.
- B. Too many Pods are already running in the cluster, and there are not enough resources left to schedule the pending Pod.
- C. The node pool is configured with a service account that does not have permission to pull the container image used by the pending Pod.
- D. The pending Pod was originally scheduled on a node that has been preempted between the creation of the Deployment and your verification of the Pods' status. It is currently being rescheduled on a new node.

Modello: D «Spot nodes are preempted; the pod is rescheduled on a new node, causing a temporary Pending state.» → con ragionamento D «Spot nodes can be preempted, causing Pods to remain Pending while Kubernetes reschedules them on new nodes.»
ExamTopics T1Q94 voti {'D': 62, 'B': 59} — https://www.examtopics.com/discussions/google/view/22847-exam-associate-cloud-engineer-topic-1-question-94-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/209-ensuring-the-successful-operation-of-a-cloud-solution

## #216 (topic 4) — chiave AE
**Perché:** ExamTopics vota A (22) contro AE (0)

You just installed the Google Cloud CLI on your new corporate laptop. You need to list the existing instances of your company on Google Cloud. What must you do before you run the gcloud compute instances list command? (Choose two.)

- A. Run gcloud auth login, enter your login credentials in the dialog window, and paste the received login token to gcloud CLI.
- B. Create a Google Cloud service account, and download the service account key. Place the key file in a folder on your machine where gcloud CLI can find it.
- C. Download your Cloud Identity user account key. Place the key file in a folder on your machine where gcloud CLI can find it.
- D. Run gcloud config set compute/zone $my_zone to set the default zone for gcloud CLI.
- E. Run gcloud config set project $my_project to set the default project for gcloud CLI.

Modello: AE «You must authenticate (A) and set the default project (E) to list instances.»
ExamTopics T1Q265 voti {'A': 22, 'E': 10} — https://www.examtopics.com/discussions/google/view/129849-exam-associate-cloud-engineer-topic-1-question-265-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/216-configuring-access-and-security

## #267 (topic 4) — chiave D
**Perché:** modello risponde C/CD

You manage a Google Cloud project containing a critical marketing application. You need to give an external vendor read-only access to the objects stored in one specific Cloud Storage bucket. The vendor must not be able to view any other resources in the project. What should you do?

- A. Create a custom IAM role with the storage.objects.get permission, and grant the vendor this role on the project.
- B. Grant the vendor the Storage Object User role on the project.
- C. Grant the vendor the Storage Object User role on the bucket.
- D. Grant the vendor the Storage Object Viewer role on the bucket.

Modello: C «Grant role on the specific bucket to limit access to only that bucket's objects.» → con ragionamento CD «Granting roles on the specific bucket restricts access to that bucket only, preventing access to other project resources. Both Object User and Object Viewer roles provide read-only access.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/267-configuring-access-and-security

## #326 (topic 2) — chiave A
**Perché:** ExamTopics vota D (31) contro A (0)

You have an instance group that you want to load balance. You want the load balancer to terminate the client SSL session. The instance group is used to serve a public web application over HTTPS. You want to follow Google-recommended practices. What should you do?

- A. Configure an external Application Load Balancer.
- B. Configure an internal passthrough Network Load Balancer.
- C. Configure an external proxy Network Load Balancer with SSL offload (target SSL proxy).
- D. Configure an external proxy Network Load Balancer (target TCP proxy, no SSL offload).

Modello: C «External proxy NLB with SSL offload terminates client SSL and follows best practices for public HTTPS apps.» → con ragionamento A «External ALB terminates SSL and serves HTTPS, aligning with Google best practices for public apps.»
ExamTopics T1Q40 voti {'D': 31} — https://www.examtopics.com/discussions/google/view/16973-exam-associate-cloud-engineer-topic-1-question-40-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/326-planning-and-implementing-a-cloud-solution

## #337 (topic 2) — chiave B
**Perché:** ExamTopics vota A (32) contro B (19)

You need to run a single caching HTTP reverse proxy on Google Cloud for a latency-sensitive website. This particular reverse proxy consumes almost no CPU. You want to provide it with:  
  
- A 30-GB in-memory cache  
- An additional 2 GB of memory for the rest of the processes  
  
You want to minimize cost. How should you run this reverse proxy?

- A. Create a Memorystore for Redis instance with 32-GB capacity.
- B. Run it on Compute Engine, and choose a custom instance type with 6 vCPUs and 32 GB of memory.
- C. Package it in a container image, and run it on Google Kubernetes Engine (GKE), using n1-standard-32 instances as nodes.
- D. Run it on Compute Engine, choose the instance type n1-standard-1, and add an SSD persistent disk of 32 GB.

Modello: D «n1-standard-1 provides 32 GB RAM (3 vCPU + 32 GB) at lowest cost, meeting memory needs without SSD requirement for cache.» → con ragionamento B «Custom VMs allow precise memory allocation (32GB) at lower cost than managed services or over-provisioned nodes.»
ExamTopics T1Q62 voti {'B': 19, 'D': 5, 'A': 32} — https://www.examtopics.com/discussions/google/view/21981-exam-associate-cloud-engineer-topic-1-question-62-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/337-planning-and-implementing-a-cloud-solution

## #338 (topic 2) — chiave C
**Perché:** modello instabile con le opzioni ruotate ['D', 'C']

You developed a web application that will serve traffic for a local event and expect the traffic volume to be unpredictable. You have containerized the application and now want to deploy it on Google Cloud while minimizing costs. What should you do?

- A. Deploy the web application as a Cloud Run job.
- B. Deploy the web application on Google Kubernetes Engine in Standard mode.
- C. Deploy the web application as a Cloud Run service.
- D. Deploy the web application on Google Kubernetes Engine in Autopilot mode.

Modello: C «Cloud Run services auto-scale to zero when idle, minimizing costs for unpredictable traffic.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/338-planning-and-implementing-a-cloud-solution

## #340 (topic 3) — chiave C
**Perché:** ExamTopics vota A (34) contro C (6)

Your web application is hosted on Cloud Run and needs to query a Cloud SQL database. Every morning during a traffic spike, you notice API quota errors in Cloud SQL logs. The project has already reached the maximum API quota. You want to make a configuration change to mitigate the issue. What should you do?

- A. Modify the minimum number of Cloud Run instances.
- B. Use traffic splitting.
- C. Modify the maximum number of Cloud Run instances.
- D. Set a minimum concurrent requests environment variable for the application.

Modello: C «Increase max instances to handle traffic spikes and reduce API quota errors.»
ExamTopics T1Q278 voti {'D': 6, 'C': 6, 'A': 34} — https://www.examtopics.com/discussions/google/view/143956-exam-associate-cloud-engineer-topic-1-question-278-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/340-ensuring-the-successful-operation-of-a-cloud-solution

## #343 (topic 3) — chiave D
**Perché:** modello risponde B/B

You manage a VPC network in Google Cloud whose subnet is quickly nearing its private IP address capacity. You anticipate that the number of Compute Engine VM instances in the same region will double within a week. You must implement a Google-recommended solution that minimizes operational costs and requires no downtime. What should you do?

- A. Create a second VPC with the same subnet IP range, and connect this VPC to the existing VPC by using VPC Network Peering.
- B. Delete the existing subnet, and create a new subnet with double the IP range available.
- C. Permit additional traffic from the expected range of private IP addresses to reach your VMs by configuring firewall rules.
- D. Use the Google Cloud CLI tool to expand the primary IP range of your subnet.

Modello: B «Delete and recreate subnet with larger range; peering adds cost, firewall doesn't solve capacity, and IP ranges are fixed on creation.» → con ragionamento B «Subnet IP ranges are immutable. To add capacity, create a new subnet. Option B is the only one involving a new subnet, despite the 'delete' wording causing downtime. It's the intended solution for capacity issues.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/343-ensuring-the-successful-operation-of-a-cloud-solution

## #344 (topic 3) — chiave B
**Perché:** ExamTopics vota D (80) contro B (64); modello risponde D/D

You created an instance of SQL Server 2017 on Compute Engine to test features in the new version. You want to connect to this instance using the fewest number of steps. What should you do?

- A. Install a RDP client on your desktop. Verify that a firewall rule for port 3389 exists.
- B. Install a RDP client in your desktop. Set a Windows username and password in the Google Cloud console. Use the credentials to log in to the instance.
- C. Set a Windows password in the Google Cloud console. Verify that a firewall rule for port 22 exists. Click the RDP button in the Google Cloud console and supply the credentials to log in.
- D. Set a Windows username and password in the Google Cloud console. Verify that a firewall rule for port 3389 exists. Click the RDP button in the Google Cloud console, and supply the credentials to log in.

Modello: D «GCP console RDP uses port 3389 and requires credentials set in the console plus an open firewall rule.» → con ragionamento D «Option D uses the console's built-in RDP button and correct port 3389, minimizing steps by avoiding manual client installation.»
ExamTopics T1Q20 voti {'B': 64, 'D': 80} — https://www.examtopics.com/discussions/google/view/15899-exam-associate-cloud-engineer-topic-1-question-20-discussion/
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/344-ensuring-the-successful-operation-of-a-cloud-solution

## #357 (topic 2) — chiave B
**Perché:** modello instabile con le opzioni ruotate ['B', 'C']

You administer your company’s Google Cloud environment. Your company has a budget and wants to centralize cost management by consolidating every project under one Cloud Billing account. The finance team needs a daily export of all billing data to a central BigQuery dataset for analysis, including resource-level cost data. You must implement the most cost-effective solution with minimal administrative overhead. What should you do?

- A. Link each project to the Cloud Billing account. Create a new Cloud Billing budget alert with Pub/Sub as the destination, and use a Cloud Run function to write the alerts to BigQuery.
- B. Link each project to the Cloud Billing account. Enable the standard and detailed usage cost exports on the billing account, specifying a BigQuery dataset as the destination.
- C. Link each project to the Cloud Billing account. Enable the standard usage cost export on the billing account, specifying a BigQuery dataset as the destination.
- D. Link each project to the Cloud Billing account. Use the gcloud billing budgets create command to set a budget for each project, and then use the cost breakdown report in the Google Cloud console to manually export the daily costs.

Modello: B «Enable both standard and detailed exports to BigQuery for full resource-level data with minimal overhead.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/357-planning-and-implementing-a-cloud-solution

## #359 (topic 4) — chiave A
**Perché:** modello instabile con le opzioni ruotate ['A', 'B']

You are setting up an isolated Google Cloud environment for a new data science team. The team must experiment with machine learning models in short-lived projects and needs full administrative access. All team members are in the same group.  
  
Your solution must limit resource creation to the `us-east1` region and permit only BigQuery and Cloud Storage. What should you do?

- A. Create a new folder. Create an organization policy with constraints to restrict resource locations and allowed services, and apply it to the folder. Grant the Owner IAM role to the group at the folder level.
- B. Create a new folder. Create an organization policy with constraints to restrict resource locations and allowed services, and apply it to the folder. Grant the BigQuery Admin and Storage Admin IAM roles to the group at the folder level.
- C. Create a new folder. Create an organization policy with constraints to restrict resource locations, and apply it to the folder. Grant the Owner IAM role to the group at the folder level.
- D. Create a new folder. Create an organization policy with constraints to restrict resource locations, and apply it to the folder. Grant the BigQuery Admin and Storage Admin IAM roles to the group at the folder level.

Modello: A «Owner role grants full admin access needed for experimentation. Policies restrict location and services at folder level.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/359-configuring-access-and-security

## #362 (topic 2) — chiave C
**Perché:** modello risponde B/B

Your team stores its container images in Artifact Registry. You need to create a new Google Kubernetes Engine (GKE) cluster and deploy these containers. An IAM service account with the required permissions to pull images from Artifact Registry has already been configured. You must make sure that the images can be deployed to the GKE cluster. What should you do?

- A. In the Pod manifest, enter the service account name in the serviceAccountName field.
- B. Enable Workload Identity Federation for GKE on the cluster.
- C. Deploy the cluster nodes with the specified service account.
- D. After creating the cluster, store the service account JSON key in a Kubernetes Secret.

Modello: B «Enable Workload Identity to allow nodes to pull images using the configured service account without exposing keys.» → con ragionamento B «Workload Identity enables nodes to authenticate to Artifact Registry using IAM without storing keys.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/362-planning-and-implementing-a-cloud-solution

## #367 (topic 4) — chiave B
**Perché:** modello risponde A/A

You are a Google Cloud organization policy administrator for a company operating in a regulated industry. You must enforce a policy that restricts all new location-based Google Cloud resources to only the `australia-southeast1` and `australia-southeast2` regions. You want this policy to require minimal configuration. What should you do?

- A. Create a custom organization policy that uses the resource.location == ‘australia-southeast1’ || resource.location == ‘australia-southeast2’ Common Expression Language (CEL) condition.
- B. Modify the gcp.resourceLocations list constraint by adding in:australia-locations to the allowed_values list.
- C. Modify the gcp.resourceLocations list constraint by adding in:australia-locations to the denied_values list.
- D. Create a custom organization policy that uses the resource.location.startsWith(‘australia’) Common Expression Language (CEL) condition.

Modello: A «Use a custom policy with CEL to explicitly allow only the two specific regions.» → con ragionamento A «Option A correctly restricts resources to the two specified regions using CEL. Other options use invalid syntax or incorrect logic.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/367-configuring-access-and-security

## #372 (topic 3) — chiave B
**Perché:** modello risponde D/D

You are managing a new Google Cloud project for a web application. The web application runs on a Compute Engine VM, and your team has a strict budget. You have already created a Cloud Billing budget and configured an alert rule to send an email when 90% of the budget is used. You must ensure that project spending automatically stops when it exceeds the budgeted amount. What should you do?

- A. Create a new Cloud Billing account, and associate the project with it to prevent new spending from affecting your project’s budget.
- B. Create a Pub/Sub topic, and connect it to the budget. Create a Cloud Run function that subscribes to the Pub/Sub topic and executes code to stop the VM.
- C. Use the Cloud Billing dashboard to identify the forecasted spend of your project, and then update the budget and alert to match the forecasted spend.
- D. Rely on the budget’s configuration to automatically disable billable resources when the spend reaches 100%.

Modello: D «Cloud Billing budgets can automatically disable billable resources at 100% spend if configured.» → con ragionamento D «Budgets can be configured to automatically disable billable resources when the limit is reached at 100%.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/372-ensuring-the-successful-operation-of-a-cloud-solution

## #373 (topic 4) — chiave A
**Perché:** modello risponde D/D

The Human Resources department at your company publishes a BigQuery dataset containing anonymized information about company sales and products. All company employees are managed in the `terramearth.com` Cloud Identity account and must be able to view this dataset as authenticated users. You need to give every employee in the company read-only access to this BigQuery dataset. What should you do?

- A. Grant the roles/bigquery.dataViewer role to the domain:terramearth.com principal on the dataset’s IAM policy.
- B. Grant the roles/bigquery.dataViewer role to the allUsers principal on the dataset’s IAM policy.
- C. Grant the roles/bigquery.dataViewer role to a new service account on the dataset’s IAM policy.
- D. Grant the roles/bigquery.dataViewer role to the allAuthenticatedUsers principal on the dataset’s IAM policy.

Modello: D «allAuthenticatedUsers grants access to any signed-in user, including employees in the specified domain.» → con ragionamento D «allAuthenticatedUsers grants access to any user authenticated via Cloud Identity, covering all employees.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/373-configuring-access-and-security

## #375 (topic 4) — chiave C
**Perché:** modello instabile con le opzioni ruotate ['D', 'D']

You are developing an application on your personal workstation that will be hosted in Google Cloud. You are authenticated with a Google Account (USER). You need to test whether a particular set of permissions assigned to an existing service account (SERVICE_ACCOUNT) is sufficient for a task, without handling sensitive secret information. What should you do?

- A. Grant USER the IAM role roles/iam.workloadIdentityUser on SERVICE_ACCOUNT.
- B. Grant USER the IAM role roles/iam.serviceAccountKeyAdmin on SERVICE_ACCOUNT.
- C. Grant USER the IAM role roles/iam.serviceAccountTokenCreator on SERVICE_ACCOUNT.
- D. Grant USER the IAM role roles/iam.serviceAccountUser on SERVICE_ACCOUNT.

Modello: C «roles/iam.serviceAccountTokenCreator allows creating tokens to impersonate the service account for testing without exposing keys.»
Fonte: https://examcademy.com/exams/google/associate-cloud-engineer/q/375-configuring-access-and-security
