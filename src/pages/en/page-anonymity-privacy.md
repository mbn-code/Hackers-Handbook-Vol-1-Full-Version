---
title: Anonymity and Privacy
description: "How anonymity and privacy actually work in ethical hacking: Tor, VPNs, proxychains, OPSEC, DNS and WebRTC leaks, and the real limits of each layer."
layout: ../../layouts/MainLayout.astro
---

Anonymity is not a checkbox you enable with one tool. It is the discipline of leaking as little identifying information as possible across every layer that touches a target, and understanding exactly what each protection does and does not hide. This page covers the tools and, just as importantly, their failure modes.

## Threat Model First

Before you install anything, answer one question: who are you hiding from? A privacy-conscious user avoiding ad trackers has a very different threat model than a red teamer whose traffic will be scrutinised by a client's blue team, or a researcher facing a nation-state adversary. The controls that defeat a casual observer are useless against an adversary who can correlate traffic at both ends of your connection.

For authorised engagements the goal is usually **attribution control**, not true anonymity: keeping test traffic cleanly separated from your real identity and infrastructure, and making sure the defenders see the activity you intend them to see. Anonymity used to evade authorisation is not ethical hacking; it is a crime. Keep your scope and rules of engagement in front of you, and read the [legal and ethical considerations](/en/page-legal-ethical) before you touch anything.

## The Tor Network

Tor (The Onion Router) routes your traffic through three volunteer-run relays, wrapping it in layered [encryption](/en/page-encryption) so no single relay knows both who you are and where you are going. The entry (guard) relay sees your real IP address but not your destination; the exit relay sees your destination but not your IP.

Use the **Tor Browser** rather than piping a normal browser through Tor. It ships a hardened Firefox that resists fingerprinting, disables risky plugins, and makes every user look alike. To send command-line tools over Tor, wrap them:

```bash
# Route a single command through Tor's SOCKS proxy (localhost:9050)
torsocks curl https://check.torproject.org

# Verify you are exiting through the Tor network
curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip
```

Tor's limits matter more than its strengths:

- **Exit nodes can read unencrypted traffic.** Anything not wrapped in TLS is visible to whoever runs the exit relay. Always use HTTPS.
- **It does not stop you deanonymising yourself.** Logging into a personal account, or leaking your identity in a payload, undoes everything.
- **A global adversary can correlate timing.** Tor does not defend against someone watching both the entry and exit simultaneously.
- **It is slow and conspicuous.** Many services block Tor exit ranges outright.

## VPNs: What They Actually Do

A [VPN](/en/page-vpn) encrypts traffic between you and the provider's server and swaps your IP for theirs. That defeats your ISP and local network snooping, and it is genuinely useful for tunnelling into a lab. What it does **not** do is make you anonymous: you have simply moved trust from your ISP to the VPN provider, who can see everything your ISP could.

Judge a provider on architecture, not marketing. A meaningful VPN runs diskless/RAM-only servers, has undergone an independent audit, and operates outside jurisdictions that compel logging. "No-logs" claims are only worth the audits and court records that back them. For engagement work, a VPS you control often gives cleaner, more honest attribution than a consumer VPN.

## Proxies and Chaining

[Proxy servers](/en/page-proxy-server) forward requests on your behalf and hide your source IP from the destination. SOCKS proxies are the workhorse for pivoting. `proxychains` forces other tools through one or more proxies, including Tor:

```bash
# /etc/proxychains4.conf — chain through Tor's SOCKS5 proxy
[ProxyList]
socks5  127.0.0.1 9050
```

```bash
# Run tooling through the chain
proxychains4 nmap -sT -Pn -p 80,443 target.example.com
```

Note that `nmap` through a TCP-only proxy must use a connect scan (`-sT`); raw SYN scans and UDP will not traverse a SOCKS tunnel. Chaining adds hops but multiplies latency and points of failure — more is not automatically safer.

## Where Anonymity Leaks

Most deanonymisation happens outside the tunnel you were watching. Close these gaps:

- **DNS leaks.** Your traffic may go through Tor or a VPN while DNS lookups quietly resolve through your ISP, revealing every domain you visit. Test at a DNS-leak checker and force DNS through the tunnel.
- **WebRTC leaks.** Browsers can expose your real local and public IP via WebRTC even behind a VPN. Disable it or use a browser that blocks it.
- **MAC address.** On hostile or monitored networks, randomise your hardware address before connecting:

```bash
# Randomise the MAC on interface wlan0 (interface must be down)
sudo ip link set wlan0 down
sudo macchanger -r wlan0
sudo ip link set wlan0 up
```

- **Browser fingerprinting.** Fonts, screen size, canvas rendering and extensions combine into a near-unique ID that survives IP changes. This is precisely what Tor Browser normalises.
- **Document metadata.** Screenshots, PDFs and photos carry EXIF, author names and GPS. Strip metadata before sharing any artefact.

For a clean-slate environment, boot **Tails** (amnesic, routes everything through Tor, forgets on shutdown) or run your tooling inside **Whonix**, which isolates the workstation from the Tor gateway so a compromised app still cannot see your real IP.

## Secure Communication

Compartmentalise your comms the same way you compartmentalise infrastructure. **Signal** provides audited end-to-end encryption for messages and calls, with minimal metadata retention. Encrypted email (PGP, or providers such as Proton Mail) protects message bodies but **not** the subject line, sender, recipient, or timing — email metadata is notoriously revealing. For sensitive coordination, prefer a modern messenger over email.

## Operational Security Habits

Tools fail; habits protect you. The strongest anonymity setups are undone by a single careless correlation.

1. **Separate identities completely.** Never mix engagement infrastructure, personal accounts, and real-name services on the same machine, browser, or network session.
2. **Assume traffic is logged.** Behave as if every packet is recorded, because on the target side it should be — that is the point of the exercise.
3. **Harden the endpoint.** Anonymity means nothing on a compromised machine. Keep the OS patched, minimise installed software, and follow operating-system security basics.
4. **Lock down your accounts.** Protect the identities behind your tooling with strong, unique passwords and two-factor authentication.
5. **Keep learning.** Deanonymisation techniques evolve constantly; make a habit of staying current.

## Hands-On Lab: Verify Your Own Setup

Never trust an anonymity setup you have not tested. Spin up a disposable Linux VM (see [setting up a VM](/en/page-3)), install `tor`, `proxychains4`, `nmap` and `libimage-exiftool-perl`, and walk through this against a host you own or are explicitly authorised to scan.

1. **Record your real exit point** so you have a baseline to compare against:

```bash
curl -s https://ifconfig.me; echo
```

2. **Start Tor and confirm the SOCKS listener is up** on port 9050:

```bash
sudo systemctl start tor
ss -ltnp | grep 9050
```

3. **Prove your traffic actually exits through Tor.** The returned address must differ from step 1, and `IsTor` must be `true`:

```bash
curl -s --socks5-hostname 127.0.0.1:9050 \
  https://check.torproject.org/api/ip
```

If the IP matches step 1, your proxy is misconfigured and everything downstream is leaking your real address.

4. **Route a tool through the chain and watch DNS.** With `proxy_dns` enabled in `proxychains4.conf`, name resolution is handled over Tor instead of your ISP's resolver ([nmap](/en/page-4) needs a connect scan through SOCKS):

```bash
proxychains4 nmap -sT -Pn -p 80,443 scanme.nmap.org
```

The `[proxychains] DNS-request` lines in the output confirm lookups are travelling through the tunnel, not leaking to your ISP.

5. **Strip metadata before you save any evidence.** Screenshots and PDFs quietly carry usernames, hostnames and GPS:

```bash
exiftool -all= -overwrite_original report.png
exiftool report.png   # confirm the tags are gone
```

Re-run steps 1 and 3 side by side at the start of every session: the day they return the same address is the day your anonymity silently failed. Log both outputs in your engagement notes as proof your attribution controls were actually working.

Anonymity and privacy are force multipliers for legitimate defensive and testing work, not licences to operate beyond your authorisation. Use them to protect people and to run cleaner, more controlled assessments — and always within the boundaries of [ethical hacking](/en/page-ethical-hacking).
