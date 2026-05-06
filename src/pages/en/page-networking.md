---
title: Networking
description: Explore the fundamentals of networking and why it's the most critical skill for a hacker.
layout: ../../layouts/MainLayout.astro
---

# The World of Networking

If you want to be a hacker, you **must** understand networking. 

Networking is the practice of connecting computer systems and devices so they can share resources, communicate, and transfer data. 

The Internet itself is just a massive network of networks! As a hacker, the network is your battlefield. It is how you access remote systems, intercept data, and find vulnerabilities.

## Why Networking is the Hacker's Foundation

Almost every cyber attack happens over a network. 

- **Scanning:** Want to scan a target? You are sending network packets over a connection.
- **Exploiting:** Want to exploit a web server? You are manipulating HTTP requests over the network.
- **Intercepting:** Want to intercept passwords? You are using packet sniffing on a local network.

Without a solid grasp of how computers talk to each other, you are flying blind.

## Core Concepts You Need to Know

### 1. The OSI Model
The Open Systems Interconnection (OSI) model is a conceptual framework used to understand how networks operate. 
- It breaks network communication into 7 layers.
- It starts from the physical cables in Layer 1, up to the application interface in Layer 7. 
- Hackers use this model to pinpoint exactly *where* an attack is happening.

### 2. IP Addresses and MAC Addresses
- **IP Address:** The logical, routable address of a device on a network. Think of it like a home address for the mailman.
- **MAC Address:** The physical, permanent address burned into a network card. Think of it like a fingerprint.

### 3. Ports and Protocols
Think of an IP address as an apartment building, and **Ports** as the individual apartment numbers. 
- A computer has 65,535 ports. 
- **Protocols** are the languages spoken on those ports. 
- For example, Web traffic (HTTP) usually speaks on Port 80, while secure web traffic (HTTPS) uses Port 443. 
- Finding out which doors are open is called **Port Scanning**.

### 4. Routers and Switches
- **Switches:** Connect devices together on the *same* local network.
- **Routers:** Connect *different* networks together (for example, connecting your home network to the Internet). They act as the gateway and direct traffic where it needs to go.

### 5. Firewalls
A firewall is a security device that monitors incoming and outgoing network traffic. 
- It decides whether to allow or block specific traffic based on a defined set of security rules. 
- Bypassing firewalls is a common task in penetration testing!

## Networking in the Hacking Lifecycle

When performing a penetration test, networking concepts apply at every stage:

1. **Reconnaissance:** Using tools to map out a company's network infrastructure.
2. **Scanning:** Using tools like Nmap to find open ports and listening services.
3. **Exploitation:** Sending a malicious payload over the network to a vulnerable service.
4. **Pivoting:** Once you hack one machine on a network, you use it as a stepping stone to attack other devices inside the same network.

## Conclusion

You cannot secure (or hack) what you do not understand. 

Networking might seem dry at first with all its acronyms and protocols, but it is the absolute bedrock of cybersecurity. Master networking, and you will hold the keys to the kingdom.
