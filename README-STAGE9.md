# AshkanHR Enterprise Stage 9
- Fixed invalid nested Angular interpolation in Dashboard.
- Completed Dashboard bilingual labels touched by the error.
- Language-aware date layer: Persian => Jalali, RTL, Saturday-first; English => Gregorian, LTR, Sunday-first.
- Material DateAdapter now exposes Jalali year/month/day and Persian month/day labels in FA mode while preserving native Date values for APIs.
- localeDate remains available for display-only dates.
