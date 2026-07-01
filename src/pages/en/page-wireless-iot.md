---
title: Wireless IoT
description: How wireless IoT devices and protocols like Wi-Fi, BLE, Zigbee, and Matter work, why they are a soft target, and how to test and secure them.
layout: ../../layouts/MainLayout.astro
---

The Internet of Things puts a radio and a tiny computer into everything from doorbells to insulin pumps, and most of those radios were shipped with security as an afterthought. Understanding how these devices talk over the air is the difference between a smart home you control and one that quietly joins a botnet.

## The protocol landscape

"Wireless IoT" is not one technology. A single smart home may use four or five radio protocols at once, each with its own security model. Knowing which protocol a device speaks tells you how to test it and where it breaks.

### Short-range and mesh

- **Wi-Fi (2.4/5 GHz):** The most common consumer link. Devices join your LAN directly, so a weak IoT gadget becomes a foothold on the same [network](/en/page-networking) as your laptop.
- **Bluetooth Low Energy (BLE):** Powers wearables, locks, and beacons. Pairing and key exchange are the usual weak points; poorly implemented "Just Works" pairing offers no protection against a nearby attacker.
- **Zigbee and Z-Wave:** Low-power mesh protocols for lighting, sensors, and hubs. Both use AES-128, but security collapses when devices fall back to well-known default or transport keys during joining.
- **Thread / Matter:** Matter (launched 2022) is the industry's attempt to standardise the smart home. It runs over Thread and Wi-Fi, uses BLE only for commissioning, and mandates modern cryptography and per-device certificates.

### Long-range and cellular

- **LoRaWAN:** Kilometre-range links for agriculture, metering, and industrial sensors. Session keys and join procedures are the critical security surface.
- **Cellular (NB-IoT, LTE-M, 5G):** Connects devices directly to carrier networks, bypassing the home LAN entirely and shifting trust to the SIM and backend.

## Why IoT is a soft target

IoT security failures are rarely exotic. They repeat the same handful of mistakes at massive scale.

- **Default and hardcoded credentials.** The 2016 Mirai [malware](/en/page-malware) enslaved hundreds of thousands of cameras and routers using a short list of factory Telnet passwords, then launched record-breaking [DDoS attacks](/en/page-ddos-attack). Nothing about it was sophisticated.
- **Unencrypted or downgradeable radio traffic.** Cheap devices often send telemetry, or even control commands, in the clear, inviting interception and replay.
- **No update path.** Many devices ship firmware once and never again, so a disclosed [vulnerability](/en/page-vulnerability) stays exploitable for the product's lifetime.
- **Exposed management and cloud APIs.** The device may be hardened, but its companion app, cloud endpoint, or local web panel frequently is not.
- **Trust-by-proximity.** Protocols that assume anyone on the same radio is authorised fail the moment an attacker gets within range.

## Common attack vectors

The techniques below are for **authorised testing of hardware you own or are contracted to assess**. Attacking devices you do not control is illegal, and radio work can jam licensed spectrum. Keep the responsible-use rules from [Ethical Hacking](/en/page-ethical-hacking) in mind throughout.

### Interception and replay

Capturing radio traffic reveals whether a device encrypts its data and whether commands can be recorded and re-sent. A software-defined radio (SDR) such as an RTL-SDR dongle or a HackRF lets you observe sub-GHz protocols; specialised sniffers cover the higher bands. This is the wireless equivalent of [packet sniffing](/en/page-packet-sniffing) on a wire.

### Weak pairing and key handling

BLE and Zigbee both leak when the pairing or joining step is done badly. A BLE device that uses "Just Works" pairing exposes its traffic to anyone who can force a re-pair; a Zigbee device that accepts the default transport key hands over its network on a plate. Testing focuses on how keys are generated, exchanged, and stored.

### Pivoting from the device to the network

Once a Wi-Fi IoT device is compromised, it lives inside your LAN. Because many home networks are flat, that foothold can reach far more valuable systems. Enumerating what an IoT device exposes on the network is a standard early step.

## Testing wireless IoT responsibly

Start with the IP layer, because a surprising amount of IoT lives on ordinary TCP/IP. Discover devices and their open services with [Nmap](/en/page-4):

```bash
# Discover live hosts on the IoT subnet
nmap -sn 192.168.1.0/24

# Fingerprint services, versions, and default web panels on a target
nmap -sV -O -p- 192.168.1.42
```

Look hard at Telnet (23), unauthenticated HTTP (80), UPnP, and any custom high port. Then move to the radio layer with the right tool for the protocol:

```bash
# Scan for nearby BLE devices with BlueZ (Linux)
bluetoothctl
[bluetooth]# scan on
# ...note advertised names, MACs, and services, then:
[bluetooth]# scan off
```

- **BLE:** an nRF52840 dongle running Sniffle, or an Ubertooth, for capturing live connections.
- **Zigbee/802.15.4:** a CC2531/CC2652 flashed for sniffing, driven by tools like KillerBee.
- **Sub-GHz (433/868/915 MHz):** an RTL-SDR or HackRF with GNU Radio or Universal Radio Hacker.
- **Everything:** feed captures into Wireshark, which decodes Zigbee, BLE, and more.

Test against a documented baseline rather than ad hoc. The **OWASP IoT Top 10** and **ETSI EN 303 645** (the consumer IoT baseline that bans universal default passwords and requires a vulnerability-disclosure policy) give you a concrete checklist and a shared language for the report.

## Hardening IoT deployments

Defence is where most of the real-world value sits, whether you run a smart home or a factory floor.

1. **Segment the network.** Put IoT devices on a separate VLAN or guest SSID so a compromised bulb cannot reach your workstations. Pair this with a [firewall](/en/page-firewall) that blocks IoT devices from talking to the internet unless they need to.
2. **Replace default credentials immediately** and use unique, strong [passwords](/en/page-secure-passwords) per device.
3. **Insist on encryption in transit.** Prefer devices that use TLS to their cloud and modern link-layer [encryption](/en/page-encryption) on the radio; avoid anything still speaking plaintext HTTP or Telnet.
4. **Keep firmware current** and favour vendors with a real update track record and a disclosure policy.
5. **Disable what you do not use** — UPnP, remote access, cloud features, and open management ports are attack surface you may never need.
6. **Monitor for anomalies.** Unusual outbound connections from an IoT segment are often the first sign of a Mirai-style compromise.

A wireless IoT device is a full computer with a radio bolted on, so treat it like one: assume it can be attacked, limit what it can reach, and verify its security instead of trusting the box. For the Wi-Fi side of this in depth, continue to [Wireless Hacking](/en/page-wireless-hacking).
