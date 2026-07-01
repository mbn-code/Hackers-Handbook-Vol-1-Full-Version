---
title: Port Scanning
description: Learn how port scanning maps a target's open services, the difference between TCP connect, SYN, and UDP scans, and how defenders detect it.
layout: ../../layouts/MainLayout.astro
---

Port scanning is how you discover which network services a machine is actually offering. Send the right probe to each port, read the reply, and you build a map of the target's attack surface before you touch a single exploit.


<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/nmap-walkthrough-poster.png">
    <source src="/en/videos/nmap-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/nmap-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>Port and service discovery in action with <code>nmap</code> against a lab host.</figcaption>
</figure>

## Ports in One Minute

Every reachable [host](/en/page-host) exposes up to 65,535 TCP ports and another 65,535 UDP ports. A service "listens" on a port and waits for connections: web servers usually sit on TCP 443 (HTTPS) and 80 (HTTP), SSH on 22, SMTP on 25, DNS on UDP 53. A port is in one of three states that matter to a scanner:

- **Open** — a service is listening and accepting connections.
- **Closed** — nothing is listening, but the host is up and replying.
- **Filtered** — a [firewall](/en/page-firewall) or packet filter dropped the probe, so you get no clear answer.

If you're fuzzy on ports, addressing, or the TCP handshake, the [Networking](/en/page-networking) and [IP Addresses](/en/page-ip) pages cover the fundamentals.

## Why Scan Ports

During an authorised assessment, port scanning is the first real reconnaissance step. You cannot test a web application if TCP 443 is closed, and you shouldn't waste time on exploits for services that aren't running. Scanning tells you what's exposed, what version it's running, and where to focus. Blue teams run the exact same scans against their own ranges to catch services that were never meant to face the internet.

Only scan systems you own or have explicit written permission to test. Unauthorised scanning of third-party networks is unlawful in many jurisdictions and is often the first event that lands in an incident report.

The standard tool for the job is [Nmap](/en/page-4). It's fast, scriptable, and the reference implementation most other scanners are measured against.

## Types of Port Scans

TCP scans exploit the rules of the three-way handshake: `SYN` → `SYN/ACK` → `ACK`. How much of that exchange a scan completes determines its speed, reliability, and how loud it is.

### TCP Connect Scan

The scanner asks the operating system to open a full connection, completing the whole handshake. A returned `SYN/ACK` means the port is open; the OS then tears the connection down. This is the default when you can't send raw packets.

- **Pros:** Reliable and needs no special privileges — it uses the normal `connect()` system call, so no [root access](/en/page-root-access) required.
- **Cons:** Loud. A completed connection is almost always logged by the service and any monitoring in place.

```bash
# Full TCP connect scan of common ports
nmap -sT scanme.nmap.org
```

### SYN Scan (Half-Open)

Nmap's default when run as root. The scanner sends a `SYN`, and if the target replies `SYN/ACK`, it answers with an `RST` to abort before the handshake finishes. The connection is never fully established, so many applications never log it.

- **Pros:** Fast, and quieter than a connect scan.
- **Cons:** Requires privileges to craft raw packets. Modern stateful firewalls and IDS still detect it easily — "stealth" is relative, not guaranteed.

```bash
# SYN scan of the top 1000 ports (needs root/sudo)
sudo nmap -sS 192.0.2.10
```

### UDP Scanning

Services like DNS, SNMP, and DHCP run over UDP, which is connectionless — there's no handshake. An open UDP port often stays silent, while a closed one replies with an ICMP "port unreachable." Because the scanner mostly infers state from missing replies and must wait out timeouts, UDP scans are slow and prone to false "open|filtered" results.

```bash
# UDP scan of specific service ports
sudo nmap -sU -p 53,161,123 192.0.2.10
```

### Other Probe Types

FIN, NULL, and Xmas scans send unusual flag combinations to tease a response out of hosts that follow the older TCP spec strictly. They're situational and unreliable against modern Windows stacks, but occasionally slip past a simple filter that only tracks `SYN` packets.

## From Open Ports to Enumeration

An open port is only the beginning. **Service enumeration** figures out what's actually running behind it. Nmap's `-sV` flag sends targeted probes and matches the responses against a signature database to identify the software and version; `-O` attempts OS fingerprinting; `-sC` runs default NSE scripts that pull banners, check for weak configs, and flag known issues.

```bash
# Service/version detection, OS guess, and default scripts
sudo nmap -sV -O -sC -p- 192.0.2.10
```

That version string is the pivot point. An outdated service maps to a known [vulnerability](/en/page-vulnerability), which maps to an exploit you can validate — often through the [Metasploit Framework](/en/page-6). Enumeration is where a flat list of open ports becomes a real plan of attack.

## Detecting and Slowing Scans

Defenders aren't blind to this. A burst of connection attempts across sequential ports is an obvious signature, and modern defences respond in several ways:

- **Firewalls** drop or rate-limit probes so most ports come back _filtered_ instead of _closed_, denying the scanner clean information.
- **Intrusion detection systems** flag the timing and volume of connections that reach many ports from one source.
- **Rate limiting and tarpitting** deliberately slow responses so a full scan takes impractically long.

Attackers push back by scanning slowly (`nmap -T2`), spreading probes over time, or fragmenting packets — but every one of those techniques trades speed for stealth, and a well-tuned monitoring stack still catches them. If you defend networks, treat scan detection as early warning: it's frequently the first observable step of an intrusion. Pair it with the practices on the [Firewall](/en/page-firewall) and [Networking](/en/page-networking) pages to shrink what a scanner can see in the first place.
