---
title: Rootkits
description: How rootkits hide malicious code in user mode, the kernel, and firmware, why they defeat antivirus, and how defenders detect and remove them.
layout: ../../layouts/MainLayout.astro
---

A rootkit is malicious code whose defining job is not to steal or destroy but to _hide_ other malicious code from the operating system, the user, and security tooling. The name comes from Unix: a "kit" of tools for keeping "root" ([administrator](/en/page-root-access)) access.

Once an attacker gains [Root Access](/en/page-root-access) to a machine, their next goal is to keep it. If the administrator spots the intrusion, they cut it off. A rootkit blocks that by tampering with the very system the defender relies on to see what is running.

## What Makes a Rootkit Different

Most [malware](/en/page-malware) is happy to run as an ordinary program. A rootkit is defined by _stealth and privilege_: it hooks into the layers of software that report the truth about a system, then edits that truth on the fly. It rarely acts alone; it is the concealment layer that protects a [backdoor](/en/page-backdoor), keylogger, or bot agent living alongside it.

Think of a rootkit as compromising the referee. Antivirus asks the operating system "what files and processes exist?" A rootkit sits between that question and its answer, and quietly removes itself and its payload from the response.

## Where Rootkits Live

Rootkits are usually classified by the privilege level they operate at. The deeper they sit, the harder they are to detect and remove.

### User-Mode Rootkits

The shallowest type runs in user mode, the same restricted space as normal applications. They hide by hooking library calls or manipulating a process's own view of the system, for example by intercepting API calls or injecting into other processes. Because they live where security tools also operate, a well-updated endpoint scanner has a realistic chance of catching them.

### Kernel-Mode Rootkits

A kernel-mode rootkit loads into the core of the operating system, which controls the hardware, memory, and every process. From here it can intercept system calls directly:

- When an admin lists files, the rootkit returns everything _except_ its own.
- When a security tool enumerates running processes, the rootkit filters its payload out of the list.
- Because the kernel itself is compromised, the OS can no longer be trusted to report reality.

On Linux these historically arrived as malicious loadable kernel modules (LKMs); on Windows, as kernel drivers. Modern platforms fight back with driver signing, Kernel Patch Protection (PatchGuard), Secure Boot, and Hypervisor-protected Code Integrity, which is why attackers increasingly abuse _signed but vulnerable_ legitimate drivers, a technique known as "bring your own vulnerable driver" (BYOVD).

### Bootkits and Firmware Rootkits

The deepest rootkits load before the operating system does. A bootkit infects the boot process (the UEFI firmware or bootloader) so it gains control first and can undermine the OS as it starts. Firmware rootkits can hide in the UEFI/SPI flash chip or in device firmware, surviving a full disk wipe and OS reinstall. These are rare and expensive to build, and they are usually associated with advanced, well-resourced attackers rather than commodity crime.

## Why Rootkits Matter to Attackers

A rootkit is rarely the goal itself; it is what keeps the goal alive.

1. **Persistence.** Surviving reboots, updates, and casual inspection so access lasts months or years.
2. **Concealed backdoor.** Hiding the [backdoor](/en/page-backdoor) an attacker uses to return on demand.
3. **Botnet membership.** Quietly enrolling the host into a botnet used for [DDoS attacks](/en/page-ddos-attack) or spam.
4. **Credential theft.** Sheltering a keylogger that captures passwords and session tokens over time.

## Detecting Rootkits

Detecting a kernel or firmware rootkit _from inside_ the infected system is unreliable by design: you are asking a compromised OS to incriminate itself. Detection works best when it does not depend on the potentially-lying system.

- **Offline / out-of-band scanning.** Boot from trusted external media, or attach the disk to a known-clean machine, so the rootkit's code is dormant while you inspect it.
- **Behavioural and cross-view detection.** Compare answers from different layers, for example the process list the OS reports versus the raw kernel structures, and flag the discrepancies a rootkit creates. This is how tools such as Windows Sysinternals and Linux checkers like `chkrootkit` and `rkhunter` operate.
- **Memory forensics.** Capture RAM and analyse it offline with a framework such as Volatility to find hidden processes and hooked system calls.
- **Integrity monitoring.** File and firmware integrity baselines surface unexpected changes to critical binaries or boot components.

```bash
# Quick host triage on Linux (run with sudo)
sudo rkhunter --update
sudo rkhunter --check --sk        # scan for known rootkits and anomalies
sudo chkrootkit                   # second opinion from a different tool

# Spot processes hidden from normal listings by comparing views
sudo ls /proc | grep -E '^[0-9]+$' | sort -n   # PIDs the kernel knows about
ps -e -o pid= | sort -n                          # PIDs ps reports
# entries present in /proc but missing from ps warrant investigation
```

Treat these tools as one signal, not proof: a sufficiently capable rootkit can defeat scanners running on the same host. Their real strength is confirming an infection you already suspect from network anomalies, unexplained outbound traffic, or [forensic](/en/page-forensics) analysis.

## Removal and Recovery

For user-mode infections, a reputable endpoint tool can often remediate. For a confirmed kernel-mode rootkit, the only trustworthy fix is to wipe the storage and reinstall the operating system from known-good media, then restore data from clean backups. For suspected firmware rootkits, wiping the disk is not enough; the affected firmware must be reflashed, or the hardware retired. If the machine mattered, follow an [incident response](/en/page-incident-response) process: contain it, rotate every credential it touched, and preserve evidence before you rebuild.

## Responsible Use

Rootkit techniques appear in authorised red-team and [malware analysis](/en/page-malware-analysis) work, always inside consent and scope. Study them to build detection, harden the boot chain, and understand what "trust" means once the kernel is compromised, not to persist on machines you do not own. Deploying a rootkit on a system without authorisation is a serious crime in nearly every jurisdiction.
