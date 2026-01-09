import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { DashboardStats } from '../../../models';
import {AlertCard, ChartCard, StatCard} from '../../dashboard-components';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  imports: [
    Sidebar,
    StatCard,
    ChartCard,
    AlertCard,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        if (error.status === 401) {
          console.log('Utilisateur non authentifié, redirection vers login...');
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
