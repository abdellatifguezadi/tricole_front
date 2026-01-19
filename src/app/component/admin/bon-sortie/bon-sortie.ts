import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BonSortieService } from '../../../services/bon-sortie/bon-sortie.service';
import { BonSortie } from '../../../models/bon-sortie';
import { Table, TableColumn, TableAction } from '../../shared/table/table';
import { Sidebar } from '../../sidebar/sidebar';
import { MobileCard } from '../../shared/mobile-card/mobile-card';
import { ErrorMessage } from '../../error-message/error-message';
import { DetailsModal, ProductLines, InfoCard, InfoSection } from '../../shared';
import { BonSortieForm } from './bon-sortie-form/bon-sortie-form';
import { catchError } from 'rxjs/operators';
import { EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-bon-sortie',
  standalone: true,
  imports: [CommonModule, Table, Sidebar, MobileCard, ErrorMessage, DetailsModal, ProductLines, InfoCard, BonSortieForm],
  templateUrl: './bon-sortie.html',
  styleUrl: './bon-sortie.css'
})
export class BonSortieComponent implements OnInit {
  bonSorties: WritableSignal<BonSortie[]> = signal<BonSortie[]>([]);
  loading = signal(false);
  error = signal('');
  sidebarOpen = signal(false);
  showDetails = signal(false);
  showForm = signal(false);
  selectedBonSortieForEdit = signal<BonSortie | null>(null);
  selectedBonSortie = signal<BonSortie | null>(null);

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'numeroBon', label: 'Numéro Bon' },
    { key: 'dateSortie', label: 'Date Sortie', type: 'date' },
    { key: 'statut', label: 'Statut' },
    { key: 'motif', label: 'Motif' },
    { key: 'atelier', label: 'Atelier' },
    { key: 'montantTotal', label: 'Montant Total', type: 'currency' },
    { key: 'dateCreation', label: 'Date Création', type: 'datetime' }
  ];

  actions: TableAction[] = [
    { label: 'Voir détails', action: 'view-details', class: 'text-blue-600 hover:text-blue-900 mr-3' },
    { label: 'Modifier', action: 'edit', class: 'text-gray-600 hover:text-gray-900 mr-3', showIf: (item) => item.statut === 'BROUILLON' },
    { label: 'Supprimer', action: 'delete', class: 'text-red-600 hover:text-red-900', showIf: (item) => item.statut === 'BROUILLON' }
  ];

  cardFields = [
    { key: 'numeroBon', label: 'Numéro Bon' },
    { key: 'dateSortie', label: 'Date Sortie' },
    { key: 'statut', label: 'Statut' },
    { key: 'motif', label: 'Motif' },
    { key: 'atelier', label: 'Atelier' },
    { key: 'montantTotal', label: 'Montant Total' }
  ];

  constructor(private bonSortieService: BonSortieService) {}

  ngOnInit() {
    this.loadBonSorties();
  }

  loadBonSorties() {
    this.loading.set(true);
    this.error.set('');

    this.bonSortieService.getBonSorties().pipe(
      finalize(() => {
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Erreur:', error);
        this.error.set('Erreur lors du chargement des bons de sortie');
        return EMPTY;
      })
    ).subscribe(data => {
      this.bonSorties.set(data);
    });
  }

  onTableAction = (action: string, item: any) => {
    if (action === 'view-details') {
      this.selectedBonSortie.set(item);
      this.showDetails.set(true);
    } else if (action === 'edit') {
      this.selectedBonSortieForEdit.set(item);
      this.showForm.set(true);
    } else if (action === 'delete') {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce bon de sortie ?')) {
        this.deleteBonSortie(item.id);
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  retryLoad() {
    this.loadBonSorties();
  }

  openForm() {
    this.selectedBonSortieForEdit.set(null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.selectedBonSortieForEdit.set(null);
  }

  onBonSortieAdded() {
    this.loadBonSorties();
  }

  deleteBonSortie(id: number) {
    this.loading.set(true);
    this.bonSortieService.deleteBonSortie(id).subscribe({
      next: () => {
        this.loadBonSorties();
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        let message = 'Erreur lors de la suppression du bon de sortie';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            message = err.error;
          } else if (err.error.message) {
            message = err.error.message;
          } else if (err.error.error) {
            message = err.error.error;
          }
        }
        
        this.error.set(message);
        this.loading.set(false);
      }
    });
  }

  closeDetails() {
    this.showDetails.set(false);
    this.selectedBonSortie.set(null);
  }


  getStatutClass(statut: string | undefined): string {
    switch(statut) {
      case 'VALIDE': return 'bg-green-100 text-green-800';
      case 'BROUILLON': return 'bg-yellow-100 text-yellow-800';
      case 'ANNULE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }


  getBonSortieInfoSections(): InfoSection[] {
    return [
      {
        title: '',
        bgClass: 'bg-gray-50',
        columns: 3,
        fields: [
          { key: 'numeroBon', label: 'Numéro Bon' },
          { key: 'dateSortie', label: 'Date de Sortie' },
          {
            key: 'statut',
            label: 'Statut',
            type: 'badge' as const,
            badgeClass: this.getStatutClass(this.selectedBonSortie()?.statut)
          },
          { key: 'motif', label: 'Motif' },
          { key: 'atelier', label: 'Atelier' },
          ...(this.selectedBonSortie()?.montantTotal ? [{ key: 'montantTotal', label: 'Montant Total', type: 'currency' as const }] : [])
        ]
      }
    ];
  }
}


