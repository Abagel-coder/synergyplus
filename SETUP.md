# Synergy+ Setup & Security Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/synergyplus.git
   cd synergyplus
   ```

2. **Copy environment template and configure**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values (database URL, API keys, encryption key, etc.)

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## Environment Configuration

All sensitive data must be configured via environment variables in `.env`:

- `MONGODB_URL` — MongoDB connection string
- `SESSION_SECRET` — Random secret key for session management
- `AES_KEY` — 32-character hex key for credential encryption
- `MAIL_EMAIL` / `MAIL_PASS` — Email account for notifications
- `WEATHER_API_KEY` — OpenWeatherMap API key (optional)
- `GOOGLE_ANALYTICS_ID` — Analytics tracking ID (optional)
- `ZIP_LOOKUP_KEY` — Zip code lookup service key (optional)

**⚠️ Never commit `.env` to version control** — it is in `.gitignore` for a reason.

## Security

- Synergy+ encrypts StudentVUE credentials using AES-128-CBC
- Credentials are **not stored permanently** on disk
- Sessions are managed server-side with secure, HttpOnly cookies
- WebAuthn (FIDO2) support for passwordless authentication
- All user data is protected behind authentication checks

See [`SECURITY.md`](SECURITY.md) for detailed security guidelines and pre-deployment checklist.

## Disclaimer

**Synergy+ is not affiliated with Edpoint** and is not endorsed by Edpoint. It is an independent gradebook wrapper that provides a modern interface for StudentVUE. User credentials are not permanently stored and are used only for the current session.

## License

[Your License Here]

## Contributing

Pull requests welcome! Please ensure all tests pass and security guidelines are followed.
