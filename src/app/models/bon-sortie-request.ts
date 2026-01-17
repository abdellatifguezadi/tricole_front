export interface LigneBonSortieRequest {
  produitId: number;
  quantite: number;
}

export interface BonSortieRequest {
  dateSortie: string;
  motif: string;
  atelier: string;
  ligneBonSorties: LigneBonSortieRequest[];
}

