import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { AdminDashboard } from './component/admin/admin-dashboard/admin-dashboard';
import { FournisseurComponent } from './component/admin/fournisseur/fournisseur';
import { BonSortieComponent } from './component/admin/bon-sortie/bon-sortie';
import { CommandeComponent } from './component/admin/commande/commande';
import { authGuard, loginGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { MagasinierDashboard } from './component/magasinier/magasinier-dashboard/magasinier-dashboard';
import { ResponsableAchatsDashboard } from './component/responsable-achats/responsable-achats-dashboard/responsable-achats-dashboard';
import { Home } from './component/home/home';
import { Product } from './component/product/product';
import { Profile } from './component/profile/profile';
import { UnauthorizedComponent } from './component/error-pages/unauthorized/unauthorized';
import { ForbiddenComponent } from './component/error-pages/forbidden/forbidden';
import {Users} from './component/admin/users/users';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '401', redirectTo: 'unauthorized' },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '403', redirectTo: 'forbidden' },

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
    canActivate: [authGuard, permissionGuard(['STOCK_HISTORIQUE'])]
  },
  {
    path: 'responsable_achats_dashboard',
    component: ResponsableAchatsDashboard,
    canActivate: [authGuard]
  },
  {
    path: 'fournisseurs',
    component: FournisseurComponent,
    canActivate: [authGuard, permissionGuard(['FOURNISSEUR_READ'])]
  },
  {
    path: 'product',
    component: Product,
    canActivate: [authGuard, permissionGuard(['PRODUIT_READ'])]
  },
  {
    path: 'bons-sortie',
    component: BonSortieComponent,
    canActivate: [authGuard, permissionGuard(['STOCK_READ'])]
  },
  {
    path: 'commandes',
    component: CommandeComponent,
    canActivate: [authGuard, permissionGuard(['COMMANDE_READ'])]
  },
  {
    path: 'users',
    component:Users,
    canActivate: [authGuard, permissionGuard(['USER_MANAGE'])]
  }
];
