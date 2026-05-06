---
title: Metasploitable VM Setup 
description: A step-by-step guide to installing the ultimate hacking playground.
layout: ../../layouts/MainLayout.astro
---

# Setting Up Your Hacking Target: Metasploitable 2 

You can't learn how to hack by just reading a book,you have to get your hands dirty! However, hacking real servers on the internet is highly illegal. The solution? Build your own vulnerable server to practice on safely.

**Metasploitable 2** is a Linux  [Virtual Machine](page-3) created by the Rapid7 team (the same people who make  [Metasploit](page-6)). It is intentionally riddled with severe security flaws, making it the perfect training ground to practice  [Port Scanning](page-port-scanning), exploiting, and gaining  [Root Access](page-root-access).

Follow this guide to get it running safely in VirtualBox.

---

## Step 1: Download the Requirements

1. **VirtualBox:** If you haven't already, download and install [Oracle VirtualBox](https://www.virtualbox.org/wiki/Downloads).
2. **Metasploitable Image:** Head over to the Rapid7 website to download the VM: [Download Metasploitable 2](https://information.rapid7.com/download-metasploitable-2017-thanks.html)

*(You may need to fill out a short registration form to access the download link. Click the blue "DOWNLOAD METASPLOITABLE NOW" button).*

![Website download](/src/pages/en/images/Metasploitable-website.png)

---

## Step 2: Extract the Files 

Once the download (`metasploitable-linux-2.0.0.zip`) is finished, locate it in your Downloads folder. 
- Extract the ZIP file. 
- Inside the extracted folder, look for a file named **`Metasploitable.vmdk`**. This is a Virtual Machine Disk file, which acts as the hard drive for our new VM.

![File in folder](/src/pages/en/images/metasploitable-linux%20file%20in%20folder.png)

---

## Step 3: Create the Virtual Machine in VirtualBox 

Now, open VirtualBox and follow these steps carefully:

1. Click the **"New"** button at the top of the VirtualBox interface.
   ![New VM](/src/pages/en/images/ClickNewVM.png)

2. **Name and Operating System:**
  , **Name:** Enter `Metasploitable 2` (or anything you like).
  , **Type:** Select `Linux`.
  , **Version:** Select `Ubuntu (64-bit)` or `Ubuntu (32-bit)`.
   ![Name and choosing](/src/pages/en/images/naming%20and%20choosing.png)

3. **Memory Size (RAM):**
  , Allocate **1024 MB (1 GB)** of RAM. Metasploitable runs entirely via the  [Linux Shell](page-linux-shell) without a graphical user interface, so it requires very little computational power! Click "Next".

4. **Hard Disk:**
  , This is the crucial step. Instead of creating a new hard disk, select **"Use an existing virtual hard disk file"**.
  , Click the small yellow folder icon next to the dropdown menu.
   ![Yellow Folder icon](/src/pages/en/images/yello%20Folder%20icon%20.png)
  , Click **"Add"**, navigate to the folder where you extracted the download in Step 2, and select the **`Metasploitable.vmdk`** file.
   ![Find mvdk file](/src/pages/en/images/FInd%20metasploitable.vmdk.png)
  , Finally, click **"Create"**.

---

## Step 4: Network Configuration  (CRITICAL)

Because Metasploitable is incredibly vulnerable, **you must ensure it is not exposed to the open internet!**

1. Right-click your new `Metasploitable 2` VM in VirtualBox and select **Settings**.
2. Go to the **Network** tab.
3. Change the "Attached to" dropdown from "NAT" to **"Host-only Adapter"** (or "Internal Network"). 
  , *This ensures the VM can only communicate with your host machine (like your Kali Linux VM) and cannot access the wider internet.*

---

## Step 5: Power On and Hack! 

You are done! Select the VM and click the green **Start** arrow.

You will see lines of text scrolling by as the Linux server boots up. Eventually, it will prompt you for a login. 

- **Username:** `msfadmin`
- **Password:** `msfadmin`

Once logged in, type `ip a` or `ifconfig` to find the machine's  [IP Address](page-ip). Now, switch over to your attacker machine (Kali Linux), fire up  [Nmap](page-4), and start finding those vulnerabilities! Happy hacking!
