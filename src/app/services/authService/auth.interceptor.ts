import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  
  // Skip interceptor for auth endpoints
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }
  
  const token = authService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('Interceptor - No token found');
  }

  return next(req);
};
