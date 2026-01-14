import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  template: `
    <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <span class="material-icons text-red-400 mr-2">error</span>
        <p class="text-red-800 text-sm font-medium">{{ error }}</p>
      </div>
      <button
        *ngIf="showRetry"
        (click)="onRetry()"
        class="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
        {{ retryText }}
      </button>
    </div>
  `,
  standalone: true
})
export class ErrorMessage {
  @Input() error = '';
  @Input() showRetry = true;
  @Input() retryText = 'Réessayer';
  @Output() retry = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }
}
