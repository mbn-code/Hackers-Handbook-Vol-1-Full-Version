---
title: Burp Suite
description: Master Burp Suite, PortSwigger's industry-standard web proxy. Learn how Proxy, Repeater, Intruder, and Decoder uncover web application vulnerabilities.
layout: ../../layouts/MainLayout.astro
---

Burp Suite, built by PortSwigger, is the tool most professional testers reach for when assessing web applications. It sits between your browser and the target so you can read, edit, replay, and analyse every HTTP request and response. Everything below assumes you are testing systems you own or have written permission to test.

## What Burp Suite Actually Does

At its core, Burp is an intercepting proxy. Normally your browser talks straight to a web server. With Burp in the middle, each request pauses so you can inspect it, change it, forward it, or drop it before the server ever sees it. Responses flow back through Burp the same way.

That vantage point matters because the browser is a poor place to enforce security. Hidden form fields, disabled buttons, and JavaScript checks are all suggestions the client can ignore. Burp lets you see the raw traffic and treat those client-side rules as optional, which is exactly how an attacker sees them too. It is a central skill for serious [Web Hacking](/en/page-web-hacking).

## Why the Proxy Position Is So Powerful

Because Burp captures traffic after the browser has done its work, you can send values the interface would never let you submit. That is how testers surface flaws such as [SQL Injection](/en/page-sql-injection), Cross-Site Scripting (XSS), broken access control, and business-logic errors like trusting a price the client sends.

Consider a checkout form with a hidden field:

```html
<input type="hidden" name="price" value="100.00" />
```

The browser won't let you edit it, but the field is just text in an HTTP request. Intercept the checkout, change `price` to something else, forward it, and watch the server's response. On an application you are authorised to test, this proves whether the server re-validates prices or blindly trusts the client. The defensive lesson is blunt: never trust client-supplied data. Validate and recalculate everything server-side, a habit covered in [Secure Coding](/en/page-secure-coding).

## The Tools Inside Burp

Burp Suite Community Edition is free and ships with Kali Linux. It covers most learning and manual-testing needs; the paid Professional edition adds the automated scanner and lifts Community's throttling on some tools.

### Proxy

The heart of the suite. Toggle **Intercept** on the Proxy tab to hold requests for editing, or leave it off and browse normally while every request is logged in the HTTP history for later review.

### Repeater

Send an interesting request to Repeater and you can tweak and resend it as many times as you like, watching how each change affects the response. It is the fastest way to hand-test a single parameter for injection or logic flaws without clicking through the site again.

### Intruder

Intruder automates sending many payloads into chosen positions in a request. Testers use it to fuzz parameters, enumerate hidden directories, or run a [Brute Force Attack](/en/page-brute-force-attack) against a login form on an authorised target. In Community Edition, Intruder runs at a deliberately throttled speed; Professional removes that limit.

### Decoder and Comparer

Web apps constantly encode data (Base64, URL, hex). Decoder encodes and decodes these formats so you can read what is really being sent, and Comparer diffs two responses byte by byte to spot subtle differences, useful when a small change quietly alters server behaviour.

Community also includes **Sequencer** (which measures the randomness of session tokens) and the **BApp Store**, a catalogue of extensions that add capabilities like extra scanning and payload generators.

## Setting Up Burp Suite

The quickest path is Burp's own browser, which is preconfigured and needs no certificate work.

1. **Launch Burp Suite.** On Kali Linux or Parrot OS it is in the applications menu. Start a temporary project with the default settings.
2. **Open the built-in browser.** Go to **Proxy > Intercept** and click **Open Browser**. Traffic from this Chromium instance routes through Burp automatically.

To use your everyday browser instead, point it at Burp's proxy and trust its certificate:

1. **Set the proxy.** Configure the browser (a switcher extension like FoxyProxy makes this painless) to use `127.0.0.1` on port `8080` as its [Proxy Server](/en/page-proxy-server).
2. **Install the CA certificate.** Burp decrypts HTTPS by presenting its own certificate, so browse to `http://burp`, download the PortSwigger CA cert, and import it into the browser's trust store. Without it you'll get certificate warnings on every HTTPS site. This is the same trust model that underpins a normal [SSL Certificate](/en/page-ssl-certificate).

## Common Mistakes That Trip People Up

New users lose hours to the same handful of snags. Knowing them ahead of time saves a lot of frustration.

**Leaving Intercept on.** If pages hang and the browser spins forever, Burp is probably holding every request on the Proxy tab. Toggle **Intercept off** and browse normally; the traffic still lands in HTTP history for review. Turn interception on only for the moment you want to tamper with a request.

**Never setting scope.** Without a target scope, HTTP history fills with analytics, update pings, and CDN noise until the real requests are impossible to find. Go to **Target > Scope**, add your authorised host, then enable **Show only in-scope items**. This also keeps stray tools from touching anything you are not permitted to test.

**Skipping the CA certificate.** If HTTPS sites throw certificate errors, Burp cannot decrypt the traffic. Import the PortSwigger CA as described above. To confirm the proxy is actually working, route a request through it manually:

```bash
curl -x http://127.0.0.1:8080 --cacert burp-ca.crt https://target.lab/
```

A clean response means interception and the certificate are both set up correctly.

**Fighting the loopback.** Many browsers bypass the proxy for `localhost` and `127.0.0.1`, so traffic to a local app never reaches Burp. Give the target a real hostname (add it to `/etc/hosts`) and browse to that instead. See [localhost](/en/page-localhost) for why the loopback behaves differently.

**Blaming Intruder for being slow.** Community Edition throttles Intruder on purpose. That lag is a licensing limit, not a bug, and it makes Community a poor choice for a large [Brute Force Attack](/en/page-brute-force-attack). Use Repeater for careful manual work, or the Professional edition when you genuinely need speed.

## Practise Legally

Point Burp only at targets you are allowed to touch. Stand up a deliberately vulnerable box like [Metasploitable](/en/page-metasploitable), use PortSwigger's own free Web Security Academy labs, or work through [CTF Challenges](/en/page-ctf-challenges) on platforms such as Hack The Box. Intercepting traffic to sites you do not own is illegal in most jurisdictions, no matter how educational your intent.
