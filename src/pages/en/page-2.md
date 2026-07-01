---
title: Getting Cozy with Operating Systems
description: Learn how operating systems work — kernel, processes, permissions, and file systems — and why Linux, Windows, and macOS fluency is core to ethical hacking.
layout: ../../layouts/MainLayout.astro
---

Almost every attack and every defence you will ever study happens inside an operating system. Before you touch a single tool, you need a working mental model of what the OS is actually doing under your hands — because that model is what turns commands into understanding.

## What an operating system actually does

An operating system (OS) is the software layer that sits between your hardware and everything else. It manages five things you will keep bumping into throughout this handbook:

- **The kernel** — the privileged core that talks directly to the CPU, memory, and devices. Everything else asks the kernel for resources through _system calls_.
- **Processes** — running programs, each with its own memory and an owner. Isolation between processes is a security boundary; breaking it is often the whole point of an exploit.
- **Memory** — the OS decides which process can read or write which regions of RAM. Many classic vulnerabilities (buffer overflows, use-after-free) are really about violating those rules.
- **The file system** — how data is named, stored, and permissioned on disk.
- **The network stack** — how packets get in and out. See [Networking](/en/page-networking) and [packets](/en/page-packets) for the layer above this.

The key idea: code runs in either **user space** (restricted) or **kernel space** (fully privileged). A huge amount of offensive and defensive work comes down to whether an attacker can cross from one to the other.

## Why this matters to a hacker

Tools like [Nmap](/en/page-4) or [Metasploit](/en/page-6) are only useful if you understand the system they touch. Privilege escalation, persistence, and lateral movement are all descriptions of _what happens to an OS_. When you know how users, permissions, and processes fit together, a scan result stops being a wall of text and starts telling you a story.

Comfort with operating systems also makes you self-sufficient. You will read logs, diagnose why a payload failed, and spot the difference between a misconfiguration and a genuine [vulnerability](/en/page-vulnerability) — instead of guessing.

## Linux: the pentester's home turf

Most security tooling is built for Linux first, and distributions like **Kali Linux** and **Parrot OS** ship hundreds of tools preinstalled. Learning Linux is not optional in this field; it is the environment where you will spend most of your time.

Linux follows a simple philosophy — _almost everything is a file_, including devices and running processes. Get fluent with the [Linux shell](/en/page-linux-shell), and you can inspect the whole system with a handful of commands:

```bash
uname -a            # kernel version and CPU architecture
whoami              # who am I running as
id                  # user and group IDs (uid=0 means root)
ps aux              # every running process and its owner
ss -tulpn           # listening TCP/UDP ports (modern replacement for netstat)
ls -l /etc/passwd   # read the permissions on a file
```

You install and update these tools with a package manager. On Debian-based systems like Kali, that is [apt](/en/page-apt-package-manager):

```bash
sudo apt update && sudo apt install nmap
```

## Windows: the biggest attack surface

The majority of corporate desktops and a large share of servers run Windows, which makes it the single most-targeted platform in the real world. If you plan to test enterprise environments, you cannot skip it — Active Directory, NTLM, and Windows services are the backbone of most internal networks.

Windows exposes its own powerful shell, **PowerShell**, and the same investigative instincts carry over:

```powershell
Get-ComputerInfo                     # OS build and hardware summary
whoami /priv                         # your account's privileges and tokens
Get-Process                          # running processes
Get-NetTCPConnection -State Listen   # listening ports
```

## macOS and the wider Unix family

macOS is built on a Unix core, so much of your Linux muscle memory transfers straight over — the terminal, `ls`, `ps`, and file permissions all behave similarly. The BSD systems share that lineage too. Learning one Unix-like OS well means you are already most of the way to reading the others.

## The pieces worth mastering first

### Users, permissions, and privilege

Every file and process has an owner and a set of permissions. On Unix-like systems you will constantly read and change them:

```bash
chmod 600 secret.key    # owner read/write only
sudo systemctl restart ssh   # run a command with elevated rights
```

The superuser account (`root` on Linux, `Administrator`/`SYSTEM` on Windows) can do almost anything. Understanding how privilege is granted and revoked is central to both attack and defence — dig into [Root Access](/en/page-root-access) and [Operating System Security](/en/page-os-security) for the full picture.

### Processes and services

Malware, backdoors, and running exploits all appear as processes. Being able to list, inspect, and kill them — and to recognise what _should_ be running — is a core forensic and defensive skill.

### The file system and logs

Configuration lives in files, and so does evidence. Knowing where an OS stores logs and credentials is what lets a defender detect an intrusion and an authorised tester document their findings.

## Build a lab and start poking

You should never learn this on systems you do not own. The right move is to build a safe playground: spin up a Linux and a Windows install inside [virtual machines](/en/page-3) so you can break things, snapshot, and roll back without risk. Check your [hardware](/en/page-hardware) can spare the RAM and CPU first, then get hands-on — reading about an OS teaches you far less than living inside one.
