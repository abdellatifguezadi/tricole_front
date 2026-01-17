import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn } from '../table/table';

@Component({
  selector: 'app-product-lines',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './product-lines.html',
  styleUrl: './product-lines.css'
})
export class ProductLines {
  @Input() lines: any[] = [];
  @Input() title = 'Produits';
  @Input() showPricing = false;
  @Input() montantTotal?: number;


  getColumns(): TableColumn[] {
    const baseColumns: TableColumn[] = [
      { key: 'produit.reference', label: 'Référence', type: 'text' },
      { key: 'produit.nom', label: 'Nom Produit', type: 'text' },
      { key: 'produit.description', label: 'Description', type: 'text' },
      { key: 'quantite', label: 'Quantité', type: 'number' },
      { key: 'produit.uniteMesure', label: 'Unité', type: 'text' }
    ];

    if (this.showPricing) {
      baseColumns.push(
        { key: 'prixUnitaire', label: 'Prix Unitaire', type: 'currency' },
        { key: 'montantLigneTotal', label: 'Montant', type: 'currency' }
      );
    }

    baseColumns.push({ key: 'produit.stockActuel', label: 'Stock Actuel', type: 'number' });

    return baseColumns;
  }


  formatCurrency(amount: number): string {
    return `${amount} DH`;
  }
}
