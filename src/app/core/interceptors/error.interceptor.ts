import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`API error on ${req.method} ${req.url}`, error);
      return throwError(() => error);
    }),
  );
}
