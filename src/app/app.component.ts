import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { filter, take } from 'rxjs';

import { ThemeService } from './core/theme/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  // Covers the gap between Angular replacing the static index.html boot
  // splash and the initial route's lazy-loaded component actually mounting
  // (auth guard + chunk load), which otherwise showed as a blank themed
  // screen with no logo between the boot splash and real content.
  protected readonly showBootSplash = signal(true);

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError,
        ),
        take(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.showBootSplash.set(false));
  }
}
