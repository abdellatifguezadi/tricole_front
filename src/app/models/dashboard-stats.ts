export interface DashboardStats {
  totalUtilisateurs: number;
  totalProduits: number;
  totalFournisseurs: number;
  totalCommandes: number;
  totalBonsSortie: number;
  valeurTotalStock: number;
  montantTotalCommandes: number;
  montantTotalSorties: number;
  commandesParStatut: { [key: string]: number };
  bonsSortieParStatut: { [key: string]: number };
  utilisateursParRole: { [key: string]: number };
  sortiesParAtelier: { [key: string]: number };
  valeursParAtelier: { [key: string]: number };
  produitsEnRupture: number;
  produitsProchesRupture: number;
  commandesEnRetard: number;
  nouvellesCommandesMois: number;
  nouveauxBonsSortieMois: number;
  mouvementStockMois: number;
}