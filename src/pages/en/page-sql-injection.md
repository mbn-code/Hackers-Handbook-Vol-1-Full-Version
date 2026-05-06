---
title: SQL Injection (SQLi) 
description: A hacking technique where an attacker injects malicious SQL queries to manipulate a database.
layout: ../../layouts/MainLayout.astro
---

# SQL Injection (SQLi) 

**SQL Injection** is one of the oldest, most famous, and most dangerous web vulnerabilities in existence. It occurs when a web application takes untrusted user input and inserts it directly into a backend database query without proper sanitization.

This allows an attacker to manipulate the  [Web Application](page-web-hacking) into executing malicious SQL (Structured Query Language) commands.

## How SQL Injection Works 

Imagine a login form. The PHP code running on the server might construct a database query that looks like this:

```sql
SELECT * FROM users WHERE username = 'USER_INPUT' AND password = 'PASSWORD_INPUT';
```

If a normal user types `admin` and `password123`, the query looks normal. But what if a hacker types `' OR '1'='1` into the username field, and leaves the password blank? The resulting query looks like this:

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '';
```

Because `1` always equals `1` (which is TRUE), the database returns the first user it finds,which is usually the site administrator! The hacker just bypassed the login screen without knowing the password!

## Types of SQL Injection 

1. **In-Band (Classic) SQLi:** The attacker uses the same channel of communication (the web page) to launch the attack and gather the results. E.g., injecting a `UNION` query to force the website to display credit card numbers on the screen.
2. **Inferential (Blind) SQLi:** The web application is vulnerable, but it doesn't display database errors on the screen. The attacker must ask the database True/False questions (e.g., "Does the admin password start with 'A'?") and observe how long the server takes to respond (Time-Based) to extract data character by character.
3. **Out-of-Band SQLi:** The attacker injects a command that forces the database server to make an external DNS or HTTP request back to a server the attacker controls.

## Tools of the Trade 

While manual SQL injection is an art form, hackers often automate the process using tools like `sqlmap` or by intercepting requests in  [Burp Suite](page-burp-suite).

## Defending Against SQLi 

SQL Injection is 100% preventable. 

Developers must use **Parameterized Queries (Prepared Statements)**. Instead of concatenating strings together, prepared statements force the database to treat user input *strictly* as data, not as executable code. Even if a user types `' OR '1'='1`, the database will literally look for a user whose name is exactly that string.
