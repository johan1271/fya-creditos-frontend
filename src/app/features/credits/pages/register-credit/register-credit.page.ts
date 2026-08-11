import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, max, maxLength, min, required, submit, validate } from '@angular/forms/signals';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { firstValueFrom } from 'rxjs';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { checkmarkCircleOutline } from 'ionicons/icons';

import { AuthStore } from '../../../auth/services/auth.store';
import { BrandIconComponent } from '../../../../shared/components/brand-icon/brand-icon.component';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { CreditsStore } from '../../services/credits.store';

const EMPTY_CREDIT = {
  customerName: '',
  idNumber: '',
  creditAmount: 0,
  interestRate: 0,
  termMonths: 0,
  salesAgent: '',
};

const SUCCESS_RECAP_DURATION_MS = 6000;

@Component({
  selector: 'app-register-credit',
  templateUrl: 'register-credit.page.html',
  styleUrls: ['register-credit.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonInput,
    IonButton,
    IonFooter,
    IonCard,
    IonCardContent,
    IonIcon,
    FormField,
    CopCurrencyPipe,
    ThemeToggleComponent,
    LogoutButtonComponent,
    BrandIconComponent,
  ],
})
export class RegisterCreditPage {
  protected readonly store = inject(CreditsStore);
  private readonly authStore = inject(AuthStore);
  private readonly toastController = inject(ToastController);

  protected readonly checkmarkCircleOutline = checkmarkCircleOutline;

  protected readonly model = signal(this.restoreDraft());
  protected readonly lastRegistered = signal<{ customerName: string; creditAmount: number } | null>(null);

  private recapTimeoutId?: ReturnType<typeof setTimeout>;

  protected readonly creditForm = form(this.model, (schemaPath) => {
    required(schemaPath.customerName, { message: 'El nombre del cliente es obligatorio' });
    maxLength(schemaPath.customerName, 150, { message: 'El nombre del cliente debe tener máximo 150 caracteres' });

    required(schemaPath.idNumber, { message: 'El número de identificación es obligatorio' });
    maxLength(schemaPath.idNumber, 20, {
      message: 'El número de identificación debe tener máximo 20 caracteres',
    });

    validate(schemaPath.creditAmount, ({ value }) =>
      value() > 0 ? undefined : { kind: 'positive', message: 'El monto del crédito debe ser mayor que 0' },
    );

    validate(schemaPath.interestRate, ({ value }) =>
      value() > 0 ? undefined : { kind: 'positive', message: 'La tasa de interés debe ser mayor que 0' },
    );
    max(schemaPath.interestRate, 100, { message: 'La tasa de interés debe ser máximo 100' });

    min(schemaPath.termMonths, 1, { message: 'El plazo debe ser de al menos 1 mes' });
    max(schemaPath.termMonths, 360, { message: 'El plazo debe ser máximo 360 meses' });

    required(schemaPath.salesAgent, { message: 'El asesor de ventas es obligatorio' });
    maxLength(schemaPath.salesAgent, 150, { message: 'El asesor de ventas debe tener máximo 150 caracteres' });
  });

  constructor() {
    effect(() => {
      localStorage.setItem(this.draftKey(), JSON.stringify(this.model()));
    });
  }

  protected onSubmit(): void {
    submit(this.creditForm, async () => {
      try {
        const registered = await firstValueFrom(this.store.register(this.model()));

        this.lastRegistered.set({ customerName: registered.customerName, creditAmount: registered.creditAmount });
        clearTimeout(this.recapTimeoutId);
        this.recapTimeoutId = setTimeout(() => this.lastRegistered.set(null), SUCCESS_RECAP_DURATION_MS);

        localStorage.removeItem(this.draftKey());
        this.model.set(this.blankCredit());
        this.creditForm().reset();

        await this.presentToast('Crédito registrado exitosamente.', 'success');
        await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
      } catch {
        await this.presentToast('No se pudo registrar el crédito. Intenta de nuevo.', 'danger');
      }
    });
  }

  private async presentToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({ message, color, duration: 2500, position: 'bottom' });
    await toast.present();
  }

  private blankCredit(): typeof EMPTY_CREDIT {
    return { ...EMPTY_CREDIT, salesAgent: this.authStore.user()?.fullName ?? '' };
  }

  private draftKey(): string {
    const username = this.authStore.user()?.username ?? 'anonymous';
    return `fya-register-draft-${username}`;
  }

  private restoreDraft(): typeof EMPTY_CREDIT {
    const raw = localStorage.getItem(this.draftKey());
    if (raw) {
      try {
        return JSON.parse(raw) as typeof EMPTY_CREDIT;
      } catch {
        // fall through to a blank form
      }
    }
    return this.blankCredit();
  }
}
