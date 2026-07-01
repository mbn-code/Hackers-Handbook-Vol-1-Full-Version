---
title: Virtual Machines -> Setting One Up
description: "Build a safe, isolated hacking lab: install a hypervisor, create VirtualBox VMs, configure host-only networking, and use snapshots to practice without risk."
layout: ../../layouts/MainLayout.astro
---

A virtual machine (VM) is a full computer running as software inside your real one. For anyone learning security, that isolation is the whole point: you can attack, break, and infect a VM, then roll it back to a clean state in seconds without touching your actual system.

## What a Virtual Machine Actually Is

A VM emulates hardware — CPU, memory, disk, network card — so a _guest_ operating system believes it is running on its own physical box. The software that creates and manages VMs is a **hypervisor**. Yours runs on top of your normal OS, which makes it a **type-2 hypervisor** (VirtualBox, VMware Workstation). The kind that runs directly on server hardware, like ESXi or the core of Hyper-V, is **type-1**.

Because the guest is sandboxed from your _host_, it is the standard way to run tools and targets you would never want loose on your daily machine:

- A dedicated attacker OS such as Kali or Parrot, kept separate from your personal files.
- Deliberately vulnerable targets like [Metasploitable](/en/page-metasploitable) to practice against legally.
- Suspicious binaries you want to observe safely, without risking your real files.

A VM only borrows resources from the host, so its speed is capped by your real CPU cores, RAM, and disk. Enable hardware virtualization (Intel VT-x or AMD-V) in your firmware/BIOS if VMs run slowly or 64-bit guests refuse to boot.

## Choosing a Hypervisor

**VirtualBox** (Oracle, GPL) is the usual first choice: free, cross-platform, and beginner-friendly. This guide uses it. Its optional Extension Pack adds USB 3.0 and other features — free for personal/educational use under a separate licence.

A few alternatives worth knowing:

- **VMware Workstation Pro** — became free for personal use in 2024; smoother graphics and snapshots.
- **Hyper-V** — built into Windows Pro/Enterprise. Note that Hyper-V and WSL2 can clash with VirtualBox; recent VirtualBox versions coexist but may run slower when Hyper-V is enabled.
- **UTM / QEMU** — the practical route on Apple Silicon (M-series) Macs, where x86 guests must be emulated rather than run natively.

If you are choosing which guest OS to install first, a beginner-friendly Linux distribution makes the smoothest starting point.

## Creating Your First VM in VirtualBox

The wizard walks you through five decisions:

1. **Name and OS type.** Naming the VM after the OS lets VirtualBox pick sensible defaults.
2. **Memory.** 2–4 GB is fine for most Linux guests; never assign more than about half your host RAM.
3. **CPUs.** Two virtual cores is a comfortable start. Leave cores for the host.
4. **Virtual disk.** Choose _dynamically allocated_ VDI so the file grows only as it fills — 25–40 GB is plenty for a lab guest.
5. **Installation media.** Attach the OS's `.iso` to the virtual optical drive, then boot the VM to run its installer.

### Install the Guest Additions

After the OS is installed, add the **Guest Additions** (Devices -> Insert Guest Additions CD Image). They enable a shared clipboard, drag-and-drop, automatic screen resizing, and much better graphics performance. It is the single upgrade that makes a VM feel usable day to day.

### Snapshots Are Your Undo Button

Before you install a payload, run an exploit, or change something risky, take a snapshot. A snapshot freezes the VM's entire disk and memory state so you can restore it instantly afterward.

```bash
# Snapshot a running or stopped VM
VBoxManage snapshot "Kali" take clean-baseline --description "Fresh install, tools updated"

# List snapshots, then roll back to the baseline
VBoxManage snapshot "Kali" list
VBoxManage snapshot "Kali" restore clean-baseline
```

Take a "clean baseline" snapshot right after installing and updating each VM. Every messy experiment then costs you nothing to undo.

## Networking: Keep the Lab Contained

VirtualBox's network mode decides what a VM can reach, and getting it right is central to safe, legal practice. Understanding the basics of [Networking](/en/page-networking) first will make these choices obvious.

- **NAT** (default) — the VM reaches the internet through the host but is hidden from your LAN. Good for updates and downloads.
- **Bridged** — the VM appears as a real device on your physical network with its own IP address. Convenient, but it exposes the guest to (and from) your whole network.
- **Host-Only** — a private network shared only between the host and its VMs, with no internet access.
- **Internal** — an isolated segment between VMs only; the host cannot even see it.

For a hacking lab, the safe pattern is to put your attacker VM and your vulnerable target VM on the **same host-only or internal network** and keep bridged mode off. That way exploits, brute-force attempts, and scans with [Nmap](/en/page-4) or the [Metasploit Framework](/en/page-6) stay sealed inside your lab.

```bash
# Create an isolated host-only network and attach a VM to it
VBoxManage hostonlyif create
VBoxManage modifyvm "Metasploitable" --nic1 hostonly --hostonlyadapter1 vboxnet0
```

**Only attack machines you own or are explicitly authorised to test.** An isolated VM network gives you a full, realistic environment without ever touching someone else's system — the core principle behind [Ethical Hacking](/en/page-ethical-hacking).

## Where to Go From Here

With a hypervisor installed, a clean-baseline snapshot saved, and an isolated network wired up, you have a repeatable lab. Spin up an attacker and a target, break things, restore, and repeat. When you are ready to point real tools at a real (but consenting) target, continue with the [Metasploitable VM Setup](/en/page-metasploitable).
