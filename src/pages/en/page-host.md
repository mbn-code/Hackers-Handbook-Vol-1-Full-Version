---
title: Host
description: A host is any networked device with an IP address. Learn how hosts, clients, and servers interact, and why every assessment starts by finding live hosts.
layout: ../../layouts/MainLayout.astro
---

In [networking](/en/page-networking), a **host** is any device that has an [IP address](/en/page-ip) and can send or receive data across a network. Hosts are the endpoints that everything else — routers, switches, cables, protocols — exists to connect.

## What Counts as a Host

A host is a communication endpoint: it can be the source of traffic, the destination, or both. If it holds an IP address and talks to other devices, it's a host. That covers a huge range of hardware:

- A laptop or desktop computer.
- A smartphone on Wi-Fi or cellular.
- A web, database, or mail server in a data center.
- A smart thermostat, camera, or other [IoT device](/en/page-wireless-iot).
- A network printer.

Pure layer-2 devices such as unmanaged switches and hubs forward frames without an IP address of their own, so they aren't endpoints in this sense. (A _managed_ switch with a management IP is a host on that management interface — the distinction is whether the device terminates traffic or just passes it along.)

## Clients and Servers

Every endpoint is a host, but during a given exchange a host plays one of two roles. These are roles, not fixed hardware types: the same machine can act as a client for one connection and a server for another.

### The Client (the Requester)

A client initiates a request for a service, data, or a resource. When you type a URL into your browser, your laptop is the client — it opens a connection and asks a remote machine for a webpage.

### The Server (the Provider)

A server listens for incoming requests and responds with the requested resource. The machine holding the website receives your request, assembles the HTML, and sends it back. This request-response pattern is the **client-server model**, and it underpins the web, email, DNS, and most networked applications.

Your own laptop straddles both roles constantly: it's a client when it loads a site, and a server the moment you run a local development server or accept an SSH connection.

## Naming and Addressing Hosts

Humans refer to hosts by **hostnames**; the network routes to them by IP address. DNS translates the former into the latter, while a local `hosts` file can override that lookup on a single machine. The special name `localhost` (see [localhost](/en/page-localhost)) always loops back to the machine you're on.

```bash
hostname            # print this machine's name
hostname -I         # show its IP address(es) on Linux
cat /etc/hosts      # local name-to-IP overrides
```

## Hosts in a Security Assessment

During an **authorised** penetration test, the target is almost always a specific host — usually a server. Only ever run the steps below against systems you own or have explicit, written permission to test.

1. **Host discovery.** Map which hosts are actually alive on a network before probing anything. A ping sweep with [Nmap](/en/page-4) does this quickly:

   ```bash
   # -sn performs host discovery only (no port scan) across a /24
   nmap -sn 192.168.1.0/24
   ```

2. **Enumeration.** Once a live host is found, [port scanning](/en/page-port-scanning) reveals which services it runs — web, database, SSH, mail — and often their software versions.
3. **Exploitation.** A tester then checks the exposed services against known weaknesses, attempting to leverage a [vulnerability](/en/page-vulnerability) to gain access, sometimes escalating to [root access](/en/page-root-access).
4. **Availability attacks.** A [DDoS attack](/en/page-ddos-attack) targets a host without breaking in, flooding a server with traffic until it can no longer serve legitimate clients.

Knowing how hosts, clients, and servers relate is fundamental to reading a network: it tells you where data originates, where it's headed, and where it can be observed, intercepted, or defended.
