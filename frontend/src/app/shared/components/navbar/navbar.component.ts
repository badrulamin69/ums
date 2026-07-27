import { Component, output, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationSocketService } from '../../../core/services/notification-socket.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <button class="btn-toggle" (click)="toggleSidebar.emit()">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="navbar-right">
        <div class="notification-bell" routerLink="/notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 6.667a5 5 0 10-10 0c0 5.833-2.5 7.5-2.5 7.5h15S15 12.5 15 6.667z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.442 17.5a1.667 1.667 0 01-2.884 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          @if (socketService.unreadCount > 0) {
            <span class="notification-badge">{{ socketService.unreadCount }}</span>
          }
        </div>

        <div class="user-menu" (click)="dropdownOpen.set(!dropdownOpen())" (clickOutside)="dropdownOpen.set(false)">
          <button class="user-button" (click)="$event.stopPropagation(); dropdownOpen.set(!dropdownOpen())">
            <div class="user-avatar">{{ userInitial }}</div>
            <span class="user-email">{{ auth.currentUserEmail() }}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" [style.transform]="dropdownOpen() ? 'rotate(180deg)' : ''">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          @if (dropdownOpen()) {
            <ul class="dropdown-menu" (click)="$event.stopPropagation()">
              <li><span class="dropdown-item-text text-secondary">{{ primaryRole }}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" routerLink="/student/profile" (click)="dropdownOpen.set(false)">Profile</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger" (click)="auth.logout(); dropdownOpen.set(false)">Sign Out</button></li>
            </ul>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      right: 0;
      left: var(--sidebar-width);
      height: var(--navbar-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--content-padding);
      background: rgba(11, 15, 20, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      z-index: 100;
      transition: left var(--duration-normal) var(--ease-out);
    }

    .btn-toggle {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);

      &:hover {
        color: var(--color-gold);
        background: var(--color-gold-dim);
      }
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .notification-bell {
      position: relative;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      transition: all var(--duration-fast) var(--ease-out);

      &:hover {
        color: var(--color-gold);
        background: var(--color-gold-dim);
      }
    }

    .notification-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      min-width: 16px;
      height: 16px;
      background: var(--color-danger);
      color: white;
      font-size: 10px;
      font-weight: 700;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      animation: pulse-gold 2s infinite;
    }

    .user-menu {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: none;
      border: 1px solid transparent;
      color: var(--color-text-primary);
      padding: 0.375rem 0.625rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);

      &:hover {
        background: var(--color-surface-elevated);
        border-color: var(--color-border);
      }
    }

    .user-button svg {
      transition: transform 0.2s ease;
      color: var(--color-text-muted);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-gold-dim);
      color: var(--color-gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--fs-small);
      font-weight: var(--fw-bold);
    }

    .user-email {
      font-size: var(--fs-small);
      color: var(--color-text-secondary);
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .navbar { left: 0; }
      .user-email { display: none; }
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      min-width: 180px;
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 200;
      padding: 0.375rem 0;
      animation: fadeInUp 0.15s var(--ease-out);
    }
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: var(--fs-small);
      color: var(--color-text-primary);
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      text-decoration: none;
      &:hover { background: var(--color-surface-elevated); color: var(--color-gold); }
    }
    .dropdown-item-text { padding: 0.5rem 1rem; font-size: var(--fs-xs); }
    .dropdown-divider { margin: 0.25rem 0; border-color: var(--color-border); }
    .text-danger { color: var(--color-danger) !important; }
    .text-secondary { color: var(--color-text-muted) !important; }
  `],
})
export class NavbarComponent {
  toggleSidebar = output();
  dropdownOpen = signal(false);

  @HostListener('document:click')
  onDocumentClick(): void {
    this.dropdownOpen.set(false);
  }

  constructor(
    public auth: AuthService,
    public socketService: NotificationSocketService,
  ) {}

  get userInitial(): string {
    const email = this.auth.currentUserEmail();
    return email ? email.charAt(0).toUpperCase() : '?';
  }

  get primaryRole(): string {
    const roles = this.auth.currentUserRoles();
    return roles[0] ?? 'User';
  }
}
