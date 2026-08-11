import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { Credit } from '../../models/credit.model';

@Component({
  selector: 'app-credits-table',
  templateUrl: 'credits-table.component.html',
  styleUrl: 'credits-table.component.scss',
  imports: [DatePipe, CopCurrencyPipe],
})
export class CreditsTableComponent {
  readonly credits = input.required<Credit[]>();
}
