import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentService, Applicant } from '../recruitment.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applicant-profile',
  standalone: true,
  templateUrl: './applicant-profile.html',
  styleUrl: './applicant-profile.css',
  imports: [CommonModule, FormsModule]
})
export class ApplicantProfile {

  applicant!: Applicant;
  noteText = '';
  notes: { text: string, date: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: RecruitmentService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.applicant = this.service.getApplicant(id)!;

    this.notes = this.loadNotes();
  }

  // ذخیره یادداشت‌ها
  saveNotes() {
    localStorage.setItem(`notes_${this.applicant.id}`, JSON.stringify(this.notes));
  }

  // بارگذاری
  loadNotes() {
    const saved = localStorage.getItem(`notes_${this.applicant.id}`);
    return saved ? JSON.parse(saved) : [];
  }

  addNote() {
    if (!this.noteText.trim()) return;

    this.notes.unshift({
      text: this.noteText,
      date: new Date().toLocaleString('fa-IR')
    });

    this.noteText = '';
    this.saveNotes();
  }

  deleteNote(i: number) {
    this.notes.splice(i, 1);
    this.saveNotes();
  }
}
