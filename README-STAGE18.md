# AshkanHR Enterprise — Stage 18

## Compile hotfix
- Fixed incorrect LocaleDatePipe imports introduced in later enterprise modules.
- Canonical pipe path is now `src/app/shared/locale-date.pipe.ts`.
- Updated Shift Planner, Document Vault, Report Builder, Attendance Anomalies and Knowledge Base to import from `../../shared/locale-date.pipe`.
- This resolves the reported TS2307 module-resolution errors and the dependent NG1010 unknown-reference errors.

## Date behavior
- Persian (`fa`): Persian/Jalali calendar through `fa-IR-u-ca-persian`.
- English (`en`): Gregorian calendar through `en-US-u-ca-gregory`.
- The underlying application value remains a standard JavaScript Date for API/database compatibility.

## Note
The baseline-browser-mapping message is a warning and is not the cause of the Angular compilation failure. It can optionally be refreshed with the command suggested by npm.

Local Angular CLI dependencies are not installed in the build workspace, so a full `ng build` could not be executed here.
