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
 private defaults:User[]=[
  {id:1,name:'System Admin',username:'admin',role:'admin',email:'admin@ashkanhr.local',password:'1234',active:true},
  {id:2,name:'HR User',username:'hruser',role:'hr',email:'hr@ashkanhr.local',password:'Hruser123',active:true},
  {id:3,name:'Employee',username:'employee',role:'employee',email:'employee@ashkanhr.local',password:'Employee123',active:true}
 ];
 private get storage(){return isPlatformBrowser(this.platformId)?localStorage:null}
 private normalizeUsername(v:string){return String(v??'').trim().toLowerCase()}
 private sourceRaw(){if(!this.storage)return null;const current=this.storage.getItem(this.key);if(current)return current;for(const k of this.previousKeys){const value=this.storage.getItem(k);if(value)return value}return null}
 private load():User[]{
  try{
   const raw=this.sourceRaw(); const users:User[]=raw?JSON.parse(raw):this.defaults.map(u=>({...u}));
   const admin=users.find(u=>u.id===1&&this.normalizeUsername(u.username)==='admin');
   if(admin){admin.username='admin';admin.password='1234';admin.active=true;admin.lockedUntil=null;admin.failedAttempts=0;}
   this.persist(users); this.syncCredentialsFromUsers(users); return users;
  }catch{const users=this.defaults.map(u=>({...u}));this.persist(users);this.syncCredentialsFromUsers(users);return users}
 }
 private persist(users:User[]){this.storage?.setItem(this.key,JSON.stringify(users))}
 private readCredentials():Credential[]{try{return JSON.parse(this.storage?.getItem(this.credentialKey)||'[]')}catch{return []}}
 private writeCredentials(items:Credential[]){this.storage?.setItem(this.credentialKey,JSON.stringify(items))}
 private syncCredentialsFromUsers(users:User[]){
  if(!this.storage)return; const existing=this.readCredentials(); const byId=new Map(existing.map(x=>[x.userId,x]));
  for(const u of users){const username=this.normalizeUsername(u.username);const old=byId.get(u.id);const password=String(u.password??old?.password??'');if(username&&password)byId.set(u.id,{userId:u.id,username,password});}
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
  const nextPassword=String(user.password??'') || String(old.password??'');users[i]={...old,...user,username:String(user.username??old.username).trim(),password:nextPassword};
  this.persist(users);this.syncCredentialsFromUsers(users);
 }
 delete(id:number){const users=this.load().filter(u=>u.id!==id);this.persist(users);this.syncCredentialsFromUsers(users)}
 validate(username:string,password:string){
  const key=this.normalizeUsername(username);const secret=String(password??'');this.load();
  const credential=this.readCredentials().find(x=>x.username===key&&x.password===secret);if(!credential)return undefined;
  return this.load().find(x=>x.id===credential.userId&&this.normalizeUsername(x.username)===key);
 }
 recordFailed(id:number,max:number,lockMinutes:number){const u=this.getById(id);if(!u)return;const n=(u.failedAttempts||0)+1;this.update({...u,failedAttempts:n,lockedUntil:n>=max?new Date(Date.now()+lockMinutes*60000).toISOString():u.lockedUntil})}
 recordSuccess(id:number){const u=this.getById(id);if(u)this.update({...u,failedAttempts:0,lockedUntil:null,lastLoginAt:new Date().toISOString()})}
 unlock(id:number){const u=this.getById(id);if(u)this.update({...u,failedAttempts:0,lockedUntil:null})}
 resetPassword(id:number,password:string,force=true){const u=this.getById(id);if(u)this.update({...u,password:String(password),forcePasswordChange:force,failedAttempts:0,lockedUntil:null})}
}
