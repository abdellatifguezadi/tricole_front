import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Auth } from '../services/authService/auth';

export const permissionGuard = (requiredAuthorities: string[]): CanActivateFn => {
  return () => {
    const authService = inject(Auth);
    const router = inject(Router);

    const currentUser = authService.getCurrentUser();

    if (currentUser) {
      const hasPermission = requiredAuthorities.some(authority =>
        currentUser.authorities?.includes(authority)
      );

      if (!hasPermission) {
        router.navigate(['/forbidden']);
        return false;
      }

      return true;
    }

    return authService.loadCurrentUser().pipe(
      map(user => {
        if (!user) {
          router.navigate(['/unauthorized'], {
            state: { message: 'Vous devez vous connecter pour accéder à cette page.' }
          });
          return false;
        }

        const hasPermission = requiredAuthorities.some(authority =>
          user.authorities?.includes(authority)
        );

        if (!hasPermission) {
          router.navigate(['/forbidden'], {
            state: { message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.' }
          });
          return false;
        }

        return true;
      })
    );
  };
};
