import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatAiService {

  async answer(msg: string): Promise<string> {

    if (msg.includes('مرخصی'))
      return 'برای ثبت مرخصی از منوی درخواست‌ها استفاده کنید.';

    if (msg.includes('حقوق'))
      return 'حقوق شما بر اساس پایه حقوق، مزایا و کسورات محاسبه می‌شود.';

    if (msg.includes('ارزیابی'))
      return 'آخرین وضعیت ارزیابی عملکرد شما در بخش Performance قابل مشاهده است.';

    return 'متوجه شدم. لطفاً بیشتر توضیح بدهید.';
  }
}
