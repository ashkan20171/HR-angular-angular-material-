# AshkanHR Enterprise — Stage 26

## Credential persistence/login fix
- New users now persist username/password explicitly in the canonical user store.
- Usernames are normalized with trim + case-insensitive matching at create and login.
- Passwords are preserved exactly as entered (case-sensitive) and normalized to string consistently.
- Login and UserService now use the same credential normalization path.
- Login error message follows FA/EN language.
- Existing RBAC, account lockout, password policy and Admin/1234 migration are preserved.

## Important
This is still front-end demo authentication using localStorage. Production authentication must be implemented server-side with ASP.NET Core password hashing, secure tokens/cookies, authorization and audit enforcement.
