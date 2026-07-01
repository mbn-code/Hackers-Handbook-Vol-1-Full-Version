---
title: SSL/TLS Certificate
description: How SSL/TLS certificates authenticate websites and encrypt traffic, how the handshake and certificate chain work, and how to inspect them with OpenSSL.
layout: ../../layouts/MainLayout.astro
---

An SSL/TLS certificate is a signed digital document that binds a public key to a hostname, letting a browser verify who it is talking to and set up an encrypted channel. In practice, it is the trust anchor behind the padlock and every `https://` address you use.

## SSL vs. TLS

"SSL certificate" is the name everyone still uses, but the SSL protocol itself is dead. SSL 2.0 and 3.0 are broken and disabled everywhere, and TLS 1.0/1.1 were deprecated in 2021. Modern connections run on **TLS 1.2** or **TLS 1.3**. The certificate is the same object regardless; only the handshake protocol changed. When you read "SSL certificate," think TLS.

## What the Certificate Actually Does

A certificate ties three things together and gets signed by a trusted authority:

- **Identity** — one or more hostnames in the Subject Alternative Name (SAN) field.
- **A public key** — used during the handshake to prove the server owns the matching private key.
- **A signature** — from a Certificate Authority (CA) whose root the browser already trusts.

That signature is the whole point. Anyone can generate a key pair, but only a CA that validated control of the domain will vouch for it. The certificate provides **authentication** (you are talking to the real host) and enables **encryption** and **integrity** for the session that follows. See [Cryptography](/en/page-cryptography) for the underlying primitives.

## The TLS Handshake, Briefly

1. The client says hello and offers the cipher suites and TLS versions it supports.
2. The server replies with its certificate (and any intermediate certificates in the chain).
3. The client validates the chain up to a trusted root, checks the hostname, and confirms the certificate is in date and not revoked.
4. Both sides derive a shared session key. TLS 1.3 uses ephemeral Diffie-Hellman, so each session gets **forward secrecy** — capturing the traffic and later stealing the server key still will not decrypt past sessions.

After the handshake, symmetric encryption protects the actual data. This is why passive [packet sniffing](/en/page-packet-sniffing) on a WPA2 network or a shared switch yields ciphertext, not credentials — the plaintext never crosses the wire.

## The Chain of Trust

Browsers do not trust your server certificate directly. They trust a small set of **root CAs** shipped with the OS or browser. Roots sign **intermediate** certificates, which in turn sign the **leaf** certificate for your domain. A validator walks this chain from leaf to root; if any link is missing, expired, or untrusted, the connection fails. A common production bug is forgetting to serve the intermediate certificate — it works in one browser that cached the intermediate and breaks in another.

## Validation Levels

- **Domain Validation (DV):** the CA only checks that you control the domain. Free and automated (e.g. via ACME/Let's Encrypt). This covers the vast majority of the web.
- **Organisation Validation (OV):** the CA also verifies the organisation exists.
- **Extended Validation (EV):** the strictest identity vetting.

A note on EV: older guides claim EV shows a "green address bar with the company name." Modern Chrome, Firefox, and Safari removed that UI years ago, because studies showed users ignored it. Today, DV and EV look identical in the address bar — a plain padlock. The padlock means the connection is encrypted and the certificate is valid. It does **not** mean the site is honest, which is why phishing kits happily serve valid HTTPS. Pair this page with [The Art of Phishing](/en/page-5).

## Inspecting a Certificate

You can read any public certificate from the command line with OpenSSL:

```bash
# Fetch and show the full certificate for a host
openssl s_client -connect example.com:443 -servername example.com </dev/null \
  | openssl x509 -noout -text

# Just the essentials: issuer, subject, validity dates, and SANs
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates -ext subjectAltName
```

The `-servername` flag sets the SNI value so the server returns the right certificate when several sites share one IP. To check what a running server negotiates, add `-tls1_3` or `-tls1_2` to force a version.

## Why It Matters for Security Work

- **Recon:** the SAN field of a certificate often leaks internal hostnames and subdomains. Certificate transparency logs (searchable via crt.sh) are a standard passive reconnaissance source during authorised assessments.
- **Misconfiguration hunting:** expired certificates, weak cipher suites, self-signed certificates on production, or an incomplete chain are frequent findings. Tools like `testssl.sh` and Qualys SSL Labs grade a server's TLS posture.
- **Interception with consent:** proxies such as [Burp Suite](/en/page-burp-suite) intercept HTTPS by installing their own CA in the client trust store, then minting per-host certificates on the fly. This only works on devices you control and configure — it is exactly the trust model TLS is designed to prevent an attacker from abusing.

Always keep certificate handling inside the scope of authorised testing. Presenting a fraudulent certificate or stripping TLS on traffic you do not own is illegal — review [Legal and Ethical Considerations](/en/page-legal-ethical) before touching live systems.

## Defensive Checklist

- Serve TLS 1.2 and 1.3 only; disable everything older.
- Include the full chain (leaf plus intermediates).
- Automate renewal so certificates never lapse.
- Enable HSTS so browsers refuse to downgrade to plaintext HTTP.
- Protect the private key with strict file permissions and, ideally, hardware or a secret manager.
