import {Component, signal, WritableSignal, OnInit} from '@angular/core';
import {ProductResponse} from '../../models/Product/productResponse';
import { Table, TableColumn, TableAction } from '../shared/table/table';
import {CommonModule} from '@angular/common';
import {Sidebar} from '../sidebar/sidebar';
import {MobileCard} from '../shared/mobile-card/mobile-card';
import {ErrorMessage} from '../error-message/error-message';
import {ProductService} from '../../services/product/product-service';
import {ProductForm} from './product-form/product-form';


@Component({
  selector: 'app-product',
  imports: [CommonModule, Table, Sidebar, MobileCard, ErrorMessage, ProductForm],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
   products : WritableSignal<ProductResponse[]> = signal<ProductResponse[]>([]);
  loading = signal(false);
  error = signal('');
  sidebarOpen = signal(false);

  showForm = signal(false);
  selectedProduct = signal<ProductResponse | null>(null);

  columns: TableColumn[] = [
    {key: 'id', label: 'ID'},
    {key: 'nom', label: 'Nom'},
    {key: 'reference', label: 'Reference'},
    {key: 'description', label: 'Description'},
    {key: 'stockActuel', label: 'Stock Actuel'},
    {key: 'pointCommande', label: 'point Commande'},
    {key: 'uniteMesure', label: 'Unite De Mesure'},
    {key: 'dateCreation', label : 'Date De Creation'},
    {key: 'dateModification', label : 'Date De Modification'}
  ];

  actions: TableAction[] = [
    { label: 'Modifier', action: 'edit', class: 'text-gray-600 hover:text-gray-900 mr-3' },
    { label: 'Supprimer', action: 'delete', class: 'text-red-600 hover:text-red-900' }
  ];


  cardFields = [
    {key: 'id', label: 'ID'},
    {key: 'nom', label: 'Nom'},
    {key: 'reference', label: 'Reference'},
    {key: 'description', label: 'Description'},
    {key: 'stockActuel', label: 'Stock Actuel'},
    {key: 'pointCommande', label: 'point Commande'},
    {key: 'uniteMesure', label: 'Unite De Mesure'},
    {key: 'dateCreation', label : 'Date De Creation'},
    {key: 'dateModification', label : 'Date De Modification'}
  ];



  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set('');

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load products.');
        this.loading.set(false);
      }
    });
  }

  onTableAction = (action: string, item: any) => {
    if (action === 'edit') {
      this.selectedProduct.set(item);
      this.showForm.set(true);
    } else if (action === 'delete') {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        this.deleteProduct(item.id);
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  openForm() {
    this.selectedProduct.set(null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.selectedProduct.set(null);
  }

  onProductAdded() {
    this.loadProducts();
  }

  deleteProduct(id: number) {
    this.loading.set(true);
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        let message = 'Erreur lors de la suppression du produit';

        if (err.error) {
          message = err.error.error;
        }

        this.error.set(message);
        this.loading.set(false);
      }
    });
  }
}
