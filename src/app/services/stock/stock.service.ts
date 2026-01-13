import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MouvementStock } from '../../models/mouvment/mouvmentStock';
import { MouvementFilter } from '../../models/mouvment/mouvmentFilter';



export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}



@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api/v1/stock';

  constructor(private http: HttpClient) {}

  getMouvements(filter: MouvementFilter = {}): Observable<PagedResponse<MouvementStock>> {
    let params = new HttpParams();

    if (filter.produitId) params = params.set('produitId', filter.produitId.toString());
    if (filter.reference) params = params.set('reference', filter.reference);
    if (filter.type) params = params.set('type', filter.type);
    if (filter.numeroLot) params = params.set('numeroLot', filter.numeroLot);
    if (filter.dateDebut) params = params.set('dateDebut', filter.dateDebut);
    if (filter.dateFin) params = params.set('dateFin', filter.dateFin);

    params = params.set('page', (filter.page || 0).toString());
    params = params.set('size', (filter.size || 5).toString());

    return this.http.get<PagedResponse<MouvementStock>>(`${this.apiUrl}/mouvements/filter`, { params });
  }
}
