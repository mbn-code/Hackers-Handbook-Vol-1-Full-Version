---
title: Where to Start Hacking, Advanced Resources
description: Level up your ethical hacking skills on Hack The Box, TryHackMe, OverTheWire and VulnHub with legal, hands-on labs to practice pentesting safely.
layout: ../../layouts/MainLayout.astro
---

Reading about attacks only takes you so far. The skill lives in your hands, built by breaking, fixing, and breaking again in environments that are meant to be attacked. This page maps the best legal playgrounds for practising your craft and a realistic order to tackle them.

## Build the foundation first

Before you drop into a target, make sure the fundamentals are solid. You will move far faster once you are comfortable with [Networking](/en/page-networking), [Operating Systems](/en/page-2), and the [Linux Shell](/en/page-linux-shell). Almost every box you attack starts the same way: enumerate services, understand what is running, and only then look for a foothold. If `ssh`, `nc`, and reading a config file feel awkward, spend a week on the basics before chasing flags.

## Guided platforms for learning

If you want structure and hand-holding while you learn, start here.

### TryHackMe

[TryHackMe](https://tryhackme.com/) is the friendliest on-ramp in the field. Content is organised into "rooms" and longer learning paths that walk you from first principles through web exploitation, network security, and [forensics](/en/page-forensics). A browser-based attack machine means you can practise without configuring anything locally, which removes the usual setup friction for newcomers.

### PortSwigger Web Security Academy

The [Web Security Academy](https://portswigger.net/web-security) is free, maintained by the team behind Burp Suite, and the single best resource for [Web Hacking](/en/page-web-hacking). Each topic pairs a clear write-up with interactive labs covering [SQL injection](/en/page-sql-injection), access control flaws, SSRF, and more. Work through it alongside [Burp Suite](/en/page-burp-suite) and you will understand how the requests you intercept actually break an application.

## Challenge platforms and CTFs

Once the concepts click, prove them under pressure.

### Hack The Box

[Hack The Box](https://www.hackthebox.com/) offers a deep catalogue of vulnerable machines and [Capture The Flag challenges](/en/page-ctf-challenges), from the gentle "Starting Point" track to brutal retired boxes with full write-ups. It is the closest thing to a real penetration test you can practise legally, and the ranking system keeps you honest about your progress.

### OverTheWire

[OverTheWire](https://overthewire.org/wargames/) hosts wargames that teach security fundamentals through the command line. Begin with **Bandit**, which turns Linux navigation, file handling, and SSH into a series of puzzles. Each level hands you the password to the next:

```bash
# Start Bandit level 0 (password: bandit0)
ssh bandit0@bandit.labs.overthewire.org -p 2220
```

Finish Bandit and the shell stops feeling like a barrier and starts feeling like a tool.

### picoCTF

[picoCTF](https://picoctf.org/) is a beginner-oriented CTF run by Carnegie Mellon, with a permanently available practice archive spanning binary exploitation, cryptography, reverse engineering, and forensics. The challenges are approachable but genuinely teach the categories you will meet in competitive CTFs.

## Vulnerable machines to run locally

Cloud labs are convenient, but running targets on your own hardware teaches you how the whole environment fits together. Spin these up inside an isolated [Virtual Machine](/en/page-3) on a host-only network so nothing leaks onto your real LAN.

### VulnHub

[VulnHub](https://www.vulnhub.com/) is a library of intentionally vulnerable VM images you download and run offline. There is no scoreboard and no gamification, just realistic targets to enumerate and exploit at your own pace, which mirrors the messiness of real engagements.

### Metasploitable

Metasploitable is a deliberately broken Linux VM packed with outdated, exploitable services. It is the ideal sandbox for learning the [Metasploit Framework](/en/page-6) against a known-vulnerable target. Follow our [Metasploitable VM Setup](/en/page-metasploitable) guide to get it running, then start with a full port scan:

```bash
# Enumerate services on the target VM (use its real IP)
nmap -sV -sC 192.168.56.101
```

The results become your map of what to attack next. See [Nmap](/en/page-4) for how to read them.

## A realistic learning path

Skipping ahead wastes time. A path that actually sticks looks like this:

1. **Bandit on OverTheWire** to get fluent with the shell.
2. **A TryHackMe learning path** to build structured breadth.
3. **The Web Security Academy** to master web vulnerabilities with real tools.
4. **Metasploitable and VulnHub** locally to practise full enumeration and exploitation end to end.
5. **Hack The Box and picoCTF** to test yourself against harder, less guided targets.

Take notes as you go. The write-ups you produce now become the methodology you rely on later, and documenting your steps is exactly what a professional report demands.

## Stay legal, stay current

Every platform here gives you explicit permission to attack its machines. That permission is the entire point. [Ethical Hacking](/en/page-ethical-hacking) means you never run these techniques against a system you do not own or have written authorisation to test, and understanding the [legal and ethical boundaries](/en/page-legal-ethical) is not optional. Techniques and tooling shift constantly, so make a habit of following disclosures and research to [stay current](/en/page-stay-current). Pick the first item on the path above, and start today.
