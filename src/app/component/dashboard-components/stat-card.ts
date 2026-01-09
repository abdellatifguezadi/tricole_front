import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.html',
  imports: [CommonModule]
})
export class StatCard {
  @Input() title: string = '';
  @Input() value: number | string = 0;
}