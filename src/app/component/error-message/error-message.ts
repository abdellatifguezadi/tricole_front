import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  template: `
    <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
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