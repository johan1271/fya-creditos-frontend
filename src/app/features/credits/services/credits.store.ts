import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';

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
  private readonly _loadingMore = signal(false);
  private readonly _registering = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _page = signal(0);
  private readonly _totalPages = signal(0);
  private readonly _totalElements = signal(0);
  private readonly _searchTerm = signal('');
  private readonly _hasMore = signal(false);

  readonly credits = this._credits.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loadingMore = this._loadingMore.asReadonly();
  readonly registering = this._registering.asReadonly();
  readonly error = this._error.asReadonly();
  readonly page = this._page.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly isEmpty = computed(() => !this._loading() && this._credits().length === 0);

  search(term: string, page = 0, size = DEFAULT_PAGE_SIZE): void {
    this._loading.set(true);
    this._error.set(null);
    this._searchTerm.set(term);

    this.api
      .search(term, page, size)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (response) => {
          this._credits.set(toCreditList(response.content));
          this._page.set(response.page);
          this._totalPages.set(response.totalPages);
          this._totalElements.set(response.totalElements);
          this._hasMore.set(!response.last);
        },
        error: () => this._error.set('No se pudieron cargar los créditos. Intenta de nuevo.'),
      });
  }

  loadMore(): Observable<void> {
    if (this._loadingMore() || !this._hasMore()) {
      return of(undefined);
    }

    this._loadingMore.set(true);
    const nextPage = this._page() + 1;

    return this.api.search(this._searchTerm(), nextPage, DEFAULT_PAGE_SIZE).pipe(
      tap((response) => {
        this._credits.update((current) => [...current, ...toCreditList(response.content)]);
        this._page.set(response.page);
        this._totalPages.set(response.totalPages);
        this._totalElements.set(response.totalElements);
        this._hasMore.set(!response.last);
      }),
      map(() => undefined),
      catchError(() => {
        this._error.set('No se pudieron cargar más créditos. Intenta de nuevo.');
        return of(undefined);
      }),
      finalize(() => this._loadingMore.set(false)),
    );
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
