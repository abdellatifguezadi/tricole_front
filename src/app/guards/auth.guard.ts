import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/authService/auth';

export const authGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const loginGuard = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const roleRoute = authService.getRoleBasedRoute();
    router.navigate([roleRoute]);
    return false;
  }

  return true;
};