---
title: Metasploit
description: What is metasploit, what do we use it for and how can we use it. 
layout: ../../layouts/MainLayout.astro
---

This is a fully-featured page, written in Markdown!

## Section A


This is for the tutorials and examples @ [metasploit](page-6).

First download virtualbox if you haven't: https://www.virtualbox.org/wiki/Downloads

Go to the website here: https://information.rapid7.com/download-metasploitable-2017-thanks.html

Then you should see this website. 


![Website download](/src/pages/en/images/Metasploitable-website.png)

If you see this website, click on the blue button at the top of the page saying "DOWNLOAD METASPLOITABLE NOW"

![Thanks for reg](/src/pages/en/images/thanks-for-reg.png)

After the download is finished:

Go to the location where your downloads save, and open the metasploitable-linux-2.0.0.zip (or rar) and extract the Metasploitable.vmdk (This is the file we are going to use to setup the VM on virtualbox).

![File in folder](/src/pages/en/images/metasploitable-linux%20file%20in%20folder.png)

Now open Virtualbox

![Open VB](/src/pages/en/images/openVB.png)

Click the button at the top that says "New"

![New VM](/src/pages/en/images/ClickNewVM.png)

Call it anything you want, - but it's smart to call it something like "metasploitable vm" if you have multiple VMs.

![Name and choosing](/src/pages/en/images/naming%20and%20choosing.png)

Set the type to linux and version to Ubuntu
Click "Next >"

You only need to allocate 1 gb ram because this is very light weight and is going to be ran as a virtual ubuntu server.

Press on the yellow folder icon (Mine is already selected as metasplkoitable.vmdk because I have already installed it before)

![Yellow Folder icon](/src/pages/en/images/yello%20Folder%20icon%20.png)

After clicking on the yellow folder icon press on the add button, and find the metasploitable.vmdk

![Find mvdk file](/src/pages/en/images/FInd%20metasploitable.vmdk.png)

Then press on create

![Yellow Folder icon](/src/pages/en/images/yello%20Folder%20icon%20.png)

Now you are done, now you can start the machine and start hacking it. You don't need to up the ram or cpu cores because this is only running a Command line interface which does not need a lot of computational power.
