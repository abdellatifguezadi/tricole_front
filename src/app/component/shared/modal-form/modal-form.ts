import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-form.html',
  styleUrl: './modal-form.css',
})
export class ModalForm {
  @Input() title = '';
  @Input() form!: FormGroup;

  private _isLoading = signal(false);
  private _errorMessage = signal('');

  @Input()
  set isLoading(value: boolean) {
    this._isLoading.set(value);
  }

  get isLoading() {
    return this._isLoading();
  }

  @Input()
  set errorMessage(value: string) {
    this._errorMessage.set(value);
  }

  get errorMessage() {
    return this._errorMessage();
  }

  @Input() submitLabel = 'Enregistrer';

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();

  @ContentChild('formContent') formContent!: TemplateRef<any>;

  onCancel() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.form.invalid || this._isLoading()) return;
    this.submitForm.emit();
  }
}
