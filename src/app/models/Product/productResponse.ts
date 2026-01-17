
export interface ProductResponse{
  id: number,
  reference: string,
  nom: string,
  description: string,
  stockActuel: number,
  pointCommande: number,
  uniteMesure: string,
  categorie: string,
  dateCreation: Date ,
  dateModification: Date
}



export interface ProductRequest{
  reference: string,
  nom: string,
  description: string,
  stockActuel: number,
  pointCommande: number,
  uniteMesure: string,
  categorie: string
}

