import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'number';
}

export interface TableAction {
  label: string;
  action: string;
  class?: string;
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

  getValue(item: any, column: any) {
    const value = item[column.key];
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('fr-FR');
    }
    return value;
  }
}
