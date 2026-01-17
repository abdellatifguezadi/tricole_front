
export interface Fournisseur{
   id : number,
  raisonSociale : string,
  adresse : string,
  telephone : string,
  email : string,
  ville : string,
  personneContact : string,
  ice : string,
  dateCreation : Date,
  dateModification : Date
}


export interface FournisseurRequest{
  raisonSociale : string,
  adresse : string,
  ville : string,
  personneContact : string,
  telephone : string,
  email : string,
  ice : string
}
