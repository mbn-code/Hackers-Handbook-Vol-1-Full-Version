---
title: Legal and Ethical Considerations in Hacking
description: Understand the laws, authorization, scope, and responsible disclosure rules that separate ethical hacking from a crime, with practical guidance for testers.
layout: ../../layouts/MainLayout.astro
---

The single line between a security professional and a criminal is authorization. The same port scan, exploit, or password crack is a paid engagement or a felony depending entirely on whether the owner said yes in writing first. This page covers the laws you work under, how to get and document permission, and how to handle vulnerabilities you find.

## The one rule that matters: authorization

Every skill in this handbook, from [Nmap](/en/page-4) scans to [Metasploit](/en/page-6) payloads, is legal to use against systems you own or have explicit written permission to test. Use them against anything else and you are committing a crime, regardless of intent, curiosity, or whether you caused damage.

"I was just looking" and "I only wanted to help" are not defenses. Courts care about whether access was authorized, not why you wanted it. Get permission in writing, keep it in scope, and you stay on the right side of the line. This is the core of [ethical hacking](/en/page-ethical-hacking).

## Laws you operate under

Cybercrime law varies by country, but a few statutes drive most enforcement. Know which ones apply to you and your target.

- **United States - Computer Fraud and Abuse Act (CFAA).** The primary federal anti-hacking statute. It criminalizes accessing a computer "without authorization" or "exceeding authorized access." Penalties scale with damage and intent. State laws add another layer.
- **United Kingdom - Computer Misuse Act 1990.** Criminalizes unauthorized access, unauthorized access with intent to commit further offenses, and unauthorized modification of data.
- **European Union - GDPR.** Not an anti-hacking law, but it governs how personal data is handled. If a test touches personal data, breach notification and lawful-processing rules apply. Fines reach into the tens of millions of euros.
- **EU Directive 2013/40 and the Budapest Convention.** Harmonize cybercrime definitions across many jurisdictions, so cross-border attacks are prosecutable in multiple places at once.

Jurisdiction follows the target, not the tester. If you attack a server in another country, you can be liable under its laws, your own, and any treaty that connects them. When a test crosses borders, involve legal counsel early.

## Getting authorization right

Verbal approval from someone in a hallway is worthless. Authorization has to be specific, written, and granted by someone with the authority to grant it.

### Scope and rules of engagement

Before any packet is sent, agree on a written scope and rules of engagement (RoE). A solid RoE names:

- **In-scope targets** by IP range, domain, or application. Anything not listed is out of bounds.
- **Explicitly excluded systems** such as production databases, third-party services, or legacy hosts.
- **Permitted techniques.** Is social engineering allowed? Denial-of-service testing? Physical access?
- **Testing window** and time-of-day restrictions.
- **Emergency contacts** and a stop condition for when something breaks.
- **Data handling.** How findings, screenshots, and any captured data are stored and destroyed.

Watch for third-party dependencies. Testing an app hosted on a cloud provider may require the provider's own approval, and hitting shared infrastructure can affect tenants who never consented. This matters especially for [cloud security](/en/page-cloud-security) assessments.

### The authorization document

Get a signed letter of authorization (sometimes called a "get out of jail free" letter) before you start. Keep a copy with you during on-site work. It should state exactly what you are permitted to do, over what period, and who approved it. Recognized methodologies like PTES (the Penetration Testing Execution Standard) and OWASP guidance formalize this pre-engagement phase for a reason: it protects both you and the client.

## Responsible disclosure and bug bounties

Finding a [vulnerability](/en/page-vulnerability) in someone else's software is common and often accidental. What you do next is where ethics become concrete.

**Coordinated disclosure** is the norm: privately report the flaw to the vendor, give them a reasonable window to fix it (90 days is a widely used baseline), then publish once a patch ships or the deadline passes. This gets defects fixed without handing a working [zero-day](/en/page-zero-day-exploit) to attackers.

**Bug bounty programs** (HackerOne, Bugcrowd, and vendor-run programs) formalize this. They publish a scope and a safe-harbor clause promising not to pursue legal action against researchers who stay within the rules. Read that scope carefully; it is your authorization, and stepping outside it voids the protection.

A few hard limits when reporting a flaw you stumbled onto:

- Do not download, copy, or exfiltrate real user data to "prove" the bug. Demonstrate the flaw with the minimum access needed.
- Do not extort. Demanding payment to withhold disclosure is a crime, not a bounty.
- Do not test production systems that have no published policy without asking first.

Look for a `security.txt` file (at `/.well-known/security.txt`) on a target's domain; it lists the contact and policy for reporting issues:

```
# https://example.com/.well-known/security.txt
Contact: mailto:security@example.com
Expires: 2026-12-31T23:59:59.000Z
Policy: https://example.com/security-policy
Preferred-Languages: en
```

## Professional codes and where they bind

Certifications carry ethics obligations that outlast any single engagement. The EC-Council CEH, ISC2 CISSP, and Offensive Security certifications all require holders to follow a code of conduct; violations can cost you the credential. These codes echo the same themes: act with authorization, protect confidentiality, disclose responsibly, and do not misuse access.

Contractual duties matter just as much. A non-disclosure agreement means findings stay between you and the client, and data-protection clauses dictate how you handle anything sensitive you encounter.

## A practical pre-engagement checklist

Run through this before touching a target:

1. **Written authorization** signed by someone empowered to grant it.
2. **Defined scope** with in-scope and excluded assets listed explicitly.
3. **Rules of engagement** covering techniques, timing, and a stop condition.
4. **Third-party approvals** for cloud, hosting, or shared infrastructure.
5. **Data-handling plan** for evidence collection, storage, and destruction.
6. **Emergency contacts** and an agreed escalation path.
7. **Legal review** for cross-border or high-sensitivity work.

Skip any of these and even a well-intentioned test can become an offense. The tools are neutral; the paperwork is what makes your work lawful. When in doubt, stop and get written permission before you continue.
