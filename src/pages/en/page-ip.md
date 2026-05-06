---
title: IP Addresses 
description: What is an IP address, how does it work, and why do hackers care?
layout: ../../layouts/MainLayout.astro
---

# What is an IP Address? 

In the world of  [Networking](page-networking), **IP** stands for **Internet Protocol**. 

An IP address is a unique numerical label assigned to every single device connected to a computer network. If you want to send a letter to a friend, you need their home address. If a computer wants to send data to a web server, it needs the server's IP address.

## IPv4 vs. IPv6 

There are two main versions of IP addresses in use today:

1. **IPv4 (Internet Protocol version 4):** 
  , Looks like this: `192.168.1.5`
  , It's made up of four numbers separated by periods (dots). Each number ranges from 0 to 255.
  , Because the internet grew so fast, we actually ran out of available IPv4 addresses!

2. **IPv6 (Internet Protocol version 6):**
  , Looks like this: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
  , It uses hexadecimal numbers and colons. 
  , It provides an almost infinite number of unique addresses to solve the IPv4 shortage.

## Public vs. Private IP Addresses 

This is a crucial concept for cybersecurity:

- **Public IP Address:** This is the address assigned to your router by your Internet Service Provider (ISP). It is visible to the entire internet. When you visit a website, the website sees your Public IP.
- **Private (Local) IP Address:** This is the address assigned to your specific device (laptop, phone, smart TV) *inside* your home or corporate network. These usually start with `192.168.x.x` or `10.x.x.x`. They are hidden from the outside internet.

*Note: Your router acts as a translator between your Private IP and your Public IP using a technology called NAT (Network Address Translation).*

## The Domain Name System (DNS) 

Humans are bad at remembering numbers like `142.250.190.46`, but we are great at remembering names like `google.com`. 

DNS acts as the phonebook of the internet. When you type a domain name into your browser, your computer silently asks a DNS server, "Hey, what is the IP address for google.com?" The DNS server replies with the IP, and your browser connects to it. 

Hackers often target DNS to redirect users to malicious, fake websites (a technique related to  [Phishing](page-5)).

## Why Hackers Care About IPs 

IP addresses are the starting point for almost every cyber attack:
- **Targeting:** Before you can hack a server, you need to know its IP address. Hackers use DNS enumeration tools to find the IP addresses associated with a target company.
- **Scanning:** Hackers use tools like  [Nmap](page-4) to scan an IP address to see what ports are open and what software is running.
- **Tracking & Anonymity:** When you do *anything* online, you leave a footprint of your IP address. This is why hackers (and privacy advocates) use a  [VPN](page-vpn) or  [Proxy Server](page-proxy-server) to mask their real IP address and hide their identity. 
- **Special IPs:** There are special IPs, like `127.0.0.1`, which is known as  [Localhost](page-localhost). It always points back to your own computer!
