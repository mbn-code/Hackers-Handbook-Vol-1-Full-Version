---
title: Port Scanning 
description: The process of probing a computer to find open doors and vulnerable services.
layout: ../../layouts/MainLayout.astro
---

# Port Scanning 

Imagine you are a burglar trying to break into an office building. You wouldn't just smash the front window; you'd walk around the building, jiggling every door handle and checking every window to see which ones were left unlocked.

**Port Scanning** is the digital equivalent of jiggling door handles.

In  [Networking](page-networking), every  [Host](page-host) has 65,535 virtual "ports". When a server wants to offer a service to the internet (like a website, email, or file sharing), it opens a specific port and listens for incoming connections. 

## Why We Scan Ports 

Hackers and security professionals use Port Scanning to map out the attack surface of a target. You can't attack a web server if port 80 (HTTP) isn't open!

The industry standard tool for this job is  [Nmap (Network Mapper)](page-4). 

## Types of Port Scans 

Port scanning relies on the rules of the TCP 3-Way Handshake (SYN -> SYN/ACK -> ACK). 

### 1. TCP Connect Scan (Full Scan)
The scanner completes the full 3-way handshake. If the target responds with a `SYN/ACK`, the port is open. The scanner then politely sends an `ACK` followed by an `RST` to tear down the connection.
- **Pros:** Very reliable. Doesn't require  [Root Access](page-root-access) to run.
- **Cons:** Very loud. Because a full connection is made, it will definitely be logged by the target's  [Firewall](page-firewall).

### 2. SYN Scan (Stealth Scan)
This is the default scan used by hackers. The scanner sends a `SYN` packet. If the target replies with `SYN/ACK` (meaning the port is open), the scanner immediately sends an `RST` (Reset) packet to drop the connection before the handshake finishes.
- **Pros:** Faster, and historically it bypassed many older firewalls because a full connection was never established.
- **Cons:** Requires root privileges to craft raw packets.

### 3. UDP Scanning
Not all services use TCP. Services like DNS and SNMP use UDP. UDP is "connectionless," meaning there is no handshake. Scanning UDP is notoriously difficult and slow because if a UDP port is open, it often doesn't reply at all!

## The Next Step: Enumeration 

Finding an open port is just step one. Once a port is found, the scanner performs **Service Enumeration**,sending specialized probes to figure out exactly what software (and what version) is running behind that port. If the scanner discovers an outdated version of Apache web server, the hacker can then look up an exploit for it!
