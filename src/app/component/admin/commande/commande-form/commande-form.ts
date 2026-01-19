import { Component, Output, EventEmitter, signal, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommandeService } from '../../../../services/commande/commande.service';
import { ProductService } from '../../../../services/product/product-service';
import { FournisseurService } from '../../../../services/fournisseur/fournisseur-service';
import { CommandeRequest } from '../../../../models/commande-request';
import { Commande } from '../../../../models/commande';
import { InputField } from '../../../shared/input-field/input-field';
import { SelectField, SelectOption } from '../../../shared/select-field/select-field';
import { ModalForm } from '../../../shared/modal-form/modal-form';
import { catchError, finalize } from 'rxjs';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField, SelectField, ModalForm],
  templateUrl: './commande-form.html',
  styleUrl: './commande-form.css',
})
export class CommandeForm implements OnInit {
  @Input() commande: Commande | null = null;
  @Output() closeForm = new EventEmitter<void>();
  @Output() commandeAdded = new EventEmitter<void>();

  private fb = new FormBuilder();

  isLoading = signal(false);
  errorMessage = signal('');
  produits = signal<any[]>([]);
  fournisseurs = signal<any[]>([]);
  isEditMode = signal(false);

  fournisseurOptions = signal<SelectOption[]>([]);
  produitOptions = signal<SelectOption[]>([]);

  commandeForm = this.fb.nonNullable.group({
    fournisseurId: ['', Validators.required],
    dateLivraisonPrevue: ['', Validators.required],
    lignes: this.fb.array([])
  });

  constructor(
    private commandeService: CommandeService,
    private productService: ProductService,
    private fournisseurService: FournisseurService
  ) {}

  ngOnInit() {
    this.loadProduits();
    this.loadFournisseurs();
    if (this.commande) {
      this.isEditMode.set(true);
      this.populateForm();
    } else {
      this.addLigne();
    }
  }

  populateForm() {
    if (!this.commande) return;
    
    this.commandeForm.patchValue({
      fournisseurId: this.commande.fournisseur?.id?.toString() || '',
      dateLivraisonPrevue: this.commande.dateLivraisonPrevue
    });

    // Clear existing lines and add from commande
    while (this.lignes.length) {
      this.lignes.removeAt(0);
    }

    this.commande.lignesCommande?.forEach(ligne => {
      const ligneGroup = this.fb.group({
        produitId: [ligne.produit?.id, Validators.required],
        quantite: [ligne.quantite, [Validators.required, Validators.min(1)]],
        prixUnitaire: [ligne.prixUnitaire, [Validators.required, Validators.min(0)]]
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

  loadFournisseurs() {
    this.fournisseurService.getFournisseurs().subscribe(data => {
      this.fournisseurs.set(data);
      this.fournisseurOptions.set(data.map((f: any) => ({
        value: f.id,
        label: f.raisonSociale
      })));
    });
  }

  get lignes(): FormArray {
    return this.commandeForm.get('lignes') as FormArray;
  }

  addLigne() {
    const ligneGroup = this.fb.group({
      produitId: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [0, [Validators.required, Validators.min(0)]]
    });
    this.lignes.push(ligneGroup);
  }

  removeLigne(index: number) {
    if (this.lignes.length > 1) {
      this.lignes.removeAt(index);
    }
  }

  onSubmit() {
    if (this.commandeForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.commandeForm.getRawValue();
    const request: CommandeRequest = {
      fournisseurId: Number(formValue.fournisseurId),
      dateLivraisonPrevue: formValue.dateLivraisonPrevue,
      lignes: formValue.lignes.map((ligne: any) => ({
        produitId: Number(ligne.produitId),
        quantite: Number(ligne.quantite),
        prixUnitaire: Number(ligne.prixUnitaire)
      }))
    };

    const operation = this.isEditMode()
      ? this.commandeService.updateCommande(this.commande!.id, request)
      : this.commandeService.createCommande(request);

    operation.pipe(
      finalize(() => this.isLoading.set(false)),
      catchError(err => {
        this.errorMessage.set(this.extractErrorMessage(err));
        return EMPTY;
      })
    ).subscribe(() => {
      this.commandeAdded.emit();
      this.closeForm.emit();
    });
  }

  extractErrorMessage(err: any): string {
    if (err.error) {
      // Si c'est un objet avec des champs d'erreur
      if (typeof err.error === 'object') {
        const messages = Object.values(err.error).filter(v => typeof v === 'string');
        if (messages.length > 0) {
          return messages.join(', ');
        }
      }
      // Si c'est une string directe
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
    const control = this.commandeForm.get(fieldName);
    return control?.invalid && control?.touched ? errorMessage : '';
  }
}

