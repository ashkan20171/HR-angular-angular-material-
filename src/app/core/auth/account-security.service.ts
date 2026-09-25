import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface PasswordPolicy { minLength:number; requireUpper:boolean; requireLower:boolean; requireNumber:boolean; requireSpecial:boolean; maxFailedAttempts:number; lockMinutes:number; forceChangeOnTemporary:boolean; }
export interface LoginEvent { id:number; username:string; at:string; success:boolean; reason:string; }
export interface SessionInfo { id:string; username:string; startedAt:string; lastSeenAt:string; current:boolean; }
@Injectable({providedIn:'root'})
export class AccountSecurityService {
 private platformId=inject(PLATFORM_ID); private policyKey='ashkanhr.password-policy.v1'; private eventsKey='ashkanhr.login-events.v1'; private sessionsKey='ashkanhr.sessions.v1';
 private get storage(){return isPlatformBrowser(this.platformId)?localStorage:null}
 defaultPolicy:PasswordPolicy={minLength:6,requireUpper:false,requireLower:false,requireNumber:false,requireSpecial:false,maxFailedAttempts:5,lockMinutes:15,forceChangeOnTemporary:true};
 policy():PasswordPolicy{
  try{
   const raw={...this.defaultPolicy,...JSON.parse(this.storage?.getItem(this.policyKey)||'{}')} as PasswordPolicy;
   // Defensive normalization: old/localStorage policies must never make user creation impossible.
   raw.minLength=Math.min(64,Math.max(4,Number(raw.minLength)||this.defaultPolicy.minLength));
   raw.maxFailedAttempts=Math.min(20,Math.max(1,Number(raw.maxFailedAttempts)||5));
   raw.lockMinutes=Math.min(1440,Math.max(1,Number(raw.lockMinutes)||15));
   return raw;
  }catch{return {...this.defaultPolicy}}
 }
 resetPolicy(){this.savePolicy({...this.defaultPolicy})}
 savePolicy(p:PasswordPolicy){this.storage?.setItem(this.policyKey,JSON.stringify(p))}
 validatePassword(value:string):string[]{const p=this.policy();const e:string[]=[];if(value.length<p.minLength)e.push('MIN_LENGTH');if(p.requireUpper&&!/[A-Z]/.test(value))e.push('UPPER');if(p.requireLower&&!/[a-z]/.test(value))e.push('LOWER');if(p.requireNumber&&!/\d/.test(value))e.push('NUMBER');if(p.requireSpecial&&!/[^A-Za-z0-9]/.test(value))e.push('SPECIAL');return e}
 addEvent(username:string,success:boolean,reason=''){const items=this.events();items.unshift({id:Date.now(),username,at:new Date().toISOString(),success,reason});this.storage?.setItem(this.eventsKey,JSON.stringify(items.slice(0,200)))}
 events():LoginEvent[]{try{return JSON.parse(this.storage?.getItem(this.eventsKey)||'[]')}catch{return []}}
 startSession(username:string){if(!this.storage)return;const id=crypto.randomUUID?.()||String(Date.now());const items=this.sessions().map(x=>({...x,current:false}));items.unshift({id,username,startedAt:new Date().toISOString(),lastSeenAt:new Date().toISOString(),current:true});this.storage.setItem(this.sessionsKey,JSON.stringify(items.slice(0,30)));this.storage.setItem('sessionId',id)}
 sessions():SessionInfo[]{try{return JSON.parse(this.storage?.getItem(this.sessionsKey)||'[]')}catch{return []}}
 endCurrent(){const id=this.storage?.getItem('sessionId');if(id)this.storage?.setItem(this.sessionsKey,JSON.stringify(this.sessions().filter(x=>x.id!==id)));this.storage?.removeItem('sessionId')}
 revoke(id:string){this.storage?.setItem(this.sessionsKey,JSON.stringify(this.sessions().filter(x=>x.id!==id)))}
 revokeOthers(){const id=this.storage?.getItem('sessionId');this.storage?.setItem(this.sessionsKey,JSON.stringify(this.sessions().filter(x=>x.id===id)))}
}
