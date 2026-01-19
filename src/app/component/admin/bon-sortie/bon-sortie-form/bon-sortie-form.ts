import { Component, Output, EventEmitter, signal, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { BonSortieService } from '../../../../services/bon-sortie/bon-sortie.service';
import { ProductService } from '../../../../services/product/product-service';
import { BonSortieRequest } from '../../../../models/bon-sortie-request';
import { BonSortie } from '../../../../models/bon-sortie';
import { InputField } from '../../../shared/input-field/input-field';
import { SelectField, SelectOption } from '../../../shared/select-field/select-field';
import { ModalForm } from '../../../shared/modal-form/modal-form';
import { catchError, finalize } from 'rxjs';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-bon-sortie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField, SelectField, ModalForm],
  templateUrl: './bon-sortie-form.html',
  styleUrl: './bon-sortie-form.css',
})
export class BonSortieForm implements OnInit {
  @Input() bonSortie: BonSortie | null = null;
  @Output() closeForm = new EventEmitter<void>();
  @Output() bonSortieAdded = new EventEmitter<void>();

  private fb = new FormBuilder();

  isLoading = signal(false);
  errorMessage = signal('');
  produits = signal<any[]>([]);
  isEditMode = signal(false);

  motifOptions: SelectOption[] = [
    { value: 'PRODUCTION', label: 'Production' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  atelierOptions: SelectOption[] = [
    { value: 'ATELIER1', label: 'Atelier 1' },
    { value: 'ATELIER2', label: 'Atelier 2' },
    { value: 'ATELIER3', label: 'Atelier 3' }
  ];

  produitOptions = signal<SelectOption[]>([]);

  bonSortieForm = this.fb.nonNullable.group({
    dateSortie: ['', Validators.required],
    motif: ['PRODUCTION', Validators.required],
    atelier: ['', Validators.required],
    ligneBonSorties: this.fb.array([])
  });

  constructor(
    private bonSortieService: BonSortieService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProduits();
    if (this.bonSortie) {
      this.isEditMode.set(true);
      this.populateForm();
    } else {
      this.addLigne();
    }
  }

  populateForm() {
    if (!this.bonSortie) return;

    this.bonSortieForm.patchValue({
      dateSortie: this.bonSortie.dateSortie,
      motif: this.bonSortie.motif,
      atelier: this.bonSortie.atelier
    });

    while (this.lignes.length) {
      this.lignes.removeAt(0);
    }

    this.bonSortie.ligneBonSorties?.forEach(ligne => {
      const ligneGroup = this.fb.group({
        produitId: [ligne.produit?.id, Validators.required],
        quantite: [ligne.quantite, [Validators.required, Validators.min(1)]]
      });
      this.lignes.push(ligneGroup);
    });
  }

  loadProduits() {
    this.productService.getProducts().subscribe(data => {
      this.produits.set(data);
      this.produitOptions.set(data.map((p: any) => ({
        value: p.id,
        label: `${p.nom} (${p.reference})`
      })));
    });
  }

  get lignes(): FormArray {
    return this.bonSortieForm.get('ligneBonSorties') as FormArray;
  }

  addLigne() {
    const ligneGroup = this.fb.group({
      produitId: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]]
    });
    this.lignes.push(ligneGroup);
  }

  removeLigne(index: number) {
    if (this.lignes.length > 1) {
      this.lignes.removeAt(index);
    }
  }

  onSubmit() {
    if (this.bonSortieForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.bonSortieForm.getRawValue();
    const request: BonSortieRequest = {
      dateSortie: formValue.dateSortie,
      motif: formValue.motif,
      atelier: formValue.atelier,
      ligneBonSorties: formValue.ligneBonSorties.map((ligne: any) => ({
        produitId: Number(ligne.produitId),
        quantite: Number(ligne.quantite)
      }))
    };

    const operation = this.isEditMode()
      ? this.bonSortieService.updateBonSortie(this.bonSortie!.id, request)
      : this.bonSortieService.createBonSortie(request);

    operation.pipe(
      finalize(() => this.isLoading.set(false)),
      catchError(err => {
        this.errorMessage.set(this.extractErrorMessage(err));
        return EMPTY;
      })
    ).subscribe(() => {
      this.bonSortieAdded.emit();
      this.closeForm.emit();
    });
  }

  extractErrorMessage(err: any): string {
    if (err.error) {
      if (typeof err.error === 'object') {
        const messages = Object.values(err.error).filter(v => typeof v === 'string');
        if (messages.length > 0) {
          return messages.join(', ');
        }
      }
      if (typeof err.error === 'string') {
        return err.error;
      }
    }
    return 'Erreur lors de la création';
  }

  onCancel() {
    this.closeForm.emit();
  }

  getFieldError(fieldName: string, errorMessage: string): string {
    const control = this.bonSortieForm.get(fieldName);
    return control?.invalid && control?.touched ? errorMessage : '';
  }
}

