# AshkanHR Enterprise — Stage 10

Stage 10 extends Stage 9 with enterprise administration features while preserving FA/EN direction and language-aware dates.

## Added
- Security Center: active sessions, revoke other sessions, security event list.
- Delegation of Authority: temporary approval delegation with enable/disable/delete.
- Report Center: searchable HR report catalog and CSV export.
- RBAC permissions for security, delegation and reports.
- Sidebar/routes wired to permissions.
- Security/delegation displayed dates use `localeDate`: Persian calendar in FA, Gregorian in EN.
- Responsive layouts for the new modules.

## Existing Stage 9 guarantees kept
- FA => `lang=fa`, `dir=rtl`, Persian/Jalali display.
- EN => `lang=en`, `dir=ltr`, Gregorian display.
- Material DateAdapter switches calendar behavior by active language.
- Invalid nested Angular translation interpolation from Stage 8 is removed.

## Verification note
A static scan found no nested Angular interpolation pattern (`{{ ... {{ ...`) in templates. A full Angular build could not be executed in the container because the prior dependency installation is incomplete and does not contain the Angular CLI binary. Run `npm install` then `ng serve` locally.
