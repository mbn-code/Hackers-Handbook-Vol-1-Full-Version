---
title: The Linux Shell
description: Master the Linux terminal for ethical hacking - learn files, permissions, the root user, pipes, and redirection with practical commands you will actually use.
layout: ../../layouts/MainLayout.astro
---

Almost every serious security tool assumes you are comfortable at a Linux command line. Learn the shell well and the rest of the handbook - scanning, exploitation, scripting, analysis - becomes far easier to follow.

<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/recon-walkthrough-poster.png">
    <source src="/en/videos/recon-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/recon-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>A few shell one-liners that map hosts and open ports on an authorised network.</figcaption>
</figure>

## Why security work lives on Linux

Distributions like **Kali Linux** and **Parrot OS** ship with hundreds of tools already configured, but the tools are the easy part. The environment they run in is what you have to understand first, and that begins at the shell.

- **Open source.** You can read the kernel and core utilities, see exactly what they do, and modify them. Nothing is a black box.
- **Direct control.** Linux exposes the network stack, filesystem, and processes without hiding them behind "are you sure?" dialogs. That control is precisely what you need when testing a system you are authorised to test.
- **Scriptable by design.** Every graphical action has a command-line equivalent, and commands compose. That is what makes [Bash scripting](/en/page-bash) so powerful for automation.

Nothing here is Linux-only in spirit - Windows and macOS have capable terminals too - but the tooling, documentation, and community for offensive and defensive security overwhelmingly target Linux.

## Core concepts

### Everything is a file

Disks, terminals, network sockets, and running processes are all exposed through the filesystem. Your first hard drive is `/dev/sda`; kernel and process information lives under `/proc` and `/sys`. This uniformity means one small set of file commands lets you inspect nearly anything.

```bash
ls -la /home/user      # list files, including hidden ones, with permissions
cat /etc/os-release    # read a file
cat /proc/cpuinfo      # the CPU is "a file" too
```

### The root user and privilege escalation

`root` (user ID 0) is the superuser. It can read any file, change any setting, and, yes, destroy the system with a single command. Because of that, you should do day-to-day work as a normal user and elevate only when needed:

```bash
sudo apt update        # run one command as root
sudo -i                # open a root shell (use sparingly)
```

A large part of penetration testing is **privilege escalation**: starting as a low-privileged account and abusing a misconfiguration, weak permission, or vulnerable service to gain [root access](/en/page-root-access). Understanding what root can do - and how normal users are kept from it - is the foundation for both the attack and the defence.

### File permissions

Every file has an owner, a group, and "others", and each of those can have read (`r`), write (`w`), or execute (`x`) rights. `ls -l` shows them as a ten-character string:

```
-rwxr-xr--  1 alice devs  2048 Jul  1 09:15 report.sh
```

Here the owner (`alice`) can read, write, and execute; the group (`devs`) can read and execute; everyone else can only read. Change permissions with `chmod` and ownership with `chown`:

```bash
chmod 640 secrets.txt    # owner read/write, group read, others nothing
chmod +x deploy.sh       # make a script executable
chown alice:devs app.log # set owner and group
```

Permissions matter to both sides of a test. An attacker who finds a sensitive file readable only by root cannot open it without escalating first; a defender who audits `chmod` mistakes closes that door. Watch especially for the **SUID bit** (a file that runs with its owner's privileges), a classic escalation path.

### Pipes and redirection

The real power of the shell is chaining small, single-purpose tools into something larger.

- **Pipe (`|`)** sends one command's output straight into the next command's input.
- **Redirect (`>` overwrite, `>>` append)** sends output to a file instead of the screen. `2>` redirects errors.

```bash
cat access.log | grep "admin" | wc -l    # count lines mentioning "admin"
nmap 192.168.1.1 > scan.txt              # save results to a file
./tool.sh > out.log 2> err.log           # split normal output and errors
```

That last idea scales all the way up: pipe an [Nmap](/en/page-4) scan into `grep`, filter it, and feed the result into another tool. Composability is why a handful of commands can replace a large, single-purpose application.

## Commands worth memorising

You do not need hundreds of commands to be productive. These cover most day-to-day work:

```bash
pwd            # where am I?
cd /var/log    # change directory
ls -la         # list files with details
find / -name "*.conf" 2>/dev/null   # locate files, hide permission errors
grep -r "password" .                # search text recursively
ps aux         # list running processes
ss -tulpn      # list listening ports and sockets
man chmod      # read the manual for any command
```

`man <command>` and `<command> --help` are your fastest teachers - reach for them before searching the web.

## Getting a shell to practise on

You learn the shell by living in it. Pick whichever is easiest to start today:

- **Windows Subsystem for Linux (WSL).** Run `wsl --install` in an administrator PowerShell to get a real Ubuntu shell in minutes.
- **A virtual machine.** Spin up Kali or Ubuntu safely and reversibly by [setting up a VM](/en/page-3) - the recommended sandbox for anything hands-on.
- **macOS Terminal.** Already Unix-like; most commands above work as-is.

Once you have a prompt, practise deliberately. The **Bandit** wargame on OverTheWire teaches shell skills through a series of login puzzles, and the broader collections in [where to start](/en/where-to-start) point you toward safe, legal environments to keep going. Only ever run these commands against systems you own or are explicitly permitted to test.

## Hands-on lab: hunt for a SUID escalation path

Run this in a throwaway VM you own - Kali or Ubuntu is fine ([set one up here](/en/page-3)). You are playing the low-privileged attacker who has landed a normal-user shell and wants [root](/en/page-root-access).

1. **Confirm who you are.** A foothold rarely lands you as root:

```bash
whoami
id
```

2. **List every SUID binary on the box.** These run with their owner's privileges - usually root - so a vulnerable one is a shortcut upward:

```bash
find / -perm -4000 -type f 2>/dev/null
```

3. **Read the results, don't skim them.** Entries like `sudo`, `passwd`, and `mount` are expected. What matters is anything unusual: a stray copy of `find`, `vim`, `python3`, `cp`, or a custom admin script left SUID-root.

4. **Plant a deliberately vulnerable case.** In a second terminal become root and create one:

```bash
sudo cp /usr/bin/find /tmp/find
sudo chmod 4755 /tmp/find
```

5. **Exploit it from your normal shell.** `find` can execute commands, and with the SUID bit it runs them as root:

```bash
/tmp/find . -exec /bin/sh -p \; -quit
whoami   # root
```

The `-p` flag stops the shell from dropping the inherited privileges. This mirrors real engagements: the reference site **GTFOBins** catalogues exactly which binaries can be abused this way.

6. **Clean up, then switch hats.** Delete `/tmp/find` and think like a defender. A periodic `find / -perm -4000` baseline, diffed over time, flags any new SUID file the moment it appears. Trimming the SUID set to the bare minimum is one of the cheapest [OS hardening](/en/page-os-security) wins there is.
