import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'number' | 'currency' | 'datetime';
}

export interface TableAction {
  label: string;
  action: string;
  class?: string;
  showIf?: (item: any) => boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'Aucune donnée trouvée';
  @Output() actionClick = new EventEmitter<{action: string, item: any}>();

  onAction(action: string, item: any) {
    this.actionClick.emit({action, item});
  }

  shouldShowAction(action: TableAction, item: any): boolean {
    return action.showIf ? action.showIf(item) : true;
  }

  getValue(item: any, column: any) {
    const keys = column.key.split('.');
    let value = item;

    for (const key of keys) {
      value = value?.[key];
    }

    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('fr-FR');
    }
    if (column.type === 'datetime' && value) {
      return new Date(value).toLocaleDateString('fr-FR') + ' ' + new Date(value).toLocaleTimeString('fr-FR');
    }
    if (column.type === 'currency' && value) {
      return `${value} DH`;
    }
    return value;
  }
}
