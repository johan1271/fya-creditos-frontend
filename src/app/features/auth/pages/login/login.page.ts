import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonContent, IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { eyeOffOutline, eyeOutline, logInOutline } from 'ionicons/icons';

import { AuthStore } from '../../services/auth.store';

const EMPTY_CREDENTIALS = { username: '', password: '' };

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [IonContent, IonInput, IonButton, IonIcon, IonSpinner, FormField],
})
export class LoginPage {
  protected readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly logInOutline = logInOutline;
  protected readonly eyeOutline = eyeOutline;
  protected readonly eyeOffOutline = eyeOffOutline;

  protected readonly model = signal({ ...EMPTY_CREDENTIALS });
  protected readonly passwordVisible = signal(false);

  protected readonly loginForm = form(this.model, (schemaPath) => {
    required(schemaPath.username, { message: 'El usuario es obligatorio' });
    required(schemaPath.password, { message: 'La contraseña es obligatoria' });
  });

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected onSubmit(): void {
    submit(this.loginForm, async () => {
      try {
        await firstValueFrom(this.store.login(this.model().username, this.model().password));
        await this.router.navigateByUrl('/tabs/search', { replaceUrl: true });
      } catch {
        // store.error() already reflects the failure; the template renders it.
      }
    });
  }
}
