import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreditRequestDto, CreditResponseDto, PagedResponseDto } from '../models/credit-dto.model';

@Injectable({ providedIn: 'root' })
export class CreditApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/credits`;

  search(term: string, page: number, size: number, sort: string): Observable<PagedResponseDto<CreditResponseDto>> {
    const params = new HttpParams().set('q', term).set('page', page).set('size', size).set('sort', sort);
    return this.http.get<PagedResponseDto<CreditResponseDto>>(this.baseUrl, { params });
  }

  register(request: CreditRequestDto): Observable<CreditResponseDto> {
    return this.http.post<CreditResponseDto>(this.baseUrl, request);
  }
}
