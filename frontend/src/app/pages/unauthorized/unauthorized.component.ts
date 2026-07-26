import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-page">
      <div class="card">
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <a routerLink="/" class="btn btn-primary">Go to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      text-align: center;
      padding: 3rem;
      max-width: 400px;
    }
    h1 { color: var(--danger); font-family: var(--font-serif); margin-bottom: 0.5rem; }
    p { color: var(--text-secondary); margin-bottom: 1.5rem; }
  `],
})
export class UnauthorizedComponent {}
