import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-bar" *ngIf="loader.isLoading()">
      <div class="loader-bar__inner"></div>
    </div>
  `,
  styleUrl: './loader-bar.css'
})
export class LoaderBar {
  constructor(public loader: LoaderService) {}
}
