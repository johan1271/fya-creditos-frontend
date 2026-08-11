import { Component, inject } from '@angular/core';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <ion-button fill="clear" (click)="theme.toggle()" aria-label="Toggle dark mode">
      <ion-icon slot="icon-only" [icon]="theme.isDark() ? sunnyOutline : moonOutline"></ion-icon>
    </ion-button>
  `,
  imports: [IonButton, IonIcon],
})
export class ThemeToggleComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly moonOutline = moonOutline;
  protected readonly sunnyOutline = sunnyOutline;
}
