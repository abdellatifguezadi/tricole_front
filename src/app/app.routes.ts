import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { AdminDashboard } from './component/admin/admin-dashboard/admin-dashboard';
import { FournisseurComponent } from './component/admin/fournisseur/fournisseur';
import { authGuard, loginGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { MagasinierDashboard } from './component/magasinier/magasinier-dashboard/magasinier-dashboard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  { 
    path: 'admin_dashboard', 
    component: AdminDashboard, 
    canActivate: [authGuard, permissionGuard(['USER_MANAGE', 'STATISTIQUES_READ'])] 
  },
  { path: 'user_dashboard', component: AdminDashboard, canActivate: [authGuard] },
  { path: 'manager_dashboard', component: AdminDashboard, canActivate: [authGuard] },
  { 
    path: 'magasinier_dashboard', 
    component: MagasinierDashboard, 
    canActivate: [authGuard, permissionGuard(['STOCK_READ', 'STOCK_HISTORIQUE'])] 
  },
  { 
    path: 'fournisseurs', 
    component: FournisseurComponent, 
    canActivate: [authGuard, permissionGuard(['FOURNISSEUR_READ'])] 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
