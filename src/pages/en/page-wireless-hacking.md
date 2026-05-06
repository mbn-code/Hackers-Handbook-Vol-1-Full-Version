---
title: Wireless Hacking 
description: How hackers intercept, monitor, and break into Wi-Fi networks.
layout: ../../layouts/MainLayout.astro
---

# Wireless Hacking 

With wired networks, an attacker has to physically plug a cable into a switch to access the network. But with **Wireless Networks (Wi-Fi)**, the data is literally flying through the air around us. If you have the right antenna, you can pluck that data right out of the sky.

Wireless hacking involves intercepting these radio waves to find  [Vulnerabilities](page-vulnerability), crack passwords, or perform  [Man-in-the-Middle (MitM) Attacks](page-packet-sniffing).

## The Hacker's Wireless Toolkit 

To hack Wi-Fi, you need two things:
1. **A Network Adapter that supports "Monitor Mode":** Standard Wi-Fi cards only listen to traffic addressed to them. Monitor mode allows a card to "listen to everything" on a specific radio channel, regardless of who it's meant for.
2. **The Aircrack-ng Suite:** This is a famous set of command-line tools used in Kali Linux specifically designed to audit and crack wireless networks.

## Common Wireless Attacks 

### 1. Cracking WEP and WPA/WPA2
- **WEP:** An incredibly old and broken encryption standard. It can be cracked in minutes using statistical attacks with `aircrack-ng`.
- **WPA/WPA2:** Much more secure. To hack WPA2, an attacker must capture the 4-way "handshake" that occurs when a legitimate user connects to the router. Once the handshake is captured, the attacker takes it offline and uses a  [Brute Force Attack](page-brute-force-attack) (using a GPU and a tool like Hashcat) to guess the password.

### 2. Deauthentication (Deauth) Attacks
A deauth attack is a type of  [DDoS Attack](page-ddos-attack). The hacker sends a forged "disconnect" packet to a user's laptop, pretending to be the router. The laptop immediately drops its Wi-Fi connection. 
- *Why do this?* Hackers use Deauth attacks to force a user to disconnect and immediately reconnect, allowing the hacker to capture the precious WPA2 handshake mentioned above!

### 3. The Evil Twin Attack
An Evil Twin attack is a wireless  [Phishing](page-5) attempt. 
- The hacker sets up a rogue Wi-Fi access point and gives it the exact same name (SSID) as a legitimate network (e.g., "Starbucks_Free_WiFi").
- The hacker boosts their antenna signal so it's stronger than the real router. 
- Victim devices automatically connect to the hacker's stronger signal.
- The hacker can now see all the unencrypted web traffic the victim generates, or redirect them to fake login pages to steal their credentials.

## Securing Wireless Networks 

Defending against wireless attacks requires a combination of strong configurations and physical awareness:

- **Use WPA3:** Whenever possible, upgrade to WPA3. It has built-in protections against offline dictionary attacks that make WPA2 vulnerable.
- **Strong Passwords:** If you must use WPA2, use an incredibly long, complex password. A strong password makes the offline handshake cracking process mathematically impossible.
- **Hide the SSID:** While not foolproof, hiding your network name stops casual snooping.
- **Use a  [VPN](page-vpn):** If you are connecting to a public Wi-Fi network (like at an airport or cafe), always use a VPN. Even if you connect to an Evil Twin, the VPN encrypts all your traffic before it leaves your laptop, making it useless to the hacker.
