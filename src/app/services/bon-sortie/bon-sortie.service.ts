import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BonSortie } from '../../models/bon-sortie';
import { BonSortieRequest } from '../../models/bon-sortie-request';

@Injectable({
  providedIn: 'root'
})
export class BonSortieService {
  private apiUrl = 'http://localhost:8080/api/v1/bonSorties';

  constructor(private http: HttpClient) {}

  getBonSorties(): Observable<BonSortie[]> {
    return this.http.get<BonSortie[]>(this.apiUrl, { withCredentials: true });
  }

  getBonSortieById(id: number): Observable<BonSortie> {
    return this.http.get<BonSortie>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createBonSortie(bonSortie: BonSortieRequest): Observable<BonSortie> {
    return this.http.post<BonSortie>(this.apiUrl, bonSortie, { withCredentials: true });
  }

  updateBonSortie(id: number, bonSortie: Partial<BonSortie>): Observable<BonSortie> {
    return this.http.put<BonSortie>(`${this.apiUrl}/${id}`, bonSortie, { withCredentials: true });
  }

  deleteBonSortie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
