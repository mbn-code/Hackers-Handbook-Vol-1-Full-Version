---
title: Nmap - Network mapper
description: What is nmap, how do we install it, what is it used for and how to use it.
layout: ../../layouts/MainLayout.astro
---

This is a fully-featured page, written in Markdown!

## What is nmap? 


## Is nmap legal?

If used appropriately, Nmap helps defend your network from hackers, because it allows you to immediately discover any security weaknesses in your systems. 

Another question is whether port scanning on external servers is legal. The legislation in this field is complex and differs by territory. Using Nmap to scan external ports can lead to you being banned by your ISP, so make sure you research the legal implications of using the program before you start using it more widely.

## How Does Nmap Work?

Nmap extends prior network auditing tools to deliver speedy, thorough network traffic assessments. It works by identifying the [host](page-host)s and [IP](page-ip)s that are active on a network and then analyzing these packets to offer information on each [host](page-host)s and [IP](page-ip), as well as the [operating systems](page-2) they are running.

## Knowledge to know before hand.

What is [Localhost](page-localhost) and an [IP](page-ip).

## installing nmap in linux terminal 

**You only need to do this if you are using an [operating system](page-2) which does not come with nmap pre-installed.** 

**If you are using ParrotOS or Kali-Linux the [operating system](page-2) will be pre-installed with nmap** 

If your [operating system](page-2) isn't pre-installed with nmap you can use the following commands depending on your [package maneger](page-packageMan)

[APT](page-apt) package maneger ( For the [operating system](page-2) installed in your VirtualBox)
    
    apt install nmap -y

If your [operating system](page-2) does not use the [APT](page-apt) package maneger I expect you are able to install nmap on your own.

## Nmap [syntax](page-syntax)

    nmap -v -A scanme.nmap.org
    nmap -v -sn 192.168.0.0/16 10.0.0.0/8
    nmap -v -iR 10000 -Pn -p 80

To get further information on the syntax and CLI options read the man page of nmap by using
    
    man nmap  

## nmap own test server

You can use the *scanme.nmap.org* to test your scanning, tho do not do it too often and stress the server too much.

**Be sure to read the rules of scanning the server before proceding to scan the server. Also do not scan random servers without permission**



## Nmap examples

Example 1 depicts a typical Nmap scan. In this example, the only Nmap options used are -A to enable OS and version identification, script scanning, and traceroute, -T4 for quicker execution, and the hostname.

    nmap -A -T4 scanme.nmap.org

Example 2 depicts a command for scanning all [TCP]() and [UDP]() ports

    sudo nmap -n -PN -sT -sU -p- scanme.nmap.org



Example 3 [Operating system](page-2) scan

OS scanning is one of the most powerful features of Nmap. When using this type of scan, Nmap sends TCP and UDP packets to a particular port, and then analyze its response. It compares this response to a database of 2600 operating systems, and return information on the OS (and version) of a host.

To run an OS scan, use the following command:

    nmap -O 'target IP'

Example 4 Disable [Domain Name Resolution](page-DNS)

Finally, you can speed up your Nmap scans by using the -n parameter to disable reverse DNS resolution. This can be extremely useful if you want to scan a large network. For example, to turn off DNS resolution for the basic ping scan mentioned above, add -n:

    nmap -sp -n 192.100.1.1/24

