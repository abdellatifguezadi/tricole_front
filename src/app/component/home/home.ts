import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/authService/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private router = inject(Router);
  private authService = inject(Auth);

  features = [
    {
      icon: 'inventory_2',
      title: 'Gestion de Stock',
      description: 'Suivez vos produits en temps réel avec des alertes automatiques pour les ruptures de stock.'
    },
    {
      icon: 'local_shipping',
      title: 'Fournisseurs',
      description: 'Gérez vos fournisseurs et leurs commandes de manière centralisée.'
    },
    {
      icon: 'analytics',
      title: 'Statistiques',
      description: 'Visualisez les performances de votre stock avec des tableaux de bord détaillés.'
    },
    {
      icon: 'receipt_long',
      title: 'Bons de Sortie',
      description: 'Créez et suivez les bons de sortie pour chaque atelier.'
    }
  ];

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToDashboard() {
    const user = this.authService.getCurrentUser();
    if (user) {
      if (this.authService.hasAnyPermission(['USER_MANAGE', 'STATISTIQUES_READ'])) {
        this.router.navigate(['/admin_dashboard']);
      } else if (this.authService.hasAnyPermission(['STOCK_READ', 'STOCK_HISTORIQUE'])) {
        this.router.navigate(['/magasinier_dashboard']);
      } else {
        this.router.navigate(['/admin_dashboard']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return !!this.authService.getCurrentUser();
  }
}

