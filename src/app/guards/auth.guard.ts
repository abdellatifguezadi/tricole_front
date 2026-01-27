import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Auth } from '../services/authService/auth';

export const authGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return authService.loadCurrentUser().pipe(
    map(user => {
      if (user) {
        return true;
      }
      router.navigate(['/unauthorized']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};

export const loginGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);


  if (authService.isAuthenticated()) {
    const roleRoute = authService.getRoleBasedRoute();
    router.navigate([roleRoute]);
    return false;
  }

  return authService.loadCurrentUser().pipe(
    map(user => {
      if (user) {
        const roleRoute = authService.getRoleBasedRoute();
        router.navigate([roleRoute]);
        return false;
      }
      return true;
    }),
    catchError(() => {
      return of(true);
    })
  );
};
