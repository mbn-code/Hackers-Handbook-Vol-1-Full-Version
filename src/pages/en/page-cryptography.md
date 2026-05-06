---
title: Cryptography 
description: Explore the fundamentals of cryptography and how hackers crack secret codes.
layout: ../../layouts/MainLayout.astro
---

# The Art of Cryptography 

Cryptography is the practice of protecting information by transforming it into an unreadable format. It is the mathematical foundation that keeps the modern internet secure. 

Without cryptography, every email you send, every password you type, and every credit card transaction you make would be visible to anyone performing  [Packet Sniffing](page-packet-sniffing) on your network.

## Core Concepts 

There are three main branches of cryptography you need to understand:

### 1. Symmetric Encryption
In symmetric  [Encryption](page-encryption), the **same key** is used to both encrypt and decrypt the data. 
- Think of it like a physical padlock: the same physical key that locks the door is used to unlock it.
- **Common Algorithms:** AES (Advanced Encryption Standard).
- **The Hack:** If an attacker can steal the shared key, they can read all the communication.

### 2. Asymmetric (Public Key) Encryption
This was a revolutionary breakthrough. Asymmetric encryption uses a **pair of keys**:
- A **Public Key** that anyone in the world can see. It is used *only* to encrypt messages.
- A **Private Key** that is kept totally secret by the owner. It is used *only* to decrypt messages.
- **Example:** If Alice wants to send a secret message to Bob, she uses Bob's Public Key to lock the box. Once locked, not even Alice can unlock it. Only Bob's Private Key can open it.
- **Common Algorithms:** RSA, Elliptic Curve. This is the foundation of  [SSL Certificates](page-ssl-certificate) and secure web browsing (HTTPS).

### 3. Hashing
Unlike encryption, hashing is a **one-way function**. You put data in, and it spits out a fixed-length string of gibberish. You cannot reverse a hash back into the original data.
- **Why use it?** For passwords! Websites shouldn't store your actual password; they store the *hash* of your password. When you log in, they hash what you typed and compare it to the hash in the database.
- **Common Algorithms:** MD5 (Broken/Insecure), SHA-256 (Secure).

## How Hackers Break Cryptography 

Modern cryptographic algorithms like AES-256 are mathematically unbreakable with current technology. A hacker could guess keys for a billion years and still not break it. 

So, how do hackers steal encrypted data? **They don't attack the math; they attack the implementation.**

1. **Password Cracking:** If an attacker steals a database of password hashes, they can use tools like Hashcat or John the Ripper to run a  [Brute Force Attack](page-brute-force-attack). The tool hashes millions of guessed passwords a second until it finds a hash that matches the stolen one.
2. **Rainbow Tables:** Pre-computed tables of hashes for commonly used passwords.
3. **The "Rubber Hose" Attack:** Why spend years trying to decrypt a hard drive when you can just use  [Social Engineering](page-socialEngineering) (or a metaphorical rubber hose) to force the user to give you the password?

## Best Practices 

- **Salt Your Hashes:** Developers should always add random data (a "salt") to a password before hashing it. This completely defeats Rainbow Table attacks.
- **Use Strong Algorithms:** Never use outdated encryption like DES or broken hashing like MD5.
- **Protect the Keys:** The math is strong, but if a developer accidentally uploads their Private Key to a public GitHub repository, the game is over!
