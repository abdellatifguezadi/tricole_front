export interface LigneCommande {
  id: number;
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
  quantite: number;
  prixUnitaire: number;
  montantLigneTotal: number;
}

export interface Commande {
  id: number;
  fournisseur: {
    id: number;
    raisonSociale: string;
    adresse: string;
    ville: string;
    personneContact: string;
    email: string;
    telephone: string;
    ice: string;
    dateCreation: string;
    dateModification: string;
  };
  numeroCommande: string;
  dateCommande: string;
  dateLivraisonPrevue: string;
  dateLivraisonEffective?: string;
  statut: string;
  montantTotal: number;
  lignesCommande: LigneCommande[];
  updatedAt: string;
}
