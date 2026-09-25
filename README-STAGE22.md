# AshkanHR Enterprise — Stage 22

Stage 22 focuses on account security and authentication administration.

## Added
- Password policy administration
- Failed-login tracking and automatic account lockout
- Manual account unlock / enable / disable
- Temporary password reset with forced-password-change flag
- Account expiration checks during login
- Login history/security events
- Active session inventory and session revocation
- Sign out all other sessions
- User creation now validates passwords against the configured policy
- New RBAC permission: security.accounts.manage
- New Account Security route and sidebar entry

## Demo security note
Authentication remains front-end/localStorage based for portfolio/demo use. Production ASP.NET Core must store password hashes server-side and enforce all lockout/session/permission rules at the API layer.
