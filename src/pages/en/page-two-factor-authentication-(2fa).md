---
title: Two-Factor Authentication (2FA)
description: How two-factor authentication works, from SMS and TOTP to phishing-resistant passkeys, why SMS is weak, and how attackers bypass 2FA in the real world.
layout: ../../layouts/MainLayout.astro
---

Two-factor authentication (2FA) requires a second proof of identity in addition to your password, so a stolen or guessed password alone is not enough to log in. It is one of the highest-impact controls a user or organisation can turn on, but not every implementation is equally strong.

## The three authentication factors

Authentication factors fall into three categories. Real 2FA combines two factors from **different** categories:

- **Something you know** — a password, PIN, or passphrase.
- **Something you have** — a phone running an authenticator app, a hardware security key, or a smartcard.
- **Something you are** — a biometric such as a fingerprint or face scan.

A password plus a security question is _not_ 2FA: both are "something you know." Requiring a password and a code from your phone is, because it spans two categories.

## How 2FA works in practice

The most common second factor is a one-time password (OTP) — a short, short-lived code. Two standards dominate:

- **HOTP (RFC 4226)** — a counter-based code that changes each time it is used.
- **TOTP (RFC 6238)** — a time-based code derived from a shared secret and the current time, rolling over every 30 seconds. This is what Google Authenticator, Aegis, 2FAS, and Authy generate.

When you scan a QR code during setup, you are importing an `otpauth://` URI that carries the shared secret. Both the server and your app hold that secret and compute the same code independently — nothing is transmitted, which is why TOTP works offline.

```text
otpauth://totp/GitHub:alice?secret=JBSWY3DPEHPK3PXP&issuer=GitHub&algorithm=SHA1&digits=6&period=30
```

You can compute a TOTP from the command line with `oathtool`, which is handy for testing or scripting:

```bash
# Current 6-digit TOTP from a Base32 shared secret
oathtool --totp --base32 "JBSWY3DPEHPK3PXP"
```

## Methods ranked by strength

Not all second factors resist the same attacks. Roughly from weakest to strongest:

1. **SMS and email codes** — better than nothing, but the code travels over channels an attacker can intercept. SIM-swap fraud, SS7 signalling abuse, and a compromised inbox all defeat them. NIST has discouraged SMS as a primary factor for years.
2. **TOTP authenticator apps** — no network dependency and no telco to social-engineer. Still phishable: a fake login page can relay the code you type in real time.
3. **Push approvals** — you tap "approve" in an app. Convenient, but vulnerable to _MFA fatigue_, where an attacker spams prompts hoping you approve one. **Number matching** (typing a code shown on the login screen into the app) hardens this considerably.
4. **FIDO2 / WebAuthn security keys and passkeys** — a hardware key (such as a YubiKey) or a passkey stored on your phone or laptop. The credential is cryptographically bound to the site's origin, so it simply will not sign in to a look-alike domain. This is the only widely deployed **phishing-resistant** category.

If an account supports passkeys or hardware keys, prefer them for anything valuable — email, banking, cloud consoles, and code repositories.

## How attackers bypass weaker 2FA

Understanding these techniques is defensive knowledge for authorised testing and threat modelling, not a licence to target accounts you do not own.

- **Adversary-in-the-middle (AiTM) phishing** — kits like Evilginx run a reverse proxy between the victim and the real site. The victim enters their password _and_ OTP on the proxy, which forwards them and steals the resulting session cookie, sidestepping any code-based factor. See [The Art of Phishing](/en/page-5) and [Phishing Attack](/en/page-phishing-attack).
- **MFA fatigue / prompt bombing** — flooding a user with push requests until one is approved by mistake.
- **SIM swapping** — [social engineering](/en/page-socialEngineering) a carrier into porting a victim's number to attacker-controlled hardware to receive SMS codes.
- **Weak recovery flows** — many breaches never touch 2FA at all; they reset it through an insecure "lost your device?" path.

Passkeys and FIDO2 keys defeat the phishing and AiTM cases outright, because the credential never leaves the device and refuses to authenticate to the wrong origin.

## Hardening your 2FA

- Enable 2FA everywhere it is offered, starting with your primary email — it is the reset path for everything else.
- Choose phishing-resistant factors where available; otherwise favour an authenticator app over SMS.
- Turn on number matching for push, and treat unexpected prompts as an attack — deny and change your password.
- Store backup/recovery codes offline in a safe place, and secure the account recovery options as carefully as the login itself.
- Register a second hardware key or passkey as a backup so a lost device does not lock you out.

2FA is a force multiplier on a strong, unique password from a [password manager](/en/page-secure-passwords), not a replacement for one. Layer it with the rest of your account hygiene and you close off the most common route attackers use: a single reused or leaked credential.
