import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatAiService {

  async answer(msg: string): Promise<string> {

    const q = msg.toLowerCase();
    if (q.includes('مانده مرخصی') || q.includes('leave balance')) return 'مانده مرخصی نمایشی شما ۶.۵ روز است. برای مشاهده جزئیات و ثبت درخواست جدید وارد بخش مرخصی شوید.';
    if (q.includes('مرخصی')) return 'برای ثبت یا پیگیری مرخصی، بخش «مرخصی» و «مرکز تاییدها» در دسترس است. درخواست‌های در انتظار پس از ثبت وارد گردش تایید می‌شوند.';

    if (q.includes('حقوق') || q.includes('فیش'))
      return 'حقوق شما بر اساس پایه حقوق، مزایا و کسورات محاسبه می‌شود.';

    if (q.includes('ارزیابی') || q.includes('عملکرد') || q.includes('okr'))
      return 'آخرین وضعیت ارزیابی عملکرد شما در بخش Performance قابل مشاهده است.';

    if (q.includes('تایید') || q.includes('درخواست')) return 'برای موارد نیازمند اقدام، «مرکز تاییدها» را باز کنید؛ وضعیت هر درخواست به‌صورت pending، approved یا rejected مدیریت می‌شود.';
    if (q.includes('کارمند') || q.includes('همکار')) return 'برای یافتن همکاران می‌توانید از Directory یا جستجوی سراسری Ctrl/Cmd + K استفاده کنید.';
    return 'می‌توانم درباره مرخصی، حقوق و فیش، ارزیابی و OKR، درخواست‌ها، تاییدها و اطلاعات کارکنان راهنمایی کنم.';
  }
}
