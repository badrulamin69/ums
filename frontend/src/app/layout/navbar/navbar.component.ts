import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/" class="navbar-brand">
          <span class="brand-icon">SU</span>
          <span class="brand-text">Smart University</span>
        </a>

        <div class="navbar-links" *ngIf="!isLoggedIn">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/faculties" routerLinkActive="active">Faculties</a>
          <a routerLink="/admission" routerLinkActive="active">Admission</a>
          <a routerLink="/notices" routerLinkActive="active">Notices</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </div>

        <div class="navbar-links" *ngIf="isLoggedIn">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        </div>

        <div class="navbar-actions">
          <ng-container *ngIf="!isLoggedIn">
            <a routerLink="/login" class="btn btn-outline btn-sm">Log In</a>
            <a routerLink="/register" class="btn btn-accent btn-sm">Apply Now</a>
          </ng-container>
          <ng-container *ngIf="isLoggedIn">
            <div class="notification-bell" routerLink="/notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span class="notification-count" *ngIf="unreadCount > 0">{{unreadCount}}</span>
            </div>
            <div class="user-menu" (click)="toggleMenu()">
              <span class="user-avatar">{{userInitials}}</span>
              <span class="user-name">{{userEmail}}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              <div class="dropdown" *ngIf="menuOpen">
                <a routerLink="/dashboard" (click)="menuOpen=false">Dashboard</a>
                <a routerLink="/profile" (click)="menuOpen=false">Profile</a>
                <hr />
                <a (click)="logout()" class="logout-link">Log Out</a>
              </div>
            </div>
          </ng-container>
        </div>

        <button class="mobile-toggle" (click)="mobileOpen = !mobileOpen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line *ngIf="!mobileOpen" x1="3" y1="6" x2="21" y2="6"/>
            <line *ngIf="!mobileOpen" x1="3" y1="12" x2="21" y2="12"/>
            <line *ngIf="!mobileOpen" x1="3" y1="18" x2="21" y2="18"/>
            <line *ngIf="mobileOpen" x1="6" y1="6" x2="18" y2="18"/>
            <line *ngIf="mobileOpen" x1="6" y1="18" x2="18" y2="6"/>
          </svg>
        </button>
      </div>

      <div class="mobile-menu" *ngIf="mobileOpen">
        <ng-container *ngIf="!isLoggedIn">
          <a routerLink="/" (click)="mobileOpen=false">Home</a>
          <a routerLink="/faculties" (click)="mobileOpen=false">Faculties</a>
          <a routerLink="/admission" (click)="mobileOpen=false">Admission</a>
          <a routerLink="/notices" (click)="mobileOpen=false">Notices</a>
          <a routerLink="/contact" (click)="mobileOpen=false">Contact</a>
          <hr />
          <a routerLink="/login" (click)="mobileOpen=false">Log In</a>
          <a routerLink="/register" (click)="mobileOpen=false" class="btn btn-accent">Apply Now</a>
        </ng-container>
        <ng-container *ngIf="isLoggedIn">
          <a routerLink="/dashboard" (click)="mobileOpen=false">Dashboard</a>
          <a routerLink="/profile" (click)="mobileOpen=false">Profile</a>
          <a (click)="logout()" class="logout-link">Log Out</a>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--primary);
      color: var(--text-inverse);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-md);
    }
    .navbar-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      height: 64px;
      gap: 2rem;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-inverse);
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-icon {
      background: var(--accent);
      color: var(--primary-dark);
      font-weight: 700;
      font-size: 0.875rem;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius);
    }
    .brand-text {
      font-family: var(--font-serif);
      font-weight: 700;
      font-size: 1.125rem;
    }
    .navbar-links {
      display: flex;
      gap: 0.25rem;
      flex: 1;
      a {
        color: rgba(255,255,255,0.75);
        padding: 0.5rem 0.875rem;
        border-radius: var(--radius);
        font-size: 0.875rem;
        font-weight: 500;
        transition: all var(--transition);
        &:hover, &.active {
          color: white;
          background: rgba(255,255,255,0.1);
        }
      }
    }
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .notification-bell {
      position: relative;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius);
      &:hover { background: rgba(255,255,255,0.1); }
      .notification-count {
        position: absolute;
        top: 2px;
        right: 2px;
        background: var(--urgent);
        color: white;
        font-size: 0.625rem;
        font-weight: 700;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
    }
    .user-menu {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.375rem 0.625rem;
      border-radius: var(--radius);
      &:hover { background: rgba(255,255,255,0.1); }
    }
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent);
      color: var(--primary-dark);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
    }
    .user-name {
      font-size: 0.8125rem;
      font-weight: 500;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
      min-width: 180px;
      overflow: hidden;
      z-index: 200;
      a {
        display: block;
        padding: 0.625rem 1rem;
        color: var(--text-primary);
        font-size: 0.875rem;
        &:hover { background: var(--bg-page); }
      }
      hr {
        border: none;
        border-top: 1px solid var(--border-light);
        margin: 0;
      }
      .logout-link {
        color: var(--danger);
        cursor: pointer;
      }
    }
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: white;
      padding: 0.5rem;
      cursor: pointer;
    }
    .mobile-menu {
      display: none;
      background: var(--primary-dark);
      padding: 1rem 1.5rem;
      a {
        display: block;
        color: rgba(255,255,255,0.85);
        padding: 0.625rem 0;
        font-size: 0.9375rem;
        &:hover { color: white; }
      }
      hr {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.1);
        margin: 0.5rem 0;
      }
      .logout-link { color: var(--urgent-light); cursor: pointer; }
    }
    @media (max-width: 768px) {
      .navbar-links, .navbar-actions { display: none; }
      .mobile-toggle { display: block; }
      .mobile-menu { display: block; }
    }
  `],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userEmail = '';
  userInitials = '';
  unreadCount = 0;
  menuOpen = false;
  mobileOpen = false;
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.authService.currentUser$.subscribe((user) => {
        this.isLoggedIn = !!user;
        this.userEmail = user?.email || '';
        this.userInitials = user ? user.email.substring(0, 2).toUpperCase() : '';
        if (this.isLoggedIn) {
          this.notificationService.getUnreadCount().subscribe({
            next: (res) => (this.unreadCount = res.data),
            error: () => {},
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.menuOpen = false;
    this.mobileOpen = false;
    this.authService.logout();
  }
}
