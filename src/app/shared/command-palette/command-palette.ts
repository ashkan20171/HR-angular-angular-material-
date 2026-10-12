import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalSearchService, SearchAction } from '../../core/services/global-search.service';

@Component({
 selector: 'app-command-palette', standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './command-palette.html', styleUrl: './command-palette.css'
})
export class CommandPalette {
 @Input() isFa = true;
 @Output() openChange = new EventEmitter<boolean>();
 @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
 private _open = false;
 @Input() set open(value: boolean) {
  const wasOpen = this._open;
  this._open = value;
  if (value && !wasOpen) {
   this.query = '';
   this.activeIndex = 0;
   queueMicrotask(() => this.searchInput?.nativeElement.focus());
  }
 }
 get open(): boolean { return this._open; }
 query = '';
 activeIndex = 0;
 constructor(public search: GlobalSearchService) {}
 get results(): SearchAction[] { return this.search.search(this.query).slice(0, 8); }
 onQueryChange(): void { this.activeIndex = 0; }
 close(): void { this._open = false; this.openChange.emit(false); this.query = ''; this.activeIndex = 0; }
 choose(action: SearchAction): void { this.search.go(action); this.close(); }
 onKeydown(event: KeyboardEvent): void {
  if (!this.open) return;
  const items = this.results;
  if (event.key === 'ArrowDown' && items.length) {
   event.preventDefault(); this.activeIndex = (this.activeIndex + 1) % items.length;
  } else if (event.key === 'ArrowUp' && items.length) {
   event.preventDefault(); this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
  } else if (event.key === 'Enter' && items.length) {
   event.preventDefault(); this.choose(items[Math.min(this.activeIndex, items.length - 1)]);
  }
 }
 @HostListener('document:keydown.escape') escape(): void { if (this.open) this.close(); }
}
