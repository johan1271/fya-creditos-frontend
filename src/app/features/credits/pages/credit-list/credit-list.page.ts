import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
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

import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
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
    CurrencyPipe,
    DatePipe,
    ThemeToggleComponent,
  ],
})
export class CreditListPage implements OnInit {
  protected readonly store = inject(CreditsStore);
  protected readonly chevronBackOutline = chevronBackOutline;
  protected readonly chevronForwardOutline = chevronForwardOutline;
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
