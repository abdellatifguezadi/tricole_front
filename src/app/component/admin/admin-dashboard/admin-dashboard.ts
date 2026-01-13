import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { DashboardStats } from '../../../models';
import {AlertCard, ChartCard, StatCard} from '../../dashboard-components';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../error-message/error-message';


@Component({
  selector: 'app-admin-dashboard',
  imports: [
    Sidebar,
    StatCard,
    ChartCard,
    AlertCard,
    ErrorMessage,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats | null = null;
  error = '';
  sidebarOpen = false;

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.error = '';
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.error = 'Erreur lors du chargement des statistiques. Veuillez réessayer.';
        if (error.status === 401) {
          console.log('Utilisateur non authentifié, redirection vers login...');
          this.router.navigate(['/login']);
        }
      }
    });
  }



  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
