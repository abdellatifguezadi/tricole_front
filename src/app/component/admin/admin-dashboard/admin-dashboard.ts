import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { DashboardStats } from '../../../models';
import {AlertCard, ChartCard, StatCard} from '../../dashboard-components';
import { ErrorMessage } from '../../error-message/error-message';
import {EMPTY, finalize, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';


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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
  }

  /**
  loadStats() {
    this.error = '';
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        if (error.status !== 401 && error.status !== 403) {
          this.error = 'Erreur lors du chargement des statistiques. Veuillez réessayer.';
        }

      }
    });
  }
   **/

  loadStats(){
    this.error = '';

    this.dashboardService.getDashboardStats().pipe(
    tap((data) => {
        this.stats = data;
    }),
    catchError(error => {
        if (error.status !== 401 && error.status !== 403) {
          this.error = 'Erreur lors du chargement des statistiques. Veuillez réessayer.';
        }
      return EMPTY;
    })
    ).subscribe();
  }



  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
