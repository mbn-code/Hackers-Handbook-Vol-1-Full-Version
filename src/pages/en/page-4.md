---
title: Nmap, Network Mapper
description: "Master Nmap for host discovery and port scanning: install it, run SYN and UDP scans, fingerprint OS and services, and use NSE scripts responsibly."
layout: ../../layouts/MainLayout.astro
---

Nmap (Network Mapper) is the reference tool for discovering what is alive on a network and what those hosts are running. It is free, open source, and the first thing most defenders and testers reach for when they need to map an environment.

<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/nmap-walkthrough-poster.png">
    <source src="/en/videos/nmap-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/nmap-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>A live <code>nmap</code> service-, OS-, and vulnerability-scan against an authorised lab host.</figcaption>
</figure>

## What Nmap Does

Nmap sends carefully crafted [packets](/en/page-packets) to one or more hosts and interprets the replies. From those responses it can tell you which machines are up, which TCP and UDP ports are open, what services (and often what versions) are listening, and frequently which operating system a host is running. In short, it turns a vague range of [IP addresses](/en/page-ip) into a concrete inventory.

Under the hood, the core activity is [port scanning](/en/page-port-scanning): probing ports and classifying each as open, closed, or filtered based on how the target answers.

## Scan Responsibly

Scanning networks you own or have written permission to test is normal, legitimate security work. Scanning systems you do not control is a different matter. In many jurisdictions unauthorised scanning is illegal, and most ISPs and cloud providers treat aggressive scanning of third parties as an abuse-policy violation. Before you run a single command against a target that is not yours, get explicit, written authorisation and stay inside the agreed scope.

To practise legally, use lab targets you set up yourself or the official host `scanme.nmap.org`, which the Nmap project provides for light testing. Read its rules first and do not hammer it.

## Installing Nmap

Kali Linux and ParrotOS ship with Nmap pre-installed. On other Debian and Ubuntu systems, install it through the [APT package manager](/en/page-apt-package-manager) (a common setup inside a [virtual machine](/en/page-3)):

```bash
sudo apt update
sudo apt install nmap -y
```

Confirm the install and check your version:

```bash
nmap --version
```

## Understand the Basics First

Nmap output makes far more sense once you are comfortable with a few fundamentals: what [localhost](/en/page-localhost) and loopback mean, how [IP addresses](/en/page-ip) and subnets work, and the general shape of TCP/IP [networking](/en/page-networking). If those are shaky, skim those pages before going deep here.

## Command Structure

An Nmap command is built from three parts: scan type, options, and one or more targets.

```bash
nmap [scan type] [options] <target>
```

Targets can be a single host, a hostname, a CIDR range, or a mix:

```bash
nmap 192.168.1.10
nmap scanme.nmap.org
nmap 192.168.1.0/24
```

## Core Scan Types

You rarely need every flag, but these are the ones you will use constantly.

### Host discovery

`-sn` performs a ping sweep only: it finds live hosts without scanning their ports. Perfect for a quick map of a subnet.

```bash
sudo nmap -sn 192.168.1.0/24
```

### TCP SYN scan

`-sS` is the default when you run as root. It sends a SYN and reads the reply without completing the handshake, which is fast and relatively quiet. Without root privileges, Nmap falls back to a full-connect scan.

```bash
sudo nmap -sS 192.168.1.10
```

### TCP connect scan

`-sT` completes the full TCP handshake. It needs no special privileges but is louder and slower, so it is the fallback rather than the first choice.

### UDP scan

`-sU` probes UDP services such as DNS, SNMP, and DHCP. UDP scanning is slow and easy to misread: open ports often stay silent, so Nmap marks them `open|filtered`, while closed ports reply with rate-limited ICMP errors that drag the scan out. Skip it, though, and real services stay invisible.

```bash
sudo nmap -sU --top-ports 100 192.168.1.10
```

## Useful Options

- `-p-` scans all 65,535 TCP ports; `-p 80,443,8080` targets specific ones; `--top-ports 100` covers the most common.
- `-sV` fingerprints service and version details on open ports.
- `-O` attempts OS detection from the host's TCP/IP stack behaviour.
- `-A` bundles OS detection, version detection, default scripts, and traceroute into one aggressive scan. It is loud and obvious on the wire.
- `-Pn` skips host discovery and treats every target as up. Use it when a [firewall](/en/page-firewall) drops pings but the host is really there.
- `-n` disables reverse DNS lookups, which noticeably speeds up large sweeps.
- `-T0` through `-T5` set timing, from paranoid and slow to insane and fast. `-T4` is a sensible default on a reliable network.
- `-v` (or `-vv`) increases verbosity so you see results as they arrive.

## Practical Examples

Replace targets with hosts you are authorised to scan.

A thorough scan of one host with service and OS detection:

```bash
sudo nmap -A -T4 scanme.nmap.org
```

Every TCP and UDP port on a host (expect this to take a while):

```bash
sudo nmap -n -Pn -sS -sU -p- 192.168.1.10
```

A fast live-host sweep across a subnet with no DNS resolution:

```bash
sudo nmap -sn -n 192.168.1.0/24
```

Version detection on a focused set of ports:

```bash
nmap -sV -p 22,80,443 192.168.1.10
```

## The Nmap Scripting Engine

The Nmap Scripting Engine (NSE) extends Nmap with Lua scripts that automate tasks such as deeper service enumeration, misconfiguration checks, and known-[vulnerability](/en/page-vulnerability) detection. Scripts are grouped into categories like `default`, `safe`, `auth`, and `vuln`.

Run the default script set with `-sC`, or call categories and scripts by name:

```bash
nmap -sC 192.168.1.10
nmap --script vuln 192.168.1.10
nmap --script http-title -p 80,443 192.168.1.10
```

Treat script names ending in `vuln`, `brute`, or `dos` with care: some are intrusive and should only run against systems you own or are contracted to test.

## Saving Your Results

For anything beyond a quick look, save output so you can compare scans over time and feed the data into other tools.

```bash
nmap -A -oA scan_results 192.168.1.10
```

`-oA` writes three files at once: normal (`.nmap`), grepable (`.gnmap`), and XML (`.xml`). The XML output in particular imports cleanly into reporting and exploitation workflows.

## How Defenders Spot a Scan

Everything Nmap does leaves a footprint, and the blue team is watching for exactly the patterns you generate. A single source touching dozens of ports in a few seconds, a burst of half-open SYNs that never complete a handshake, or probes to ports nothing should be listening on all stand out in flow logs and IDS alerts.

Intrusion-detection systems are the front line. Snort's `port_scan` inspector and equivalent Suricata rules track how many distinct ports or hosts a single source hits inside a time window, then fire once you cross a threshold. That is why aggressive timing (`-T4`, `-T5`) and `-A` light up dashboards, while slow, targeted scans stay quieter, though "quieter" is never "invisible."

On the host side, connections land in firewall and service logs. A defender can rate-limit new connections so a fast sweep throttles itself, for example with the iptables `recent` module:

```bash
sudo iptables -A INPUT -p tcp --syn -m recent --name portscan --set
sudo iptables -A INPUT -p tcp --syn -m recent --name portscan --update --seconds 10 --hitcount 20 -j DROP
```

Beyond detection, good prevention shrinks what a scan can even see: close unused ports, put services behind a [firewall](/en/page-firewall) that drops rather than rejects packets, and segment the network so one foothold cannot enumerate everything. Some teams also deploy honeypots or tarpits that feed scanners fake open ports and waste their time.

This knowledge cuts both ways. On an authorised engagement, knowing which of your scans trip alarms tells you how loud you are being; from the [blue team](/en/page-red-blue-teams) chair, the same insight drives detection tuning and [incident response](/en/page-incident-response).

## Reference and Next Steps

The manual is exhaustive and worth browsing:

```bash
man nmap
```

Nmap tells you where the doors are; the next stage is deciding which ones matter. Once you can reliably map hosts, ports, and versions, that inventory becomes the starting point for validating findings with a tool like the [Metasploit Framework](/en/page-6).
