---
title: Virtual Private Network (VPN)
description: A VPN encrypts all your traffic through a secure tunnel, hiding your IP and browsing from ISPs and local attackers. Learn how VPNs really work.
layout: ../../layouts/MainLayout.astro
---

A **Virtual Private Network (VPN)** creates an encrypted tunnel between your device and a remote server, so anyone watching the network in between sees only unreadable ciphertext instead of your traffic. It is a baseline privacy tool for everyday users and a routine part of an authorised tester's setup when they need to control the source [IP address](/en/page-ip) of their traffic.

## How a VPN Works

A VPN client on your device establishes a session with a VPN server and wraps your traffic in an encrypted layer before it leaves the machine.

1. The client and server authenticate each other and negotiate keys, then use strong [cryptography](/en/page-cryptography) to encrypt your traffic.
2. Encrypted packets travel to the VPN server. Your Internet Service Provider (ISP), or an attacker eavesdropping on the same Wi-Fi, sees only an encrypted stream to a single endpoint — not the sites you visit.
3. The server decrypts your traffic and forwards it to its destination.
4. Responses return through the same tunnel. To the destination site, the request appears to come from the VPN server's IP, masking your real address.

The strength of that protection depends entirely on the underlying protocol.

## Common VPN Protocols

- **WireGuard** — a modern, lean protocol with a small codebase, fast handshakes, and strong default cryptography. It has become the preferred choice for new deployments.
- **OpenVPN** — mature, heavily audited, and highly configurable. It runs over TLS and can use TCP 443 to blend in with normal HTTPS traffic, which helps it slip past restrictive firewalls.
- **IKEv2/IPsec** — stable and quick to reconnect when a network changes, which makes it a common default on mobile devices.

Avoid legacy PPTP entirely; its encryption is broken and offers no meaningful protection.

## Why Use a VPN

- **Untrusted networks:** Open Wi-Fi at airports and cafes is easy to abuse. An attacker on the same segment can attempt a [man-in-the-middle attack](/en/page-packet-sniffing) to capture cookies or credentials. A VPN keeps that traffic unreadable to them.
- **Hiding your source IP:** During authorised testing, a VPN gives you a consistent, controlled egress address and prevents your ISP-assigned IP from appearing in a target's logs.
- **Bypassing network filtering:** Routing through a server in another location can restore access to sites blocked by a local network or ISP.
- **Remote corporate access:** Organisations use VPNs so employees can reach internal systems from outside the office over an encrypted link.

## What a VPN Does Not Do

A VPN is not anonymity, and treating it as such is a common mistake. It moves trust from your ISP to your VPN provider — that provider can still see your traffic patterns. It does not stop tracking cookies, browser fingerprinting, or you logging into an account that identifies you. For a broader threat model, see [anonymity and privacy](/en/page-anonymity-privacy).

Two leaks routinely undermine a VPN even when the tunnel is up:

- **DNS leaks**, where lookups bypass the tunnel and reveal the domains you visit to your ISP.
- **WebRTC leaks** in browsers, which can expose your real IP through peer-to-peer APIs.

A good client mitigates both and includes a **kill switch** that blocks all traffic if the tunnel drops, preventing accidental exposure.

## VPN vs. Proxy Server

A [proxy server](/en/page-proxy-server) also hides your IP, but it usually serves a single application, such as a browser, and often provides no encryption. A VPN operates at the operating-system level and encrypts every connection leaving the device — browser, game client, or terminal command alike.

## A Warning About Free VPNs

Running a fast, global server network is expensive, so a genuinely free VPN has to make money somehow. Many free providers log browsing activity and sell it to advertisers, which defeats the entire point. Prefer a reputable provider with an independently audited **no-logs** policy, and remember that "no-logs" is only as trustworthy as the audit behind it.
