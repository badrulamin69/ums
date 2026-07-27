import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="public-layout">
      <header class="public-header">
        <div class="header-inner">
          <a routerLink="/" class="brand">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="var(--color-gold)"/>
              <path d="M14 34V14l10 7-10 7zm10-7l10 7V14l-10 7z" fill="var(--color-obsidian)"/>
            </svg>
            <span class="brand-text">Smart University</span>
          </a>
          <nav class="public-nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
            <a routerLink="/circulars" routerLinkActive="active" class="nav-link">Admissions</a>
            <a routerLink="/login" class="btn btn-outline-gold">Sign In</a>
          </nav>
        </div>
      </header>
      <main class="public-main">
        <router-outlet />
      </main>
      <footer class="public-footer">
        <div class="footer-inner">
          <p>&copy; 2026 Smart University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .public-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .public-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(11, 15, 20, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
    }
    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .brand-text {
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      color: var(--color-text-primary);
    }
    .public-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-link {
      font-size: var(--fs-small);
      font-weight: var(--fw-medium);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color var(--duration-fast) var(--ease-out);
      padding: 0.25rem 0;
      position: relative;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--color-gold);
    }
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-gold);
      border-radius: 1px;
    }
    .public-main {
      flex: 1;
    }
    .public-footer {
      border-top: 1px solid var(--color-border);
      padding: 1.5rem 0;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;
      font-size: var(--fs-small);
      color: var(--color-text-muted);
    }
  `],
})
export class PublicLayoutComponent {}
