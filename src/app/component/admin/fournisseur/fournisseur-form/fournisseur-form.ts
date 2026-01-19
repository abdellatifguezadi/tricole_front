import { Component, Output, EventEmitter, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FournisseurService } from '../../../../services/fournisseur/fournisseur-service';
import { FournisseurRequest, Fournisseur } from '../../../../models/fournisseur';
import { InputField } from '../../../shared/input-field/input-field';
import { ModalForm } from '../../../shared/modal-form/modal-form';
import {catchError, tap} from 'rxjs/operators';
import {EMPTY, finalize} from 'rxjs';

@Component({
  selector: 'app-fournisseur-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField, ModalForm],
  templateUrl: './fournisseur-form.html',
  styleUrl: './fournisseur-form.css',
})
export class FournisseurForm implements OnInit {
  @Input() fournisseur: Fournisseur | null = null;
  @Output() closeForm = new EventEmitter<void>();
  @Output() fournisseurAdded = new EventEmitter<void>();

  private fb = new FormBuilder();

  isLoading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);

  formFields = [
    {
      name: 'raisonSociale',
      label: 'Raison Sociale',
      type: 'text',
      placeholder: 'Nom de l\'entreprise',
      errorMessage: 'Raison sociale requise'
    },
    {
      name: 'ice',
      label: 'ICE',
      type: 'text',
      placeholder: 'Numéro ICE',
      errorMessage: 'ICE requis'
    },
    {
      name: 'personneContact',
      label: 'Personne Contact',
      type: 'text',
      placeholder: 'Nom du contact',
      errorMessage: 'Contact requis'
    },
    {
      name: 'telephone',
      label: 'Téléphone',
      type: 'tel',
      placeholder: '0612345678',
      errorMessage: 'Téléphone requis'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'contact@entreprise.com',
      errorMessage: 'Email valide requis'
    },
    {
      name: 'ville',
      label: 'Ville',
      type: 'text',
      placeholder: 'Casablanca',
      errorMessage: 'Ville requise'
    },

  ];
  adresseField = {
    name: 'adresse',
    label: 'Adresse',
    type: 'text',
    placeholder: 'Adresse complète',
    errorMessage: 'Adresse requise'
  };

  fournisseurForm = this.fb.nonNullable.group({
    raisonSociale: ['', Validators.required],
    adresse: ['', Validators.required],
    ville: ['', Validators.required],
    personneContact: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    ice: ['', Validators.required]
  });

  constructor(
    private fournisseurService: FournisseurService
  ) {}

  ngOnInit() {
    if (this.fournisseur) {
      this.isEditMode.set(true);
      this.fournisseurForm.patchValue({
        raisonSociale: this.fournisseur.raisonSociale,
        adresse: this.fournisseur.adresse,
        ville: this.fournisseur.ville,
        personneContact: this.fournisseur.personneContact,
        telephone: this.fournisseur.telephone,
        email: this.fournisseur.email,
        ice: this.fournisseur.ice
      });
    }
  }

  getFieldError(fieldName: string, errorMessage: string): string {
    const control = this.fournisseurForm.get(fieldName);
    return control?.invalid && control?.touched ? errorMessage : '';
  }

  onSubmit() {
    if (this.fournisseurForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = this.fournisseurForm.getRawValue() as FournisseurRequest;
    const operation = this.isEditMode() 
      ? this.fournisseurService.updateFournisseur(this.fournisseur!.id, formData)
      : this.fournisseurService.addFournisseur(formData);

    operation.pipe(
      tap(()=> {
        this.fournisseurAdded.emit();
        this.closeForm.emit();
      }),
      catchError((err) => {
        console.error(err.error);

        let myError = 'Erreur inattendue';

        if (err.error) {
          const firstValue = Object.values(err.error)[0];
          myError = typeof firstValue === 'string' ? firstValue : 'Erreur inattendue';
        }

        this.errorMessage.set(myError);

        return EMPTY;
      }),
      finalize(()=>{
        this.isLoading.set(false);
      })
    ).subscribe();
  }

  onCancel() {
    this.closeForm.emit();
  }
}
