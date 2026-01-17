import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ProductRequest, ProductResponse} from '../../models/Product/productResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/v1/produits';

  constructor(private http : HttpClient) {
  }

  getProducts():Observable<ProductResponse[]> {
  return this.http.get<ProductResponse[]>(this.apiUrl, { withCredentials: true });
  }

  addProduct(request : ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, request , {withCredentials:true})
  }
}
