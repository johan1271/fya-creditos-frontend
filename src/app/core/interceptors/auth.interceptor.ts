import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthStore } from '../../features/auth/services/auth.store';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const token = authStore.token();
  const authorizedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authStore.isAuthenticated()) {
        authStore.logout();
        router.navigateByUrl('/login', { replaceUrl: true });
      }
      return throwError(() => error);
    }),
  );
}
