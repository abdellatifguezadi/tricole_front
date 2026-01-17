import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InfoField {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'badge';
  badgeClass?: string;
}

export interface InfoSection {
  title: string;
  bgClass: string;
  fields: InfoField[];
  columns?: number;
}

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-card.html',
  styleUrl: './info-card.css'
})
export class InfoCard {
  @Input() data: any = {};
  @Input() sections: InfoSection[] = [];


  getValue(key: string): any {
    const keys = key.split('.');
    let value = this.data;

    for (const k of keys) {
      value = value?.[k];
    }

    return value;
  }


  formatValue(field: InfoField): string {
    const value = this.getValue(field.key);

    if (!value) return '-';

    switch (field.type) {
      case 'currency':
        return `${value} DH`;
      case 'date':
        return new Date(value).toLocaleDateString('fr-FR');
      default:
        return value;
    }
  }


  getGridClass(columns: number = 2): string {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  }
}
