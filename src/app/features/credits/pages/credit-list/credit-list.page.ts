import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  calendarOutline,
  cardOutline,
  cashOutline,
  chevronBackOutline,
  chevronForwardOutline,
  gridOutline,
  layersOutline,
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { BrandIconComponent } from '../../../../shared/components/brand-icon/brand-icon.component';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { CopCurrencyPipe } from '../../../../shared/pipes/cop-currency.pipe';
import { CreditsStore } from '../../services/credits.store';

type ViewMode = 'cards' | 'table';

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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
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
  protected readonly viewMode = signal<ViewMode>('cards');

  protected readonly chevronBackOutline = chevronBackOutline;
  protected readonly chevronForwardOutline = chevronForwardOutline;
  protected readonly cashOutline = cashOutline;
  protected readonly cardOutline = cardOutline;
  protected readonly personOutline = personOutline;
  protected readonly calendarOutline = calendarOutline;
  protected readonly layersOutline = layersOutline;
  protected readonly gridOutline = gridOutline;
  protected readonly skeletonRows = Array.from({ length: 4 });

  ngOnInit(): void {
    this.store.search('');
  }

  onSearchChange(event: CustomEvent<{ value?: string | null }>): void {
    this.store.search(event.detail.value ?? '');
  }

  onViewModeChange(event: CustomEvent<{ value?: string | number }>): void {
    const value = event.detail.value;
    if (value === 'cards' || value === 'table') {
      this.viewMode.set(value);
      this.store.search(this.store.searchTerm(), 0);
    }
  }

  async onIonInfinite(event: Event): Promise<void> {
    await firstValueFrom(this.store.loadMore());
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }

  previousPage(): void {
    this.store.search(this.store.searchTerm(), this.store.page() - 1);
  }

  nextPage(): void {
    this.store.search(this.store.searchTerm(), this.store.page() + 1);
  }
}
