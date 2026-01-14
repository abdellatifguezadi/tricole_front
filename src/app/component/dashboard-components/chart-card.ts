import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  templateUrl: './chart-card.html',
  imports: [CommonModule, BaseChartDirective]
})
export class ChartCard implements OnChanges {
  @Input() title: string = '';
  @Input() data: { [key: string]: number } = {};
  @Input() chartType: 'doughnut' | 'bar' | 'pie' = 'pie';

  chartLabels: string[] = [];
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 8,
          font: {
            size: 11
          }
        }
      }
    }
  };

  private colors = [
    '#0f766e',
    '#14b8a6',
    '#6b7280',
    '#0ea5e9',
    '#22d3ee',
    '#2dd4bf',
    '#9ca3af',
    '#7dd3fc',
    '#67e8f9',
    '#4b5563',
    '#38bdf8',
    '#06b6d4',

  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const entries = Object.entries(this.data);
    this.chartLabels = entries.map(([key]) => key);
    const values = entries.map(([, value]) => value);

    this.chartData = {
      labels: this.chartLabels,
      datasets: [{
        data: values,
        backgroundColor: this.colors.slice(0, values.length),
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    };
  }

  get dataArray() {
    return Object.entries(this.data).map(([key, value]) => ({ key, value }));
  }
}
