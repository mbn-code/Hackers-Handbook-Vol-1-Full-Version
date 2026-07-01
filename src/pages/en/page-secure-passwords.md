---
title: Secure Passwords
description: How to build and manage strong passwords and passphrases, why length beats complexity, and how attackers crack hashes—plus password managers, MFA, and passkeys.
layout: ../../layouts/MainLayout.astro
---

A password is a shared secret that proves you are who you claim to be. It is also the single control most often broken, reused, and stolen. This page explains what actually makes a password hard to guess, how attackers go after them, and how to defend accounts you are responsible for.

<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/hashcat-walkthrough-poster.png">
    <source src="/en/videos/hashcat-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/hashcat-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>Why weak, unsalted hashes fall in seconds — a <code>hashcat</code> run against a lab dump.</figcaption>
</figure>

## What Makes a Password Strong

Strength is not "add a symbol." It is **entropy**: how many guesses an attacker must make on average. Entropy scales with the size of the character or word pool and, far more powerfully, with length. Each extra character multiplies the search space; padding the alphabet with one symbol barely moves it.

This is why a long passphrase beats a short, gnarly password. `Tr0ub4dor&3` is short and predictable to cracking tools. Four or five random words—`correct-battery-harbor-stapler-velvet`—are longer, easier to type, easier to remember, and far harder to brute force.

A useful rule of thumb for a random passphrase drawn from a word list (Diceware-style):

- 6 words from a 7,776-word list ≈ 77 bits of entropy.
- Each added word adds ~12.9 bits.

Aim for **at least 12–16 characters** for a human-typed password, or **5–6 random words** for a passphrase. For anything a machine stores (API keys, service accounts), go longer and let a generator do the work.

### Modern guidance: length over churn

Old advice—force complexity rules and expire passwords every 90 days—is now discouraged. NIST's digital identity guidelines (SP 800-63B) recommend:

- Favour **length**; allow long passphrases and the full character set including spaces.
- **Do not** impose arbitrary composition rules (must-have symbol/number).
- **Do not** force periodic rotation. Rotate only on evidence of compromise.
- Screen new passwords against lists of **known-breached** and common values, and reject matches.

Forced rotation backfires: people make predictable tweaks (`Summer2025!` becomes `Summer2026!`), weakening security rather than improving it.

## How Passwords Get Broken

Understanding the attacks tells you which defences matter. These techniques are for authorised testing and defence of systems you own or have permission to assess—see [Ethical Hacking](/en/page-ethical-hacking) and [Legal and Ethical Considerations](/en/page-legal-ethical).

- **Credential stuffing:** attackers replay username/password pairs leaked from one breach against other sites. This works only because of reuse. It is the single most common account-takeover method.
- **Offline hash cracking:** if a database leaks, attackers run tools like `hashcat` or John the Ripper against the stolen hashes at billions of guesses per second on GPUs. Weak hashing turns a leak into instant plaintext.
- **[Brute force](/en/page-brute-force-attack) and dictionary attacks:** exhaustive or wordlist-driven guessing, often against a live login. Rate limiting and lockouts blunt these online.
- **Phishing and social engineering:** the password is simply handed over. No amount of complexity helps here—see [The Art of Phishing](/en/page-5) and [Social Engineering](/en/page-socialEngineering).

## Storing Passwords Correctly (for Developers)

If you build systems, how you store passwords matters more than how users choose them. Never store plaintext, and never use fast hashes (MD5, SHA-1, plain SHA-256) for passwords.

Use a **slow, salted, memory-hard** password hashing function. OWASP's current recommendation is **Argon2id**, with **scrypt** and **bcrypt** as accepted alternatives. Each password gets a unique random salt (handled automatically by these libraries), and a per-application secret "pepper" can add defence in depth.

```python
# Argon2id via the argon2-cffi library
from argon2 import PasswordHasher

ph = PasswordHasher()          # sensible memory/time defaults
hashed = ph.hash("correct-battery-harbor-stapler")

# On login:
try:
    ph.verify(hashed, submitted_password)
    # optionally: if ph.check_needs_rehash(hashed): re-store with newer params
except Exception:
    pass  # authentication failed
```

Tune the memory and iteration parameters as high as your latency budget allows—that is what keeps offline cracking expensive. See [Secure Coding](/en/page-secure-coding) and [Cryptography](/en/page-cryptography) for the wider context.

## Password Managers

You cannot remember a unique 16-character secret for 200 sites, so don't try. A reputable password manager generates random passwords, stores them in an encrypted vault, and autofills them only on the correct domain—which also foils lookalike phishing pages.

- Protect the vault with a single **strong master passphrase** you never reuse, plus MFA.
- The master passphrase is the one secret you must memorise; make it a long passphrase.
- Prefer well-audited managers; open-source and independently reviewed options are a plus.

## Beyond the Password: MFA and Passkeys

A password alone is one factor. Add more so a single stolen secret is not game over.

- **[Two-Factor Authentication](</en/page-two-factor-authentication-(2fa)>):** require a second factor. Authenticator-app codes (TOTP) and hardware security keys are strong; **SMS codes are the weakest** option because of SIM-swapping and interception, so avoid them where you can.
- **Passkeys (FIDO2/WebAuthn):** a public-key credential bound to the site and stored in your device or security key. There is no shared secret to phish, reuse, or leak, which makes passkeys **phishing-resistant** by design. Where a service offers passkeys, they are the strongest practical upgrade over passwords.

## Hands-On Lab: Watch a Weak Password Fall

Reading that weak hashes crack "in seconds" lands harder once you see it yourself. Do this only inside a disposable VM you control—see [Virtual Machines](/en/page-3)—and treat it as the [brute force](/en/page-brute-force-attack) model applied to a leaked database, not to any live account.

1. On a Kali VM, unpack the bundled wordlist (recent builds ship it already extracted):

```bash
gunzip -k /usr/share/wordlists/rockyou.txt.gz   # skip if rockyou.txt exists
```

2. Create two MD5 hashes—the fast, unsalted algorithm a careless site might use. One is a predictable "complex" password, the other a random passphrase:

```bash
printf '%s' 'Summer2026!' | md5sum | cut -d' ' -f1 >  hashes.txt
printf '%s' 'correct-battery-harbor-stapler-velvet' | md5sum | cut -d' ' -f1 >> hashes.txt
```

3. Run hashcat (`-m 0` = raw MD5, `-a 0` = wordlist), then show what fell:

```bash
hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -m 0 --show hashes.txt
```

`Summer2026!` cracks almost instantly: it is a dictionary word plus a trivial mangling rule. The five-word passphrase never appears—it is in no wordlist, and its search space is astronomically larger.

4. Now feel what slow hashing buys you. Hash the same weak password with bcrypt and attack it with mode `3200`:

```bash
python3 -c "import bcrypt; print(bcrypt.hashpw(b'Summer2026!', bcrypt.gensalt()).decode())" > bcrypt.txt
hashcat -m 3200 -a 0 bcrypt.txt /usr/share/wordlists/rockyou.txt
```

Watch throughput collapse from billions of guesses per second to a few thousand. That single change—the Argon2id/bcrypt choice from earlier—is what turns a database leak from catastrophe into merely expensive.

## A Practical Checklist

1. Use a password manager and give every account a **unique, generated** password.
2. Make your master password and any memorised secrets **long passphrases**, not clever short strings.
3. Turn on **MFA everywhere**, preferring authenticator apps or hardware keys over SMS.
4. Adopt **passkeys** on services that support them.
5. Change a password **only** when there is reason to—a breach, a shared secret, or a phishing scare—not on an arbitrary schedule.
6. If you run a service, hash with **Argon2id**, rate-limit logins, and screen against breached-password lists.

Strong authentication is layered: a good secret, kept unique, backed by a second factor, stored and transmitted safely. Get those four right and you have closed the door on the attacks that account for the overwhelming majority of real-world compromises.
