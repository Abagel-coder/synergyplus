# Security Guidelines for Synergy+

## Public Release Checklist

Before deploying Synergy+ to production or making the repository public, ensure:

### ✅ Secrets & Credentials
- [ ] **Never commit `.env` files** — use `.env.example` as a template
- [ ] **Never commit `secure/credentials.json`** — it's in `.gitignore` but double-check
- [ ] Remove all hardcoded API keys, tokens, and IDs from source code
- [ ] Use environment variables for all sensitive configuration
- [ ] Rotate all credentials (AES key, session secret, API keys, etc.)

### ✅ Authentication & Authorization
- [ ] **Verify all route handlers check `req.session.auth` before responding with user data**
- [ ] Ensure WebAuthn validation is strict (challenge verification, signature validation)
- [ ] Validate user ownership before accessing personal data (grades, assignments, etc.)
- [ ] Implement CSRF protection for POST/PUT/DELETE endpoints
- [ ] Use `HttpOnly`, `Secure`, and `SameSite` flags on all session cookies

### ✅ Data Handling
- [ ] Ensure StudentVUE credentials are encrypted before storage (use `cryptoHelper`)
- [ ] Verify export functionality does not leave temporary files on disk
- [ ] Implement proper file cleanup for generated exports
- [ ] Never log or expose user credentials in error messages or logs
- [ ] Verify all database queries use parameterized statements (avoid SQL injection)

### ✅ Client-Side Security
- [ ] Remove all analytics IDs from source code (set via server-side headers)
- [ ] Verify no sensitive data is stored in `localStorage` or `sessionStorage`
- [ ] Implement Content Security Policy (CSP) headers
- [ ] Use HTTPS only (enforce in production)
- [ ] Subresource Integrity (SRI) for all external CDN resources

### ✅ Dependencies
- [ ] Run `npm audit` and fix any security vulnerabilities
- [ ] Keep dependencies up to date
- [ ] Review `package-lock.json` for unexpected transitive dependencies

### ✅ Logging & Monitoring
- [ ] Ensure logs do not contain passwords, tokens, or user credentials
- [ ] Implement proper error handling that doesn't expose system details
- [ ] Set up monitoring for suspicious activity (multiple failed logins, etc.)

### ✅ WebAuthn / FIDO2 Security
- [ ] Verify `fido2-library` is correctly configured
- [ ] Ensure challenge generation is cryptographically secure
- [ ] Verify counter validation to prevent cloned authenticators
- [ ] Test WebAuthn flows with real authenticators

## Environment Variables

All sensitive configuration must be stored in `.env` (local development) or as environment variables (production):

```bash
# Generate a secure session key (do NOT use this example)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate a secure AES key (32 hex chars for AES-128)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

See `.env.example` for the complete list of required variables.

## Disclaimer

Synergy+ is **not affiliated with Edpoint** and does **not store user StudentVUE credentials permanently**. Credentials are:
- Encrypted when stored (AES-128-CBC)
- Used only for the current session
- Never shared with third parties
- Deleted when the user signs out

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly to the maintainers instead of publishing it publicly.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [WebAuthn Security Best Practices](https://www.w3.org/TR/webauthn-2/#security-considerations)
