import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, tap } from 'rxjs';

import { toCredit, toCreditList } from '../mappers/credit.mapper';
import { CreditRequestDto } from '../models/credit-dto.model';
import { Credit } from '../models/credit.model';
import { CreditApiService } from './credit-api.service';

const DEFAULT_PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class CreditsStore {
  private readonly api = inject(CreditApiService);

  private readonly _credits = signal<Credit[]>([]);
  private readonly _loading = signal(false);
  private readonly _registering = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _page = signal(0);
  private readonly _totalPages = signal(0);
  private readonly _totalElements = signal(0);
  private readonly _searchTerm = signal('');

  readonly credits = this._credits.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly registering = this._registering.asReadonly();
  readonly error = this._error.asReadonly();
  readonly page = this._page.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly isEmpty = computed(() => !this._loading() && this._credits().length === 0);

  search(term: string, page = 0, size = DEFAULT_PAGE_SIZE): void {
    this._loading.set(true);
    this._error.set(null);
    this._searchTerm.set(term);

    this.api.search(term, page, size).subscribe({
      next: (response) => {
        this._credits.set(toCreditList(response.content));
        this._page.set(response.page);
        this._totalPages.set(response.totalPages);
        this._totalElements.set(response.totalElements);
      },
      error: () => this._error.set('Could not load credits. Please try again.'),
      complete: () => this._loading.set(false),
    });
  }

  register(request: CreditRequestDto): Observable<Credit> {
    this._registering.set(true);
    return this.api.register(request).pipe(
      map(toCredit),
      tap(() => this.search(this._searchTerm(), 0, DEFAULT_PAGE_SIZE)),
      finalize(() => this._registering.set(false)),
    );
  }
}
