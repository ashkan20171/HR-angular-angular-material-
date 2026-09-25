# AshkanHR Enterprise — Stage 24

## Login compatibility fix
- Restored the documented demo administrator login: `Admin` / `1234` (username matching is case-insensitive).
- Added a v3 user-store migration so an older Stage 21/22/23 localStorage record cannot keep the previous `Admin123` credential for the built-in administrator.
- Clears stale failed-attempt/lock state for the built-in demo administrator during migration.
- User-created accounts and their passwords remain unchanged.

## Security note
This is still front-end demo authentication. Production authentication must move password verification, hashing, lockout and sessions to the ASP.NET Core backend.
