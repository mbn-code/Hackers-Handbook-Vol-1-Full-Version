---
title: Phishing ⚙️
description: Learn about phishing, its purpose, and how to use it responsibly.
layout: ../../layouts/MainLayout.astro
---

# Understanding Phishing 🎣

Phishing is a form of ⚙️ [social engineering](page-socialEngineering) where an attacker employs deceptive tactics to manipulate individuals into divulging sensitive information or installing malicious software, such as ransomware, on their systems.

## Phishing in the World of Hacking 🌐

Phishing falls under the domain of ⚙️ [social engineering](page-socialEngineering), where attackers exploit human psychology to deceive people into actions they wouldn't typically perform, often unknowingly causing harm.

## The Motive Behind Phishing 🧑‍💻

Hackers resort to phishing to gain access to users' credentials for websites and more. An example tool for carrying out phishing attacks is ⚙️ [Zphisher](https://github.com/htr-tech/zphisher).

## Installing Zphisher from GitHub 🌐

To begin, open your terminal in Kali Linux and follow these steps to obtain ⚙️ [Zphisher](https://github.com/htr-tech/zphisher) from its GitHub repository:

1. Clone the repository with this command:
```markdown
git clone --depth=1 https://github.com/htr-tech/zphisher.git
```
   **Result:**
   ```markdown
   Cloning into 'zphisher'...
   [Additional details on cloning]
   ```

2. Change your current directory to the 'zphisher' directory:
```markdown
cd zphisher
```
   **Result:**
   ```markdown
   Directory changed to 'zphisher'
   ```

3. Execute the script with the following command:
```markdown
bash zphisher.sh
```
   **Result:**
   ```markdown
   [+] Installing required packages...
   [Additional installation details]
   ```

   You will be presented with Zphisher's interactive menu for selecting your target platform and preferred phishing method.

## Using Zphisher: An Example 🎯

When the menu appears, you can choose your target platform and the specific phishing method. Suppose we select '3' for Google and '2' for "Gmail New Login Page." Then, you'll be prompted to choose the service for generating the phishing link. In this example, we use [localhost](page-localhost).

**This link is only accessible by you and should return:**
```markdown
  [Zphisher logo]
  [-] Successfully Hosted at : http://127.0.0.1:8080
  [-] Waiting for Login Info, Ctrl + C to exit...
```

## Why Use Bash for Running the File? 🐚

The file in question is a .sh file, signifying that it's a shell script using the bash scripting language. This is why we execute it using the bash command.
