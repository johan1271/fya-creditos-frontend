import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

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
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
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

  ngOnInit(): void {
    this.store.search('');
  }

  onSearchChange(event: CustomEvent<{ value?: string | null }>): void {
    this.store.search(event.detail.value ?? '');
  }

  onViewModeChange(mode: CreditsViewMode): void {
    this.viewMode.set(mode);
    this.store.search(this.store.searchTerm(), 0);
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
