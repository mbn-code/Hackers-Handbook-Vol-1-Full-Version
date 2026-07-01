---
title: Cloud Security
description: "Cloud security explained: the shared responsibility model, IAM, encryption, common misconfigurations, and how to defend AWS, Azure, and GCP workloads."
layout: ../../layouts/MainLayout.astro
---

Most organisations no longer run their own datacentres — they rent compute, storage, and services from AWS, Azure, and Google Cloud. That shift moves the attack surface into someone else's infrastructure, but the responsibility for configuring it safely usually stays with you. Cloud security is the practice of getting that split right.

## The Shared Responsibility Model

The single most important idea in cloud security is that the provider secures the cloud, and you secure what you put _in_ it. The dividing line moves depending on the service model:

- **IaaS (e.g. EC2, Compute Engine):** the provider handles the physical hardware, hypervisor, and network fabric. You own the guest OS, patching, firewall rules, and application code.
- **PaaS (e.g. managed databases, App Service):** the provider also manages the OS and runtime. You own configuration, access control, and data.
- **SaaS (e.g. Microsoft 365, Salesforce):** the provider runs almost everything. You still own your data, your user accounts, and your access policies.

Nearly every headline "cloud breach" is not a break in the provider's infrastructure — it is a customer-side misconfiguration or leaked credential. Knowing exactly which side of the line a control falls on is what stops those gaps from opening.

## Misconfiguration: The Number One Cause

Publicly exposed storage buckets, over-permissive access policies, and management ports left open to the internet cause more incidents than exotic zero-days ever will. These are cheap to prevent and easy to audit.

A classic example is an object storage bucket accidentally made public. On AWS you can check and lock down public access with the CLI:

```bash
# See whether a bucket blocks public access
aws s3api get-public-access-block --bucket my-company-data

# Enforce a full public-access block
aws s3api put-public-access-block \
  --bucket my-company-data \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

Treat exposed cloud infrastructure the same way you would any other [vulnerability](/en/page-vulnerability): find it before an attacker does, and only ever test accounts and resources you are authorised to assess.

## Identity and Access Management (IAM)

In the cloud, identity is the perimeter. There is no physical building to walk into — an attacker with valid keys is simply _inside_. IAM governs who (users, roles, services) can do what to which resources.

Apply **least privilege**: grant the minimum permissions a workload needs, and nothing more. Prefer short-lived, automatically rotated role credentials over long-lived access keys embedded in code. A leaked static key committed to a public repository is one of the most common initial-access vectors, so secrets belong in a managed vault, never in source.

Enforce [two-factor authentication](</en/page-two-factor-authentication-(2fa)>) on every human account, especially the root or global-admin identity, and pair it with strong, unique passwords. Review who holds administrative rights regularly, and remove access the moment it is no longer needed.

## Data Encryption

Encrypt data both **at rest** and **in transit**. All major providers offer server-side encryption for storage and managed keys, and TLS should terminate as close to the workload as possible so traffic is never exposed in the clear on internal networks. For sensitive workloads, consider customer-managed keys so the provider cannot decrypt your data unilaterally.

Encryption is only as strong as your key management — rotate keys, restrict who can use them, and log every key operation. If you are new to the underlying concepts, start with [encryption](/en/page-encryption) and how key management works.

## Network Security

Even in a serverless world, network controls matter. Segment workloads into private subnets, expose only what must be public, and default-deny everything else.

- **Security groups and virtual firewalls** control traffic to and from each resource. Keep rules tight; never leave SSH (22) or RDP (3389) open to `0.0.0.0/0`. See [firewall](/en/page-firewall) for the underlying principles.
- **Private networking** keeps databases and internal services off the public internet entirely, reachable only through a bastion host or VPN.
- **Traffic inspection** and flow logs let you spot anomalies. Understanding networking and how packets move is what makes those logs readable rather than noise.

## Logging, Monitoring, and Detection

You cannot defend what you cannot see. Enable audit logging across the whole account — AWS CloudTrail, Azure Monitor, or Google Cloud Audit Logs — and ship those logs somewhere tamper-resistant and central. Configure alerts for high-risk events: new admin users, disabled logging, unusual API call volumes, or sign-ins from unexpected locations.

Cloud providers and third parties offer posture-management tools that continuously scan for drift from a secure baseline. Automated, continuous checks catch the misconfiguration that a quarterly audit would miss.

## Compliance and Governance

Regulated data brings obligations. Frameworks such as GDPR, HIPAA, PCI DSS, and SOC 2 dictate how data must be stored, encrypted, and accessed, and they expect you to prove it with logs and documented controls. Classify data by sensitivity so you can apply the right protection to the right assets rather than treating everything the same. Infrastructure-as-code (Terraform, CloudFormation) helps here: policies become reviewable, version-controlled files instead of ad-hoc clicks in a console.

## When Something Goes Wrong

Assume you will eventually have an incident and prepare for it. A cloud-aware [incident response](/en/page-incident-response) plan should cover how to revoke compromised credentials fast, isolate affected resources, preserve logs for forensics, and restore from clean backups. Snapshots and immutable backups are your defence against both ransomware and a mistaken `rm -rf`. Practise the plan before you need it.

## Hands-on Lab: Audit Your Own Account with Prowler

Reading about misconfiguration is one thing; watching a scanner flag _your own_ mistakes makes it stick. Prowler is an open-source tool that checks a cloud account against hundreds of security benchmarks. Run it only against an account you own — ideally a throwaway sandbox, never a client's production without written authorisation.

Spin up a clean Linux VM ([set one up here](/en/page-3)) and install Prowler inside a virtualenv so it does not pollute the system Python:

```bash
python3 -m venv prowler-env
source prowler-env/bin/activate
pip install prowler
```

Create a dedicated IAM user in your sandbox account and attach the read-only `SecurityAudit` and `ViewOnlyAccess` managed policies — Prowler never needs write access. Feed those keys to the AWS CLI:

```bash
aws configure   # paste the read-only access key and secret
```

Now run the full AWS benchmark, then narrow to storage:

```bash
# Everything, across all regions
prowler aws

# Just S3, and only the findings that matter most
prowler aws --service s3 --severity critical high
```

Prowler writes CSV, JSON, and a browsable HTML report to the `output/` directory. Open the HTML file and work through the FAIL rows — each links the failing check to the exact resource and a remediation hint. To prove the loop closes, deliberately expose a test bucket, re-scan, apply the `put-public-access-block` fix from earlier, and confirm the finding flips to PASS.

Treat every finding as a [vulnerability](/en/page-vulnerability) to triage, not a to-do list to blindly clear — context decides what is actually risky.

## Practical Baseline

If you take away one checklist, make it this:

1. Turn on account-wide audit logging and centralise it.
2. Enforce MFA and least-privilege IAM; kill unused static keys.
3. Block public access to storage by default.
4. Encrypt data at rest and in transit.
5. Restrict management ports and put databases on private networks.
6. Scan continuously for misconfiguration and drift.

Cloud security is not a product you buy once — it is a set of habits applied to an environment that changes daily. Get the fundamentals right, automate the checks, and the vast majority of real-world cloud attacks simply have nowhere to land.
