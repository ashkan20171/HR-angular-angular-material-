import { Injectable, inject, signal } from '@angular/core';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';

export interface NotificationItem {
 id:number; title:string; message:string; date:string; important:boolean; read:boolean; ownerId?:string;
}
@Injectable({providedIn:'root'})
export class NotificationService {
 private records=inject(PersonalRecordsService);
 notifications=signal<NotificationItem[]>([]);
 private loadedOwner:string|null=null;
 constructor(){this.refresh()}
 refresh(){
  const owner=this.records.ownerId;
  if(this.loadedOwner===owner)return;
  this.loadedOwner=owner;
  this.notifications.set(owner?this.records.read<NotificationItem>('personal-notifications').filter(n=>n?.ownerId===owner).slice(0,100):[]);
 }
 private persist(items:NotificationItem[]):boolean {
  if(!this.records.ownerId)return false;
  if(!this.records.write('personal-notifications',items))return false;
  this.notifications.set(items);return true;
 }
 add(title:string,message:string):boolean {
  this.refresh();
  const owner=this.records.ownerId;
  if(!owner||!title.trim()||title.length>120||message.length>500||this.notifications().length>=100)return false;
  const item:NotificationItem={id:Date.now()+Math.floor(Math.random()*1000),title:title.trim(),message:message.trim(),date:new Date().toISOString(),important:false,read:false,ownerId:owner};
  return this.persist([item,...this.notifications()]);
 }
 markAsRead(id:number){this.refresh();this.persist(this.notifications().map(n=>n.id===id?{...n,read:true}:n))}
 toggleImportant(id:number){this.refresh();this.persist(this.notifications().map(n=>n.id===id?{...n,important:!n.important}:n))}
 markAllRead(){this.refresh();this.persist(this.notifications().map(n=>({...n,read:true})))}
 remove(id:number){this.refresh();this.persist(this.notifications().filter(n=>n.id!==id))}
 unreadCount(){this.refresh();return this.notifications().filter(n=>!n.read).length}
}
