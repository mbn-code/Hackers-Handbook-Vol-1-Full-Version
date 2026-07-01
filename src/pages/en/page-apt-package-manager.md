---
title: APT Package Manager
description: How APT installs, updates, and audits software on Debian and Ubuntu Linux, plus the security practices every ethical hacker should know about repositories.
layout: ../../layouts/MainLayout.astro
---

APT (Advanced Package Tool) is the software management system behind Debian, Ubuntu, Kali, Linux Mint, and Raspberry Pi OS. It fetches packages from remote repositories, resolves their dependencies, verifies their signatures, and installs them in a single command. For anyone learning security on a Debian-based box, APT is the tool you reach for a hundred times a day.

## What APT Actually Does

A "package" is a compressed `.deb` archive containing a program's files plus metadata: version, description, and — crucially — a list of other packages it depends on. APT reads that metadata to solve the dependency graph for you, so installing one tool automatically pulls in the libraries it needs.

The system splits into layers. The low-level `dpkg` unpacks and registers individual `.deb` files but knows nothing about dependencies or where packages come from. APT sits on top: it talks to repositories, downloads what is required, and hands the files to `dpkg` in the right order. In day-to-day use you interact with the `apt` command, a friendlier front end than the older `apt-get` and `apt-cache` tools you will still see in scripts and tutorials.

## Core Commands

Modern `apt` covers almost everything from one binary. These commands need root, so they are prefixed with `sudo` — see [Root Access](/en/page-root-access) for why elevated privileges matter here.

```bash
# Refresh the local list of available packages and versions
sudo apt update

# Install a package and everything it depends on
sudo apt install nmap

# Upgrade every installed package to its newest available version
sudo apt upgrade

# Remove a package but keep its config files
sudo apt remove wireshark

# Remove a package along with its config files
sudo apt purge wireshark

# Delete orphaned dependencies nothing else needs anymore
sudo apt autoremove

# Search available packages by name or keyword
apt search "packet capture"

# Show a package's version, dependencies, and description
apt show metasploit-framework
```

`apt update` and `apt upgrade` are two different jobs. The first only refreshes the _catalogue_ of what is available; the second actually downloads and applies newer versions. Run them in that order. For a full distribution upgrade that can add or remove packages to satisfy new dependencies, use `sudo apt full-upgrade`.

## Repositories and Trust

APT pulls from repositories defined in `/etc/apt/sources.list` and files under `/etc/apt/sources.list.d/`. Each line points to a mirror and a set of components. Newer releases increasingly ship these as `.sources` files in the deb822 format, which is more readable but serves the same role.

Every official repository is signed with a GPG key. When you run `apt update`, APT checks that the package index was signed by a key it trusts, and it verifies each downloaded package against a checksum. This is what stops an attacker who controls the network — or a malicious mirror — from silently swapping in a tampered package. If a signature fails, the update aborts.

That trust model is only as strong as the keys you add. Older guides told you to pipe keys straight into `apt-key add`; that command is deprecated because it granted a key authority over _all_ repositories. The current practice is to place a key in `/etc/apt/keyrings/` and scope it to a single source with the `signed-by=` option:

```bash
# Store a repository's signing key in its own dedicated file
sudo curl -fsSL https://example.com/repo.gpg \
  -o /etc/apt/keyrings/example.gpg
```

```text
# In the matching .list file, bind that key to this source only
deb [signed-by=/etc/apt/keyrings/example.gpg] https://example.com/apt stable main
```

## Security Notes for Hackers and Defenders

Third-party repositories and one-line `curl | sudo bash` installers are a real supply-chain risk. Adding a repo means trusting its maintainer with root on your machine every time you upgrade. Read what a script does before piping it into a shell, prefer the distribution's own packages when they exist, and treat unsigned or HTTP-only sources as suspect. A compromised repository is a classic delivery path for [malware](/en/page-malware), so this discipline is part of good [operating system security](/en/page-os-security).

Keeping packages current is also patch management. Most exploited flaws are known bugs with fixes already shipped; running `apt update && apt upgrade` regularly closes the window on that whole class of [vulnerability](/en/page-vulnerability). On servers, the `unattended-upgrades` package can apply security patches automatically. For investigators, APT keeps useful evidence: `/var/log/apt/history.log` records what was installed and when, and `dpkg -l` lists every package present — both are worth checking during [incident response](/en/page-incident-response) when you suspect a host was tampered with.
