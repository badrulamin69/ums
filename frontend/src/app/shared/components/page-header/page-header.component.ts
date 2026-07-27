import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header animate-fade-in-up">
      <div class="header-info">
        <h1 class="page-title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="header-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
    }
    .page-title {
      font-family: var(--font-display);
      font-size: var(--fs-h1);
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: var(--color-text-muted);
      font-size: var(--fs-small);
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    @media (max-width: 640px) {
      .page-header { flex-direction: column; }
    }
  `],
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
}
