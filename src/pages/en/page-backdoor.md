---
title: Backdoor
description: A backdoor is a covert method of bypassing normal authentication to access a system. Learn how backdoors work, how they hide, and how to detect them.
layout: ../../layouts/MainLayout.astro
---

A backdoor is any covert mechanism that bypasses normal authentication or access controls to reach a system, application, or network. Some are built deliberately for legitimate remote support; the ones that matter to defenders are the hidden channels an attacker installs to keep coming back after the initial break-in.

## Legitimate vs. Malicious Backdoors

A vendor might ship a maintenance account or a debug interface so support engineers can recover a locked device. That is a designed-in backdoor, and it is only "safe" while it stays secret and tightly controlled. History is full of these turning into disasters: default credentials, hardcoded service accounts, and undocumented management ports get discovered, published, and abused at scale.

A malicious backdoor is planted by an attacker who already has a foothold. Its job is **persistence** — surviving reboots, patches, and password resets so the intruder can return without repeating the original exploit. In red-team engagements, establishing and then cleanly removing this kind of access is part of demonstrating real-world impact under an authorised scope.

## How Backdoors Are Implanted

Backdoors live at every layer of the stack:

- **Web shells** — a small script (PHP, ASPX, JSP) dropped on a compromised web server that runs attacker commands through ordinary HTTP requests. A favourite against exposed web apps.
- **Reverse and bind shells** — payloads that either call back to the attacker or listen locally for connections. Frameworks like the [Metasploit Framework](/en/page-6) generate these, and Meterpreter can migrate into other processes to hide.
- **OS persistence** — rogue local accounts, malicious cron jobs or systemd services, altered SSH `authorized_keys`, scheduled tasks, or registry Run keys on Windows.
- **Rootkits** — kernel- or firmware-level implants that hide their own files, processes, and network connections from the operating system. See [Rootkits](/en/page-rootkit).
- **Trojanised software** — legitimate-looking programs carrying hidden access, a classic [Trojan](/en/page-trojan) delivery method.
- **Supply-chain implants** — code slipped into a trusted build pipeline or dependency, so the backdoor ships to every downstream user. The SolarWinds SUNBURST compromise and the 2024 `xz` (liblzma) backdoor are landmark examples of this class.

## Why They Are Hard to Detect

Good backdoors blend into normal activity. Reverse shells reuse common ports like 443 so traffic looks like ordinary HTTPS. Fileless implants live only in memory. Rootkits intercept the very system calls a defender would use to look for them. Supply-chain backdoors arrive digitally signed and trusted. This is why "the box looks fine" is never proof of a clean system.

## Detection and Prevention

Assume persistence and hunt for it deliberately. Baseline what "normal" looks like, then watch for drift — new accounts, unexpected listeners, and outbound connections to unfamiliar hosts.

```bash
# Local triage on a suspected Linux host (run with authorisation)
ss -tulpn                       # listening ports and owning processes
crontab -l; ls -la /etc/cron.*  # unexpected scheduled jobs
last -a | head                  # recent logins and sources
grep -vE '/nologin|/false$' /etc/passwd   # accounts with real shells
```

Solid defensive practice combines several layers:

- **Least privilege and no shared secrets.** Remove default and hardcoded credentials; enforce [Two-Factor Authentication (2FA)](</en/page-two-factor-authentication-(2fa)>) on remote access.
- **Egress filtering.** A tuned firewall that restricts outbound traffic breaks many call-home channels.
- **Integrity monitoring.** File-integrity tools and code signing catch tampered binaries and rogue key files.
- **Patch and audit.** Timely updates close the vulnerabilities used to plant backdoors in the first place.
- **Prepared response.** When you do find one, a documented [Incident Response](/en/page-incident-response) plan guides eradication and recovery.

## Responsible Use

Study backdoors to defend against them and to test systems you are explicitly authorised to assess. Installing persistence on a machine you do not own — or leaving one behind after an engagement — is a crime in most jurisdictions and a breach of professional trust. Keep your work inside scope, logged, and reversible.
