import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { calendarOutline, cardOutline, cashOutline, personOutline, repeatOutline } from 'ionicons/icons';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';

import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { Credit } from '../../models/credit.model';

@Component({
  selector: 'app-credit-card',
  templateUrl: 'credit-card.component.html',
  styleUrl: 'credit-card.component.scss',
  imports: [IonCard, IonCardContent, IonIcon, DatePipe, CopCurrencyPipe],
})
export class CreditCardComponent {
  readonly credit = input.required<Credit>();

  protected readonly cashOutline = cashOutline;
  protected readonly cardOutline = cardOutline;
  protected readonly personOutline = personOutline;
  protected readonly calendarOutline = calendarOutline;
  protected readonly repeatOutline = repeatOutline;
}
