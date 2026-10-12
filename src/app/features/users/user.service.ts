import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
export type UserRole = 'admin'|'manager'|'employee'|'hr'|'accounting'|'recruiter';
export interface User { id:number; name:string; username:string; role:UserRole; email:string; password?:string; active?:boolean; failedAttempts?:number; lockedUntil?:string|null; forcePasswordChange?:boolean; accountExpiresAt?:string|null; lastLoginAt?:string|null; }
interface Credential { userId:number; username:string; password:string; }
@Injectable({providedIn:'root'})
export class UserService {
 private platformId=inject(PLATFORM_ID);
 private key='ashkanhr.app-users.v4'; private previousKeys=['ashkanhr.app-users.v3','ashkanhr.app-users.v2','ashkanhr.app-users.v1'];
 private credentialKey='ashkanhr.credentials.v1';
 private cachedRaw: string | null = null;
 private cachedUsers: User[] | null = null;
 private readonly maxUserStorageChars = 2_000_000; // Protect the UI thread from malformed/oversized demo data.

 private defaults:User[]=[
  {id:1,name:'System Admin',username:'admin',role:'admin',email:'admin@ashkanhr.local',password:'1234',active:true},
  {id:2,name:'HR User',username:'hruser',role:'hr',email:'hr@ashkanhr.local',password:'Hruser123',active:true},
  {id:3,name:'Employee',username:'employee',role:'employee',email:'employee@ashkanhr.local',password:'Employee123',active:true}
 ];
 private get storage(){return isPlatformBrowser(this.platformId)?localStorage:null}
 private normalizeUsername(v:string){return String(v??'').trim().toLowerCase()}
 private sourceRaw(){if(!this.storage)return null;const current=this.storage.getItem(this.key);if(current)return current;for(const k of this.previousKeys){const value=this.storage.getItem(k);if(value)return value}return null}
 private load():User[]{
  const raw=this.sourceRaw();
  if(raw && raw.length > this.maxUserStorageChars) throw new Error('USER_STORAGE_TOO_LARGE');
  if(this.cachedUsers && raw===this.cachedRaw)return this.cachedUsers.map(u=>({...u}));
  let users:User[];
  try{
   const parsed=raw?JSON.parse(raw):this.defaults.map(u=>({...u}));
   if(!Array.isArray(parsed) || parsed.length>10000)throw new Error('INVALID_USER_DATA');
   users=parsed.filter((u):u is User=>!!u && typeof u==='object' && typeof u.username==='string');
  }catch(error){
   // Never silently overwrite a user's database after parsing failure.
   if(raw)throw error;
   users=this.defaults.map(u=>({...u}));
  }
  if(!this.storage?.getItem(this.key)){
   this.persist(users);
   this.syncCredentialsFromUsers(users);
  }
  this.cachedRaw=this.sourceRaw();this.cachedUsers=users.map(u=>({...u}));
  return users.map(u=>({...u}));
 }
 private persist(users:User[]){
  const serialized=JSON.stringify(users);
  if(serialized.length>this.maxUserStorageChars)throw new Error('USER_STORAGE_TOO_LARGE');
  this.storage?.setItem(this.key,serialized);
  this.cachedRaw=serialized;this.cachedUsers=users.map(u=>({...u}));
 }
 private readCredentials():Credential[]{
  try{
   const raw=this.storage?.getItem(this.credentialKey)||'[]';
   if(raw.length>this.maxUserStorageChars)throw new Error('CREDENTIAL_STORAGE_TOO_LARGE');
   const items=JSON.parse(raw);
   return Array.isArray(items)?items:[];
  }catch{return []}
 }
 private writeCredentials(items:Credential[]){this.storage?.setItem(this.credentialKey,JSON.stringify(items))}
 private syncCredentialsFromUsers(users:User[]){
  if(!this.storage)return; const existing=this.readCredentials(); const byId=new Map(existing.map(x=>[x.userId,x]));
  for(const u of users){const username=this.normalizeUsername(u.username);const old=byId.get(u.id);const password=String(u.password || old?.password || '');if(username&&password)byId.set(u.id,{userId:u.id,username,password});}
  const validIds=new Set(users.map(u=>u.id));this.writeCredentials([...byId.values()].filter(x=>validIds.has(x.userId)));
 }
 getAll():User[]{return this.load().map(u=>({...u,password:undefined}))}
 getById(id:number){return this.load().find(u=>u.id===id)}
 getByUsername(username:string){const key=this.normalizeUsername(username);return this.load().find(u=>this.normalizeUsername(u.username)===key)}
 create(user:User){
  const users=this.load();const username=String(user.username??'').trim();const password=String(user.password??'');
  if(!username)throw new Error('USERNAME_REQUIRED');if(!password)throw new Error('PASSWORD_REQUIRED');
  if(users.some(x=>this.normalizeUsername(x.username)===this.normalizeUsername(username)))throw new Error('USERNAME_EXISTS');
  const created:User={...user,username,password,id:Date.now(),active:user.active!==false,failedAttempts:0,lockedUntil:null};users.push(created);this.persist(users);this.syncCredentialsFromUsers(users);
 }
 update(user:User){
  const users=this.load();const i=users.findIndex(x=>x.id===user.id);if(i<0)return;const old=users[i];
  const newUsername=this.normalizeUsername(String(user.username??old.username));if(users.some((x,j)=>j!==i&&this.normalizeUsername(x.username)===newUsername))throw new Error('USERNAME_EXISTS');
  const nextPassword=String(user.password??'') || String(old.password??'');users[i]={...old,...user,username:String(user.username??old.username).trim(),password:nextPassword};
  this.persist(users);this.syncCredentialsFromUsers(users);
 }
 delete(id:number){const users=this.load().filter(u=>u.id!==id);this.persist(users);this.syncCredentialsFromUsers(users)}
 validate(username:string,password:string){
  const key=this.normalizeUsername(username);const secret=String(password??'');
  const users=this.load();const credential=this.readCredentials().find(x=>x.username===key&&x.password===secret);
  if(credential)return users.find(x=>x.id===credential.userId&&this.normalizeUsername(x.username)===key);
  // Recover legacy records saved before the credential index existed.
  const legacy=users.find(x=>this.normalizeUsername(x.username)===key&&x.password===secret);
  if(legacy){this.syncCredentialsFromUsers(users);return legacy;}
  return undefined;
 }
 recordFailed(id:number,max:number,lockMinutes:number){const u=this.getById(id);if(!u)return;const n=(u.failedAttempts||0)+1;this.update({...u,failedAttempts:n,lockedUntil:n>=max?new Date(Date.now()+lockMinutes*60000).toISOString():u.lockedUntil})}
 recordSuccess(id:number){const u=this.getById(id);if(u)this.update({...u,failedAttempts:0,lockedUntil:null,lastLoginAt:new Date().toISOString()})}
 unlock(id:number){const u=this.getById(id);if(u)this.update({...u,failedAttempts:0,lockedUntil:null})}
 resetPassword(id:number,password:string,force=true){const u=this.getById(id);if(u)this.update({...u,password:String(password),forcePasswordChange:force,failedAttempts:0,lockedUntil:null})}
}
