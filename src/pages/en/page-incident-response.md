---
title: Incident Response
description: "A practical guide to incident response: NIST and SANS lifecycles, triage, containment, forensics, and playbooks that limit breach damage."
layout: ../../layouts/MainLayout.astro
---

Incident response (IR) is the disciplined process an organisation follows to detect a security incident, limit the damage, remove the attacker, and get back to normal operations, all while preserving the evidence needed to understand what happened. Good IR is the difference between a contained intrusion and a headline breach.

Everything below assumes you are responding on systems you own or are authorised to defend. That authority, and the boundaries around it, should be written down before an incident ever starts.

## Why Incident Response Matters

Attackers only have to succeed once; defenders have to respond every time. A rehearsed process turns panic into procedure.

- **Speed limits damage.** The longer an intruder dwells in a network, the more they can exfiltrate, encrypt, or pivot into. Reducing mean time to detect (MTTD) and mean time to respond (MTTR) is the core metric IR teams optimise.
- **Evidence has a shelf life.** Volatile data such as memory, network connections, and running processes vanishes on reboot. Handling it correctly keeps forensic and legal options open.
- **Regulation is real.** Breach-notification laws such as GDPR (72-hour reporting) and sector rules for finance and healthcare impose hard deadlines. IR is how you meet them.
- **Trust is fragile.** A calm, transparent response protects customer confidence far better than a chaotic scramble.

## Frameworks: NIST and SANS

Two lifecycles dominate the field, and they map cleanly onto each other.

**NIST SP 800-61** is the reference standard. Its long-standing four-phase model is: Preparation; Detection and Analysis; Containment, Eradication, and Recovery; and Post-Incident Activity. The 2025 revision (800-61r3) reframes incident response around the NIST Cybersecurity Framework 2.0 functions (Govern, Identify, Protect, Detect, Respond, Recover), tying response work more tightly to overall risk management.

**SANS** uses the six-step **PICERL** model: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned. It is the same lifecycle at finer granularity.

Pick one, document it, and make sure everyone on the team speaks the same vocabulary during a crisis.

## The IR Lifecycle in Practice

### Preparation

Preparation is the phase that decides whether the others go well. Before anything burns:

- Write an incident response plan with clear roles: incident commander, technical lead, communications, legal, and an executive sponsor.
- Build **playbooks** for the incident types you actually face: ransomware, business email compromise, credential theft, data exfiltration.
- Deploy and tune telemetry: centralised logging into a SIEM, endpoint detection and response (EDR) agents, and full network visibility. Detection is only as good as your logs.
- Run **tabletop exercises** and purple-team drills so the plan is muscle memory, not a PDF nobody has opened. See [Red and Blue Teams](/en/page-red-blue-teams).

### Detection and Analysis

Detection is where an alert becomes a confirmed incident. Analysts correlate signals from the SIEM, EDR, firewall logs, and packet capture to answer three questions: what happened, how far did it spread, and what is the attacker after?

This is where you triage. Not every alert is an incident; classify severity, then pull the volatile evidence before it disappears. On a Linux host you control:

```bash
# Capture volatile state first — it is gone after a reboot
ss -tanp              # active connections + owning process
ps auxf               # full process tree
who -a; last -20      # current and recent logins
sudo lsof -nPi        # open network files by process
```

Record the indicators of compromise (IOCs) you find, such as malicious IPs, file hashes, and domains, so you can hunt for the same attacker elsewhere in the estate.

### Containment

The goal is to stop the bleeding without destroying evidence or tipping off the attacker prematurely. Short-term containment isolates affected hosts; long-term containment applies durable fixes such as rotating credentials and patching the entry point.

Isolate a compromised host at the network layer while keeping it alive for forensics, rather than pulling the power (which wipes memory):

```bash
# Contain, don't wipe: block traffic but leave a path for the responder
sudo iptables -I INPUT 1 -j DROP
sudo iptables -I OUTPUT 1 -j DROP
sudo iptables -I OUTPUT 1 -d <responder-jump-host> -j ACCEPT
```

Segmentation and pre-staged network access control lists make this far faster during a real event.

### Eradication and Recovery

Eradication removes the attacker's foothold: malware, backdoors, rogue accounts, and persistence mechanisms. Confirm the root cause first, because reimaging a machine without closing the original vulnerability just invites the attacker back. Then recover from known-good backups, restore services in a controlled order, and monitor closely for signs of re-entry before declaring the incident closed.

### Post-Incident Activity

Within a week or two, hold a blameless retrospective. What was the root cause? Where did detection lag? Which playbook step failed? Feed concrete fixes back into preparation, updated detections, patched systems, and revised runbooks, so the same incident cannot recur the same way.

## Tooling and Techniques

Modern IR leans on a familiar stack:

- **SIEM** for log aggregation, correlation, and alerting.
- **EDR/XDR** for endpoint visibility, process telemetry, and remote isolation.
- **SOAR** to automate repetitive playbook steps like enrichment and ticketing.
- **[Forensics](/en/page-forensics)** tooling for disk and memory imaging and timeline reconstruction.
- **[Malware Analysis](/en/page-malware-analysis)** in a sandbox to understand captured samples safely.

Chain of custody matters throughout: document who touched what evidence, when, and how it was stored. If an incident ends up in court or an insurance claim, sloppy handling can sink an otherwise solid investigation.

## Common Pitfalls

- **Containing too early or too late.** Isolate the wrong way and you either alert the attacker or lose the memory you needed.
- **No plan, no roles.** Deciding who is in charge during the incident wastes the golden hour.
- **Skipping lessons learned.** An incident you do not analyse is an incident you will repeat.
- **Untested backups.** Recovery fails when nobody verified the restore path.

## Hands-on Lab: Triage a Compromised Linux VM

Do this on a disposable VM you own, never a machine you depend on. If you have not built one yet, [Virtual Machines -> Setting One Up](/en/page-3) covers it. Take a snapshot first so you can roll back cleanly.

1. **Plant a benign "intrusion."** Simulate persistence and a beacon without touching real malware:

```bash
# rogue cron job that "beacons" every minute
echo '* * * * * root /usr/bin/curl -s http://127.0.0.1:9999 >/dev/null 2>&1' | sudo tee /etc/cron.d/update-check
# a harmless listener standing in for an attacker C2 endpoint
python3 -m http.server 9999 &
```

2. **Open a timestamped evidence folder** so every artifact is attributable:

```bash
EVID="$HOME/ir-$(date -u +%Y%m%dT%H%M%SZ)"; mkdir -p "$EVID"
```

3. **Snapshot volatile state before it changes.** Order matters: grab connections and processes first.

```bash
ss -tanp        > "$EVID/connections.txt"
ps auxf         > "$EVID/processes.txt"
sudo lsof -nPi  > "$EVID/openfiles.txt"
last -20; who -a
```

4. **Hunt for the persistence** the way you would a real foothold:

```bash
sudo grep -Rns 'curl\|wget\|nc \|/dev/tcp' /etc/cron.d /etc/crontab /etc/cron.hourly 2>/dev/null
```

5. **Contain, then eradicate.** Block the beacon's egress, preserve the artifact as evidence, then remove it:

```bash
sudo iptables -I OUTPUT 1 -p tcp --dport 9999 -j DROP
sudo cp /etc/cron.d/update-check "$EVID/"   # preserve before deleting
sudo rm /etc/cron.d/update-check
pkill -f http.server                        # stop the fake C2
```

Re-run the step 3 captures into a fresh folder and diff them against your first snapshot to confirm the beacon is gone, then write two sentences of lessons learned. For disk and memory imaging beyond this, see [Forensics](/en/page-forensics).

Learning from real events sharpens all of this; the [Case Studies](/en/page-case-studies) page walks through breaches and how responders handled them, and [Stay Current](/en/page-stay-current) covers keeping detections and playbooks up to date.
