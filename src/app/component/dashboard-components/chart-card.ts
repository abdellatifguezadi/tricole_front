import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  templateUrl: './chart-card.html',
  imports: [CommonModule]
})
export class ChartCard {
  @Input() title: string = '';
  @Input() data: { [key: string]: number } = {};

  get dataArray() {
    return Object.entries(this.data).map(([key, value]) => ({ key, value }));
  }
}
