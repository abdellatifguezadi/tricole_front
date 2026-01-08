import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, LoginResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials , { withCredentials: true })
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('tokenType', response.tokenType);
            localStorage.setItem('user', JSON.stringify({
              userId: response.userId,
              username: response.username,
              email: response.email,
              role: response.role
            }));
          }
          this.currentUserSubject.next(response);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('accessToken', response.accessToken);
        }
      })
    );
  }


  private loadStoredUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }
}
