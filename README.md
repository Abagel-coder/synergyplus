# Synergy+

> A modern, student-friendly gradebook interface for StudentVUE.

## Overview

Synergy+ is a full-stack web application that reimagines how students check their grades. Built as a response to the clunky, outdated StudentVUE interface, Synergy+ provides a clean, fast, and intuitive way for students to track their academic progress.

**The Problem:** The school's official grade portal (StudentVUE) is slow, cluttered, and frustrating to use. Students at Foothill High needed a better way to check grades.

**The Solution:** Synergy+ is a modern wrapper around StudentVUE that strips away the bloat and delivers what students actually care about: their grades, in a beautiful, responsive interface.

## Features

### 📊 Grade Management
- **Instant Grade Lookup** — See all your grades at a glance
- **Assignment Details** — Click into any assignment to see scoring breakdown
- **Grade Trends** — Visualize your performance over time with interactive charts
- **GPA Calculator** — Understand how each assignment impacts your overall grade
- **Multiple Reporting Periods** — Track progress across all semesters

### 🔐 Security & Privacy
- **No Permanent Storage** — Your StudentVUE credentials are never saved
- **Encrypted Sessions** — All data is encrypted with AES-128-CBC
- **WebAuthn Support** — Sign in with security keys for passwordless authentication
- **Zero Tracking** — No analytics, no third-party sharing

### 📱 Responsive Design
- **Mobile-First** — Optimized for phones, tablets, and desktops
- **Progressive Web App** — Install as an app on iOS/Android
- **Dark Mode** — Easy on the eyes during late-night study sessions
- **Offline Support** — Service workers cache data for offline access

### 🎯 Student-Centric Features
- **Course History** — Review grades from past semesters
- **Assignment Export** — Download your assignments as Excel or PDF
- **Notifications** — Get alerts when grades are posted
- **Customizable Views** — Personalize your dashboard

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

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- MongoDB (local or Atlas)
- A StudentVUE account for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abagel-coder/synergyplus.git
   cd synergyplus
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URL=mongodb://localhost:27017/svueplus
   SESSION_SECRET=your-secure-random-key
   AES_KEY=your-32-character-hex-encryption-key
   MAIL_EMAIL=your-email@gmail.com
   MAIL_PASS=your-app-password
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The app will run at `http://localhost:8080`

### Development

```bash
# Start with nodemon for auto-restart on file changes
npm run dev

# Run security audit
npm audit

# Build production assets (Webpack)
npm run build
```

## Architecture

### Directory Structure
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

### Data Flow

```
Student Browser
    ↓
Synergy+ Server (Node.js + Express)
    ↓ (encrypted credentials)
StudentVUE API (school portal)
    ↓ (XML response)
Parse & Store
    ↓
Return to Student (clean JSON)
```

## How It Works

1. **Login** — Student enters StudentVUE credentials into Synergy+
2. **Fetch** — Server securely fetches grade data from StudentVUE
3. **Parse** — Grade data is parsed from XML and stored encrypted
4. **Display** — Frontend renders grades in a clean, modern interface
5. **Logout** — Credentials are deleted; no permanent storage

**Credentials are never logged, displayed, or sent to third parties.**

## Security

Synergy+ takes security seriously:

- ✅ **No Permanent Credential Storage** — Credentials are encrypted and only kept for the session
- ✅ **AES-128-CBC Encryption** — All sensitive data at rest is encrypted
- ✅ **Secure Sessions** — HttpOnly, Secure, SameSite cookies
- ✅ **HTTPS Only** — Enforced in production
- ✅ **WebAuthn Support** — FIDO2-compliant passwordless auth
- ✅ **Rate Limiting** — Protection against brute-force attacks
- ✅ **CSRF Protection** — Prevents cross-site request forgery

See [`SECURITY.md`](SECURITY.md) for detailed security guidelines.

## Disclaimer

**Synergy+ is not affiliated with, endorsed by, or associated with Edpoint, Inc.** (creators of StudentVUE). This is an independent student project created to provide a better user experience for grade checking.

Synergy+ is a **wrapper service only** — it does not alter, modify, or store your grades. It simply provides a better interface to view the data already available on StudentVUE.

## Privacy

Your data is important to us:

- **No Analytics Tracking** — We don't collect usage data (unless explicitly enabled in your school's deployment)
- **No Third-Party Sharing** — Your grades are never shared with external services
- **No Ad Networks** — Synergy+ is completely ad-free
- **Transparent Encryption** — All encryption happens on the server; you're welcome to audit the code

## Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request.

### Bug Reports
Found an issue? Please open an [issue](https://github.com/Abagel-coder/synergyplus/issues) with:
- Device/browser info
- Steps to reproduce
- Expected vs. actual behavior

### Feature Requests
Have an idea? Open an [issue](https://github.com/Abagel-coder/synergyplus/issues) and let us know what would improve your experience!

## Roadmap

- [ ] Dark mode refinements
- [ ] Grade prediction ML model
- [ ] Comparative analytics (class average, percentile)
- [ ] Assignment reminders
- [ ] Parent/teacher access (with permissions)
- [ ] Integration with other student portals

## Performance

- **Page Load:** < 1 second (cached)
- **API Response:** < 200ms (average)
- **Grade Parse:** < 500ms (first load)
- **Mobile:** 90+ Lighthouse score

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari | ✅ Latest 2 versions |
| Mobile Safari (iOS) | ✅ iOS 13+ |
| Chrome Mobile | ✅ Android 8+ |

## Project Status

**Active Development** — Synergy+ is actively maintained and used by students at Foothill High School.

## License

MIT License — See [`LICENSE`](LICENSE) for details.

## Acknowledgments

Built with ❤️ by students, for students.

Thanks to:
- [Materialize CSS](https://materializecss.com/) — Beautiful component library
- [FIDO Alliance](https://fidoalliance.org/) — WebAuthn standards
- [Express.js](https://expressjs.com/) — Web framework
- The Foothill High community for the feedback and support

## Questions?

- 📧 Email: [ab370594588@gmail.com](mailto:ab370594588@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/Abagel-coder/synergyplus/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Abagel-coder/synergyplus/discussions)

---

**Made by students. For students. Forever free.** 🎓
