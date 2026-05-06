---
title: Bash Scripting in Hacking 
description: Learn the fundamentals of Bash, the default language of the Linux terminal.
layout: ../../layouts/MainLayout.astro
---

# Bash (Bourne-Again Shell) 

If you are using Kali Linux, Parrot OS, or even macOS, you are interacting with **Bash** (or a very similar shell like Zsh) every time you open the terminal. 

Bash, short for "Bourne-Again Shell," is a command-line interpreter and scripting language for Unix-like  [Operating Systems](page-2). It is the glue that holds Linux together and is an absolute necessity for any aspiring hacker or penetration tester.

## What Is Bash? 

Bash is a text-based interface (CLI) that allows you to communicate directly with your computer's operating system. Instead of clicking on folders and icons with a mouse, you type commands. 

While it might seem intimidating at first, typing commands is vastly faster and more powerful than using a graphical interface (GUI).

### Essential Bash Commands

Before you can script, you need to know the basic commands of the  [Linux Shell](page-linux-shell):

- `pwd` (Print Working Directory): Shows you where you currently are in the file system.
- `ls` (List): Lists all the files and folders in your current directory.
- `cd` (Change Directory): Moves you into a different folder (e.g., `cd /Desktop`).
- `cat` (Concatenate): Reads a file and prints its contents to the screen (e.g., `cat passwords.txt`).
- `grep` (Global Regular Expression Print): Searches through text for a specific word or pattern. 
- `chmod` (Change Mode): Modifies the read, write, and execute permissions of a file.

## Scripting: Putting It All Together 

Typing one command at a time is useful, but what if you need to run 50 commands in a row? That's where **Bash Scripting** comes in. 

A Bash script is simply a plain text file containing a list of commands. When you execute the file, the shell reads it from top to bottom and runs every command for you.

### Example: A Simple Reconnaissance Script

Imagine you want to scan a target network. Instead of running `ping` on every single IP address manually, you can write a short Bash script!

Create a file named `sweep.sh`:

```bash
#!/bin/bash
# This is a simple ping sweep script!

echo "Starting Ping Sweep on 192.168.1.x..."

for ip in {1..254}; do
    ping -c 1 192.168.1.$ip | grep "64 bytes" | cut -d " " -f 4 | tr -d ":" &
done

echo "Sweep Complete!"
```

**How to run it:**
1. First, make the script executable: `chmod +x sweep.sh`
2. Run it using bash: `./sweep.sh`

*(Note: We use the `.sh` extension just to remind ourselves it's a shell script, but Linux actually relies on the `#!/bin/bash` at the very top of the file, known as a "shebang", to know how to run it).*

## Why Hackers Love Bash 

- **Piping (`|`):** Bash allows you to take the output of one tool and feed it directly as the input into another tool using the pipe symbol (`|`). This is incredibly powerful.
- **Built-in:** You don't need to install Python or Ruby. If you hack into a Linux server, Bash is already there waiting for you.
- **Automation:** Hackers use Bash scripts to automate tedious tasks, such as brute-forcing directories or parsing massive lists of IP addresses before feeding them into  [Nmap](page-4).

For more advanced logic and complex scripts, hackers often transition to  [Python Scripting](page-7), but Bash remains the undisputed king of fast, dirty, and effective terminal automation.
