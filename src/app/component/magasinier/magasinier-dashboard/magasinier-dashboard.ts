import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StockService,  PagedResponse} from '../../../services/stock/stock.service';
import  {MouvementStock} from '../../../models/mouvment/mouvmentStock';
import  {MouvementFilter} from '../../../models/mouvment/mouvmentFilter';
import { StatCard } from '../../dashboard-components';
import { Auth } from '../../../services/authService/auth';
import {Table, TableColumn} from '../../shared/table/table';
import {Sidebar} from '../../sidebar/sidebar';
import { MobileCard } from '../../shared/mobile-card/mobile-card';
import { ErrorMessage } from '../../error-message/error-message';

@Component({
  selector: 'app-magasinier-dashboard',
  imports: [CommonModule, FormsModule, StatCard, Table, Sidebar, MobileCard, ErrorMessage],
  templateUrl: './magasinier-dashboard.html',
  styleUrl: './magasinier-dashboard.css',
})
export class MagasinierDashboard implements OnInit {
  mouvements: MouvementStock[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 5;
  loading = false;
  error = '';
  Math = Math;
  sidebarOpen = false;

  cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'reference', label: 'Reference' },
    { key: 'numeroLot', label: 'Numero De Lot' },
    { key: 'quantite', label: 'Quantite'  },
    { key: 'dateMouvement', label: 'Date' },
    { key: 'typeMouvement', label: 'Type' },
    {key : 'referenceProduit' , label : 'Produit Reference' },
    {key : 'nomProduit' , label : 'Produit Nom'}
  ];

  filter: MouvementFilter = {
    page: 0,
    size: 5
  };

  constructor(
    private stockService: StockService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMouvements();
  }

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'reference', label: 'Reference' },
    { key: 'numeroLot', label: 'Numero De Lot' },
    { key: 'quantite', label: 'Quantite' , type: 'number' },
    { key: 'dateMouvement', label: 'Email', type: 'date' },
    { key: 'typeMouvement', label: 'Type' },
    {key : 'referenceProduit' , label : 'Produit Reference' },
    {key : 'nomProduit' , label : 'Produit Nom'}
  ];


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadMouvements() {
    this.loading = true;
    this.error = '';
    this.filter.page = this.currentPage;
    this.filter.size = this.pageSize;

    this.stockService.getMouvements(this.filter).subscribe({
      next: (response: PagedResponse<MouvementStock>) => {
        this.mouvements = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
        console.log('Mouvements chargés:', response);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des mouvements:', error);
        this.error = 'Erreur lors du chargement des données. Veuillez réessayer.';
        this.mouvements = [];
        this.totalElements = 0;
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.currentPage = 0;
    this.loadMouvements();
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalElements) {
      this.currentPage++;
      this.loadMouvements();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMouvements();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }



}
