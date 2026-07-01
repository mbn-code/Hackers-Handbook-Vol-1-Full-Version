---
title: Ethical Hacking
description: "Ethical hacking explained: how authorized penetration testing finds vulnerabilities, the phases of a pentest, the core tools, and rules of engagement."
layout: ../../layouts/MainLayout.astro
---

Ethical hacking is the practice of attacking systems the way a real adversary would, but with written permission and the goal of fixing what you find. Same techniques, opposite intent: you break in to make the defender stronger, not to profit from the weakness.

## What Ethical Hacking Actually Is

An ethical hacker (often called a penetration tester or white-hat) simulates the tactics of real attackers against a defined target, then reports every weakness so the owner can close it. The word that separates this discipline from cybercrime is _authorization_. The tools, payloads, and mindset are the same ones criminals use; the difference is a signed agreement, a defined scope, and a duty to disclose responsibly.

Hackers are often sorted by "hat":

- **White hat** — works with explicit permission to improve security.
- **Black hat** — attacks for personal gain, sabotage, or theft. Illegal.
- **Grey hat** — probes systems without permission but usually without malicious intent. Still illegal in most jurisdictions, even when the reported bug is real.

This page is about the white-hat path. Before you touch any system, read [Legal and Ethical Considerations](/en/page-legal-ethical) — the technical skill is worthless if you cannot stay on the right side of the law.


<figure class="hh-figure">
  <img src="/en/diagrams/pentest-phases.svg" alt="The phases of a professional penetration test." loading="lazy" />
  <figcaption>The phases of a professional penetration test.</figcaption>
</figure>

## Authorization Comes First

Never skip this. Unauthorized testing is a crime under laws such as the U.S. Computer Fraud and Abuse Act and the UK Computer Misuse Act, regardless of whether you cause damage. A legitimate engagement always starts with paperwork:

- **Scope** — the exact IP ranges, domains, applications, and accounts you are allowed to test, and everything that is off-limits.
- **Rules of engagement (RoE)** — permitted techniques, testing windows, and hard limits (for example, "no denial-of-service," "no social engineering of staff").
- **Authorization to test** — signed sign-off from someone with the authority to grant it, plus emergency contacts if something breaks.
- **Handling of sensitive data** — how you store, transmit, and destroy anything you access.

If you want to practice legally on your own terms, spin up a lab. A deliberately vulnerable target like [Metasploitable](/en/page-metasploitable) inside a [virtual machine](/en/page-3) gives you a system you fully own and can attack freely.

## The Penetration Testing Lifecycle

Structured methodologies such as the Penetration Testing Execution Standard (PTES) and the NIST SP 800-115 guidelines break an engagement into repeatable phases. In practice a test flows like this.

### Reconnaissance

Gather information about the target before touching it. Passive recon uses public sources — DNS records, certificate transparency logs, job postings, code repositories, breach dumps — without sending anything unusual to the target. Active recon interacts directly with the systems to map what is exposed.

### Scanning and Enumeration

Discover live hosts, open ports, running services, and software versions. [Nmap](/en/page-4) is the standard first move; against a host you own, a basic service and version scan looks like this:

```bash
# Scoped scan against a lab host you control (e.g. Metasploitable)
nmap -sV -sC -p- -oN scan.txt 192.168.56.101
```

`-sV` fingerprints service versions, `-sC` runs default detection scripts, `-p-` covers all 65,535 TCP ports, and `-oN` saves the output for your report. Enumeration then digs deeper into each service — SMB shares, web directories, SNMP strings — to build a picture of the attack surface.

### Vulnerability Analysis

Match what you found against known weaknesses and misconfigurations. This is where scanner output, CVE data, and manual inspection combine into a list of candidate issues. Understanding what a [vulnerability](/en/page-vulnerability) actually is — and which findings are exploitable versus merely theoretical — is what separates a useful report from a wall of scanner noise.

### Exploitation

Prove the impact by safely demonstrating that a weakness can be used. Frameworks like [Metasploit](/en/page-6) provide vetted exploit and payload modules, while web application testing leans on tools such as [Burp Suite](/en/page-burp-suite). The goal is confirmation and controlled proof, not maximum damage — you validate the risk, you do not wreck production.

### Post-Exploitation

Once access is gained, assess what it is worth: what data is reachable, whether privileges can be escalated, and how far an attacker could pivot through the network. This phase maps real business risk. Adversary behavior here is commonly documented against the [MITRE ATT&CK](https://attack.mitre.org/) framework, which catalogs the techniques attackers use after the initial breach.

### Reporting and Remediation

The report is the deliverable that everything else exists to produce. A strong report ranks findings by severity, explains how each was reproduced, describes the real-world impact, and gives clear, prioritized remediation steps. A good pentest ends with the client knowing exactly what to fix first and how to verify the fix.

## Standards, Frameworks, and Teams

Ethical hacking does not happen in a vacuum. A few reference points shape the profession:

- **OWASP Top 10 (2021)** — the reference list of the most critical web application risks, from Broken Access Control to Server-Side Request Forgery. Essential reading for [web hacking](/en/page-web-hacking).
- **MITRE ATT&CK** — a knowledge base of adversary tactics and techniques used to plan tests and measure detection coverage.
- **PTES / NIST SP 800-115** — methodologies that keep engagements consistent and defensible.

Offensive testing is only one side of the coin. In many organizations, attackers ([red team](/en/page-red-blue-teams)) and defenders (blue team) work in tandem, and the resulting purple-team collaboration turns each finding into an improved detection or control.

## Building the Skill Set

Ethical hacking rewards breadth. You need working knowledge of [networking](/en/page-networking), operating systems, web technologies, and enough scripting to automate the boring parts. From there, the fastest way to improve is deliberate, legal practice.

- **Build a home lab** — isolated VMs let you attack, break, and rebuild without touching anyone else's systems.
- **Play [Capture The Flag challenges](/en/page-ctf-challenges)** — CTFs teach exploitation in a scoped, sanctioned environment.
- **Stay current** — new CVEs, techniques, and defenses appear constantly; treat learning as part of the job.

Certifications such as the OSCP, PNPT, and CEH can structure your study and signal competence to employers, but hands-on lab time is what actually makes you dangerous to the right systems. For a fuller roadmap, see [Where to Start Hacking](/en/where-to-start).

## The Non-Negotiables

Skill without discipline is a liability. Every engagement holds to the same rules: get explicit permission in writing, stay strictly within scope, document everything you touch, protect any sensitive data you encounter, and disclose your findings only to the owner. Break those, and you are not an ethical hacker — you are a criminal who happens to be good with a keyboard.
