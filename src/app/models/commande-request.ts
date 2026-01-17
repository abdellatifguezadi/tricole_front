export interface LigneCommandeRequest {
  produitId: number;
  quantite: number;
  prixUnitaire: number;
}

export interface CommandeRequest {
  fournisseurId: number;
  dateLivraisonPrevue: string;
  lignes: LigneCommandeRequest[];
}

