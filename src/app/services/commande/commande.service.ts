 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../../models/commande';
import { CommandeRequest } from '../../models/commande-request';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8080/api/v1/commandes';

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl, { withCredentials: true });
  }

  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createCommande(commande: CommandeRequest): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande, { withCredentials: true });
  }

  updateCommande(id: number, commande: CommandeRequest): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}`, commande, { withCredentials: true });
  }

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
