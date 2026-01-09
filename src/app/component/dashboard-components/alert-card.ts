import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  templateUrl: './alert-card.html',
  imports: [CommonModule]
})
export class AlertCard {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: 'warning' | 'error' | 'info' = 'warning';

  get alertClass() {
    const classes = {
      warning: 'bg-yellow-50 text-yellow-800',
      error: 'bg-red-50 text-red-800',
      info: 'bg-blue-50 text-blue-800'
    };
    return classes[this.type];
  }
}