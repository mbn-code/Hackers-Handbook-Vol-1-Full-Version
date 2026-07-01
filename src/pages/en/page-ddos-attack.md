---
title: DDoS Attack
description: "How DDoS attacks flood systems to knock services offline: volumetric, protocol, and application-layer types, plus practical detection and defence."
layout: ../../layouts/MainLayout.astro
---

A Distributed Denial of Service (DDoS) attack tries to make a service unusable by drowning it in traffic or requests from many machines at once. Where a plain DoS attack comes from a single source, a DDoS attack is _distributed_ across hundreds or thousands of hosts, which makes it far harder to block by simply filtering one IP.

## DoS vs DDoS

The difference is scale and origin. A single attacker on one connection can rarely outmatch a modern server or its upstream bandwidth. Spread the same attack across a **botnet** of compromised devices, and the combined traffic can saturate links, exhaust connection tables, or pin CPUs before defenders can react. Those bots are typically recruited by [malware](/en/page-malware) infections, and many high-profile floods have come from insecure home routers and cameras. The Mirai botnet, built almost entirely from default-credential IoT devices, is the classic example.

## How the traffic is generated

Attackers rarely use their own bandwidth. Common sources include:

- **Botnets:** networks of infected computers, servers, and IoT devices controlled remotely.
- **Reflection and amplification:** the attacker spoofs the victim's IP as the source, sends small queries to open UDP services (DNS, NTP, memcached, CLDAP), and those services reply with much larger responses aimed at the victim. Memcached reflection can amplify traffic by tens of thousands of times.
- **Booter/stresser services:** rented "stress testing" platforms that are, in practice, DDoS-for-hire. Using one against a target you do not own is a crime in most jurisdictions.

## Attack categories

DDoS techniques are usually grouped by which layer they overwhelm. Understanding the category tells you which defence applies.

### Volumetric attacks

The goal is to consume all available bandwidth. UDP floods and the amplification methods above fall here. These are measured in bits per second (Gbps or Tbps) and are what people picture when they hear "DDoS." Mitigation almost always happens upstream, because once traffic reaches your link it is already too late.

### Protocol attacks

These exhaust server or network-device state rather than raw bandwidth, and are measured in packets per second (pps). A **SYN flood** opens a stream of half-finished TCP handshakes, filling the connection table so legitimate clients cannot connect. Firewalls, load balancers, and other stateful devices are prime targets. See [Networking](/en/page-networking) for the underlying mechanics.

### Application-layer (Layer 7) attacks

The most efficient and hardest to spot. Instead of brute bandwidth, they send requests that look legitimate but are expensive to serve, such as HTTP floods hammering a search endpoint or a **Slowloris** attack that holds connections open by sending headers a byte at a time. Because each request resembles a real user, distinguishing attack from traffic spike is the core challenge. A recent example is the HTTP/2 Rapid Reset technique (CVE-2023-44487), which abused rapid stream cancellation to drive record request rates. These attacks overlap heavily with [web hacking](/en/page-web-hacking).

## Impact

A successful attack causes downtime, lost revenue, breached SLAs, and reputational damage. DDoS is also used as cover: while defenders scramble to keep the site up, attackers may run intrusions elsewhere. Extortion is common too, with a ransom demanded to stop or avoid an attack.

## Defence and mitigation

No single control is enough; effective defence layers several.

- **Upstream scrubbing and cloud protection:** providers and CDNs absorb and filter attack traffic before it reaches your origin, using large distributed capacity and anycast routing to spread load across many locations.
- **Rate limiting and traffic shaping:** cap requests per source and throttle abusive patterns at the edge.
- **SYN cookies and connection limits:** blunt protocol floods without holding state for every half-open connection.
- **Web application firewalls:** filter malicious Layer 7 requests and enforce challenges on suspicious clients.
- **Anomaly detection:** baseline normal traffic so unusual spikes trigger automatic filtering or alerts.
- **Blackholing and BGP Flowspec:** as a last resort, drop traffic to a targeted address to protect the rest of the network.

Some protocol-flood defences live in the kernel. On Linux, SYN cookies let a host answer handshakes without holding state for every half-open connection:

```bash
# Enable SYN cookies and enlarge the half-open backlog
sysctl -w net.ipv4.tcp_syncookies=1
sysctl -w net.ipv4.tcp_max_syn_backlog=4096
```

Preparation matters as much as tooling. Keep a rehearsed [incident response](/en/page-incident-response) plan with provider contacts, escalation paths, and pre-agreed mitigation so the team is not improvising mid-attack.

## Legal and ethical note

Launching a DDoS attack against systems you do not own or have written permission to test is illegal in most countries and carries serious penalties. This page is for defenders, students, and authorised testers who need to understand the threat to counter it. Load and resilience testing must only be run against your own infrastructure or with explicit written authorisation. See [Legal and Ethical Considerations in Hacking](/en/page-legal-ethical) for the boundaries.
