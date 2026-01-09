import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { LoginRequest, LoginResponse , User } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredUser();
  }


  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        credentials,
        { withCredentials: true }
      )
      .pipe(
        tap(res => this.handleAuthSuccess(res))
      );
  }


  register(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }


  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.currentUserSubject.next(null);
  }


  refreshToken(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(res => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', res.accessToken);
          }
        })
      );
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }


  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getRoleBasedRoute(): string {
    const user = this.currentUserSubject.value;
    if (!user) return '/login';

    switch (user.role.toLowerCase()) {
      case 'admin':
        return '/admin_dashboard';
      case 'user':
        return '/user_dashboard';
      case 'manager':
        return '/manager_dashboard';
      default:
        return '/login';
    }
  }


  private handleAuthSuccess(res: LoginResponse): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const user: User = {
      userId: res.userId,
      username: res.username,
      email: res.email,
      role: res.role,
    };

    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('tokenType', res.tokenType);
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}
