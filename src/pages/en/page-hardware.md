---
title: Computer Hardware
description: How CPUs, GPUs, RAM, storage, and motherboards work, and why hardware matters for password cracking, memory forensics, and firmware-level attacks.
layout: ../../layouts/MainLayout.astro
---

Software runs on metal. To reason about performance, forensics, or firmware-level attacks, you need a working mental model of the physical components underneath the operating system. This page maps the core parts of a computer to the security tasks that depend on them.

Whether you are sizing a machine to run several [virtual machines](/en/page-3) at once or examining a device for physical weaknesses, these fundamentals pay off constantly.

## CPU: The Central Processing Unit

The CPU executes the instructions that make up every program. Three properties matter most in practice:

- **Cores and threads.** A modern CPU packs several independent cores, and simultaneous multithreading (Intel calls it Hyper-Threading, AMD calls it SMT) lets each core juggle two instruction streams. More cores means more VMs, faster compiles, and more parallel scans.
- **Clock speed.** Measured in gigahertz (GHz), this is how many cycles a core runs per second. Higher is faster per-thread, but core count usually matters more for security workloads that parallelise well.
- **Architecture.** x86-64 dominates desktops and servers; ARM (Apple Silicon, most phones, and a growing share of cloud instances) is everywhere else. Some exploits and payloads are architecture-specific, so know what you are targeting.

On Linux you can inspect the CPU directly:

```bash
lscpu                    # architecture, cores, threads, flags
grep -c ^processor /proc/cpuinfo   # logical CPU count
```

## GPU: The Graphics Processing Unit

Originally built to render graphics, the GPU became a workhorse for security because of how it is designed. Where a CPU has a handful of fast, flexible cores, a GPU has thousands of small cores that do the same math in parallel.

That makes GPUs dramatically faster at computing hashes, which is exactly what you need for offline password recovery. Hashcat and John the Ripper offload cracking to the GPU and try candidate passwords against a captured hash far faster than any CPU. This is the engine behind most practical [brute-force and dictionary attacks](/en/page-brute-force-attack).

```bash
# Benchmark GPU cracking speed against a hash type (e.g. NTLM = mode 1000)
hashcat -b -m 1000
```

The defensive lesson is direct: because GPUs make guessing cheap, slow, salted hashing algorithms such as bcrypt, scrypt, and Argon2 exist specifically to blunt this hardware advantage. Fast hashes like raw MD5 or SHA-1 fall in seconds.

## RAM: Random Access Memory

RAM is fast, volatile short-term memory. When you launch a program, the [operating system](/en/page-2) loads it from slow storage into RAM so the CPU can reach it in nanoseconds. Cut the power and RAM's contents are gone.

That volatility is why RAM is a forensic goldmine. A live memory capture from a running machine can contain plaintext passwords, decryption keys, chat fragments, network connections, and malware that never touches disk. In [digital forensics](/en/page-forensics), the ordering rule is "collect the most volatile evidence first," and memory sits near the top.

- **Acquisition:** tools like `avml` (Linux), WinPmem/DumpIt (Windows), or a hypervisor snapshot produce a raw memory image.
- **Analysis:** Volatility 3 parses that image to list processes, open sockets, injected code, and recoverable keys.

For an attacker with physical access, cold-boot attacks exploit the fact that RAM contents fade slowly after power loss, sometimes long enough to recover encryption keys. Full-disk encryption that keeps keys in the CPU rather than DRAM is one countermeasure.

## Storage: HDDs and SSDs

Storage is the long-term, non-volatile home for data.

- **HDD (hard disk drive):** mechanical platters and a moving read/write head. Cheap per terabyte, slow, and recoverable in surprising ways because deleting a file usually just unlinks it.
- **SSD (solid-state drive):** flash memory, no moving parts, far faster. SSDs complicate forensics: the TRIM command and wear-levelling can wipe or relocate "deleted" blocks in the background, so recovery is less reliable than on spinning disks.

Storage is where the sensitive data lives, so understanding file systems is essential for finding artefacts, hidden files, and deleted data. Know the common ones: NTFS on Windows, ext4 on most Linux systems, APFS on macOS.

```bash
lsblk -f     # list block devices with filesystems and mount points
```

## The Motherboard and Firmware

The motherboard is the printed circuit board that wires everything together. Buses and PCIe lanes carry data between the CPU, RAM, and slots where the GPU, network cards, and NVMe drives connect.

The security-relevant part is the firmware. Before any operating system loads, the motherboard's UEFI firmware (the modern replacement for legacy BIOS) initialises hardware and hands off to a bootloader. Because it runs first and lives below the OS, firmware is a prized target: a [rootkit](/en/page-rootkit) planted in UEFI or in a device's option ROM can survive OS reinstalls and even drive swaps. Secure Boot and measured boot with a TPM exist to detect and block exactly this kind of tampering.

## When Hardware Is the Attack Surface

Many advanced attacks bypass software defences by going after the silicon itself:

- **Side-channel attacks** infer secrets from physical behaviour rather than breaking crypto directly. Timing, power draw, and electromagnetic emissions can all leak key material; Spectre and Meltdown showed that CPU speculative execution could leak memory across boundaries.
- **Rowhammer** flips bits in DRAM by hammering adjacent memory rows, corrupting data an attacker was never authorised to touch.
- **DMA attacks** abuse high-speed ports (Thunderbolt, PCIe) that grant direct memory access, letting a malicious peripheral read RAM without the CPU's involvement. Kernel DMA protection and IOMMU settings mitigate this.

You do not need to weaponise any of these to be a competent tester, but knowing they exist changes how you assess a device. Physical access and firmware trust are part of the [operating system](/en/page-2) and forensic threat model, not an afterthought. Treat every technique here as something to understand and defend, and only ever test hardware you own or are explicitly authorised to assess.
