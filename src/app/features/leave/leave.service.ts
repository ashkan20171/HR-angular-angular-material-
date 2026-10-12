import { Injectable, inject } from '@angular/core';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
export interface LeaveItem {type:string;start:string;end:string;days:number;desc:string;status:'pending'|'accepted'|'rejected'}
@Injectable({providedIn:'root'})
export class LeaveService {
 private records=inject(PersonalRecordsService);
 getLeaves():LeaveItem[]{return this.records.read<LeaveItem>('leave');}
 getSummary(){const leaves=this.getLeaves();const total=30;const used=leaves.filter(x=>x.status!=='rejected').reduce((s,x)=>s+x.days,0);return {total,used,remaining:total-used,last:leaves[0]??null};}
 calculateDays(start:string,end:string){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end))return 0;
  const s=Date.parse(start+'T00:00:00Z'),e=Date.parse(end+'T00:00:00Z');
  return Number.isFinite(s)&&Number.isFinite(e)&&e>=s?Math.round((e-s)/86400000)+1:0;
 }
 addLeave(item:Omit<LeaveItem,'status'>){this.records.write('leave',[{...item,status:'pending' as const},...this.getLeaves()]);}
}
