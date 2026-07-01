---
title: Trojan
description: A Trojan is malware disguised as trusted software to open backdoors, steal data, and hijack systems. Learn how Trojans work, common types, and defenses.
layout: ../../layouts/MainLayout.astro
---

A Trojan, or "Trojan horse," is malware that hides inside something the victim wants to run. The disguise gets it past the user; the payload does the damage. Unlike a virus or worm, a Trojan does not self-replicate, so it defines a _delivery method_ built on deception rather than any single behaviour.

## How Trojans Work

A Trojan needs a person to run it. That reliance on human trust makes it a form of [social engineering](/en/page-socialEngineering), and the delivery routes mirror that:

- **Cracked or "free" software** and fake installers that bundle a hidden payload with something genuinely functional, so nothing looks broken after install.
- **Email attachments** — invoices, resumes, or macro-enabled Office documents that run a downloader when opened. This overlaps heavily with a [phishing attack](/en/page-phishing-attack).
- **Trojanised downloads** from typosquatted sites, malicious ads, or compromised update servers, where a legitimate-looking binary has been swapped for a poisoned one.

Once executed, the payload usually establishes persistence (a scheduled task, registry run key, or service) so it survives a reboot, then carries out its real job. Common goals include:

- **Backdoor access:** the Trojan opens a covert channel, letting an attacker command the host remotely. See [Backdoor](/en/page-backdoor).
- **Credential and data theft:** harvesting saved passwords, browser cookies, session tokens, and financial details.
- **Loading further malware:** many first-stage Trojans exist only to pull down ransomware, a [rootkit](/en/page-rootkit), or additional tooling.
- **Botnet enrolment:** conscripting the host into a network used for spam or a [DDoS attack](/en/page-ddos-attack).

## Common Trojan Types

Trojans are categorised by payload, and a single sample often combines several:

- **Remote Access Trojans (RATs):** give an operator interactive control — file access, webcam and microphone capture, live command execution.
- **Infostealers:** grab browser credentials, crypto wallets, and session cookies in one sweep, then exfiltrate and often self-delete. This is one of the dominant commodity threats today, frequently sold as malware-as-a-service.
- **Banking Trojans:** hook browser sessions or overlay fake login screens to capture banking and payment credentials, including one-time codes.
- **Downloaders / droppers:** lightweight first-stage code whose only purpose is to fetch and launch the real payload.
- **Keyloggers:** record keystrokes and clipboard contents and stream them to the attacker.

## Defending Against Trojans

Prevention leans on cutting off the "user runs it" step and limiting blast radius if one gets through:

1. **Install only from trusted sources** — official vendor sites, signed packages, or a distribution's package manager. Avoid cracked software entirely.
2. **Verify downloads** by checking the publisher's signature or comparing the file hash against the vendor's published value before running it:

   ```bash
   # Compare against the checksum the vendor publishes
   sha256sum installer.bin
   # Linux: confirm a package's digital signature
   gpg --verify installer.bin.sig installer.bin
   ```

3. **Patch aggressively.** Keep the OS, browser, and applications current so a downloader has no known vulnerability to escalate through.
4. **Run endpoint protection with behavioural detection.** Modern EDR flags what a process _does_ (spawning shells, touching credential stores) rather than relying on signatures alone.
5. **Enforce least privilege** and use a [firewall](/en/page-firewall) plus egress filtering so a backdoor cannot quietly phone home.
6. **Protect the accounts, not just the endpoint.** Strong, unique [passwords](/en/page-secure-passwords) and [two-factor authentication](</en/page-two-factor-authentication-(2fa)>) blunt the value of stolen credentials.
7. **Keep offline, tested backups** so a loader that delivers ransomware does not become a total loss.

For defenders and students working in an authorised lab, detonate suspicious samples only inside an isolated virtual machine and study behaviour through [malware analysis](/en/page-malware-analysis). If a Trojan reaches a production system, follow a defined [incident response](/en/page-incident-response) process: contain the host, hunt for the persistence mechanism and any second-stage payload, rotate exposed secrets, and rebuild rather than trust a cleaned machine.
