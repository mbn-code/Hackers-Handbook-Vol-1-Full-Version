---
title: Case Studies
description: Break down landmark breaches — Equifax, Stuxnet, Target, WannaCry, SolarWinds and Log4Shell — and the concrete defensive lesson each one teaches.
layout: ../../layouts/MainLayout.astro
---

Every major breach is a free lesson paid for by someone else. Reading them the way an investigator does — root cause, kill chain, blast radius, fix — turns headlines into a checklist you can apply to systems you are actually responsible for.

## How to Read a Case Study

Skim past the drama and pull out four things:

- **Initial access.** How did the attacker get their first foothold? Unpatched software, stolen credentials, a phishing email, a poisoned update?
- **Escalation and movement.** How did a single foothold become domain-wide control? This is where flat networks and reused passwords hurt most.
- **Impact.** What data or capability was actually lost, and for how long before anyone noticed? Dwell time matters as much as the initial bug.
- **The preventable mistake.** Almost every incident traces back to something known and fixable: a missing patch, a trust relationship nobody audited, logging that no one read.

Frame each case against a defender's playbook — patch management, least-privilege segmentation, and [incident response](/en/page-incident-response). The goal is not to admire the attack; it is to close the gap it exploited.

## Equifax, 2017 — The Cost of an Unpatched Dependency

Attackers exploited a known [vulnerability](/en/page-vulnerability) in the Apache Struts web framework (CVE-2017-5638) roughly two months after a patch was publicly available. From that single unpatched web server they reached databases holding the personal data of around 147 million people, then exfiltrated it for weeks while expired certificate monitoring left the traffic uninspected.

**Lesson.** Third-party components are your attack surface. Maintain a software bill of materials, patch internet-facing code on a tight clock, and make sure the security tooling that watches for exfiltration is actually running. The vulnerability was upstream, but owning the patch cycle was not.

## Stuxnet, 2010 — A Digital Weapon Against Physical Machines

Stuxnet is the case that proved code can break hardware. It targeted Siemens PLCs controlling uranium-enrichment centrifuges at Natanz, chaining multiple [zero-day exploits](/en/page-zero-day-exploit) and stolen driver-signing certificates to cross an air gap via USB drives. Once inside, it subtly altered centrifuge speeds while replaying normal readings to operators.

**Lesson.** Air gaps are not magic; removable media and supply chains cross them. Industrial control systems need their own segmentation, integrity monitoring, and the assumption that a determined adversary will spend zero-days to reach a high-value target. Stuxnet remains the reference point for OT and malware defence.

## Target, 2013 — When a Vendor Becomes Your Weakest Link

The initial access was mundane: credentials phished from an HVAC contractor with network access to Target. From that third-party foothold, attackers pivoted into the corporate network and pushed memory-scraping malware to point-of-sale terminals, harvesting roughly 40 million payment cards during the holiday season. Alerts fired — and were not acted on in time.

**Lesson.** Your security posture inherits your vendors' weaknesses. Segment third-party access, never let a contractor's account touch payment systems, and tune alerting so that a real detection reaches a human who responds. The entry point here was classic [social engineering](/en/page-socialEngineering).

## WannaCry, 2017 — Ransomware at Wire Speed

WannaCry spread as a worm, using the EternalBlue exploit against the SMBv1 file-sharing protocol (patched by Microsoft in MS17-010 roughly two months earlier) to jump machine-to-machine with no user interaction. It crippled hospitals, telecoms, and factories worldwide until a researcher registered a hardcoded kill-switch domain that halted new infections.

**Lesson.** Patch latency plus a legacy protocol equals wildfire. Disable obsolete services, patch promptly, and keep tested offline backups so ransomware is a bad day, not an existential one.

```powershell
# Defensive audit (Windows PowerShell): is legacy SMBv1 still enabled?
Get-WindowsOptionalFeature -Online -FeatureName SMB1Protocol

# Disable it on hosts you administer
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
```

## SolarWinds, 2020 — Poisoning the Supply Chain

Attackers compromised the build pipeline of SolarWinds' Orion network-monitoring product and inserted a [backdoor](/en/page-backdoor) into a legitimately signed software update. Thousands of organisations installed the trojanised update through normal patching, handing the intruders a trusted foothold inside government and enterprise networks that went undetected for months.

**Lesson.** "Patch everything" collides with "trust nothing" when the update itself is the payload. Defenders responded by hardening build systems, verifying artifact provenance, and adopting zero-trust assumptions about even signed, internal software.

## Log4Shell, 2021 — One Line, Everywhere

A vulnerability in the ubiquitous Log4j logging library (CVE-2021-44228) let an attacker achieve remote code execution simply by getting a crafted string logged — often via a username, User-Agent header, or chat message. Because Log4j is buried deep inside countless Java applications, patching became an internet-wide scramble to find every affected artifact.

**Lesson.** You cannot defend a dependency you do not know you have. Inventory is prevention. Being able to answer "do we run this, and where?" in minutes is the difference between an afternoon and a month of firefighting.

```bash
# Hunt for vulnerable Log4j jars on a host you administer
find / -name 'log4j-core-*.jar' 2>/dev/null
```

## Turning Cases Into Practice

Patterns repeat across all six incidents: known-but-unpatched flaws, trust extended without verification, and detection that existed but was ignored. The defensive answer is consistent — reduce attack surface, segment aggressively, monitor and actually respond, and inventory your dependencies.

Study these breaches the way a red or blue team would: map the kill chain, then ask which control on your own systems would have broken it. Do this only against environments you own or are authorised to test — the value of a case study is the defence it teaches, not a template for attacking others.
