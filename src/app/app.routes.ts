import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { AdminDashboard } from './component/admin/admin-dashboard/admin-dashboard';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'admin_dashboard', component: AdminDashboard, canActivate: [authGuard] },
  { path: 'user_dashboard', component: AdminDashboard, canActivate: [authGuard] },
  { path: 'manager_dashboard', component: AdminDashboard, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];