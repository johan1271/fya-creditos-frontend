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
    required(schemaPath.customerName, { message: 'Customer name is required' });
    maxLength(schemaPath.customerName, 150, { message: 'Customer name must be at most 150 characters' });

    required(schemaPath.idNumber, { message: 'ID number is required' });
    maxLength(schemaPath.idNumber, 20, { message: 'ID number must be at most 20 characters' });

    validate(schemaPath.creditAmount, ({ value }) =>
      value() > 0 ? undefined : { kind: 'positive', message: 'Credit amount must be greater than 0' },
    );

    validate(schemaPath.interestRate, ({ value }) =>
      value() > 0 ? undefined : { kind: 'positive', message: 'Interest rate must be greater than 0' },
    );
    max(schemaPath.interestRate, 100, { message: 'Interest rate must be at most 100' });

    min(schemaPath.termMonths, 1, { message: 'Term must be at least 1 month' });
    max(schemaPath.termMonths, 360, { message: 'Term must be at most 360 months' });

    required(schemaPath.salesAgent, { message: 'Sales agent is required' });
    maxLength(schemaPath.salesAgent, 150, { message: 'Sales agent must be at most 150 characters' });
  });

  protected onSubmit(): void {
    submit(this.creditForm, async () => {
      try {
        await firstValueFrom(this.store.register(this.model()));
        this.model.set({ ...EMPTY_CREDIT });
        this.creditForm().reset();
        await this.presentToast('Credit registered successfully.', 'success');
      } catch {
        await this.presentToast('Could not register the credit. Please try again.', 'danger');
      }
    });
  }

  private async presentToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({ message, color, duration: 2500, position: 'bottom' });
    await toast.present();
  }
}
