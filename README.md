# Synergy+

> A modern, student-friendly gradebook interface for StudentVUE.

## Overview

Synergy+ is a full-stack web application that reimagines how students check their grades. Built as a response to the clunky, outdated StudentVUE interface, Synergy+ provides a clean, fast, and intuitive way for students to track their academic progress.

## Tech Stack

### Frontend
- **HTML5 / CSS3 / JavaScript** — Vanilla JS (no heavyweight frameworks)
- **Tailwind CSS** — Utility-first styling for rapid UI development
- **Materialize** — Responsive component library
- **Alpine.js** — Lightweight interactivity
- **Service Workers** — Progressive Web App support

### Backend
- **Node.js + Express** — Fast, lightweight server
- **MongoDB** — User sessions and data storage
- **Redis** — Caching and rate limiting (optional)
- **FIDO2/WebAuthn** — Passwordless authentication via `fido2-library`

### Security
- **AES-128-CBC** — Credential encryption
- **bcrypt** — Password hashing
- **Express Session** — Secure session management
- **CSRF Protection** — Cross-site request forgery mitigation


### Structure
```
synergyplus/
├── index.js                    # Main Express server
├── libraries/
│   ├── svcore.js              # StudentVUE API wrapper
│   ├── svuelib.js             # Grade parsing & calculations
│   ├── cryptoHelper.js        # AES-128 encryption/decryption
│   ├── webauthn.js            # WebAuthn/FIDO2 support
│   ├── notifier.js            # Email notifications
│   └── weather.js             # Weather integration
├── public/
│   ├── index.html             # Landing page
│   ├── signin.html            # Login page
│   ├── signup.html            # Registration
│   ├── app/                   # PWA app shell
│   └── css/, js/              # Frontend assets
├── protected/
│   └── dashboard.html         # Main dashboard (auth required)
├── secure/                    # Ignored by git (credentials)
│   └── credentials.json       # API keys, encryption key, etc.
└── tools/                     # Build & utility scripts
```


## Security
**Credentials are never logged, displayed, or sent to third parties.**

Synergy+ takes security seriously:

-  **No Permanent Credential Storage** — Credentials are encrypted and only kept for the session
- **AES-128-CBC Encryption** — All sensitive data at rest is encrypted
- **Secure Sessions** — HttpOnly, Secure, SameSite cookies
- **HTTPS Only** — Enforced in production
- **WebAuthn Support** — FIDO2-compliant passwordless auth
- **Rate Limiting** — Protection against brute-force attacks
- **CSRF Protection** — Prevents cross-site request forgery


## Disclaimer

**Synergy+ is not affiliated with, endorsed by, or associated with Edpoint, Inc.** (creators of StudentVUE). This is an independent student project created to provide a better user experience for grade checking.


## Privacy

Your data is important to us:

- **No Analytics Tracking** — We don't collect usage data (unless explicitly enabled in your school's deployment)
- **No Third-Party Sharing** — Your grades are never shared with external services
- **No Ad Networks** — Synergy+ is completely ad-free
- **Transparent Encryption** — All encryption happens on the server; you're welcome to audit the code