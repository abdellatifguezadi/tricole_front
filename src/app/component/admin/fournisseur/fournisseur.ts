import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FournisseurService } from '../../../services/fournisseur/fournisseur-service';
import { Fournisseur } from '../../../models/fournisseur';
import { Table, TableColumn, TableAction } from '../../table/table';
import { Sidebar } from '../../sidebar/sidebar';
import { MobileCard } from '../../mobile-card/mobile-card';
import { ErrorMessage } from '../../error-message/error-message';
import {catchError} from 'rxjs/operators';
import {EMPTY, finalize} from 'rxjs';
import { FournisseurForm } from './fournisseur-form/fournisseur-form';

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

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'raisonSociale', label: 'Raison Sociale' },
    { key: 'personneContact', label: 'Contact' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'ville', label: 'Ville' },
    { key: 'ice', label: 'ICE' }
  ];

  actions: TableAction[] = [
    { label: 'Modifier', action: 'edit', class: 'text-gray-600 hover:text-gray-900 mr-3' },
    { label: 'Supprimer', action: 'delete', class: 'text-red-600 hover:text-red-900' }
  ];

  cardFields = [
    { key: 'id', label: 'ID' },
    { key: 'personneContact', label: 'Contact' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'ville', label: 'Ville' },
    { key: 'ice', label: 'ICE' }
  ];

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit() {
    this.loadFournisseurs();
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
      console.log('Modifier fournisseur:', item);
    } else if (action === 'delete') {
      console.log('Supprimer fournisseur:', item);
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  openForm() {
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onFournisseurAdded() {
    this.loadFournisseurs();
  }

}
