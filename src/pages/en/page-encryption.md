---
title: Encryption
description: How encryption protects data with symmetric and asymmetric ciphers like AES and RSA, TLS in transit, encryption at rest, and post-quantum crypto.
layout: ../../layouts/MainLayout.astro
---

Encryption turns readable data into scrambled ciphertext that only someone holding the right key can reverse. It is the workhorse of modern security, protecting everything from HTTPS traffic and disk contents to chat messages and password managers. Understanding it is essential for both attacking and defending systems, and it sits at the heart of applied [cryptography](/en/page-cryptography).

## How Encryption Works

An encryption algorithm (a cipher) combines your **plaintext** with a **key** to produce **ciphertext**. Reversing the transformation to recover the plaintext is [decryption](/en/page-decryption), and it requires the correct key. The security of a good modern cipher rests entirely on the secrecy of the key, not the secrecy of the algorithm — a principle known as Kerckhoffs's principle. Public, heavily scrutinised algorithms like AES are trusted precisely _because_ everyone can inspect them.

Three components define any encryption scheme:

- **Algorithm:** The mathematical procedure. Use standard, peer-reviewed ciphers (AES, ChaCha20, RSA, ECC). Never roll your own crypto.
- **Key:** The secret that unlocks the data. Key length and randomness matter — AES-256 uses a 256-bit key; RSA needs 3072-bit keys or larger for comparable strength.
- **Mode / construction:** How the cipher processes data. Block ciphers like AES need an authenticated mode such as GCM to guarantee both confidentiality and integrity. Avoid ECB mode — it leaks patterns in the plaintext.


<figure class="hh-figure">
  <img src="/en/diagrams/symmetric-asymmetric.svg" alt="Symmetric vs. asymmetric encryption at a glance." loading="lazy" />
  <figcaption>Symmetric vs. asymmetric encryption at a glance.</figcaption>
</figure>

## Symmetric vs. Asymmetric Encryption

The two families solve different problems, and real systems usually combine them.

### Symmetric Encryption

The same key encrypts and decrypts. It is fast and ideal for bulk data, but both parties must already share the key over a secure channel.

- **AES (Advanced Encryption Standard):** The default for files, disks, and databases. AES-256-GCM is a common, strong choice.
- **ChaCha20-Poly1305:** A fast stream cipher favoured on mobile and platforms without AES hardware acceleration.

### Asymmetric Encryption

A mathematically linked key pair: a **public key** anyone can use to encrypt (or verify a signature) and a **private key** the owner keeps secret to decrypt (or sign). This solves key distribution without a pre-shared secret.

- **RSA:** Long-established, based on the difficulty of factoring large numbers.
- **Elliptic Curve Cryptography (ECC):** Achieves the same security as RSA with far smaller keys and less computation, so it dominates modern TLS and messaging.

In practice, protocols like TLS use asymmetric crypto once — to authenticate the server and negotiate a shared session key — then switch to fast symmetric encryption for the rest of the conversation.

## Encryption in Transit vs. at Rest

- **In transit:** Data moving across a network. TLS 1.3 protects HTTPS, and secure messaging apps add end-to-end encryption so not even the provider can read messages. A [VPN](/en/page-vpn) wraps traffic in an encrypted tunnel. Behind HTTPS sits a validated [SSL/TLS certificate](/en/page-ssl-certificate).
- **At rest:** Stored data. Full-disk encryption (LUKS, BitLocker, FileVault) protects laptops if they are lost or stolen; database and object-storage encryption protect data on servers and in the cloud.

```bash
# Encrypt a file with AES-256 using OpenSSL (PBKDF2 derives the key from a passphrase)
openssl enc -aes-256-cbc -pbkdf2 -salt -in secret.txt -out secret.enc

# Decrypt it again
openssl enc -d -aes-256-cbc -pbkdf2 -in secret.enc -out secret.txt

# Asymmetric encryption/signing with GPG
gpg --encrypt --recipient alice@example.com report.pdf
```

## Encryption Is Not Hashing

A frequent and dangerous confusion: passwords should **not** be encrypted. Encryption is reversible by design, so anyone with the key can recover the plaintext. Passwords should be **hashed** with a slow, salted function built for the job — Argon2id, bcrypt, or scrypt — which is a one-way transformation. See [secure passwords](/en/page-secure-passwords) for how to store credentials correctly rather than reversibly encrypting them.

Reserve encryption for data you legitimately need to read back later; use hashing when you only need to verify a value.

## Common Pitfalls

Strong ciphers fail when the surrounding implementation is weak. Watch for:

- **Bad key management.** A hardcoded key in source code or a key stored next to the ciphertext defeats the whole scheme.
- **Weak or reused randomness.** Nonces and initialisation vectors must be unpredictable and never reused with the same key.
- **Deprecated primitives.** MD5 and SHA-1 are broken for security use; SSL and TLS below 1.2 are obsolete. Prefer TLS 1.3.
- **No integrity check.** Encryption without authentication lets attackers tamper with ciphertext. Use authenticated encryption (AEAD) modes like GCM.

## Looking Ahead: Post-Quantum Cryptography

A sufficiently large quantum computer would break RSA and ECC by solving the hard math they rely on. In response, NIST standardised the first post-quantum algorithms in 2024 — ML-KEM (FIPS 203) for key exchange and ML-DSA (FIPS 204) for signatures. Major platforms and browsers have already begun deploying hybrid schemes that pair a classical key exchange with a post-quantum one, guarding against "harvest now, decrypt later" attacks where adversaries store encrypted traffic today to crack in the future.

Encryption is powerful, but only when the algorithm, keys, and implementation are all sound — a single weak link undoes the rest.
