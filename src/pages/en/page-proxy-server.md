---
title: Proxy Servers 
description: Intermediary servers that act as a gateway between a user and the internet.
layout: ../../layouts/MainLayout.astro
---

# Proxy Servers 

A **Proxy Server** is an intermediary computer that sits between your device and the rest of the internet. 

When you use a proxy, your internet requests are sent to the proxy server first. The proxy server then makes the request to the website on your behalf, receives the webpage, and forwards it back to you. 

To the website, it looks like the proxy server is the one visiting, completely masking your real  [IP Address](page-ip)!

## Forward Proxies vs. Reverse Proxies 

### 1. Forward Proxy (Protecting the Client)
This is what most people mean when they say "proxy." It sits in front of a client (you) and forwards your requests to the internet.
- **Anonymity:** Hackers use proxies to hide their origin IP address while probing a target network. 
- **Bypassing Filters:** If your school or workplace blocks YouTube, you can connect to a proxy server. The firewall only sees you connecting to the proxy, and the proxy fetches YouTube for you!
- **Interception:** Tools like  [Burp Suite](page-burp-suite) act as a *Local Forward Proxy*, allowing a hacker to intercept and modify  [Web Hacking](page-web-hacking) traffic before it leaves their own computer.

### 2. Reverse Proxy (Protecting the Server)
A reverse proxy sits in front of a web server and forwards internet traffic *to* the server. 
- **Load Balancing:** Massive websites (like Netflix) use reverse proxies to distribute incoming traffic across hundreds of backend servers so no single server gets overwhelmed.
- **Security:** A reverse proxy hides the true IP address of the backend server. It can also act as a Web Application Firewall (WAF) to block malicious traffic (like  [SQL Injection](page-sql-injection)) before it ever reaches the vulnerable database.

## Proxy vs. VPN 

A proxy is very similar to a  [VPN (Virtual Private Network)](page-vpn), but there is one massive difference: **Encryption**.

Most standard proxies only route web traffic (HTTP/HTTPS) and they do not encrypt your connection to the proxy server itself. If you are on public Wi-Fi, someone using  [Packet Sniffing](page-packet-sniffing) can still see exactly what you are doing. 

A VPN, on the other hand, encrypts *all* traffic leaving your entire computer, offering significantly more privacy and security.
