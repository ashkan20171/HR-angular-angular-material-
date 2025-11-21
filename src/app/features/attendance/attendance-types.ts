export interface AttendanceRecord {
  id: number;
  date: string;        // 1403/10/25
  checkIn: string;     // 09:03
  checkOut: string;    // 17:12
  workHours: number;   // 8.1
  status: 'present' | 'late' | 'absent' | 'vacation';
}
