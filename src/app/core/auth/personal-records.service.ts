import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
/** Frontend-only per-account demo storage. Never a security boundary. */
@Injectable({providedIn:'root'})
export class PersonalRecordsService {
 private platformId=inject(PLATFORM_ID);
 get ownerId():string|null {
  if(!isPlatformBrowser(this.platformId)) return null;
  if(!localStorage.getItem('authToken')) return null;
  const id=localStorage.getItem('userId');
  return id && /^[\w-]{1,80}$/.test(id) ? id : null;
 }
 private key(kind:string):string|null { const id=this.ownerId; return id ? `ashkanhr.personal.v1.${kind}.${id}` : null; }
 read<T>(kind:string):T[]{ const key=this.key(kind);if(!key)return [];
  try { const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]; }catch{return [];} }
 write<T>(kind:string,items:T[]):boolean {const key=this.key(kind);if(!key)return false;
  try{localStorage.setItem(key,JSON.stringify(items));return true;}catch{return false;}}
}
