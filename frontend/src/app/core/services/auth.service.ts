import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, DecodedToken } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { NotificationSocketService } from './notification-socket.service';

const ACCESS_TOKEN_KEY = 'ums_access_token';
const REFRESH_TOKEN_KEY = 'ums_refresh_token';
const USER_EMAIL_KEY = 'ums_user_email';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  isLoggedIn = signal<boolean>(this.hasValidToken());
  currentUserEmail = signal<string | null>(localStorage.getItem(USER_EMAIL_KEY));
  currentUserRoles = signal<string[]>(this.decodeTokenRoles());

  hasRole(role: string): boolean {
    return this.currentUserRoles().includes(role);
  }

  hasAnyRole(required: string[]): boolean {
    return required.some((r) => this.currentUserRoles().includes(r));
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: NotificationSocketService,
  ) {}

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/login`, request).pipe(
      tap((res) => {
        if (res.success) this.handleAuthSuccess(res.data);
      }),
    );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/register`, request).pipe(
      tap((res) => {
        if (res.success) this.handleAuthSuccess(res.data);
      }),
    );
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.api}/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          if (res.success) this.handleAuthSuccess(res.data);
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    this.isLoggedIn.set(false);
    this.currentUserEmail.set(null);
    this.currentUserRoles.set([]);
    this.socketService.disconnect();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)) as DecodedToken;
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    return this.getDecodedToken()?.userId ?? null;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return true;
    return Date.now() >= decoded.exp * 1000;
  }

  redirectAfterLogin(): void {
    const roles = this.currentUserRoles();
    if (roles.includes('ADMIN') || roles.includes('HR') || roles.includes('PAYROLL')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (roles.includes('ADMISSION')) {
      this.router.navigate(['/admission/circulars']);
    } else if (roles.includes('FACULTY')) {
      this.router.navigate(['/academic/courses']);
    } else {
      this.router.navigate(['/student/dashboard']);
    }
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_EMAIL_KEY, response.email);

    this.isLoggedIn.set(true);
    this.currentUserEmail.set(response.email);
    this.currentUserRoles.set(this.decodeTokenRoles());
    this.socketService.connect();
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  private decodeTokenRoles(): string[] {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles ?? [];
    } catch {
      return [];
    }
  }
}
