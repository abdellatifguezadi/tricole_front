import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Fournisseur, FournisseurRequest} from '../../models/fournisseur';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private apiUrl = 'http://localhost:8080/api/v1/fournisseurs';

  constructor(private http: HttpClient) { }

  getFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl, { withCredentials: true });
  }

  addFournisseur(request : FournisseurRequest): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, request , {withCredentials:true})
  }

}
