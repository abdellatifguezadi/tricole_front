import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface CardField {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'number';
}

export interface CardAction {
  label: string;
  action: string;
  class?: string;
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
  @Input() onAction: (action: string, item: any) => void = () => {};

  getFieldValue(field: any) {
    const value = this.data[field.key];
    if (field.type === 'date' && value) {
      return new Date(value).toLocaleDateString('fr-FR');
    }
    return value;
  }

  handleAction(action: string) {
    this.onAction(action, this.data);
  }
}
