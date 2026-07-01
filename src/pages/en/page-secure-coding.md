---
title: Secure Coding
description: "Secure coding in practice: input validation, parameterized queries, safe auth, password hashing, and the OWASP Top 10 to ship software attackers can't break."
layout: ../../layouts/MainLayout.astro
---

Most breaches start with an ordinary bug: a query built from user input, a missing access check, a password stored the wrong way. Secure coding is the discipline of writing software so those bugs never ship in the first place, treating security as a property of the code rather than a scanner you run at the end.

## Why It Matters

A vulnerability found in production is expensive to fix, often public, and sometimes catastrophic. The same flaw caught during code review costs minutes. Building security in from the start protects user data, keeps you inside regulations like GDPR, PCI DSS, and HIPAA, and denies attackers the low-effort footholds they rely on. Every class of bug you eliminate at the source is one an adversary can never exploit later. For the attacker's-eye view of what these flaws enable, see [Web Hacking](/en/page-web-hacking) and [Vulnerability](/en/page-vulnerability).

## The OWASP Top 10 as a Map

The OWASP Top 10 (2021 edition) is the industry-standard shortlist of what actually goes wrong in web applications. Treat it as a checklist for design and review:

- **A01 Broken Access Control** — users reaching data or actions they should not.
- **A02 Cryptographic Failures** — weak, missing, or misused encryption.
- **A03 Injection** — SQL, OS command, LDAP, and cross-site scripting (XSS).
- **A04 Insecure Design** — missing controls baked into the architecture.
- **A05 Security Misconfiguration** — default credentials, verbose errors, open buckets.
- **A06 Vulnerable and Outdated Components** — unpatched libraries and dependencies.
- **A07 Identification and Authentication Failures** — weak login and session handling.
- **A08 Software and Data Integrity Failures** — untrusted updates and deserialization.
- **A09 Security Logging and Monitoring Failures** — attacks that go unnoticed.
- **A10 Server-Side Request Forgery (SSRF)** — the server tricked into making requests on an attacker's behalf.

The rest of this page turns the most common of these into concrete coding habits.

## Validate Input, Encode Output

Never trust data that crossed a boundary — form fields, headers, query strings, uploaded files, API payloads. Validate with an **allowlist**: define what is acceptable and reject everything else, rather than trying to blocklist known-bad patterns.

Injection ([A03](#the-owasp-top-10-as-a-map)) is defeated at the point where data meets an interpreter. For databases, that means parameterized queries so user input is never concatenated into a statement. Read more in [SQL Injection (SQLi)](/en/page-sql-injection).

```python
# Vulnerable: input is glued straight into the SQL string
query = "SELECT * FROM users WHERE email = '" + email + "'"

# Safe: the driver binds the value as a parameter, never as code
cursor.execute(
    "SELECT * FROM users WHERE email = %s",
    (email,),
)
```

Cross-site scripting is the mirror image: it happens on output. Encode data for the context it lands in (HTML body, attribute, JavaScript, URL) and let a mature template engine escape by default instead of building markup by hand.

```javascript
// Vulnerable: attacker-controlled name is parsed as HTML
element.innerHTML = "Welcome, " + userName;

// Safe: assigned as text, so <script> stays inert
element.textContent = "Welcome, " + userName;
```

## Authenticate and Authorize Deliberately

Authentication proves _who_ a user is; authorization decides _what_ they may do. Confusing the two is the root of broken access control. Check permissions on the server for every sensitive action — never rely on a hidden button or a client-side flag, and never trust an object ID just because it arrived in a request.

Store passwords with a slow, salted hash designed for the job: **Argon2id** (preferred), **scrypt**, or **bcrypt**. Never use plain SHA-256 or MD5, and never store passwords reversibly.

```python
from argon2 import PasswordHasher

ph = PasswordHasher()  # sensible memory/time defaults, per-hash salt
stored = ph.hash("correct horse battery staple")

# On login
try:
    ph.verify(stored, submitted_password)
except Exception:
    reject_login()
```

Add [Two-Factor Authentication (2FA)](</en/page-two-factor-authentication-(2fa)>) for accounts that matter, guide users toward [Secure Passwords](/en/page-secure-passwords), and issue session tokens that are random, expiring, and revocable.

## Protect Data at Rest and in Transit

Sensitive data should be encrypted in transit with TLS and at rest with vetted algorithms. Do not invent your own crypto or hardcode keys in source — use a maintained library and a proper secrets manager or key vault. The essentials of choosing and using these primitives are covered in [Cryptography](/en/page-cryptography) and [Encryption](/en/page-encryption).

## Fail Safely, Log Deliberately

Error handling is a security control. A stack trace or database message returned to the user hands an attacker a map of your internals. Show a generic message to the client, log the full detail server-side, and default to _deny_ when something goes wrong.

```python
try:
    process_payment(order)
except PaymentError:
    log.exception("payment failed for order %s", order.id)  # detail stays internal
    return render("error.html", message="Something went wrong. Please try again.")
```

Log authentication attempts, access-control decisions, and input-validation failures — but never log passwords, tokens, or full card numbers. Silent applications let attackers work undisturbed, which is exactly what A09 warns against.

## Manage Your Dependencies

Modern applications are mostly other people's code. A single outdated library can carry a critical flaw — sometimes a [Zero-Day Exploit](/en/page-zero-day-exploit) — straight into your product. Keep a software bill of materials, run automated dependency scanning (`npm audit`, `pip-audit`, GitHub Dependabot, or OWASP Dependency-Check), and patch on a schedule rather than in a panic.

```bash
# Surface known-vulnerable packages before you ship
npm audit
pip-audit
```

## Build Security Into the Workflow

Secure coding is a habit reinforced by process, not a one-off task:

1. **Threat model early.** Before writing code, ask what an attacker would target and where trust boundaries lie. This is where [Insecure Design](#the-owasp-top-10-as-a-map) is prevented.
2. **Automate the boring checks.** Wire static analysis (SAST) and dependency scanning into CI so risky patterns fail the build.
3. **Test like an attacker.** Complement automated scans with dynamic testing using tools such as [Burp Suite](/en/page-burp-suite).
4. **Review with security in mind.** Peer review that specifically hunts for injection, missing authorization, and secret leakage catches what tools miss.
5. **Keep learning.** New attack classes appear constantly; treat the OWASP guides and your own post-incident reviews as required reading.

## Hands-on Lab: Catch and Kill an Injection Before It Ships

Do this in a disposable [lab VM](/en/page-3) you own — never against code or systems you are not authorised to touch.

1. Create a working directory and a Python virtual environment, then install a static analysis engine and a dependency auditor:

```bash
mkdir secure-coding-lab && cd secure-coding-lab
python3 -m venv venv && source venv/bin/activate
pip install semgrep pip-audit
```

2. Save a deliberately vulnerable snippet as `login.py`:

```python
import sqlite3

def find_user(db, email):
    cur = db.cursor()
    # Vulnerable: input concatenated straight into the query
    cur.execute("SELECT * FROM users WHERE email = '" + email + "'")
    return cur.fetchone()
```

3. Scan it with the community OWASP ruleset. Semgrep flags the string-built query as a SQL-injection risk and points at the exact line:

```bash
semgrep --config p/owasp-top-ten login.py
```

4. Fix the finding by binding the value as a parameter, then re-scan — the rule should now pass clean:

```python
cur.execute("SELECT * FROM users WHERE email = ?", (email,))
```

5. Prove the supply-chain angle. Pin an old release with a published advisory, then let `pip-audit` catch it:

```bash
pip install "jinja2==2.11.2"
pip-audit
```

Watch it report the advisory and recommend an upgrade. Bump the version, re-run, and confirm the report comes back empty.

Now wire both commands into CI: any pull request that reintroduces either pattern fails the build automatically, turning a one-time exercise into a permanent guardrail. Pair this with the manual, attacker-minded testing habits from [Python & Scripting in Hacking](/en/page-7).

Secure code is not written once and forgotten. It is validated at every input, checked at every boundary, and revisited every time the threat landscape shifts — which, in this field, is always.
