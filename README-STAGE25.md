# AshkanHR Enterprise – Stage 25

## Password creation fix
- User creation now shows the active password policy before submit.
- Validation errors are specific instead of the generic security-policy message.
- Default demo policy is intentionally usable: minimum 6 characters, with complexity flags off unless an administrator enables them.
- Existing saved policy values are defensively normalized.
- Added resetPolicy() for administration flows.
- Password validation updates live while typing.

Security note: this remains a front-end demo store. Production passwords must be hashed and validated server-side in ASP.NET Core.
