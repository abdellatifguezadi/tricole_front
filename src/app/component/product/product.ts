import { Component } from '@angular/core';
import {ProductResponse} from '../../models/Product/productResponse';
import { Table, TableColumn, TableAction } from '../table/table';
import {CommonModule} from '@angular/common';
import {Sidebar} from '../sidebar/sidebar';
import {MobileCard} from '../mobile-card/mobile-card';
import {ErrorMessage} from '../error-message/error-message';
import {ProductService} from '../../services/product/product-service';


@Component({
  selector: 'app-product',
  imports: [CommonModule, Table, Sidebar, MobileCard, ErrorMessage],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
   products : ProductResponse[] = [] ;
   loading = false ;
   error = '';
   sidebarOpen = false;

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
    this.loading = true;
    this.error = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  onTableAction = (action: string, item: any) => {
    if (action === 'edit') {
      console.log('Modifier Product:', item);
    } else if (action === 'delete') {
      console.log('Supprimer product:', item);
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
