# Stage 27 — Authentication persistence fix

- Reworked demo credentials into a dedicated localStorage credential store (`ashkanhr.credentials.v1`).
- User creation/update/reset now synchronizes credentials atomically with the user record.
- Login resolves the credential to a concrete user ID instead of relying on a password field that can be stripped from list DTOs.
- Migrates/synchronizes Stage 26 and older users automatically.
- Admin remains `Admin / 1234` (username is case-insensitive).
- Existing newly-created users with stored passwords are migrated into the credential store on first load.

Production note: this is still front-end demo auth. Passwords must be hashed and verified server-side in ASP.NET Core in production.
