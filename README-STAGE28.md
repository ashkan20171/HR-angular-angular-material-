# Stage 28 — Multi-user / Multi-browser foundation

## Shared authentication server
Stage 28 adds a small Express shared-auth API so users created in one browser can authenticate from another browser/device while the same API host is running.

Run:

```bash
npm install
npm run dev:multiuser
```

Angular: http://localhost:4200
Shared API: http://localhost:4300

Default admin: Admin / 1234

Important: this is a development/demo shared persistence layer. Passwords are intentionally not production-grade. Production must use ASP.NET Core + database + password hashing + JWT/refresh tokens and server-side authorization.
