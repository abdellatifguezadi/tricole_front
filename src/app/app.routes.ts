import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { AdminDashboard } from './component/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'admin_dashboard', component: AdminDashboard },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];