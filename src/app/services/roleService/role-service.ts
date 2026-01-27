import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleResponse } from '../../models/roleResponse';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${this.apiUrl}/roles`, { withCredentials: true });
  }
}
