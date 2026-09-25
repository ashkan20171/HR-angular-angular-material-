# AshkanHR

Enterprise Human Resources Management System built with Angular and Angular Material.

This project is designed to streamline HR operations through a clean, responsive, and modular web interface for managing employees, attendance, leave requests, and administrative workflows.

## Overview

AshkanHR is a modern HRMS frontend focused on usability, maintainability, and enterprise dashboard design.  
It provides a structured user experience suitable for HR teams, managers, and internal admin users.

## Key Features

- Employee management dashboard
- Attendance and leave workflow views
- Responsive UI built with Angular Material
- Modular component-based architecture
- Clean and scalable frontend structure
- Designed for enterprise-style internal systems

## Tech Stack

- **Framework:** Angular 20
- **UI Library:** Angular Material
- **Language:** TypeScript
- **Styling:** SCSS / Angular Material theming
- **Tooling:** Angular CLI

## Why this project

HR systems require clarity, consistency, and fast access to operational data.  
This project demonstrates how to build an internal business application with:

- structured UI patterns
- reusable components
- maintainable Angular architecture
- responsive design for desktop and tablet use

## Project Structure

The application follows a modular Angular structure to separate concerns and keep the codebase maintainable.

Typical areas include:
- feature modules
- shared components
- services
- models
- layout and navigation components

## Getting Started

### Prerequisites
- Node.js
- Angular CLI
- npm

### Installation
```bash
git clone https://github.com/ashkan20171/HR-angular-angular-material-.git
cd HR-angular-angular-material-
npm install

## Enterprise Stage 3
Stage 3 expands AshkanHR with Shift Management, Company Calendar, Employee 360, Goals/OKRs, Talent & Succession, Engagement/eNPS Surveys, Recognition & Rewards, HR Help Desk, Loans & Advances, multi-role Approval Center, and People Analytics. All new areas are standalone lazy-loaded Angular features and reuse the enterprise UI primitives introduced in Stage 2.

## Enterprise Stage 4
- Global Command Palette with Ctrl/Cmd+K navigation and bilingual search.
- Shared workflow state service and interactive Approval Center (approve/reject/search/reset).
- Context-aware HR Assistant rules for leave, payroll, performance, approvals and employee discovery.
- Additional enterprise UI states and workflow action styling.

> Build note: dependencies are not installed in the packaged source environment, so `ng build` could not be executed here (`ng: not found`). Run `npm ci` then `npm run build` locally/CI.

## Stage 5 — Stability & Data Foundation
- Removed incompatible `ng-recaptcha@13.2.1` (Angular 17 peer dependency) so Angular 20 can resolve dependencies normally.
- Replaced the demo CAPTCHA widget with a dependency-free human-verification placeholder. Production deployments should use a server-verified CAPTCHA/Turnstile integration.
- Fixed Stage 3 KPI/list literals that used JavaScript's comma operator instead of nested arrays (`[(a,b,c)]` -> `[[a,b,c]]`).
- Fixed Messages strict-template typing (`never[]`) and made message storage SSR-safe.
- Updated message signal mutations to immutable signal updates.
- Prepared the codebase for the Stage 5 shared data/repository and CRUD expansion.

### Clean install after upgrading
On Windows CMD:
```text
rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm cache verify
npm install
ng serve
```

## Stage 6 — Enterprise Access & Localization
- Added configurable RBAC policy matrix with action permissions and Own/Team/Department/All data scopes.
- Added Roles & Permissions administration UI and Organization/Security settings.
- Added permission route guard and SSR-safe role guard.
- Added bilingual FA/EN labels to the new administration surfaces and global RTL/LTR direction primitives.
- Security note: front-end permissions improve UX but must also be enforced by the production backend/API.

## Stage 7 — Locale-aware dates & navigation/auth stability
- Persian mode: `fa`, RTL, Persian/Jalali calendar formatting and Saturday-first Material date adapter.
- English mode: `en`, LTR, Gregorian formatting and Sunday-first Material date adapter.
- Added reusable `localeDate` pipe for data-driven dates.
- Fixed Users add/edit navigation (`/users/*` incorrectly hit the wildcard route and redirected to Login). Users now load through nested `/app/users` routes.
- Hardened role/permission guards to return UrlTree and preserve authenticated sessions.
- Corrected 403 dashboard link.

## Stage 8 - Localization & working actions
- LanguageService is now signal-backed so FA/EN changes are reactive without reload.
- `html` and `body` direction/language are synchronized (`fa/rtl`, `en/ltr`).
- Dashboard now has bilingual content and locale-aware Persian/Gregorian date output.
- Enterprise modules use a shared bilingual CRUD surface with working Add/Edit/Delete/Search/CSV actions.
- Replaced placeholder "Add new" buttons in Directory, Organization, Onboarding, Documents, Assets, Learning, Expenses, Audit, Shifts, Calendar, Goals, Employee 360, Talent, Surveys, Recognition, Helpdesk, Loans and Analytics.
- New-item actions open an in-page modal instead of navigating to an undefined route (which previously fell through to the wildcard `/login` redirect).
- Users child routes use `canActivate` consistently with AuthGuard.
