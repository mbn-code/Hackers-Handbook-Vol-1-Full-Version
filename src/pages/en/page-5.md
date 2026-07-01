---
title: The Art of Phishing
description: "Phishing for ethical hackers: how credential-harvesting attacks work, running authorised awareness tests with Zphisher, and defending real users."
layout: ../../layouts/MainLayout.astro
---

Phishing is the most common way real breaches begin: not a clever exploit, but a convincing message that persuades a person to click, log in, or approve. This page explains how phishing works, how defenders run authorised awareness tests, and how to stop it.

Phishing is a form of [social engineering](/en/page-socialEngineering) in which an attacker impersonates a trusted party to trick someone into revealing credentials, sending money, or running [malware](/en/page-malware). The technology being attacked is you.

## Why Phishing Works

Attackers rarely brute-force their way in when they can simply ask. A well-crafted phishing message exploits ordinary human reflexes rather than software bugs, which is exactly why it scales.

Most campaigns lean on a handful of psychological levers:

- **Authority** — the message appears to come from your bank, IT department, or CEO.
- **Urgency** — "Your account will be suspended in 24 hours" pushes you to act before you think.
- **Fear or reward** — a failed payment, a bonus, a shared document you weren't expecting.
- **Familiarity** — spoofed branding, a real logo, and a lookalike domain lower your guard.

The payoff for the attacker is credentials, a foothold for later movement, or a direct financial transfer.

## The Phishing Family

"Phishing" is an umbrella term. Knowing the variants helps you recognise and describe them accurately during a [red and blue team](/en/page-red-blue-teams) engagement.

| Type                            | Delivery                                      | Target                                      |
| ------------------------------- | --------------------------------------------- | ------------------------------------------- |
| Bulk phishing                   | Mass email                                    | Anyone who clicks                           |
| Spear phishing                  | Tailored email                                | A specific person, using researched details |
| Whaling                         | Tailored email                                | Executives and other high-value targets     |
| Business email compromise (BEC) | Email from a real or spoofed account          | Finance staff, to authorise payments        |
| Smishing                        | SMS / messaging apps                          | Mobile users                                |
| Vishing                         | Phone call / voicemail                        | Anyone reachable by phone                   |
| Clone phishing                  | Copy of a legitimate email with swapped links | Recipients of the original                  |

Modern campaigns increasingly steal session tokens, not just passwords. An **adversary-in-the-middle** kit proxies the real login page, captures the authenticated session cookie, and can slip past one-time codes — which is why _phishing-resistant_ MFA matters (more on that below).

## Simulating Phishing With Consent

Authorised phishing simulations are a legitimate, valuable part of security training. Blue teams use them to measure click rates, test reporting workflows, and coach staff who fall for a lure. **Zphisher** is a widely used open-source tool that spins up cloned login pages for common services, which makes it handy for controlled demos in a lab.

> Only run this against your own accounts or a target that has given you explicit, written authorisation. Standing up a fake login page to harvest anyone else's credentials is a crime in essentially every jurisdiction. Keep the whole exercise inside a lab or a signed engagement.

### Install Zphisher

On Kali Linux, open a terminal and clone [Zphisher](https://github.com/htr-tech/zphisher) from its repository:

```bash
# 1. Clone the repo (shallow, to save bandwidth)
git clone --depth=1 https://github.com/htr-tech/zphisher.git

# 2. Move into the new folder
cd zphisher

# 3. Run the launcher script
bash zphisher.sh
```

The `.sh` extension marks this as a shell script written in **Bash** (covered in [Bash Scripting](/en/page-bash)). The `bash` command tells your shell to interpret and execute the instructions inside it. On first run, Zphisher installs its own dependencies and then shows an interactive menu.

### Run a Local Demo

From the menu you pick a template and a hosting method. To keep everything on your own machine, choose the [localhost](/en/page-localhost) option so nothing is exposed to the internet:

```text
[-] Successfully Hosted at : http://127.0.0.1:8080
[-] Waiting for Login Info, Ctrl + C to exit...
```

Open `http://127.0.0.1:8080` in your browser and you'll see the cloned page. Type test credentials into it, submit, and Zphisher prints what was entered straight to your terminal. That is the entire trick: a look-alike form and a place to send the data. Seeing it once makes the real thing far easier to spot.

## Spotting a Phishing Message

- **Read the full sender address**, not just the display name. `Support <billing@paypa1-secure.com>` is not PayPal.
- **Hover before you click.** Check where a link actually points; watch for lookalike domains like `g00gle.com` or `micros0ft-login.com`.
- **Be suspicious of urgency and unexpected attachments.** Legitimate services rarely threaten instant suspension over email.
- **Never trust the login page you were sent to.** Navigate to the site yourself, or use a saved bookmark, then sign in.
- **Watch for a password manager that won't autofill.** It matches on the exact domain, so silence often means the URL is wrong even when the page looks perfect.

For a deeper walk-through of an end-to-end campaign, see [Phishing Attack](/en/page-phishing-attack).

## Hands-on Lab: Read the Headers Like an Analyst

The fastest way to unmask a spoofed email is to stop looking at the rendered message and read the raw headers. Every mail server that touches a message stamps it, and the receiving server records whether authentication passed. You can do this whole lab with a real spam message already sitting in your own inbox — no target, no authorisation needed.

1. **Export the raw message.** In Gmail, open the email, use the three-dot menu, choose _Show original_, then _Download original_ to save a `.eml` file. Most desktop clients offer the same under _Save As_.

2. **Check what the receiver already verified.** Your provider computed a verdict on delivery — pull it out:

```bash
grep -i "authentication-results" suspicious.eml
```

Look for `spf=fail`, `dkim=fail`, or `dmarc=fail`. A genuine message from a large brand passes all three; a spoof usually trips at least one.

3. **Trace the first hop.** The earliest `Received:` line is closest to the real origin. Grab it and look up the sending [IP address](/en/page-ip):

```bash
grep -i "^Received:" suspicious.eml | tail -n 1
whois 203.0.113.10 | grep -iE "orgname|netname|country"
```

Mail claiming to be your bank but originating from a residential ISP or an unfamiliar host is a strong tell.

4. **Ask the domain what it publishes.** Compare the claimed sender's own policy against what you saw:

```bash
dig +short TXT example.com | grep -i spf1
dig +short TXT _dmarc.example.com
```

A domain publishing `p=reject` in its DMARC record should never produce a `dmarc=fail` message that still reaches your inbox — if one does, treat it as forged.

Do this a few times and header-reading becomes reflex. It is the same first move a [SOC](/en/page-red-blue-teams) analyst makes on every reported phish.

## Defending Against Phishing

No single control stops phishing; layered defences do. Combine technical guardrails with the human ones.

**For individuals**

- Turn on [Two-Factor Authentication (2FA)](</en/page-two-factor-authentication-(2fa)>) everywhere it's offered. Prefer _phishing-resistant_ methods — hardware security keys or passkeys (FIDO2/WebAuthn) — because they will not authenticate to a fake domain, unlike SMS or app-generated codes that an AiTM kit can relay.
- Use unique, long, randomly generated [passwords](/en/page-secure-passwords) stored in a password manager, so one stolen credential can't unlock everything.

**For organisations**

- Enforce **SPF, DKIM, and DMARC** so spoofed sender domains are rejected at the gateway.
- Deploy email filtering and link-rewriting, and make it one click for staff to report a suspicious message.
- Run regular, _supportive_ awareness training — the goal is faster reporting, not blame.
- Have a rehearsed [incident response](/en/page-incident-response) plan: revoke sessions, reset credentials, and hunt for what the attacker touched after a click.

The strongest posture treats every user as a sensor. When people can recognise a lure and know exactly how to report it, the attacker's cheapest technique stops working.
