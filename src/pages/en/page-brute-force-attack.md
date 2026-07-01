---
title: Brute Force Attack
description: How brute force attacks crack passwords and keys by exhaustive trial, the difference between online and offline cracking, tools, and real defenses.
layout: ../../layouts/MainLayout.astro
---

A brute force attack cracks a secret by trying candidates until one works. There is no clever exploit here, just raw computation applied to a keyspace, which makes brute force both the crudest attack in the book and a useful yardstick for how strong a password or key actually is.


<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/hashcat-walkthrough-poster.png">
    <source src="/en/videos/hashcat-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/hashcat-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>Offline password cracking with <code>hashcat</code> — the reason speed and salting matter.</figcaption>
</figure>

## How Brute Force Works

Every password or encryption key lives in a _keyspace_: the set of all possible values. A four-digit PIN has 10,000 combinations; an 8-character password drawn from 95 printable ASCII characters has 95^8, roughly 6.6 quadrillion. Brute force walks that space and tests each candidate against a check the attacker controls or observes.

The attack's feasibility comes down to two numbers: the size of the keyspace and how fast candidates can be tested. Add one character to a password and you multiply the work by the size of the character set. This exponential growth is why length beats complexity, and why short secrets fall no matter how "random" they look.

### Not Just Blind Guessing

Pure brute force (trying `aaaa`, `aaab`, `aaac`...) is rarely the smartest approach. Attackers front-load likely candidates:

- **Dictionary attacks** try wordlists of common and leaked passwords first. The `rockyou.txt` list of real breached passwords is the classic starting point.
- **Hybrid attacks** mangle dictionary words with rules: `Password` becomes `P@ssw0rd!`, `password2026`, and so on.
- **Mask attacks** brute force a known pattern, such as "one uppercase, five lowercase, two digits," slashing the keyspace when the target's format is predictable.
- **Credential stuffing** replays username/password pairs stolen from one breach against other services, betting on password reuse. It is technically credential replay rather than guessing, but defenders treat it alongside brute force.

## Online vs. Offline Attacks

The single most important distinction is _where_ the guessing happens.

**Online** attacks send each guess to a live service (a login form, SSH, an API). The attacker is throttled by network latency and whatever defenses the server runs, so realistic rates are dozens to a few thousand attempts per second at best. Tools like `hydra` automate this:

```bash
# Authorized test against your own lab host only.
hydra -l admin -P /usr/share/wordlists/rockyou.txt \
      ssh://192.168.56.101 -t 4
```

**Offline** attacks happen after an attacker has already stolen a database of password _hashes_. With the hashes local, there is no server to slow them down, and a GPU rig can test billions of candidates per second against fast hashes like MD5 or unsalted SHA-1. This is where `hashcat` and John the Ripper dominate:

```bash
# Crack SHA-256 hashes you are authorized to audit.
hashcat -m 1400 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt
```

Offline is the dangerous case, which is why how a system _stores_ passwords matters as much as how strong they are.

## Common Targets

- **Account passwords** on web apps, SSH, RDP, and mail servers.
- **Password hashes** dumped from a compromised database, often via [SQL injection](/en/page-sql-injection).
- **Encryption keys and archives** such as password-protected ZIP, PDF, or disk images.
- **Wi-Fi handshakes**, where a captured WPA2 handshake is cracked offline (see [Wireless Hacking](/en/page-wireless-hacking)).
- **API tokens and short secrets** with insufficient entropy.

## Defending Against Brute Force

No single control is enough; layer them.

**Slow, salted password hashing.** Never store passwords with fast or reversible hashes. Use a purpose-built, adaptive function: **Argon2id** (the current recommended default), **bcrypt**, or **scrypt**. A unique random salt per password defeats precomputed rainbow tables, and the deliberate slowness cripples offline cracking. See [Encryption](/en/page-encryption) and [Cryptography](/en/page-cryptography) for the underlying primitives.

**Rate limiting and lockouts.** Throttle attempts per account and per source IP, add exponential backoff, and temporarily lock accounts after repeated failures. Watch the account-lockout knob, though: aggressive lockouts on a public login turn into a denial-of-service vector.

**Multi-factor authentication.** [Two-factor authentication](</en/page-two-factor-authentication-(2fa)>) is the highest-value control, because a correctly guessed password still fails without the second factor. This alone neuters most credential-stuffing campaigns.

**Strong, unique, long secrets.** Length is the dominant factor. Passphrases and password-manager-generated strings push the keyspace beyond practical reach. See [Secure Passwords](/en/page-secure-passwords) for how to reason about entropy.

**Detection.** Alert on spikes in failed logins, impossible-travel sign-ins, and reuse of known-breached credentials. CAPTCHAs and device fingerprinting raise the cost of large-scale automation.

## Responsible Use

Password auditing tools like Hashcat and Hydra are standard gear for penetration testers and defenders validating their own controls. Run them only against systems you own or have explicit written authorization to test; unauthorized guessing against someone else's accounts is a crime in most jurisdictions. Practice on intentionally vulnerable targets such as [Metasploitable](/en/page-metasploitable) or a lab you built, and keep your work inside the boundaries covered in [Ethical Hacking](/en/page-ethical-hacking).
