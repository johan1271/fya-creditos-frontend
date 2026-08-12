import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, max, maxLength, min, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { firstValueFrom } from 'rxjs';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addCircleOutline } from 'ionicons/icons';

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
    IonIcon,
    IonSpinner,
    FormField,
    ThemeToggleComponent,
    LogoutButtonComponent,
    BrandIconComponent,
  ],
  providers: [CopCurrencyPipe],
})
export class RegisterCreditPage {
  protected readonly store = inject(CreditsStore);
  private readonly authStore = inject(AuthStore);
  private readonly toastController = inject(ToastController);
  private readonly copCurrency = inject(CopCurrencyPipe);

  protected readonly addCircleOutline = addCircleOutline;

  protected readonly model = signal(this.restoreDraft());

  protected readonly creditForm = form(this.model, (schemaPath) => {
    required(schemaPath.customerName, { message: 'El nombre del cliente es obligatorio' });
    minLength(schemaPath.customerName, 2, { message: 'El nombre del cliente debe tener al menos 2 caracteres' });
    maxLength(schemaPath.customerName, 150, { message: 'El nombre del cliente debe tener máximo 150 caracteres' });
    validate(schemaPath.customerName, ({ value }) =>
      value().trim().length > 0 ? undefined : { kind: 'blank', message: 'El nombre del cliente no puede ser solo espacios' },
    );

    required(schemaPath.idNumber, { message: 'El número de identificación es obligatorio' });
    minLength(schemaPath.idNumber, 6, {
      message: 'El número de identificación debe tener al menos 6 caracteres',
    });
    maxLength(schemaPath.idNumber, 20, {
      message: 'El número de identificación debe tener máximo 20 caracteres',
    });
    pattern(schemaPath.idNumber, /^\d+$/, { message: 'El número de identificación debe contener solo números' });

    validate(schemaPath.creditAmount, ({ value }) =>
      value() > 0 ? undefined : { kind: 'positive', message: 'El monto del crédito debe ser mayor que 0' },
    );
    max(schemaPath.creditAmount, 1_000_000_000, {
      message: 'El monto del crédito debe ser como máximo $1.000.000.000',
    });

    validate(schemaPath.interestRate, ({ value }) =>
      value() > 0 ? undefined : { kind: 'positive', message: 'La tasa de interés debe ser mayor que 0' },
    );
    max(schemaPath.interestRate, 100, { message: 'La tasa de interés debe ser máximo 100' });

    min(schemaPath.termMonths, 1, { message: 'El plazo debe ser de al menos 1 mes' });
    max(schemaPath.termMonths, 360, { message: 'El plazo debe ser máximo 360 meses' });
    validate(schemaPath.termMonths, ({ value }) =>
      Number.isInteger(value()) ? undefined : { kind: 'integer', message: 'El plazo debe ser un número entero de meses' },
    );

    required(schemaPath.salesAgent, { message: 'El asesor de ventas es obligatorio' });
    minLength(schemaPath.salesAgent, 2, { message: 'El asesor de ventas debe tener al menos 2 caracteres' });
    maxLength(schemaPath.salesAgent, 150, { message: 'El asesor de ventas debe tener máximo 150 caracteres' });
    validate(schemaPath.salesAgent, ({ value }) =>
      value().trim().length > 0 ? undefined : { kind: 'blank', message: 'El asesor de ventas no puede ser solo espacios' },
    );
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

        localStorage.removeItem(this.draftKey());
        this.model.set(this.blankCredit());
        this.creditForm().reset();

        await Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
        await this.presentToast(
          `Crédito registrado: ${registered.customerName} por ${this.copCurrency.transform(registered.creditAmount)}`,
          'success',
        );
      } catch {
        await this.presentToast('No se pudo registrar el crédito. Intenta de nuevo.', 'danger');
      }
    });
  }

  private async presentToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({ message, color, duration: 3000, position: 'bottom' });
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
