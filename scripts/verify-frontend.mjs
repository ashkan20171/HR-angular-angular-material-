import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = process.cwd();
const routes = readFileSync(join(root,'src/app/app.routes.ts'),'utf8');
const imports = [...routes.matchAll(/import\(['"]([^'"]+)['"]\)/g)];
let errors = [];
for (const [,path] of imports) {
 const candidate = join(root,'src/app',path.replace(/^\.\//,''));
 if (!existsSync(candidate+'.ts') && !existsSync(join(candidate,'index.ts')))
   errors.push('Missing route module: '+path);
}
const vault=readFileSync(join(root,'src/app/features/document-vault/document-vault.ts'),'utf8');
for (const fragment of ['ownerId===owner','ownerId===this.records.ownerId','validDate','LocaleDateInput']) {
 if (!vault.includes(fragment)) errors.push('Document vault missing: '+fragment);
}
const dateInput=readFileSync(join(root,'src/app/shared/locale-date-input/locale-date-input.ts'),'utf8');
if (!dateInput.includes('ControlValueAccessor')) errors.push('Localized date input not a CVA');
const search = readFileSync(join(root,'src/app/core/services/global-search.service.ts'),'utf8');
const declaredRoutes = new Set([...routes.matchAll(/path:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));
for (const [,route] of search.matchAll(/route:\s*['"]\/app\/([^'"]+)['"]/g)) {
 if (!declaredRoutes.has(route)) errors.push('Global search links to missing route: '+route);
}
// Detect drift between quick-search actions and Angular route guard metadata.
const routeLines = routes.split('\n');
for (const line of search.split('\n').filter(line=>line.includes("route:'/app/"))) {
 const name = line.match(/route:'\/app\/([^']+)'/)?.[1];
 if (!name) continue;
 const routeLine = routeLines.find(row => row.includes("path: '"+name+"'"));
 if (!routeLine) continue;
 const guardPermission = routeLine.match(/permission:\s*'([^']+)'/)?.[1];
 const actionPermission = line.match(/permission:\s*'([^']+)'/)?.[1];
 if (guardPermission !== actionPermission) errors.push('Search permission differs from route: '+name);
 const guardRoles = routeLine.match(/roles:\s*\[([^\]]+)\]/)?.[1];
 if (guardRoles && !line.replace(/\s+/g,'').includes(('roles:['+guardRoles+']').replace(/\s+/g,''))) errors.push('Search roles differ from route: '+name);
}
const layout = readFileSync(join(root,'src/app/layout/dashboard-layout.ts'),'utf8');
if (!layout.includes('nonEmptyGroups')) errors.push('Navigation duplicate favorites regression');
if (!layout.includes('safeSessionValue')) errors.push('Header storage access is not guarded');
if (!search.includes("route:'/app/users',keywords:['people','staff'],permission:'employees.view'")) errors.push('Employee search permission mismatch');
console.log('Checked '+imports.length+' lazy route imports and personal vault invariants.');
if(errors.length){ console.error(errors.join('\n')); process.exitCode=1; }
else console.log('Static smoke checks passed (not a TypeScript build).');
