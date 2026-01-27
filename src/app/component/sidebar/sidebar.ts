import {Component, inject, Input, Output, EventEmitter} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Auth} from '../../services/authService/auth';
import {SidebarItems} from '../sidebar-items/sidebar-items';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  private router = inject(Router);
  private authService = inject(Auth);

  menu = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      link: '/admin_dashboard',
      authorities: ['USER_MANAGE', 'STATISTIQUES_READ']
    },
    {
      label: 'Stock Mouvements',
      icon: 'inventory',
      link: '/magasinier_dashboard',
      authorities: ['STOCK_READ', 'STOCK_HISTORIQUE']
    },
    {
      label: 'Fournisseurs',
      icon: 'business',
      link: '/fournisseurs',
      authorities: ['FOURNISSEUR_READ']
    },
    {
      label: 'Produits',
      icon: 'category',
      link: '/product',
      authorities: ['PRODUIT_READ']
    },
    {
      label: 'Commandes',
      icon: 'shopping_cart',
      link: '/commandes',
      authorities: ['COMMANDE_READ']
    },
    {
      label: 'Bons de Sortie',
      icon: 'receipt',
      link: '/bons-sortie',
      authorities: ['BON_SORTIE_READ']
    },
    {
      label: 'Users',
      icon : 'group',
      link: '/users',
      authorities: ['USER_MANAGE']
    },
    {
      label: 'Profil',
      icon: 'person',
      link: '/profile',
      authorities: []
    }
  ];

  onClose() {
    this.closeSidebar.emit();
  }

  protected user = this.authService.getCurrentUser();

  hasPermission(authorities: string[]): boolean {
    return this.authService.hasAnyPermission(authorities);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
