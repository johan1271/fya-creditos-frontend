import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
  IonItem,
  IonList,
  IonPopover,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { checkmarkOutline, swapVerticalOutline } from 'ionicons/icons';

import { BrandIconComponent } from '../../../../shared/components/brand-icon/brand-icon.component';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { CreditCardComponent } from '../../components/credit-card/credit-card.component';
import { CreditsTableComponent } from '../../components/credits-table/credits-table.component';
import { PaginationControlsComponent } from '../../components/pagination-controls/pagination-controls.component';
import { CreditsViewMode, ViewModeSwitchComponent } from '../../components/view-mode-switch/view-mode-switch.component';
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
    IonButton,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonIcon,
    IonPopover,
    IonList,
    IonItem,
    ThemeToggleComponent,
    LogoutButtonComponent,
    BrandIconComponent,
    CreditCardComponent,
    CreditsTableComponent,
    ViewModeSwitchComponent,
    PaginationControlsComponent,
  ],
})
export class CreditListPage implements OnInit {
  protected readonly store = inject(CreditsStore);
  protected readonly viewMode = signal<CreditsViewMode>('cards');
  protected readonly skeletonRows = Array.from({ length: 4 });

  protected readonly checkmarkOutline = checkmarkOutline;
  protected readonly swapVerticalOutline = swapVerticalOutline;

  protected readonly sortOptions: ReadonlyArray<{ value: string; label: string }> = [
    { value: 'registeredAt,desc', label: 'Fecha: más reciente primero' },
    { value: 'registeredAt,asc', label: 'Fecha: más antigua primero' },
    { value: 'creditAmount,desc', label: 'Monto: mayor a menor' },
    { value: 'creditAmount,asc', label: 'Monto: menor a mayor' },
  ];

  ngOnInit(): void {
    this.store.search('');
  }

  onSearchChange(event: CustomEvent<{ value?: string | null }>): void {
    this.store.search(event.detail.value ?? '');
  }

  onSortChange(sort: string, popover: IonPopover): void {
    this.store.setSort(sort);
    void popover.dismiss();
  }

  onViewModeChange(mode: CreditsViewMode): void {
    this.viewMode.set(mode);

    // Cards accumulate pages via infinite scroll while the table shows one
    // page at a time, so switching views resets to page 0 for a consistent
    // starting point. Skip the request when we're already there — it would
    // just re-fetch data we already have in `store.credits()`.
    if (this.store.page() !== 0) {
      this.store.search(this.store.searchTerm(), 0);
    }
  }

  async onIonInfinite(event: Event): Promise<void> {
    await firstValueFrom(this.store.loadMore());
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }

  async retryLoadMore(): Promise<void> {
    await firstValueFrom(this.store.loadMore());
  }

  previousPage(): void {
    this.store.search(this.store.searchTerm(), this.store.page() - 1);
  }

  nextPage(): void {
    this.store.search(this.store.searchTerm(), this.store.page() + 1);
  }
}
