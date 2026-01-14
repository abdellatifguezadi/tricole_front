
export interface ProductResponse{
  id: number,
  reference: string,
  nom: string,
  description: string,
  stockActuel: number,
  pointCommande: number,
  uniteMesure: number,
  categorie: string,
  dateCreation: Date ,
  dateModification: Date
}
