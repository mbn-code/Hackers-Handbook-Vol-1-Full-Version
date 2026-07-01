---
title: Firewall
description: How firewalls filter network traffic - packet filtering, stateful inspection, and next-gen features - plus what they catch, what they miss, and why.
layout: ../../layouts/MainLayout.astro
---

A firewall enforces a boundary between networks of different trust levels, allowing traffic that matches its policy and dropping the rest. It is the oldest and still one of the most useful controls in network security - and understanding both what it catches and what it misses is essential for attackers and defenders alike.

## What a Firewall Actually Does

A firewall inspects [packets](/en/page-packets) crossing a boundary and matches them against an ordered rule set. Each rule specifies a condition - source and destination [IP address](/en/page-ip), port, protocol, connection state - and an action: allow, drop, or reject. Most firewalls evaluate rules top-to-bottom and act on the first match, so rule order matters as much as rule content.

Two design principles decide how strong a policy is:

- **Default deny.** Block everything, then explicitly permit only what a service needs. This is the safe default. The opposite - default allow - means any port you forget to think about stays open.
- **Least privilege.** A web server should accept 443/tcp from the internet and little else. Every extra open port is attack surface.

The distinction between _drop_ and _reject_ matters during reconnaissance. A dropped packet produces silence (the port appears `filtered` to an [Nmap](/en/page-4) scan); a rejected one returns a TCP RST or ICMP unreachable, confirming a firewall is present. Silent drops slow attackers down and leak less information.

## How Traffic Gets Filtered

Firewalls have grown more capable over time, and modern products combine several inspection techniques in one box.

### Packet Filtering

The oldest approach examines each packet in isolation at layers 3 and 4 - IP addresses, ports, and protocol flags - with no memory of what came before. It is fast and cheap but easily fooled, because it cannot tell a legitimate reply from a crafted packet that merely looks like one.

### Stateful Inspection

A stateful firewall tracks the state of each connection in a table. When an internal host opens a TCP session outbound, the firewall records it and automatically permits the matching return traffic, then closes the entry when the connection ends. This is the baseline for virtually every firewall today because it understands conversations rather than lone packets.

### Application-Layer and Next-Generation Firewalls

A next-generation firewall (NGFW) inspects the layer-7 payload, not just headers. It can identify the actual application inside a flow (distinguishing web browsing from a tunnel riding over port 443), decrypt and re-inspect TLS, and fold in intrusion prevention, [malware](/en/page-malware) scanning, and URL filtering. A [proxy](/en/page-proxy-server) firewall goes further still, terminating the connection on behalf of the client so the two endpoints never talk directly.

## Where Firewalls Fit - and Where They Don't

Firewalls are a control, not a cure. A perimeter firewall does nothing against a phishing email that a user opens from inside the trusted zone, and it cannot see traffic that never crosses it - the reason [network segmentation](/en/page-networking) and internal firewalls matter. Encrypted traffic is opaque unless the firewall performs TLS interception, which carries privacy and performance costs.

Attackers routinely bypass firewalls by living inside allowed channels. A [backdoor](/en/page-backdoor) that beacons out over HTTPS looks like ordinary web traffic; DNS tunneling smuggles data through a port almost every policy leaves open. This is why firewalls are one layer in a defence-in-depth stack alongside [operating system hardening](/en/page-os-security), intrusion detection, and [incident response](/en/page-incident-response).

## Working With Host Firewalls

You do not need enterprise hardware to practise. Every major OS ships a host firewall, and knowing the syntax is directly useful in a lab or a real deployment.

On Linux, `nftables` is the modern replacement for `iptables`. A minimal default-deny policy for a web server:

```bash
# Create a table and input chain with a default-deny policy; allow established/related, loopback, SSH, HTTPS
sudo nft add table inet filter
sudo nft add chain inet filter input '{ type filter hook input priority 0 ; policy drop ; }'
sudo nft add rule inet filter input ct state established,related accept
sudo nft add rule inet filter input iif lo accept
sudo nft add rule inet filter input tcp dport { 22, 443 } accept
```

Many distributions wrap this in `ufw` (Uncomplicated Firewall) for readability:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

After changing rules, verify them from another machine rather than trusting the config. An external [port scan](/en/page-port-scanning) shows what the outside world can actually reach:

```bash
nmap -Pn -p- target.example.com
```

## Reading a Firewall Like an Attacker

On an authorised engagement, the firewall shapes everything you can see. Ports returning `filtered` suggest silent drops; a sudden shift to `closed` responses can reveal a rule boundary. Comparing scans from inside and outside a segment maps where the filtering sits. Timing differences, ICMP responses, and which protocols survive all leak policy details - the same signals a [red team](/en/page-red-blue-teams) uses to plan a route and a blue team watches to detect one.

Keep this framing in mind: probing, mapping, or reconfiguring a firewall is only legitimate on systems you own or have written permission to test. See [Legal and Ethical Considerations](/en/page-legal-ethical) before pointing any of these tools at a network.
