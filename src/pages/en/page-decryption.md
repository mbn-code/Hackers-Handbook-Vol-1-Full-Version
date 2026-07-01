---
title: Decryption
description: Decryption reverses encryption to recover plaintext. Learn symmetric vs asymmetric keys, real openssl and gpg examples, and why key management matters most.
layout: ../../layouts/MainLayout.astro
---

Decryption is the process that turns ciphertext back into readable plaintext using the correct key and algorithm. It is the mirror image of [encryption](/en/page-encryption): whoever holds the right key can recover the data, and whoever does not should face work that is computationally infeasible.

## Decryption in one sentence

Given ciphertext, an algorithm, and a key, decryption produces the original message. The security of the whole scheme does not rest on hiding the algorithm — it rests on protecting the key. This is Kerckhoffs's principle, and every serious cryptosystem assumes attackers already know the algorithm you use.

## Symmetric vs asymmetric decryption

The kind of key you need depends on how the data was encrypted. Understanding both is the core of practical [cryptography](/en/page-cryptography).

### Symmetric decryption

The same secret key both encrypts and decrypts. Modern symmetric ciphers like AES are fast and protect the bulk of data in transit and at rest — disk volumes, database fields, TLS session traffic. The challenge is distribution: both parties must already share the secret without an eavesdropper capturing it.

```bash
# Encrypt a file with AES-256 (prompts for a passphrase)
openssl enc -aes-256-cbc -pbkdf2 -salt -in secret.txt -out secret.enc

# Decrypt it back with the same passphrase
openssl enc -d -aes-256-cbc -pbkdf2 -in secret.enc -out secret.txt
```

### Asymmetric decryption

A key pair splits the roles: a public key encrypts, and only the matching private key decrypts. This solves the distribution problem — you can publish your public key freely. RSA and elliptic-curve schemes underpin email encryption, code signing, and the certificate exchange behind every [SSL/TLS certificate](/en/page-ssl-certificate).

```bash
# Recipient decrypts a message with their private key
gpg --output message.txt --decrypt message.txt.gpg
```

In practice the two are combined. TLS uses asymmetric cryptography to agree on a shared symmetric key, then switches to fast symmetric encryption for the actual session data.

## What decryption is not: attacking ciphertext

Legitimate decryption means you hold the key. Recovering plaintext _without_ the key is a different discipline — cryptanalysis — and it is exactly what strong ciphers are designed to defeat.

- **Brute force** tries every possible key. Against a properly random 256-bit key this is hopeless; against a weak passphrase it is trivial. See how a [brute force attack](/en/page-brute-force-attack) exploits low-entropy secrets and why strong passwords matter.
- **Weak or broken algorithms** (DES, RC4, MD5-based constructions) fall to known attacks and should never be relied on.
- **Implementation flaws** — reused nonces, predictable random number generators, padding-oracle bugs, or leaked keys — break systems far more often than the underlying math does.

In authorised security work, decrypting captured or stored data must stay inside your engagement scope. Recovering keys and plaintext from systems you do not own or have written permission to test is illegal. This kind of analysis appears legitimately in digital forensics and malware analysis, where investigators work on evidence they are cleared to examine.

## Where decryption happens

- **Data at rest:** encrypted disks, backups, and databases are decrypted transparently once the correct key or passphrase unlocks the volume.
- **Data in transit:** browsers and servers decrypt TLS traffic on the fly so applications see plaintext while the wire stays protected.
- **Secure messaging:** end-to-end encrypted apps decrypt only on the recipient's device, so the provider never sees the message.
- **Signed and encrypted files:** GPG and similar tools decrypt archives, emails, and release artifacts for the intended holder of the private key.

## Key management decides everything

The strongest cipher is worthless if the key leaks. A stolen decryption key hands an attacker the plaintext instantly — no cryptanalysis required, and this is how most real breaches unfold. Treat keys as the crown jewels:

- Store keys in a hardware security module, OS keystore, or a dedicated secrets manager — never hard-coded in source or config files.
- Rotate keys on a schedule and immediately after any suspected exposure.
- Enforce least privilege so only the services and people that must decrypt can reach a key.
- Protect passphrases with a modern key-derivation function (PBKDF2, scrypt, or Argon2) so a weak password does not become a weak key.

Applying these habits when you build systems is a core part of [secure coding](/en/page-secure-coding) — the goal is that even an attacker who captures your ciphertext gains nothing without the key.
