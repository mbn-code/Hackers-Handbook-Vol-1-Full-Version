---
title: Introduction
description: Start your ethical hacking journey here. Learn what real hacking is, how penetration testing works, and how to build skills legally and effectively.
layout: ../../layouts/MainLayout.astro
---

Welcome to _Hackers Handbook Vol. 1_, a free, hands-on guide to ethical hacking and defensive security. This chapter sets the ground rules, clears up the myths, and points you toward a learning path you can actually follow.

## Who This Is For

Whether you are opening a terminal for the first time or you already script your way through problems, this handbook meets you where you are. Beginners get plain-language explanations and safe practice environments. More experienced readers get concrete tooling, workflows, and pointers to deeper material.

One rule underpins everything that follows: **only test systems you own or have explicit written permission to assess.** The techniques here are for learning, authorised testing, and defence. Using them against systems you do not control is unauthorised access and a crime in most jurisdictions. If you want the specifics, read [Legal and Ethical Considerations in Hacking](/en/page-legal-ethical) before you go further.

## The Real Deal About Hacking

Forget the Hollywood version. There is no neon-green text raining down a black screen, and nobody breaks into a bank in twelve seconds. Real hacking is closer to reverse-engineering a puzzle box you have never seen: you probe, observe, form a theory, test it, and repeat until something gives.

The work rewards three habits above all:

- **Patience** — most of the time, the first ten things you try will not work.
- **Curiosity** — you have to genuinely want to know how a system fits together.
- **Rigour** — good hackers document what they did so it can be reproduced and, ideally, fixed.

That last point matters. [Ethical hacking](/en/page-ethical-hacking) is not about breaking things for a rush; it is about finding weaknesses before an attacker does, then helping close them.

## What Is Penetration Testing?

Penetration testing (pen testing) is a controlled, authorised simulation of a real attack against a system, network, or application. A tester acts like an adversary, but within an agreed scope and with a clear goal: find the security flaws that matter and report them so they can be fixed.

A typical engagement moves through recognisable phases:

1. **Reconnaissance** — gather information about the target's exposed footprint.
2. **Scanning and enumeration** — map live hosts, open ports, and running services, often with [Nmap](/en/page-4).
3. **Exploitation** — attempt to leverage a [vulnerability](/en/page-vulnerability) to gain access, frequently using a framework like [Metasploit](/en/page-6).
4. **Post-exploitation** — assess what an attacker could actually reach or steal.
5. **Reporting** — document findings, business impact, and remediation advice.

The deliverable is not a trophy; it is a report an organisation can act on. That is the difference between a penetration test and a plain intrusion.

## How to Get Started

Getting into security can feel overwhelming because the field is enormous. The trick is to pick one path, go deep enough to stay motivated, then branch out. Start by noticing how you actually learn best.

### Learn by Watching

If you absorb ideas visually, lean on video walkthroughs and diagrams. Seeing a tool run end to end helps you connect commands to outcomes without stopping to look up every term. The [Metasploit Video Examples](/en/page-metasploitVideoExample) are a good way to watch a workflow before you try it yourself.

### Learn by Reading

Text lets you move at your own pace, reread the tricky parts, and take notes you can return to. Written references are also easier to search when you are mid-task and just need the right flag or syntax. Most of this handbook is built for exactly that kind of study.

### Learn by Doing

Nothing sticks until you break something in a lab you own. Set up a safe environment with [Virtual Machines](/en/page-3) and a deliberately vulnerable target such as [Metasploitable](/en/page-metasploitable), then experiment freely. Errors are not failures here — a confusing result is usually the fastest route to understanding what a system really does.

## Build Your Foundation First

Tools are only as useful as the fundamentals underneath them. Before chasing exploits, get comfortable with the basics that everything else depends on:

- **Operating systems** — spend real time in [the Linux shell](/en/page-linux-shell), since most security tooling lives there.
- **Networking** — understand how [networking](/en/page-networking) and [IP addresses](/en/page-ip) work, because attacks travel over the wire.
- **Scripting** — a little [Python](/en/page-7) goes a long way for automating the repetitive parts.

These are not detours. Every advanced topic in this book assumes you can navigate a shell, reason about network traffic, and glue steps together with a script.

## Your Journey Begins

Set up a lab, keep everything you do inside your own scope, and treat each broken assumption as a lesson. Start with the fundamentals, then let curiosity pull you toward the topics that grab you.

Turn the page and start building. The digital world is far more interesting once you understand how it holds together.
