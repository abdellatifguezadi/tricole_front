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

  updateProduct(id: number, request: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, request, {withCredentials: true});
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {withCredentials: true});
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`, {withCredentials: true});
  }
}
