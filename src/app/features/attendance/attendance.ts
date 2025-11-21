import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DailyRecord {
  date: string;
  enter: string;
  exit: string;
  late: number;
  overtime: number;
  status: 'on-time' | 'late' | 'absent' | 'remote';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {

  today = {
    date: '۱۴۰۳/۱۱/۲۳',
    enter: '08:59',
    exit: '16:35',
    status: 'on-time'
  };

  weekly: DailyRecord[] = [
    { date: 'شنبه',    enter: '08:58', exit: '16:30', late: 0, overtime: 15, status: 'on-time' },
    { date: 'یکشنبه',  enter: '09:12', exit: '16:30', late: 12, overtime: 0,  status: 'late' },
    { date: 'دوشنبه',  enter: '—',    exit: '—',    late: 0, overtime: 0,  status: 'absent' },
    { date: 'سه‌شنبه', enter: '08:45', exit: '17:10', late: 0, overtime: 40, status: 'on-time' },
    { date: 'چهارشنبه',enter: '09:05', exit: '16:40', late: 5, overtime: 10, status: 'remote' },
  ];

  constructor() {}

  ngOnInit(): void {}

  getStatusClass(s: string) {
    return {
      'on-time': 'status-on',
      'late': 'status-late',
      'absent': 'status-absent',
      'remote': 'status-remote'
    }[s] || '';
  }
}
