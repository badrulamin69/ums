import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="badgeClass">
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge {
      font-family: var(--font-body);
      font-size: var(--fs-xs);
      font-weight: var(--fw-semibold);
      letter-spacing: 0.04em;
      padding: 0.25rem 0.625rem;
      border-radius: 999px;
      white-space: nowrap;
    }
  `],
})
export class StatusBadgeComponent {
  label = input.required<string>();
  type = input<'gold' | 'success' | 'danger' | 'warning' | 'info' | 'muted'>('muted');

  get badgeClass(): string {
    return `badge-${this.type()}`;
  }
}
