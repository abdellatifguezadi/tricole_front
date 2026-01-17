import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface CardField {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'number' | 'currency' | 'datetime';
}

export interface CardAction {
  label: string;
  action: string;
  class?: string;
  showIf?: (item: any) => boolean;
}

@Component({
  selector: 'app-mobile-card',
  imports: [CommonModule],
  templateUrl: './mobile-card.html',
  styleUrl: './mobile-card.css',
})
export class MobileCard {
  @Input() data: any = {};
  @Input() fields: CardField[] = [];
  @Input() titleField = '';
  @Input() actions: CardAction[] = [];
  @Output() actionClick = new EventEmitter<{action: string, item: any}>();

  shouldShowAction(action: CardAction): boolean {
    return action.showIf ? action.showIf(this.data) : true;
  }

  getFieldValue(field: any) {
    const keys = field.key.split('.');
    let value = this.data;

    for (const key of keys) {
      value = value?.[key];
    }

    if (field.type === 'date' && value) {
      return new Date(value).toLocaleDateString('fr-FR');
    }
    if (field.type === 'datetime' && value) {
      return new Date(value).toLocaleDateString('fr-FR') + ' ' + new Date(value).toLocaleTimeString('fr-FR');
    }
    if (field.type === 'currency' && value) {
      return `${value} DH`;
    }
    return value;
  }

  getTitleValue() {
    const keys = this.titleField.split('.');
    let value = this.data;

    for (const key of keys) {
      value = value?.[key];
    }

    return value;
  }

  handleAction(action: string) {
    this.actionClick.emit({ action, item: this.data });
  }
}
