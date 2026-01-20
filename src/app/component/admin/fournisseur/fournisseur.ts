import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FournisseurService } from '../../../services/fournisseur/fournisseur-service';
import { Fournisseur } from '../../../models/fournisseur';
import { Table, TableColumn, TableAction } from '../../shared/table/table';
import { Sidebar } from '../../sidebar/sidebar';
import { MobileCard } from '../../shared/mobile-card/mobile-card';
import { ErrorMessage } from '../../error-message/error-message';
import {catchError} from 'rxjs/operators';
import {EMPTY, finalize} from 'rxjs';
import { FournisseurForm } from './fournisseur-form/fournisseur-form';
import { Auth } from '../../../services/authService/auth';


@Component({
  selector: 'app-fournisseur',
  standalone: true,
  imports: [CommonModule, Table, Sidebar, MobileCard, ErrorMessage, FournisseurForm],
  templateUrl: './fournisseur.html',
  styleUrl: './fournisseur.css'
})
export class FournisseurComponent implements OnInit {
  fournisseurs: WritableSignal<Fournisseur[]> = signal<Fournisseur[]>([]);
  loading = signal(false);
  error = signal('');
  sidebarOpen = signal(false);
  showForm = signal(false);
  selectedFournisseur = signal<Fournisseur | null>(null);
  canRead = signal(false);
  canCreate = signal(false);
  canUpdate = signal(false);
  canDelete = signal(false);

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'raisonSociale', label: 'Raison Sociale' },
    { key: 'personneContact', label: 'Contact' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'ville', label: 'Ville' },
    { key: 'ice', label: 'ICE' }
  ];

  get actions(): TableAction[] {
    const actions: TableAction[] = [];

    if (this.canUpdate()) {
      actions.push({
        label: 'Modifier',
        action: 'edit',
        class: 'text-gray-600 hover:text-gray-900 mr-3'
      });
    }

    if (this.canDelete()) {
      actions.push({
        label: 'Supprimer',
        action: 'delete',
        class: 'text-red-600 hover:text-red-900'
      });
    }

    return actions;
  }

  cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'personneContact', label: 'Contact' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'ville', label: 'Ville' },
    { key: 'ice', label: 'ICE' }
  ];

  constructor(private fournisseurService: FournisseurService , public auth: Auth) {}


  ngOnInit() {
    this.canRead.set(this.auth.hasPermission('FOURNISSEUR_READ'));
    this.canCreate.set(this.auth.hasPermission('FOURNISSEUR_CREATE'));
    this.canUpdate.set(this.auth.hasPermission('FOURNISSEUR_UPDATE'));
    this.canDelete.set(this.auth.hasPermission('FOURNISSEUR_DELETE'));

    if (this.canRead()) {
      this.loadFournisseurs();
    }
  }


  loadFournisseurs() {
    this.loading.set(true);
    this.error.set('');

    this.fournisseurService.getFournisseurs().pipe(
      finalize(() => {
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Erreur:', error);
        this.error.set('Erreur lors du chargement des fournisseurs');
        return EMPTY;
      })
    ).subscribe(data => {
      this.fournisseurs.set(data);
    });
  }


  onTableAction = (action: string, item: any) => {
    if (action === 'edit') {
      this.selectedFournisseur.set(item);
      this.showForm.set(true);
    } else if (action === 'delete') {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
        this.deleteFournisseur(item.id);
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  openForm() {
    this.selectedFournisseur.set(null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.selectedFournisseur.set(null);
  }

  onFournisseurAdded() {
    this.loadFournisseurs();
  }

  deleteFournisseur(id: number) {
    this.loading.set(true);
    this.fournisseurService.deleteFournisseur(id).subscribe({
      next: () => {
        this.loadFournisseurs();
      },
      error: (err) => {
        console.error('Erreur complète:', err);

        let message = err.error.error ;

        this.error.set(message);
        this.loading.set(false);
      }
    });
  }


}
