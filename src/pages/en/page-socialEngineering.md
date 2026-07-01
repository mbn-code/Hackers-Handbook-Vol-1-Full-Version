---
title: Social Engineering
description: Social engineering exploits human psychology, not code. Learn phishing, pretexting, baiting, tailgating, and how to defend against manipulation attacks.
layout: ../../layouts/MainLayout.astro
---

Why spend weeks cracking encryption when you can convince someone to hold the door? Social engineering is the practice of manipulating people into revealing information or granting access they otherwise would not. It targets trust, habit, and emotion rather than software, and it remains one of the most reliable ways attackers breach organisations.

This chapter explains how these attacks work so you can recognise and defend against them during authorised security assessments and in daily operations. Use it to build awareness and test your own organisation with permission, never to deceive people or systems you are not cleared to assess.

## Why the Human Is the Target

Firewalls, patched software, and strong authentication have raised the cost of purely technical attacks. Attackers respond by aiming at the one component you cannot patch: the person with legitimate access. A well-crafted request that triggers urgency, authority, fear, or curiosity can bypass controls that took an entire team to build.

Most social engineering leans on a handful of psychological levers:

- **Authority** — people comply with requests that appear to come from a boss, an executive, or IT.
- **Urgency and scarcity** — a ticking deadline discourages the victim from stopping to verify.
- **Trust and familiarity** — impersonating a known vendor, colleague, or brand lowers suspicion.
- **Reciprocity** — a small favour makes the target feel obliged to return one.

## Core Techniques

### Phishing and spear-phishing

Phishing is the most common form of social engineering: fraudulent messages that appear to come from a trusted source and push the victim to click a link, open an attachment, or enter credentials on a fake login page.

- **Phishing** casts a wide net, such as a generic "your account is locked" email sent to thousands of addresses.
- **Spear-phishing** targets a specific person using details gathered from social media, company directories, or a prior breach, which makes the message far more convincing.
- **Business email compromise (BEC)** impersonates an executive or supplier to authorise a fraudulent payment or data transfer, and it drives some of the largest financial losses in the field.

For a deeper walkthrough of message crafting, detection, and defence, see the dedicated [Phishing Attack](/en/page-phishing-attack) chapter and the introductory [Art of Phishing](/en/page-5) guide.

### Pretexting

Pretexting builds a fabricated but believable scenario, the pretext, to extract information or access. The attacker adopts a role, an auditor, a new hire, a delivery driver, and stays in character.

_Example:_ an attacker phones the help desk posing as a travelling executive locked out before an important meeting, layering on urgency until the agent resets the password without proper verification.

### Baiting

Baiting exploits curiosity or greed by leaving a trap the victim chooses to pick up.

_Example:_ a USB drive labelled "Salary Review 2026" is dropped in a car park. A curious employee plugs it into a work machine, launching a [Trojan](/en/page-trojan) or other [malware](/en/page-malware). Modern "USB drop" payloads often emulate a keyboard to type commands the moment they are connected, so no double-click is required.

### Quid pro quo

Quid pro quo, meaning "something for something," offers a service in exchange for access or information.

_Example:_ an attacker cold-calls desks claiming to be IT support. When they reach someone with a genuine problem, they "help" but ask the user to disable antivirus or hand over their login to complete the fix.

### Tailgating and physical entry

Tailgating (or piggybacking) is a physical attack: the intruder follows an authorised person through a secured door, often while carrying boxes or coffee so someone holds it open. Once inside, they may plant devices, photograph screens, or reach network ports that are far more exposed than the perimeter.

## Reconnaissance Comes First

Serious social engineering starts with research, not the phone call. Attackers harvest names, roles, email formats, tech stacks, and vendor relationships from public sources, a practice known as open-source intelligence (OSINT). Job postings reveal internal tooling, LinkedIn reveals reporting lines, and a leaked email address confirms the naming convention for the rest of the company. The more an organisation exposes, the cheaper a convincing pretext becomes.

## Defending Against the Human Hack

There is no patch for human trust, so defence combines training, verified process, and technical backstops that limit the damage when someone is fooled.

- **Verify through a second channel.** If a caller or email requests money, credentials, or a password reset, confirm it using a known internal number or a fresh message, never the contact details supplied in the request.
- **Enforce phishing-resistant MFA.** [Two-Factor Authentication (2FA)](</en/page-two-factor-authentication-(2fa)>) blunts stolen passwords, and hardware security keys using FIDO2/WebAuthn resist the fake login pages and real-time relay attacks that defeat SMS or push codes.
- **Strengthen credential hygiene.** Enforce [secure passwords](/en/page-secure-passwords) and a password manager so staff cannot be tricked into reusing a memorable secret across sites.
- **Run realistic training and simulations.** Regular, blame-free phishing simulations and pretext-call exercises, often delivered by [red and blue teams](/en/page-red-blue-teams), turn awareness into reflex.
- **Adopt least privilege and Zero Trust.** Assume no user or device is trusted by default; limit what any single account can reach so one compromised person is not one compromised network.
- **Plan the response.** A clear [incident response](/en/page-incident-response) process, easy reporting, and a culture that rewards raising the alarm shrink the window an attacker has to act.

## Hands-on Lab: Footprint a Domain with OSINT

Reconnaissance is the cheapest phase for an attacker and the easiest one for you to measure, so this lab turns the "Reconnaissance Comes First" idea into something you can run yourself. Do it only against a domain you own or have written authorisation to test, inside an isolated [virtual machine](/en/page-3) with a snapshot you can roll back.

1. Boot a Kali (or any Debian-based) VM and confirm the tool is present:

```bash
theHarvester -h
```

If it is missing, install it:

```bash
sudo apt update && sudo apt install theharvester
```

2. Enumerate email addresses and subdomains from passive sources that need no API key:

```bash
theHarvester -d yourdomain.com -b duckduckgo,crtsh,certspotter,otx -l 500
```

3. Save a structured report so you can diff results over time:

```bash
theHarvester -d yourdomain.com -b crtsh,otx -f recon-baseline
```

This writes `recon-baseline.json` and `recon-baseline.xml`.

4. Read the output the way an attacker would. The email list reveals your naming convention (for example `first.last@`), which is all a pretext caller needs to guess the rest of the company. Subdomains expose forgotten staging boxes or VPN portals that make convincing lures.

5. Pivot the certificate-transparency hits with a quick DNS check:

```bash
dnsrecon -d yourdomain.com
```

Now flip roles. Everything you found is already public, so the defensive win is to shrink it: pull stale DNS records, scrub email addresses from public pages, and warn the named staff that they are the likeliest pretext targets. Re-run the baseline monthly and treat a growing footprint as an input to your defences, not just trivia.

A firewall can drop a malicious [packet](/en/page-packets), but it cannot stop an employee from reading a convincing email and handing over the keys to the kingdom. The strongest control is a workforce that knows the playbook and feels safe pausing to verify.
