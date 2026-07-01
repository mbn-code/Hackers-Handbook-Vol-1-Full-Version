---
title: Phishing Attack
description: How phishing works, the main variants (spear phishing, vishing, smishing, BEC), and the technical and human defences that actually stop credential theft.
layout: ../../layouts/MainLayout.astro
---

Phishing is the practice of impersonating a trusted party to trick a target into handing over credentials, payment details, or access. It remains one of the most common initial-access techniques because it attacks people and process, not code. This page explains how phishing works and how defenders detect and blunt it. Only run realistic phishing simulations against people and systems you are explicitly authorised to test.

## How Phishing Works

A phishing campaign is applied [social engineering](/en/page-socialEngineering): the attacker frames a message so the target's fastest response is the wrong one. The mechanics are consistent across channels.

- **Pretext and impersonation.** The message poses as a bank, employer, courier, IT helpdesk, or a familiar colleague. Sender names, logos, and domains are spoofed or made to look near-identical (for example, `paypa1.com` or `micros0ft-support.com`).
- **Emotional trigger.** Urgency ("your account will be suspended"), fear, authority, or reward pushes the target to act before they verify. This is the core lever, not the technology.
- **The hook.** A link to a credential-harvesting page, a malicious attachment, a fake login prompt, or a request to reply with sensitive data. Modern kits often relay the login in real time so they can capture the [2FA](</en/page-two-factor-authentication-(2fa)>) code too.
- **Payload or capture.** Entered credentials are logged, or an attachment drops [malware](/en/page-malware) such as a [trojan](/en/page-trojan) that establishes a [backdoor](/en/page-backdoor) for later access.

Credential-harvesting pages are usually plain [web pages](/en/page-web-hacking): a cloned login form that POSTs whatever the victim types to the attacker's server, then redirects to the real site so nothing seems wrong.

## Common Variants

- **Email phishing.** High-volume, untargeted messages impersonating well-known brands. Cheap to send, low per-message success rate, still effective at scale.
- **Spear phishing.** Tailored to a specific person or team using researched details (role, projects, vendors). Far higher success rate because the pretext fits the target's real context.
- **Whaling.** Spear phishing aimed at executives or other high-value accounts, where a single compromise unlocks payments or sensitive data.
- **Business Email Compromise (BEC).** A hijacked or spoofed internal/vendor account is used to redirect a wire transfer or invoice. Often text-only with no malicious link, so it slips past link scanners.
- **Vishing (voice).** Phone calls impersonating IT, a bank, or a supplier. Increasingly boosted with AI voice cloning of a known person.
- **Smishing (SMS).** Text messages with malicious links or callback numbers, exploiting the trust and small screens of mobile.
- **Pharming.** Redirecting a correct URL to a fake site by poisoning DNS or altering a host's resolver, so even a careful user lands on the attacker's page.
- **QR phishing ("quishing").** A QR code carries the malicious link, moving the click to a phone that may lack corporate filtering.

## Recognising a Phishing Message

- The domain is close-but-wrong, or the display name hides a different underlying address.
- Unexpected urgency, threats, or too-good-to-be-true offers.
- Generic greetings, or small errors in tone, branding, or grammar.
- Links whose preview target does not match the claimed destination.
- Any unsolicited request for passwords, codes, or payment changes. Legitimate providers do not ask for your password or 2FA code.

```bash
# Inspect email headers for spoofing: check that SPF/DKIM/DMARC pass
# and that the Return-Path aligns with the visible From domain.
grep -iE "Authentication-Results|Received-SPF|DKIM-Signature|Return-Path" message.eml
```

## Defences That Work

No single control is enough; layer human, email, and account defences.

**Technical**

- Enforce **SPF, DKIM, and DMARC** on your domains, with DMARC set to `p=reject` once monitoring is clean, so attackers cannot spoof your addresses. Filter and quarantine lookalike inbound domains.
- Require [phishing-resistant 2FA](</en/page-two-factor-authentication-(2fa)>) — FIDO2/WebAuthn security keys or passkeys — which bind authentication to the real site and defeat real-time credential relays that beat SMS or app codes.
- Use [strong, unique passwords](/en/page-secure-passwords) from a password manager; managers refuse to autofill on the wrong domain, which is itself a phishing tripwire.
- Deploy [firewalls](/en/page-firewall) and DNS/URL filtering to block known malicious destinations, and keep endpoints patched to limit attachment payloads.

**Human and process**

- Train people to verify out of band: confirm any payment change or credential request through a known channel, never by replying to the message.
- Run authorised phishing simulations to measure and improve click rates, and reward reporting rather than punishing clicks.
- Give staff a fast, blameless way to report suspected phishing so the security team can pull related messages.

When a phish does land, treat it as an intrusion: rotate exposed credentials, revoke sessions, and follow your [incident response](/en/page-incident-response) plan to contain and investigate.

## Related Topics

Phishing rarely stands alone. It is the delivery step for many campaigns covered elsewhere in this handbook: the broader discipline of [social engineering](/en/page-socialEngineering), the [malware](/en/page-malware) it often carries, and the [ethical, legal boundaries](/en/page-legal-ethical) that govern any authorised phishing test.
