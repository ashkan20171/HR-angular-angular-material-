import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-self-review',
  standalone: true,
  templateUrl: './self-review.html',
  styleUrl: './self-review.css',
  imports: [CommonModule, FormsModule]
})
export class SelfReview {

  goals = [
    { text: 'افزایش بهره‌وری تیم', progress: 70 },
    { text: 'بهبود مهارت‌های فنی', progress: 50 },
    { text: 'ارتباط موثر با همکاران', progress: 80 }
  ];

  skills = [
    { title: 'Communication', score: 4 },
    { title: 'Teamwork', score: 5 },
    { title: 'Problem Solving', score: 3 },
    { title: 'Leadership', score: 2 },
    { title: 'Technical Expertise', score: 4 }
  ];

  comment = '';
}
