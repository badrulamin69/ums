import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      let message = 'An unexpected error occurred';

      if (error.error?.message) {
        message = error.error.message;
      } else if (error.error?.data && typeof error.error.data === 'object') {
        const fieldErrors = error.error.data;
        message = Object.entries(fieldErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
      } else if (error.status === 0) {
        message = 'Unable to connect to server';
      } else if (error.status === 403) {
        message = 'Access denied';
      } else if (error.status === 404) {
        message = 'Resource not found';
      } else if (error.status === 500) {
        message = 'Internal server error';
      }

      if (error.status >= 400 && error.status < 500) {
        toast.warning(message);
      } else {
        toast.error(message);
      }

      return throwError(() => error);
    }),
  );
};
