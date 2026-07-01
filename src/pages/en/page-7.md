---
title: Python & Scripting in Hacking
description: "Learn how Python and Bash scripting power ethical hacking: automate recon, parse scan output, sniff packets, and build your own custom security tools."
layout: ../../layouts/MainLayout.astro
---

If you keep typing the same commands or scrolling through thousands of lines of output hunting for one detail, it is time to script. Automation is the difference between running other people's tools and building your own.

Scripting is a foundational skill for anyone doing security work. It lets you chain tasks together, parse noisy output, probe [vulnerabilities](/en/page-vulnerability) at scale, and shape a tool to fit exactly the target in front of you. This chapter focuses on the two languages that carry most of that weight: Python and Bash.

## Why Learn to Script?

Tools like [Nmap](/en/page-4) and the [Metasploit Framework](/en/page-6) are powerful out of the box, but they can only do what their authors imagined. The moment you understand what those tools do under the hood, you stop being a "script kiddie" who only runs prepackaged exploits and start being someone who can adapt, extend, and troubleshoot on the fly.

A few reasons scripting pays off:

- **Automation.** Sweeping a whole network by hand takes hours. A script scans, filters the results, and writes a report while you do something else.
- **Customisation.** Real engagements are full of odd edge cases. When no existing tool fits, you write the one that does.
- **Data extraction.** Parsing a large export for hosts, tokens, or misconfigurations is trivial once you can slice text programmatically.
- **Reliability.** A saved script runs the same way every time, which matters when you need repeatable, documentable results for a client report.

## The Power of Python

**Python** is the default language of security tooling. It reads almost like pseudocode, ships on nearly every Linux distribution, and has a deep ecosystem of libraries for networking, parsing, and cryptography. Much of the tooling you will encounter, from [Nmap](/en/page-4) automation scripts to custom fuzzers, is written in it.

### A tiny port scanner

You do not need a framework to check which ports are open on a host you control. The standard-library `socket` module is enough:

```python
import socket

target = "127.0.0.1"   # only scan hosts you own or are authorised to test
for port in range(1, 1025):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.5)
    if s.connect_ex((target, port)) == 0:
        print(f"[+] Port {port} open")
    s.close()
```

This is the same idea behind [port scanning](/en/page-port-scanning), stripped to its essentials. Understanding it makes Nmap's flags far less mysterious.

### Inspecting traffic with Scapy

`Scapy` lets you craft, send, and read [packets](/en/page-packets) directly. Here it prints the source and destination of the first ten IP packets it sees, the building block of any [packet sniffing](/en/page-packet-sniffing) script:

```python
from scapy.all import sniff

def show(pkt):
    if pkt.haslayer("IP"):
        print(pkt["IP"].src, "->", pkt["IP"].dst)

sniff(prn=show, count=10)   # capturing traffic requires root and authorisation
```

### Web enumeration with requests

For [web hacking](/en/page-web-hacking) work against your own lab, `requests` handles HTTP without a browser. This checks a wordlist of paths and reports anything that is not a 404:

```python
import requests

base = "http://localhost:8000"
with open("wordlist.txt") as f:
    for word in f:
        path = word.strip()
        r = requests.get(f"{base}/{path}")
        if r.status_code != 404:
            print(f"[{r.status_code}] /{path}")
```

Add `BeautifulSoup` and you can pull links, forms, and comments out of the responses. The same request-loop pattern underpins credential testing in a [brute force attack](/en/page-brute-force-attack), which is exactly why rate limiting and account lockouts matter on the defensive side.

## Bash: Gluing Commands Together

Where Python shines at logic and parsing, **Bash** rules the command line. It is the language of the [Linux Shell](/en/page-linux-shell), and if you run Kali or Parrot you are already living in it. Any command you type by hand, `nmap`, `grep`, `curl`, can be dropped into a `.sh` file and run in sequence.

A quick host-discovery sweep across a subnet you are authorised to test:

```bash
#!/usr/bin/env bash
for ip in 192.168.1.{1..254}; do
  ping -c1 -W1 "$ip" &>/dev/null && echo "[+] $ip is up"
done
```

Bash is perfect for this kind of orchestration: loop over a list, call an existing tool, pipe the output into the next stage. When the logic gets branchy or you need structured data, hand off to Python. For a deeper treatment, see the dedicated guide on [Bash Scripting in Hacking](/en/page-bash).

## Scripting in Action: A Real Workflow

The two languages are strongest together. A typical reconnaissance-to-report pipeline looks like this:

1. **Discovery.** A Bash loop pings a range of [IP addresses](/en/page-ip) and collects the ones that respond.
2. **Scanning.** Those live hosts are piped into Nmap for a detailed service and version scan.
3. **Parsing.** A Python script reads the Nmap XML output (Nmap's `-oX` flag) and flags outdated or vulnerable service versions.
4. **Reporting.** The same script writes a clean HTML or Markdown summary for review.

A day of manual work collapses into a few minutes of waiting, and every run is consistent enough to document.

## Sharpen Your Fundamentals

Good hacking scripts lean on the same programming basics as any other software: clear variable names, error handling for hosts that time out, and readable structure. Those habits carry straight into [secure coding](/en/page-secure-coding), and understanding how attackers automate against an application is the fastest way to learn how to defend one.

## Hands-on Lab: Turn an Nmap Scan into a Report

This lab makes the pipeline above real. You will scan a target you control, then parse the results in Python, exactly as steps 3 and 4 describe. Use an isolated host-only network and a legal target such as [Metasploitable](/en/page-metasploitable).

1. **Set up.** Boot your Kali box and the target VM on the same host-only network. Confirm you can reach it, then note its address (here, `192.168.56.101`).

2. **Scan to XML.** Run a service-version scan with [Nmap](/en/page-4) and save the machine-readable output. The `-oX` flag is what makes the next step possible:

```bash
nmap -sV -oX scan.xml 192.168.56.101
```

3. **Parse it.** The standard-library `xml.etree.ElementTree` reads Nmap's XML with no extra installs. Save this as `parse.py`:

```python
import xml.etree.ElementTree as ET

tree = ET.parse("scan.xml")
for host in tree.findall("host"):
    addr = host.find("address").get("addr")
    for port in host.findall(".//port"):
        if port.find("state").get("state") != "open":
            continue
        svc = port.find("service")
        name = svc.get("name", "?") if svc is not None else "?"
        product = svc.get("product", "") if svc is not None else ""
        version = svc.get("version", "") if svc is not None else ""
        print(f"{addr}:{port.get('portid')} {name} {product} {version}".strip())
```

4. **Run and read.** `python3 parse.py` prints one clean line per open port. Now extend it: flag any version string that looks outdated, or have it emit Markdown instead of plain text, and you have the reporting stage of a real recon tool.

Every service that shows up here is a lead for the rest of your testing, mapped straight from raw XML to something you can act on, no copy-pasting from a terminal required.

## The Ethical Bottom Line

Writing a script that touches a system is easy. Facing the legal fallout of pointing it at something you do not own is not. Everything here is meant for systems you control or have written permission to test, and the [Legal and Ethical Considerations in Hacking](/en/page-legal-ethical) chapter spells out where those lines sit.

Practice in a place built for it: a personal virtual machine, an intentionally vulnerable target, or a [Capture The Flag (CTF)](/en/page-ctf-challenges) event. Build there, break there, and keep your skills on the right side of the line. Happy scripting.
