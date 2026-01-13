import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/authService/auth';

export const permissionGuard = (requiredAuthorities: string[]): CanActivateFn => {
  return () => {
    const authService = inject(Auth);
    const router = inject(Router);
    
    const user = authService.getCurrentUser();
    
    if (!user) {
      router.navigate(['/login']);
      return false;
    }
    
    const hasPermission = requiredAuthorities.some(authority => 
      user.authorities?.includes(authority)
    );
    
    if (!hasPermission) {
      router.navigate([authService.getRoleBasedRoute()]);
      return false;
    }
    
    return true;
  };
};