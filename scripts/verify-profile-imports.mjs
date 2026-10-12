import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const root = process.cwd();
const component = readFileSync(join(root, 'src/app/features/profile/profile.ts'), 'utf8');
const template = readFileSync(join(root, 'src/app/features/profile/profile.html'), 'utf8');
if (component.includes('LocaleDateInput') && !template.includes('app-locale-date-input')) {
  throw new Error('NG8113 regression: LocaleDateInput imported but not used by Profile template');
}
if (!component.includes('LocaleDatePipe') || !template.includes('| localeDate')) {
  throw new Error('Profile localized date display is missing');
}
if (!component.includes('try { return localStorage.getItem')) {
  throw new Error('Profile storage access should tolerate browser storage restrictions');
}
console.log('Profile import and browser storage static checks passed.');
