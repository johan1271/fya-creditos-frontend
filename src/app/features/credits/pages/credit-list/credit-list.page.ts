import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  calendarOutline,
  cardOutline,
  cashOutline,
  chevronBackOutline,
  chevronForwardOutline,
  personOutline,
} from 'ionicons/icons';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { BrandIconComponent } from '../../../../shared/components/brand-icon/brand-icon.component';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { CreditsStore } from '../../services/credits.store';

@Component({
  selector: 'app-credit-list',
  templateUrl: 'credit-list.page.html',
  styleUrls: ['credit-list.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    IonButton,
    IonIcon,
    DatePipe,
    CopCurrencyPipe,
    ThemeToggleComponent,
    LogoutButtonComponent,
    BrandIconComponent,
  ],
})
export class CreditListPage implements OnInit {
  protected readonly store = inject(CreditsStore);
  protected readonly chevronBackOutline = chevronBackOutline;
  protected readonly chevronForwardOutline = chevronForwardOutline;
  protected readonly cashOutline = cashOutline;
  protected readonly cardOutline = cardOutline;
  protected readonly personOutline = personOutline;
  protected readonly calendarOutline = calendarOutline;
  protected readonly skeletonRows = Array.from({ length: 4 });

  ngOnInit(): void {
    this.store.search('');
  }

  onSearchChange(event: CustomEvent<{ value?: string | null }>): void {
    this.store.search(event.detail.value ?? '');
  }

  previousPage(): void {
    this.store.search(this.store.searchTerm(), this.store.page() - 1);
  }

  nextPage(): void {
    this.store.search(this.store.searchTerm(), this.store.page() + 1);
  }
}
