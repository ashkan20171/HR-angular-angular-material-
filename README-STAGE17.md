# AshkanHR Enterprise — Stage 17

Added:
- Dashboard Widget Builder (role-ready personalized widgets)
- Leave & Holiday Policy Engine (allowance, carry-over, approvals)
- Employee Document Vault (confidential documents + expiry dates)
- Payroll Variable Components (earnings/deductions/formulas)
- HR KPI Designer (targets, weights, owners)
- Routes, sidebar entries and granular RBAC permissions for all new modules
- FA/EN labels and RTL/LTR compatibility; date displays use localeDate where applicable

Security note: front-end RBAC is UX enforcement. ASP.NET Core APIs must enforce the same permissions server-side before production use.
