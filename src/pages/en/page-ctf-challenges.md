---
title: Capture The Flag (CTF) Challenges
description: Learn how Capture The Flag challenges work, their categories and tooling, the best practice platforms, and how CTFs build real ethical hacking skills.
layout: ../../layouts/MainLayout.astro
---

Capture The Flag (CTF) challenges are legal, sandboxed hacking competitions where you exploit deliberately vulnerable targets to recover a hidden string, the "flag", and prove it with points. They are the single fastest way to turn theory into skill, because every flag you submit is proof that an exploit actually worked.

A flag is usually a token in a fixed format, such as `flag{y0u_f0und_th3_b4ckd00r}` or `picoCTF{...}`. You find it by breaking something on purpose in an environment built to be broken, so there is no ambiguity about scope or permission.

## Why CTFs Are Worth Your Time

- **Real feedback, not vibes.** A challenge either yields the flag or it does not. That binary result forces you to understand the target rather than memorize commands.
- **Breadth on demand.** One event might mix web, crypto, and binary exploitation, exposing you to techniques you would never touch in day-to-day work.
- **A safe place to fail.** You can throw malformed input, fuzz endpoints, and pop shells without legal risk, unlike attacking systems you do not own. See [Legal and Ethical Considerations in Hacking](/en/page-legal-ethical) for where the boundaries sit outside the arena.
- **A hiring signal.** CTF write-ups and team rankings are concrete, verifiable evidence of practical ability that a certificate alone cannot show.

## Competition Formats

**Jeopardy** is the most common format for beginners. Challenges sit in a grid grouped by category and point value; higher points mean harder problems. You solve them in any order and submit flags to a scoreboard. picoCTF and most online events use this style.

**Attack-Defense** gives each team an identical vulnerable server. You patch your own services to keep them running while exploiting the same bugs on every other team's box. It rewards speed, automation, and understanding both offense and defense at once.

**King of the Hill (KotH)** puts everyone on the same target; whoever compromises it and holds control the longest scores. Expect to fight off other players who are actively kicking you out.

## The Core Categories

### Web Exploitation

You attack a running web application to bypass auth, leak data, or gain code execution. Classic bugs include SQL injection, cross-site scripting (XSS), server-side request forgery (SSRF), insecure deserialization, and path traversal. An intercepting proxy is essential for reading and tampering with requests.

```bash
# Probe a login form for a classic SQL injection
curl -s "https://target.ctf/login" \
  --data "user=admin'--&pass=x"

# Automate confirmation and extraction (authorised targets only)
sqlmap -u "https://target.ctf/item?id=1" --batch --dbs
```

Deepen this track with the [Web Hacking](/en/page-web-hacking) chapter, which covers these bug classes and the intercepting-proxy workflow in detail.

### Cryptography

Crypto challenges hand you ciphertext, a weak scheme, or a flawed implementation and ask you to recover the plaintext. Real events rarely need you to break AES; they punish misuse, such as reused nonces, tiny RSA exponents, ECB mode leaking patterns, or predictable keys. [CyberChef](https://gchq.github.io/CyberChef/) is great for quick encoding work, while Python handles the math.

```python
# Small-modulus RSA: factor n, then decrypt
from sympy import factorint
from Crypto.Util.number import inverse, long_to_bytes

n, e, c = 3233, 17, 2790
p, q = factorint(n)            # the two prime factors, 53 and 61
d = inverse(e, (p - 1) * (q - 1))
print(long_to_bytes(pow(c, d, n)))
```

Ground yourself in the fundamentals with the [Cryptography](/en/page-cryptography) chapter before tackling these.

### Reverse Engineering

You get a compiled binary and must work out what it does, often to find a hardcoded password or reconstruct the flag-checking logic. Static analysis with a disassembler plus dynamic analysis in a debugger is the standard workflow.

```bash
strings -n 6 challenge          # cheap first look for readable secrets
file challenge                  # architecture and format
# then open in Ghidra (free, NSA) or radare2 / Cutter for the decompile
```

### Binary Exploitation (pwn)

Pwn challenges make you exploit memory-corruption bugs, buffer overflows, format strings, use-after-free, to hijack execution and spawn a shell. Modern targets are protected by ASLR, stack canaries, NX, and PIE, so you chain techniques like return-oriented programming (ROP). The `pwntools` library is the community standard for scripting exploits.

```python
from pwn import *

io = process("./vuln")            # or remote("host", 1337)
payload = b"A" * 72 + p64(0x401156)   # overflow, then jump to win()
io.sendline(payload)
io.interactive()
```

Debug with GDB plus an enhancement like pwndbg or GEF, which annotate registers, the stack, and memory as you step through the crash.

### Forensics

Forensics gives you an artifact, a packet capture, disk image, or memory dump, and asks you to reconstruct what happened or extract hidden data. Carve files, follow TCP streams, and inspect metadata.

```bash
binwalk -e evidence.bin           # detect and extract embedded files
tshark -r capture.pcap -Y http.request -T fields -e http.host -e http.request.uri
exiftool suspicious.jpg           # metadata often hides the flag
```

This overlaps heavily with real-world [Forensics](/en/page-forensics) and network-traffic analysis.

### Steganography

Stego hides data inside an otherwise normal file. Flags live in the least-significant bits of an image, in an appended ZIP, in spectrogram audio, or behind a password in an embedded stream. Tools like `zsteg`, `steghide`, and `stegsolve` speed up the search, but always start with `binwalk` and `strings`.

### OSINT and Miscellaneous

Open-source intelligence challenges ask you to pivot from a username, image, or coordinate to a fact hidden in public data. Misc catches everything else: esoteric encodings, scripting puzzles, and jailbreaks. Both reward patience and a wide toolbox.

## Where to Practice

Start with something forgiving before you enter a timed event:

- **picoCTF** is the classic on-ramp, beginner-friendly, always available, with guided challenges.
- **OverTheWire (Bandit)** teaches Linux and the shell one SSH level at a time, ideal if the command line still feels unfamiliar.
- **TryHackMe** and **Hack The Box** offer guided rooms and standalone vulnerable machines that blur into full penetration-testing practice.
- **PortSwigger Web Security Academy** is the definitive free lab set for web bugs.
- **CTFtime.org** lists upcoming live competitions and archives team rankings and write-ups.

## How to Actually Get Better

Reading solutions is not the same as solving. Build the loop that produces real skill:

1. **Enumerate first.** Understand the target before touching it. In machine-style challenges that means thorough port and service scanning, then reading every response carefully.
2. **Pick one category and go deep.** Breadth comes later; early on, momentum comes from getting genuinely good at one track.
3. **Script your wins.** Turn repeated steps into reusable [Python](/en/page-7) tools so you move faster next time.
4. **Write it up.** After each solve, record the vulnerability, the exploit, and the fix in your own words. Explaining the bug is what cements it.
5. **Join a team.** Diverse skills cover more categories, and a good teammate's approach to a stuck challenge teaches more than any tutorial.

## Hands-on Lab: Your First Flags on OverTheWire Bandit

Bandit is the ideal first target: it is always online, explicitly built to be attacked, and each level's password is the "flag" you carry to the next. All you need is an SSH client. The lab runs entirely against OverTheWire's own servers, so it stays firmly inside the arena.

1. **Connect to level 0.** The starting password is `bandit0`.

   ```bash
   ssh bandit0@bandit.labs.overthewire.org -p 2220
   ```

2. **Level 0 to 1: read the obvious file.** The password for the next level sits in your home directory.

   ```bash
   ls -la
   cat readme
   ```

3. **Level 1 to 2: a file named `-`.** A leading dash looks like an option flag to most tools, so you must reference it by path.

   ```bash
   cat ./-
   ```

4. **Level 2 to 3: spaces in the filename.** Quote it, or let tab-completion escape it for you.

   ```bash
   cat "spaces in this filename"
   ```

5. **Level 3 to 4: a hidden dotfile.** Regular `ls` hides it; `-a` reveals it inside `inhere/`.

   ```bash
   cd inhere
   ls -a
   cat ./...Hiding-From-You
   ```

Log out with `exit`, then reconnect as `bandit4` using the password you just recovered and keep climbing. Each level teaches one shell fundamental, argument parsing, quoting, file metadata, so you build the muscle memory a timed Jeopardy event assumes you already have. If any step feels unfamiliar, the [The Linux Shell](/en/page-linux-shell) chapter covers the exact commands in depth. Once you clear the early levels, [script your repeated moves in Python](/en/page-7) so you spend brainpower on the puzzle, not on typing.

## Staying Ethical

CTFs are legal precisely because the targets are provided for you to attack. The reflex you must carry out of the arena is scope: the exact same SQL injection that scores a flag is a crime against a system you were not authorised to test. Sharpen your skills freely inside the arena, and never let that muscle memory fire against a target without written permission.
