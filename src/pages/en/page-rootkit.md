---
title: Rootkits 
description: Stealthy malware designed to hide its presence and maintain persistent access.
layout: ../../layouts/MainLayout.astro
---

# Rootkits 

If a hacker gains  [Root Access](page-root-access) to a server, their next priority is making sure they don't lose it. If the system administrator notices the breach, they will lock the hacker out. 

To prevent this, hackers install a **Rootkit**.

A rootkit is a highly advanced form of  [Malware](page-malware) designed to hide its own presence, as well as the presence of the attacker, from the operating system and antivirus software.

## How Rootkits Hide 

Normal malware (like a  [Trojan](page-trojan) or ransomware) runs as an application in "User Mode". Antivirus software also runs in User Mode (or slightly below) and can easily spot malicious applications running in memory.

A true Rootkit, however, burrows deep into the "Kernel Mode",the absolute core of the operating system that controls the hardware.

Once a Rootkit infects the kernel, it intercepts commands from the operating system. 
- If the system administrator runs the `ls` or `dir` command to look at files, the Rootkit intercepts the command and says, "Show the admin everything *except* my hidden hacker files."
- If the antivirus scans the active processes, the Rootkit lies and hides the malicious processes. 
- Because the Rootkit controls the OS itself, the OS can no longer be trusted to report the truth!

## The Purpose of a Rootkit 

1. **Persistence:** Surviving reboots and remaining undetected for months or years.
2. **Backdoor Access:** Providing a hidden  [Backdoor](page-backdoor) for the attacker to return whenever they want.
3. **Botnets:** Enslaving the machine into a botnet to launch  [DDoS Attacks](page-ddos-attack) without the owner ever knowing.
4. **Keylogging:** Silently recording passwords and sending them back to the attacker.

## Detection and Removal 

Detecting a kernel-level Rootkit from *inside* the infected operating system is almost impossible. 

The most reliable way to detect a Rootkit is to shut down the computer, pull out the hard drive, plug it into a clean, uninfected computer, and scan it from the outside. 

If a Rootkit is found, the only truly safe remediation is to wipe the hard drive completely and reinstall the operating system from scratch.
