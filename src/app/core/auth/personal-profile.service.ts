import { Injectable, inject } from '@angular/core';
import { PersonalRecordsService } from './personal-records.service';
export interface PersonalProfileDraft { ownerId:string; phone:string; city:string; emergencyContact:string; emergencyPhone:string; updatedAt:string; }
@Injectable({providedIn:'root'})
export class PersonalProfileService {
 private records=inject(PersonalRecordsService);
 get current():PersonalProfileDraft|null {const id=this.records.ownerId;if(!id)return null;return this.records.read<PersonalProfileDraft>('personal-profile').find(x=>x?.ownerId===id)??null;}
 save(data:{phone:string;city:string;emergencyContact:string;emergencyPhone:string}):boolean {
  const id=this.records.ownerId;if(!id)return false;
  const phone=(data.phone??'').trim(), emergencyPhone=(data.emergencyPhone??'').trim();
  if ((phone && !/^[+0-9 ()-]{7,22}$/.test(phone)) || (emergencyPhone && !/^[+0-9 ()-]{7,22}$/.test(emergencyPhone)))return false;
  return this.records.write('personal-profile',[{ownerId:id,phone,city:(data.city??'').trim().slice(0,100),emergencyContact:(data.emergencyContact??'').trim().slice(0,100),emergencyPhone,updatedAt:new Date().toISOString()}]);
 }
}
