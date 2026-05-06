---
title: Web Hacking 
description: An introduction to finding and exploiting vulnerabilities in web applications.
layout: ../../layouts/MainLayout.astro
---

# Web Application Hacking 

As more companies move their infrastructure to the cloud, the web browser has become the primary way we interact with software. As a result, **Web Hacking** is currently one of the most lucrative and highly demanded skills in cybersecurity.

Web hacking involves analyzing how a website communicates with its backend servers and manipulating that communication to make the application do things it wasn't designed to do. 

The primary weapon of choice for web hackers is  [Burp Suite](page-burp-suite), a tool that intercepts web traffic before it reaches the server.

## The OWASP Top 10 

If you want to learn web hacking, you must start with the **OWASP Top 10**. The Open Web Application Security Project (OWASP) regularly publishes a list of the 10 most critical web application security risks. Here are a few heavy hitters:

### 1. Injection (SQLi, Command Injection)
Injection flaws occur when untrusted user input is sent to an interpreter as part of a command or query. 
-  [SQL Injection (SQLi)](page-sql-injection) is the most famous. If a website asks for your username, and you type a piece of database code instead, a vulnerable website might execute your code, dumping all its user passwords directly onto your screen!

### 2. Broken Authentication
If a website poorly implements session management or login functions, an attacker can compromise passwords, keys, or session tokens. This allows the attacker to assume the identity of other users.

### 3. Cross-Site Scripting (XSS)
XSS occurs when an application includes untrusted data in a web page without proper validation. 
- **The Hack:** An attacker injects malicious JavaScript into a public forum post. When a normal user views the post, the script executes in their browser, potentially stealing their session cookies or redirecting them to a  [Phishing](page-5) site.

### 4. Broken Access Control
This happens when users can act outside of their intended permissions. For example, if a normal user alters the URL from `website.com/user/profile` to `website.com/admin/dashboard` and the server allows them in, that's a massive access control failure!

## Finding Web Vulnerabilities 

1. **Reconnaissance:** Hackers use tools to map out every single page, directory, and input field on a target website. They look for hidden admin panels or old, forgotten subdomains.
2. **Fuzzing:** Using  [Burp Suite Intruder](page-burp-suite), a hacker will send thousands of weird, unexpected characters (like `'`, `"`, `<script>`) to every input field to see if the server throws an error. An error often points to a vulnerability!
3. **Source Code Review:** If the application is open-source, or if the hacker can read the frontend JavaScript, they will read the code line-by-line looking for logical flaws.

## Bug Bounty Programs 

One of the coolest things about web hacking is **Bug Bounties**. Companies like Google, Apple, and Facebook will legally pay ethical hackers thousands (sometimes hundreds of thousands) of dollars if they find and securely report a vulnerability in their web applications!

*Remember: Only test web applications you have explicit permission to hack, or those that are part of an official Bug Bounty program.*
