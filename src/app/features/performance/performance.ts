import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerformanceService, Review } from './performance.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  templateUrl: './performance.html',
  styleUrl: './performance.css',
  imports: [CommonModule, FormsModule]
})
export class Performance {

  search = '';
  selectedPeriod = '';

  showModal = false;
  editMode = false;

  periods = ['زمستان ۱۴۰۳', 'پاییز ۱۴۰۳', 'تابستان ۱۴۰۳', 'بهار ۱۴۰۳'];

  form: Review = {
    id: 0,
    employee: '',
    period: '',
    score: 0,
    desc: ''
  };

  constructor(private service: PerformanceService) {}

  get list() {
    return this.service.getAll();
  }

  filtered() {
    return this.list.filter(r =>
      (r.employee.includes(this.search) || !this.search) &&
      (r.period === this.selectedPeriod || !this.selectedPeriod)
    );
  }

  openAddModal() {
    this.editMode = false;
    this.form = { id: 0, employee: '', period: '', score: 0, desc: '' };
    this.showModal = true;
  }

  edit(id: number) {
    this.editMode = true;
    this.form = { ...this.service.getOne(id) };
    this.showModal = true;
  }

  remove(id: number) {
    if (confirm('حذف شود؟')) {
      this.service.remove(id);
    }
  }

  save() {
    if (!this.form.employee || this.form.score < 0 || this.form.score > 100) return;

    if (this.editMode) this.service.update(this.form);
    else this.service.add(this.form);

    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
  }

  getStatus(score: number) {
    if (score >= 85) return 'عالی';
    if (score >= 70) return 'خوب';
    if (score >= 50) return 'متوسط';
    return 'ضعیف';
  }

}
