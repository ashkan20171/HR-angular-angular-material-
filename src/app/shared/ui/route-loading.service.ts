import { Injectable, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable({ providedIn: 'root' })
export class RouteLoadingService {
  private router = inject(Router);
  private loader = inject(LoaderService);

  constructor() {
    this.router.events
      .pipe(filter((e) =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ))
      .subscribe((e) => {
        if (e instanceof NavigationStart) this.loader.start();
        else this.loader.stop();
      });
  }
}
