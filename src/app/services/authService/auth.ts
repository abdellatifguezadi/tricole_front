import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { LoginRequest, User, AuthResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  private loadingPromise: Observable<User | null> | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
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


  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.currentUserSignal.set(null);
      }),
      catchError(() => {
        this.currentUserSignal.set(null);
        return of(null);
      })
    );
  }


  loadCurrentUser(): Observable<User | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }

    if (this.currentUserSignal()) {
      return of(this.currentUserSignal());
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.http.get<AuthResponse>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    ).pipe(
      map(res => {
        const user: User = {
          userId: res.userId,
          username: res.username,
          email: res.email,
          fullName: res.fullName,
          role: res.role,
          authorities: res.authorities
        };
        this.currentUserSignal.set(user);
        this.loadingPromise = null;
        return user;
      }),
      catchError(err => {
        if (err.status === 401) {
          this.currentUserSignal.set(null);
        }
        this.loadingPromise = null;
        return of(null);
      }),
      shareReplay(1)
    );

    return this.loadingPromise;
  }



  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  hasAnyPermission(authorities: string[]): boolean {
    const user = this.getCurrentUser();
    return authorities.some(authority => user?.authorities?.includes(authority)) || false;
  }

  getRoleBasedRoute(): string {
    const user = this.currentUserSignal();
    if (!user?.role) return '/login';

    switch (user.role.toLowerCase()) {
      case 'admin':
        return '/admin_dashboard';
      case 'user':
        return '/user_dashboard';
      case 'manager':
        return '/manager_dashboard';
      case 'magasinier':
        return '/magasinier_dashboard';
      default:
        return '/login';
    }
  }


  private handleAuthSuccess(res: AuthResponse): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const user: User = {
      userId: res.userId,
      username: res.username,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
      authorities: res.authorities
    };

    this.currentUserSignal.set(user);
  }
}


