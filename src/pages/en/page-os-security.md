---
title: Operating System Security
description: "Harden Linux, Windows, and macOS: patching, least privilege, SELinux/AppArmor, logging, and disk encryption to shrink your attack surface."
layout: ../../layouts/MainLayout.astro
---

The operating system sits between every application and the hardware, which makes it the most valuable target on any machine. Compromise the OS and you own the kernel, the memory, the disk, and every account on it. Hardening the OS is how you make that compromise expensive, noisy, and hard to sustain.

This page is written for defenders and for testers with authorisation. Everything below applies to systems you own or are explicitly permitted to assess.

## The Attack Surface You Are Defending

Every running service, listening port, installed package, and privileged account is a door an attacker can try. Effective OS security is mostly about reducing the number of doors and putting a lock and an alarm on the ones that must stay open.

Think in layers:

- **Identity and access:** who can log in, and as whom.
- **Privilege:** what an authenticated user is allowed to do.
- **Exposure:** which services and ports are reachable, and from where.
- **Integrity:** whether the running system still matches what you deployed.
- **Visibility:** whether you would notice an intrusion in time to respond.

A weakness in any one layer can undo the others, so treat them as a set rather than a checklist to cherry-pick from. If you are still getting comfortable with how operating systems work under the hood, start with [Getting Cozy with Operating Systems](/en/page-2).

## Patch Management: Close Known Doors First

The overwhelming majority of real intrusions exploit a [vulnerability](/en/page-vulnerability) that already had a fix available. Unpatched software is the single most common way in, which makes timely patching the highest-value control you have.

On Debian and Ubuntu systems, update through the [apt package manager](/en/page-apt-package-manager):

```bash
sudo apt update && sudo apt upgrade -y
# Automate security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

On Red Hat, Fedora, and derivatives:

```bash
sudo dnf upgrade --refresh
```

On Windows, keep automatic updates enabled and confirm the last successful install:

```powershell
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10
```

Track what you have deployed so you can answer "are we affected?" the day a critical CVE drops, rather than guessing. Automate where you can; a patch that ships next quarter is not a control.

## Access Control and Least Privilege

Grant every account the minimum rights it needs and nothing more. Most damage from a breach comes from privilege the compromised account never actually needed.

Do routine work as an unprivileged user and escalate deliberately with `sudo` instead of logging in as root. If you need a refresher on how the shell and permissions fit together, see [The Linux Shell](/en/page-linux-shell) and [Root Access](/en/page-root-access).

```bash
# Create a standard user and grant controlled admin rights
sudo useradd -m -s /bin/bash analyst
sudo passwd analyst
sudo usermod -aG sudo analyst      # 'wheel' on RHEL-family systems

# Inspect file permissions and ownership
ls -l /etc/shadow                  # should be root-owned, not world-readable
```

Harden authentication itself:

- Enforce strong, unique credentials. See [Secure Passwords](/en/page-secure-passwords).
- Require [Two-Factor Authentication](</en/page-two-factor-authentication-(2fa)>) for administrative and remote access.
- For SSH, disable password login and root login, and use key-based authentication:

```bash
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Apply the least-privilege principle to services too: run daemons under dedicated low-privilege accounts so a bug in one service cannot immediately become full system control.

## Mandatory Access Control and Kernel Hardening

File permissions alone are discretionary; a process running as root can ignore them. Mandatory Access Control (MAC) adds a policy the kernel enforces regardless of user, confining each program to the resources it is supposed to touch. When an exploited web server is boxed in by SELinux or AppArmor, the attacker's foothold is far smaller.

```bash
# SELinux (RHEL, Fedora) — confirm it is enforcing
getenforce
sudo setenforce 1

# AppArmor (Ubuntu, Debian, SUSE) — list active profiles
sudo aa-status
```

Tighten kernel behaviour with `sysctl` to blunt common exploitation techniques:

```bash
# Restrict access to kernel pointers and dmesg
sudo sysctl kernel.kptr_restrict=2
sudo sysctl kernel.dmesg_restrict=1
```

These controls do not stop the initial bug, but they turn "instant total compromise" into "contained, detectable incident."

## Configuration Hardening and Reducing Exposure

Disable and remove what you do not use. Every service you turn off is one fewer thing to patch, monitor, and worry about.

```bash
# See what is listening on the network
sudo ss -tulpn

# Stop and disable an unneeded service
sudo systemctl disable --now cups
```

Put a host [firewall](/en/page-firewall) in front of whatever must stay reachable, defaulting to deny:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp        # only the ports you actually serve
sudo ufw enable
```

Encrypt data at rest so a stolen laptop or decommissioned drive does not become a data breach: LUKS on Linux, BitLocker on Windows, FileVault on macOS. Where the hardware supports it, enable Secure Boot so the system refuses to load an unsigned or tampered boot chain, one of the footholds a [rootkit](/en/page-rootkit) relies on. Follow published baselines such as the CIS Benchmarks rather than hardening from memory.

## Auditing, Logging, and Integrity Monitoring

You cannot respond to what you cannot see. Centralised, tamper-resistant logs are what separate a quick containment from a breach that dwells for months.

```bash
# Follow authentication events in real time
sudo journalctl -u ssh -f

# Record security-relevant syscalls with the audit daemon
sudo systemctl enable --now auditd
sudo ausearch -m avc -ts recent      # recent SELinux denials
```

Add file integrity monitoring (AIDE, Tripwire, or an EDR agent) so unexpected changes to system binaries and configuration raise an alert. Ship logs off the host to a system the local admin account cannot edit; the first thing an intruder does is try to erase their tracks. When something does trip an alarm, your [incident response](/en/page-incident-response) plan and [forensics](/en/page-forensics) practices decide how well it ends.

## Hands-on Lab: Harden a Fresh VM and Prove It

Do this on a disposable Ubuntu Server VM you own. If you need one, follow [Virtual Machines -> Setting One Up](/en/page-3), then take a snapshot so you can roll back and repeat the lab from scratch.

1. **Measure the starting attack surface.** Before changing anything, record what is exposed so you have something to compare against:

```bash
sudo ss -tulpn > ~/baseline-ports.txt
systemctl list-units --type=service --state=running | tee ~/baseline-services.txt
```

2. **Patch, then lock down SSH.** Apply updates, edit `/etc/ssh/sshd_config` to set `PermitRootLogin no` and `PasswordAuthentication no`, then reload the daemon:

```bash
sudo apt update && sudo apt full-upgrade -y
sudo systemctl reload ssh
```

3. **Default-deny the firewall,** allowing only the port you actually serve:

```bash
sudo ufw default deny incoming
sudo ufw allow 22/tcp
sudo ufw enable
```

4. **Confirm enforcement and auditing are live:**

```bash
sudo aa-status | head
sudo systemctl enable --now auditd
```

5. **Prove the controls work.** From a second VM on the same host-only network, scan the target with [Nmap](/en/page-4) and compare the result against your baseline — every port you did not open should now show as filtered:

```bash
nmap -sV <target-ip>
```

6. **Watch the logs react.** Back on the target, follow authentication events, then trigger a failed SSH login from the second box:

```bash
sudo journalctl -u ssh -f
```

The rejected attempt should appear in real time. Finally, diff `ss -tulpn` against `baseline-ports.txt`: every entry that disappeared is a door you closed. Revert to the snapshot and try the steps in a different order to build intuition for what each control actually buys you.

## A Practical Baseline

For any system you are responsible for, get these in place before anything fancier:

1. **Patch on a schedule** and automate security updates.
2. **Enforce least privilege** — no daily use of root or Administrator, and MFA on remote access.
3. **Minimise exposure** — disable unused services, default-deny the firewall, encrypt disks.
4. **Enable MAC and kernel hardening** so a single bug does not mean full compromise.
5. **Log centrally and monitor integrity** so you detect intrusions early.
6. **Back up and test restores** — recovery is a security control, not just an IT chore.

Hardening is not a one-time project. Systems drift, new services get added, and fresh vulnerabilities appear weekly, so treat OS security as a habit you maintain rather than a box you tick. Pair it with secure application development, covered in [Secure Coding](/en/page-secure-coding), to protect the full stack.
