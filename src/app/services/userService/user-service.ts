import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/admin/users';


  constructor(private http: HttpClient) {
  }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {withCredentials: true})
  }

  activePermission(userId:number,permissionId:number):Observable<void>{
    return this.http.patch<void>(`${this.apiUrl}/${userId}/permissions/${permissionId}/activate`, {withCredentials: true});
  }

  deactivePermission(userId:number,permissionId:number):Observable<void>{
    return this.http.patch<void>(`${this.apiUrl}/${userId}/permissions/${permissionId}/deactivate`, {withCredentials: true});
  }
}
