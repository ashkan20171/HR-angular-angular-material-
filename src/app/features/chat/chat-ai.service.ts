import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatAiService {

  async answer(question: string): Promise<string> {

    if (question.includes('مرخصی')) {
      return 'برای ثبت مرخصی به بخش "درخواست‌ها" بروید یا از منوی سریع استفاده کنید.';
    }

    if (question.includes('حقوق')) {
      return 'حقوق شما بر اساس پایه حقوق، مزایا و کسورات محاسبه شده است.';
    }

    if (question.includes('ارزیابی')) {
      return 'ارزیابی عملکرد ماه جاری در حال پردازش است.';
    }

    return 'متوجه شدم — لطفاً کمی دقیق‌تر توضیح دهید.';
  }
}
