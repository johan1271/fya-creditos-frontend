import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';

import { toAuthUser } from '../mappers/auth.mapper';
import { LoginResponseDto } from '../models/auth-dto.model';
import { AuthUser } from '../models/auth.model';
import { AuthApiService } from './auth-api.service';

const TOKEN_STORAGE_KEY = 'fya-auth-token';
const USER_STORAGE_KEY = 'fya-auth-user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(AuthApiService);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  private readonly _user = signal<AuthUser | null>(this.readStoredUser());
  private readonly _error = signal<string | null>(null);
  private readonly _loggingIn = signal(false);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly error = this._error.asReadonly();
  readonly loggingIn = this._loggingIn.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  login(username: string, password: string): Observable<AuthUser> {
    this._loggingIn.set(true);
    this._error.set(null);

    return this.api.login({ username, password }).pipe(
      tap((response) => this.setSession(response)),
      map(toAuthUser),
      catchError((error: HttpErrorResponse) => {
        this._error.set(
          error.status === 401
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo iniciar sesión. Intenta de nuevo.',
        );
        return throwError(() => error);
      }),
      finalize(() => this._loggingIn.set(false)),
    );
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  private setSession(response: LoginResponseDto): void {
    const user = toAuthUser(response);
    this._token.set(response.token);
    this._user.set(user);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
