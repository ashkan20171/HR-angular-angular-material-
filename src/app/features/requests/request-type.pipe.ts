import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestType',
  standalone: true
})
export class RequestTypePipe implements PipeTransform {

  transform(value: string): string {
    const map: Record<string, string> = {
      'leave': 'مرخصی',
      'overtime': 'اضافه‌کاری',
      'mission': 'ماموریت',
      'loan': 'وام'
    };

    return map[value] || value;
  }

}
