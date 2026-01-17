import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../../services/commande/commande.service';
import { Commande } from '../../../models/commande';
import { Table, TableColumn, TableAction } from '../../shared/table/table';
import { Sidebar } from '../../sidebar/sidebar';
import { MobileCard } from '../../shared/mobile-card/mobile-card';
import { ErrorMessage } from '../../error-message/error-message';
import { DetailsModal, ProductLines, InfoCard, InfoSection } from '../../shared';
import { CommandeForm } from './commande-form/commande-form';
import { catchError } from 'rxjs/operators';
import { EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, Table, Sidebar, MobileCard, ErrorMessage, DetailsModal, ProductLines, InfoCard, CommandeForm],
  templateUrl: './commande.html',
  styleUrl: './commande.css'
})
export class CommandeComponent implements OnInit {
  commandes: WritableSignal<Commande[]> = signal<Commande[]>([]);
  loading = signal(false);
  error = signal('');
  sidebarOpen = signal(false);
  showDetails = signal(false);
  showForm = signal(false);
  selectedCommande = signal<Commande | null>(null);

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'numeroCommande', label: 'Numéro Commande' },
    { key: 'fournisseur.raisonSociale', label: 'Fournisseur' },
    { key: 'dateCommande', label: 'Date Commande', type: 'datetime' },
    { key: 'dateLivraisonPrevue', label: 'Livraison Prévue', type: 'date' },
    { key: 'dateLivraisonEffective', label: 'Livraison Effective', type: 'date' },
    { key: 'statut', label: 'Statut' },
    { key: 'montantTotal', label: 'Montant Total', type: 'currency' }
  ];

  actions: TableAction[] = [
    { label: 'Voir détails', action: 'view-details', class: 'text-blue-600 hover:text-blue-900 mr-3' },
    { label: 'Modifier', action: 'edit', class: 'text-gray-600 hover:text-gray-900 mr-3', showIf: (item) => item.statut === 'EN_ATTENTE' },
    { label: 'Supprimer', action: 'delete', class: 'text-red-600 hover:text-red-900', showIf: (item) => item.statut === 'EN_ATTENTE' }
  ];

  cardFields = [
    { key: 'numeroCommande', label: 'Numéro Commande' },
    { key: 'fournisseur.raisonSociale', label: 'Fournisseur' },
    { key: 'dateCommande', label: 'Date Commande' },
    { key: 'dateLivraisonPrevue', label: 'Livraison Prévue' },
    { key: 'statut', label: 'Statut' },
    { key: 'montantTotal', label: 'Montant Total' }
  ];

  constructor(private commandeService: CommandeService) {}

  ngOnInit() {
    this.loadCommandes();
  }

  loadCommandes() {
    this.loading.set(true);
    this.error.set('');

    this.commandeService.getCommandes().pipe(
      finalize(() => {
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Erreur:', error);
        this.error.set('Erreur lors du chargement des commandes');
        return EMPTY;
      })
    ).subscribe(data => {
      this.commandes.set(data);
    });
  }

  onTableAction = (action: string, item: any) => {
    if (action === 'view-details') {
      this.selectedCommande.set(item);
      this.showDetails.set(true);
    } else if (action === 'edit') {
      console.log('Modifier commande:', item);
    } else if (action === 'delete') {
      console.log('Supprimer commande:', item);
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  retryLoad() {
    this.loadCommandes();
  }

  openForm() {
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onCommandeAdded() {
    this.loadCommandes();
  }

  closeDetails() {
    this.showDetails.set(false);
    this.selectedCommande.set(null);
  }

  getStatutClass(statut: string | undefined): string {
    switch(statut) {
      case 'LIVREE': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }


  getCommandeInfoSections(): InfoSection[] {
    return [
      {
        title: '',
        bgClass: 'bg-gray-50',
        columns: 3,
        fields: [
          { key: 'numeroCommande', label: 'Numéro Commande' },
          { key: 'fournisseur.raisonSociale', label: 'Fournisseur' },
          { key: 'dateCommande', label: 'Date Commande' },
          { key: 'dateLivraisonPrevue', label: 'Livraison Prévue' },
          ...(this.selectedCommande()?.dateLivraisonEffective ? [{ key: 'dateLivraisonEffective', label: 'Livraison Effective' }] : []),
          {
            key: 'statut',
            label: 'Statut',
            type: 'badge' as const,
            badgeClass: this.getStatutClass(this.selectedCommande()?.statut)
          },
          { key: 'montantTotal', label: 'Montant Total', type: 'currency' as const }
        ]
      },
      {
        title: 'Informations Fournisseur',
        bgClass: 'bg-blue-50',
        columns: 2,
        fields: [
          { key: 'fournisseur.personneContact', label: 'Contact' },
          { key: 'fournisseur.email', label: 'Email' },
          { key: 'fournisseur.telephone', label: 'Téléphone' },
          { key: 'fournisseur.ville', label: 'Ville' }
        ]
      }
    ];
  }
}
