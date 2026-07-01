---
title: Cryptography
description: A practical cryptography guide for ethical hackers, covering symmetric/asymmetric encryption, hashing, salting, and how attacks exploit weak implementations.
layout: ../../layouts/MainLayout.astro
---

Cryptography is the science of protecting information by transforming it into a form that only authorised parties can read. It is the mathematical backbone of the modern internet, and understanding it is essential for anyone doing authorised security testing or defence.

Without cryptography, every message you send, every password you type, and every payment you make would be readable by anyone performing [Packet Sniffing](/en/page-packet-sniffing) on the network between you and your destination.

## The Three Pillars

Almost everything in applied cryptography is built from three primitives: symmetric encryption, asymmetric encryption, and hashing. Real systems combine all three.

### Symmetric Encryption

With symmetric [Encryption](/en/page-encryption), the **same key** encrypts and decrypts the data. It is fast and used for bulk data, from disk encryption to the payload of an HTTPS session.

- Think of a padlock where one physical key both locks and unlocks it.
- **Standard algorithm:** AES (Advanced Encryption Standard), typically AES-256 in an authenticated mode such as AES-GCM or ChaCha20-Poly1305.
- **The weak point:** the key must be shared with the other party. If an attacker captures that key, the whole conversation is exposed. Getting the key to the right person safely is the _key distribution problem_.

### Asymmetric (Public-Key) Encryption

Asymmetric encryption solves key distribution using a mathematically linked **pair of keys**:

- A **public key** that anyone can hold. Data encrypted with it can only be undone by the matching private key.
- A **private key** that the owner never shares. It also lets the owner produce digital signatures that prove authenticity.

If Alice wants to send Bob a secret, she encrypts it with Bob's public key. Once sealed, not even Alice can reopen it, only Bob's private key can. This is the foundation of [SSL Certificates](/en/page-ssl-certificate) and secure browsing.

- **Standard algorithms:** RSA and elliptic-curve schemes (ECDH for key exchange, ECDSA/Ed25519 for signatures).
- **In practice:** asymmetric crypto is slow, so HTTPS uses it only to agree on a temporary symmetric key, then switches to fast symmetric encryption for the actual data. This handshake is described in more depth in [Networking](/en/page-networking).

### Hashing

A hash is a **one-way function**: feed in any input and it produces a fixed-length fingerprint. You cannot reverse the fingerprint back into the original, and even a one-character change to the input produces a completely different output.

- **Where it matters:** password storage. A service should never keep your actual password. It stores a hash, and at login it hashes what you typed and compares the two.
- **General-purpose hashes:** SHA-256 and SHA-3 for integrity checks and signatures. **MD5 and SHA-1 are broken** and must never be used for security.
- **Password hashes are different:** general hashes are built to be _fast_, which helps an attacker guess quickly. Passwords should use a deliberately _slow_, memory-hard function such as **bcrypt, scrypt, or Argon2id**.

<figure class="hh-figure">
  <img src="/en/diagrams/symmetric-asymmetric.svg" alt="The two families of encryption: one shared key vs. a public/private key pair." loading="lazy" />
  <figcaption>The two families of encryption: one shared key vs. a public/private key pair.</figcaption>
</figure>

## How Attackers Actually Beat Cryptography

Modern algorithms like AES-256 are not broken by brute-forcing the math. The keyspace is so large that guessing keys directly is infeasible with any current or foreseeable classical hardware. So attackers ignore the math and target everything around it.

- **Cracking stolen hashes:** if a breach exposes a password-hash database, tools such as Hashcat or John the Ripper run a [Brute Force Attack](/en/page-brute-force-attack) or dictionary attack, hashing millions of candidate passwords and stopping when a hash matches. Fast hashes like unsalted MD5 fall almost instantly, which is exactly why slow password hashes exist.
- **Rainbow tables:** precomputed lookup tables that trade storage for speed, mapping hashes back to their inputs. They devastate unsalted hashes and are the reason salting is mandatory.
- **Implementation and side-channel flaws:** padding-oracle attacks, timing leaks, weak or reused random numbers, and downgrade attacks all break real systems whose underlying algorithm is perfectly sound.
- **Key leakage:** the fastest break of all. A private key committed to a public GitHub repo, left in a backup, or pulled from memory ends the game instantly, no cryptanalysis required.
- **The "rubber-hose" attack:** rather than attack the cipher, coerce or trick the human. Well-crafted [Social Engineering](/en/page-socialEngineering) often beats any encryption.

Only investigate hashes, keys, or ciphertext you are authorised to test. Cracking credentials you do not own is illegal and outside the scope of ethical work covered in [Legal and Ethical Considerations in Hacking](/en/page-legal-ethical).

## A Quick Look at the Tools

You do not need to implement crypto yourself, standard tooling handles it. A couple of common commands:

```bash
# Hash a file to verify its integrity
sha256sum ubuntu-24.04.iso

# Generate a modern Ed25519 SSH key pair
ssh-keygen -t ed25519 -C "you@example.com"

# Inspect the certificate a website presents (press Ctrl+C to exit)
openssl s_client -connect example.com:443 -servername example.com
```

## Hands-On Lab: Feel Why Slow Hashes Matter

The single biggest idea in password storage is that a _fast_ hash helps the attacker. You can prove it to yourself in about ten minutes. Do this only on hashes you generate yourself, inside a disposable [Kali VM](/en/page-3), never against credentials you do not own.

Kali ships Hashcat and the rockyou wordlist. Unpack the list once (`htpasswd` comes from the `apache2-utils` package):

```bash
sudo gunzip /usr/share/wordlists/rockyou.txt.gz
```

**1. Create a fast, unsalted MD5 hash of a weak password:**

```bash
echo -n 'iloveyou' | md5sum | cut -d' ' -f1 > weak.hash
```

**2. Crack it with a dictionary attack** (mode `0` is raw MD5):

```bash
hashcat -m 0 -a 0 weak.hash /usr/share/wordlists/rockyou.txt
hashcat -m 0 weak.hash --show
```

On a modest GPU this recovers the password almost instantly, and the status screen reports billions of guesses per second.

**3. Now hash the _same_ password with bcrypt,** a deliberately slow function:

```bash
htpasswd -bnBC 12 "" 'iloveyou' | tr -d ':\n' > slow.hash
```

**4. Point the identical attack at it** (mode `3200` is bcrypt):

```bash
hashcat -m 3200 -a 0 slow.hash /usr/share/wordlists/rockyou.txt --status
```

Watch the speed line: instead of billions per second you now see a few thousand or fewer. The `12` is bcrypt's cost factor. Raise it to `14` and the rate drops roughly fourfold again.

Same password, same wordlist, same hardware. The only change is the algorithm, and it turns an instant crack into an impractical one. That gap is the entire argument for bcrypt, scrypt, or Argon2id, and it is why a stolen fast-hash database is a genuine emergency. Extend the exercise by prepending a random salt and re-running to confirm rainbow tables stop helping. See [Brute Force Attack](/en/page-brute-force-attack) for the theory behind what you just watched.

## Best Practices

- **Never roll your own crypto.** Use vetted, maintained libraries and let TLS, libsodium, or your platform's crypto API do the heavy lifting.
- **Salt every password hash.** A unique random salt per user defeats rainbow tables and stops identical passwords from sharing a hash. Modern password hashers add the salt for you.
- **Prefer authenticated encryption.** Modes like AES-GCM or ChaCha20-Poly1305 protect against tampering, not just eavesdropping.
- **Retire weak primitives.** No DES, RC4, MD5, or SHA-1 for security purposes.
- **Protect and rotate keys.** Store secrets in a vault or secrets manager, never in source control, and rotate them if exposure is suspected. This pairs directly with the habits in [Secure Passwords](/en/page-secure-passwords).
- **Plan for post-quantum.** A large fault-tolerant quantum computer would threaten today's RSA and elliptic-curve keys via Shor's algorithm. Standards bodies have published post-quantum algorithms, and long-lived data is already being migrated, so keep an eye on this as you [Stay Current](/en/page-stay-current).
