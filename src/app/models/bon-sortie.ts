export interface LigneBonSortie {
  id: number;
  quantite: number;
  produit: {
    id: number;
    reference: string;
    nom: string;
    description: string;
    stockActuel: number;
    pointCommande: number;
    uniteMesure: string;
    categorie: string;
    dateCreation: string;
    dateModification: string;
  };
}

export interface BonSortie {
  id: number;
  numeroBon: string;
  dateSortie: string;
  statut: string;
  motif: string;
  atelier: string;
  dateCreation: string;
  dateModification: string;
  ligneBonSorties: LigneBonSortie[];
  montantTotal?: number;
}
