import {Component, EventEmitter, inject, OnInit, Output, signal, Input} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductService} from '../../../services/product/product-service';
import {ProductRequest, ProductResponse} from '../../../models/Product/productResponse';
import {catchError, tap} from 'rxjs/operators'
import {EMPTY, finalize} from 'rxjs';
import {InputField} from '../../shared/input-field/input-field';
import {ModalForm} from '../../shared/modal-form/modal-form';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule, ReactiveFormsModule, InputField, ModalForm
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {

  @Input() product: ProductResponse | null = null;
  @Output() closeForm = new EventEmitter<void>();
  @Output() productAdded = new EventEmitter<void>();

  private fb = new FormBuilder();

  isLoading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);

  formFields = [
    {
      name : 'reference',
      label: 'Reference',
      type: 'text',
      placeholder: 'Référence du produit',
      errorMessage: 'Référence requise'
    },
    {
      name : 'nom',
      label: 'Nom du produit',
      type: 'text',
      placeholder: 'Nom du produit',
      errorMessage: 'Nom du produit requis'
    },
    {
      name : 'stockActuel',
      label: 'Stock Actuel',
      type: 'number',
      placeholder: 'Quantité en stock',
      errorMessage: 'Stock actuel requis'
    },
    {
      name : 'pointCommande',
      label: 'Point de Commande',
      type: 'number',
      placeholder: 'Point de commande',
      errorMessage: 'Point de commande requis'
    },
    {
      name : 'uniteMesure',
      label: 'Unité de Mesure',
      type: 'text',
      placeholder: 'Unité de mesure (ex: kg, litre)',
      errorMessage: 'Unité de mesure requise'
    },
    {
      name : 'categorie',
      label: 'Catégorie',
      type: 'text',
      placeholder: 'Catégorie du produit',
      errorMessage: 'Catégorie requise'
    }
  ];

  descriptionField = {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Description du produit',
    errorMessage: 'Description requise'
  }

  productForm = this.fb.nonNullable.group({
    reference: ['', Validators.required],
    nom: ['', Validators.required],
    description: ['', Validators.required],
    stockActuel: [0, Validators.required],
    pointCommande: [0 ,Validators.required],
    uniteMesure: ['' , Validators.required],
    categorie: ['', Validators.required]

  });

  private productService = inject(ProductService);

  ngOnInit() {
    if (this.product) {
      this.isEditMode.set(true);
      this.productForm.patchValue({
        reference: this.product.reference,
        nom: this.product.nom,
        description: this.product.description,
        stockActuel: this.product.stockActuel,
        pointCommande: this.product.pointCommande,
        uniteMesure: this.product.uniteMesure,
        categorie: this.product.categorie
      });
    }
  }

  getFieldError(fieldName: string, errorMessage: string): string {
    const control = this.productForm.get(fieldName);
    return control?.invalid && control?.touched ? errorMessage : '';
  }


  onSubmit() {
    if (this.productForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = this.productForm.getRawValue() as ProductRequest;
    const operation = this.isEditMode()
      ? this.productService.updateProduct(this.product!.id, formData)
      : this.productService.addProduct(formData);

    operation.pipe(
      tap(() => {
          this.productAdded.emit();
          this.closeForm.emit();
      }),
      catchError((err) => {
        console.error('Error details:', err);

        const errorMessages: string[] = [];

        if (err.error && typeof err.error === 'object') {
          if (typeof err.error.reference === 'string') errorMessages.push(err.error.reference);
          if (typeof err.error.nom === 'string') errorMessages.push(err.error.nom);
          if (typeof err.error.description === 'string') errorMessages.push(err.error.description);
          if (typeof err.error.stockActuel === 'string') errorMessages.push(err.error.stockActuel);
          if (typeof err.error.pointCommande === 'string') errorMessages.push(err.error.pointCommande);
          if (typeof err.error.uniteMesure === 'string') errorMessages.push(err.error.uniteMesure);
          if (typeof err.error.categorie === 'string') errorMessages.push(err.error.categorie);

          if (typeof err.error.message === 'string') errorMessages.push(err.error.message);
          if (typeof err.error.error === 'string') errorMessages.push(err.error.error);
        }

        const finalError = errorMessages.length > 0
          ? errorMessages.join(', ')
          : 'Erreur inattendue';

        this.errorMessage.set(finalError);
        return EMPTY;

      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    ).subscribe();
  }

  onCancel() {
    this.closeForm.emit();
  }



}
