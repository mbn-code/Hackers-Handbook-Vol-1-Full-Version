---
title: Web Hacking
description: "Learn ethical web application hacking: the OWASP Top 10, SQL injection, XSS, broken access control, Burp Suite recon, defensive fixes, and bug bounties."
layout: ../../layouts/MainLayout.astro
---

The browser is now the front door to almost every application we use, which makes the web the single largest attack surface most organisations expose. Web hacking is the discipline of understanding how a site talks to its backend, then probing that conversation for logic the developers never intended.

Everything here is written for legitimate, authorised testing: your own lab, an intentionally vulnerable target, or a program that has given you written permission. Testing an application you do not own or have no scope for is a crime in most jurisdictions, no matter how curious you are.

<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/sqlmap-walkthrough-poster.png">
    <source src="/en/videos/sqlmap-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/sqlmap-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>Finding and exploiting an injectable parameter with <code>sqlmap</code> on an authorised web app.</figcaption>
</figure>

## How Web Applications Actually Work

A web app is a conversation. Your browser sends an HTTP request (a method, a URL, headers, and often a body of parameters); the server runs some code, touches a database, and sends back an HTTP response. Almost every web vulnerability comes down to one idea: **the server trusts data from the client that it should have treated as hostile.**

Because the client is fully under your control, you can inspect and edit every byte before it leaves your machine. An intercepting proxy sits between the browser and the server so you can pause, read, and modify traffic. [Burp Suite](/en/page-burp-suite) is the industry standard; the open-source OWASP ZAP is a capable alternative. Getting comfortable reading raw requests is the real skill, so it helps to know the basics of [HTTP and networking](/en/page-networking) first.

```http
POST /login HTTP/1.1
Host: target.example
Content-Type: application/x-www-form-urlencoded

username=alice&password=hunter2
```

Every field in that request, plus the headers and cookies, is attacker-controllable input.

## The OWASP Top 10 (2025)

The Open Web Application Security Project publishes the field's most widely used risk list. The current edition is **2025**; learn these ten categories and you understand the shape of most real-world findings.

- **A01 – Broken Access Control** (SSRF is now folded in here)
- **A02 – Security Misconfiguration**
- **A03 – Software Supply Chain Failures**
- **A04 – Cryptographic Failures**
- **A05 – Injection** (SQL injection and cross-site scripting both live here)
- **A06 – Insecure Design**
- **A07 – Authentication Failures**
- **A08 – Software or Data Integrity Failures**
- **A09 – Security Logging and Alerting Failures**
- **A10 – Mishandling of Exceptional Conditions**

A few of these deserve a closer look.

### A01: Broken Access Control

The most common category in the 2025 list. It covers any case where a user can act outside their intended permissions. A classic example is an **Insecure Direct Object Reference (IDOR)**: the app trusts an ID in the URL without checking that the object belongs to you.

```bash
# Your own invoice loads fine...
curl -H "Cookie: session=YOUR_TOKEN" https://target.example/api/invoices/1043

# ...does changing the ID leak someone else's data?
curl -H "Cookie: session=YOUR_TOKEN" https://target.example/api/invoices/1044
```

If the second request returns another user's invoice, the server is authenticating you but never checking authorisation. The fix is to enforce ownership and role checks server-side, on every request, and deny by default.

### A03: Software Supply Chain Failures

Modern apps are assembled from hundreds of third-party libraries. A single unpatched dependency with a public [vulnerability](/en/page-vulnerability) can hand an attacker remote code execution before any custom code is even touched. The 2025 list renamed the old "Vulnerable and Outdated Components" entry and widened it to the whole supply chain — build pipelines, package registries, and update channels included. Track your software bill of materials and patch on a schedule — this is boring, and it prevents a huge share of real breaches.

### A05: Injection

Injection flaws occur when untrusted input is mixed into a command or query that an interpreter then executes. [SQL injection](/en/page-sql-injection) is the textbook case: input is concatenated straight into a database query, so crafted input changes the query's meaning.

```sql
-- The app builds this query by string concatenation (the bug):
SELECT * FROM users WHERE name = '$input';

-- Supplying  ' OR '1'='1  as input turns the condition always-true:
SELECT * FROM users WHERE name = '' OR '1'='1';
```

The defence is not "filter bad characters" — it is **parameterised queries** (prepared statements), which send code and data on separate channels so input can never be parsed as SQL:

```python
# Safe: the driver binds `name` as data, never as code
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
```

**Cross-site scripting (XSS)** is the other member of this category. Here the interpreter is the victim's browser: the app reflects or stores attacker input into a page without encoding it, and the browser runs it as JavaScript.

```html
<!-- A harmless proof-of-concept an authorised tester uses to confirm XSS -->
<script>
  alert(document.domain);
</script>
```

In a real attack, that script would steal session cookies or redirect the user to a [phishing](/en/page-phishing-attack) page. The fix is context-aware **output encoding** plus a strong Content-Security-Policy header. Injection, IDOR, and XSS are all symptoms of the same root cause, which is why [secure coding](/en/page-secure-coding) practices matter more than any single filter.

## A Methodology for Finding Web Vulnerabilities

Effective testing is systematic, not lucky guessing.

**1. Map the target.** Walk the whole application through your proxy so it records every page, endpoint, and parameter. Brute-force discovery tools then reveal directories and files that aren't linked anywhere — old admin panels, backups, staging endpoints.

```bash
# Content discovery against a host you are authorised to test
ffuf -u https://target.example/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200,301,403
```

**2. Fuzz the inputs.** Feed unexpected characters — `'`, `"`, `<`, `../`, oversized values — into every parameter and watch how the server reacts. Burp Suite's Intruder or `ffuf` automates this. An error message, a change in response length, or a timing delay is often the first thread to pull.

**3. Test the business logic.** The bugs scanners miss live here: can you apply a discount twice, skip a payment step, or reach step 3 of a checkout without completing step 2? These flaws are invisible to automation and are where skilled testers earn their keep.

**4. Verify, don't assume.** Confirm every finding with a minimal, non-destructive proof. A safe read of your own test account proves IDOR; you never need to exfiltrate real user data to demonstrate impact. Practising on legal targets like [CTF challenges](/en/page-ctf-challenges) is the right way to build this instinct.

## Defending Web Applications

The same knowledge that finds bugs closes them. Validate and encode all input at the point of use, use parameterised queries everywhere, enforce access control on the server for every request, keep dependencies patched, and set security headers (CSP, `HttpOnly` and `Secure` cookies, HSTS). A [web application firewall](/en/page-firewall) adds a useful layer, but treat it as a speed bump, not a substitute for fixing the underlying flaw.

## Hands-on Lab: Your First Authorised Web Pentest

Reading about bugs only takes you so far; you learn web hacking by breaking a target you are allowed to break. Everything below runs entirely inside your own [virtual machine](/en/page-3), so you never leave your lab.

**1. Deploy the target.** OWASP Juice Shop is a modern, deliberately insecure single-page app. Pull and run it with Docker:

```bash
docker run --rm -d -p 3000:3000 --name juice-shop bkimminich/juice-shop
```

Browse to `http://localhost:3000` to confirm it loads.

**2. Get in the middle.** Point your browser's proxy at [Burp Suite](/en/page-burp-suite) on `127.0.0.1:8080` and switch intercept on. Now every request the app makes is yours to read and edit.

**3. Map the surface.** While the proxy records traffic, brute-force hidden paths:

```bash
ffuf -u http://localhost:3000/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200,301,403
```

**4. Bypass the login.** On the login form, submit `' OR 1=1--` as the email with any password. The backend concatenates that string straight into its query, the `WHERE` clause becomes always-true, and you authenticate as the first row in the table — the administrator. This is the [SQL injection](/en/page-sql-injection) flaw from earlier, live.

**5. Hunt an IDOR.** Log in normally, open your basket, and find the `GET /rest/basket/<id>` request in Burp's history. Change that `<id>` to a different number and forward it — if another user's basket comes back, the server checked authentication but never ownership.

**6. Clean up.**

```bash
docker rm -f juice-shop
```

Work through Juice Shop's built-in challenge scoreboard next; each solved challenge maps to a category you now recognise.

## Bug Bounties and Staying Legal

Bug bounty programs let you practise these skills for real reward and full legal cover. Companies from Google to small startups publish scope rules and pay ethical hackers for vulnerabilities that are found and responsibly disclosed — sometimes handsomely. Read the scope, stay inside it, and report through the proper channel.

Only test applications you own, applications built to be attacked, or targets covered by an explicit bug bounty or engagement contract. That single rule is what separates a security researcher from a defendant, so keep the [legal and ethical](/en/page-legal-ethical) boundaries firmly in mind.
