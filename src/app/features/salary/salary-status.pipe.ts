import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'raiseStatus',
  standalone: true
})
export class RaiseStatusPipe implements PipeTransform {

  transform(status: string): string {
    const map: any = {
      pending: 'در انتظار بررسی',
      manager: 'در بررسی مدیر',
      hr: 'در بررسی منابع انسانی',
      accepted: 'تأیید شده',
      rejected: 'رد شده'
    };

    return map[status] || status;
  }

}
