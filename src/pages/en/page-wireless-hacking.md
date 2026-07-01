---
title: Wireless Hacking
description: "How Wi-Fi attacks work: monitor mode, WPA2 handshake and PMKID capture, deauth and evil-twin attacks, and how WPA3 and strong keys stop them."
layout: ../../layouts/MainLayout.astro
---

A wired attacker needs physical access to a port. A wireless attacker just needs to be in range, because Wi-Fi broadcasts every frame through the air where any suitable antenna can hear it. That physics is what makes wireless security both fascinating and fragile.

This page explains how Wi-Fi attacks work and how to defend against them. Only test networks you own or have explicit written authorisation to assess — capturing or cracking traffic on networks you don't control is illegal in most jurisdictions. See [Legal and Ethical Considerations in Hacking](/en/page-legal-ethical) before you touch a radio.

## Why Wi-Fi Is Different

On a switched Ethernet [network](/en/page-networking), frames are delivered only to the intended port. On Wi-Fi, every device sharing a channel receives every frame; the protocol relies on encryption, not physical isolation, to keep them private. Break or bypass that encryption and the confidentiality guarantee collapses.

Modern security comes down to which protocol the access point (AP) speaks:

- **WEP** — obsolete and trivially broken. Its RC4 keystream reuse leaks the key after enough packets. If you ever see WEP in the wild, treat it as unencrypted.
- **WPA2-Personal** — the long-time default. Strong AES-CCMP encryption, but the pre-shared key (PSK) can be attacked offline once you capture the right handshake.
- **WPA3-Personal** — introduces SAE (Simultaneous Authentication of Equals, a.k.a. Dragonfly), which kills offline dictionary attacks and adds forward secrecy.

## The Wireless Auditing Toolkit

Two things do most of the work:

1. **An adapter that supports monitor mode and packet injection.** Ordinary cards only surface frames addressed to them. Monitor mode lets the radio capture every frame on a channel; injection lets you transmit crafted frames. Chipsets like the Atheros AR9271 or Realtek RTL8812AU are popular because their Linux drivers support both.
2. **The Aircrack-ng suite plus hashcat.** Aircrack-ng handles capture and injection; hashcat does the heavy password cracking on a GPU. Both ship in or install easily on Kali and similar distros.

Put the adapter into monitor mode and find your target:

```bash
# Kill processes that fight for the radio, then enable monitor mode
sudo airmon-ng check kill
sudo airmon-ng start wlan0          # creates wlan0mon

# Survey nearby APs and clients (note the BSSID and channel)
sudo airodump-ng wlan0mon
```

## Attacking WPA2: Handshake Capture

WPA2-PSK never sends the password over the air. Instead, the AP and client run a **4-way handshake** that proves both sides know the PSK. Capture that handshake and you can test password guesses offline, as fast as your hardware allows.

```bash
# Lock onto one AP and write everything to a capture file
sudo airodump-ng --bssid AA:BB:CC:DD:EE:FF -c 6 -w capture wlan0mon
```

You need a client to connect while you're listening. Rather than wait, attackers often force a reconnect with a **deauthentication attack** (see below), then crack the captured handshake:

```bash
# Convert the capture, then crack with hashcat mode 22000 (WPA-PBKDF2/PMKID)
hcxpcapngtool -o hash.hc22000 capture-01.cap
hashcat -m 22000 hash.hc22000 wordlist.txt
```

The math matters. WPA2 keys are hashed 4,096 times with PBKDF2, so cracking is a [brute-force](/en/page-brute-force-attack) race against the password's [entropy](/en/page-secure-passwords). A random 12+ character passphrase is effectively uncrackable; "password123" falls in seconds against any wordlist.

### The PMKID Shortcut

Some APs leak a **PMKID** in the first handshake message, so no connected client is even required — you can request it directly from the AP. Tools like `hcxdumptool` collect PMKIDs, which feed the same hashcat mode 22000. This clientless path is why "just wait for someone to connect" is no longer a defender's safety net.

## Deauthentication Attacks

A deauth attack is a targeted [denial of service](/en/page-ddos-attack). Management frames in older Wi-Fi are unauthenticated, so an attacker can spoof a "disconnect" frame that appears to come from the AP:

```bash
# Boot a client so it reconnects and reveals the handshake
sudo aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon
```

The victim drops and immediately reconnects, replaying the 4-way handshake you're capturing. The defence is **Protected Management Frames (802.11w)**, which are mandatory under WPA3 and cryptographically block spoofed deauth frames.

## Evil-Twin and Rogue AP Attacks

An evil twin is wireless [phishing](/en/page-phishing-attack). The attacker stands up a rogue AP broadcasting a familiar SSID — "Airport_Free_WiFi", a company guest network — often on a stronger signal so nearby devices prefer it. Once a victim associates, the attacker sits in the middle and can:

- read any unencrypted traffic (a form of [packet sniffing](/en/page-packet-sniffing) and man-in-the-middle),
- serve a fake **captive portal** login page to harvest credentials, or
- strip or downgrade connections to intercept sensitive data.

Devices are vulnerable because they trust SSID names, not the operator behind them. This is also why saved "auto-connect" networks are risky: a laptop probing for a remembered SSID can be answered by an attacker impersonating it.

## Beyond the Router: WPS and IoT

Two more soft spots are worth knowing:

- **WPS (Wi-Fi Protected Setup).** The 8-digit PIN is validated in two halves, shrinking the real keyspace enough for online guessing. Reaver-style attacks exploit this. Disable WPS unless you genuinely need it.
- **[IoT devices](/en/page-wireless-iot).** Cameras, plugs, and sensors frequently ship with default credentials, unpatched firmware, and weak onboarding flows, making them the easiest foothold on a home or office WLAN.

## Securing Wireless Networks

Wi-Fi defence is mostly about denying attackers the two things they want: a crackable handshake and a device that trusts the wrong AP.

- **Use WPA3, or WPA2 with a strong PSK.** SAE removes the offline cracking path entirely. If you're stuck on WPA2, a long random passphrase makes handshake cracking computationally hopeless. Store it like any other secret; see [secure passwords](/en/page-secure-passwords).
- **Enable Protected Management Frames (802.11w).** This neutralises the deauth trick that fuels handshake capture.
- **Turn off WPS** and change every default device credential.
- **Segment guest and IoT devices** onto their own VLAN or SSID so a compromised smart bulb can't reach your workstation.
- **Assume public Wi-Fi is hostile.** On any network you don't control, run a [VPN](/en/page-vpn) so an evil twin sees only [encrypted](/en/page-encryption) traffic. Hiding the SSID and MAC filtering deter casual snooping but stop no serious attacker — treat them as speed bumps, not walls.

## Hands-on Lab: Crack a WPA2 Handshake You Own

The safe way to internalise all of this is to attack your _own_ gear. Use a spare router or a phone hotspot you control, set it to WPA2-PSK with a deliberately weak passphrase, and use a second phone or laptop as the client. Do this on hardware you own, ideally from a Kali [VM](/en/page-3) with a monitor-mode adapter passed through — never point it at a neighbour's network.

First, seed a tiny wordlist that contains your test passphrase, so the crack is guaranteed and fast:

```bash
printf 'summer2024\npassword1\nhunter2!\ncorrecthorse\n' > wordlist.txt
```

Put the adapter in monitor mode and lock onto your AP. Read the BSSID and channel from `airodump-ng`, then filter to just that network:

```bash
sudo airmon-ng check kill
sudo airmon-ng start wlan0
sudo airodump-ng --bssid <your-bssid> -c <channel> -w capture wlan0mon
```

In a second terminal, bounce your own client so it replays the 4-way handshake:

```bash
sudo aireplay-ng --deauth 3 -a <your-bssid> -c <your-client-mac> wlan0mon
```

Watch the top of the `airodump-ng` window for `WPA handshake: <bssid>`. That is your signal to stop capturing. Convert the capture and crack it:

```bash
hcxpcapngtool -o hash.hc22000 capture-01.cap
hashcat -m 22000 hash.hc22000 wordlist.txt
```

Against the four-word list it falls in under a second. Now change the AP to a 15-character random passphrase, re-capture, and run a brute-force mask attack instead — `hashcat -m 22000 -a 3 hash.hc22000 '?a?a?a?a?a?a?a?a' --increment` — then read the _estimated_ time it prints: years to centuries. You do not need to finish that run; the estimate is the entire lesson. That gap between "seconds" and "centuries" is exactly what a strong [passphrase](/en/page-secure-passwords) and WPA3's SAE buy you.

Wireless auditing is a core skill for anyone doing authorised [ethical hacking](/en/page-ethical-hacking), and running this lab once teaches more about wireless risk than any amount of reading: it makes the defences in the previous section concrete rather than theoretical.
