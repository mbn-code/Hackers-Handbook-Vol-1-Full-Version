---
title: Digital Forensics
description: A practical guide to digital forensics - imaging drives, preserving evidence, memory and disk analysis, timelines, and keeping findings court-admissible.
layout: ../../layouts/MainLayout.astro
---

Digital forensics is the disciplined recovery, preservation, and analysis of electronic evidence so that it stands up to scrutiny - in a courtroom, a boardroom, or an incident post-mortem. Where an attacker leaves traces, a forensic examiner reconstructs what happened, when, and by whom, without altering the evidence in the process.

Everything here assumes you are working on systems and data you are authorised to examine: your own labs, an employer's estate under a signed engagement, or evidence handed to you through proper legal channels. Handling someone else's data without that authority is itself a crime.

## What Forensics Is Actually For

Forensics sits downstream of a question. Someone wants to know _what happened_, and the answer has to survive challenge.

- **Incident investigation.** After a breach, forensics establishes the initial foothold, lateral movement, data touched, and dwell time. This feeds directly into [Incident Response](/en/page-incident-response) and remediation.
- **Criminal and civil cases.** Law enforcement and litigators rely on forensic evidence to attribute actions to accounts and devices. Poor handling gets that evidence thrown out.
- **Regulatory and e-discovery.** Data-breach and privacy regimes (GDPR, HIPAA, PCI DSS) require you to prove scope and impact. e-Discovery locates the specific records relevant to a matter.
- **Malware and intrusion analysis.** Recovering a dropped binary and its artifacts overlaps heavily with [Malware Analysis](/en/page-malware-analysis) - forensics tells you how it got there and what it did on the host.

## The Golden Rule: Preserve First, Analyse on Copies

The cardinal principle is that you never work on original evidence. You acquire a bit-for-bit image, verify it cryptographically, and do all analysis on the copy. If your process changes the original, opposing counsel or an auditor will notice.

### Order of Volatility

Evidence decays at different rates. RFC 3227 codifies the collection order: grab the most fleeting data first.

1. CPU registers and cache
2. RAM, running processes, network connections, ARP cache
3. Temporary filesystem and swap
4. Disk (persistent storage)
5. Remote logging and monitoring data
6. Physical configuration and network topology
7. Archival media and backups

In practice this means capturing memory _before_ you pull the plug, because a hard shutdown destroys everything in RAM - including keys, injected code, and connections that never touch disk.

### Chain of Custody

Every piece of evidence needs an unbroken, documented trail: who collected it, when, from where, how it was stored, and every hand it passed through. A gap in that chain is often enough to make the evidence inadmissible, no matter how damning it is.

## Acquisition: Making a Forensic Image

A forensic image is a complete, sector-level copy of the source. Use a hardware **write blocker** on the source drive so the acquisition process cannot modify it, then image with a tool that logs errors and computes hashes.

```bash
# dcfldd - a forensics-focused fork of dd that hashes as it reads
dcfldd if=/dev/sdb of=evidence.img hash=sha256 hashlog=evidence.hashes bs=4M

# Or the widely used Expert Witness Format (E01), which stores
# metadata and hashes inside the image container
ewfacquire /dev/sdb
```

Immediately hash the image and record the value. Anyone can later re-hash the copy and prove it is identical to what you acquired.

```bash
sha256sum evidence.img
# 3f786850e387550fdab836 ...  evidence.img
```

For live memory, capture RAM before touching disk:

```bash
# Linux - acquire physical memory to a file
avml memory.lime            # Microsoft's AVML acquirer
# Windows equivalents: WinPmem, Magnet RAM Capture, FTK Imager
```

## Analysis Techniques

### Disk and File System Forensics

The open-source workhorses are **The Sleuth Kit** (command-line) and **Autopsy** (its GUI front end). They parse file systems, recover deleted files, and build browsable timelines from an image.

```bash
# List files, including deleted entries, from an image
fls -r -m / evidence.img > bodyfile.txt

# Carve deleted/unallocated files by header signature
foremost -i evidence.img -o recovered/
scalpel -o recovered/ evidence.img
```

Deleted does not mean gone. Until the underlying sectors are overwritten, the data usually remains and can be _carved_ back out by its file signature.

### Memory Forensics

RAM holds what disk never will: decrypted content, process memory, injected code, and live network state. **Volatility 3** is the standard framework for dissecting a memory image.

```bash
# Identify processes, including ones hidden from the OS
python3 vol.py -f memory.lime linux.pslist
# Surface injected or hidden code regions for further malware analysis
python3 vol.py -f memory.lime linux.malfind
```

Memory analysis is often the only way to catch fileless malware and [rootkits](/en/page-rootkit) that hide from the operating system's own tooling.

### Timeline Analysis

A **super timeline** merges filesystem timestamps, logs, browser history, and registry data into one chronological view, so you can watch an intrusion unfold minute by minute. `plaso` / `log2timeline` is the go-to.

```bash
log2timeline.py timeline.plaso evidence.img
psort.py -o l2tcsv -w timeline.csv timeline.plaso
```

### Network Forensics

Captured traffic and flow records reveal command-and-control, exfiltration, and lateral movement. Wireshark and `tshark` dissect packet captures, pulling protocol streams and transferred files out of a `.pcap`.

```bash
# Pull out every file transferred over HTTP in a capture
tshark -r capture.pcap --export-objects http,exported_files/
```

## Reporting

The investigation is only worth what you can communicate. A forensic report states the scope and authority, the methodology and tools (with versions), the hashes proving integrity, the findings tied to evidence, and the limits of what can be concluded. Write it so a non-technical reader can follow the reasoning and a technical peer can reproduce your steps.

## Anti-Forensics and Its Limits

Attackers try to frustrate examiners: wiping logs, timestomping files, encrypting payloads, and running entirely in memory. Awareness of these techniques makes you a better investigator, not a better criminal - log-shipping to a separate host, immutable storage, and endpoint telemetry are exactly what defenders deploy to keep evidence intact even when an attacker tries to erase it.

## Hands-on Lab: Image, Carve, and Timeline a Disk You Own

This end-to-end exercise runs entirely on data you create, so there is no legal grey area - do it inside a disposable Linux [virtual machine](/en/page-3) with The Sleuth Kit and `foremost` installed (`sudo apt install sleuthkit foremost dosfstools`).

**1. Build a test filesystem.** Create a blank image, format it FAT (its simple directory entries make deletion easy to see), and drop in a file you own:

```bash
dd if=/dev/zero of=case.img bs=1M count=64
mkfs.vfat case.img
mkdir mnt && sudo mount -o loop case.img mnt
sudo cp ~/Pictures/photo.jpg mnt/note.jpg
sudo umount mnt
```

**2. Delete the evidence, then acquire and hash.** Simulate an attacker cleaning up, then freeze the image as your read-only exhibit:

```bash
sudo mount -o loop case.img mnt
sudo rm mnt/note.jpg && sudo umount mnt
sha256sum case.img | tee case.sha256
```

**3. Recover without touching the original.** List entries (deleted ones are flagged `*`), pull the file back by its inode, and carve by signature as a cross-check:

```bash
fls -r case.img                  # read the inode of the deleted note.jpg
icat case.img 5 > recovered.jpg  # replace 5 with the real inode number
foremost -i case.img -o carved/  # signature-based carving, ignores metadata
```

**4. Build a timeline and prove integrity.**

```bash
fls -r -m / case.img > bodyfile.txt
mactime -b bodyfile.txt -d > timeline.csv
sha256sum -c case.sha256         # "OK" means you never altered the exhibit
```

Open `recovered.jpg` - it is the file you "deleted." That final matching hash is the whole point: you pulled evidence out while proving the image is byte-for-byte unchanged. Swap the raw image for an E01 container and the exact same Sleuth Kit commands work against it.

## Building the Skill Set

- **Use standard, documented tools.** Autopsy, The Sleuth Kit, Volatility, and plaso are open source and widely accepted precisely because their behaviour is auditable.
- **Practice on legal data.** Public disk and memory images from DFIR training corpora and [Capture The Flag challenges](/en/page-ctf-challenges) let you sharpen technique without touching real evidence.
- **Know the law.** Admissibility, warrants, and privacy rules are non-negotiable. Ground your work in the [legal and ethical considerations](/en/page-legal-ethical) of handling data.
- **Document relentlessly.** If it isn't written down, it didn't happen. Hashes, timestamps, and notes are what turn a hunch into evidence.

Digital forensics rewards patience and rigour over flashiness. The examiner who images cleanly, hashes everything, and documents every step is the one whose findings still stand a year later in front of a judge.
