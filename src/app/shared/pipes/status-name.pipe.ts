import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusName',
  standalone: true
})
export class StatusNamePipe implements PipeTransform {

  transform(value: string): string {

    const map: Record<string, string> = {
      pending: 'در انتظار',
      accepted: 'تأیید شده',
      rejected: 'رد شده'
    };

    return map[value] || value;
  }
}
