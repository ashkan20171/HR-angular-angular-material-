import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from './attendance.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
  imports: [CommonModule]
})
export class Attendance {

  constructor(public att: AttendanceService) {}

  checkIn() {
    this.att.checkIn();
  }

  checkOut() {
    this.att.checkOut();
  }
}
