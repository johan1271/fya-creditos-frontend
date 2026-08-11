import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { logOutOutline } from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

import { AuthStore } from '../../../features/auth/services/auth.store';

@Component({
  selector: 'app-logout-button',
  template: `
    <ion-button fill="clear" (click)="logout()" aria-label="Cerrar sesión">
      <ion-icon slot="icon-only" [icon]="logOutOutline"></ion-icon>
    </ion-button>
  `,
  imports: [IonButton, IonIcon],
})
export class LogoutButtonComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly logOutOutline = logOutOutline;

  logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
