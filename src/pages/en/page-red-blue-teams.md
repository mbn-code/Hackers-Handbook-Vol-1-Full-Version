---
title: Red and Blue Teams
description: How offensive red teams and defensive blue teams work, why purple teaming beats both, plus MITRE ATT&CK, detection engineering, and threat hunting.
layout: ../../layouts/MainLayout.astro
---

Security is easiest to reason about as a contest between two sides: one that tries to break in and one that tries to keep them out. Red teams emulate real attackers to prove where an organisation is exposed; blue teams detect, contain, and defend. Neither exists to win points off the other. The whole exercise only pays off when what the attacker finds gets turned into a lasting improvement to the defence.

This chapter assumes the obvious ground rule: every technique here belongs inside an authorised engagement with a written scope. Emulating an adversary against systems you do not own or have no permission to test is a crime, not a drill. See [Legal and Ethical Considerations in Hacking](/en/page-legal-ethical) before you touch anything.

## Red team: adversary emulation

A red team's job is not to run a scanner and hand over a list of CVEs. That is a vulnerability assessment. A red team emulates a specific threat actor's behaviour end to end to answer a sharper question: _if a motivated attacker targeted us, would we notice, and could we stop them before they reached the crown jewels?_

A typical engagement follows the attack lifecycle:

- **Reconnaissance** — mapping the external footprint, employees, and exposed services. This is where tools like [Nmap](/en/page-4) build the picture of what is reachable.
- **Initial access** — most commonly through [phishing](/en/page-phishing-attack) or [social engineering](/en/page-socialEngineering), not exotic zero-days. People are the reliable way in.
- **Execution and persistence** — establishing a foothold and a way back, often via a [backdoor](/en/page-backdoor) or command-and-control channel.
- **Privilege escalation and lateral movement** — turning a single foothold into broader access, working toward [root or administrator control](/en/page-root-access).
- **Objective and exfiltration** — reaching the agreed goal (a specific database, domain admin, a "flag" file) and demonstrating impact.

Red teams lean on frameworks like the [Metasploit Framework](/en/page-6) and other [exploitation frameworks](/en/page-exploitation-frameworks) for delivery, but the craft is in stealth and tradecraft: blending into normal traffic, avoiding noisy tooling, and testing whether the blue team's sensors actually fire.

**Red team vs penetration test.** A pen test aims for breadth — find as many exploitable [vulnerabilities](/en/page-vulnerability) as possible in a defined target. A red team aims for depth and realism — one attacker, one set of objectives, full stealth, and defenders who usually do not know it is coming. Both are useful; they answer different questions.

## Blue team: detection and defence

The blue team owns everything that keeps the organisation standing while it is under attack, real or simulated. That work splits into three broad activities.

**Harden.** Reduce the attack surface before anyone knocks. This means patching, sensible [firewall](/en/page-firewall) rules, [operating system security](/en/page-os-security) baselines, least-privilege access, [multi-factor authentication](</en/page-two-factor-authentication-(2fa)>), and enforcing [secure passwords](/en/page-secure-passwords). Prevention that a red team never gets to test is prevention that worked.

**Detect.** Collect telemetry — endpoint logs, network flow, authentication events, [packet capture](/en/page-packet-sniffing) — and turn it into alerts. The modern blue team runs on a SIEM (log aggregation and correlation), EDR/XDR (endpoint behaviour analytics), and increasingly automation to triage the flood. The measure of a good detection is simple: does it fire on the attacker's technique without drowning analysts in false positives?

**Respond.** When something fires, follow a plan: identify, contain, eradicate, recover, and learn. This is a whole discipline of its own — see [Incident Response](/en/page-incident-response) — and it often hands off to [forensics](/en/page-forensics) and [malware analysis](/en/page-malware-analysis) when the team needs to understand exactly what happened and how far it spread.

### Threat hunting

Detection is reactive; hunting is proactive. Instead of waiting for an alert, hunters form a hypothesis ("an attacker who compromised a workstation would use it to enumerate the domain") and go looking for evidence in the data, whether or not an alert ever fired. Good hunts frequently produce new detections, which is how the blue team converts a one-off discovery into permanent coverage.

## MITRE ATT&CK: the shared language

Red and blue teams stop talking past each other when they share a taxonomy, and the de facto standard is MITRE ATT&CK — a public, curated knowledge base of real-world adversary tactics (the _why_, such as Persistence or Lateral Movement) and techniques (the _how_, such as scheduled tasks or credential dumping).

It gives both sides a common map. Red teams plan engagements against specific techniques and report results as ATT&CK coverage. Blue teams score their detections against the same matrix to find blind spots — techniques an adversary could use that they cannot currently see. When a red team reports "we used T1021 (Remote Services) for lateral movement and you had no detection," everyone knows exactly what to fix.

## Purple teaming: closing the loop

The old model runs the red team as a surprise exam and reveals the results at the end. That produces a dramatic report and not much improvement. Purple teaming replaces the ambush with collaboration: red and blue work the same technique together, in real time.

A purple exercise runs like this:

1. Pick a technique to test — say, credential dumping from memory.
2. The red team executes it in a controlled way.
3. Everyone watches the blue team's tooling. Did the EDR alert? Did the SIEM correlate it? Did an analyst notice?
4. If nothing fired, the blue team writes and tunes a detection on the spot.
5. Re-run the technique to confirm the new detection works, then move to the next.

"Purple team" is a mode of working, not usually a permanent headcount. The output is concrete and measurable: a validated detection for a specific attacker behaviour, mapped back to ATT&CK.

## Where you sit as a learner

You do not need a corporate SOC to practise either side. [Capture The Flag challenges](/en/page-ctf-challenges) and lab platforms let you attack deliberately vulnerable targets safely — spin up a [Metasploitable VM](/en/page-metasploitable) inside a [virtual machine](/en/page-3) and you have a legal range for red-team practice. Start with reconnaissance against the box you own:

```bash
# Red side: enumerate a lab target on your own isolated network
nmap -sV -sC 192.168.56.101
```

For the blue side, install a SIEM in a lab, feed it your own logs, and try to detect the attacks you just ran. Running both roles on the same lab teaches more than either alone, because you see exactly which noisy actions light up the defence and which slip past.

## Hands-on lab: run and detect one technique

This is a self-contained purple-team drill on a single Linux VM you own — a [virtual machine](/en/page-3) with a fresh snapshot taken first so you can roll back cleanly. It emulates ATT&CK T1053.003 (Scheduled Task/Job: Cron), a common persistence trick, then proves whether your telemetry actually catches it.

First, stand up the blue-side sensor. The Linux audit daemon watches files and writes tamper-resistant logs:

```bash
sudo apt install auditd -y
sudo auditctl -w /etc/crontab -p wa -k cron_persist
sudo auditctl -w /var/spool/cron/ -p wa -k cron_persist
```

Now play the attacker. Drop a persistence entry the way a foothold would, scheduling a job that runs on its own:

```bash
echo '* * * * * root id > /tmp/proof' | sudo tee -a /etc/crontab
```

Switch back to the blue chair and hunt for the write your rule was meant to catch:

```bash
sudo ausearch -k cron_persist -i | tail
```

You should see the write event tagged with the `auid` of the account that made the change — exactly the evidence a hunter would pivot from. If nothing appears, your watch rule is wrong, and discovering that in a lab is the whole point.

Finally, close the loop like a real exercise: remove the crontab line, restore the snapshot, and record the detection as a permanent SIEM rule keyed on writes to cron paths. That validated rule — not the fact that the attack worked — is the deliverable. Then repeat with a stealthier technique to find where your coverage ends; comfort in the [Linux shell](/en/page-linux-shell) makes running both chairs back to back much quicker.

## Building an effective programme

A few principles separate a mature red/blue practice from theatre:

- **Emulate a real threat, not a generic one.** Base scenarios on adversaries that plausibly target your sector, using their documented techniques. Studying [past incidents](/en/page-case-studies) keeps scenarios grounded.
- **Optimise for detection, not just for "the red team got in."** Assume a determined attacker eventually gets a foothold. The question that matters is how fast the blue team sees it and how far it spreads before containment.
- **Feed findings into engineering.** Every gap should become a new detection, a hardened configuration, or fixed code — connecting back to [secure coding](/en/page-secure-coding) when the root cause is in software.
- **Keep learning current.** The tradecraft on both sides moves constantly, so treat [staying current](/en/page-stay-current) as part of the job rather than an afterthought.

If working both sides appeals to you, the [where to start](/en/where-to-start) guide lays out the foundational skills each role depends on and how to build them in order.
