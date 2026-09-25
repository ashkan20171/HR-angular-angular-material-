# AshkanHR Enterprise — Stage 11

Stage 11 extends Stage 10 with:

- Workflow Builder: bilingual workflow names, approval steps, responsible roles, SLA, reordering, enable/disable, local persistence.
- Notification Preferences: per-topic in-app/email/push preferences and digest frequency.
- Saved Views & Filters: reusable filters for employees, attendance, leave, recruitment and reports.
- Dedicated Access Denied page for permission failures instead of silently redirecting to dashboard/login.
- Dedicated 404 page. Invalid authenticated app routes no longer fall through to Login.
- New RBAC permissions: workflows.view, workflows.manage, preferences.manage, saved-views.manage.
- All new pages use the reactive LanguageService and therefore follow FA/RTL and EN/LTR immediately.
- Existing LocaleDate/Jalali adapter behavior from Stage 9/10 is retained: FA uses Jalali display/date-picker behavior; EN uses Gregorian.

Security note: client-side RBAC is UX protection only. The ASP.NET Core API must enforce permissions and data scopes server-side in production.
