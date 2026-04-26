import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _count = signal(0);
  isLoading = () => this._count() > 0;

  start() { this._count.update(v => v + 1); }
  stop() { this._count.update(v => Math.max(0, v - 1)); }
  clear() { this._count.set(0); }
}
