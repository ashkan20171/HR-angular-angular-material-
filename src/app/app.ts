import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastHost } from './shared/ui/toast-host';
import { ModalHost } from './shared/ui/modal-host';
import { LoaderBar } from './shared/ui/loader-bar';
import { RouteLoadingService } from './shared/ui/route-loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoaderBar,
    ToastHost,
    ModalHost
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('ashkanhr');
  // ensure router loading listener is active
  private _routeLoading = inject(RouteLoadingService);
}
