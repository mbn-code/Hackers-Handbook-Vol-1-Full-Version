--- 
title: Metasploit Video Examples 
description: Watch reverse and bind shells in action using the Metasploit Framework.
layout: ../../layouts/MainLayout.astro 
--- 
 
# Metasploit in Action 

Reading about  [Metasploit](page-6) is one thing, but seeing it execute a successful exploit is another entirely. Below are two recorded examples demonstrating how to use the Metasploit Framework to gain shell access to remote machines.

Before watching, it's important to understand the difference between the two types of shells demonstrated:

1. **Bind Shell:** The attacker forces the target machine to open a specific port and "bind" a command prompt to it. The attacker then connects *to* that port. This is often blocked by modern  [Firewalls](page-firewall).
2. **Reverse Shell:** The attacker sets up a listening server on their own machine. The malicious payload on the target machine connects *back* to the attacker. This is highly effective because firewalls typically allow outgoing traffic.
 
## Example 1: Getting a Bind Shell on a Windows Machine 
 
In this example, an attacker uses `msfconsole` to deliver a payload created with `msfvenom`. The payload forces the Windows target to open a port, allowing the attacker to connect and gain full command-line access.
 
<video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"> 
  <source src="/src/pages/en/videos/2021-09-26_14-31-23.mp4" type="video/mp4"> 
  Your browser does not support the video tag. 
</video> 
 
## Example 2: Getting a Reverse Shell on Metasploitable 
 
In this video, the attacker targets the intentionally vulnerable Linux virtual machine we set up in our  [Metasploitable Guide](page-metasploitable). Using a built-in exploit module, the attacker forces the target to connect back to their Kali Linux machine, resulting in a reverse shell!
 
<video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"> 
  <source src="/src/pages/en/videos/2021-09-24_14-03-09.mp4" type="video/mp4"> 
  Your browser does not support the video tag. 
</video>

*(Note: Always remember that these techniques must only be used in controlled environments, such as your own  [Localhost](page-localhost) or lab network, and never against targets without explicit permission.)*
