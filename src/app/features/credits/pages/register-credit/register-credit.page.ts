import { Component, inject, signal } from '@angular/core';
import { form, FormField, max, maxLength, min, required, submit, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';

import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
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
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    FormField,
    ThemeToggleComponent,
  ],
})
export class RegisterCreditPage {
  protected readonly store = inject(CreditsStore);
  private readonly toastController = inject(ToastController);

  protected readonly model = signal({ ...EMPTY_CREDIT });

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

  protected onSubmit(): void {
    submit(this.creditForm, async () => {
      try {
        await firstValueFrom(this.store.register(this.model()));
        this.model.set({ ...EMPTY_CREDIT });
        this.creditForm().reset();
        await this.presentToast('Crédito registrado exitosamente.', 'success');
      } catch {
        await this.presentToast('No se pudo registrar el crédito. Intenta de nuevo.', 'danger');
      }
    });
  }

  private async presentToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({ message, color, duration: 2500, position: 'bottom' });
    await toast.present();
  }
}
