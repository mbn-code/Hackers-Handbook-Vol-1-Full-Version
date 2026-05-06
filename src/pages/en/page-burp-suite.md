---
title: Burp Suite 
description: Learn about Burp Suite, the industry standard for web application security testing.
layout: ../../layouts/MainLayout.astro
---

# Web Hacking with Burp Suite 

When it comes to  [Web Hacking](page-web-hacking), there is one tool that reigns supreme: **Burp Suite**. Developed by PortSwigger, Burp Suite is an integrated platform for performing security testing of web applications. It is the industry standard for penetration testers worldwide.

## What is Burp Suite? 

Burp Suite acts as a **Local Proxy** between your web browser and the internet. When you type a URL into your browser, the request normally goes directly to the server. With Burp Suite running, the request is intercepted by Burp first. This allows you to view, modify, and even drop the request before it reaches the server. 

Think of it like a mail inspector. The mail (HTTP request) leaves your house (browser), gets intercepted at the post office (Burp Suite), where you can open it, change the contents, and send it on its way to the recipient (the web server). 

## Why is it so Powerful? 

By intercepting HTTP requests, you can manipulate data in ways that the web browser doesn't normally allow. This is incredibly useful for finding vulnerabilities like  [SQL Injection](page-sql-injection), Cross-Site Scripting (XSS), or bypassing client-side validation.

For example, a website might have a hidden form field for the price of an item:
`<input type="hidden" name="price" value="100.00">`

Normally, you can't change this in your browser. But with Burp Suite, you can intercept the checkout request and manually change the price to `0.01` before sending it to the server!

## Key Features of Burp Suite 

Burp Suite Community Edition (which is free and pre-installed on Kali Linux) comes with several powerful tools:

### 1. The Proxy 
This is the core of Burp Suite. It allows you to intercept and modify HTTP/S traffic passing in both directions.

### 2. The Repeater 
Once you've intercepted an interesting request, you can send it to the Repeater. Here, you can manually modify the request and send it over and over again to see how the server responds, without having to navigate through the web browser each time.

### 3. The Intruder 
The Intruder is a highly customizable tool for automating customized attacks. You can use it to perform a  [Brute Force Attack](page-brute-force-attack) against login pages, fuzz for hidden directories, or discover vulnerabilities by sending hundreds of modified payloads to a specific parameter.

### 4. The Decoder 
Web applications often encode data to pass it safely over the internet (like Base64 encoding). The Decoder tool lets you easily encode or decode data to understand what's actually being sent.

## Setting Up Burp Suite 

1. **Launch Burp Suite:** If you are using Kali Linux or Parrot OS, you can find it in your application menu. 
2. **Configure your Browser:** To route your traffic through Burp, you must configure your web browser (like Firefox) to use `127.0.0.1` on port `8080` as its  [Proxy Server](page-proxy-server). 
3. **Install the CA Certificate:** Because Burp Suite intercepts secure HTTPS traffic, you need to install PortSwigger's CA Certificate in your browser so it doesn't throw security warnings. (You can download this by visiting `http://burp` in your configured browser).

Alternatively, the newer versions of Burp Suite include a built-in Chromium browser that is already pre-configured! Just go to the **Proxy** tab, click **Intercept**, and click **Open Browser**.

## Learn More 

Mastering Burp Suite is essential if you want to get into web application penetration testing. If you want to practice your skills safely, try using Burp Suite against a vulnerable machine like  [Metasploitable](page-metasploitable) or participate in  [CTF Challenges](page-ctf-challenges) on platforms like Hack The Box.
