---
title: Bash Scripting in Hacking
description: "Master Bash scripting for ethical hacking: essential Linux commands, pipes, loops, and automation that speed up recon, parsing, and authorised testing."
layout: ../../layouts/MainLayout.astro
---

Open a terminal on Kali, Parrot, Ubuntu, or macOS and you are almost certainly talking to Bash or a close cousin like Zsh. It is the command interpreter that ties a Unix system together, and for anyone doing authorised security work it is the fastest way to turn a repetitive task into a one-line reflex.

Bash, short for "Bourne-Again Shell," is both an interactive shell and a full scripting language for Unix-like [operating systems](/en/page-2). Learn it well and you spend less time clicking and more time thinking.

<figure class="hh-video">
  <video controls preload="none" playsinline poster="/en/images/recon-walkthrough-poster.png">
    <source src="/en/videos/recon-walkthrough.webm" type="video/webm" />
    <source src="/en/videos/recon-walkthrough.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <figcaption>Mapping a network with nothing but Bash built-ins before reaching for heavier tools.</figcaption>
</figure>

## What Bash Actually Is

Bash is a text interface to your operating system. Instead of dragging icons, you type a command, the shell interprets it, runs the matching program, and shows you the output. That sounds primitive until you realise the trade-off: a GUI can only do what its buttons allow, whereas the shell lets you combine hundreds of small tools in any order you like.

For hands-on drills with the shell itself, see [The Linux Shell](/en/page-linux-shell). The commands below are the ones you will reach for constantly.

### Commands Worth Memorising

- `pwd` — print the working directory so you always know where you are.
- `ls -la` — list files including hidden ones, with permissions and sizes.
- `cd` — change directory (`cd /var/log`, `cd ..` to go up one level).
- `cat` / `less` — dump a file to the screen, or page through a large one.
- `grep` — search text for a pattern (`grep -i "password" config.txt`).
- `find` — locate files by name, size, or permission (`find / -perm -4000 2>/dev/null`).
- `chmod` — change read/write/execute permissions (`chmod +x script.sh`).
- `awk` and `sed` — slice columns and transform text on the fly.

## Writing Your First Script

A Bash script is nothing more than a plain-text file holding the same commands you would type by hand. Run it, and the shell reads it top to bottom.

The first line is special. The `#!/bin/bash` "shebang" tells the kernel which interpreter to use. The `.sh` extension is only a convention for humans; the shebang is what actually matters.

### A Ping Sweep on Your Own Network

Reconnaissance often starts with a basic question: which hosts on this subnet are alive? Pinging 254 addresses by hand is miserable, so let a loop do it. Only run this against a network you own or are explicitly authorised to test.

Create a file named `sweep.sh`:

```bash
#!/bin/bash
# Ping sweep for an authorised /24 network.

network="192.168.1"

echo "Sweeping ${network}.0/24 for live hosts..."

for host in {1..254}; do
    ping -c 1 -W 1 "${network}.${host}" | grep -q "bytes from" \
        && echo "${network}.${host} is up"
done

echo "Sweep complete."
```

Make it executable and run it:

```bash
chmod +x sweep.sh
./sweep.sh
```

`ping -c 1` sends a single packet and `-W 1` caps the wait at one second so dead addresses do not stall the loop. This version runs sequentially, which is easy to read. To speed it up, background each check with a trailing `&` and add a `wait` at the end so all pings fire in parallel.

Once you have a list of live hosts, feed it into a real scanner. Bash and [Nmap](/en/page-4) pair naturally: use the shell to generate targets, then let Nmap fingerprint services and ports.

## Pipes, Redirection, and the Unix Philosophy

The real power of Bash is composition. Each tool does one thing; the pipe `|` sends the output of one straight into the next. Redirection operators steer that flow to and from files.

```bash
# Pull the 10 most common source IPs out of an access log.
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -n 10

# Save results to a file, and send errors somewhere else.
nmap -sV 192.168.1.10 > scan.txt 2> errors.txt
```

Key operators:

- `|` — pipe stdout of one command into stdin of the next.
- `>` and `>>` — overwrite or append output to a file.
- `2>` — redirect error messages (stderr) separately from normal output.
- `&&` and `||` — run the next command only on success, or only on failure.

## Variables, Loops, and Conditionals

Scripts get useful when they make decisions. Bash gives you variables, `for`/`while` loops, and `if` tests. Note the strict spacing inside `[ ... ]` — a missing space is the classic beginner bug.

```bash
#!/bin/bash
# Check whether a host answers before scanning it.

target="192.168.1.10"

if ping -c 1 -W 1 "$target" &>/dev/null; then
    echo "$target is reachable, scanning..."
    nmap -T4 "$target"
else
    echo "$target is down, skipping."
fi
```

Reading a wordlist line by line is another everyday pattern, used everywhere from log triage to [brute-force](/en/page-brute-force-attack) tooling:

```bash
while read -r line; do
    echo "Trying: $line"
done < wordlist.txt
```

## Why It Matters to Attackers and Defenders

- **It is always there.** Break into (or defend) a Linux box and Bash is already installed. No dependency to drag along, no interpreter to smuggle in.
- **Automation.** Directory discovery, log parsing, mass DNS lookups, and cleanup after a test all shrink to a few lines.
- **Glue.** Bash rarely does the heavy lifting itself; it orchestrates the tools that do, wiring their outputs together into a pipeline.
- **Blue-team value.** The same skills that automate an assessment let defenders grep logs, alert on suspicious files, and script incident cleanup.

For branching logic, structured data, and anything that outgrows a screen or two, most practitioners move to [Python](/en/page-7). But for quick, sharp, throwaway automation on the command line, Bash stays the tool you reach for first.

## Common Mistakes That Bite You

Bash is forgiving in ways that hurt you later. A handful of habits separate scripts that survive contact with messy, real-world data from ones that quietly corrupt output or delete the wrong files.

- **Unquoted variables.** `rm $file` breaks the moment a filename contains a space, and it silently expands `*` if the variable holds a glob. Quote everything you do not deliberately want split: `rm "$file"`. This is the single most common source of broken — and dangerous — scripts.
- **Skipping the safety header.** Start non-trivial scripts with `set -euo pipefail`. Without it, a failed command in the middle keeps running, an unset variable expands to nothing, and a broken pipe hides its exit code — so a line like `cd "$dir"; rm -rf *` will happily wipe your current directory when `$dir` is empty and the `cd` fails.
- **Looping over `ls` or `cat`.** `for f in $(ls)` and `for line in $(cat file)` both split on whitespace and choke on real filenames. Read line by line instead: `while IFS= read -r line; do ...; done < file`.
- **Spacing inside tests.** `[ "$a" = "$b" ]` needs spaces around the brackets and the `=`; `[$a=$b]` is not a comparison, it is a command name the shell cannot find.
- **Scraping tool output blindly.** Grepping `nmap` or `ping` text works until the format shifts a version later. When a tool offers structured output — `nmap -oX`/`-oG`, or JSON from newer utilities — parse [Nmap](/en/page-4) output that way instead of screen-scraping the human view.

Test destructive one-liners by putting `echo` in front of the dangerous command first, and keep untrusted input far away from anything you pass to `eval`. Treat your own automation with the same rigor you would apply reviewing someone else's [code](/en/page-secure-coding): a sloppy quoting bug in a cleanup script can do as much damage on your lab box as any exploit you launch from it.
