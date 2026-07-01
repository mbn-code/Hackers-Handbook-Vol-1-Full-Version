---
title: IP Addresses
description: How IP addresses work, IPv4 vs IPv6, public vs private ranges, NAT, DNS, and why every security assessment starts with an IP.
layout: ../../layouts/MainLayout.astro
---

Every packet that crosses a network carries a source and a destination IP address. Understand those two numbers and you understand where traffic comes from, where it is going, and where an attacker has to reach to touch a target.

## What an IP Address Is

**IP** stands for **Internet Protocol**, the addressing scheme that lets independent networks route data to one another. An IP address is the numerical label assigned to a device on a network so other devices can find and talk to it. In [Networking](/en/page-networking) terms, it is the layer-3 identifier that routers use to forward [packets](/en/page-packets) hop by hop toward their destination.

The postal analogy is close but incomplete. A street address is fixed to a house; an IP address is often leased temporarily (via DHCP) and can change. What stays constant is the job: it identifies _where_, while ports identify _which service_ on that host.

## IPv4 vs. IPv6

Two versions of the protocol run side by side on the modern internet.

**IPv4** addresses are 32 bits, written as four decimal octets from 0 to 255, separated by dots:

```
192.168.1.5
```

That gives roughly 4.3 billion addresses. It sounds like a lot, but the pool of unallocated blocks was exhausted years ago, which is why techniques like NAT (below) became universal.

**IPv6** addresses are 128 bits, written as eight groups of four hexadecimal digits separated by colons:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

Leading zeros in a group can be dropped, and one run of all-zero groups can be collapsed to `::`, so the address above shortens to `2001:db8:85a3::8a2e:370:7334`. The address space is vast enough (about 3.4 x 10^38 addresses) that scanning an entire IPv6 subnet by brute force is impractical, which changes how reconnaissance works.

## Public vs. Private Addresses

This distinction matters for almost every security decision you make.

- **Public IP** – Assigned to your router by your Internet Service Provider (ISP) and routable across the global internet. Any server you connect to sees this address. It is the address an attacker on the internet can actually reach.
- **Private (local) IP** – Assigned to devices _inside_ your LAN and not routable on the public internet. Three reserved IPv4 ranges (RFC 1918) are set aside for private use:

```
10.0.0.0     – 10.255.255.255   (10.0.0.0/8)
172.16.0.0   – 172.31.255.255   (172.16.0.0/12)
192.168.0.0  – 192.168.255.255  (192.168.0.0/16)
```

Your laptop, phone, and printer typically hold addresses from `192.168.x.x` or `10.x.x.x`. From the internet they are invisible; from an attacker's perspective, reaching them requires first getting _inside_ the network or through the router.

### NAT: One Public IP for a Whole Network

Network Address Translation lets many private devices share a single public IP. The router rewrites the source address (and port) on outbound packets and keeps a table so replies get mapped back to the right internal device. NAT is why your dozen home devices all appear to the outside world as one address, and it is a big part of why private hosts are not directly reachable from the internet without deliberate port forwarding.

## Finding Your Own Addresses

Knowing how to read your own configuration is the first practical skill. On Linux or macOS:

```bash
ip addr show          # Linux: all interfaces and their IPs
ifconfig              # older systems / macOS
curl ifconfig.me      # ask an external service for your PUBLIC IP
```

On Windows, `ipconfig` shows interface addresses. The private address lives on your network adapter; the public one is only visible from outside, which is why you query an external service to see it.

## The Domain Name System (DNS)

People remember names, not numbers. DNS is the distributed directory that translates a hostname like `example.com` into an IP address a machine can route to. When you type a domain into your browser, your resolver walks the DNS hierarchy (root, top-level domain, then the authoritative server) and returns the address, which your browser then connects to.

You can watch this happen from the command line:

```bash
dig example.com +short      # returns the IPv4 (A) records
dig AAAA example.com +short # ask specifically for IPv6 (AAAA) records
nslookup example.com        # cross-platform alternative
```

DNS is also an attack surface. Poisoning a resolver's cache or tampering with responses can silently redirect victims to a look-alike server, a technique closely tied to [phishing](/en/page-phishing-attack) and man-in-the-middle attacks. Defensive DNS (DNSSEC, encrypted DNS over HTTPS/TLS) exists precisely because plain DNS was designed without authentication.

## Why IP Addresses Matter in Security

In authorised testing and defence, the IP address is where nearly every workflow begins.

- **Reconnaissance** – Before touching a target you must map its footprint. DNS enumeration and passive lookups turn a company name into the set of IP ranges it owns. This is the scoping stage of any [ethical hacking](/en/page-ethical-hacking) engagement, and you only probe addresses your rules of engagement authorise.
- **Scanning** – With an in-scope IP, tools like [Nmap](/en/page-4) reveal which ports are open and which services and versions answer. See [Port Scanning](/en/page-port-scanning) for how that maps the attack surface.
- **Traffic analysis** – On a network you control, [packet sniffing](/en/page-packet-sniffing) with Wireshark shows the source and destination IPs of every conversation, which is how defenders spot anomalies and how analysts reconstruct an intrusion.
- **Attribution and anonymity** – Every connection you make records your IP somewhere. Security testers, researchers, and privacy-conscious users route traffic through a [VPN](/en/page-vpn) or [proxy server](/en/page-proxy-server) to change the address a target sees. On the defensive side, blocking or rate-limiting hostile IP ranges is a first line of control.

### Reserved and Special Addresses

A few addresses never behave like normal hosts:

- `127.0.0.1` (and the whole `127.0.0.0/8` block) is [localhost](/en/page-localhost) — traffic sent here loops back to your own machine and never hits the wire.
- `0.0.0.0` means "this host" or, in a listener, "all interfaces."
- `169.254.x.x` is a link-local address a device self-assigns when DHCP fails.
- `255.255.255.255` is the limited broadcast address for the local segment.

Recognising these on sight saves time: a service bound to `127.0.0.1` is not reachable from other machines, while one bound to `0.0.0.0` is exposed to the whole network — a distinction that is often the difference between a safe default and an accidental exposure.

## Key Takeaways

- IPv4 (dotted decimal) is running out; IPv6 (hexadecimal, colon-separated) provides the long-term address space.
- Public addresses are reachable from the internet; RFC 1918 private ranges are not, and NAT bridges the two.
- DNS maps names to addresses and is itself a target worth defending.
- In legitimate security work you scan only IPs you own or are explicitly authorised to test. The address is the starting coordinate — everything else builds on it.
