import { AfterViewChecked, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-host.html',
  styleUrl: './modal-host.css'
})
export class ModalHost implements AfterViewChecked {
  @ViewChild('modalEl') modalEl?: ElementRef<HTMLElement>;
  private _didAutoFocus = false;

  constructor(public modal: ModalService) {}

  onBackdropClick() {
    // close only if it's not a confirm with pending promise; still safe to close
    this.modal._resolve(false);
  }

  act(value: any) {
    this.modal._resolve(value);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.modal.state().open) this.modal._resolve(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent) {
    if (!this.modal.state().open) return;
    if (ev.key !== 'Tab') return;

    const root = this.modalEl?.nativeElement;
    if (!root) return;

    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    if (focusables.length === 0) {
      ev.preventDefault();
      root.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (ev.shiftKey) {
      if (!active || active === first || !root.contains(active)) {
        ev.preventDefault();
        last.focus();
      }
    } else {
      if (!active || active === last || !root.contains(active)) {
        ev.preventDefault();
        first.focus();
      }
    }
  }

  ngAfterViewChecked(): void {
    // Auto-focus the dialog when it opens (accessibility)
    if (!this.modal.state().open) {
      this._didAutoFocus = false;
      return;
    }
    if (this._didAutoFocus) return;
    const root = this.modalEl?.nativeElement;
    if (!root) return;
    this._didAutoFocus = true;

    // Prefer focusing the primary action, otherwise the dialog container.
    const primary = root.querySelector<HTMLElement>('button.primary');
    (primary || root).focus();
  }
}
