import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestStatus',
  standalone: true
})
export class RequestStatusPipe implements PipeTransform {

  transform(value: string): string {
    const map: Record<string, string> = {
      'pending': 'در انتظار',
      'manager-approved': 'تایید مدیر',
      'hr-approved': 'تایید منابع انسانی',
      'rejected': 'رد شده'
    };

    return map[value] || value;
  }

}
